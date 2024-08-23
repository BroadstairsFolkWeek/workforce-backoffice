import React, { useCallback, useState } from "react";

import FormsView from "./FormsView";
import { draftAndDisplayWorkforceMail } from "../../services/mail";
import { Form } from "../../interfaces/form";

type FormsControllerProps = {
  forms: readonly Form[];
};

const filterValueByTerm = (
  value: string | undefined,
  termLc: string
): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  return value.toLowerCase().includes(termLc);
};

const filterFormsByTerm = (
  term: string,
  forms: readonly Form[]
): readonly Form[] => {
  if (term.length === 0) {
    return forms;
  }

  return forms.filter((data) => {
    const termLc = term.toLowerCase();
    return (
      filterValueByTerm(data.profile?.displayName, termLc) ||
      filterValueByTerm(data.profile?.email, termLc) ||
      filterValueByTerm(data.profile?.telephone, termLc) ||
      filterValueByTerm(data.profile?.address, termLc) ||
      filterValueByTerm(data.profile?.givenName, termLc) ||
      filterValueByTerm(data.profile?.surname, termLc)
    );
  });
};

const filterFormsBySubmissionStatus = (
  statuses: Set<Form["submissionStatus"]>,
  forms: readonly Form[]
) => {
  if (statuses.size === 0) {
    return forms;
  }

  return forms.filter((form) => statuses.has(form.submissionStatus));
};

const selectableStatusValues: Form["submissionStatus"][] = [
  "draft",
  "submittable",
  "submitted",
  "accepted",
];

const FormsController: React.FC<FormsControllerProps> = ({
  forms: formsFromRouteLoader,
}) => {
  const [forms, setForms] = useState(formsFromRouteLoader);

  const [filterString, setFilterString] = React.useState("");
  const [filteredForms, setFilteredForms] = React.useState<readonly Form[]>([]);

  const [filterSelectedStatuses, setFilterSelectedStatuses] = useState<
    Set<Form["submissionStatus"]>
  >(new Set());

  const [selectedForm, setSelectedForm] = useState<Form | undefined>();

  const [statusButtonActionRunning, setStatusButtonActionRunning] =
    useState(false);

  const updateForm = useCallback((updatedForm: Form) => {
    setForms((prevApplications) =>
      prevApplications.map((form) =>
        form.id === updatedForm.id ? updatedForm : form
      )
    );
  }, []);

  const clearSelectedApplication = useCallback(() => {
    setSelectedForm(undefined);
  }, []);

  const emailSelected = useCallback(
    async (_: string) => {
      await draftAndDisplayWorkforceMail(
        selectedForm?.profile?.email,
        selectedForm?.profile?.givenName || "",
        selectedForm?.profile?.surname || ""
      );
    },
    [selectedForm]
  );

  const setFormSubmissionStatus = useCallback(
    (newStatus: Form["submissionStatus"]) => {},
    []
  );

  // const setApplicationStatus = useCallback(
  //   async (newStatus: ApplicationStatus) => {
  //     if (selectedForm) {
  //       setStatusButtonActionRunning(true);
  //       const task = pipe(
  //         newStatus,
  //         apiSetApplicationStatusTE(selectedForm.applicationId)(
  //           selectedForm.version
  //         ),
  //         TE.match(
  //           (err) => {
  //             if (err === "conflict") {
  //               alert(
  //                 "Application status has been updated by another user. Please refresh the page."
  //               );
  //             } else if (err === "not-found") {
  //               alert(
  //                 "The server could not find the requested resource. Please refresh the page."
  //               );
  //             } else {
  //               alert(
  //                 "An error occurred. Please refresh the page and try again."
  //               );
  //             }
  //           },
  //           (result) => {
  //             setSelectedForm(result);
  //             updateForm(result);
  //           }
  //         )
  //       );
  //       await task();
  //       setStatusButtonActionRunning(false);
  //     }
  //   },
  //   [selectedForm, updateForm]
  // );

  React.useEffect(() => {
    setFilteredForms(
      filterFormsByTerm(
        filterString,
        filterFormsBySubmissionStatus(filterSelectedStatuses, forms)
      )
    );
  }, [filterString, filterSelectedStatuses, forms]);

  return (
    <FormsView
      forms={filteredForms}
      selectedForm={selectedForm}
      filterString={filterString}
      filterSelectedStatuses={filterSelectedStatuses}
      setFilterString={setFilterString}
      setFilterSelectedStatuses={setFilterSelectedStatuses}
      formSelected={setSelectedForm}
      clearSelectedForm={clearSelectedApplication}
      emailSelected={emailSelected}
      currentStatus={selectedForm?.submissionStatus || "draft"}
      statuses={selectableStatusValues}
      actionRunning={statusButtonActionRunning}
      setStatus={setFormSubmissionStatus}
    />
  );
};

export default FormsController;
