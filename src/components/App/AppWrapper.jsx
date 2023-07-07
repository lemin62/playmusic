import React, { useMemo, useState } from "react";
import App from "./App";

const AppWrapper = () => {
  const localIsDarkTheme = useMemo(
    () => (localStorage.getItem("isDarkTheme") === "true" ? true : false),
    [localStorage],
  );

  const [isDarkTheme, setIsDarkTheme] = useState(localIsDarkTheme);
  return (
    <div style={{ background: isDarkTheme ? "#222026" : "white" }}>
      <App isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
    </div>
  );
};

export default AppWrapper;
