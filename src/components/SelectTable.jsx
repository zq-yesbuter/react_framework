import { Table, Dropdown, Button, Select } from 'antd';
import React, { Fragment } from 'react';

const pageOptions =[
  {value:10,name:'10条'},
  {value:20,name:'20条'},
  {value:30,name:'30条'},
  {value:50,name:'50条'},
  {value:100,name:'100条'},
]

const { Option } = Select;
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
  prev,
  next,
  showNext,
  onSizeChange,
  handleDelete,
}) => {
  const pagination = {
    defaultCurrent,
    total,
    pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    // onShowSizeChange: (current, pageSize) => {
    //   onChange((current - 1) * pageSize, pageSize, sortedInfo);
    // },
    onChange: (current, pageSize) => {
      onChange(current + 1, pageSize);
      // onChange((current - 1) * pageSize, pageSize, sortedInfo);
    },
    showTotal: (total, range) => {
      console.log('展示数据==》',range,total);
      // return `展示第${range[0]}至${range[1]}条数据，共${total}条数据`;
    },
    current,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Fragment>
      <div style={{marginTop:10}}>
        {/* <Dropdown
          overlay={importMenu}
          trigger={['hover']}
          placement="bottomCenter"
          disabled={!hasSelected}
        > */}
        <Button disabled={!hasSelected} onClick={() => handleDelete(selectedRowKeys)} size='middle'>删除</Button>
        {/* </Dropdown> */}
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}
        </span>
      </div>
      <Table
        style={{ marginTop: 15 }}
        size="small"
        pagination={false}
        dataSource={data || []}
        columns={columns || []}
        rowKey={rowKey}
        loading={loading || false}
        rowSelection={{ ...rowSelection }}
        onChange={(page, filter, sorter) => {
          onChange((page.current - 1) * page.pageSize, page.pageSize, sorter);
        }}
      />
      {total ? 
        (
          <div style={{display:'flex',justifyContent: 'flex-end',margin:'10px 0' }}>
            <div style={{alignItems: 'center'}}>{`当前展示第${current}页，展示${total}条`}</div>
            <Button style={{marginLeft:10}} size="small" onClick={() => prev()} disabled={current===1}>上一页</Button>
            <Button style={{marginLeft:10}} size="small" onClick={() => next()} disabled={showNext}>下一页</Button>
            <Select
              style={{ width: '75px', marginLeft:10 }}
              size="small"
              defaultValue={10}
              onChange={onSizeChange}
            >
              {
                pageOptions.map(item => <Option value={item.value}>{item.name}</Option>)
              }
            </Select>
          </div>
        ) : null
      }
    </Fragment>
  );
};
export default renderTable;
