import { Image } from "@fluentui/react-northstar";
import { useEffect, useState } from "react";
import { getPhoto } from "../model/profile-photo-repository";

const ProfilePhoto: React.FC<{ photoId: string; groupId: string }> = ({
  photoId,
  groupId,
}) => {
  const [photoDataSrcUrl, setPhotoDataSrcUrl] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    getPhoto(groupId, photoId).then((dataSrcUrl) =>
      setPhotoDataSrcUrl(dataSrcUrl)
    );
  }, [photoId, groupId]);

  return (
    <Image
      fluid
      src={photoDataSrcUrl}
      avatar
      styles={{ maxHeight: "100%", maxWidth: "100%" }}
    />
  );
};

export default ProfilePhoto;
