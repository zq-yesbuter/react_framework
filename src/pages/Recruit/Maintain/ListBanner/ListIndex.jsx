import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  message,
  Button,
  Modal,
  Table,
  Menu,
  Form,
  Input,
  Row,
  Col,
  Upload,
  Icon,
} from 'antd';
import _ from 'lodash';
import { imageUpload } from '@/services/recruit';
import DateTimeRangePicker from '@/components/DateTimeRangePicker';
import styles from './index.less';

const { Item } = Form;

function Index({ dispatch, location, recruit, form }) {
  const [initalValue, setInitalValue] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  useEffect(() => {
    // return () => {
    //   dispatch({
    //     type: 'picture/init',
    //   });
    // };
  }, []);
  const { getFieldDecorator, getFieldValue, resetFields, setFieldsValue } = form;
  const query = {}; //  queryString.parse(location.search);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log('values===>1111', values);
      }
    });
  };

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">请上传图片</div>
    </div>
  );
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(
        info.file.originFileObj,
        imageUrl => console.log('imageUrl===>', imageUrl)
        // this.setState({
        //   imageUrl,
        //   loading: false,
        // })
      );
    }
  };

  function upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    imageUpload(formData)
      .then(data => {
        message.success('上传图片成功');
        console.log('data===>', data);
      })
      .catch(e => message.error(e.message));
  }

  function addConfig() {
    const newData = _.cloneDeep(initalValue);
    if(newData.length>4){
      message.error('最多智能配置五条！');
      return;
    }
    newData.push({});
    setInitalValue(newData);
  }
  function deleteObj(index) {
    const batch = getFieldValue('batch'); 
    form.setFieldsValue({
      batch: batch.filter((item, key) => key !== index),
    });
    const newData = _.cloneDeep(initalValue);
    newData.splice(index, 1);
    setInitalValue(newData);
  }
  return (
    <Card bordered={false} title="配置首页banner">
      <Row>
        <Col span={4} />
        <Col span={20}>
          <div style={{ marginBottom: 10 }}>
            最多配置5条，图片尺寸660*180
            <a style={{ marginLeft: 10 }} onClick={addConfig}>
              添加配置
            </a>
          </div>
          <Form onSubmit={handleSubmit}>
            {initalValue.map((item,index) => (
            <div style={{ display: 'flex' }}>
              <Item style={{ width: 200 }}>
                {getFieldDecorator(`batch[${index}].fileName`)(
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={upload}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                )}
              </Item>
              <div style={{ flex: 1 }}>
                <Item>
                  <Fragment>
                    <span
                      style={{
                        paddingLeft: 4,
                        color: 'rgba(0,0,0,.75)',
                      }}
                    >
                      展示时段：
                    </span>
                    <DateTimeRangePicker names={[`batch[${index}].dateBegin`, `batch[${index}].dateEnd`]} form={form} />
                  </Fragment>
                </Item>
                <Item>
                  <Fragment>
                    <span
                      style={{
                        paddingLeft: 4,
                        color: 'rgba(0,0,0,.75)',
                      }}
                    >
                      跳转链接：
                    </span>
                    {getFieldDecorator(`batch[${index}].event`)(
                      <Input placeholder="请输入跳转链接" style={{ width: 350 }} />
                    )}
                  </Fragment>
                </Item>
                <Item>
                  <a onClick={() => deleteObj(index)}>清空</a>
                </Item>
              </div>
            </div>
            ) )}
            <Item>
              <Button htmlType="submit" type="primary" className="test-input-search">
                更新配置
              </Button>
              <Button
                style={{ margin: '0 10px' }}
                className="test-input-search"
                onClick={e => {
                  resetFields();
                  handleSubmit(e);
                }}
              >
                重置
              </Button>
            </Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
}

const mapStateToProps = ({ recruit = {} }) => ({ recruit });
export default connect(mapStateToProps)(Form.create({})(Index));
