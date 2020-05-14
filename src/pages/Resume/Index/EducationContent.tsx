import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Form, Typography } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import styles from './index.less';


const { Paragraph, Title, Text } = Typography;
const format = 'YYYY-MM-DD';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Resume({
  chatrecord: {
    resumeObj: { educations },
    selectJobId,
    jobList,
  },
  form,
  dispatch,
}) {


  const [educationContent, setEducationContent] = useState(false);
  const prevSelectJobId = usePrevious(selectJobId);
  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      // eslint-disable-next-line no-lonely-if
      if (prevSelectJobId !== selectJobId) {
        setEducationContent(false);
      }
    }
  });

  return (
    <li className={styles.chanceItem}>
      {educations && educations.length ? (
        <Fragment>
          {educations.map((item:any, index:number) => (
            <Fragment key={`main-education-${index}`}>
              <div className={styles.carousel} key={`education-${index}`}>
                <Paragraph style={{ marginBottom: 5 }}>
                  {`起止时间： ${moment(item.startDate).format(format)} ~ ${
                    item.endDate ? moment(item.endDate).format(format) : '至今'
                  }`}
                </Paragraph>
                <Paragraph style={{ marginBottom: 5 }}>{`学校名称：  ${item.school}`}</Paragraph>
                <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Paragraph style={{ flex: 1 }}>{`学历：  ${item.diploma}`}</Paragraph>
                  <Paragraph style={{ flex: 1, marginRight: 5 }}>
                    {`专业：  ${item.major}`}
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

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(Resume));
