import { MediaSource, observable } from "../inject";
import { useObservable } from "./observable.hook";
import "./ui.scss";
import { render, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import "@pownthep/react-web-sdk/css/animation.css";

/** @jsx h */

const pretty = (object: any) => {
  return <pre>{JSON.stringify(object, null, 2)}</pre>;
};

function App() {
  const [state, setState] = useObservable(observable);
  const [pos, setPos] = useState({});

  const renderMediaSources = () => {
    const tmpState = state ?? [];
    const derivedState = tmpState.reduce<{ [key: string]: MediaSource }>((prev, curr) => {
      return {
        ...prev,
        [curr.url]: curr,
      };
    }, {});

    return (
      <div className="dropdown">
        <div className="dropbtn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 24 24"
            height="14px"
            viewBox="0 0 24 24"
            width="14px"
            fill="#FFFFFF"
          >
            <g>
              <rect fill="none" height="14" width="14" />
            </g>
            <g>
              <path d="M16.59,9H15V4c0-0.55-0.45-1-1-1h-4C9.45,3,9,3.45,9,4v5H7.41c-0.89,0-1.34,1.08-0.71,1.71l4.59,4.59 c0.39,0.39,1.02,0.39,1.41,0l4.59-4.59C17.92,10.08,17.48,9,16.59,9z M5,19c0,0.55,0.45,1,1,1h12c0.55,0,1-0.45,1-1s-0.45-1-1-1H6 C5.45,18,5,18.45,5,19z" />
            </g>
          </svg>
          Download Videos
        </div>
        <div className="animated animatedFadeInUp fadeInUp dropdown-content-container">
          <div className="dropdown-content">
            {Object.values(derivedState).map((source) => {
              return (
                <a href={source.url} key={source.url} download={source.label} className="download-link">
                  {source.timestamp + ": " + source.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    dragElement(document.getElementById("app-container-id"));

    return () => {};
  }, []);

  useEffect(() => {
    setPos((prev) => ({ ...prev, ...getDefaultPosition() }));
    return () => {};
  }, [state]);

  const getDefaultPosition = () => {
    const videoEl = Array.from(document.querySelectorAll("video")).find((el) => !el.paused);
    return videoEl ? getOffset(videoEl) : {};
  };

  return (
    <div hidden={state?.length === 0} className="app-container" id="app-container-id" style={{ ...pos }}>
      {renderMediaSources()}
    </div>
  );
}

const AxcelRoot = document.createElement("div");
AxcelRoot.id = "AxcelRoot";
document.body.appendChild(AxcelRoot);

export const renderUI = () => {
  render(<App />, document.getElementById("AxcelRoot") as any);
};

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function getOffset(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + 10,
    top: rect.top + 10,
  };
}
