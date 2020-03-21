import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';

const cx = classNames.bind(styles);

class Footer extends Component {
  render() {
    return(
      <div className={cx('footer')}>
        <p>Copyright © 2019-{new Date().getFullYear()} | QQ老师助手 | All Rights Reserved. <a href="http://www.beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">粤ICP备19129609号-1</a></p>
      </div>
    )
  }
}

export default Footer;
