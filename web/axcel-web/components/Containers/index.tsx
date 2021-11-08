import { h } from "preact";
import "./index.scss";

/** @jsx h */
export const GradientBorderContainer = ({ children }: any) => (
  <div className="gradient-border-container">
    <div className="gradient-container">{children}</div>
  </div>
);
