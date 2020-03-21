import React, { Component } from 'react';
import { message, Popconfirm } from 'antd';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import optimize from 'app/util/optimize';

const cx = classNames.bind(styles);

class FlowerModal extends Component {
  state = {
    activeKey: ''
  }

  // 性能优化，避免重复渲染
  shouldComponentUpdate(nextProps, nextState) {
    return optimize(nextProps, nextState, this.props, this.state);
  }

  slectFlower = (value) => {
    this.setState({
      activeKey: value
    })
  }

  submitFlower = () => {
    const { activeKey } = this.state;
    const { rewardNum, isBatch, accIds } = this.props;
    if (activeKey || activeKey == -1) {
      if (!isBatch) {
        if (rewardNum == 0 && activeKey == -1) {
          return message.error('小红花数不能小于0', 5);
        }
        this.props.rewardFlowers(activeKey);
      } else {
        this.props.batchRewardFlowers({
          accIds,
          num: activeKey
        });
      }
    } else {
      message.error('请选择小红花');
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    if (!nextProps.flowerVisible) {
      return {
        activeKey: ''
      }
    }
    return null;
  }

  render() {
    const { flowerVisible, isBatch } = this.props;
    const { activeKey  } = this.state;
    return (
      <div className={cx("flower-container")} style={{ display: flowerVisible ? 'block' : 'none' }}>
        <div className={cx("flower-main")}>
          <div className={cx("flower-body")}>
            <div>
              <div className={cx("flower-item")} onClick={() => this.slectFlower(1)}>
                <div className={cx("flower-item-img", activeKey === 1 ? 'active-img' : '')}></div>
                <div className={cx("flower-item-text")}>1朵</div>
              </div>
              <div className={cx("flower-item")} onClick={() => this.slectFlower(2)}>
                <div className={cx("flower-item-img", activeKey === 2 ? 'active-img' : '')}></div>
                <div className={cx("flower-item-text")}>2朵</div>
              </div>
              <div className={cx("flower-item")} onClick={() => this.slectFlower(3)}>
                <div className={cx("flower-item-img", activeKey === 3 ? 'active-img' : '')}></div>
                <div className={cx("flower-item-text")}>3朵</div>
              </div>
              <div className={cx("flower-item")} onClick={() => this.slectFlower(4)}>
                <div className={cx("flower-item-img", activeKey === 4 ? 'active-img' : '')}></div>
                <div className={cx("flower-item-text")}>4朵</div>
              </div>
              <div className={cx("flower-item")} onClick={() => this.slectFlower(5)}>
                <div className={cx("flower-item-img", activeKey === 5 ? 'active-img' : '')}></div>
                <div className={cx("flower-item-text")}>5朵</div>
              </div>
            </div>
            <div className={cx('flower-c')}>
              <div className={cx("flower-item")} onClick={() => this.slectFlower(-1)}>
                <div className={cx("flower-item-img1", activeKey === -1 ? 'active-img1' : '')}></div>
                <div className={cx("flower-item-text")}>-1朵</div>
              </div>
            </div>
          </div>
          <div onClick={() => this.props.setVisible({ flowerVisible: false })} className={cx("close")}></div>
          {
            isBatch ?
              <Popconfirm
                title="您确认要批量赠送小红花"
                onConfirm={this.submitFlower}
                okText="确认"
                cancelText="取消"
              >
                <div className={cx("submit-btn")}>提交</div>
              </Popconfirm>
            : <div onClick={this.submitFlower} className={cx("submit-btn")}>提交</div>
          }
        </div>
      </div>
    )
  }
}

export default FlowerModal;