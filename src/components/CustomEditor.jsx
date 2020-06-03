import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Plugin/wangEditor/js/wangEditor';
import wangeditorBtnPlug from './Plugin/wangEditor/js/wangEditorBtnPlug';
import wangeditorCustomPlugs from './Plugin/wangEditor/js/wangeditorCustomPlugs';
import wangedtorMRCPlug from './Plugin/wangEditor/js/wangEditorMRCPlug';
// import './Plugin/wangEditor/css/wangEditor.css';

function keepLastIndex(obj) {
  if (window.getSelection) {
    // ie11 10 9 ff safari
    obj.focus(); // 解决ff不获取焦点无法定位问题
    const range = window.getSelection(); // 创建range
    range.selectAllChildren(obj); // range 选择obj下所有子内容
    range.collapseToEnd(); // 光标移至最后
  } else if (document.selection) {
    // ie10 9 8 7 6 5
    const range = document.selection.createRange(); // 创建选择对象
    range.moveToElementText(obj); // range定位到obj
    range.collapse(false); // 光标移至最后
    range.select();
  }
}

class WangEditor extends Component {
  static contextTypes = {
    handleSetContentValueByType: PropTypes.func,
    handlChanged: PropTypes.func,
    handleSetMessage: PropTypes.func,
  };
  state = {
    isCompositions: true,
  };
  componentDidMount() {
    const { value, onChange, name, content } = this.props;
    const { wangEditor: WANGEditor } = window;
    wangeditorCustomPlugs.templateLinkA(); // 给所有编辑器扩展菜单栏
    wangeditorBtnPlug.templateBtn(); // 给所有编辑器扩展菜单栏
    wangedtorMRCPlug.templateMRC(); // 给节点编辑器扩展菜单栏
    this.editor = new WANGEditor(this.wangEditor);
    this.editor.config.uploadImgUrl = '/api/system/conf/picture/upload';
    this.editor.config.jsFilter = true; // js过滤
    this.editor.config.pasteFilter = true; // 粘贴过滤
    this.editor.config.pasteText = true; // 文本粘贴
    this.editor.config.hideLinkImg = true; // 隐藏网络图片
    this.editor.config.menus = [
      // 菜单
      'source',
      '|',
      'bold',
      'underline',
      'italic',
      'strikethrough',
      'eraser',
      'forecolor',
      'bgcolor',
      '|',
      'fontsize',
      'unorderlist',
      '|',
      'link',
      'unlink',
      'table',
      'templateBtn',
      'templateMRC',
      'img',
      '|',
      'templateLinkA',
      'undo',
      'redo',
    ];
    this.editor.create();
    this.editor.$txt.html(value || '<p><br></p>');
    this.wangEditor.addEventListener('compositionstart', () => {
      // 非直接的文字输入时（键盘输入中文的拼音）
      this.setState({ isCompositions: false });
      // this.isCompositions = false;
    });
    this.wangEditor.addEventListener('compositionend', () => {
      // 直接输入文字后（键盘选择真实的汉字）
      this.setState({ isCompositions: true });
      // this.isCompositions = true;
    });
    if (content) {
      this.context.handleSetContentValueByType(name, content);
      this.context.handleSetMessage && this.context.handleSetMessage(name, content);
    }
    this.editor.onchange = () => {
      // onChange(this.editor.$txt.html())
      this.context.handleSetContentValueByType(name, this.editor.$txt.html());
      this.context.handleSetMessage && this.context.handleSetMessage(name, this.editor.$txt.html());
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      if (this.state.isCompositions) {
        this.editor.$txt.html(nextProps.value);
      }
      keepLastIndex(this.wangEditor);
    }
  }
  componentDidUpdate() {
    if (this.props.content === null) {
      this.editor.$txt.html('<p><br></p>');
    }
  }
  componentWillUnmount() {
    const { content, isClear } = this.props;
    if (content && !isClear) {
      if (this.editor.$txt && typeof this.editor.$txt.clear === 'function') {
        this.editor.$txt.clear();
      }
    }
  }
  handleKeydown() {
    this.context.handlChanged && this.context.handlChanged();
  }
  render() {
    return (
      <div
        contentEditable="true"
        ref={wangEditor => {
          this.wangEditor = wangEditor;
        }}
        className="editor editor-trigger"
        onKeyDown={() => {
          this.handleKeydown();
        }}
      />
    );
  }
}

export default WangEditor;
