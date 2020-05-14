import React, { useState, useEffect, Fragment, useRef, useLayoutEffect } from 'react';
import {
  Form,
  Typography,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import styles from './index.less';


const { Paragraph, Title, Text } = Typography;
const format = 'YYYY-MM-DD';

function Resume({
  chatrecord: {
    resumeObj: { companys },
    selectJobId,
    jobList,
  },
  form,
  dispatch,
}) {
  const CRef = useRef(null);
  const cContent = useRef(null);
  const [value, setValue] = useState();
  const [cExpand, setCExpand] = useState(1);
  

  return (
    <li className={styles.chanceItem}>
      {companys && companys.length ? (
        <Fragment>
          {companys.map((item: any, index: number) => (
            <Fragment key={`main-companys-${index}`}>
              <div className={styles.carousel} key={`companys-${index}`}>
                <Paragraph>
                  {`起止时间：${moment(item.startDate).format(format)} ~ ${
                    item.endDate ? moment(item.endDate).format(format) : '至今'
                  }`}
                </Paragraph>
                <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Paragraph style={{ flex: 1, marginRight: 10 }}>
                    {`公司：  ${item.name || '无'}`}
                  </Paragraph>
                  <Paragraph style={{ flex: 1 }}>{`职位：  ${item.position || '无'}`}</Paragraph>
                </Paragraph>
                <p
                  className={cExpand === 1 ? styles.expand : null}
                  ref={cContent}
                  id={`workContent-${index}`}
                >
                  {item.content}
                </p>
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

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(Resume));
