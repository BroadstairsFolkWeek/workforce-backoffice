import { Data, Effect } from "effect";
import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { ResponseError } from "@effect/platform/HttpClientError";

import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as IOE from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/function";
import { empty } from "fp-ts-std/URLSearchParams";
import { modifyParams } from "fp-ts-std/URL";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  ResponseType,
} from "axios";
import { URLSearchParams } from "url";

import {
  getTeamsUserCredential,
  getTeamsUserCredentialEffect,
  getTeamsUserCredentialIOE,
} from "../services/teams-app";

import { DraftMailResult } from "../../api/interfaces/mail";
import { getApiEndpoint, getApiEndpointEffect } from "../components/config";

export class NotAuthenticated extends Data.TaggedClass("NotAuthenticated") {}

export class VersionConflict extends Data.TaggedClass("VersionConflict") {}

export class ServerError extends Data.TaggedClass("ServerError")<{
  responseError: ResponseError;
}> {}

const getAccessTokenEffect = () =>
  getTeamsUserCredentialEffect()
    .pipe(
      Effect.andThen((tuc) =>
        Effect.tryPromise({
          try: () => tuc.getToken(""),
          catch: (error) => new NotAuthenticated(),
        })
      ),
      Effect.andThen((token) => Effect.fromNullable(token)),
      Effect.andThen((at) => at.token)
    )
    .pipe(
      Effect.catchTags({
        NoSuchElementException: () => Effect.fail(new NotAuthenticated()),
      })
    );

export const apiGetJson = (path: string) =>
  Effect.all([getAccessTokenEffect(), getUrlEffect(path)]).pipe(
    Effect.andThen(([accessToken, url]) =>
      HttpClientRequest.get(url).pipe(
        HttpClientRequest.bearerToken(accessToken),
        HttpClient.fetchOk,
        HttpClientResponse.json
      )
    )
  );

const getAccessToken = (): TE.TaskEither<Error, string> => {
  return pipe(
    getTeamsUserCredentialIOE(),
    TE.fromIOEither,
    TE.chain(TE.tryCatchK((tuc) => tuc.getToken(""), E.toError)),
    TE.chainEitherKW(E.fromNullable(new Error("No access token"))),
    TE.map((accessToken) => accessToken.token)
  );
};

const buildFullEndpointPath = (path: string) => (apiEndpoint: string) =>
  `${apiEndpoint}/api/${path}`;

const getUrl = (path: string) =>
  pipe(
    getApiEndpoint(),
    IOE.map(buildFullEndpointPath(path)),
    IOE.map((href) => new URL(href))
  );

const getUrlEffect = (path: string) =>
  getApiEndpointEffect().pipe(
    Effect.andThen(buildFullEndpointPath(path)),
    Effect.andThen((href) => new URL(href))
  );

const applySearchParamsToUrl =
  (urlSearchParams?: URLSearchParams) => (url: URL) =>
    pipe(
      url,
      modifyParams(() => urlSearchParams || empty)
    );

const getUrlWithSearchParams =
  (path: string) => (urlSearchParams?: URLSearchParams) =>
    pipe(getUrl(path), IOE.map(applySearchParamsToUrl(urlSearchParams)));

const doAxiosRequest = <ResponseDataType = any>(
  requestConfig: AxiosRequestConfig
): TE.TaskEither<Error | AxiosError, AxiosResponse<ResponseDataType>> =>
  TE.tryCatch(
    () => axios.request<ResponseDataType>(requestConfig),
    (error) =>
      axios.isAxiosError(error) ? (error as AxiosError) : E.toError(error)
  );

export const commonAxiosErrorMapping = (error: Error | AxiosError) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      return "not-found";
    }
    if (error.response?.status === 409) {
      return "conflict";
    }
  }
  return error;
};

const callApiTE =
  (method: "GET" | "POST" | "PATCH") =>
  <ResponseDataType = any>(
    path: string,
    body?: any,
    urlSearchParams?: URLSearchParams,
    responseType: ResponseType = "json"
  ): TE.TaskEither<Error | AxiosError, ResponseDataType> => {
    return pipe(
      getUrlWithSearchParams(path)(urlSearchParams),
      IOE.bindTo("url"),
      TE.fromIOEither,
      TE.bind("accessToken", () => getAccessToken()),
      TE.map(
        ({ url, accessToken }) =>
          ({
            url: url.href,
            method,
            headers: {
              authorization: "Bearer " + accessToken,
            },
            data: body,
            responseType,
          } as AxiosRequestConfig)
      ),
      TE.chain(doAxiosRequest<ResponseDataType>),
      TE.map((response) => response.data)
    );
  };

const callApi = async <ResponseDataType = any>(
  method: "GET" | "POST" | "PATCH",
  functionName: string,
  body?: any,
  urlSearchParams?: URLSearchParams,
  responseType: ResponseType = "json"
) => {
  const teamsUserCredential = getTeamsUserCredential();

  if (teamsUserCredential) {
    try {
      const accessToken = await teamsUserCredential.getToken("");

      const url = new URL(config.apiEndpoint + "/api/" + functionName);
      if (urlSearchParams) {
        urlSearchParams.forEach((value, name) =>
          url.searchParams.append(name, value)
        );
      }

      const requestConfig: AxiosRequestConfig = {
        url: url.href,
        method,
        headers: {
          authorization: "Bearer " + accessToken?.token || "",
        },
        data: body,
        responseType,
      };

      const response = await axios.request<ResponseDataType>(requestConfig);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        let funcErrorMsg = "";

        if (err?.response?.status === 404) {
          funcErrorMsg = `There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "Teams: Deploy to the cloud") first before running this App`;
        } else if (err.message === "Network Error") {
          funcErrorMsg =
            "Cannot call Azure Function due to network error, please check your network connection status and ";
          if (err.config?.url && err.config.url.indexOf("localhost") >= 0) {
            funcErrorMsg += `make sure to start Azure Function locally (Run "npm run start" command inside api folder from terminal) first before running this App`;
          } else {
            funcErrorMsg += `make sure to provision and deploy Azure Function (Run command palette "Teams: Provision in the cloud" and "Teams: Deploy to the cloud) first before running this App`;
          }
        } else {
          funcErrorMsg = err.message;
          if (err.response?.data?.error) {
            funcErrorMsg += ": " + err.response.data.error;
          }
        }

        throw new Error(funcErrorMsg);
      }
      throw err;
    }
  } else {
    throw new Error("No Teams User Credential");
  }
};

export const callApiGet = <ResponseDataType = any>(
  functionName: string,
  urlSearchParams?: URLSearchParams,
  responseType: ResponseType = "json"
) => {
  return callApi<ResponseDataType>(
    "GET",
    functionName,
    undefined,
    urlSearchParams,
    responseType
  );
};

export const callApiPost = <ResponseDataType = any>(
  functionName: string,
  body?: any,
  urlSearchParams?: URLSearchParams,
  responseType: ResponseType = "json"
) => {
  return callApi<ResponseDataType>(
    "POST",
    functionName,
    body,
    urlSearchParams,
    responseType
  );
};

export const callApiGetTE = callApiTE("GET");
export const callApiPostTE = callApiTE("POST");
export const callApiPatchTE = callApiTE("PATCH");

export const apiDraftWorkforceMail = async (
  emailAddress: any,
  givenName: string,
  surname: string
) => {
  const result = await callApiPost<DraftMailResult>("draftMail", {
    recipient: {
      emailAddress: emailAddress,
      givenName: givenName,
      surname: surname,
    },
  });
  return result.draftMailUrl;
};
