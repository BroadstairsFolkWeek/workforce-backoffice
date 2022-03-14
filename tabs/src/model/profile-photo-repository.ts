import { callApiGet } from "../services/api-access";

export const getPhoto = async (
  groupId: string,
  photoId: string
): Promise<string> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("id", photoId);
    const photoData = await callApiGet(
      "profilePhoto",
      groupId,
      searchParams,
      "blob"
    );
    const dataSrcUrl = URL.createObjectURL(photoData);
    return dataSrcUrl;
  } catch (err) {
    throw err;
  }
};
