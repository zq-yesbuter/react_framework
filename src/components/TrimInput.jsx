import React from 'react';
import { Input } from 'antd';

function TrimTextArea({ onChange = () => {}, onBlur = () => {}, props }) {
  return (
    <Input.TextArea
      maxLength="100"
      {...props}
      onBlur={e => {
        e.target.value = (e.target.value || '').trim();
        onChange(e);
        onBlur(e);
      }}
    />
  );
}

function TrimInput({ onChange = () => {}, onBlur = () => {}, props }) {
  return (
    <Input
      maxLength="30"
      {...props}
      onBlur={e => {
        e.target.value = (e.target.value || '').trim();
        onChange(e);
        onBlur(e);
      }}
    />
  );
}

TrimInput.TextArea = TrimTextArea;

export default TrimInput;
