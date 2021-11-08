import React from 'react';
// import { ReactMPV } from 'mpv.js';
import Grid from '@mui/material/Grid';
import { closeFullscreen, openFullscreen } from '@/utils';
import IdleTimer from 'react-idle-timer';
import { getToken } from '@pownthep/react-web-sdk/api/google_drive';
import { CMD, MPV } from '@/enum';
import {
  AudioBtn,
  DurationLabel,
  FullscreenBtn,
  PlayBtn,
  SubtitleBtn,
  ThreatreModeBtn,
  TimerLabel,
  VideoSeekSlider,
  VolumeCtrl
} from '.';
import Typography from '@mui/material/Typography';
import { publish } from '@/platform/electron';

const PLUGIN_MIME_TYPE = "application/x-mpvjs";

class ReactMPV extends React.PureComponent<any, any, any> {
  plugin: any;
  /**
   * Send a command to the player.
   *
   * @param {string} cmd - Command name
   * @param {...*} args - Arguments
   */
  command(cmd, ...args) {
    args = args.map(arg => arg.toString());
    this._postData("command", [cmd].concat(args));
  }

  /**
   * Set a property to a given value.
   *
   * @param {string} name - Property name
   * @param {*} value - Property value
   */
  property(name, value) {
    const data = {name, value};
    this._postData("set_property", data);
  }

  /**
   * Get a notification whenever the given property changes.
   *
   * @param {string} name - Property name
   */
  observe(name) {
    this._postData("observe_property", name);
  }

  /**
   * Send a key event through mpv's input handler, triggering whatever
   * behavior is configured to that key.
   *
   * @param {KeyboardEvent} event
   */
  keypress({key, shiftKey, ctrlKey, altKey}) {
    // Don't need modifier events.
    if ([
      "Escape", "Shift", "Control", "Alt",
      "Compose", "CapsLock", "Meta",
    ].includes(key)) return;

    if (key.startsWith("Arrow")) {
      key = key.slice(5).toUpperCase();
      if (shiftKey) {
        key = `Shift+${key}`;
      }
    }
    if (ctrlKey) {
      key = `Ctrl+${key}`;
    }
    if (altKey) {
      key = `Alt+${key}`;
    }

    // Ignore exit keys for default keybindings settings.
    if ([
      "q", "Q", "ESC", "POWER", "STOP",
      "CLOSE_WIN", "CLOSE_WIN", "Ctrl+c",
      "AR_PLAY_HOLD", "AR_CENTER_HOLD",
    ].includes(key)) return;

    this.command("keypress", key);
  }

  /**
   * Enter fullscreen.
   */
  fullscreen() {
    this.node().webkitRequestFullscreen();
  }

  /**
   * Synchronously destroy mpv instance. You might want to call this on
   * quit in order to cleanup files currently being opened in mpv.
   */
  destroy() {
    this.node().remove();
  }

  /**
   * Return a plugin DOM node.
   *
   * @return {HTMLEmbedElement}
   */
  node() {
    return this.plugin;
  }

  constructor(props) {
    super(props);
    this.plugin = null;
  }
  _postData(type, data) {
    const msg = {type, data};
    this.node().postMessage(msg);
  }
  _handleMessage(e) {
    const msg = e.data;
    const {type, data} = msg;
    if (type === "property_change" && this.props.onPropertyChange) {
      const {name, value} = data;
      this.props.onPropertyChange(name, value);
    } else if (type === "ready" && this.props.onReady) {
      this.props.onReady(this);
    }
  }
  componentDidMount() {
    this.node().addEventListener("message", this._handleMessage.bind(this));
  }
  render() {
    const defaultStyle = {display: "block", width: "100%", height: "100%"};
    const props: any = Object.assign({}, this.props, {
      ref: el => { this.plugin = el; },
      type: PLUGIN_MIME_TYPE,
      style: Object.assign(defaultStyle, this.props.style),
    });
    delete props.onReady;
    delete props.onPropertyChange;
    return React.createElement("embed", props);
  }
}

type Props = {
  showTitle: string;
  episodeTitle: string;
  episodeId: string;
  fullscreen: boolean;
  timePos: number;
  episodeSize: number;
  url?: string;
  refreshToken: string;
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
  MPV.AR
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
      videoSrc: '',
      url: ''
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
    console.log('loading new file: ', url);
  };
  _setVolume = (volume: number) => this._set(MPV.VOL, volume);
  _setPause = (pause: boolean) => this._set(MPV.PAUSE, pause);
  _setTime = (time: number) => this._set(MPV.TIME, time);
  togglePause = () => this._setPause(!this.state.pause);
  toggleFullscreen = () => {
    const { current } = this.playerContainerEl;
    if (!current) return;
    if (this.state.fullscreen) {
      current.className = 'player';
      closeFullscreen();
    } else {
      current.className = 'webfullscreen';
      openFullscreen();
    }
    this.setState({ fullscreen: !this.state.fullscreen });
  };
  toggleThreatreMode = () => {
    const { current } = this.playerContainerEl;
    if (!current) return;
    if (this.state.fullscreen) {
      current.className = 'player';
      // publish('window-toggle-pip', false);
    } else {
      current.className = 'webfullscreen';
      // publish('window-toggle-pip', true);
    }
    this.setState({ fullscreen: !this.state.fullscreen });
  };
  handleMPVReady = (mpv: any) => {
    this.mpv = mpv;
    const observe = mpv.observe.bind(mpv);
    MPV_PROPERTY.forEach(observe);
    this._set(MPV.HWDEC, 'auto');
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
        publish('/main/window/set-aspect-ratio', value);
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
  cycleSubtitleTrack = () => this._cmd(CMD.KEY, 'j');
  cycleAudioTrack = () => this._cmd(CMD.KEY, '#');
  handleOnActive = () => this.setState({ active: true });
  handleOnIdle = () => this.setState({ active: false });

  renderControls = (color: string) => {
    return (
      <>
        <VolumeCtrl
          value={this.state.volume}
          setVolume={this.handleVolumeChange}
          color={color}
        />
        <div
          style={{
            margin: '0 auto',
            fontWeight: 'bold',
            width: '60%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TimerLabel seconds={this.state.time} color={color} />
          <div style={{ width: '85%', margin: '0 auto', textAlign: 'center' }}>
            <Typography variant='body1' display='block'>
              {!this.state.fullscreen && this.props.showTitle}
            </Typography>
            <VideoSeekSlider
              max={this.state.duration}
              currentTime={this.state.time}
              progress={this.state.time + 300}
              onChange={this.handleSeek}
              offset={0}
              secondsPrefix='00:00:'
              minutesPrefix='00:'
            />
            <Typography variant='body2' display='block'>
              {!this.state.fullscreen && this.props.episodeTitle}
            </Typography>
          </div>
          <DurationLabel seconds={this.state.duration} color={color} />
        </div>
        <AudioBtn cycleAudioTrack={this.cycleAudioTrack} color={color} />
        <SubtitleBtn
          cycleSubtitleTrack={this.cycleSubtitleTrack}
          color={color}
        />
        <ThreatreModeBtn
          toggleThreatreMode={this.toggleThreatreMode}
          color={color}
        />
        <FullscreenBtn
          fullscreen={this.state.fullscreen}
          toggleFullscreen={this.toggleFullscreen}
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
        display: 'grid',
        gridTemplateColumns: '160px auto',
        width: '100%',
        height: 90
      }}
    >
      {this.initIdleTimer()}
      <div
        ref={this.playerContainerEl}
        className='player'
        style={{ cursor: this.state.active ? 'default' : 'none' }}
      >
        <div className='mpv-player'>
          <ReactMPV
            onReady={this.handleMPVReady}
            onPropertyChange={this.handlePropertyChange}
            onMouseDown={this.togglePause}
          />
          {this.state.fullscreen && (
            <div
              className='controls'
              style={{
                opacity: this.state.active || this.state.pause ? 1 : 0
              }}
            >
              <div className='absolute-center'>
                <PlayBtn
                  pause={this.state.pause}
                  togglePause={this.togglePause}
                  size={100}
                />
              </div>
              <div className='controls-bot-container'>
                <div className='controls-bot'>
                  <div>
                    <Grid
                      container
                      direction='row'
                      justifyContent='center'
                      alignItems='center'
                    >
                      {this.renderControls('white')}
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
            width: '100%',
            height: 90,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <PlayBtn pause={this.state.pause} togglePause={this.togglePause} />
          {this.renderControls('inherit')}
        </div>
      )}
    </div>
  );

  render() {
    return this.renderPlayer();
  }
}

export default VideoPlayer;
