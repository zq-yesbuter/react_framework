import React, { Component } from 'react';
import E from './Editor';
import BtnPlug from 'components/Plugin/wangEditor/js/wangEditorBtnPlug';
import MRCPlug from 'components/Plugin/wangEditor/js/wangEditorMRCPlug';
import CustomPlug from 'components/Plugin/wangEditor/js/wangeditorCustomPlugs';
import './index.less';

// 菜单
const menus = [
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
const defaultConfig = {
  uploadImgUrl: '/api/system/conf/picture/upload', // 上传图片路径
  jsFilter: true, // 粘贴过滤
  pasteFilter: false, // 隐藏网络图片
  pasteText: true, // 文本粘贴
  hideLinkImg: true, // 隐藏网络图片
  menus,
};

export default class RichTextEditor extends Component {
  state = {
    editorContent: '',
  };

  componentDidMount() {
    const { value } = this.props;

    this.initEditor();
    this.eventHandler.add();
  }

  componentWillUnmount() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    this.eventHandler.remove();
  }

  // editor = null;

  editorExtend = () => {
    CustomPlug.templateLinkA(); // 给所有编辑器扩展菜单栏
    BtnPlug.templateBtn(); // 给所有编辑器扩展菜单栏
    MRCPlug.templateMRC(); // 给节点编辑器扩展菜单栏
  };

  initEditor = () => {
    const { config, value, onChange, getEditor } = this.props;
    const { editorContent } = this.state;
    const elem = this.editorElem;
    this.editor = new E(elem);
    this.editorExtend();
    this.editor.config = {
      ...this.editor.config,
      ...defaultConfig,
      ...config,
    };
    this.editor.onchange = () => {
      const editorContent = this.editor.$txt.html();
      this.setState(
        {
          editorContent,
        },
        () => {
          if (onChange && typeof onChange === 'function') {
            onChange(editorContent);
          }
        }
      );
    };
    this.editor.create();

    if (value) {
      this.editor.disable();
      this.setState(
        {
          editorContent: value,
        },
        () => {
          this.editor.$txt.html(value);
          this.editor.enable();
          elem.click();
        }
      );
    }

    if (getEditor && typeof getEditor === 'function') {
      getEditor(this.editor);
    }
  };

  handleChange = e => {
    const { onChange } = this.props;
    const { target: { value, className } } = e;
    if (className === 'code-textarea') {
      this.setState(
        {
          editorContent: value,
        },
        () => {
          if (onChange && typeof onChange === 'function') {
            onChange(value);
          }
        }
      );
    }
  };

  eventHandler = {
    add: () => {
      this.jsEditor.addEventListener('input', this.handleChange, false);
    },
    remove: () => {
      this.jsEditor.removeEventListener('input', this.handleChange, false);
    },
  };

  render() {
    const { show = true } = this.props;
    return show ? (
      <div
        className="js-editor"
        ref={el => {
          this.jsEditor = el;
        }}
      >
        <div
          contentEditable="true"
          ref={refElem => {
            this.editorElem = refElem;
          }}
          className="editor editor-trigger"
        />
      </div>
    ) : null;
  }
}
