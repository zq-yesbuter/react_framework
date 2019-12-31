import React, { useState, useEffect,useRef, useLayoutEffect } from 'react';
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
  Icon,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import user from '@/assets/user.svg';
import classnames from 'classnames';
import PDF from 'react-pdf-js';
import PDFJS from 'pdfjs-dist';
import moment from 'moment';
import BasicContent from './BasicContent';
import WorkContent from './WorkContent';
import ProjectContent from './ProjectContent';
import EducationContent from './EducationContent';
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
  const [basicContent, setBasicContent] = useState(false);

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
        <h3>{`简历来源：${channel || '网络渠道'}`}</h3>
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
  function editBasicContent(){
    setBasicContent(true);
  }
  function saveBasicContent(){
    setBasicContent(false);
  }
  const workCls = cExpand === 1 ? styles.expand : (cExpand === 0 ? styles.lessSixty :null)
  const formItemLayout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  };
  return (
    <div>
      {header()}
      <BasicContent />
      <WorkContent />
      <ProjectContent />
      <EducationContent />
    </div>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Resume);
