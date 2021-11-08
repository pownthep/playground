import React from "react";
import { ReactMPV } from "mpv.js";
import Grid from "@mui/material/Grid";
import { closeFullscreen, openFullscreen } from "../utils";
import IdleTimer from "react-idle-timer";
import { getToken } from "../api/google_drive";
import { CMD, MPV } from "../enum";
import {
  AudioBtn,
  DurationLabel,
  FullscreenBtn,
  PlayBtn,
  SubtitleBtn,
  ThreatreModeBtn,
  TimerLabel,
  VideoSeekSlider,
  VolumeCtrl,
} from ".";
import Typography from "@mui/material/Typography";

export type Props = {
  showTitle: string;
  episodeTitle: string;
  episodeId: string;
  fullscreen: boolean;
  timePos: number;
  episodeSize: number;
  url?: string;
  refreshToken: string;
  onTogglePip: (isPip: boolean) => void;
  onAspectRatio: (ratio: number) => void;
};

type State = {
  pause: boolean;
  time: number;
  duration: number;
  fullscreen: boolean;
  volume: number;
  active: boolean;
  videoSrc: string;
  url: string;
};

const MPV_PROPERTY = [
  MPV.DURATION,
  MPV.EOF,
  MPV.HWDEC,
  MPV.PAUSE,
  MPV.TIME,
  MPV.VOL,
  MPV.AR,
];

class VideoPlayer extends React.Component<Props, State> {
  mpv: any;
  playerContainerEl: React.RefObject<HTMLDivElement>;
  idleTimer: any;
  constructor(props: Props) {
    super(props);
    this.mpv = null;
    this.idleTimer = null;
    this.state = {
      pause: true,
      time: this.props.timePos,
      duration: 3600,
      fullscreen: this.props.fullscreen,
      volume: 20,
      active: true,
      videoSrc: "",
      url: "",
    };
    this.playerContainerEl = React.createRef();
  }

  shouldComponentUpdate({ episodeId, episodeSize, url, refreshToken }: Props) {
    if (this.props.episodeId !== episodeId) {
      if (url) this._load(url);
      else {
        getToken(this.props.refreshToken).then((token) => {
          this._set(MPV.HEADERS, `Authorization: Bearer ${token}`);
          console.log(
            `LOADING URL: https://www.googleapis.com/drive/v3/files/${episodeId}?alt=media`
          );
          this._load(
            `https://www.googleapis.com/drive/v3/files/${episodeId}?alt=media`
          );
        });
      }
      return false;
    }
    return true;
  }

  _set = (prop: MPV, value: any) => this.mpv?.property(prop, value);
  _cmd = (cmd: CMD, args: any) => this.mpv?.command(cmd, args);

  _load = (url: string) => {
    this._cmd(CMD.LOAD, url);
    console.log("loading new file: ", url);
  };
  _setVolume = (volume: number) => this._set(MPV.VOL, volume);
  _setPause = (pause: boolean) => this._set(MPV.PAUSE, pause);
  _setTime = (time: number) => this._set(MPV.TIME, time);
  togglePause = () => this._setPause(!this.state.pause);
  toggleFullscreen = () => {
    const { current } = this.playerContainerEl;
    if (!current) return;
    if (this.state.fullscreen) {
      current.className = "player";
      closeFullscreen();
    } else {
      current.className = "webfullscreen";
      openFullscreen();
    }
    this.setState({ fullscreen: !this.state.fullscreen });
  };
  toggleThreatreMode = () => {
    const { current } = this.playerContainerEl;
    if (!current) return;
    if (this.state.fullscreen) {
      current.className = "player";
      this.props.onTogglePip(false);
    } else {
      current.className = "webfullscreen";
      this.props.onTogglePip(true);
    }
    this.setState({ fullscreen: !this.state.fullscreen });
  };
  handleMPVReady = (mpv: any) => {
    this.mpv = mpv;
    const observe = mpv.observe.bind(mpv);
    MPV_PROPERTY.forEach(observe);
    this._set(MPV.HWDEC, "auto");
    this._setVolume(this.state.volume);
    if (this.props.episodeId.length > 0)
      this.handleEpisodeChange(
        this.props.episodeId,
        this.props.episodeTitle,
        this.state.time,
        this.props.episodeSize
      );
  };
  handlePropertyChange = (name: string, value: any) => {
    switch (name) {
      case MPV.TIME:
        this.setState({ time: value });
        break;
      case MPV.PAUSE:
        this.setState({ pause: value });
        break;
      case MPV.DURATION:
        this.setState({ duration: value });
        if (this.props.timePos) {
          this._setTime(this.props.timePos);
        }
        this._setPause(false);
        break;
      case MPV.AR:
        this.props.onAspectRatio(value);
      default:
        break;
    }
  };
  handleSeek = (time: number) => {
    this._setTime(time);
  };
  handleEpisodeChange = async (
    id: string,
    name: string,
    time: number = 0,
    size: number
  ) => {
    const accessToken = await getToken(this.props.refreshToken);
    this._set(MPV.HEADERS, `Authorization: Bearer ${accessToken}`);
    console.log(
      `LOADING URL: https://www.googleapis.com/drive/v3/files/${id}?alt=media`
    );
    this._load(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`);
    this._setTime(time);
    // stream(id, size, this.props.refreshToken).then((url) => {
    // });
  };
  handleVolumeChange = (volume: number) => {
    this.setState({ volume });
    this._setVolume(volume);
  };
  cycleSubtitleTrack = () => this._cmd(CMD.KEY, "j");
  cycleAudioTrack = () => this._cmd(CMD.KEY, "#");
  handleOnActive = () => this.setState({ active: true });
  handleOnIdle = () => this.setState({ active: false });

  renderControls = (color: string) => {
    return (
      <>
        <VolumeCtrl
          value={this.state.volume}
          onVolumeChanged={this.handleVolumeChange}
          color={color}
        />
        <div
          style={{
            margin: "0 auto",
            fontWeight: "bold",
            width: "60%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TimerLabel seconds={this.state.time} color={color} />
          <div style={{ width: "85%", margin: "0 auto", textAlign: "center" }}>
            <Typography variant="body1" display="block">
              {!this.state.fullscreen && this.props.showTitle}
            </Typography>
            <VideoSeekSlider
              max={this.state.duration}
              currentTime={this.state.time}
              progress={this.state.time + 300}
              onChange={this.handleSeek}
              offset={0}
              secondsPrefix="00:00:"
              minutesPrefix="00:"
            />
            <Typography variant="body2" display="block">
              {!this.state.fullscreen && this.props.episodeTitle}
            </Typography>
          </div>
          <DurationLabel seconds={this.state.duration} color={color} />
        </div>
        <AudioBtn cycleAudioTrack={this.cycleAudioTrack} color={color} />
        <SubtitleBtn onClick={this.cycleSubtitleTrack} color={color} />
        <ThreatreModeBtn onClick={this.toggleThreatreMode} color={color} />
        <FullscreenBtn
          fullscreen={this.state.fullscreen}
          onClick={this.toggleFullscreen}
          color={color}
        />
      </>
    );
  };

  initIdleTimer = () => {
    return (
      <>
        {this.state.fullscreen && (
          <IdleTimer
            ref={(ref: any) => {
              this.idleTimer = ref;
            }}
            timeout={1500}
            onActive={this.handleOnActive}
            onIdle={this.handleOnIdle}
            debounce={1000}
          />
        )}
      </>
    );
  };

  renderPlayer = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px auto",
        width: "100%",
        height: 90,
      }}
    >
      {this.initIdleTimer()}
      <div
        ref={this.playerContainerEl}
        className="player"
        style={{ cursor: this.state.active ? "default" : "none" }}
      >
        <div className="mpv-player">
          <ReactMPV
            onReady={this.handleMPVReady}
            onPropertyChange={this.handlePropertyChange}
            onMouseDown={this.togglePause}
          />
          {this.state.fullscreen && (
            <div
              className="controls"
              style={{
                opacity: this.state.active || this.state.pause ? 1 : 0,
              }}
            >
              <div className="absolute-center">
                <PlayBtn
                  pause={this.state.pause}
                  onClick={this.togglePause}
                  size={100}
                />
              </div>
              <div className="controls-bot-container">
                <div className="controls-bot">
                  <div>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {this.renderControls("white")}
                    </Grid>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {!this.state.fullscreen && (
        <div
          style={{
            width: "100%",
            height: 90,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PlayBtn pause={this.state.pause} onClick={this.togglePause} />
          {this.renderControls("inherit")}
        </div>
      )}
    </div>
  );

  render() {
    return this.renderPlayer();
  }
}

export default VideoPlayer;
