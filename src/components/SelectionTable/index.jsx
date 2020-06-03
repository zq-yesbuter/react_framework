import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

class SelectionTable extends PureComponent {
  constructor(props) {
    super(props);
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRowKeys, selectedRows);
    }
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    let {
      columns,
      list,
      page = 1,
      limit = 20,
      onChange,
      total = 0,
      pagination = {},
      size = 'middle',
      ...props
    } = this.props;
    // -1不分页
    if (limit === -1) {
      pagination = null;
    }
    return (
      <div className={styles.standardTable}>
        <Table
          size={size}
          {...props}
          columns={columns}
          dataSource={list}
          rowSelection={rowSelection}
          onChange={({ current, pageSize }, filters, sorter) => {
            onChange({
              page: current,
              limit: pageSize,
              ...this.props.query,
              ...(sorter.field ? { [sorter.field]: sorter.order } : {}),
            });
          }}
          pagination={
            pagination
              ? {
                  total,
                  showTotal: (total, range) => `共${total}条数据`,
                  current: page * 1,
                  pageSize: limit * 1,
                  showSizeChanger: true,
                  onChange: () => {},
                  showQuickJumper: true,
                  onShowSizeChange: (page = this.props.page, limit = this.props.limit) => {
                    onChange({
                      page,
                      limit,
                      ...this.props.query,
                    });
                  },
                  ...pagination,
                }
              : pagination
          }
        />
      </div>
    );
  }
}

export default SelectionTable;
