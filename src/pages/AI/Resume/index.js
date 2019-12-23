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
  message,
  Badge,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import user from '@/assets/user.svg';
import classnames from 'classnames';
import PDF from 'react-pdf-js';
import PDFJS from 'pdfjs-dist';
import moment from 'moment';
import { inlineShowResume } from '@/services/ai'
// import { TextLayerBuilder } from '@/pdfjs-dist/web/pdf_viewer.js';
// import '@/pdfjs-dist/web/pdf_viewer.css';
import styles from './index.less';

// PDFJS.GlobalWorkerOptions.workerSrc = '@/pdfjs-dist/build/pdf.worker.js';
PDFJS.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';
const { Option } = Select;
const { Search } = Input;
const { Item } = Form;
const { Paragraph, Title, Text } = Typography;
const format = 'YYYY-MM-DD';
const pdfurl = require('./1.pdf');

const eduData = [
  { name: '时间', value: '2019.09.06-2019.09.06', type: 0 },
  { name: '大学', value: '清华大学', type: 1 },
  { name: '学历', value: '本科', type: 1 },
  { name: '专业', value: '电子商务', type: 0 },
];

const filterName = (key, arr) => {
  return arr.find(item => item.key === key) && arr.find(item => item.key === key).name;
};

function Resume({
  dispatch,
  chatrecord: {
    resumeObj: { name, tel, skills, projects, educations, companys },
    selectJobId,
    jobList,
  },
  form,
}) {
  const CRef = useRef(null);
  const PRef = useRef(null);
  const eduRef = useRef(null);
  const cContent = useRef(null);
  const pContent = useRef(null);
  const [value, setValue] = useState();
  const [cExpand, setCExpand] = useState(0);
  const [pExpand, setPExpand] = useState(0);
  const [workIndex,setWorkIndex] = useState(1);
  const [projectIndex, setProjectIndex] = useState(1);
  const [eduIndex, setEduIndex] = useState(1);

  const basicData = [
    { name: '姓名', value: name, id: '1' },
    // { name: '年龄', value: '33', id: '2' },
    // { name: '性别', value: '男', id: '3' },
    // { name: '民族', value: '汉', id: '4' },
    // { name: '婚姻', value: '已婚', id: '5' },
    // { name: '小孩', value: '无', id: '6' },
    // { name: '学历', value: '本科', id: '7' },
    { name: '电话', value: tel, id: '8' },
  ];
  useLayoutEffect(() => {
    if (cContent.current && cContent.current.offsetHeight > 65) {
      setCExpand(1);
    }
    if (pContent.current && (pContent.current.offsetHeight > 65)) {
      setPExpand(1);
    }
  },[]);

  function header() {
    return (
      <div className={styles.header}>
        <h3>简历来源：猎聘网</h3>
        <Button onClick={showResume}>查看原简历</Button>
      </div>
    );
  }
  function showResume() {
    const { resumeId } = jobList.find(item => item.applyId === selectJobId) || {};
    let iframe = document.createElement('iframe');
    iframe.id = 1;
    iframe.width = '100%';
    iframe.height = '100%';
    inlineShowResume({resumeId})
      .then(res => {
        if(!res) return;
        console.log('res===>',res);
        const { attachmentFileName, attachmentUrl } = res;
        const index= attachmentFileName.lastIndexOf('.');
        const ext = attachmentFileName.substr(index+1);
        if(ext === 'doc' || ext ==='docx'){
          iframe.src = `https://view.officeapps.live.com/op/view.aspx?src=${attachmentUrl}`;
        }
        iframe.src = `http://mozilla.github.io/pdf.js/web/${attachmentUrl}`;

        // iframe.src = 'http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
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
      })
      .catch(error => message.error(error.message));
  }
  function prev() {
    CRef.current.prev();
    // console.log('pContent.current===>',cContent.current)
    // setCExpand(1);
    if (cContent.current && cContent.current.offsetHeight > 65) {
      setCExpand(1);
    }
  }
  function next() {
    CRef.current.next();
    // console.log('pContent.current===>',cContent.current && cContent.current.offsetHeight)
    // setCExpand(1);
    if (cContent.current && cContent.current.offsetHeight > 65) {
      setCExpand(1);
    }
  }
  function proPrev() {
    PRef.current.prev();
    // console.log('pContent.current===>',pContent.current)
    // setPExpand(1);
    if (pContent.current && pContent.current.offsetHeight > 65) {
      setPExpand(1);
    }
  }
  function proNext() {
    // console.log('pContent.current===>',pContent.current) 
    PRef.current.next();
    // setPExpand(1);
    if (pContent.current && pContent.current.offsetHeight > 65) {
      setPExpand(1);
    }
  }
  function eduPrev() {
    eduRef.current.prev();
  }
  function eduNext() {
    eduRef.current.next();
  }
  function cContentExpand() {
    setCExpand(cExpand === 1 ? 2 : 1);
  }
  function pContentExpand() {
    setPExpand(pExpand === 1 ? 2 : 1);
  }
  function workSelect(page){
    setWorkIndex(page);
    CRef.current.goTo(page,false);
  }
  function projectSelect(page){
    setProjectIndex(page);
    PRef.current.goTo(page,false);
  }
  function eduSelect(page){
    setEduIndex(page);
    eduRef.current.goTo(page,false);
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
                  <div>
                    <Text strong>{`${name}：`}</Text>
                    {value || '无'}
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </li>
      <li className={styles.chanceItem}>
        <h4 className={styles.resumeTitle}>工作经历</h4>
        {companys && companys.length ? (
          <Fragment>
            {/* {companys && companys.length > 1 ? (
              <Fragment>
                <span className={classnames(styles.arrow, styles.arrowLeft)} onClick={prev} />
                <span className={classnames(styles.arrow, styles.arrowRight)} onClick={next} />
              </Fragment>
            ) : null} */}
            <Carousel className={styles.mycarousel} ref={CRef} dots={false}>
              {companys.map((item, index) => (
                <div className={styles.carousel} key={index}>
                  <Paragraph>{`起止时间：${moment(item.startDate).format(format)} ~ ${item.endDate ? moment(item.endDate).format(format) : '至今'}`}</Paragraph>
                  <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Paragraph style={{ flex: 1, marginRight: 5 }}>
                      {`公司：  ${item.name}`}
                    </Paragraph>
                    <Paragraph style={{ flex: 1 }}>{`职位：  ${item.position}`}</Paragraph>
                  </Paragraph>
                  <p className={cExpand === 1 ? styles.expand : null} ref={cContent}>
                    {item.content}
                  </p>
                  {cExpand ? (
                    <span onClick={cContentExpand} className={styles.button}>
                      {cExpand === 1 ? '展开' : '收起'}
                    </span>
                  ) : null}
                </div>
              ))}
            </Carousel>
            <div style={{display:'flex',justifyContent:'center'}}>
              {companys.map((_, index) => {
                const page = index+1;
                const cls = workIndex === page ? classnames(styles.commonBadge, styles.activeBadge) : styles.commonBadge;
                return (<span onClick={() => workSelect(page)} className={cls} key={index}>{page}</span>)
              }
              )}
            </div>
          </Fragment>
        ) : (
          <div className={styles.noContent}>暂无</div>
        )}
      </li>
      <li className={styles.chanceItem} style={{ position: 'relative' }}>
        <h4 className={styles.resumeTitle}>项目经历</h4>
        {projects && projects.length ? (
          <Fragment>
            {/* {projects && projects.length > 1 ? (
              <Fragment>
                <span className={classnames(styles.arrow, styles.arrowLeft)} onClick={proPrev} />
                <span className={classnames(styles.arrow, styles.arrowRight)} onClick={proNext} />
              </Fragment>
            ) : null} */}
            <Carousel className={styles.mycarousel} ref={PRef} dots={false}>
              {projects.map((item, index) => (
                <div className={styles.carousel} key={index}>
                  <Paragraph style={{ marginBottom: 5 }}>
                    {`起止时间： ${moment(item.startDate).format(format)} ~ ${item.endDate ? moment(item.endDate).format(format) : '至今'}`}
                  </Paragraph>
                  <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Paragraph style={{ flex: 1, marginRight: 5 }}>
                      {`公司：  ${item.name  || '无'}`}
                    </Paragraph>
                    <Paragraph style={{ flex: 1 }}>{`职位：  ${item.position || '无'}`}</Paragraph>
                  </Paragraph>
                  {/* <div>{item.time}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{`公司：${item.name || '无'} `}</span>
                    <span>{`职位：${item.position || '无'}`}</span>
                  </div> */}
                  <p className={pExpand === 1 ? styles.expand : null} ref={pContent}>
                    {item.content}
                  </p>
                  {pExpand ? (
                    <span onClick={pContentExpand} className={styles.button}>
                      {pExpand === 1 ? '展开' : '收起'}
                    </span>
                  ) : null}
                </div>
              ))}
            </Carousel>
            <div style={{display:'flex',justifyContent:'center'}}>
              {projects.map((_, index) => {
                const page = index+1;
                const cls = projectIndex === page ?classnames(styles.commonBadge, styles.activeBadge) : styles.commonBadge;
                return (<span onClick={() => projectSelect(page)} className={cls} key={index}>{page}</span>)
              }
              )}
            </div>
          </Fragment>
        ) : (
          <div className={styles.noContent}>暂无</div>
        )}
      </li>
      <li className={styles.chanceItem}>
        <h4 className={styles.resumeTitle}>教育经历</h4>
        {educations && educations.length ? (
          <Fragment>
            {/* {educations.length > 1 ? (
              <Fragment>
                <span className={classnames(styles.arrow, styles.arrowLeft)} onClick={eduPrev} />
                <span className={classnames(styles.arrow, styles.arrowRight)} onClick={eduNext} />
              </Fragment>
            ) : null} */}
            <Carousel className={styles.mycarousel} ref={eduRef} dots={false}>
              {educations.map((item, index) => (
                <div className={styles.carousel} key={index}>
                  <Paragraph style={{ marginBottom: 5 }}>
                    {`起止时间： ${moment(item.startDate).format(format)} ~ ${item.endDate ? moment(item.endDate).format(format) : '至今'}`}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: 5 }}>{`学校名称：  ${item.school}`}</Paragraph>
                  <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Paragraph style={{ flex: 1 }}>{`学历：  ${item.diploma}`}</Paragraph>
                    <Paragraph style={{ flex: 1, marginRight: 5 }}>
                      {`专业：  ${item.major}`}
                    </Paragraph>
                  </Paragraph>
                </div>
              ))}
            </Carousel>
            <div style={{display:'flex',justifyContent:'center'}}>
              {educations.map((_, index) => {
                const page = index+1;
                const cls = eduIndex === page ?classnames(styles.commonBadge, styles.activeBadge) : styles.commonBadge;
                return (<span onClick={() => eduSelect(page)} className={cls} key={index}>{page}</span>)
              }
              )}
            </div>
          </Fragment>
        ) : (
          <div className={styles.noContent}>暂无</div>
        )}
      </li>
    </div>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(Resume));
