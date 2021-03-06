import React, { PureComponent } from 'react';
import { Input } from 'antd';

class TrimTextArea extends PureComponent {
  static defaultProps = {
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    return (
      <Input.TextArea
        maxLength="100"
        {...this.props}
        onBlur={e => {
          e.target.value = (e.target.value || '').trim();
          this.props.onChange(e);
          this.props.onBlur(e);
        }}
      />
    );
  }
}

class TrimInput extends PureComponent {
  static defaultProps = {
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    return (
      <Input
        maxLength="30"
        {...this.props}
        onBlur={e => {
          e.target.value = (e.target.value || '').trim();
          this.props.onChange(e);
          this.props.onBlur(e);
        }}
      />
    );
  }
}

TrimInput.TextArea = TrimTextArea;

export default TrimInput;
