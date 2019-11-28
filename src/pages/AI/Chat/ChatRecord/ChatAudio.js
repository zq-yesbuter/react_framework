import React, { Component, Fragment, useState, useEffect, useRef } from 'react';
import { Icon, Slider, Spin } from 'antd';
import moment from 'moment';
import { throttle, debounce } from 'lodash-decorators';
import classnames from 'classnames';
import styles from './chatAudio.less';
// import usePrevious from './usePrevious';

function NormalAudio({ audioProps = {}, sourceProps = {}, reloadAudio, propWidth, type }) {
  // console.log("sourceProps===>", sourceProps);
  const src = sourceProps.src || audioProps.src || 'javascript:;';
  const audioEl = useRef(null);
  const ref = useRef();
  const [played, setPlayed] = useState(false);

  const [curTime, setCurTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ci, setCi] = useState(0);
  const mounted = useRef();
  useEffect(() => {
    handleAudioReload();
    return () => {
      //  只有unmount的时候走这里
      audioEl.current.src = null;
    };
  }, []);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      ref.current = sourceProps.src || audioProps.src || 'javascript:;';
      // console.log('current===>',ref.current)
      // console.log('上一轮数据===》', usePrevious())
      // do componentDidUpdate
      // const src = sourceProps.src || audioProps.src || 'javascript:;';
      // const { audioProps: nextAudioProps = {}, sourceProps: nextSourceProps = {} } = nextProps;
      // const nextSrc = nextAudioProps.src || nextSourceProps.src || 'javascript:;';
      // if (src !== nextSrc) {
      //   this.load(nextSrc);
      // }
    }
  });
  function play(played) {
    setCi(ci + 1);
    ci % 2 === 0 ? audioEl.current.play() : audioEl.current.pause();
  }

  function load(src) {
    setLoading(false);
    audioEl.current.src = src;
    audioEl.current.load();
  }

  function handleCanPlay() {
    const totalTime = Math.floor(audioEl.current.duration);
    setTotalTime(totalTime);
    setLoading(false);
  }

  function handleEnded() {
    setCi(0);
    // setTimeout(() => {
    //   setPlayed(false);
    // }, 1000);
  }

  //   @throttle(1000)
  function handleTimeUpdate() {
    const curTime = audioEl.current.currentTime;
    // console.log('handleTimeUpdate curTime', curTime);
    setCurTime(curTime);
  }

  function handleError() {
    const src = sourceProps.src || audioProps.src || 'javascript:;';
    // console.log('无法加载音频:', src);
  }

  function handleAudioReload(e) {
    e && e.preventDefault();
    const src = sourceProps.src || audioProps.src || 'javascript:;';
    load(src);
  }
  const clsBox =
    type === 0
      ? classnames(styles['wifi-symbol'], styles['wifi-symbol-left'])
      : styles['wifi-symbol'];
  const clsSecond =
    ci % 2 !== 0
      ? classnames(styles['wifi-circle'], styles.second, styles.secondActive)
      : classnames(styles['wifi-circle'], styles.second);
  const clsThird =
    ci % 2 !== 0
      ? classnames(styles['wifi-circle'], styles.third, styles.thirdActive)
      : classnames(styles['wifi-circle'], styles.third);
  return (
    <Fragment>
      <audio
        className={styles['audio-origin']}
        controls
        preload="auto"
        ref={audioEl}
        onTimeUpdate={e => {
          handleTimeUpdate();
        }}
        onCanPlay={handleCanPlay}
        onEnded={handleEnded}
        onError={handleError}
        style={{ display: 'none' }}
        // {...audioProps}
      />
      <div className={styles.box} onClick={play} style={{ width: propWidth || 30 }}>
        <div className={clsBox}>
          <div className={classnames(styles['wifi-circle'], styles.first)} />
          <div className={clsSecond} />
          <div className={clsThird} />
        </div>
      </div>
    </Fragment>
  );
}
export default NormalAudio;

//   <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
//     <path d="M256 810.666667h170.666667V213.333333h-170.666667v597.333334z m341.333333-597.333334v597.333334h170.666667V213.333333h-170.666667z" />
//   </svg>
