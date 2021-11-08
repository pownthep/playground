export const enum MPV {
  PAUSE = 'pause',
  TIME = 'time-pos',
  DURATION = 'duration',
  EOF = 'eof-reached',
  VOL = 'ao-volume',
  HWDEC = 'hwdec',
  AR = 'video-params/aspect',
  HEADERS = 'http-header-fields'
}

export const enum CMD {
  LOAD = 'loadfile',
  SET = 'set',
  KEY = 'keypress'
}
