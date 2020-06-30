import { Card, Form, Input, Select, Button, Modal } from 'antd';
import React, { Fragment } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { withPropsAPI } from 'gg-editor';
import AddModal from '../../../../Words/Config/AddModal';

const upperFirst = (str: string) =>
  str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
interface DetailFormProps extends FormComponentProps {
  type: string;
  propsAPI?: any;
}

class DetailForm extends React.Component<DetailFormProps> {
  state = {
    visible:false,
  }
  get item() {
    const { propsAPI } = this.props;

    return propsAPI.getSelected()[0];
  }

  handleSubmit = (e: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;
    console.log(propsAPI);

    setTimeout(() => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }

        const item = getSelected()[0];

        if (!item) {
          return;
        }

        executeCommand(() => {
          update(item, {
            ...values,
          });
        });
      });
    }, 0);
  };

  renderEdgeShapeSelect = () => (
    <Select onChange={this.handleSubmit}>
      <Option value="flow-smooth">平滑</Option>
      <Option value="flow-polyline">折线</Option>
      <Option value="flow-polyline-round">曲折现</Option>
    </Select>
  );

  renderNodeDetail = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { label, color, id } = this.item.getModel();
    return (
      <Fragment>
        <Item label="节点ID" {...inlineFormItemLayout}>
          {getFieldDecorator('nodeId', {
             initialValue: id,
          })(<div>{id}</div>)}
        </Item>
        <Item label="节点名称" {...inlineFormItemLayout}>
          {getFieldDecorator('label', {
            initialValue: label,
          })(<Input onBlur={this.handleSubmit} />)}
        </Item>
        <Item label="触发意图" {...inlineFormItemLayout}>
          {getFieldDecorator(
            'intent',
            {}
          )(
            <Select
              mode="multiple"
              // style={{ width: '100%' }}
              placeholder="Please select"
              // onChange={handleChange}
            >
              <Option key={'a10'}>{'a10'}</Option>
              <Option key={'c12'}>{'c12'}</Option>
            </Select>
          )}
        </Item>
        <Item label="触发规则" {...inlineFormItemLayout}>
          {getFieldDecorator(
            'rule',
            {}
          )(
            <Select
              mode="multiple"
              // style={{ width: '100%' }}
              placeholder="Please select"
              // onChange={handleChange}
            >
              <Option key={'a10'}>{'a10'}</Option>
              <Option key={'c12'}>{'c12'}</Option>
            </Select>
          )}
        </Item>
        {color === '#FA8C16' && (
          <Item label="对话时长" {...inlineFormItemLayout}>
            {getFieldDecorator('duration', {})(<Input onBlur={this.handleSubmit} />)}
          </Item>
        )}
        <Item label="应答话术" {...inlineFormItemLayout}>
          <a >新增话术</a>
          {getFieldDecorator('wordName', {})(<Input onBlur={this.handleSubmit} />)}
          {getFieldDecorator('wordContent', {})(<TextArea rows={4} />)}
        </Item>
        {color === '#FA8C16' ? (
          <Item label="是否结束" {...inlineFormItemLayout}>
            {getFieldDecorator(
              'over',
              {}
            )(
              <Select
                // style={{ width: '100%' }}
                placeholder="Please select"
                // onChange={handleChange}
              >
                <Option key="yes" value="yes">
                  是
                </Option>
                <Option key="no" value="no">
                  否
                </Option>
              </Select>
            )}
          </Item>
        ) : (
          <Fragment>
            <Item label="是否挂机" {...inlineFormItemLayout}>
              {getFieldDecorator(
                'hangup',
                {}
              )(
                <Select
                  // style={{ width: '100%' }}
                  placeholder="Please select"
                  // onChange={handleChange}
                >
                  <Option key="yes" value="yes">
                    是
                  </Option>
                  <Option key="no" value="no">
                    否
                  </Option>
                </Select>
              )}
            </Item>
            <Item label="挂机原因" {...inlineFormItemLayout}>
              {getFieldDecorator(
                'reason',
                {}
              )(
                <Select
                  // style={{ width: '100%' }}
                  placeholder="Please select"
                  // onChange={handleChange}
                >
                  <Option key={'a10'} value="gettime">
                    已确认面试时间
                  </Option>
                </Select>
              )}
            </Item>
          </Fragment>
        )}
        <Item {...tailLayout}>高级设置</Item>
        <Item label="节点跳转" {...inlineFormItemLayout}>
          {getFieldDecorator('jump', {})(<Input onBlur={this.handleSubmit} />)}
        </Item>
        <Item label="允许打断" {...inlineFormItemLayout}>
          {getFieldDecorator(
            'stop',
            {}
          )(
            <Select
              // style={{ width: '100%' }}
              placeholder="Please select"
              // onChange={handleChange}
            >
              <Option key="yes" value="yes">
                是
              </Option>
              <Option key="no" value="no">
                否
              </Option>
            </Select>
          )}
        </Item>
        <Item label="上限次数" {...inlineFormItemLayout}>
          {getFieldDecorator(
            'limit',
            {}
          )(
            <Select
              // style={{ width: '100%' }}
              placeholder="Please select"
              // onChange={handleChange}
            >
              <Option key="1" value={1}>
                1
              </Option>
              <Option key="2" value={2}>
                2
              </Option>
            </Select>
          )}
        </Item>
        <Item label="等待时间" {...inlineFormItemLayout}>
          {getFieldDecorator(
            'waittime',
            {}
          )(
            <Select
              // style={{ width: '100%' }}
              placeholder="Please select"
              // onChange={handleChange}
            >
              <Option key={'a10'} value="60s">
                60s
              </Option>
              <Option key={'c12'} value="40s">
                40s
              </Option>
            </Select>
          )}
        </Item>
        <Item label="停顿检测" {...inlineFormItemLayout}>
          {getFieldDecorator(
            'waittest',
            {}
          )(
            <Select
              // style={{ width: '100%' }}
              placeholder="Please select"
              // onChange={handleChange}
            >
              <Option key={'a10'} value="60s">
                60s
              </Option>
              <Option key={'c12'} value="40s">
                40s
              </Option>
            </Select>
          )}
        </Item>
        <Item label="节点标签" {...inlineFormItemLayout}>
          {getFieldDecorator(
            'nodeLabel',
            {}
          )(
            <Select
              mode="multiple"
              // style={{ width: '100%' }}
              placeholder="Please select"
              // onChange={handleChange}
            >
              <Option key={'a10'} value={'a10'}>
                {'a10'}
              </Option>
              <Option key={'c12'} value={'c12'}>
                {'c12'}
              </Option>
            </Select>
          )}
        </Item>
        <Item label="词槽收集" {...inlineFormItemLayout}>
          {getFieldDecorator(
            'slot',
            {}
          )(
            <Select
              mode="multiple"
              // style={{ width: '100%' }}
              placeholder="Please select"
              // onChange={handleChange}
            >
              <Option key={'a10'} value={'a10'}>
                {'a10'}
              </Option>
              <Option key={'c12'} value={'c12'}>
                {'c12'}
              </Option>
            </Select>
          )}
        </Item>
        <Item {...tailLayout}>
          <Button htmlType="submit" type="primary" className="test-input-search">
            保存
          </Button>
        </Item>
      </Fragment>
    );
  };

  renderEdgeDetail = () => {
    const { form } = this.props;
    const { label = '', shape = 'flow-smooth' } = this.item.getModel();

    return (
      <Fragment>
        <Item label="名称" {...inlineFormItemLayout}>
          {form.getFieldDecorator('label', {
            initialValue: label,
          })(<Input onBlur={this.handleSubmit} />)}
        </Item>
        <Item label="类型" {...inlineFormItemLayout}>
          {form.getFieldDecorator('shape', {
            initialValue: shape,
          })(this.renderEdgeShapeSelect())}
        </Item>
      </Fragment>
    );
  };

  renderGroupDetail = () => {
    const { form } = this.props;
    const { label = '新建分组' } = this.item.getModel();

    return (
      <Item label="组名称" {...inlineFormItemLayout}>
        {form.getFieldDecorator('label', {
          initialValue: label,
        })(<Input onBlur={this.handleSubmit} />)}
      </Item>
    );
  };

  render() {
    const { type } = this.props;

    if (!this.item) {
      return null;
    }
    const formatTitle = {
      '': '', 
      node: '节点',
      edge: '连线',
      group: '组',
    };
    return (
      <Card type="inner" size="small" title={formatTitle[type]} bordered={false}>
        <Form onSubmit={this.handleSubmit}>
          {type === 'node' && this.renderNodeDetail()}
          {type === 'edge' && this.renderEdgeDetail()}
          {type === 'group' && this.renderGroupDetail()}
        </Form>
        <AddModal visible={this.state.visible} />
      </Card>
    );
  }
}

export default Form.create<DetailFormProps>()(withPropsAPI(DetailForm as any));
//style={{height: '53vh',overflowY: 'auto'}}
