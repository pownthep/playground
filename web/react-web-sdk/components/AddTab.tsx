import React from "react";

interface Props {
  onClick: () => void;
  isDragging: boolean;
  className: string;
}

export default function AddTab({ onClick, isDragging, className }: Props) {
  return !isDragging ? (
    <div className={className} onClick={onClick}>
      +
    </div>
  ) : (
    <></>
  );
}
