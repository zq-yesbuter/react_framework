import React from 'react';
import { Col, Row, Typography, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import './index.less';

const { Paragraph, Text } = Typography;
interface Props {
  birthday: string | number | Date;
  sex: string;
  email: string;
  residencePlace: string;
  tel: string | number;
  name: string;
  education: string;
}
function BasicContent(props: Props) {
  const { birthday, sex, email, residencePlace, tel, name, education } = props;
  const basicData = [
    { name: '姓名', value: name, id: '1', key: 'name', span: 16 },
    { name: '年龄', value: birthday, id: '2', key: 'birthday', span: 8 },
    { name: '性别', value: sex, id: '3', key: 'sex', span: 16 },
    { name: '邮箱', value: email, id: '6', key: 'email', span: 8 },
    { name: '地点', value: residencePlace, id: '7', key: 'residencePlace', span: 16 },
    { name: '电话', value: tel, id: '8', key: 'tel', span: 8 },
    { name: '学历', value: education, id: '9', key: 'education', span: 16 },
    // { name: '民族', value: '汉', id: '4' },
    // { name: '婚姻', value: '已婚', id: '5' },
  ];

  return (
    <li className="chanceItem">
      <h4 className="resumeTitle" />
      <Row type="flex">
        <Col span={2} />
        <Col span={22}>
          <Row gutter={[{ xs: 4, sm: 8, md: 12, lg: 16 }, 20]}>
            {basicData.map(({ name, value, id, key, span }) => (
              <Col span={span} key={id}>
                <Tooltip title={key === 'email' || key === 'tel' ? value : ''}>
                  <Paragraph ellipsis>
                    <Text>{`${name}：`}</Text>
                    {key === 'birthday'
                      ? moment().diff(moment(value), 'years') > 0
                        ? `${moment().diff(moment(value), 'years')}岁`
                        : ''
                      : value || ''}
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

export default BasicContent;
