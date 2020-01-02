import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Input, Form, Col, Row, Carousel, Typography, message, Icon } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import user from '@/assets/user.svg';
import classnames from 'classnames';
import moment from 'moment';
import { saveBasicContent as edit } from '@/services/ai';
import styles from './index.less';

const { Item } = Form;
const { Paragraph, Title, Text } = Typography;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function BasicContent({
  chatrecord: {
    resumeObj: { name, tel, sex, email, birthday, residencePlace },
    selectJobId,
    jobList,
  },
  dispatch,
  form,
}) {
  const [basicContent, setBasicContent] = useState(false);
  const { getFieldDecorator, validateFields, resetFields, setFields } = form;
  const prevSelectJobId = usePrevious(selectJobId);
  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      // eslint-disable-next-line no-lonely-if
      if (prevSelectJobId !== selectJobId) {
        setBasicContent(false);
      }
    }
  });

  const basicData = [
    { name: '姓名', value: name, id: '1', key: 'name' },
    { name: '年龄', value: birthday, id: '2', key: 'birthday' },
    { name: '性别', value: sex, id: '3', key: 'sex' },
    { name: '邮箱', value: email, id: '6', key: 'email' },
    { name: '地点', value: residencePlace, id: '7', key: 'residencePlace' },
    { name: '电话', value: tel, id: '8', key: 'tel' },
    // { name: '学历', value: '本科', id: '7' },
    // { name: '民族', value: '汉', id: '4' },
    // { name: '婚姻', value: '已婚', id: '5' },
  ];

  function editBasicContent() {
    setBasicContent(true);
  }
  function saveBasicContent() {
    validateFields((err, values) => {
      if (!err) {
        // console.log('values===>',values);
        const { resumeId } = jobList.find(item => item.applyId === selectJobId);
        // console.log('birthday====>',birthday);
        edit({ resumeId, ...values, birthday })
          .then(data => {
            message.success('修改基本信息成功！');
            dispatch({
              type: 'chatrecord/fetchResume',
              payload: {
                resumeId,
              },
            });
            setBasicContent(false);
          })
          .catch(e => message.error(e.message));
      }
    });
  }
  function cancelBasicContent() {
    setBasicContent(false);
  }
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
          <span>基本信息</span>
          {basicContent ? (
            <div>
              <span onClick={cancelBasicContent} style={{ marginRight: 10 }}>
                取消
              </span>
              <Icon type="check" style={{ marginRight: 5 }} onClick={saveBasicContent} />
            </div>
          ) : (
            <Icon type="edit" style={{ marginRight: 5 }} onClick={editBasicContent} />
          )}
        </div>
      </h4>
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
          {basicContent ? (
            <Row gutter={[{ xs: 4, sm: 8, md: 12, lg: 16 }, 20]}>
              {basicData.map(({ name, value, id, key }) => (
                <Col span={12} key={id}>
                  <div style={{ display: 'flex', marginBottom: 5 }}>
                    <div style={{ display: 'inline-block', width: 67 }}>{`${name}：`}</div>
                    {getFieldDecorator(key, {
                      initialValue:
                        key === 'birthday' ? `${moment().diff(moment(value), 'years')}岁` : value,
                    })(<Input disabled={key === 'birthday'} size="small" type="text" />)}
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <Row gutter={[{ xs: 4, sm: 8, md: 12, lg: 16 }, 20]}>
              {basicData.map(({ name, value, id, key }) => (
                <Col span={12} key={id}>
                  <div>
                    <Text>{`${name}：`}</Text>
                    {key === 'birthday'
                      ? `${moment().diff(moment(value), 'years')}岁`
                      : value || '无'}
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </li>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(BasicContent));
