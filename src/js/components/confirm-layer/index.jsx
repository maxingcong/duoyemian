import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';

const cx = classNames.bind(styles);

class ConfirmLayer extends Component {
  render() {
    const { visible, confirm, cancel, text } = this.props;
    return(
      <div className={cx('comfin-layer')} style={{display:  visible ? 'block' : 'none'}}>
        <div className={cx('comfin-body')}>
        <div className={cx('comfin-text')}><div className={cx('icon')}></div>{text || '确定要撤回么？此操作不可逆'}</div>
          <div className={cx("btn-container")}>
            <div  onClick={() => confirm()} className={cx('comfin-btn', 'btn')}>确定</div>
            <div onClick={() => cancel()} className={cx('cancel-btn', 'btn')}>取消</div>
          </div>
          <div onClick={() => cancel()} className={cx("close")}></div>
        </div>
      </div>
    )
  }
}

export default ConfirmLayer;