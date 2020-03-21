import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import optimize from 'app/util/optimize';
import ReactAudioPlayer from 'react-audio-player';
import Attachment from '../attachment';

const cx = classNames.bind(styles);

class GradingRecords extends Component {
  // 性能优化，避免重复渲染
  shouldComponentUpdate(nextProps, nextState) {
    return optimize(nextProps, nextState, this.props, this.state);
  }


  render() {
    const { comments = [], rewardNum = '', meLike, createTime, likeOpt, undoComments, viewImg } = this.props;
    return (
      <div className={cx("correcting-details")}>
        <div className={cx("line")}></div>
        {
          rewardNum || meLike  ||  comments.length > 0 ?
            <div className={cx("withdraw-all")}>
              <div className={cx("title")}>批改记录  <div className={cx("title-line")}></div></div>
              <div onClick={() => undoComments()} className={cx("withdraw-all-btn")} style={{display: comments && comments.length > 0 ? 'block': 'none'}}>
                全部撤回
              </div>
            </div>
          : ''
        }
        {
          comments && comments.length > 0 ?
            <div>
              {
                comments.map((commentsItem, commentsIdx) => (
                  <div key={commentsIdx} className={cx('comments-item')}>
                    <div className={cx("title")}>
                      <div className={cx('title-c')}>您添加了评语 </div>
                      <div className={cx('title-t')}>{commentsItem.create}</div>
                      
                      <div onClick={() => undoComments(commentsItem.id)} className={cx("withdraw-btn")}>撤回</div>
                    </div>
                    {
                      commentsItem.content ?
                        <div dangerouslySetInnerHTML={{ __html: commentsItem.content || '' }}></div>
                        : ''
                    }
                    <div className={cx("img-block")} style={{ display: commentsItem.images && commentsItem.images.length > 0 ? 'block' : 'none' }}>
                      {
                        <div className={cx("img-container")}>
                          {
                            (commentsItem.images || []).map((imagesItem, imagesIdx) => (
                              <img key={imagesIdx} onClick={() => viewImg(imagesItem.url)} src={imagesItem.url} alt="" className={cx('img-item')} />
                            ))
                          }
                        </div>
                      }
                    </div>
                    <div>
                      {
                        commentsItem.audios && commentsItem.audios.length > 0 ?
                          commentsItem.audios.map((audiosItem, audiosIdx) => (
                            <div key={audiosIdx} className={cx("audios")}>
                              {/* <audio controls="" src={audiosItem.url} /> */}
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
                        commentsItem.videos && commentsItem.videos.length > 0 ?
                          commentsItem.videos.map((videosItem, videosIdx) => (
                            <div key={videosIdx} className={cx("audio-item")}>
                              <video style={{ height: 'auto', width: 300 }} poster={videosItem.thumb} preload="none" src={videosItem.url} controls="controls"></video>
                            </div>
                          ))
                          : ''
                      }
                    </div>
                     {/* 附件 */}
                     <Attachment files={commentsItem.files} />
                  </div>
                ))
              }
            </div>
            : !rewardNum && !meLike ?
              <div className={cx('not-record')}>暂时没有批改记录</div>
              : ''
        }
        {
          rewardNum ?
            <div className={cx("flower-num")}>
              <div className={cx("f-n-top")}>您赠送了{rewardNum || 0}朵小红花</div>
              <div>{createTime || ''}</div>
              <div onClick={() => this.props.rewardFlowers()} className={cx("withdraw-btn", 'withdraw-btn1')}>撤回</div>
            </div>
            : ''
        }
        {
          meLike ?
            <div className={cx("flower-num")}>
              <div className={cx("f-n-top")}>您点了赞</div>
              <div>{createTime || ''}</div>
              <div onClick={() => likeOpt()} className={cx("withdraw-btn", "withdraw-btn1")}>撤回</div>
            </div>
            : ''
        }
      </div>
    )
  }
}

export default GradingRecords;