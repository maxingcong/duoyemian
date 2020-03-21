import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import optimize from 'app/util/optimize';

const cx = classNames.bind(styles);
class ClassTab extends Component {
  state = {
    activeKey: 0
  }

  // 性能优化，避免重复渲染
  shouldComponentUpdate(nextProps, nextState) {
    return optimize(nextProps, nextState, this.props, this.state);
  }

  changeTabs = (idx, code) => {
    this.setState({
      activeKey: idx
    })
    this.props.setLoading({loading: true})
    // 获取作业
    this.props.clearList({
      workDetails: {},
      studentsList: {}
    })
    this.props.fetchWork(code);
  }

  render() {
    const { classList } = this.props;
    const { activeKey } = this.state;
    return(
      <div className={cx('class-tab')}>
        {
          classList.map((item, idx) => (
            <div key={idx} onClick={() => this.changeTabs(idx, item.code)} className={cx('class-item', idx == activeKey ? 'active' : '')}>
            {item.className}
            {
              item.awaitingNum && item.awaitingNum > 0 ?
              <div className={cx("dot")}>{item.awaitingNum}</div>
              : ''
            }
            </div>
          ))
        }
      </div>
    )
  }
}

export default ClassTab;
