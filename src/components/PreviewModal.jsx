import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import { bind } from 'lodash-decorators';
import ReactDOM from 'react-dom';

export default class PreviewModal extends PureComponent {
  @bind()
  ref(instance) {
    const { message } = this.props;
    console.warn('instance', message);
    if (!instance) {
      return;
    }
    instance.onload = function() {
      instance.contentWindow.postMessage(
        {
          type: 'robotPreview',
          msg: {
            command: 'QAAS',
            ptype: 'plain_text',
            toMan: '0',
            invite: '0',
            responseBody: {
              messages: {
                message,
              },
            },
          },
        },
        '*'
      );
    };
  }
  render() {
    let { type, visible, onCancel } = this.props;
    let content;
    let width;
    if (type === 'h5') {
      width = 750;
      content = (
        <div
          id="jtalk"
          style={{
            width,
            height: 667,
            transform: 'scale(0.5) translateX(0%)',
            marginTop: '-10%',
          }}
        >
          <iframe
            ref={this.ref}
            title="h5"
            src="https://m-jtalk.jd.com/h5/hpreview.html?&preview=1#/chat"
            frameBorder="0"
            style={{ width, height: 1000 }}
          />
        </div>
      );
    } else {
      width = 750;
      type = 'web';
      content = (
        <iframe
          ref={this.ref}
          title="h5"
          name="jtalk_webimt"
          src="https://jtalk.jd.com/dist/preview.html?preview=1"
          frameBorder="0"
          style={{ width, height: 660 }}
        />
      );
    }

    return (
      <Modal
        visible={visible}
        title={null}
        footer={null}
        width={width}
        destroyOnClose
        className={`preview-modal ${type}`}
        onCancel={onCancel}
      >
        {content}
      </Modal>
    );
  }
}
