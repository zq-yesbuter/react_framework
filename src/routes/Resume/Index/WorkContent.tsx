import React, { Fragment } from 'react';
import { Typography } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import './index.less';

const { Paragraph } = Typography;
const format = 'YYYY-MM-DD';
function Resume({ companies }: { companies: any }) {
  return (
    <li className='chanceItem'>
      {companies && companies.length ? (
        <Fragment>
          {companies.map((item: any, index: number) => (
            <Fragment key={`main-companys-${index}`}>
              <div className='carousel' key={`companys-${index}`}>
                <Paragraph style={{ flex: 1, marginRight: 10,fontWeight:600,fontSize:16,marginTop:40  }}>
                  {`公司：  ${item.name || ''}`}
                </Paragraph>
                <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Paragraph style={{ flex: 1 }}>{`职位：  ${item.position || ''}`}</Paragraph>
                  <Paragraph>
                  {`起止时间：${item.startDate ? moment(item.startDate).format(format) : ''} ~ ${
                    item.endDate ? moment(item.endDate).format(format) : ''
                  }`}
                </Paragraph>
                </Paragraph>
                <p style={{whiteSpace: 'pre-line'}} >{item.content && `工作内容：${item.content}`}</p>
                <p style={{whiteSpace: 'pre-line'}} >{item.work && `工作职责：${item.work}`}</p>
              </div>
            </Fragment>
          ))}
        </Fragment>
      ) : (
        <div className='noContent'>暂无</div>
      )}
    </li>
  );
}

export default Resume;
