import {
  AddableListItem,
  MakeUpdatable,
  PersistedListItem,
  UpdatableListItem,
} from "./sp-items";

interface ProfileListItem {
  ProfileId: string;
  Email?: string;
  GivenName?: string;
  Surname?: string;
  Address?: string;
  Telephone?: string;
}

export type AddableProfileListItem = AddableListItem & ProfileListItem;

export type UpdatableProfileListItem = UpdatableListItem &
  MakeUpdatable<ProfileListItem>;

export type PersistedProfileListItem = PersistedListItem & ProfileListItem;
