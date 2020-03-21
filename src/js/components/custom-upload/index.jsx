import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import { Upload, Button, Icon } from 'antd';
import uploadFile from 'app/util/upload2';

const cx = classNames.bind(styles);

class CustomUpload extends Component {
  state = {
    hide: true,
    fileList: [],
    showUploadModel: false,
    acceptFileType: '.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.mp3,.mp4,.mov,.m4a,.png,.jpg,.jpeg'
  }

  customUpload= (o = {}) => {
    const {file} = o;
    if (file) {
      console.log(file);
      const {callback} = this.props;
      const {acceptFileType} = this.state;
      const {name, size, type, uid} = file || {};
      const maxSize = 10 * 1024 * 1024;
      const typeStr = name.substr(name.lastIndexOf('.') + 1).toLocaleLowerCase();
      const notAcceptFileType = acceptFileType.split(',').indexOf(`.${typeStr}`) < 0;
      const sizeStr = size / 1024 > 1024 ? `${Math.ceil(size / (1024 * 1024))}MB` : `${Math.ceil(size / 1024)}KB`;
      
      if (notAcceptFileType) {
        this.setState({fileList: [{name, size, type, typeStr, uid, sizeStr, status: 'error', msg: '不支持的文件类型'}, ...this.state.fileList]});
        return;
      }

      if (size > maxSize) {
        this.setState({fileList: [{name, size, type, typeStr, uid, sizeStr, status: 'error', msg: '单个文件大小不超过10MB'}, ...this.state.fileList]});
        return;
      }  

      this.setState({fileList: [{name, size, type, typeStr, uid, sizeStr}, ...this.state.fileList]});

      uploadFile({
        file, type: 'file',
        callback: (err, data) => {
          let {fileList} = this.state;
          if (!err) {
            let {uuids} = data || {};
            fileList = fileList.map(v => {
              return v.uid === uid ? {...v, status: 'done', uuids} : v;
            });

            this.setState({fileList});
            console.log('upload success => ', data, fileList);
          } else {
            fileList = fileList.map(v => {
              return v.uid === uid ? {...v, status: 'error'} : v;
            });

            this.setState({fileList});
            console.log('upload error => ', err, data, fileList);
          }
          typeof callback === 'function' && callback(fileList);
        }, 
        progress: (progress) => {
          let {fileList} = this.state;
          let {percent = 0, speed = 0} = progress || {};
          
          fileList = fileList.map(v => {
            return v.uid === uid ? {
              ...v, percent, 
              speed: percent === 1 ? 0 : isNaN(speed) ? 0 : speed,
              status: 'uploading'
            } : v;
          });

          this.setState({fileList});
          console.log('upload onprogress => ', percent, speed, fileList);
        },
      });
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const {show} = nextProps;
    if (show) {
      if (!this.state.showUploadModel) {
        this.setState({hide: false, showUploadModel: true});
      }
    }
  }

  toggleUploadModel = () => {
    const {callback} = this.props;
    const {showUploadModel, fileList} = this.state;
    if (showUploadModel) {
      typeof callback === 'function' && callback(fileList);
      this.setState({hide: true});
      setTimeout(() => {
        this.setState({showUploadModel: false});
      }, 300);
    } else {
      this.setState({hide: false, showUploadModel: true});
    }
  }

  handleRemove = (file) => {
    const {uid, status} = file;
    if (status === 'error') {
      const fileList = this.state.fileList.filter(v => v.uid !== uid);
      this.setState({fileList});
    }
  }

  fileDragover (e) {
    e.preventDefault();
  }

  fileDrop = (e) => {
    e.preventDefault();
    let length = this.state.fileList.length;
    let files = e.dataTransfer.files || [];
    [].forEach.call(files, (file) => {
      setTimeout(() => {
        file.uid = `rc-upload-${Date.now()}-${++length}`;
        this.customUpload({file});
      }, 300);
    },false);
  }
  
  render() {
    const {fileList, showUploadModel, hide} = this.state;
    return(
      <div className={cx('custom-upload')}>
        <Button type="primary" id="customUplodBtn" style={{marginRight: 27}} onClick={this.toggleUploadModel}>
          <Icon type="upload" /> 上传
        </Button>
        {
          showUploadModel ? (
            <div className={cx('upload')}>
              <div className={cx(['info', hide ? 'hide' : 'show'])}>
                <h3 className={cx('tit')}>上传文件</h3>
                <div className={cx('click-upload')}>
                  <Upload
                    multiple={true}
                    fileList={this.state.fileList}
                    customRequest={this.customUpload}
                    accept='.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.mp3,.mp4,.mov,.m4a,.png,.jpg,.jpeg'
                  >
                    <Button type="primary"><Icon type="upload" /> 选择文件</Button>
                    或拖拽文件到以下区域
                  </Upload>
                </div>
                <div className={cx('files')} onDragOver={this.fileDragover} onDrop={this.fileDrop}>
                  {
                    fileList.length ? (
                      <div>
                        {
                          fileList.map(val => {
                            return (
                              <div className={cx(['li', val.typeStr])} key={val.uid}>
                                <div className={cx('img')}>{val.name}</div>
                                <div className={cx('speed')}>{val.sizeStr}</div>
                                <div className={cx('progress')}>
                                  {
                                    val.status === 'error' ? (
                                      <div className={cx('error')}>{val.msg || '上传失败！'}</div>
                                    ) : (
                                      val.percent ? (
                                        <div className={cx('percent')}>
                                          <div className={cx('percent-now')} style={{width: `${val.percent * 100}%`}}></div>
                                          {Math.round(val.percent * 100)}%
                                        </div>
                                      ) : (<div className={cx('loading')}>正在扫描...</div>)
                                    )
                                  }
                                </div>
                                <div className={cx(['status', val.status])} onClick={() => this.handleRemove(val)}></div>
                              </div>
                            );
                          })
                        }
                      </div>
                    ) : (
                      <div className={cx('drag-tips')}>
                        <h3><Icon type="upload"/> 支持拖拽上传</h3>
                        <p>按住Ctrl选择多个文件</p>
                        <p>单个文件大小不超过10MB</p>
                        <p>支持格式 PDF/DOC/PPT/XLS/MP4/MOV/MP3/M4A等</p>
                      </div>
                    )
                  }
                </div>
                <div className={cx('close')}>
                  <Button type="primary" style={{width: '140px'}} onClick={this.toggleUploadModel}>关闭</Button>
                  {/* <Button style={{width: '140px'}} onClick={this.toggleUploadModel}>取消</Button> */}
                </div>
              </div>
            </div>
          ) : null
        }
      </div>
      
    )
  }
}

export default CustomUpload;