import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Table, Menu, Form,Input,Row,Col,Upload,Icon} from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import DateFormat from '@/components/DateFormat';
import CategoryQueryForm from './QueryForm';
import renderTable from '@/components/SelectTable';
import { addBatch, batchRelated, batchCancel, batchDelete } from '@/services/nameList';
import DateTimeRangePicker from '@/components/DateTimeRangePicker';

const { Item } = Form;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
function Index({ dispatch, location, recruit, form }) {
  const { batchList, ivrIntents, batchCur, batchPageSize, batchRequest } = recruit;
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [imageUrl,setImageUrl] = useState();
  useEffect(() => {
    // return () => {
    //   dispatch({
    //     type: 'picture/init',
    //   });
    // };
  }, []);
  const { getFieldDecorator, getFieldValue, resetFields,setFieldsValue } = form;
  const query = {}; //  queryString.parse(location.search);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log('values===>',values);
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
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  return (
    <Card bordered={false} title="配置首页banner">
      最多配置5张，图片尺寸660*180
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col span={8}>
            <Item>
              {getFieldDecorator('fileName')(
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              )}
            </Item>
          </Col>
          <Col span={16}> 
            <Item label="投递时间" {...formItemLayout}>
              <DateTimeRangePicker names={['dateStart', 'dateEnd']} form={form} />
            </Item>
            <Item label="名称" {...formItemLayout}>
              {getFieldDecorator('batchName')(
                <Input placeholder="请输入任务名称" style={{ width: 200 }} />
              )}
            </Item>
          </Col>
        </Row>

        <Item {...tailFormItemLayout}>
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
    </Card>
  );
}

const mapStateToProps = ({ recruit = {} }) => ({ recruit });
export default connect(mapStateToProps)(Form.create({})(Index));
