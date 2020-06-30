import React from 'react';
import { RegisterNode } from 'gg-editor';

class RegNode extends React.Component {
  render() {
    const config = {
      getStyle(item) {
        const model = item.getModel();
        const { color, size } = model;

        return {
          stroke: color || '#A3B1BF',
          lineWidth: size || 5,
        };
      },
    };

    return (
      <RegisterNode
        name="model-normal"
        config={{
          draw(item) {
            const group = item.getGraphicGroup();
            const model = item.getModel();
            const width = 80;
            const height = 48;
            const x = -width / 2;
            const y = -height / 2;
            const borderRadius = 4;

       
            const keyShape = group.addShape('rect', {
              attrs: {
                x,
                y,
                width,
                height,
                radius: borderRadius,
                fill: '#E6F7FF',
                stroke: '#1890FF',//'rgba(250,140,22,0.5)',
              },
            });
            
        
            // 名称文本
            const label = model.label ? `${model.id}\n${model.label}` : '自定义普通节点';

            group.addShape('text', {
              attrs: {
                text: label,
                x: 0, // 居中
                y: 0,
                textAlign: 'center',
                textBaseline: 'middle',
                fill: 'rgba(0,0,0,0.65)',
              },
            });

            return keyShape;
          },
        }}
      />
    );
  }
}

export default RegNode;
