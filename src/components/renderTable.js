import React from 'react';
import { Table } from 'antd';

const renderTable = (
  { data, columns, total, loading, onChange, pageSize = 10, rowSelection, defaultCurrent = 1 },
  paginationOption = {},
  props = {}
) => {
  const pagination = {
    defaultCurrent,
    total,
    pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: (current, pageSize) => {
      if (onChange && typeof onChange === 'function') {
        onChange((current - 1) * pageSize, pageSize);
      }
    },
    onChange: (current, pageSize) => {
      if (onChange && typeof onChange === 'function') {
        onChange((current - 1) * pageSize, pageSize);
      }
    },
    showTotal: (total, range) => {
      return `展示第${range[0]}至${range[1]}条数据，共${total}条数据`;
    },
    ...paginationOption,
  };

  return (
    <Table
      size="small"
      pagination={{ ...pagination }}
      dataSource={data || []}
      columns={columns || []}
      rowKey={(record, index) => index}
      loading={loading || false}
      rowSelection={rowSelection || null}
      {...props}
    />
  );
};

export default renderTable;
