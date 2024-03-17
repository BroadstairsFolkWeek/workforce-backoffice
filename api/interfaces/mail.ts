export interface DraftMailRequest {
  recipient: {
    emailAddress: string;
    givenName: string;
    surname: string;
  };
}

export interface DraftMailResult {
  draftMailUrl: string;
}
