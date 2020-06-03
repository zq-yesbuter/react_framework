import React, { PureComponent, Fragment } from 'react';
import { Button, Input } from 'antd';
import { debounce } from 'lodash-decorators';
import RichTextEditor from 'components/RichTextEditor';
import PreviewModal from 'components/PreviewModal';
import { editorType } from './setting';
import './index.less';

const { TextArea } = Input;

export const previewType = {
  mobile: 1 << 0,
  web: 1 << 1,
};

export default class EditorContent extends PureComponent {
  state = {
    content: '',
    modal: {
      preview: { show: false, data: null },
    },
  };

  componentDidMount() {
    const { value } = this.props;
    this.handleChange(value, true);
  }

  @debounce(500)
  handleChange(content = '', init = false) {
    const { onChange } = this.props;

    this.setState(
      {
        content,
      },
      () => {
        if (onChange && typeof onChange === 'function' && !init) {
          onChange(content);
        }
      }
    );
  }

  handleModalActive = (name, value) => {
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        [name]: value,
      },
    });
  };

  handleGetCharlen = (str = '') => {
    // 去掉所有的html标签；去掉类似于${1we1}字符;去掉最开始的换行符;去掉所有的空格
    const text = str
      .replace(/<[^>]+>/g, '')
      // .replace(/\$\{(.*?)\}/g,'')
      .replace(/[\r\n]/, '')
      .replace(/&nbsp;/g, ' ');

    return text.split('').reduce((acc, cur, index) => {
      const code = text.charCodeAt(index);
      acc += code >= 0 && code <= 128 ? 1 : 2;
      return acc;
    }, 0);
  };

  render() {
    const {
      value,
      type,
      show = true,
      preview,
      showPreview = true,
      getEditor,
      slot,
      showEditorType,
    } = this.props;
    const { modal, content } = this.state;

    return (
      <Fragment>
        {show ? (
          <Fragment>
            {!!(editorType.normal & showEditorType) && (
              <TextArea
                autosize={{ minRows: 8 }}
                defaultValue={value}
                onChange={e => {
                  const { target: { value } } = e;
                  this.handleChange(value);
                }}
              />
            )}
            {!!(editorType.rich & showEditorType) && (
              <RichTextEditor
                value={value}
                onChange={val => {
                  this.handleChange(val);
                }}
                getEditor={editor => {
                  if (getEditor && typeof getEditor === 'function') {
                    getEditor(editor);
                  }
                }}
              />
            )}
            <div className="clearfix">
              <div className="pull-left">
                {showPreview && (
                  <Fragment>
                    {!!(previewType.web & preview) && (
                      <Button
                        type="primary"
                        className="preview-btn"
                        onClick={e => {
                          e.preventDefault();
                          this.handleModalActive('preview', {
                            show: true,
                            data: { type: 'web', msg: content },
                          });
                        }}
                      >
                        WEB预览
                      </Button>
                    )}
                    {!!(previewType.mobile & preview) && (
                      <Button
                        type="primary"
                        className="preview-btn"
                        onClick={e => {
                          e.preventDefault();
                          this.handleModalActive('preview', {
                            show: true,
                            data: { type: 'h5', msg: content },
                          });
                        }}
                      >
                        H5预览
                      </Button>
                    )}
                  </Fragment>
                )}
                {slot && slot(content)}
              </div>
              <p className="pull-right">
                {'您当前已输入'}
                <span style={{ color: '#f50' }}>{this.handleGetCharlen(content)}</span>
                {'个字符'}
              </p>
            </div>
            {modal.preview.data && (
              <PreviewModal
                visible={modal.preview.show}
                type={modal.preview.data.type}
                message={modal.preview.data.msg}
                onCancel={() => {
                  this.handleModalActive('preview', { show: false, data: null });
                }}
              />
            )}
          </Fragment>
        ) : null}
      </Fragment>
    );
  }
}
