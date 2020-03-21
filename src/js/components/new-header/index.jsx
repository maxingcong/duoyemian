import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import { message } from 'antd';
import { base } from 'app/util/base';
import axios from 'axios';
import optimize from 'app/util/optimize';

const cx = classNames.bind(styles);

class Header extends Component {
  LogOut = () => {
    axios.get(`${base.domain}/api/login/logout`).then(function (response) {
      if (response.data.code == 0) {
        // 跳转到登录页
        window.location.href = '/login';
      } else {
        message.error('登出失败' + response.data.message, 5);
      }
    }).catch(function (error) {
      message.error('登出失败' + error, 5);
    });
  }

  // 性能优化，避免重复渲染
  shouldComponentUpdate(nextProps, nextState) {
    return optimize(nextProps, nextState, this.props, this.state);
  }
  
  render() {
    const { navigation = [], showUpload = false, uploadStatus = '' } = this.props;
    return(
      <div className={cx('header')}>
        <div className={cx("header-nav")}>
          <div className={cx("logo")}></div>
          <div className={cx("nav-left")}>
            {
              navigation.map((item, idx) => (
                <div key={idx} className={cx("nav-l-item", item.selected ? 'active-nav' : '')}>
                {
                  item.link ?
                    <a  className={cx("link")} href={item.link}>{item.title} <div className={cx("line")}></div></a> 
                  : <div>{item.title} <div className={cx("line")}></div></div>
                }
                </div>
              ))
            }
          </div>
          <div className={cx("nav-right")}>
            {
              showUpload ? 
                <div className={cx("nav-item", "flie")} onClick={ () => this.props.setShowUpload(true)}>
                  <div className={cx("uploadStatus", uploadStatus)}></div>
                  <div className={cx("flie-icon", "icon")}></div>
                  文件上传
                </div>
              : ''
            }
            {/* <div className={cx("nav-item","notice")}>
              <div className={cx("notice-icon", "icon")}></div>
              通知
            </div>
            <div className={cx("nav-item", "setting")}>
              <div className={cx("setting-icon", "icon")}></div>
              个人设置
            </div> */}
            <div onClick={this.LogOut} className={cx("nav-item","out")}>
              <div className={cx("out-icon", "icon")}></div>
              退出登录
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Header;