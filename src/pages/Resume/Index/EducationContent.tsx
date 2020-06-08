import React, { Fragment } from 'react';
import { Typography } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import styles from './index.less';

const { Paragraph } = Typography;
const format = 'YYYY-MM-DD';

function Education({ educations }: { educations: any }): any {
  return (
    <li className={styles.chanceItem}>
      {educations && educations.length ? (
        <Fragment>
          {educations.map((item: any, index: number) => (
            <Fragment key={`main-education-${index}`}>
              <div className={styles.carousel} key={`education-${index}`}>
                <Paragraph style={{ marginBottom: 5,fontWeight:600,fontSize:16,marginTop:40  }}>{`学校名称：  ${item.school}`}</Paragraph>
                <Paragraph style={{ marginBottom: 5 }}>
                  {`起止时间： ${item.startDate ? moment(item.startDate).format(format) : ''} ~ ${
                    item.endDate ? moment(item.endDate).format(format) : ''
                    }`}
                </Paragraph>
                <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Paragraph style={{ flex: 1 }}>{`学历：  ${item.diploma || ''}`}</Paragraph>
                  <Paragraph style={{ marginRight: 5 }}>
                    {`专业：  ${item.major || '无'}`}
                  </Paragraph>
                </Paragraph>
              </div>
            </Fragment>
          ))}
        </Fragment>
      ) : (
          <div className={styles.noContent}>暂无</div>
        )}
    </li>
  );
}

export default Education;
