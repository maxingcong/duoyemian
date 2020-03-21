import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import { message } from 'antd';
import { base } from 'app/util/base';
import axios from 'axios';

const cx = classNames.bind(styles);

class Header extends Component {
  LogOut = () => {
    axios.get(`${base.domain}/api/login/logout`).then(function (response) {
      if (response.data.code == 0) {
        // 跳转到登录页
        window.location.href = '/home.html';
      } else {
        message.error('登出失败' + response.data.message, 5);
      }
    }).catch(function (error) {
      message.error('登出失败' + error, 5);
    });
  }

  render() {
    return(
      <div className={cx('header')}>
        <div className={cx("logo")}></div>
        <div onClick={this.LogOut} className={cx("logout")}>退出登录</div>
      </div>
    )
  }
}

export default Header;