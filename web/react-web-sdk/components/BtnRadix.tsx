import React from "react";
import "../css/radix-btn.scss";

export default function BtnRadix({
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
    <div className={`rdx-btn ${disabled && "rdx-btn-disabled"}`} onClick={onClick}>
      <div className="rdx-icon">{icon}</div>
      <div className="rdx-label">{label}</div>
    </div>
  );
}
