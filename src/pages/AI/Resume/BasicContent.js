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
import { saveBasicContent as edit } from '@/services/ai'
// import { TextLayerBuilder } from '@/pdfjs-dist/web/pdf_viewer.js';
// import '@/pdfjs-dist/web/pdf_viewer.css';
import styles from './index.less';

// PDFJS.GlobalWorkerOptions.workerSrc = '@/pdfjs-dist/build/pdf.worker.js';
PDFJS.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

const { Item } = Form;
const { Paragraph, Title, Text } = Typography;
const format = 'YYYY-MM-DD';
const pdfurl = require('./1.pdf');

const filterName = (key, arr) => {
  return arr.find(item => item.key === key) && arr.find(item => item.key === key).name;
};

function Resume({
  chatrecord: {
    resumeObj: { name, tel, sex, email, birthday,residencePlace },
    selectJobId,
    jobList,
  },
  dispatch,
  form,
}) {
  const [basicContent, setBasicContent] = useState(false);
  const { getFieldDecorator, validateFields, resetFields, setFields } = form;

  const basicData = [
    { name: '姓名', value: name, id: '1',key:'name' },
    { name: '年龄', value: birthday ? `${moment().diff(moment(birthday),'years')}岁` : '无', id: '2',key: 'birthday' },
    { name: '性别', value: sex, id: '3',key:'sex' },
    { name: '邮箱', value: email, id: '6',key:'email' },
    { name: '地点', value: residencePlace, id: '7',key:'residencePlace' },
    { name: '电话', value: tel, id: '8',key:'tel' },
    // { name: '学历', value: '本科', id: '7' },
    // { name: '民族', value: '汉', id: '4' },
    // { name: '婚姻', value: '已婚', id: '5' },
  ];

  function editBasicContent(){
    setBasicContent(true);
  }
  function saveBasicContent(){
    validateFields((err, values) => {
    if (!err) {
        console.log('values===>',values);
        const { resumeId } = jobList.find(item => item.applyId === selectJobId);
        edit({resumeId,...values}).then(data => {
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
  function cancelBasicContent(){
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
              <span onClick={cancelBasicContent} style={{marginRight:5}}>取消</span>
              <Icon type="check" style={{marginRight:5}} onClick={saveBasicContent} />
            </div>
          ) : <Icon type="edit" style={{marginRight:5}} onClick={editBasicContent} /> }
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
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
              {basicData.map(({ name, value, id,key }) => ( 
                <Col span={12} key={id}>
                  <div style={{display:'flex',marginBottom:5}}>
                    <Text>{`${name}：`}</Text>
                    {getFieldDecorator(key,{initialValue: value})(<Input
                      size="small"
                      type="text"
                    />)}
                  </div>
                </Col>
            ))}
            </Row>
        ): (
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
            { basicData.map(({ name, value, id }) => (
              <Col span={12} key={id}>
                <div>
                  <Text>{`${name}：`}</Text>
                  {value || '无'}
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
export default connect(mapStateToProps)(Form.create({})(Resume));
