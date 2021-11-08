import React, { PureComponent } from "react";
import styled from "styled-components";

const KEY_ALT = 18;
interface PlatformProps {
  isWin?: boolean;
  showMaximize?: boolean;
  backgroundColor?: string;
}

const Container = styled.div<PlatformProps>`
  height: ${(props) => (props.isWin ? "28px" : "24px")};
  display: flex;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", Arial,
    sans-serif;
  background-color: ${(props) => props.backgroundColor};
  color: #fff;
  -webkit-app-region: drag;
  flex-direction: row;
  position: fixed;
  z-index: 10001;
  /* right: 0px;
  top: 0px; */
`;

export const Text = styled.div<PlatformProps>`
  display: flex;
  padding: 0 10px;
  justify-content: ${(props) => (props.isWin ? "flex-start" : "center")};
  align-content: center;
  align-items: center;
  flex-grow: 1;
  text-align: center;
  font-family: "Helvetica Neue", Helvetica;
  font-size: 12px;
  line-height: 22px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  user-select: none;
`;

export const Controls = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  margin-left: auto;
  height: 100%;
`;

const ButtonMac = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0px 4px;
  line-height: 0;
  padding: 0px;
  -webkit-app-region: no-drag;
  display: inline-block;
  position: relative;
  overflow: hidden;
  border: none;
  box-shadow: none;
`;

export const ButtonMacMaximize = styled(ButtonMac)<PlatformProps>`
  border: 1px solid #12ac28;
  background-color: #28c940;
  & svg.fullscreen-svg {
    width: 6px;
    height: 6px;
    position: absolute;
    top: 1px;
    left: 1px;
    opacity: 0;
  }
  & svg.maximize-svg {
    width: 6px;
    height: 6px;
    position: absolute;
    top: 1px;
    left: 1px;
    opacity: 0;
    display: none;
  }
  &:hover {
    svg.fullscreen-svg {
      opacity: ${(props) => (props.showMaximize ? "0" : "1")};
      display: ${(props) => (props.showMaximize ? "none" : "block")};
    }
    svg.maximize-svg {
      opacity: ${(props) => (props.showMaximize ? "1" : "0")};
      display: ${(props) => (props.showMaximize ? "block" : "none")};
    }
  }
  &:active {
    border-color: #128622;
    background-color: #1f9a31;
  }
`;

export const ButtonMacClose = styled(ButtonMac)`
  border: 1px solid #e2463f;
  background-color: #ff5f57;
  margin-left: 10px;
  & svg {
    width: 4px;
    height: 4px;
    position: absolute;
    top: 2px;
    left: 2px;
    opacity: 0;
  }
  &:hover {
    svg {
      opacity: 1;
    }
  }
  &:active {
    border-color: #ad3934;
    background-color: #bf4943;
  }
`;

export const ButtonMacMinimize = styled(ButtonMac)`
  border: 1px solid #e1a116;
  background-color: #ffbd2e;
  & svg {
    width: 6px;
    height: 6px;
    position: absolute;
    top: 1px;
    left: 1px;
    opacity: 0;
  }
  &:hover {
    svg {
      opacity: 1;
    }
  }
  &:active {
    border-color: #ad7d15;
    background-color: #bf9123;
  }
`;

export const ButtonWindows = styled.button`
  -webkit-app-region: no-drag;
  display: inline-block;
  position: relative;
  width: 45px;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  border: none;
  box-shadow: none;
  border-radius: 0;
  color: #fff;
  background-color: transparent;
  transition: background-color 0.25s ease;
  opacity: 0.5;
  & svg {
    fill: currentColor;
  }
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    opacity: 1;
  }
  &:hover:active {
    background-color: rgba(255, 255, 255, 0.2);
    transition: none;
    opacity: 1;
  }
`;

export const CloseButtonWindows = styled(ButtonWindows)`
  &:hover {
    color: #fff;
    background-color: #e81123;
    opacity: 1;
  }
  &:hover:active {
    color: #fff;
    background-color: #bf0f1d;
    transition: none;
    opacity: 1;
  }
`;

interface TitlebarProps {
  backgroundColor?: string;
  title?: string;
  platform: NodeJS.Platform;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
}
interface TitlebarState {
  keyAltDown: boolean;
}

class Titlebar extends PureComponent<TitlebarProps, TitlebarState> {
  state = {
    keyAltDown: false,
  };

  isWindows = this.props.platform === "win32";

  componentDidMount() {
    if (!this.isWindows) {
      document.body.addEventListener("keydown", this.handleKeyDown);
      document.body.addEventListener("keyup", this.handleKeyUp);
    }
  }

  componentWillUnmount() {
    if (!this.isWindows) {
      document.body.removeEventListener("keydown", this.handleKeyDown);
      document.body.removeEventListener("keyup", this.handleKeyUp);
    }
  }

  handleClose = () => {
    window.parent.close();
  };

  handleKeyDown = (e: any) => {
    if (e.keyCode === KEY_ALT) {
      this.setState({
        keyAltDown: true,
      });
    }
  };

  handleKeyUp = (e: any) => {
    if (e.keyCode === KEY_ALT) {
      this.setState({
        keyAltDown: false,
      });
    }
  };

  handleMinimize = () => {
    this.props.onMinimize();
  };

  handleMaximize = async () => {
    this.props.onMaximize();
  };

  renderMac() {
    const { keyAltDown } = this.state;

    return (
      <Controls key="title-controls">
        <ButtonMacClose tabIndex={"-1" as any} onClick={this.handleClose}>
          <svg x="0px" y="0px" viewBox="0 0 6.4 6.4">
            <polygon
              fill="#4d0000"
              points="6.4,0.8 5.6,0 3.2,2.4 0.8,0 0,0.8 2.4,3.2 0,5.6 0.8,6.4 3.2,4 5.6,6.4 6.4,5.6 4,3.2"
            ></polygon>
          </svg>
        </ButtonMacClose>
        <ButtonMacMinimize tabIndex={"-1" as any} onClick={this.handleMinimize}>
          <svg x="0px" y="0px" viewBox="0 0 8 1.1">
            <rect fill="#995700" width="8" height="1.1"></rect>
          </svg>
        </ButtonMacMinimize>
        <ButtonMacMaximize
          showMaximize={keyAltDown}
          tabIndex={"-1" as any}
          onClick={this.handleMaximize}
        >
          <svg className="fullscreen-svg" x="0px" y="0px" viewBox="0 0 6 5.9">
            <path
              fill="#006400"
              d="M5.4,0h-4L6,4.5V0.6C5.7,0.6,5.3,0.3,5.4,0z"
            ></path>
            <path
              fill="#006400"
              d="M0.6,5.9h4L0,1.4l0,3.9C0.3,5.3,0.6,5.6,0.6,5.9z"
            ></path>
          </svg>
          <svg className="maximize-svg" x="0px" y="0px" viewBox="0 0 7.9 7.9">
            <polygon
              fill="#006400"
              points="7.9,4.5 7.9,3.4 4.5,3.4 4.5,0 3.4,0 3.4,3.4 0,3.4 0,4.5 3.4,4.5 3.4,7.9 4.5,7.9 4.5,4.5"
            ></polygon>
          </svg>
        </ButtonMacMaximize>
      </Controls>
    );
  }

  renderWindows() {
    const { isMaximized } = this.props;

    return (
      <Controls key="title-controls">
        <ButtonWindows
          aria-label="minimize"
          tabIndex={"-1" as any}
          onClick={this.handleMinimize}
        >
          <svg version="1.1" aria-hidden="true" width="10" height="10" color="#000000">
            <path d="M 0,5 10,5 10,6 0,6 Z" />
          </svg>
        </ButtonWindows>
        <ButtonWindows
          aria-label="maximize"
          tabIndex={"-1" as any}
          onClick={this.handleMaximize}
        >
          {isMaximized ? (
            <svg version="1.1" aria-hidden="true" width="10" height="10" color="#000000">
              <path d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z" />
            </svg>
          ) : (
            <svg version="1.1" aria-hidden="true" width="10" height="10" color="#000000">
              <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z" />
            </svg>
          )}
        </ButtonWindows>
        <CloseButtonWindows
          aria-label="close"
          tabIndex={"-1" as any}
          onClick={this.handleClose}
        >
          <svg aria-hidden="true" version="1.1" width="10" height="10" color="#000000">
            <path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z" />
          </svg>
        </CloseButtonWindows>
      </Controls>
    );
  }

  render() {
    const { backgroundColor, title } = this.props;
    const elements = [];

    if (this.isWindows) {
      elements.push(
        <Text key="title-text" isWin={this.isWindows}>
          {title}
        </Text>
      );
      elements.push(this.renderWindows());
    } else {
      elements.push(this.renderMac());
      elements.push(
        <Text key="title-text" isWin={this.isWindows}>
          {title}
        </Text>
      );
    }

    return (
      <Container
        isWin={this.isWindows}
        backgroundColor={backgroundColor}
        data-tauri-drag-region
      >
        {elements}
      </Container>
    );
  }
}

export default Titlebar;
