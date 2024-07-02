import * as t from "io-ts";

// Set of fields that are optional for a profile.
const profilePartialFields = {
  displayName: t.string,
  email: t.string,
  givenName: t.string,
  surname: t.string,
  address: t.string,
  telephone: t.string,
  photoUrl: t.string,
};

// Set of fields that must be present for a profile.
const profileRequiredFields = {};

const profileMetadata = {
  profileId: t.string,
};

// Profile type that is a combination of the optional and required fields.
export const Profile = t.intersection([
  t.partial(profilePartialFields),
  t.type(profileRequiredFields),
  t.type(profileMetadata),
]);

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Profile = t.TypeOf<typeof Profile>;
