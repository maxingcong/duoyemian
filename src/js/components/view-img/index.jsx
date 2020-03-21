import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';

const cx = classNames.bind(styles);

class ViewImg extends Component {
  state = {
    isShow: false,
  }

  setIsShow = () => {
    this.setState({
      isShow: false
    })
    this.props.clearViewImg();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('nextProps.imgSrc', nextProps.imgSrc);
    if (nextProps.imgSrc) {
      return {
        isShow: true
      }
    }
  }

  clickImg = (e) => {
    e.preventDefault();
  }

  render() {
    const { imgSrc = ''} = this.props;
    const { isShow } = this.state;
    return(
      <div className={cx('view-img')} onClick={this.setIsShow} style={{display: isShow ? 'block' : 'none'}}>
        <img onClick={this.clickImg} className={cx('img')} src={imgSrc} alt="" />
      </div>
    )
  }
}

export default ViewImg;