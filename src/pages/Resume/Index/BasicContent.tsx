import React, { useState, useEffect, useRef } from 'react';
import { Form, Col, Row, Typography, message, Tooltip } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import styles from './index.less';


const { Paragraph, Text } = Typography;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function BasicContent({
  chatrecord: {
    resumeObj: { name, tel, sex, email, birthday, residencePlace, workPlace, channel },
    selectJobId,
    jobList,
  },
  dispatch,
  form,
}) {
  const [basicContent, setBasicContent] = useState(false);
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
    { name: '姓名', value: name, id: '1', key: 'name',span:16 },
    { name: '年龄', value: birthday, id: '2', key: 'birthday',span:8 },
    { name: '性别', value: sex, id: '3', key: 'sex',span:16 },
    { name: '邮箱', value: email, id: '6', key: 'email',span:8 },
    { name: '地点', value: residencePlace, id: '7', key: 'residencePlace',span:16 },
    { name: '电话', value: tel, id: '8', key: 'tel',span:8 },
    // { name: '学历', value: '本科', id: '7' },
    // { name: '民族', value: '汉', id: '4' },
    // { name: '婚姻', value: '已婚', id: '5' },
  ];

  return (
    <li className={styles.chanceItem}>
      <h4 className={styles.resumeTitle}>
      </h4>
      <Row type="flex">
        <Col span={4}/>
        <Col span={20}>
          <Row gutter={[{ xs: 4, sm: 8, md: 12, lg: 16 }, 20]}>
            {basicData.map(({ name, value, id, key,span }) => (
              <Col span={span} key={id}>
                <Tooltip title={key === 'email' || key === 'tel' ? value : ''}>
                  <Paragraph ellipsis>
                    <Text>{`${name}：`}</Text>
                    {key === 'birthday'
                      ? moment().diff(moment(value), 'years') > 0
                        ? `${moment().diff(moment(value), 'years')}岁`
                        : '无'
                      : value || '无'}
                  </Paragraph>
                </Tooltip>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </li>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(BasicContent));
