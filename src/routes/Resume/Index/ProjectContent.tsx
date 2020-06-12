import React, { Fragment } from 'react';
import { Typography } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import './index.less';

const { Paragraph } = Typography;
const format = 'YYYY-MM-DD';

function Project({ projects }: { projects: any }): any {
  return (
    <li className="chanceItem" style={{ position: 'relative' }}>
      {projects && projects.length ? (
        <Fragment>
          {projects.map((item: any, index: number) => (
            <Fragment key={`main-projects-${index}`}>
              <div className="carousel" key={`projects-${index}`}>
                <Paragraph
                  style={{ flex: 1, marginRight: 5, fontWeight: 600, fontSize: 16, marginTop: 40 }}
                >
                  {`项目：  ${item.name || ''}`}
                </Paragraph>
                <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Paragraph style={{ flex: 1 }}>{`职位：  ${item.position || ''}`}</Paragraph>
                  <Paragraph style={{ marginBottom: 5 }}>
                    {`起止时间： ${item.startDate ? moment(item.startDate).format(format) : ''} ~ ${
                      item.endDate ? moment(item.endDate).format(format) : ''
                    }`}
                  </Paragraph>
                </Paragraph>
                <p style={{ whiteSpace: 'pre-line' }}>
                  {item.content && `项目内容：${item.content}`}
                </p>
                <p style={{ whiteSpace: 'pre-line' }}>{item.work && `项目职责：${item.work}`}</p>
              </div>
            </Fragment>
          ))}
        </Fragment>
      ) : (
        <div className="noContent">暂无</div>
      )}
    </li>
  );
}

export default Project;
