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
  DatePicker,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import user from '@/assets/user.svg';
import classnames from 'classnames';
import moment from 'moment';
import BasicContent from './BasicContent';
import NomalRangePicker from './NomalRangePicker';
import { saveWorkContent as edit } from '@/services/ai';
// import { TextLayerBuilder } from '@/pdfjs-dist/web/pdf_viewer.js';
// import '@/pdfjs-dist/web/pdf_viewer.css';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search, TextArea } = Input;
const { Item } = Form;
const { Paragraph, Title, Text } = Typography;
const format = 'YYYY-MM-DD';
const pdfurl = require('./1.pdf');

const filterName = (key, arr) => {
  return arr.find(item => item.key === key) && arr.find(item => item.key === key).name;
};

function Resume({
  chatrecord: {
    resumeObj: { companys },
    selectJobId,
    jobList,
  },
  form,
  dispatch,
}) {
  const { getFieldDecorator, validateFields, resetFields, setFields } = form;
  const CRef = useRef(null);
  const cContent = useRef(null);
  const pContent = useRef(null);
  const [value, setValue] = useState();
  const [cExpand, setCExpand] = useState(1);
  const [workIndex, setWorkIndex] = useState(0);
  const [workContent, setWorkContent] = useState(false);

  function cContentExpand() {
    setCExpand(cExpand === 1 ? 2 : 1);
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
  function editWorkContent() {
    setWorkContent(true);
  }
  function saveWorkContent() {
    validateFields((err, values) => {
    if (!err) {
        console.log('values===>',values);
        const { resumeId } = jobList.find(item => item.applyId === selectJobId);
        const payload = {resumeId,...companys,...values};
        edit(payload)
          .then(data => {
              message.success('修改工作经历成功！');
              dispatch({
                type: 'chatrecord/fetchResume',
                payload: {
                  resumeId,
                },
              });
              setWorkContent(false);
          })
          .catch(e => message.error(e.message));
        }
    });
  }
  function cancelWorkContent() {
    setWorkContent(false);
  }
  return (
    <li className={styles.chanceItem}>
      <h4 className={styles.resumeTitle}>
        <div className={styles.resumeEditTitle}>
          <span>工作经历</span>
          {workContent ? 
          (
            <div>
              <span onClick={cancelWorkContent} style={{marginRight:5}}>取消</span>
              <Icon type="check" style={{marginRight:5}} onClick={saveWorkContent} />
            </div>
           ) :(
             <Icon type="edit" style={{ marginRight: 5 }} onClick={editWorkContent} />
          )}
        </div>
      </h4>
      {companys && companys.length ? (
        <Fragment>
          <Carousel className={styles.mycarousel} ref={CRef} dots={false} slidesToShow={1}>
            {companys.map((item, index) => (
              <Fragment>
                {workContent ? (
                  <Fragment key={index}>
                    <div style={{ display: 'flex', marginBottom: 5 }}>
                      <span>起止时间: </span>
                      {getFieldDecorator(`companys[${index}].date`, { initialValue: item.date })(
                        // <RangePicker size="small" />
                        <NomalRangePicker
                          form={form} 
                          format="YYYY-MM-DD" 
                          names={['startDate', 'endDate']} 
                        />
                      )}
                    </div>
                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                      <Col span={12}>
                        <div style={{ display: 'flex', marginBottom: 5 }}>
                          <span>公司:</span>
                          {getFieldDecorator(`companys[${index}].name`, {
                            initialValue: item.name,
                          })(<Input size="small" type="text" />)}
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ display: 'flex' }}>
                          <span>职位:</span>
                          {getFieldDecorator(`companys[${index}].position`, {
                            initialValue: item.name,
                          })(<Input size="small" type="text" />)}
                        </div>
                      </Col>
                    </Row>
                    {getFieldDecorator(`companys[${index}].content`, {
                      initialValue: item.content,
                    })(<TextArea rows={4} style={{ marginBottom: 10 }} />)}
                  </Fragment>
                ) : (
                  <div className={styles.carousel} key={index}>
                    <Paragraph>
                      {`起止时间：${moment(item.startDate).format(format)} ~ ${
                      item.endDate ? moment(item.endDate).format(format) : '至今'
                    }`}
                    </Paragraph>
                    <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Paragraph style={{ flex: 1, marginRight: 5 }}>
                        {`公司：  ${item.name}`}
                      </Paragraph>
                      <Paragraph style={{ flex: 1 }}>{`职位：  ${item.position}`}</Paragraph>
                    </Paragraph>
                    <p
                      className={cExpand === 1 ? styles.expand : null}
                      ref={cContent}
                      id={`workContent-${index}`}
                    >
                      {item.content}
                    </p>
                    {cExpand ? (
                      <span onClick={() => cContentExpand(index)} className={styles.button}>
                        {cExpand === 1 ? '展开' : '收起'}
                      </span>
                    ) : null}
                  </div>
                )}
              </Fragment>
            ))}
          </Carousel>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {companys.map((_, index) => {
              let page = index;
              page += 1;
              const cls =
                workIndex === index
                  ? classnames(styles.commonBadge, styles.activeBadge)
                  : styles.commonBadge;
              return (
                <span onClick={() => workSelect(index)} className={cls} key={index}>
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
