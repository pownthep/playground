import { h } from "preact";
import "./index.scss";

/** @jsx h */
interface Props {
  progress: number;
  style?: React.CSSProperties;
  height: number;
  label?: string;
}

export function ProgressBar({ progress, style, height, label }: Props) {
  return (
    <div
      className="progress"
      style={{
        ...style,
        height,
        padding: `0 ${height / 3}px`,
        fontSize: height / 2.2,
        position: "relative",
      }}
    >
      <div className="progress-label">{label ?? ""}</div>
      <div className="progress-value" style={{ width: `${progress}%`, height: height / 2 }}></div>
      <p style={{ marginLeft: 5, position: "absolute", right: 20 }}>{`${progress}%`}</p>
    </div>
  );
}
