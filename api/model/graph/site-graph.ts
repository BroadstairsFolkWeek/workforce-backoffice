import * as E from "fp-ts/lib/Either";
import * as IO from "fp-ts/lib/IO";
import * as IOE from "fp-ts/lib/IOEither";
import * as IOO from "fp-ts/lib/IOOption";
import * as TE from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";

import { Site } from "@microsoft/microsoft-graph-types";
import {
  getFromGraphClient,
  getOboGraphClient,
  getOboGraphClientIO,
} from "../../services/graph-client";
import { logTrace } from "../../utilities/logging";
import config from "../../config";

const cache: { [groupId: string]: string } = {};

export const getSiteBaseApiPath = async () => {
  logTrace("In site-graph: getSiteBaseApiPathForCurrentGroup");
  const groupId = config.groupId;

  if (cache[groupId]) {
    logTrace(
      `Returning cached base API path for group ${groupId}: ${cache[groupId]}`
    );
    return cache[groupId];
  } else {
    const graphClient = getOboGraphClient();
    const lookupGroupRootSiteByPath = `/groups/${groupId}/sites/root`;
    logTrace(
      "Looking up group root site via Graph: " + lookupGroupRootSiteByPath
    );
    const groupRootSite: Site = await graphClient
      .api(lookupGroupRootSiteByPath)
      .get();

    const siteBaseApiPath = `/sites/${groupRootSite.id}`;
    cache[groupId] = siteBaseApiPath;
    logTrace(
      `Returning base API path for group ${groupId}: ${siteBaseApiPath}`
    );
    return siteBaseApiPath;
  }
};

const getGroupIdIOEither = (): IOE.IOEither<Error, string> => {
  logTrace("In site-graph: getSiteBaseApiPathForCurrentGroup");
  const groupId = config.groupId;

  if (groupId) {
    return IOE.right(groupId);
  } else {
    return IOE.left(new Error("Group ID not found in config"));
  }
};

const getCachedSiteBaseApiPathIOO = (groupId: string): IOO.IOOption<string> => {
  if (cache[groupId]) {
    logTrace(
      `Returning cached base API path for group ${groupId}: ${cache[groupId]}`
    );
    return IOO.some(cache[groupId]);
  } else {
    return IOO.none;
  }
};

const getCachedSiteBaseApiPathIOEither = (
  groupId: string
): IOE.IOEither<"cache-miss", string> => {
  return pipe(
    groupId,
    getCachedSiteBaseApiPathIOO,
    IO.map(E.fromOption(() => "cache-miss" as const))
  );
};

const getCachedSiteBaseApiPathTE = (
  groupId: string
): TE.TaskEither<"cache-miss", string> =>
  TE.fromIOEitherK(getCachedSiteBaseApiPathIOEither)(groupId);

const setCachedSiteBaseApiPathIO =
  (groupId: string) =>
  (siteBaseApiPath: string): IO.IO<string> => {
    cache[groupId] = siteBaseApiPath;
    return IO.of(siteBaseApiPath);
  };

const lookupSiteBaseApiPathTE = (groupId: string) => {
  return pipe(
    getOboGraphClientIO(),
    TE.fromIO,
    TE.chain(getFromGraphClient(`/groups/${groupId}/sites/root`)),
    TE.map((groupRootSite: Site) => `/sites/${groupRootSite.id}`)
  );
};

const getCachedOrLookupSiteBaseApiPathTE = (groupId: string) => {
  return pipe(
    groupId,
    getCachedSiteBaseApiPathTE,
    TE.orElse(lookupSiteBaseApiPathTE)
  );
};

export const getSiteBaseApiPathTE = flow(
  getGroupIdIOEither,
  TE.fromIOEither,
  TE.bindTo("groupId"),
  TE.bind("siteBaseApiPath", ({ groupId }) =>
    getCachedOrLookupSiteBaseApiPathTE(groupId)
  ),
  TE.chainFirstIOK(({ groupId, siteBaseApiPath }) =>
    setCachedSiteBaseApiPathIO(groupId)(siteBaseApiPath)
  ),
  TE.map(({ siteBaseApiPath }) => siteBaseApiPath)
);
