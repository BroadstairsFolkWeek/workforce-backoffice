import React from "react";
import {
  Button,
  Divider,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  makeStyles,
  OverlayDrawer,
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";

import FormsList from "./FormsList";
import FormsHeaderView from "./FormsHeaderView";
import FormDetails, { FormDetailsProps } from "./FormDetails";
import { Form } from "../../interfaces/form";

type FormsViewProps = Omit<FormDetailsProps, "form"> & {
  forms: readonly Form[];
  selectedForm: Form | undefined;
  filterString: string;
  filterSelectedStatuses: Set<Form["submissionStatus"]>;
  setFilterString: (s: string) => void;
  setFilterSelectedStatuses: (statuses: Set<Form["submissionStatus"]>) => void;
  formSelected: (form: Form) => void;
  clearSelectedForm: () => void;
  emailSelected: (email: string) => void;
};

const useStyles = makeStyles({
  root: {
    height: "98%",
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  },
  drawerBody: {
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  },
});

const FormsView: React.FC<FormsViewProps> = ({
  forms,
  selectedForm,
  filterString,
  filterSelectedStatuses,
  setFilterString,
  setFilterSelectedStatuses,
  formSelected,
  clearSelectedForm,
  ...applicationDetailsProps
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FormsHeaderView
        filterString={filterString}
        filterSelectedStatuses={filterSelectedStatuses}
        counterValue={forms.length}
        setFilterString={setFilterString}
        setFilterSelectedStatuses={setFilterSelectedStatuses}
      />

      <Divider />

      <FormsList
        forms={forms}
        selectedForm={selectedForm}
        formSelected={formSelected}
        clearSelectedForm={clearSelectedForm}
      />

      {selectedForm ? (
        <OverlayDrawer
          size="medium"
          position="end"
          open={true}
          onOpenChange={() => clearSelectedForm()}
        >
          <DrawerHeader>
            <DrawerHeaderTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={() => clearSelectedForm()}
                />
              }
            >
              {selectedForm.profile?.givenName} {selectedForm.profile?.surname}
            </DrawerHeaderTitle>
          </DrawerHeader>
          <DrawerBody className={classes.drawerBody}>
            <FormDetails {...applicationDetailsProps} form={selectedForm} />
          </DrawerBody>
        </OverlayDrawer>
      ) : null}
    </div>
  );
};

export default FormsView;
