import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import optimize from 'app/util/optimize';
import download from 'app/util/download';

const cx = classNames.bind(styles);
class Attachment extends Component {

  // 性能优化，避免重复渲染
  shouldComponentUpdate(nextProps, nextState) {
    return optimize(nextProps, nextState, this.props, this.state);
  }


  render() {
    const { files = [] } = this.props;
    return(
      <div className={cx("attachment")}>
        {
          (files || []).map((item, idx) => (
            <div onClick={() => download({url: item.url, name: item.name})} key={idx} className={cx('attachment-item')}>
              <div className={cx("link")}></div>
              {item.name}
            </div>
          ))
        }
      </div>
    )
  }
}

export default Attachment;