import React from "react";
import { createRoot } from "react-dom/client";
import AppWrapper from "./components/App/AppWrapper";

const container = document.getElementById("root");
// @ts-ignore
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<AppWrapper />);
