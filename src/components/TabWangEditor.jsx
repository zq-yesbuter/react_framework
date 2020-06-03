import React, { PureComponent } from 'react';
import { Tabs, Button } from 'antd';
import CustomEditor from './CustomEditor';
import PreviewModal from './PreviewModal';
import PropTypes from 'prop-types';

const TabPane = Tabs.TabPane;

class TabWangEditor extends PureComponent {
  static defaultProps = {};
  static childContextTypes = {
    handleSetMessage: PropTypes.func,
  };
  state = {
    type: null,
    message: null,
  };
  getChildContext() {
    return {
      handleSetMessage: this.handleSetMessage.bind(this),
    };
  }
  handleSetMessage(type, value) {
    this.setState({
      message: value,
    });
  }
  render() {
    const { contents } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { type, message } = this.state;
    const tabs = [
      {
        name: '机器人Web',
        key: 'athena_web',
      },
      {
        name: '机器人H5',
        key: 'athena_h5',
      },
      {
        name: 'Jtalk Web',
        key: 'jtalk_web',
      },
      {
        name: 'Jtalk H5',
        key: 'jtalk_h5',
      },
    ];
    return (
      <div>
        <Tabs animated={false}>
          {tabs.map(({ name, key }) => (
            <TabPane tab={name} key={key}>
              <div style={{ position: 'relative' }}>
                {getFieldDecorator(`contents.${key}`, {
                  onChange: this.handlChanged,
                })(<CustomEditor name={key} content={contents ? contents[key] : null} />)}
                <Button
                  type="primary"
                  style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 999 }}
                  onClick={() => {
                    this.setState({
                      type: key.split('_')[1],
                      message: this.state.message,
                    });
                  }}
                >
                  预览
                </Button>
              </div>
            </TabPane>
          ))}
        </Tabs>
        {type && (
          <PreviewModal
            visible={!!type}
            type={type}
            message={message}
            onCancel={() => {
              this.setState({
                type: null,
                message: null,
              });
            }}
          />
        )}
      </div>
    );
  }
}

export default TabWangEditor;
