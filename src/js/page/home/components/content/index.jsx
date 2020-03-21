import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import { message } from 'antd';
import CustomUpload from 'app/components/custom-upload';

const cx = classNames.bind(styles);

class Content extends Component {
  state = {
    timer: null,
    showRefresh: false,
  }

  componentDidMount() {
    this.fetchUuidAndSetTimer();
  }

  fetchUuidAndSetTimer() {
    this.props.fetchUuid();
    this.getStatusInterval();
    this.setState({showRefresh: false});
  }

  getStatusInterval() {
    if (this.state.timer) clearInterval(this.state.timer);

    const timer = setInterval(() => {
      const {uuid, status} = this.props;
      if (uuid) {
        if (status.key && [1002, 1004, 1005].indexOf(status.key) > -1) {
          if (status.key === 1002) {
            this.setState({showRefresh: true});
            message.error('验证码已失效，请刷新页面重新获取', 5);
          }

          if (status.key === 1004) {
            message.success('登录成功', 5);
            setTimeout(() => {
              const {protocol, hostname} = location;
              location.href = `${protocol}//${hostname}`;
            }, 1000);
          }

          if (status.key === 1005) {
            this.setState({showRefresh: true});
            message.error('已取消登录', 5);
          }

          clearInterval(this.state.timer);
          this.props.clearStatus();
        } else {
          this.props.fetchStatus(this.props.uuid);
        }
      }
    }, 2000);
    this.setState({timer});
  }

  render() {
    const {showRefresh} = this.state;
    const {uuid, status} = this.props;
    const isIe = !!window.ActiveXObject || "ActiveXObject" in window;

    return(
      <div className={cx('home')}>
        {
          isIe ? (
            <div className={cx('warning')}>
              为了您更好的体验，请使用谷歌浏览器<a href="https://www.google.cn/intl/zh-CN/chrome/">去下载</a>
            </div>
          ) : null
        }
        <div className={cx('logo')} onClick={() => this.setState({showUpload: true})}></div>

        {
          this.state.showUpload ? <CustomUpload /> : null
        }

        <div className={cx('login')}>
          <div className={cx('info')}>
            <div className={cx('img')}>
              {
                uuid ? (
                  <img src={`/api/login/qrcode/${uuid}`} alt=""/>
                ) : null
              }
              {
                showRefresh ? (
                  <span onClick={() => this.fetchUuidAndSetTimer()}>刷新</span>
                ) : null
              }
            </div>
            {
              status.key === 1003 ? (
                <div className={cx('success')}>
                  <div className={cx('tips')}>
                    <div className={cx('th')}>扫码成功</div>
                    <div className={cx('td')}>请在手机端确认登录</div>
                  </div>
                </div>
              ) : (<div className={cx('success')}></div>)
            }
            <h3>老师助手扫码登录</h3>
            <h4>登录老师助手，点击<font>发现</font>，选择“<font>扫一扫</font>”</h4>
          </div>
        </div>
      </div>
    )
  }
}

export default Content;
