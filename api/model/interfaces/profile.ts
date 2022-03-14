export type AddableProfile = {
  profileId: string;
  displayName: string;
  email: string;
  givenName: string;
  surname: string;
  address: string;
  telephone: string;
};

export type UpdatableProfile = Partial<AddableProfile>;

export type PersistedProfile = AddableProfile & {
  dbId: number;
  lastSaved: string;
};
