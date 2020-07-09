import React from 'react';
import { Form, Button, Select } from 'antd';
import { connect } from 'dva';
import queryString from 'query-string';
import TrimInput from '../../../components/TrimInput';
import { nameStatus } from '../contant';

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
  form: any;
  formatResult: any;
  onSubmit: any;
  namelist: any;
  dispatch: Function;
}
function QueryForm(props: Props) {
  const {
    form,
    formatResult,
    onSubmit,
    namelist: { resultList },
    dispatch,
  } = props;
  const handleSubmit = (e: any) => {
    e.preventDefault();
    form.validateFields((err: any, values: any) => {
      if (!err) {
        onSubmit(typeof formatResult === 'function' ? formatResult(values) : values);
      }
    });
  };
  // // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  // useImperativeHandle(ref, () => ({
  //   // reset 就是暴露给父组件的方法
  //   reset: () => {
  //     const { getFieldDecorator, resetFields } = form;

  //   }
  // }));
  const { getFieldDecorator, resetFields } = form;
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Form layout="inline" onSubmit={handleSubmit}>
      <FormItem label="人才搜索">{getFieldDecorator('name')(<TrimInput />)}</FormItem>
      <FormItem label="状态筛选">
        {getFieldDecorator('status')(
          <Select placeholder="请选择状态" style={{ width: 200 }}>
            {nameStatus.map(item => (
              <Option value={item.value} key={item.value}>
                {item.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem label="挂机原因">
        {getFieldDecorator('result')(
          <Select placeholder="请选择挂机原因" style={{ width: 200 }}>
            {resultList &&
              resultList.length &&
              resultList.map((item: string) => (
                <Option value={item} key={item}>
                  {item && item.indexOf('#') > 0 ? item.slice(item.indexOf('#') + 1) : item}
                </Option>
              ))}
          </Select>
        )}
      </FormItem>
      <FormItem>
        <Button htmlType="submit" type="primary" className="test-input-search">
          搜索
        </Button>
        <Button
          style={{ margin: '0 10px' }}
          className="test-input-search"
          onClick={e => {
            resetFields();
            const { search } = window.location;
            const { dataStatus } = queryString.parse(search);
            dispatch({
              type: 'namelist/save',
              payload: { nameRequest: { dataStatus: dataStatus ? 2 : 1, pageSize: 200, pageNum: 1} },
            });
            form.validateFields((err: any, values: any) => {
              if (!err) {
                onSubmit({ ...values, pageSize: 200, pageNum: 1 });
              }
            });
          }}
        >
          重置
        </Button>
      </FormItem>
    </Form>
  );
}

const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Form.create({})(QueryForm));
