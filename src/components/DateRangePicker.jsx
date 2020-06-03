import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

class DateRangePicker extends PureComponent {
  static defaultProps = {
    names: ['begin_date', 'end_date'],
    options: [],
    format: 'x',
  };
  handleDateChange(value1, value2) {
    const { setFieldsValue } = this.props.form;
    const { names: [name1, name2], format } = this.props;
    setFieldsValue({
      [name1]: value1 ? value1.startOf('day').format(format) : value1,
      [name2]: value2 ? value2.endOf('day').format(format) : value2,
    });
  }
  render() {
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
    const { names: [name1, name2], format, options } = this.props;
    getFieldDecorator(name1, options[0] || {});
    getFieldDecorator(name2, options[1] || {});
    const startDate = getFieldValue(name1);
    const endDate = getFieldValue(name2);
    return (
      <RangePicker
        {...this.props}
        ranges={{
          昨天: [
            moment()
              .subtract(1, 'days')
              .startOf('day'),
            moment()
              .subtract(1, 'days')
              .endOf('day'),
          ],
          今天: [moment(), moment()],
          最近7日: [
            moment()
              .subtract(7, 'days')
              .startOf('day'),
            moment(),
          ],
          最近30日: [
            moment()
              .subtract(30, 'days')
              .startOf('day'),
            moment(),
          ],
        }}
        value={[
          startDate ? moment(startDate, format) : null,
          endDate ? moment(endDate, format) : null,
        ]}
        format="YYYY-MM-DD"
        onChange={([value1, value2]) => {
          this.handleDateChange(value1, value2);
        }}
      />
    );
  }
}

export default DateRangePicker;
