import React from "react";
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import Brightness7RoundedIcon from "@mui/icons-material/Brightness7Rounded";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

type Theme = "light" | "dark";

interface Props {
  theme: Theme;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
}

function DarkmodeBtn({ theme, onClick, style }: Props) {
  const Button = () => {
    return theme === "light" ? (
      <Brightness4RoundedIcon />
    ) : (
      <Brightness7RoundedIcon />
    );
  };

  return (
    <ListItem
      style={style ?? { margin: 5, borderRadius: 4, width: "auto" }}
      button
      onClick={onClick}
    >
      <ListItemIcon>{Button()}</ListItemIcon>
      <ListItemText primary={theme === "light" ? "Dark Mode" : "Light Mode"} />
    </ListItem>
  );
}

export default DarkmodeBtn;
