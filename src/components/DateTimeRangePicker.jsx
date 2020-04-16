import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

class DateRangePicker extends PureComponent {
  static defaultProps = {
    names: ['begin_date', 'end_date'],
    options: [],
    format: 'YYYY-MM-DD HH:mm:ss',
  };

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
    const { names: [name1, name2], format, options, ...restProps } = this.props;
    getFieldDecorator(name1, options[0] || {});
    getFieldDecorator(name2, options[1] || {});
    const startDate = getFieldValue(name1);
    const endDate = getFieldValue(name2);
    return (
      <RangePicker
        {...restProps}
        value={[
          startDate ? moment(startDate, format) : null,
          endDate ? moment(endDate, format) : null,
        ]}
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        onChange={([value1, value2]) => {
          // let newStart = moment().format('x') * 1 + 10 * 60 * 1000;
          setFieldsValue({
            [name1]: value1 && value1.format(format),
            [name2]: value2 && value2.format(format),
          });
        }}
      />
    );
  }
}

export default DateRangePicker;
