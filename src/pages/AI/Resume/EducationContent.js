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
import NomalRangePicker from './NomalRangePicker';
import { saveEducationContent as edit } from '@/services/ai';
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
    resumeObj: { name, tel, skills, projects, educations, companys, channel },
    selectJobId,
    jobList,
  },
  form,
  dispatch,
}) {
  const { getFieldDecorator, validateFields, resetFields, setFields } = form;
  const CRef = useRef(null);
  const PRef = useRef(null);
  const eduRef = useRef(null);
  const cContent = useRef(null);
  const pContent = useRef(null);
  const [value, setValue] = useState();
  const [cExpand, setCExpand] = useState(1);
  const [pExpand, setPExpand] = useState(1);
  const [workIndex, setWorkIndex] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const [eduIndex, setEduIndex] = useState(0);
  const [educationContent, setEducationContent] = useState(false);

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


  
  function cContentExpand() {
    setCExpand(cExpand === 1 ? 2 : 1);
  }
  function pContentExpand() {
    setPExpand(pExpand === 1 ? 2 : 1);
  }
  function workSelect(page) {
    setWorkIndex(page);
    CRef.current.goTo(page, true);
    if (
      document.getElementById(`workContent-${page}`) &&
      document.getElementById(`workContent-${page}`).offsetHeight > 62
    ) {
      setCExpand(1);
    } else {
      setCExpand(0);
    }
  }
  function projectSelect(page) {
    setProjectIndex(page);
    PRef.current.goTo(page, true);
    // console.log('喜欢==》11111',document.getElementById(`projectContent-${page}`),document.getElementById(`projectContent-${page}`).offsetHeight);
    if (
      document.getElementById(`projectContent-${page}`) &&
      document.getElementById(`projectContent-${page}`).offsetHeight > 62
    ) {
      setPExpand(1);
    } else {
      setPExpand(0);
    }
  }
  function eduSelect(page) {
    setEduIndex(page);
    eduRef.current.goTo(page, false);
  }
  function editEduContent() {
    setEducationContent(true);
  }
  function saveEduContent() {
    validateFields((err, values) => {
      if (!err) {
        const { resumeId } = jobList.find(item => item.applyId === selectJobId);
        const { educations:newEducations } = values;
        const payload = educations.map((item,index) => {
            return {...item,...newEducations[index]}
        });
        const format = payload.map(item => ({...item,startDate:item.startDate ? item.startDate.format('YYYY-MM-DD') : item.startDate,endDate:item.endDate ? item.endDate.format('YYYY-MM-DD') :item.endDate}));
        console.log('educations===>',format)
        edit({resumeId,educations:format})
          .then(data => {
            message.success('修改教育经历成功！');
            dispatch({
                type: 'chatrecord/fetchResume',
                payload: {
                  resumeId,
                },
              });
            setEducationContent(false);
          })
          .catch(e => message.error(e.message));
      }
    });
  }
  function cancelEduContent() {
    setEducationContent(false);
  }
  const workCls = cExpand === 1 ? styles.expand : cExpand === 0 ? styles.lessSixty : null;
  const formItemLayout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  };
  return (
    <li className={styles.chanceItem}>
      <h4 className={styles.resumeTitle}>
        <div className={styles.resumeEditTitle}>
          <span>教育经历</span>
          {educations && educations.length ? (
            <Fragment>
              {educationContent ? (
                <div>
                  <span onClick={cancelEduContent} style={{ marginRight: 10 }}>
                    取消
                  </span>
                  <Icon type="check" style={{ marginRight: 5 }} onClick={saveEduContent} />
                </div>
            ) : (
              <Icon type="edit" style={{ marginRight: 5 }} onClick={editEduContent} />
            )}
            </Fragment>
          ):null}
        </div>
      </h4>
      {educations && educations.length ? (
        <Fragment>
          <Carousel className={styles.mycarousel} ref={eduRef} dots={false}>
            {educations.map((item, index) => (
              <Fragment>
                {educationContent ? (
                  <Fragment key={index}>
                    <div style={{ display: 'flex',marginBottom:10 }}>
                      <span style={{display:'inline-block',width:100}}>起止时间:</span>
                      <NomalRangePicker
                        form={form} 
                        format="YYYY-MM-DD" 
                        names={[`educations[${index}].startDate`, `educations[${index}].endDate`]} 
                        options={[
                            {
                              initialValue:  moment(item.startDate) || null,
                            },
                            {
                              initialValue: item.endDate ? moment(item.endDate) : null,
                            },
                          ]}
                      />
                    </div>
                    <div style={{ display: 'flex',marginBottom:10  }}>
                      <span style={{display:'inline-block',width:55}}>学校名称:</span>
                      {getFieldDecorator(`educations[${index}].school`, { initialValue: item.school })(
                        <Input size="small" type="text" />
                      )}
                    </div>
                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                      <Col span={12}>
                        <div style={{ display: 'flex', marginBottom: 10 }}>
                          <span style={{display:'inline-block',width:55}}>学历： </span>
                          {getFieldDecorator(`educations[${index}].diploma`, {
                            initialValue: item.diploma,
                          })(<Input size="small" type="text" />)}
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ display: 'flex', marginBottom: 5 }}>
                          <span style={{display:'inline-block',width:55}}>专业： </span>
                          {getFieldDecorator(`educations[${index}].major`, {
                            initialValue: item.major,
                          })(<Input size="small" type="text" />)}
                        </div>
                      </Col>
                    </Row>
                  </Fragment>
                ) : (
                  <div className={styles.carousel} key={index}>
                    <Paragraph style={{ marginBottom: 5 }}>
                      {`起止时间： ${moment(item.startDate).format(format)} ~ ${
                        item.endDate ? moment(item.endDate).format(format) : '至今'
                      }`}
                    </Paragraph>
                    <Paragraph
                      style={{ marginBottom: 5 }}
                    >{`学校名称：  ${item.school}`}</Paragraph>
                    <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Paragraph style={{ flex: 1 }}>{`学历：  ${item.diploma}`}</Paragraph>
                      <Paragraph style={{ flex: 1, marginRight: 5 }}>
                        {`专业：  ${item.major}`}
                      </Paragraph>
                    </Paragraph>
                  </div>
                )}
              </Fragment>
            ))}
          </Carousel>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {educations.map((_, index) => {
              let page = index;
              page += 1;
              const cls =
                eduIndex === index
                  ? classnames(styles.commonBadge, styles.activeBadge)
                  : styles.commonBadge;
              return (
                <span onClick={() => eduSelect(index)} className={cls} key={index}>
                  {page}
                </span>
              );
            })}
          </div>
        </Fragment>
      ) : (
        <div className={styles.noContent}>暂无</div>
      )}
    </li>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(Resume));
