import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import { Spin, message } from 'antd';
import optimize from 'app/util/optimize';
import ConfirmLayer from 'app/components/confirm-layer';
import Literallycanvas from 'app/components/literallycanvas';
import GradingRecords from '../grading-records';
import uploadFile from 'app/util/upload';
import ViewImg from 'app/components/view-img'
import ReactAudioPlayer from 'react-audio-player';
import TranslateImg from '../translate-img';
import Attachment from '../attachment';

const cx = classNames.bind(styles);

class Details extends Component {
  state = {
    activeTab: 1,
    commentsId: '',       //评论ID
    correctingURL: '',    //批改图片路径
    correctingIdx: '',    // 第几张图片
    viewImgSrc: '',       // 查看图片路径
    activeResultsTabKey: 0,   // 成果tab
    // commentsList: [],          // 评语列表
    withdrawAll: false,        // 撤回所有
    showTranslateImg: false,   // 是否展示选择旋转图片
    angleImg: {},               // 旋转过的图片
    workDetailsLoading: false
  }

  // 性能优化，避免重复渲染
  shouldComponentUpdate(nextProps, nextState) {
    return optimize(nextProps, nextState, this.props, this.state);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.workDetails.accId !== nextProps.workDetails.accId) {
      this.setState({
        activeResultsTabKey: 0,
        angleImg: {}
      })
    }
  }
  changeTab = (key) => {
    this.setState({
      activeTab: key
    })
  }

  showComments = (id) => {
    this.props.setCurrentRecordId(id);
    // try {
    //   document.documentElement.style.overflow = 'hidden';
    // } catch (error) {
    //   console.log('error');
    // }
    
    this.props.setVisible({
      commentsVisible: true,
      isBatch: false
    });
  }

  next = () => {
    const { workDetails } = this.props;
    if (workDetails.corrected !== 1) {
      return message.error('当前作业还未批改', 5);
    } else {
      this.props.fetchWaitStudents();
    }
  }


  confirm = () => {
    const { commentsId, withdrawAll } = this.state;
    // try {
    //   document.documentElement.style.overflow = "auto";
    // } catch (error) {
    //   console.log('error');
    // }
    if (withdrawAll) {
      this.props.withdrawAll()
    } else {
      this.props.withdrawComment(commentsId);
    }

  }

  undoComments = (commentsId) => {
    if (commentsId) {
      this.setState({
        commentsId,
        withdrawAll: false
      })
    } else {
      this.setState({
        withdrawAll: true
      })
    }

    this.props.setVisible({ undoVisible: true })
  }

  receiveImg = (img, nextStatus) => {
    const _this = this;
    let { correctingIdx, activeResultsTabKey } = this.state;
    const { records = [] } = this.props.workDetails;
    const { images = [], id = '' } = records[activeResultsTabKey];
    if (img) {
      uploadFile({
        file: img, 
        callback: function (err, data) {
          if (!err) {
            let { uuids } = data;
            _this.props.addComment({
              data: {
                attach: uuids,
                recordId: id
              },
              type: 'correcting',
            })
            if (nextStatus) {
              correctingIdx++;
              if (images[correctingIdx]) {
                _this.setState({
                  correctingURL: images[correctingIdx],
                  correctingIdx
                })
              } else {
                _this.setState({
                  correctingURL: null
                })
                message.success('已经是最后一张了');
              }
            } else {
              _this.setState({
                correctingURL: null
              })
            }
          } else {
            _this.setState({
              correctingURL: null
            })
            message.error('批改失败', 5);
          }
        }
      });
    }
  }

  jumpPrev = () => {
    let { correctingIdx, activeResultsTabKey } = this.state;
    const { records = [] } = this.props.workDetails;
    const { images = [] } = records[activeResultsTabKey];
    correctingIdx--;
    if (images[correctingIdx]) {
      this.setState({
        correctingURL: images[correctingIdx],
        correctingIdx
      })
    } else {
      message.success('已经是第一张了');
    }
  }

  jumpNext = () => {
    let { correctingIdx, activeResultsTabKey } = this.state;
    const { records = [] } = this.props.workDetails;
    const { images = [] } = records[activeResultsTabKey];
    correctingIdx++;
    if (images[correctingIdx]) {
      this.setState({
        correctingURL: images[correctingIdx],
        correctingIdx
      })
    } else {
      message.success('已经是最后一张了');
    }
  }

  showFlowerLayer = (id) => {
    this.props.setCurrentRecordId(id);
    this.props.setVisible({ flowerVisible: true, isBatch: false })
  }

  // 编辑图片
  correcting = (imgObj, idx) => {
    this.setState({
      correctingURL: imgObj,
      correctingIdx: idx
    })
  }
  // 查看图片
  viewImg = (url) => {
    this.setState({
      viewImgSrc: url
    })
  }

  clearViewImg = () => {
    this.setState({
      viewImgSrc: ''
    })
  }

  changeResultsTab = (key) => {
    this.setState({
      activeResultsTabKey: key,
      activeTab: 1,
      isShowComments: false,
      showTranslateImg: false
    })
  }

  setTranslateImg = (value) => {
    this.setState({ showTranslateImg: value });
  }

  updateImg = (angleImg) => {
    this.setState({ angleImg})
  }
  // showGradingRecords = () => {
  //   const { activeResultsTabKey } = this.state;
  //   const { records = [] } = this.props.workDetails;
  //   const commentsList = records[activeResultsTabKey] ? records[activeResultsTabKey].comments : [];
  //   this.setState({
  //     isShowComments: true,
  //     commentsList,
  //   })
  // }

  render() {
    const { correctingURL, viewImgSrc, activeResultsTabKey, showTranslateImg, angleImg, workDetailsLoading } = this.state;
    const {  undoVisible, workDetails, currentAccId } = this.props;
    const { records = [] } = workDetails;
    return (
      <Spin spinning={workDetailsLoading} tips="上传中......">
        <div className={cx('details')}>
          <div className={cx("results-tab")}>
            {
              records.map((resultsItem, resultsIdx) => (
                <div key={resultsIdx}
                  onClick={() => this.changeResultsTab(resultsIdx)}
                  className={cx("results-tab-item", activeResultsTabKey === resultsIdx ? "active-tab-item" : '')}>
                  成果{resultsIdx + 1} <div className={cx("line")}></div>
                </div>
              ))
            }
            {/* <div onClick={this.showGradingRecords} className={cx("already-btn", isShowComments ? 'active-already-btn' : '')}>批改记录</div> */}
          </div>
          <div className={cx("work-list-title")}>
            <img src={workDetails.head} className={cx("head-img")} />
            <div className={cx("text")}>{workDetails.name || ''}</div>
            {
              workDetails.rewardNum ?
                <div className={cx("flowerNum")}>
                  <div className={cx("flower-icon")}></div>{workDetails.rewardNum}
                </div>
                : ''
            }
            <div className={cx("create-time")}>{records[activeResultsTabKey].createTime || ''}</div>
          </div>
          {
            records.map((recordItem, recordIdx) => (
              <div key={recordIdx} className={cx("records-item")} style={{ display: recordIdx === activeResultsTabKey ? 'block' : 'none' }}>
                {
                  <div className={cx("work-details")}>
                    {
                      recordItem.content ?
                        <div className={cx("details-content")} dangerouslySetInnerHTML={{ __html: recordItem.content || '' }}></div>
                        : ''
                    }
                    <div className={cx("audios")}>
                      {
                        recordItem.audios && recordItem.audios.length > 0 ?
                          recordItem.audios.map((audiosItem, audiosIdx) => (
                            <div key={audiosIdx} className={cx("audio-item")}>
                              <ReactAudioPlayer
                                src={audiosItem.url}
                                controls
                              />
                            </div>
                          ))
                          : ''
                      }
                    </div>
                    <div className={cx("videos")}>
                      {
                        recordItem.videos && recordItem.videos.length > 0 ?
                          recordItem.videos.map((videosItem, videosIdx) => (
                            <div key={videosIdx} className={cx("audio-item")}>
                              <video src={videosItem.url} poster={videosItem.thumb} preload="none" controls="controls" style={{ height: 'auto', width: 300 }}></video>
                            </div>
                          ))
                          : ''
                      }
                    </div>
                    {
                      !showTranslateImg ?
                        <div className={cx("img-block")}
                          style={{ display: recordItem.images && recordItem.images.length > 0 ? 'block' : 'none' }}
                        >
                          <div onClick={() => this.setTranslateImg(true)} className={cx("translate-btn")}></div>
                          <div className={cx("img-container")}>
                            {
                              (recordItem.images || []).map((fileItem, fileIdx) => (
                                <img onClick={() => this.correcting(fileItem, fileIdx)} key={fileItem.thumb} src={`${fileItem.thumb}`} alt="" className={cx('img-item')} />
                              ))
                            }
                          </div>
                          <div className="img-tips">提示：点击图片进行批注</div>
                        </div>
                        : <TranslateImg 
                            images={recordItem.images}
                            setTranslateImg={this.setTranslateImg}
                            setWorkDetailsLoading={ (value) => this.setState({workDetailsLoading: value })}
                            // updateImg={this.updateImg}
                            fetchWorkDetails={() => this.props.fetchWorkDetails({accId: currentAccId})}
                          />
                    }
                    {/* 附件 */}
                    <Attachment files={recordItem.files} />
                  </div>

                }
                {
                  <div className={cx("btn-container")}>
                    <div onClick={() => this.showComments(recordItem.id)} className={cx("btn-item")}>评语</div>
                    <div onClick={() => this.props.likeOpt({ islike: !recordItem.meLike, recordId: recordItem.id })} className={cx("btn-item", recordItem.meLike ? 'cancel-btn' : '')}>{recordItem.meLike ? '取消点赞' : '赞'}</div>
                    <div onClick={() => this.showFlowerLayer(recordItem.id)} className={cx("btn-item")}>小红花</div>
                    <div onClick={this.next} className={cx("btn-item")}>批改下一个</div>
                  </div>
                }
                <div className={cx("tips")}>提示：进行批注、评语、赞、小红花中的任一操作，都算批改完成</div>
                <div className={cx("marked")} style={{ display: workDetails.corrected === 1 ? 'block' : 'none' }}></div>
                <GradingRecords
                  comments={recordItem.comments}
                  rewardNum={workDetails.rewardNum}
                  meLike={recordItem.meLike}
                  createTime={recordItem.createTime || ''}
                  rewardFlowers={() => this.props.rewardFlowers(`-${workDetails.rewardNum}`)}
                  likeOpt={() => this.props.likeOpt({ islike: false, recordId: recordItem.id })}
                  undoComments={(value) => this.undoComments(value)}
                  viewImg={this.viewImg}
                />
              </div>
            ))
          }
        </div>
        <ConfirmLayer visible={undoVisible} confirm={this.confirm} cancel={() => this.props.setVisible({ undoVisible: false })} />
        <Literallycanvas
          img={correctingURL}
          close={() => this.setState({ correctingURL: null })}
          callback={this.receiveImg}
          jumpPrev={this.jumpPrev}
          jumpNext={this.jumpNext}
        />
        <ViewImg imgSrc={viewImgSrc} clearViewImg={this.clearViewImg} />
      </Spin>
    )
  }
}

export default Details;