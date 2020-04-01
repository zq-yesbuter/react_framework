import { Table, Dropdown, Button } from 'antd';
import React, { Fragment } from 'react';

const renderTable = ({
  data,
  columns,
  total,
  loading,
  onChange,
  pageSize = 10,
  rowSelection,
  sortedInfo,
  current,
  defaultCurrent = 1,
  selectedRowKeys,
  importMenu,
  rowKey,
}) => {
  const pagination = {
    defaultCurrent,
    total,
    pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: (current, pageSize) => {
      onChange((current - 1) * pageSize, pageSize, sortedInfo);
    },
    onChange: (current, pageSize) => {
      onChange((current - 1) * pageSize, pageSize, sortedInfo);
    },
    showTotal: (total, range) => {
      return `展示第${range[0]}至${range[1]}条数据，共${total}条数据`;
    },
    current,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Fragment>
      <Table
        style={{ marginTop: 15 }}
        size="small"
        pagination={{ ...pagination }}
        dataSource={data || []}
        columns={columns || []}
        rowKey={rowKey}
        loading={loading || false}
        rowSelection={{ ...rowSelection }}
        onChange={(page, filter, sorter) => {
          onChange((page.current - 1) * page.pageSize, page.pageSize, sorter);
        }}
      />
      <div>
        <Dropdown
          overlay={importMenu}
          trigger={['hover']}
          placement="bottomCenter"
          disabled={!hasSelected}
        >
          <Button type="primary">批量操作</Button>
        </Dropdown>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}
        </span>
      </div>
    </Fragment>
  );
};
export default renderTable;
