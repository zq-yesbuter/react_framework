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
import NomalRangePicker from './NomalRangePicker';
import { saveProjectContent as edit } from '@/services/ai';
// import { TextLayerBuilder } from '@/pdfjs-dist/web/pdf_viewer.js';
// import '@/pdfjs-dist/web/pdf_viewer.css';
import styles from './index.less';


const { TextArea } = Input;
const { Item } = Form;
const { Paragraph, Title, Text } = Typography;
const format = 'YYYY-MM-DD';

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
  const PRef = useRef(null);
  const pContent = useRef(null);
  const [value, setValue] = useState();
  const [pExpand, setPExpand] = useState(1);
  const [workIndex, setWorkIndex] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const [projectContent, setProjectContent] = useState(false);

  function pContentExpand() {
    setPExpand(pExpand === 1 ? 2 : 1);
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

  function editProjectContent() {
    setProjectContent(true);
  }
  function saveProjectContent() {
    validateFields((err, values) => {
        if (!err) {
            console.log('values===>',values);
            const { resumeId } = jobList.find(item => item.applyId === selectJobId);
            // const payload = {resumeId,...companys,...values};
            const { projects:newProjects } = values;
            const payload = projects.map((item,index) => {
                return {...item,...newProjects[index]}
            });
            const format = payload.map(item => ({...item,startDate:item.startDate ? item.startDate.format('YYYY-MM-DD') : item.startDate,endDate:item.endDate ? item.endDate.format('YYYY-MM-DD') :item.endDate}));
            console.log('newCompanys====>',payload,'===>',format);
            edit({resumeId,projects:format})
              .then(data => {
                  message.success('修改项目经历成功！');
                  dispatch({
                    type: 'chatrecord/fetchResume',
                    payload: {
                      resumeId,
                    },
                  });
                  setProjectContent(false);
              })
              .catch(e => message.error(e.message));
            }
        });
  }
  function cancelProjectContent() {
    setProjectContent(false);
  }
  return (
    <li className={styles.chanceItem} style={{ position: 'relative' }}>
      <h4 className={styles.resumeTitle}>
        <div className={styles.resumeEditTitle}>
          <span>项目经历</span>
          {projects && projects.length ? (
            <Fragment>
              {projectContent ?  (
                <div>
                  <span onClick={cancelProjectContent} style={{marginRight:10}}>取消</span>
                  <Icon type="check" style={{marginRight:5}} onClick={saveProjectContent} />
                </div>
           ) : (
             <Icon type="edit" style={{ marginRight: 5 }} onClick={editProjectContent} />
          )}
            </Fragment>
          ) : null}
        </div>
      </h4>
      {projects && projects.length ? (
        <Fragment>
          <Carousel className={styles.mycarousel} ref={PRef} dots={false} slidesToShow={1}>
            {projects.map((item, index) => (
              <Fragment>
                {projectContent ? (
                  <Fragment key={`edit-projects-${index}`}>
                    <div style={{display:'flex'}}>
                      <span style={{display:'inline-block',width:100}}>起止时间:</span>
                      <NomalRangePicker
                        form={form} 
                        format="YYYY-MM-DD" 
                        names={[`projects[${index}].startDate`, `projects[${index}].endDate`]} 
                        options={[
                            {
                              initialValue:  moment(item.startDate) || null,
                            },
                            {
                              initialValue: item.endDate ? moment(item.endDate) : null,
                            },
                          ]}
                      />
                      {/* {getFieldDecorator(`projects[${index}].date`, { initialValue: item.date })(
                        <Input size="small" type="text" />
                      )} */}
                    </div>
                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                      <Col span={12}>
                        <div style={{display:'flex',marginBottom:10}}>
                          <span style={{display:'inline-block',width:55}}>项目： </span>
                          {getFieldDecorator(`projects[${index}].name`, {
                            initialValue: item.name,
                          })(<Input size="small" type="text" />)}
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{display:'flex',marginBottom:10}}>
                          <span style={{display:'inline-block',width:55}}>职位： </span>
                          {getFieldDecorator(`projects[${index}].position`, {
                            initialValue: item.position,
                          })(<Input size="small" type="text" />)}
                        </div>
                      </Col>
                    </Row>
                    {getFieldDecorator(`projects[${index}].content`, {
                    initialValue: item.content,
                    })(<TextArea rows={4} style={{marginBottom:10}} />)}
                  </Fragment>
                ) : (
                  <div className={styles.carousel} key={`projects-${index}`}>
                    <Paragraph style={{ marginBottom: 5 }}>
                      {`起止时间： ${moment(item.startDate).format(format)} ~ ${
                        item.endDate ? moment(item.endDate).format(format) : '至今'
                      }`}
                    </Paragraph>
                    <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Paragraph style={{ flex: 1, marginRight: 5 }}>
                        {`公司：  ${item.name || '无'}`}
                      </Paragraph>
                      <Paragraph style={{ flex: 1 }}>
                        {`职位：  ${item.position ||
                        '无'}`}
                      </Paragraph>
                    </Paragraph>
                    <p
                      className={pExpand === 1 ? styles.expand : null}
                      ref={pContent}
                      id={`projectContent-${index}`}
                    >
                      {item.content}
                    </p>
                    {pExpand ? (
                      <span onClick={pContentExpand} className={styles.button}>
                        {pExpand === 1 ? '展开' : '收起'}
                      </span>
                    ) : null}
                  </div>
                )}
              </Fragment>
            ))}
          </Carousel>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {projects.map((_, index) => {
              let page = index;
              page += 1;
              const cls =
                projectIndex === index
                  ? classnames(styles.commonBadge, styles.activeBadge)
                  : styles.commonBadge;
              return (
                <span onClick={() => projectSelect(index)} className={cls} key={index}>
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
