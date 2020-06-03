import React, { Component, Fragment } from 'react';
import { Icon, Slider, Spin } from 'antd';
import moment from 'moment';
import { throttle, debounce } from 'lodash-decorators';
import './index.less';

const PlaySvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M800 512 224 844.5536 224 179.4464Z" />
  </svg>
);

const PauseSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M256 810.666667h170.666667V213.333333h-170.666667v597.333334z m341.333333-597.333334v597.333334h170.666667V213.333333h-170.666667z" />
  </svg>
);

const VolumeSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M128 384v256h170.666667l213.333333 213.333333V170.666667L298.666667 384H128z m576 128c0-75.306667-43.52-140.373333-106.666667-171.733333v343.68c63.146667-31.573333 106.666667-96.64 106.666667-171.946667zM597.333333 137.813333v88.106667c123.306667 36.693333 213.333333 150.826667 213.333334 286.08s-90.026667 249.386667-213.333334 286.08v88.106667c170.88-38.826667 298.666667-191.36 298.666667-374.186667S768.213333 176.64 597.333333 137.813333z" />
  </svg>
);

const VolumeMuteSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M704 512c0-75.306667-43.52-140.373333-106.666667-171.733333v94.293333l104.746667 104.746667c1.28-8.96 1.92-18.133333 1.92-27.306667z m106.666667 0c0 40.106667-8.746667 77.866667-23.04 112.64l64.64 64.64C880 636.16 896 576 896 512c0-182.613333-127.786667-335.36-298.666667-374.186667v88.106667c123.306667 36.693333 213.333333 150.826667 213.333334 286.08zM182.4 128L128 182.4 329.6 384H128v256h170.666667l213.333333 213.333333V566.4l181.546667 181.546667c-28.586667 21.973333-60.8 39.68-96.213334 50.346666v88.106667a382.72 382.72 0 0 0 157.226667-77.226667L841.6 896 896 841.6l-384-384L182.4 128zM512 170.666667l-89.173333 89.173333L512 349.013333V170.666667z" />
  </svg>
);

const downloadSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M832 399h-182.8V128H374.8v271H192l320 316.2 320-316.2zM192 805.6V896h640v-90.4H192z" />
  </svg>
);

const ReloadSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M810.666667 512h141.653333l-211.2 211.2L529.92 512h194.133333a248.32 248.32 0 0 0-73.813333-181.333333 256 256 0 0 0-361.813333 0 256.469333 256.469333 0 0 0 0 362.24 256.341333 256.341333 0 0 0 290.986666 49.92l62.72 62.72a340.906667 340.906667 0 0 1-414.293333-52.48c-133.12-133.12-132.693333-349.013333 0.426667-482.133334 134.4-133.546667 349.013333-133.973333 482.56-0.426666A340.48 340.48 0 0 1 810.666667 512z" />
  </svg>
);

export default class NormalAudio extends Component {
  state = {
    played: false,
    muted: false,
    volume: 100,
    curTime: 0,
    totalTime: 0,
    loading: true,
  };

  componentDidMount() {
    this.handleAudioReload();
  }

  componentWillReceiveProps(nextProps) {
    const { audioProps = {}, sourceProps = {} } = this.props;
    const src = sourceProps.src || audioProps.src || 'javascript:;';
    const { audioProps: nextAudioProps = {}, sourceProps: nextSourceProps = {} } = nextProps;
    const nextSrc = nextAudioProps.src || nextSourceProps.src || 'javascript:;';

    if (src !== nextSrc) {
      this.load(nextSrc);
    }
  }

  componentWillUnmount() {
    this.audioRef.src = null;
  }

  play = played => {
    this.setState(
      {
        played,
      },
      () => {
        played ? this.audioRef.play() : this.audioRef.pause();
      }
    );
  };

  mute = muted => {
    this.setState(
      {
        muted,
      },
      () => {
        this.audioRef.muted = muted;
      }
    );
  };

  load = src => {
    this.setState(
      {
        loading: false,
      },
      () => {
        this.audioRef.src = src;
        this.audioRef.load();
      }
    );
  };

  handleCanPlay = () => {
    const totalTime = Math.floor(this.audioRef.duration);

    this.setState({
      totalTime,
      loading: false,
    });
  };

  handleEnded = () => {
    setTimeout(() => {
      this.setState(
        {
          played: false,
        },
        () => {
          // this.audioRef.currentTime = 0;
        }
      );
    }, 1000);
  };

  @throttle(1000)
  handleTimeUpdate() {
    const curTime = this.audioRef.currentTime;
    // console.log('handleTimeUpdate curTime', curTime);

    this.setState({
      curTime,
    });
  }

  handleVolumeChange = volume => {
    this.setState(
      {
        volume,
        muted: !volume,
      },
      () => {
        this.audioRef.volume = volume / 100;
        this.audioRef.muted = !volume;
      }
    );
  };

  handleChangeAudioTime = curTime => {
    this.setState(
      {
        curTime,
      },
      () => {
        this.audioRef.currentTime = curTime;
        this.audioRef.pause();
      }
    );
  };

  handleError = () => {
    const { audioProps = {}, sourceProps = {} } = this.props;
    const src = sourceProps.src || audioProps.src || 'javascript:;';

    console.log('无法加载音频:', src);
  };

  handleAudioReload = e => {
    e && e.preventDefault();
    const { audioProps = {}, sourceProps = {} } = this.props;
    const src = sourceProps.src || audioProps.src || 'javascript:;';
    this.load(src);
  };

  formatDuration = t => {
    const s = Math.floor(t % 60);
    const m = Math.floor(t / 60);
    return t ? `${m}:${s >= 10 ? s : `0${s}`}` : '0:00';
  };

  formVolume = v => `音量:${v}`;

  render() {
    const { audioProps = {}, sourceProps = {}, reloadAudio } = this.props;
    const { played, muted, volume, curTime, totalTime, loading } = this.state;
    const src = sourceProps.src || audioProps.src || 'javascript:;';

    return (
      <div className="normal-audio-container">
        <audio
          className="audio-origin"
          controls
          preload="auto"
          ref={el => {
            this.audioRef = el;
            if (reloadAudio && typeof reloadAudio === 'function') {
              reloadAudio(() => {
                this.handleAudioReload();
              });
            }
          }}
          onTimeUpdate={e => {
            this.handleTimeUpdate();
          }}
          onCanPlay={this.handleCanPlay}
          onEnded={this.handleEnded}
          onError={this.handleError}
          // {...audioProps}
        />
        {loading ? (
          <Spin spinning={loading} onClick={this.handleAudioReload} />
        ) : (
          <Fragment>
            <div className="audio-panel">
              <div className="audio-panel-section">
                <div className="main-section main-section-nomargin">
                  <Icon
                    className="audio-icon"
                    component={ReloadSvg}
                    // type="reload"
                    onClick={() => {
                      this.handleAudioReload();
                    }}
                  />
                </div>
              </div>
              <div className="audio-panel-section">
                <div className="sub-section">
                  {played ? (
                    <Icon
                      className="audio-icon"
                      component={PauseSvg}
                      onClick={() => {
                        this.play(false);
                      }}
                    />
                  ) : (
                    <Icon
                      className="audio-icon"
                      component={PlaySvg}
                      onClick={() => {
                        this.play(true);
                      }}
                    />
                  )}
                </div>
                <div className="main-section">
                  <p className="audio-desc">
                    {this.formatDuration(curTime)} / {this.formatDuration(totalTime)}
                  </p>
                  {/* <Slider className="audio-slider" min={0} max={totalTime} value={curTime} tipFormatter={v => this.formatDuration(v)} onChange={this.handleChangeAudioTime} /> */}
                </div>
              </div>
              <div className="audio-panel-section">
                <div className="sub-section">
                  {muted ? (
                    <Icon
                      className="audio-icon"
                      component={VolumeMuteSvg}
                      onClick={() => {
                        this.mute(false);
                      }}
                    />
                  ) : (
                    <Icon
                      className="audio-icon"
                      component={VolumeSvg}
                      onClick={() => {
                        this.mute(true);
                      }}
                    />
                  )}
                </div>
                <div className="main-section">
                  <Slider
                    className="audio-slider"
                    value={volume}
                    tipFormatter={v => this.formVolume(v)}
                    onChange={this.handleVolumeChange}
                  />
                </div>
              </div>
              <div className="audio-panel-section">
                <div className="main-section" style={{ marginLeft: 0, textAlign: 'right' }}>
                  <a href={src} target="_blank" title="查看源音频">
                    <Icon className="audio-icon" component={downloadSvg} />
                  </a>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
