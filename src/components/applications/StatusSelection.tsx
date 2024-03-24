import { PropsWithChildren, useMemo, useState } from "react";
import {
  Menu,
  MenuButtonProps,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  SplitButton,
  makeStyles,
} from "@fluentui/react-components";

export type StatusSelectionProps<T> = {
  currentStatus: T;
  statuses: T[];
  actionRunning: boolean;
  setStatus: (newStatus: T) => void;
};

const useStyles = makeStyles({
  root: {},
});

function StatusSelection<T>({
  currentStatus,
  statuses,
  actionRunning,
  setStatus,
}: PropsWithChildren<StatusSelectionProps<T>>) {
  const classes = useStyles();

  const [lastCurrentStatus, setLastCurrentStatus] = useState<T | undefined>(
    undefined
  );
  const [selectedStatus, setSelectedStatus] = useState<T>(currentStatus);

  const menuItemElements = useMemo(() => {
    return statuses.map((status) => (
      <MenuItem key={`${status}`} onClick={() => setSelectedStatus(status)}>
        {`${status}`}
      </MenuItem>
    ));
  }, [statuses]);

  if (currentStatus !== lastCurrentStatus) {
    setSelectedStatus(currentStatus);
    setLastCurrentStatus(currentStatus);
  }

  return (
    <div className={classes.root}>
      {actionRunning ? (
        <Spinner label="Updating status..." />
      ) : (
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            {(triggerProps: MenuButtonProps) => (
              <SplitButton
                menuButton={triggerProps}
                primaryActionButton={{
                  onClick: () => {
                    if (currentStatus !== selectedStatus) {
                      setStatus(selectedStatus);
                    }
                  },
                }}
              >
                {currentStatus === selectedStatus
                  ? `${currentStatus}`
                  : `Set status to ${selectedStatus}`}
              </SplitButton>
            )}
          </MenuTrigger>

          <MenuPopover>
            <MenuList>{menuItemElements}</MenuList>
          </MenuPopover>
        </Menu>
      )}
    </div>
  );
}

export default StatusSelection;
