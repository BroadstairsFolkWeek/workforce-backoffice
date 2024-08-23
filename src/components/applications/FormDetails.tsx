import { FC } from "react";
import {
  Button,
  Text,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";
import { tokens } from "@fluentui/react-theme";
import FormAvailabilityIndicator from "./FormAvailabilityIndicator";
import ProfilePhoto from "./ProfilePhoto";
import StatusSelection, { StatusSelectionProps } from "./StatusSelection";
import { Form } from "../../interfaces/form";

export type FormDetailsProps = StatusSelectionProps<
  Form["submissionStatus"]
> & {
  form: Form;
  emailSelected: (email: string) => void;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  },

  actionsSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  personalDetailsSection: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    columnGap: "1rem",
  },
  photoCell: {
    height: "240px",
    width: "200px",
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "start",
  },
  img: {
    // Set the photo image to a very small height and utilise flexGrow to fill any remaining space in the cell.
    height: "1%",
    flexGrow: 1,
  },
  availabilityIndicator: {
    height: "25px",
  },

  personalDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "110px 1fr",
    "& > :nth-child(4n+1), & > :nth-child(4n+2)": {
      backgroundColor: tokens.colorNeutralBackground3,
    },
    "& > :nth-child(4n+3), & > :nth-child(4n+4)": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
    "& > *": {
      ...shorthands.padding("4px"),
    },
  },

  applicationDetailsSection: {
    display: "grid",
  },
  applicationDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "150px 1fr",
    "& > :nth-child(4n+1), & > :nth-child(4n+2)": {
      backgroundColor: tokens.colorNeutralBackground3,
    },
    "& > :nth-child(4n+3), & > :nth-child(4n+4)": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
    "& > *": {
      ...shorthands.padding("4px"),
    },
  },

  metadataSection: {
    display: "grid",
  },
  metaDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "150px 1fr",
    "& > :nth-child(4n+1), & > :nth-child(4n+2)": {
      backgroundColor: tokens.colorNeutralBackground3,
    },
    "& > :nth-child(4n+3), & > :nth-child(4n+4)": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
    "& > *": {
      ...shorthands.padding("4px"),
    },
  },
});

const FormDetails: FC<FormDetailsProps> = ({
  form,
  emailSelected,
  ...statusSelectProps
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.actionsSection}>
        <StatusSelection {...statusSelectProps} />
      </div>
      <div className={classes.personalDetailsSection}>
        <div className={classes.photoCell}>
          <div className={classes.img}>
            {form.profile.metadata.photoUrl ? (
              <ProfilePhoto form={form} thumbnail={false} />
            ) : null}
          </div>
          <div className={classes.availabilityIndicator}>
            <FormAvailabilityIndicator form={form} />
          </div>
        </div>
        <div className={classes.personalDetailsGrid}>
          <Text>Given name</Text>
          <Text>{form.profile?.givenName}</Text>
          <Text>Surname</Text>
          <Text>{form.profile?.surname}</Text>
          <Text>Display name</Text>
          <Text>{form.profile?.displayName}</Text>
          <Text>Address</Text>
          <Text style={{ whiteSpace: "pre-line" }}>
            {form.profile?.address}
          </Text>
          <Text>Email</Text>
          <div>
            <div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (form.profile?.email) {
                    emailSelected(form.profile.email);
                  }
                }}
              >
                {form.profile?.email}
              </Button>
            </div>
          </div>
          <Text>Telephone</Text>
          <Text>{form.profile?.telephone}</Text>
          <Text>Age group</Text>
          {/* <Text>{form.ageGroup}</Text> */}
        </div>
      </div>
      <div className={classes.applicationDetailsSection}>
        <div className={classes.applicationDetailsGrid}>
          {/* <Text>Accepted T&Cs</Text>
          <Text>{form.acceptedTermsAndConditions ? "Yes" : "No"}</Text> */}

          {/* <Text>Emergency contact</Text>
          <div>
            <div>
              <Text>{form.emergencyContactName}</Text>
            </div>
            <div>
              <Text>{form.emergencyContactTelephone}</Text>
            </div>
          </div> */}

          {/* <Text>Previous volunteer</Text>
          <div>
            <div>
              <Text>{form.previousVolunteer ? "Yes" : "No"}</Text>
            </div>
            <div>
              <Text>{form.previousTeam}</Text>
            </div>
          </div> */}

          {/* <Text>First aid certificate</Text>
          <Text>{form.firstAidCertificate ? "Yes" : "No"}</Text>

          <Text>Occupation / Skills</Text>
          <Text>{form.occupationOrSkills}</Text> */}

          {/* {form.dbsDisclosureNumber ? (
            <>
              <Text>DBS disclosure number/date</Text>
              <div>
                <div>
                  <Text>{form.dbsDisclosureNumber}</Text>
                </div>
                <div>
                  <Text>{form.dbsDisclosureDate}</Text>
                </div>
              </div>
            </>
          ) : null} */}

          {/* <Text>Camping required</Text>
          <Text>{form.camping ? "Yes" : "No"}</Text>

          <Text>Tshirt size</Text>
          <Text>{form.tShirtSize}</Text>

          <Text>Other information</Text>
          <Text>{form.otherInformation}</Text> */}

          {/* <Text>Requested teams</Text>
          <div>
            <div>
              <Text>{form.teamPreference1}</Text>
            </div>
            <div>
              <Text>{form.teamPreference2}</Text>
            </div>
            <div>
              <Text>{form.teamPreference3}</Text>
            </div>
          </div> */}

          {/* <Text>Requested people</Text>
          <Text>{form.personsPreference}</Text> */}

          {/* <Text>Constraints</Text>
          <Text>{form.constraints}</Text> */}

          {/* <Text>Join WhatsApp group</Text>
          <Text>{form.whatsApp ? "Yes" : "No"}</Text> */}

          {/* <Text>Consent NewLife Wills</Text>
          <Text>{form.consentNewlifeWills ? "Yes" : "No"}</Text> */}
        </div>
      </div>
      <div className={classes.metadataSection}>
        <div className={classes.metaDetailsGrid}>
          <Text size={100}>Application ID</Text>
          <Text size={100}>{form.id}</Text>

          <Text size={100}>Profile ID</Text>
          <Text size={100}>{form.profileId}</Text>

          <Text size={100}>Photo ID</Text>
          <Text size={100}>{form.profile.metadata.photoId}</Text>

          <Text size={100}>Created</Text>
          <Text size={100}>{form.createdDateTimeUtc.toLocaleString()}</Text>

          <Text size={100}>Modified</Text>
          <Text size={100}>{form.modifiedDateTimeUtc.toLocaleString()}</Text>
        </div>
      </div>
    </div>
  );
};

export default FormDetails;
