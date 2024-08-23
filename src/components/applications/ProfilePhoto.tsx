import { makeStyles } from "@fluentui/react-components";
import { Form } from "../../interfaces/form";

interface ProfilePhotoProps {
  form: Form;
  thumbnail: boolean;
}

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  form: application,
  thumbnail,
}) => {
  const classes = useStyles();

  if (!application.profile.metadata.photoUrl) {
    return null;
  }

  const srcUrl = thumbnail
    ? application.profile.metadata.photoThumbnailUrl
    : application.profile.metadata.photoUrl;

  return <img className={classes.root} src={srcUrl} alt="" loading="lazy" />;
};

export default ProfilePhoto;
