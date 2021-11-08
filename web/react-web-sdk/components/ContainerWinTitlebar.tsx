import React from "react";
import "../css/titlebar.css";
interface Props {
  children: JSX.Element[];
  platform: NodeJS.Platform;
}
export default function ContainerTitlebar({ children, platform }: Props) {
  return (
    <div className={`titlebar-container titlebar-${platform}`}>{children}</div>
  );
}
