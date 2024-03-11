import { Image, makeStyles } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { useApplications } from "./ApplicationsContextProvider";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

const ProfilePhoto: React.FC<{ photoId: string }> = ({ photoId }) => {
  const classes = useStyles();
  const { getPhoto } = useApplications();
  const [photoDataSrcUrl, setPhotoDataSrcUrl] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    getPhoto(photoId).then((dataSrcUrl) => setPhotoDataSrcUrl(dataSrcUrl));
  }, [getPhoto, photoId]);

  return <Image className={classes.root} src={photoDataSrcUrl} />;
};

export default ProfilePhoto;
