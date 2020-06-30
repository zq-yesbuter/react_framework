import { CanvasPanel, DetailPanel, NodePanel } from 'gg-editor';

import { Card } from 'antd';
import React from 'react';
import DetailForm from './DetailForm';
import './index.less';

const MindDetailPanel = () => (
  <DetailPanel className="detailPanel">
    <NodePanel>
      <DetailForm type="node" />
    </NodePanel>
    <CanvasPanel>
      <Card type="inner" size="small" title="Canvas" bordered={false} />
    </CanvasPanel>
  </DetailPanel>
);

export default MindDetailPanel;
