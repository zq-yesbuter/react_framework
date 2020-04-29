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
  Select,
} from 'antd';
import queryString from 'query-string';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import DateFormat from '@/components/DateFormat';
import renderTable from '@/components/SelectTable';
import { addBatch, batchRelated, batchCancel, batchDelete } from '@/services/nameList';
import DateTimeRangePicker from '@/components/DateTimeRangePicker';
import styles from './index.less';

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 19,
      offset: 5,
    },
  },
};
function Index({ dispatch, location, recruit, form }) {
  const { batchList, ivrIntents, batchCur, batchPageSize, batchRequest } = recruit;
  const [classValue, setClassValue] = useState([{ inner: [{}] }]);
  const [loading, setLoading] = useState(false);
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
        console.log('values===>', values);
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
        })
      );
    }
  };
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function innerDelete() {}

  function addClass() {
    const newData = _.cloneDeep(classValue);
    if (newData.length > 4) {
      message.error('最多智能配置五条！');
      return;
    }
    newData.push({inner:[{}]});
    setClassValue(newData);
  }
  return (
    <Card
      bordered={false}
      title={
        <div>
          配置首页banner
          <a style={{ marginLeft: 10 }} onClick={addClass}>
            新增分类
          </a>
        </div>
      }
    >
      <Form onSubmit={handleSubmit} {...formItemLayout}>
        {classValue.map((item, index) => (
          <div className={styles.classItem}>
            <Item label="分类消息">
              {getFieldDecorator(`batch[${index}].type`)(
                <Input placeholder="请输入分类消息" style={{ width: 300 }} />
              )}
            </Item>
            <Item label="分类标题">
              {getFieldDecorator(`batch[${index}].name`)(
                <Input placeholder="请输入分类标题" style={{ width: 300 }} />
              )}
            </Item>
            <Item label="分类顺序">
              {getFieldDecorator(`batch[${index}].batchName`)(
                <Input placeholder="请输入分类顺序" style={{ width: 300 }} />
              )}
            </Item>
            <Item label="分类内容">
              {getFieldDecorator(`batch[${index}].content`)(
                <TextArea rows={4} style={{ width: 300 }} />
              )}
            </Item>
            <Item label="分类小类">
              <div>
                最多配置5个小类，图片尺寸700*560<a style={{ marginLeft: 10 }}>新增小类</a>
              </div>
              {item.inner && item.inner.length
                ? item.inner.map((val,_index) => (
                    <Fragment>
                      <Fragment>小类信息</Fragment>
                      <div style={{ display: 'flex' }}>
                        <div>
                          {getFieldDecorator(`batch[${index}].inner[${_index}].file`)(
                            <Upload
                              name="avatar"
                              listType="picture-card"
                              className="avatar-uploader"
                              showUploadList={false}
                              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
                        </div>
                        <div>
                          <Item>
                            <span
                              style={{
                                paddingLeft: 4,
                                color: 'rgba(0,0,0,.75)',
                              }}
                            >
                              小类顺序：
                            </span>
                            {getFieldDecorator(`batch[${index}].inner[${_index}].innerClass`)(
                              <Select style={{ width: 350 }}>
                                <Option value="ddd">ddd</Option>
                              </Select>
                            )}
                          </Item>
                          <Item>
                            <span
                              style={{
                                paddingLeft: 4,
                                color: 'rgba(0,0,0,.75)',
                              }}
                            >
                              展示时段：
                            </span>
                            <DateTimeRangePicker
                              names={[`batch[${index}].inner[${_index}].dateBegin`, `batch[${index}].dateEnd`]}
                              form={form}
                            />
                          </Item>
                          <Item>
                            <span
                              style={{
                                paddingLeft: 4,
                                color: 'rgba(0,0,0,.75)',
                              }}
                            >
                              跳转链接：
                            </span>
                            {getFieldDecorator(`batch[${index}].inner[${_index}].link`)(
                              <Input placeholder="请输入跳转链接" style={{ width: 200 }} />
                            )}
                          </Item>
                          <Item>
                            <span
                              style={{
                                paddingLeft: 4,
                                color: 'rgba(0,0,0,.75)',
                              }}
                            >
                              小类内容：
                            </span>
                            {getFieldDecorator(`batch[${index}].inner[${_index}].content`)(
                              <Input placeholder="请输入小类内容" style={{ width: 200 }} />
                            )}
                          </Item>
                          <Item>
                            <a onClick={() => innerDelete()}>清空</a>
                          </Item>
                        </div>
                      </div>
                    </Fragment>
                  ))
                : null}
            </Item>
          </div>
        ))}
        <Item {...tailFormItemLayout}>
          <Button htmlType="submit" type="primary" className="test-input-search">
            保存
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
