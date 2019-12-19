import React, { useState, useEffect, Fragment, useRef, useLayoutEffect } from 'react';
import {
  Radio,
  List,
  Spin,
  Input,
  Button,
  Table,
  Card,
  Checkbox,
  Select,
  Divider,
  Menu,
  Dropdown,
  Form,
  Col,
  Row,
  Carousel,
  Icon,
  Typography,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import user from '@/assets/user.svg';
import classnames from 'classnames';
import PDF from 'react-pdf-js';
import PDFJS from 'pdfjs-dist';
// import { TextLayerBuilder } from '@/pdfjs-dist/web/pdf_viewer.js';
// import '@/pdfjs-dist/web/pdf_viewer.css';
import styles from './index.less';

// PDFJS.GlobalWorkerOptions.workerSrc = '@/pdfjs-dist/build/pdf.worker.js';
PDFJS.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';
const { Option } = Select;
const { Search } = Input;
const { Item } = Form;
const { Paragraph } = Typography;

const pdfurl = require('./1.pdf');

const basicData = [
  { name: '姓名', value: '张三', id: '1' },
  { name: '年龄', value: '33', id: '2' },
  { name: '性别', value: '男', id: '3' },
  { name: '民族', value: '汉', id: '4' },
  { name: '婚姻', value: '已婚', id: '5' },
  { name: '小孩', value: '无', id: '6' },
  { name: '学历', value: '本科', id: '7' },
  { name: '电话', value: '18600000000', id: '8' },
];
const eduData = [
  { name: '时间', value: '2019.09.06-2019.09.06', type: 0 },
  { name: '大学', value: '清华大学', type: 1 },
  { name: '学历', value: '本科', type: 1 },
  { name: '专业', value: '电子商务', type: 0 },
];
const workContent = [
  {
    time: '2019.09.06-2019.09.06',
    name: 'XXXX',
    name1: 'XXXXXXXX',
    name2:
      '人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人',
  },
  {
    time: '2019.09.06-2019.09.06',
    name: 'XXXX',
    name1: 'XXXXXXXX',
    name2:
      '人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人',
  },
  {
    time: '2019.09.06-2019.09.06',
    name: 'XXXX',
    name1: 'XXXXXXXX',
    name2:
      '人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人183ren人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人人',
  },
];
const filterName = (key, arr) => {
  return arr.find(item => item.key === key) && arr.find(item => item.key === key).name;
};
function showResume() {
  let iframe = document.createElement('iframe');
  iframe.id = 1;
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.src = 'http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
  // 'https://view.officeapps.live.com/op/view.aspx?src=http://storage.xuetangx.com/public_assets/xuetangx/PDF/1.xls';
  const win = window.open();
  // let loadingDiv = document.createElement('div');
  // loadingDiv.width='100%';
  // loadingDiv.height='100%';
  // loadingDiv.innerHTML='eeeeeeee';
  // win.document.body.appendChild(loadingDiv);

  // win.document.body.appendChild();
  win.document.body.appendChild(iframe);
  if (iframe.attachEvent) {
    iframe.attachEvent('onload', () => {});
  } else {
    iframe.onload = () => {
      // win.document.body.removeChild(loadingDiv);
    };
  }
}

function Resume({ dispatch, chatrecord: { resumeObj = {} }, form }) {
  const CRef = useRef(null);
  const PRef = useRef(null);
  const cContent = useRef(null);
  const pContent = useRef(null);
  const [value, setValue] = useState();
  const [cExpand, setCExpand] = useState(0);
  const [pExpand, setPExpand] = useState(0);

  useLayoutEffect(() => {
    // console.log('content=>', pContent.current.offsetHeight);
    if (cContent.current.offsetHeight > 59) {
      setCExpand(1);
    }
    if (pContent.current.offsetHeight > 59) {
      setPExpand(1);
    }
  }, []);

  function header() {
    return (
      <div className={styles.header}>
        <h3>简历来源：猎聘网</h3>
        <Button onClick={showResume}>查看原简历</Button>
      </div>
    );
  }
  function prev() {
    CRef.current.prev();
    setCExpand(1);
  }
  function next() {
    CRef.current.next();
    setCExpand(1);
  }
  function proPrev() {
    PRef.current.prev();
    setPExpand(1);
  }
  function proNext() {
    PRef.current.next();
    setPExpand(1);
  }
  function cContentExpand() {
    setCExpand(cExpand === 1 ? 2 : 1);
  }
  function pContentExpand() {
    // console.log('expand===>', pExpand);
    setPExpand(pExpand === 2 ? 1 : 2);
  }
  // console.log('render===>', pExpand);
  function expand(e) {
    console.log('eee==>', e);
  }
  return (
    <div>
      {header()}
      <li className={styles.chanceItem}>
        <h4 className={styles.resumeTitle}>基本信息</h4>
        {/* <PDF file={pdfurl} /> */}

        <Row type="flex">
          <Col
            // className="gutter-row"
            span={4}
            style={{
              flexShrink: 1,
              alignItems: 'center',
              flex: 1,
              alignSelf: 'center',
              padding: 10,
            }}
          >
            <img src={user} alt="avatar" style={{ width: '100%', borderRadius: 10 }} />
          </Col>
          <Col span={18}>
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
              {basicData.map(({ name, value, id }) => (
                <Col span={12} key={id}>
                  <div>{`${name}:${value}`}</div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </li>
      <li className={styles.chanceItem} style={{ position: 'relative' }}>
        <span className={classnames(styles.arrow, styles.arrowLeft)} onClick={prev} />
        <span className={classnames(styles.arrow, styles.arrowRight)} onClick={next} />
        <h4 className={styles.resumeTitle}>工作经历</h4>
        <Carousel className={styles.mycarousel} ref={CRef}>
          {workContent.map((item, index) => (
            <div className={styles.carousel} key={index}>
              <div>{item.time}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{`公司：${item.name}`}</span>
                <span>{`职位：${item.name1}`}</span>
              </div>
              <p className={cExpand === 1 ? styles.expand : null} ref={cContent}>
                {item.name2}
              </p>
              {pExpand ? (
                <span onClick={cContentExpand} className={styles.button}>
                  {cExpand === 1 ? '展开' : '收起'}
                </span>
              ) : null}
            </div>
          ))}
        </Carousel>
      </li>
      <li className={styles.chanceItem} style={{ position: 'relative' }}>
        <span className={classnames(styles.arrow, styles.arrowLeft)} onClick={proPrev} />
        <span className={classnames(styles.arrow, styles.arrowRight)} onClick={proNext} />
        <h4 className={styles.resumeTitle}>项目经历</h4>
        <Carousel className={styles.mycarousel} ref={PRef}>
          {workContent.map((item, index) => (
            <div className={styles.carousel} key={index}>
              <div>{item.time}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{`公司：${item.name}`}</span>
                <span>{`职位：${item.name1}`}</span>
              </div>
              <p className={pExpand === 1 ? styles.expand : null} ref={pContent}>
                {item.name2}
              </p>
              {pExpand ? (
                <span onClick={pContentExpand} className={styles.button}>
                  {pExpand === 1 ? '展开' : '收起'}
                </span>
              ) : null}
            </div>
          ))}
        </Carousel>
      </li>
      <li className={styles.chanceItem}>
        <h4 className={styles.resumeTitle}>教育经历</h4>
        <Row
          gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}
          style={{ paddingLeft: 20, paddingRight: 20, marginTop: 10 }}
        >
          {eduData.map(({ name, value, type }, index) => (
            <Col className="gutter-row" span={24} key={index}>
              <div className="gutter-box">{`${name}:${value}`}</div>
            </Col>
          ))}
        </Row>
      </li>
    </div>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(Resume));
