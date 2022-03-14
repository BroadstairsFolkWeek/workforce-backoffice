import { FileContentWithInfo } from "../interfaces/file";
import { getProfilePhotoFileByPhotoId } from "../model/graph/photos-graph";

const PROFILE_SERVICE_ERROR_TYPE_VAL =
  "profile-service-error-b2facf8d-038c-449b-8e24-d6cfe6680bd4";

type ProfileServiceErrorType = "version-conflict" | "missing-user-profile";

export class ProfileServiceError {
  private type: typeof PROFILE_SERVICE_ERROR_TYPE_VAL =
    PROFILE_SERVICE_ERROR_TYPE_VAL;
  public error: ProfileServiceErrorType;
  public arg1: any | null;

  constructor(error: ProfileServiceErrorType, arg1?: any) {
    this.error = error;
    this.arg1 = arg1 ?? null;
  }
}

export function isProfileServiceError(obj: any): obj is ProfileServiceError {
  return obj?.type === PROFILE_SERVICE_ERROR_TYPE_VAL;
}

export const getProfilePicture = async (
  combinedPhotoId: string
): Promise<FileContentWithInfo | null> => {
  const [, photoId] = combinedPhotoId.split(":");
  const getPhotoResult = await getProfilePhotoFileByPhotoId(photoId);
  if (!getPhotoResult) {
    return null;
  }

  const [filename, content, mimeType] = getPhotoResult;
  return {
    filename,
    content,
    mimeType,
  };
};
