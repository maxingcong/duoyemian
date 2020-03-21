import React, { Component } from 'react';
import { Input, message, Spin, Tag, Icon, Tooltip, Popconfirm } from 'antd';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import optimize from 'app/util/optimize';
import uploadFile from 'app/util/upload';
import ViewImg from 'app/components/view-img'


const { TextArea } = Input;
const cx = classNames.bind(styles);

class Comments extends Component {
  state = {
    files: [],
    uploadLoading: false,
    content: '',
    uuids: [],                // 上传给后端的文件标识
    viewImgUrl: '',            // 查看图片路径
    tags: [],
    inputVisible: false,
    inputValue: '',
  }

  componentDidMount() {
    try {
      if (window.localStorage) {
        let storage = window.localStorage.getItem('customComments');
        if (storage) {
          storage = storage.split(',')
          this.setState({ tags: storage });
        } else {
          window.localStorage.setItem('customComments', "太棒了,再接再厉,多多练习");
          this.setState({ tags: ['太棒了', '再接再厉', '多多练习'] });
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  // 性能优化，避免重复渲染
  shouldComponentUpdate(nextProps, nextState) {
    return optimize(nextProps, nextState, this.props, this.state);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.commentsVisible) {
      return {
        content: '',
        files: [],
        uuids: []
      }
    }
    return null;
  }

  submitComments = () => {
    const { uuids, content } = this.state;
    const { currentRecordId, isBatch, accIds } = this.props;
    if (!content && uuids.length === 0) {
      return message.error('请输入您的评语', 5);
    }

    if (isBatch) {
      this.props.batchAddComment({
        content,
        attach: uuids.join(','),
        accIds
      });
    } else {
      this.props.addComment({
        data: {
          content,
          attach: uuids.join(','),
          recordId: currentRecordId
        },
        type: 'comment'
      })
    }
  }

  changeFile = (e) => {
    const _this = this;
    const file = e.target.files[0];
    if (file) {
      // 验证图片类型
      if (!/image\/\w+/.test(file.type)) {
        message.error('只能上传图片类型', 5);
        return false;
      }
      this.setState({
        uploadLoading: true
      })
      uploadFile({
        file, 
        callback: function (err, data) {
          if (!err) {
            let { files = [], uuids = [] } = _this.state;
            files.push(data.file);
            uuids.push(data.uuids)
            _this.setState({
              uploadLoading: false,
              uuids,
              files
            })
            message.success('上传成功', 5);
          } else {
            _this.setState({
              uploadLoading: false,
            })
            message.error('上传失败', 5);
          }
        }
      });
    }
  }

  viewImg = (url) => {
    this.setState({
      viewImgUrl: url
    })
  }

  deleteImg = (idx) => {
    let { files, uuids } = this.state;
    files.splice(idx, 1);
    uuids.splice(idx, 1);
    this.setState({
      files: [...files],
      uuids: [...uuids]
    })
  }

  changeTextArea = (e) => {
    this.setState({
      content: e.target.value
    })
  }

  clearViewImg = () => {
    this.setState({
      viewImgUrl: ''
    })
  }

  tempComments = (value) => {
    const { content } = this.state;
    this.setState({
      content: content + value
    })
  }

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
    this.removeStorage(removedTag);
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setStorage(inputValue);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });

  };

  // 写入storage
  setStorage = (value) => {
    try {
      if (window.localStorage) {
        let tags = window.localStorage.getItem('customComments');
        if (tags) {
          tags = `${tags},${value}`;
          window.localStorage.setItem('customComments', tags)
        } else {
          window.localStorage.setItem('customComments', value)
        }
      }
    } catch (error) {
      console.log('写入storage出错', error);
    }
  }

  // 删除
  removeStorage = (value) => {
    try {
      if (window.localStorage) {
        let tags = window.localStorage.getItem('customComments');
        if (tags) {
          tags = tags.split(',');
          let newTags = tags.filter(tag => tag !== value);
          newTags = newTags.join(',');
          window.localStorage.setItem('customComments', newTags)
        }
      }
    } catch (error) {
      console.log('删除storage出错', error);
    }
  }

  saveInputRef = input => (this.input = input);

  render() {
    const { files, uploadLoading, content, viewImgUrl, tags = [], inputVisible, inputValue } = this.state;
    const { commentsVisible, isBatch } = this.props;
    return (
      <div className={cx("comments-container")} style={{ display: commentsVisible ? 'block' : 'none' }}>
        <div className={cx("comments")}>
          <Spin spinning={uploadLoading} >
            <TextArea
              value={content}
              onChange={this.changeTextArea}
              placeholder="请填写你的评语，最多500字"
              className={cx('textArea')}
              maxLength={500}
            />
            <div className={cx("tempComments")}>

              {tags.map((tag, index) => {
                const tagElem = (
                  <Tooltip key={index} title={tag}>
                    <Tag
                      className={cx("tags")}
                      closable={index !== 0}
                      onClose={() => this.handleClose(tag)}
                      onClick={() => this.tempComments(tag)}
                    >
                      {tag}
                    </Tag>
                  </Tooltip>
                );
                return (
                  tagElem
                );
              })}
              {inputVisible && (
                <Input
                  ref={this.saveInputRef}
                  type="text"
                  size="small"
                  value={inputValue}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputConfirm}
                  onPressEnter={this.handleInputConfirm}
                  className={cx("tags", "input")}
                />
              )}
              {!inputVisible && (
                <Tag className={cx("tags")} onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                  自定义<Icon type="edit" style={{ marginLeft: 5 }} />
                </Tag>
              )}
              {/* {
                tags.map((item, idx) => (
                  <div key={idx} onClick={() => this.tempComments(item)} className={cx("tempComments-item")}>
                    {item}
                    <div className={cx("close-img")}></div>
                  </div>
                ))
              }
              <div onClick={this.customComments} className={cx("custom-comments")}>自定义</div> */}
            </div>

            <div>
              {
                files.length > 0 ?
                  files.map((url, idx) => (
                    <div className={cx('item-img-c')} key={idx}>
                      <img onClick={() => this.viewImg(url)} src={url} alt="" className={cx('item-img')} />
                      <div className={cx("close-img")} onClick={() => this.deleteImg(idx)}></div>
                    </div>
                  ))
                  : ''
              }
              <div className={cx('upload-box')}>
                <input type="file" className={cx('input-file')}
                  onChange={this.changeFile}
                  name="myFile"
                />
                <span className={cx('upload-icon')}>

                </span>
              </div>
            </div>
            {
              isBatch ?
                <Popconfirm
                  title="您确认要批量评语"
                  onConfirm={this.submitComments}
                  okText="确认"
                  cancelText="取消"
                >
                  <div className={cx("submit-btn")}>提交</div>
                </Popconfirm>
                : <div onClick={this.submitComments} className={cx("submit-btn")}>提交</div>
            }
          </Spin >
          <div onClick={() => this.props.setVisible({ commentsVisible: false })} className={cx("close")}></div>
        </div>
        <ViewImg imgSrc={viewImgUrl} clearViewImg={this.clearViewImg} />
      </div>
    )
  }
}

export default Comments;