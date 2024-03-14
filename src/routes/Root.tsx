import { Outlet } from "react-router-dom";
import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { useContext, useMemo } from "react";
import { TeamsFxContext } from "../components/Context";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    width: "98vw",
  },
});

const Root: React.FC = () => {
  const { themeString } = useContext(TeamsFxContext);
  const classes = useStyles();

  const themeClass = useMemo(
    () =>
      themeString === "default"
        ? "light"
        : themeString === "dark"
        ? "dark"
        : "contrast",
    [themeString]
  );

  return (
    <div className={mergeClasses(classes.root, themeClass)}>
      <Outlet />
    </div>
  );
};

export default Root;
