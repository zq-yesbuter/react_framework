import React, { useState, useEffect, Fragment, useRef, useLayoutEffect } from 'react';
import {
  List,
  Input,
  Button,
  Select,
  Form,
  Col,
  Row,
  Carousel,
  Typography,
  message,
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

const filterName = (key, arr) => {
  return arr.find(item => item.key === key) && arr.find(item => item.key === key).name;
};

function Resume({
  chatrecord: {
    resumeObj: { name, tel, skills, projects, educations, companys,channel },
    selectJobId,
    jobList,
  },
}) {
  const CRef = useRef(null);
  const PRef = useRef(null);
  const eduRef = useRef(null);
  const cContent = useRef(null);
  const pContent = useRef(null);
  const [value, setValue] = useState();
  const [cExpand, setCExpand] = useState(1);
  const [pExpand, setPExpand] = useState(1);
  const [workIndex,setWorkIndex] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const [eduIndex, setEduIndex] = useState(0);

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

  function header() {
    return (
      <div className={styles.header}>
        <h3>{`简历来源：${channel === 'liepin' ? '猎聘网': ''}`}</h3>
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
        const { attachmentFileName, attachmentUrl } = res;
        const a = document.createElement('a'); // 创建a标签
        a.setAttribute('href', attachmentUrl);// href链接
        a.click();
      })
      .catch(error => message.error(error.message));
  }

  function cContentExpand() {
    setCExpand(cExpand === 1 ? 2 : 1);
  }
  function pContentExpand() {
    setPExpand(pExpand === 1 ? 2 : 1);
  }
  function workSelect(page){
    setWorkIndex(page);
    CRef.current.goTo(page,true);
    if (document.getElementById(`workContent-${page}`) && document.getElementById(`workContent-${page}`).offsetHeight > 62) {
      setCExpand(1);
    }else{
      setCExpand(0);
    }
  }
  function projectSelect(page){
    setProjectIndex(page);
    PRef.current.goTo(page,true);
    // console.log('喜欢==》11111',document.getElementById(`projectContent-${page}`),document.getElementById(`projectContent-${page}`).offsetHeight);
    if (document.getElementById(`projectContent-${page}`) && document.getElementById(`projectContent-${page}`).offsetHeight > 62) {
      setPExpand(1);
    }else{
      setPExpand(0);
    }
  }
  function eduSelect(page){
    setEduIndex(page);
    eduRef.current.goTo(page,false);
  }
  const workCls = cExpand === 1 ? styles.expand : (cExpand === 0 ? styles.lessSixty :null)
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
            <Carousel className={styles.mycarousel} ref={CRef} dots={false} slidesToShow={1}>
              {companys.map((item, index) => (
                <div className={styles.carousel} key={index}>
                  <Paragraph>{`起止时间：${moment(item.startDate).format(format)} ~ ${item.endDate ? moment(item.endDate).format(format) : '至今'}`}</Paragraph>
                  <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Paragraph style={{ flex: 1, marginRight: 5 }}>
                      {`公司：  ${item.name}`}
                    </Paragraph>
                    <Paragraph style={{ flex: 1 }}>{`职位：  ${item.position}`}</Paragraph>
                  </Paragraph>
                  <p className={cExpand === 1 ? styles.expand : null} ref={cContent} id={`workContent-${index}`}>
                    {item.content}
                  </p>
                  {cExpand ? (
                    <span onClick={() => cContentExpand(index)} className={styles.button}>
                      {cExpand === 1 ? '展开' : '收起'}
                    </span>
                  ) : null}
                </div>
              ))}
            </Carousel>
            <div style={{display:'flex',justifyContent:'center'}}>
              {companys.map((_, index) => {
                let page = index;
                page += 1; 
                const cls = workIndex === index ? classnames(styles.commonBadge, styles.activeBadge) : styles.commonBadge;
                return (<span onClick={() => workSelect(index)} className={cls} key={index}>{page}</span>)
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
            <Carousel className={styles.mycarousel} ref={PRef} dots={false} slidesToShow={1}>
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
                  <p className={pExpand === 1 ? styles.expand : null} ref={pContent} id={`projectContent-${index}`}>
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
                let page = index;
                page += 1; 
                const cls = projectIndex === index ?classnames(styles.commonBadge, styles.activeBadge) : styles.commonBadge;
                return (<span onClick={() => projectSelect(index)} className={cls} key={index}>{page}</span>)
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
                 let page = index;
                 page += 1; 
                const cls = eduIndex === index ?classnames(styles.commonBadge, styles.activeBadge) : styles.commonBadge;
                return (<span onClick={() => eduSelect(index)} className={cls} key={index}>{page}</span>)
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
