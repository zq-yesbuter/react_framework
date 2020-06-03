import React, { PureComponent } from 'react';
import { Upload, Icon, Button, Spin, Tooltip, message } from 'antd';
// import './index.less';

const MAX_VIDEO_SIZE = 1024 * 1000 * 100;
const acceptList = ['.avi', '.wmv', '.rmvb', '.rm', '.flash', '.mp4', '.mkv'].join();

class VideoUpload extends PureComponent {
  static defaultProps = {
    maxLength: 3,
  };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      fileList: this.format(props.value),
      previewVisible: false,
      previewImage: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.value && this.props.value) {
      this.setState({
        fileList: this.format(nextProps.value),
      });
    }
  }
  handleChange({ fileList, file }) {
    if (file.status === 'error') {
      let error = file.error.message || '未知错误';
      message.error(error);
      this.setState({
        fileList: [],
      });

      return;
    }
    if (file.status === 'removed') {
      this.props.onChange(undefined);
    } else if (file.status === 'done') {
      file.url = file.response;
      file.name = file.response;
      fileList = [file];
      this.props.onChange(file.response);
    }

    this.setState({
      fileList,
    });
  }
  format(value) {
    if (!value) {
      return [];
    }
    return [
      {
        uid: value,
        name: value,
        url: value,
      },
    ];
  }

  beforeUpload(file) {
    if (file.name[0] === '/') {
      message.error('文件名不能以”/”开头', 5);
      return false;
    }
    if (!/^([\u4E00-\u9FA5\uF900-\uFA2D]|\w|\/|\.|-|_)+$/.test(file.name)) {
      message.error('文件名只能包含字母、数字、中文、”/”、”.”、”-”、”_”', 5);
      return false;
    }
    if (file.name.length > 100) {
      message.error('文件名的长度在 1 个字符到 100 个字符之间', 5);
      return false;
    }

    return true;
  }

  render() {
    const { fileList } = this.state;
    const { action, onChange } = this.props;
    const customRequest = ({ data, file, filename, onError, onSuccess }) => {
      // EXAMPLE: post form-data with 'axios'
      const formData = new FormData();
      if (data) {
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });
      }
      formData.append(filename, file);

      action(formData)
        .then(res => {
          onSuccess(res, file);
          if (onChange && typeof onChange === 'function') {
            onChange(res);
          }
        })
        .catch(onError);

      return {
        abort() {
          console.log('upload progress is aborted.');
        },
      };
    };

    return (
      <Upload
        // action="/api/model/files/upload"
        accept={acceptList}
        customRequest={customRequest}
        fileList={fileList}
        // onChange={this.handleChange}
        beforeUpload={file => {
          const { type, size } = file;
          const [_, suffix] = type.split('/');

          if (size > MAX_VIDEO_SIZE) {
            message.error('上传视频大小不能超过100M!');
            return false;
          }

          if (acceptList.indexOf(`.${suffix}`) === -1) {
            message.error(`不支持上传该类型文件, 支持文件类型:${acceptList}`);
            return false;
          }

          return true;
        }}
        style={{ cursor: 'pointer' }}
      >
        <Tooltip title={`支持文件类型: ${acceptList}`}>
          <Button size="small">
            <Icon type="upload" />上传视频
          </Button>
        </Tooltip>
      </Upload>
    );
  }
}

export default VideoUpload;
