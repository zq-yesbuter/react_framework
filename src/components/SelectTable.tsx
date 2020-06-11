import { Table } from 'antd';
import React, { Fragment } from 'react';
import { Setting } from '@/utils/tscontant';

const renderTable = (props: Setting): any => {
  const {
    data,
    columns,
    total,
    loading,
    onChange,
    pageSize = 50,
    rowSelection,
    current,
    defaultCurrent = 1,
    selectedRowKeys,
    rowKey,
    formatOperation,
    hideSelect,
  } = props;
  const pagination:any = {
    defaultCurrent,
    total,
    pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100', '200'],
    // onShowSizeChange: (current, pageSize) => {
    //   onChange((current - 1) * pageSize, pageSize, sortedInfo);
    // },
    // onChange: (current, pageSize) => {
    //   console.log('current===>',current,'pageSize===>',pageSize);
    //   onChange(current, pageSize);
    //   // onChange((current - 1) * pageSize, pageSize, sortedInfo);
    // },
    showTotal: (total:number|string, range:number|string) => {
      return `展示第${range[0]}至${range[1]}条数据，共${total}条数据`;
    },
    current,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Fragment>
      {formatOperation && formatOperation(selectedRowKeys, hasSelected)}
      <Table
        style={{ marginTop: 15 }}
        size="small"
        pagination={pagination}
        dataSource={data || []}
        columns={columns || []}
        rowKey={rowKey}
        loading={loading || false}
        rowSelection={hideSelect ? false : { ...rowSelection }}
        onChange={(page, filter, sorter) => {
          onChange(page.current = 0, page.pageSize = 0);
        }}
      />
      {/* {total ? 
        (
          <div style={{display:'flex',justifyContent: 'flex-end',margin:'10px 0' }}>
            <div style={{alignItems: 'center'}}>{`当前展示第${current}页，展示${total}条`}</div>
            <Button style={{marginLeft:10}} size="small" onClick={() => prev()} disabled={current===1}>上一页</Button>
            <Button style={{marginLeft:10}} size="small" onClick={() => next()} disabled={showNext}>下一页</Button>
            <Select
              style={{ width: '75px', marginLeft:10 }}
              size="small"
              defaultValue={50}
              onChange={onSizeChange}
            >
              {
                pageOptions.map(item => <Option value={item.value}>{item.name}</Option>)
              }
            </Select>
          </div>
        ) : null
      } */}
    </Fragment>
  );
};
export default renderTable;
