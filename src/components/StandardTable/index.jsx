import React, { PureComponent } from 'react';
import { Table } from 'antd';
import './index.less';

export default class StandardTable extends PureComponent {
  render() {
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
      <div className="standardTable">
        <Table
          size={size}
          {...props}
          columns={columns}
          dataSource={list}
          onChange={({ current, pageSize }, filters, sorter) => {
            onChange({
              page: current,
              limit: pageSize,
              ...this.props.query,
              sorter: { ...(sorter.field ? sorter : {}) },
            });
          }}
          pagination={
            pagination
              ? {
                  total,
                  showTotal: (total, range) => {
                    return `展示第${range[0]}至${range[1]}条数据，共${total}条数据`;
                  },
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
