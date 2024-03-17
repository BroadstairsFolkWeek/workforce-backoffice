import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import InitialisedTeamsApp from "./components/InitialisedTeamsApp";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<InitialisedTeamsApp />);
