import React, { useState, useEffect, Fragment, useRef, useLayoutEffect } from 'react';
import { Input, Select, Form, Col, Row, Carousel, Typography, message, Icon } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import user from '@/assets/user.svg';
import classnames from 'classnames';
import moment from 'moment';
import NomalRangePicker from './NomalRangePicker';
import { saveEducationContent as edit } from '@/services/ai';
import styles from './index.less';

const { Item } = Form;
const { Paragraph, Title, Text } = Typography;
const format = 'YYYY-MM-DD';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Resume({
  chatrecord: {
    resumeObj: { educations },
    selectJobId,
    jobList,
  },
  form,
  dispatch,
}) {
  const { getFieldDecorator, validateFields, resetFields, setFields } = form;
  const eduRef = useRef(null);
  const [value, setValue] = useState();
  const [eduIndex, setEduIndex] = useState(0);
  const [educationContent, setEducationContent] = useState(false);
  const prevSelectJobId = usePrevious(selectJobId);
  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      // eslint-disable-next-line no-lonely-if
      if (prevSelectJobId !== selectJobId) {
        setEducationContent(false);
      }
    }
  });

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
        const { educations: newEducations } = values;
        const payload = educations.map((item, index) => {
          return { ...item, ...newEducations[index] };
        });
        const format = payload.map(item => ({
          ...item,
          startDate: item.startDate ? item.startDate.format('YYYY-MM-DD') : item.startDate,
          endDate: item.endDate ? item.endDate.format('YYYY-MM-DD') : item.endDate,
        }));
        // console.log('educations===>',format)
        edit({ resumeId, educations: format })
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
          ) : null}
        </div>
      </h4>
      {educations && educations.length ? (
        <Fragment>
          <Carousel className={styles.mycarousel} ref={eduRef} dots={false}>
            {educations.map((item, index) => (
              <Fragment key={`main-education-${index}`}>
                {educationContent ? (
                  <Fragment key={`edit-education-${index}`}>
                    <div style={{ display: 'flex', marginBottom: 10 }}>
                      <span style={{ display: 'inline-block', width: 100 }}>起止时间:</span>
                      <NomalRangePicker
                        form={form}
                        format="YYYY-MM-DD"
                        names={[`educations[${index}].startDate`, `educations[${index}].endDate`]}
                        options={[
                          {
                            initialValue: moment(item.startDate) || null,
                          },
                          {
                            initialValue: item.endDate ? moment(item.endDate) : null,
                          },
                        ]}
                      />
                    </div>
                    <div style={{ display: 'flex', marginBottom: 10 }}>
                      <span style={{ display: 'inline-block', width: 100 }}>学校名称:</span>
                      {getFieldDecorator(`educations[${index}].school`, {
                        initialValue: item.school,
                      })(<Input size="small" type="text" />)}
                    </div>
                    <Row gutter={[{ xs: 4, sm: 8, md: 12, lg: 16 }, 20]}>
                      <Col span={12}>
                        <div style={{ display: 'flex', marginBottom: 10 }}>
                          <span style={{ display: 'inline-block', width: 60 }}>学历： </span>
                          {getFieldDecorator(`educations[${index}].diploma`, {
                            initialValue: item.diploma,
                          })(<Input size="small" type="text" />)}
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ display: 'flex', marginBottom: 5 }}>
                          <span style={{ display: 'inline-block', width: 60 }}>专业： </span>
                          {getFieldDecorator(`educations[${index}].major`, {
                            initialValue: item.major,
                          })(<Input size="small" type="text" />)}
                        </div>
                      </Col>
                    </Row>
                  </Fragment>
                ) : (
                  <div className={styles.carousel} key={`education-${index}`}>
                    <Paragraph style={{ marginBottom: 5 }}>
                      {`起止时间： ${moment(item.startDate).format(format)} ~ ${
                        item.endDate ? moment(item.endDate).format(format) : '至今'
                      }`}
                    </Paragraph>
                    <Paragraph style={{ marginBottom: 5 }}>
                      {`学校名称：  ${item.school}`}
                    </Paragraph>
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
