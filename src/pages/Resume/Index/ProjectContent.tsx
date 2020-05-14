import React, { useState, useEffect, Fragment, useRef } from 'react';
import {
  Input,
  Form,
  Typography,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
// import { TextLayerBuilder } from '@/pdfjs-dist/web/pdf_viewer.js';
// import '@/pdfjs-dist/web/pdf_viewer.css';
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
    resumeObj: { name, tel, skills, projects, educations, companys, channel },
    selectJobId,
    jobList,
  },
  form,
  dispatch,
}) {
  const pContent = useRef(null);
  const [value, setValue] = useState();
  const [pExpand, setPExpand] = useState(1);
  const [projectContent, setProjectContent] = useState(false);

  const prevSelectJobId = usePrevious(selectJobId);
  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      // eslint-disable-next-line no-lonely-if
      if (prevSelectJobId !== selectJobId) {
        setProjectContent(false);
      }
    }
  });

  return (
    <li className={styles.chanceItem} style={{ position: 'relative' }}>
      {projects && projects.length ? (
        <Fragment>
            {projects.map((item:any, index:number) => (
              <Fragment key={`main-projects-${index}`}>
                <div className={styles.carousel} key={`projects-${index}`}>
                  <Paragraph style={{ marginBottom: 5 }}>
                    {`起止时间： ${moment(item.startDate).format(format)} ~ ${
                      item.endDate ? moment(item.endDate).format(format) : '至今'
                    }`}
                  </Paragraph>
                  <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Paragraph style={{ flex: 1, marginRight: 5 }}>
                      {`项目：  ${item.name || '无'}`}
                    </Paragraph>
                    <Paragraph style={{ flex: 1 }}>
                      {`职位：  ${item.position || '无'}`}
                    </Paragraph>
                  </Paragraph>
                  <p
                    className={pExpand === 1 ? styles.expand : null}
                    ref={pContent}
                    id={`projectContent-${index}`}
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
