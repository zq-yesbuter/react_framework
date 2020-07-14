import { Col, Row } from 'antd';
import GGEditor from 'gg-editor';
import React from 'react';
import EditorMinimap from './components/EditorMinimap';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from './components/EditorDetailPanel';
import { FlowItemPanel } from './components/EditorItemPanel';
import { FlowToolbar } from './components/EditorToolbar';
import './index.less';
import FlowBody from './FlowBody';


GGEditor.setTrackable(false);

const letee:any = {"nodes":[{"type":"node","size":"80*48","shape":"model-normal","color":"#FA8C16","label":"全局节点","x":257.515625,"y":81,"id":"fc7a7343","index":0},
{"type":"node","size":"80*48","shape":"model-global","color":"#FA8C16","label":"全局节点","x":258.515625,"y":203,"id":"fb707e17","index":1}],
"edges":[{"source":"fc7a7343","sourceAnchor":2,"target":"fb707e17","targetAnchor":0,"id":"fccdc5ab","index":2}]}
const data = JSON.parse(JSON.stringify(letee));
// {
//   nodes: [{
//     type: 'node',
//     size: '70*70',
//     shape: 'flow-circle',
//     color: '#FA8C16',
//     label: '起止节点',
//     x: 55,
//     y: 55,
//     id: 'ea1184e8',
//     index: 0,
//   }, {
//     type: 'node',
//     size: '70*70',
//     shape: 'flow-circle',
//     color: '#FA8C16',
//     label: '结束节点',
//     x: 55,
//     y: 255,
//     id: '481fbb1a',
//     index: 2,
//   }],
//   edges: [{
//     source: 'ea1184e8',
//     sourceAnchor: 2,
//     target: '481fbb1a',
//     targetAnchor: 0,
//     id: '7989ac70',
//     index: 1,
//   }],
// };
export default () => (
  <div>
    <GGEditor className="editor">
      <Row type="flex" className="editorHd">
        <Col span={24}>
          <FlowToolbar />
        </Col>
      </Row>
      <Row type="flex" className="editorBd">
        <Col span={4} className="editorSidebar">
          <FlowItemPanel />
        </Col>
        <Col span={16} style={{display: 'flex',flexDirection: 'column'}}>
          <FlowBody id='flowBody' data={data} />
        </Col>
        <Col span={4} className="editorSidebar">
          <FlowDetailPanel />
          <EditorMinimap />
        </Col>
      </Row>
      <FlowContextMenu />
    </GGEditor>
  </div>
);

