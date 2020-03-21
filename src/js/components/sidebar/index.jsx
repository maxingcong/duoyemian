import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import optimize from 'app/util/optimize';
//import { Progress } from 'antd';

const cx = classNames.bind(styles);

class Sidebar extends Component {
  state = {
    type: ''
  }

  // 性能优化，避免重复渲染
  shouldComponentUpdate(nextProps, nextState) {
    return optimize(nextProps, nextState, this.props, this.state);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.type !== prevState.type) {
      return {
        type: nextProps.type || ''
      }
    }
  }

  changeSidebar = (type) => {
    this.setState({ type });
    this.props.changeSidebar(type);
  }

  render() {
    const { type } = this.state;
    const { page } = this.props;
    return(
      <div>
        {
          page !== 'recycle' ?
          <div className={cx('sidebar')}>
            <div onClick={() => this.changeSidebar('')} className={cx("sidebar-item","all", type === '' ? "active-side" : '')}>全部文件</div>
            <div onClick={() => this.changeSidebar('TEXT')} className={cx("sidebar-item", "document", type === 'TEXT' ? "active-side" : '')}>文档</div>
            <div onClick={() => this.changeSidebar('IMAGE')} className={cx("sidebar-item", "img", type === 'IMAGE' ? "active-side" : '')}>图片</div>
            <div onClick={() => this.changeSidebar('VIDEO')} className={cx("sidebar-item", "video", type === 'VIDEO' ? "active-side" : '')}>视频</div>
            <div onClick={() => this.changeSidebar('AUDIO')} className={cx("sidebar-item", "audio", type === 'AUDIO' ? "active-side" : '')}>音频</div>
            <a href="/files/recycle-bin" className={cx('link')}>
            <div className={cx("sidebar-item", "delete")}>回收站</div>
            </a>
            {/* <div className={cx("progress")}>
              <Progress percent={30} />
              239M/1G
            </div> */}
          </div>
          : <div className={cx('sidebar')}>
              <a href="/files" className={cx('link')}><div  className={cx("sidebar-item","all")}>全部文件</div></a>
              <a href="/files?type=TEXT" className={cx('link')}><div  className={cx("sidebar-item", "document")}>文档</div></a>
              <a href="/files?type=IMAGE" className={cx('link')}><div  className={cx("sidebar-item", "img")}>图片</div></a>
              <a href="/files?type=VIDEO" className={cx('link')}><div  className={cx("sidebar-item", "video")}>视频</div></a>
              <a href="/files?type=AUDIO" className={cx('link')}><div  className={cx("sidebar-item", "audio")}>音频</div></a>
              <div className={cx("sidebar-item", "delete", "active-side")}>回收站</div>
            </div>
        }
      </div>
     
    )
  }
}

export default Sidebar;
