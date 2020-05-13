import React from 'react';
import { Form, Steps, Spin } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const { Step } = Steps;

function formatStatus(status:number):string {
  switch (status) {
    case 0:
      return '邀约取消';
    case 1:
      return '邀约已接受';
    case 2:
      return '邀约已拒绝';
    case 3:
      return '邀约待确定';
    case 4:
      return '邀约异常';
    default:
      return '无';
  }
}
function formatPhoneStatus(status:number):string {
  switch (status) {
    case 0:
      return '短信已发送';
    case 1:
      return '短信发送成功';
    case 2:
      return '短信发送失败';
    default:
      return '无';
  }
}
function formatRemark(channel:string|number, remark:string):string|null {
  if (channel) {
    return null;
  }
  return remark && remark.indexOf('#') > 0 ? remark.slice(remark.indexOf('#') + 1) : remark;
}
interface Props {
  namelist:any;
  loading:boolean;
}

interface Item {
  status:number;
  roundStartTime:Date|string|number;
  remark:string;
  interviewConfirmTime:Date|string|number,
  roundEndTime:Date|string|number,
  channel:string;
  messages:[];
  invitationId:string|number;
}

function RecordBottom(props:Props) {
  const { namelist: { flowList }, loading } = props;
  return (
    <div className={styles['gutter-box']}>
      <h3>外呼记录/结果</h3>
      <div className={styles.scroll}>
        {loading ? (
          <Spin style={{ marginTop: 50 }} />
        ) : (
          <Steps progressDot direction="vertical" current={10000}>
            {flowList &&
              flowList.length &&
              flowList.map(
                (item:Item) => {
                  const {
                    status,
                    roundStartTime,
                    remark,
                    interviewConfirmTime,
                    roundEndTime,
                    channel,
                    messages,
                    invitationId,
                  } = item;
                  return (
                    <Step
                      title={
                        channel ? `【${formatPhoneStatus(status)}】` : `【${formatStatus(status)}】`
                      }
                      description={
                        <div>
                          {roundStartTime ? <p>{`外呼开始时间： ${roundStartTime}`}</p> : null}
                          {messages && messages.length
                            ? messages.map(({ intent, participant, content }) =>
                                participant === 'JDGR' ? (
                                  <span>{`${intent}`}</span>
                                ) : (
                                  <p style={{ color: '#1890FF' }}>{`#${content}`}</p>
                                )
                              )
                            : null}
                          {roundEndTime ? <p>{`外呼结束时间： ${roundEndTime}`}</p> : null}
                          {interviewConfirmTime ? (
                            <p style={{ color: 'red', fontWeight: 400 }}>
                              {`用户期望面试时间： ${interviewConfirmTime}`}
                            </p>
                          ) : null}
                          <p>{formatRemark(channel, remark)}</p>
                        </div>
                      }
                      key={invitationId}
                    />
                  )
                }
              )}
          </Steps>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({
  namelist = {},
  loading: {
    effects: { 'namelist/getSigleFlowlist': loading },
  },
}) => ({ namelist, loading });
export default connect(mapStateToProps)(Form.create({})(RecordBottom));
