/**
 * Created by zhangbohan on 17/12/25.
 */
import { Form } from 'antd';

const { createFormField } = Form;
const mapValueToFields = (props = {}, ignoreObjectInArray = true) => {
  if (props instanceof Array) {
    if (typeof props[0] === 'object' && ignoreObjectInArray) {
      return props.map(item => mapValueToFields(item, ignoreObjectInArray));
    }
  } else if (typeof props === 'object') {
    const r = {};
    for (const key in props) {
      if ({}.hasOwnProperty.call(props, key)) {
        r[key] = mapValueToFields(props[key], ignoreObjectInArray);
      }
    }
    return r;
  }
  return createFormField({
    value: props,
  });
};

export default mapValueToFields;
