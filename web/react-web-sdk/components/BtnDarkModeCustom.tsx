import "../css/darkmode.css";
import { ChangeEventHandler, useState } from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import React from "react";

const setDark = () => {
  localStorage.setItem("theme", "dark");
  document.documentElement.setAttribute("data-theme", "dark");
};

const setLight = () => {
  localStorage.setItem("theme", "light");
  document.documentElement.setAttribute("data-theme", "light");
};

const storedTheme = localStorage.getItem("theme");

const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

const defaultDark = storedTheme === "dark" || (storedTheme === null && prefersDark);

if (defaultDark) {
  setDark();
}

const DarkMode = () => {
  const [mode, setMode] = useState(localStorage.getItem("theme") ?? "dark");
  const toggleTheme = () => {
    if (mode === "light") {
      setDark();
      setMode("dark");
    } else {
      setLight();
      setMode("light");
    }
  };
  return (
    <div onClick={toggleTheme} className="dark-mode-btn">
      {mode === "dark" ? <MoonIcon style={{ width: 25, height: 25 }} /> : <SunIcon style={{ width: 25, height: 25 }} />}
    </div>
  );
};

export default DarkMode;
