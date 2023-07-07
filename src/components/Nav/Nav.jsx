import React from "react";
import { FaMusic } from "react-icons/fa";
import { EVENTS, logFirebaseEvent } from "../../firebase";

const Nav = ({
  libraryStatus,
  setLibraryStatus,
  setIsDarkTheme,
  isDarkTheme,
}) => {
  return (
    <nav>
      <h1>iMusic</h1>
      <div style={{ zIndex: 5 }}>
        <button
          style={{ marginRight: "5px" }}
          onClick={() => {
            setIsDarkTheme((prev) => {
              localStorage.setItem(
                "isDarkTheme",
                prev === true ? "false" : "true",
              );
              return !prev;
            });
          }}
        >
          {isDarkTheme ? "Dark" : "Light"}
        </button>
        <button
          onClick={() => {
            logFirebaseEvent(EVENTS.CLICK.LIBRARY_ICON, "");
            setLibraryStatus(!libraryStatus);
          }}
        >
          Library
          <FaMusic style={{ marginLeft: "3px" }} />
        </button>
      </div>
    </nav>
  );
};

export default Nav;
