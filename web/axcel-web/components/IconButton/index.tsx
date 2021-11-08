import { h } from "preact";
import "./index.scss";

/** @jsx h */
export function IconButton({
  label,
  icon,
  onClick,
  disabled,
}: {
  disabled: boolean;
  label: string;
  icon: any;
  onClick: () => void;
}) {
  return (
    <div className={`icon-btn ${disabled && "icon-btn-disabled"}`} onClick={onClick}>
      <div className="icon-icon">{icon}</div>
      <div className="icon-label">{label}</div>
    </div>
  );
}
