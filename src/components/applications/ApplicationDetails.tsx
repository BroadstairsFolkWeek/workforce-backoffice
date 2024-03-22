import { FC } from "react";
import {
  Button,
  Text,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";
import { tokens } from "@fluentui/react-theme";
import ApplicationAvailabilityIndicator from "./ApplicationAvailabilityIndicator";
import ProfilePhoto from "./ProfilePhoto";
import { ApplicationData } from "../../interfaces/application-data";

type ApplicationsDetailsProps = {
  application: ApplicationData;
  emailSelected: (email: string) => void;
  testSelected: () => void;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
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

  idsSection: {
    display: "grid",
  },
  idsDetailsGrid: {
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

const ApplicationsDetails: FC<ApplicationsDetailsProps> = ({
  application,
  emailSelected,
  testSelected,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button onClick={testSelected}>Test</Button>
      <div className={classes.personalDetailsSection}>
        <div className={classes.photoCell}>
          <div className={classes.img}>
            {application.photoId ? (
              <ProfilePhoto photoId={application.photoId} />
            ) : null}
          </div>
          <div className={classes.availabilityIndicator}>
            <ApplicationAvailabilityIndicator application={application} />
          </div>
        </div>
        <div className={classes.personalDetailsGrid}>
          <Text>Given name</Text>
          <Text>{application.profile?.givenName}</Text>
          <Text>Surname</Text>
          <Text>{application.profile?.surname}</Text>
          <Text>Display name</Text>
          <Text>{application.profile?.displayName}</Text>
          <Text>Address</Text>
          <Text style={{ whiteSpace: "pre-line" }}>
            {application.profile?.address}
          </Text>
          <Text>Email</Text>
          <div>
            <div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (application.profile?.email) {
                    emailSelected(application.profile.email);
                  }
                }}
              >
                {application.profile?.email}
              </Button>
            </div>
          </div>
          <Text>Telephone</Text>
          <Text>{application.profile?.telephone}</Text>
          <Text>Age group</Text>
          <Text>{application.ageGroup}</Text>
        </div>
      </div>
      <div className={classes.applicationDetailsSection}>
        <div className={classes.applicationDetailsGrid}>
          <Text>Accepted T&Cs</Text>
          <Text>{application.acceptedTermsAndConditions ? "Yes" : "No"}</Text>

          <Text>Emergency contact</Text>
          <div>
            <div>
              <Text>{application.emergencyContactName}</Text>
            </div>
            <div>
              <Text>{application.emergencyContactTelephone}</Text>
            </div>
          </div>

          <Text>Previous volunteer</Text>
          <div>
            <div>
              <Text>{application.previousVolunteer ? "Yes" : "No"}</Text>
            </div>
            <div>
              <Text>{application.previousTeam}</Text>
            </div>
          </div>

          <Text>First aid certificate</Text>
          <Text>{application.firstAidCertificate ? "Yes" : "No"}</Text>

          <Text>Occupation / Skills</Text>
          <Text>{application.occupationOrSkills}</Text>

          {application.dbsDisclosureNumber ? (
            <>
              <Text>DBS disclosure number/date</Text>
              <div>
                <div>
                  <Text>{application.dbsDisclosureNumber}</Text>
                </div>
                <div>
                  <Text>{application.dbsDisclosureDate}</Text>
                </div>
              </div>
            </>
          ) : null}

          <Text>Camping required</Text>
          <Text>{application.camping ? "Yes" : "No"}</Text>

          <Text>Tshirt size</Text>
          <Text>{application.tShirtSize}</Text>

          <Text>Other information</Text>
          <Text>{application.otherInformation}</Text>

          <Text>Requested teams</Text>
          <div>
            <div>
              <Text>{application.teamPreference1}</Text>
            </div>
            <div>
              <Text>{application.teamPreference2}</Text>
            </div>
            <div>
              <Text>{application.teamPreference3}</Text>
            </div>
          </div>

          <Text>Requested people</Text>
          <Text>{application.personsPreference}</Text>

          <Text>Constraints</Text>
          <Text>{application.constraints}</Text>

          <Text>Join WhatsApp group</Text>
          <Text>{application.whatsApp ? "Yes" : "No"}</Text>

          <Text>Consent NewLife Wills</Text>
          <Text>{application.consentNewlifeWills ? "Yes" : "No"}</Text>
        </div>
      </div>
      <div className={classes.idsSection}>
        <div className={classes.idsDetailsGrid}>
          <Text size={100}>Application ID</Text>
          <Text size={100}>{application.applicationId}</Text>

          <Text size={100}>Profile ID</Text>
          <Text size={100}>{application.profileId}</Text>

          <Text size={100}>Photo ID</Text>
          <Text size={100}>{application.photoId}</Text>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsDetails;
