import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Menu, Upload, Icon } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import QueryForm from '@/components/QueryForm';
import renderTable from '@/components/SelectTable';
import renderColumns from './Colums';
import AddModal from './AddModal';
import UploadModal from './UploadModal';

interface Props {
  dispatch: Function;
  intent: any;
  loading: boolean;
}

function Index(props: Props) {
  const { dispatch, intent, loading } = props;
  const { nameList, nameCur, namePageSize, nameRequest, batchDetail, nameTotal } = intent;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showVisible, setShowVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [fileList, setFileList] = useState([] as any[]);

  const query = [{type:'input',label:'搜索', key:'name', placeholder:'请输入'},
  {type:'select',label:'状态筛选',key:'status',placeholder:'请选择状态',optionValue:[]}];
  const importMenu = (
    <Menu>
      <Menu.Item key={2}>批量导出沟通汇总信息</Menu.Item>
    </Menu>
  );

  const setting: any = {
    current: nameCur,
    columns: renderColumns(dispatch, intent, setShowVisible),
    pageSize: namePageSize,
    loading,
    selectedRowKeys,
    showNext: nameList && nameList.length < namePageSize,
    data: nameList || [],
    total: nameTotal,
    onChange: (pageNum: number, pageSize: number) => {
      dispatch({
        type: 'intent/fetchBatchDetail',
        payload: { pageNum, pageSize, intent },
      });
      dispatch({
        type: 'intent/save',
        payload: { nameRequest: { ...nameRequest, pageNum, pageSize } },
      });
      setSelectedRowKeys([]);
    },
    onSizeChange: (pageSize: number) => {
      dispatch({
        type: 'intent/fetchBatchDetail',
        payload: { pageSize, intent },
      });
      dispatch({
        type: 'intent/save',
        payload: { nameRequest: { ...nameRequest, pageSize } },
      });
      setSelectedRowKeys([]);
    },
    rowKey: 'invitationId',
    rowSelection: {
      selectedRowKeys,
      onChange: (selectedRowKeys: any) => {
        setSelectedRowKeys(selectedRowKeys);
      },
    },
    importMenu,
    hasImport: true,
    // eslint-disable-next-line no-shadow
    formatOperation: (selectedRowKeys: string[] | number[], hasSelected: string[] | number[]) => {
      return (
        <div style={{ marginTop: 10 }}>
          <Button disabled={!hasSelected}>
            删除
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}
          </span>
        </div>
      );
    },
  };

  // 筛选条件
  function onSubmit(values: any) {
    const payload = { intent, ...values };
    dispatch({
      type: 'intent/fetchBatchDetail',
      payload,
    });
    dispatch({
      type: 'intent/save',
      payload: { nameRequest: { ...nameRequest, ...values } },
    });
  }

  function beforeUpload(file:any) {
    const fileType = [
      '.xls',
      '.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '',
      'application/vnd.ms-excel',
      //   'application/msword',
      //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const currentType = fileType.includes(file.type);
    if (!currentType) {
      message.error('只支持excel表格，请上传正确格式!');
      return false;
    }
    setFileList([file]);
    return false;
  }

  function onRemove(file) {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  }
  const uploadProps = {
    customRequest: () => {},
    onRemove,
    beforeUpload,
    fileList,
  };

  return (
    <Card
      bordered={false}
      title={
        <Fragment>
          语料配置
        <a
          href="javascript:;"
          style={{
            padding: '5px 15px',
            fontSize: 14,
          }}
          onClick={e => {
            e.preventDefault();
            dispatch({
              type: 'intent/save',
              payload: { nameRequest: { pageSize: 50, pageNum: 1 } },
            });
            dispatch(routerRedux.goBack());
          }}
        >
          返回上一级
        </a>
      </Fragment>
      }
      extra={
        <div style={{display:'flex'}}>
          <Upload {...uploadProps}>
            <Button type="primary" style={{marginRight:10}}>
              <Icon type="upload" />
              批量导入
            </Button>
          </Upload>
          {/* <Button icon="upload" type="primary" onClick={() => {setUploadVisible(true);}} style={{marginRight:10}}>
            批量导入 */}
          {/* </Button> */}
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              setAddVisible(true);
              // dispatch(routerRedux.push({ pathname: '/AI/scene/add' }));
            }}
          >
            单条新增
          </Button>
        </div>
      }
    >
      <QueryForm
        value={query}
        onSubmit={(data: any) => {
          onSubmit(data);
        }}
      />
      {renderTable(setting)}
      <AddModal 
        visible={addVisible}
        cancel={() => {setAddVisible(false);}}
      />
    </Card>
  );
}

export default connect(
  ({
    intent,
    loading: {
      effects: { 'intent/fetchBatchDetail': loading },
    },
  }:{
    intent:any;
    loading:any;
  }) => {
    return {
      intent,
      loading,
    };
  }
)(Index);
