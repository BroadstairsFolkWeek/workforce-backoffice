import * as E from "fp-ts/lib/Either";
import * as IOE from "fp-ts/lib/IOEither";

const config = {
  initiateLoginEndpoint: import.meta.env.VITE_REACT_APP_START_LOGIN_PAGE_URL,
  clientId: import.meta.env.VITE_REACT_APP_CLIENT_ID,
  apiEndpoint: import.meta.env.VITE_REACT_APP_FUNC_ENDPOINT,
};

export function getApiEndpoint(): IOE.IOEither<Error, string> {
  return () =>
    E.fromNullable(new Error("REACT_APP_FUNC_ENDPOINT is not set"))(
      config.apiEndpoint
    );
}

export default config;
