import React, { Fragment } from 'react';
import { message } from 'antd';
import { Flow, withPropsAPI } from 'gg-editor';
import { ref } from 'react.eval';
import './index.less';
import GlobalNode from './GlobalNode';
import NormalNode from './NormalNode';

class FlowBody extends React.Component {
  constructor(props: any) {
    super(props);
    ref(this);
  }
  componentDidMount(){
    const { propsAPI }: any = this.props;
    const { executeCommand, update, find } = propsAPI;
    const item = find();
    console.log('item===>',item);
    // executeCommand(() => {
    // update(item, {
    // ...{label:123,color:'#red'},
    // });
    // });
  }

  save = () => {
    const { propsAPI }: any = this.props;
    console.log('propsAPI====>', JSON.stringify(propsAPI.save()));
    message.info(JSON.stringify(propsAPI.save()));
  };

  onAfterChange = (e:any) => {
    const { propsAPI }: any = this.props;
    if (e.action == 'add' && e.item.type == 'edge'){
      const { source, target } = e.item;
      console.log('source-===>',source,'target===>',target);
      if(source && target && target.shapeObj && source.shapeObj && source.shapeObj.type !== target.shapeObj.type){
        setTimeout(() => {
          propsAPI.executeCommand('undo');
          message.error('全局节点和普通节点之间不能连线！');  
        },0)
      }
     }
  }

  render(): React.ReactNode {
    const { data }: any = this.props;
    // console.log('data===>', data);
    // console.log('registerNode===>', RegisterNode);
    return (
      <Fragment>
        <Flow
          className="flow"
          data={data}
          onAfterChange={this.onAfterChange}
        />
        <GlobalNode />
        <NormalNode />
      </Fragment>
    );
  }
}

export default withPropsAPI(FlowBody);
