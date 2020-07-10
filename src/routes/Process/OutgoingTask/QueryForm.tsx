import React from 'react';
import { Form, Button, Select, Input } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { FormComponentProps } from 'antd/lib/form/Form';
import { statusOptions } from '../contant';
import DateTimeRangePicker from '@/components/DateRangePicker';
import { unique } from './utils';

const { Option } = Select;
const FormItem = Form.Item;
const now = moment().subtract(14, 'days');
const deadLine = moment();
const format = 'YYYY-MM-DD';

interface IFormComponentProps extends FormComponentProps {
  onSubmit: Function;
  dispatch: Function;
  namelist: any;
}
interface Item {
  scene: string;
  sceneDesc: string;
}
class QueryForm extends React.Component<IFormComponentProps> {
  constructor(props: IFormComponentProps) {
    super(props);
  }

  handleSubmit = () => {
    const { form, onSubmit } = this.props;
    form.validateFields((err: any, values: any) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };

  intentChange = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ scene: null });
  };

  render() {
    const { form, namelist } = this.props;
    const { getFieldDecorator, resetFields, getFieldValue } = form;
    const { ivrIntents } = namelist;
    const newIvrIntents = unique(_.cloneDeep(ivrIntents));
    const intent = getFieldValue('intent');
    return (
      <Form layout="inline">
        <FormItem label="外呼场景">
          {getFieldDecorator(
            'intent',
            {}
          )(
            <Select
              placeholder="请选择任务类型"
              onChange={() => {
                this.intentChange();
              }}
              style={{ width: 200 }}
            >
              {newIvrIntents &&
                newIvrIntents.length &&
                newIvrIntents.map(
                  (item: { intent: string | number | undefined; intentDesc: string }) => (
                    <Option value={item.intent} key={item.intent}>
                      {item.intentDesc}
                    </Option>
                  )
                )}
            </Select>
          )}
          {getFieldDecorator(
            'scenes',
            {}
          )(
            <Select placeholder="请选择任务场景" style={{ width: 200, marginLeft: 10 }} mode="multiple">
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents
                  .filter((item: { intent: any }) => item.intent === intent)
                  .map((item: Item) => {
                    const { scene, sceneDesc } = item;
                    return (
                      <Option value={scene} key={scene}>
                        {sceneDesc}
                      </Option>
                    );
                  })}
            </Select>
          )}
        </FormItem>
        <FormItem label="任务名称">
          {getFieldDecorator('batchName')(
            <Input placeholder="请输入任务名称" style={{ width: 200 }} />
          )}
        </FormItem>
        <FormItem label="任务状态">
          {getFieldDecorator('status')(
            <Select allowClear placeholder="请选择任务状态" style={{ width: 200 }}>
              {statusOptions.map((item) => (
                <Option value={item.value} key={item.value}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="创建人">
          {getFieldDecorator('created')(
            <Input placeholder="请输入创建人姓名" style={{ width: 200 }} />
          )}
        </FormItem>
        <FormItem label="更新人">
          {getFieldDecorator('modified')(
            <Input placeholder="请输入更新人姓名" style={{ width: 200 }} />
          )}
        </FormItem>
        <FormItem label="时间选项">
          <DateTimeRangePicker
            names={['dateStart', 'dateEnd']}
            form={form}
            options={[
              {
                initialValue: now.format(format),
              },
              {
                initialValue: deadLine.format(format),
              },
            ]}
          />
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit}>
            搜索
          </Button>
          <Button
            style={{ margin: '0 10px' }}
            onClick={(e) => {
              const { dispatch } = this.props;
              resetFields();
              const now = moment().subtract(14, 'days');
              const deadLine = moment();
              const format = 'YYYY-MM-DD';
              const basicBatchRequest = {
                orderBy: { createdDate: 'DESC' },
                pageSize: 20,
                pageNum: 1,
                dateStart: now.format(format) + ' 00:00:00',
                dateEnd: deadLine.format(format) + ' 23:59:59',
              };
              dispatch({
                type: 'namelist/save',
                payload: { taskQueryValue: basicBatchRequest },
              });
              const { pathname }: { pathname: String } = window.location;
              const isDelete = pathname.slice(pathname.lastIndexOf('/') + 1) === 'delete';
              dispatch({
                type: 'namelist/save',
                payload: {
                  batchRequest: { pageSize: 20, pageNum: 1, dataStatus: isDelete ? 2 :1 },
                },
              });
              const { form, onSubmit } = this.props;
              form.validateFields((err: any, values: any) => {
                if (!err) {
                  onSubmit({ ...values, pageSize: 20, pageNum: 1 });
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
}

export default connect(({ namelist }: { namelist: any }) => {
  return {
    namelist,
  };
})(Form.create({})(QueryForm));
