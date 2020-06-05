import React, { Fragment, useState } from 'react';
import { Card, message, Button, Upload, Icon } from 'antd';
import Detail from './Detail';
import { upload } from '@/services/resume';
import styles from './index.less';

const { Dragger } = Upload;

interface Props {}
function ResumeIndex(props: Props) {
  const [detail, setDetail] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [resume, setResume] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [fileList, setFileList] = useState([]);

  const uploadProps: any = {
    name: 'file',
    multiple: false,
    accept: 
      '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf',
    // action:'/resume/attachments/analyse',
    action: (file: any) => {
      const formData = new FormData();
      formData.append('resumeAttaches', file);
      setFileList([file]);
      setLoading(true);
      upload(formData)
        .then((resumes: any) => {
          setDisabled(false);
          let res = resumes && resumes[0];
          setResume(res);
          message.success(`${file.name} 文件解析成功`);
          setLoading(false);
          setContent(file.name);
        })
        .catch((e: any) => {
          setDisabled(true);
          setLoading(false);
          setContent('');
          message.success(`${file.name} 文件解析失败`);
        });
      return;
    },
    fileList,
    customRequest:() => {}, // 阻止上传的默认行为
  };
  return (
    <Card
      bordered={false}
      title={
        <Fragment>
          简历预览
          {detail && (
            <a
              href="javascript:;"
              style={{
                padding: '5px 15px',
                fontSize: 14,
              }}
              onClick={e => {
                e.preventDefault();
                setDetail(false);
                setContent('');
                setDisabled(true);
                setFileList([]);
              }}
            >
              返回上传简历界面
            </a>
          )}
        </Fragment>
      }
    >
      <div style={{ height: '100%' }}>
        {!detail ? (
          <div className={styles['upload-div']}>
            <h1 className={styles['upload-div-header']}>简历智能解析</h1>
            <Dragger {...uploadProps}>
              {loading ? (
                <span style={{ color: '#32325d', fontSize: 18 }}>简历上传解析中······</span>
              ) : content ? (
                <span style={{ color: '#32325d', fontSize: 18 }}>{content}</span>
              ) : (
                <Fragment>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p
                    className="ant-upload-text"
                    style={{ color: '#32325d', fontSize: '22px', fontWeight: 600 }}
                  >
                    点击或拖拽
                  </p>
                  <p className="ant-upload-hint" style={{ color: '#32325d', fontSize: 18 }}>
                    即可上传简历文件
                  </p>
                </Fragment>
              )}
            </Dragger>
            <div style={{ textAlign: 'center', marginTop: 30 }}>
              <Button
                type="primary"
                onClick={() => {
                  setDetail(true);
                }}
                disabled={disabled}
              >
                开始解析
              </Button>
            </div>
          </div>
        ) : (
          <Detail resume={resume} />
        )}
      </div>
    </Card>
  );
}

export default ResumeIndex;
