import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import optimize from 'app/util/optimize';
import { Checkbox, message, Spin } from 'antd';
import axios from 'axios';
import ConfirmLayer from 'app/components/confirm-layer';

const cx = classNames.bind(styles);

class TranslateImg extends Component {
  state = {
    rotatImgList: [],     // 旋转图片列表
    angle: {},            // 旋转角度
    loading: false,
    newImages: this.props.angleImg,         //新的图片
    selectIdx: 0,          // 选中第几张
    confirmVisible: false,
    checkedList: []
  }

  // 性能优化，避免重复渲染
  shouldComponentUpdate(nextProps, nextState) {
    return optimize(nextProps, nextState, this.props, this.state);
  }

  changeCheckBox = (idx, img) => {
    let { rotatImgList, angle, selectIdx, checkedList } = this.state;
    checkedList[idx] = !checkedList[idx]
    const checked = checkedList[idx];
    if (checked) {
      rotatImgList.push(img);
      angle[img.uuid] = 0;
      selectIdx++;
    } else {
      rotatImgList = rotatImgList.filter(item => item.uuid !== img.uuid);
      if (angle[img.uuid] || angle[img.uuid] === 0) {
        delete angle[img.uuid]
      }
      selectIdx--;
    }
    
    this.setState({
      rotatImgList,
      angle: {...angle},
      selectIdx,
      checkedList: [...checkedList]
    })
  }

  doingTranslate = () => {
    const { rotatImgList = [] } = this.state;
    if (rotatImgList.length > 0) {
      this.setState({ loading: true, confirmVisible: false })
      this.translateImg(rotatImgList[0], 0);
      this.props.setTranslateImg(false);
      this.props.setWorkDetailsLoading(true);
    } else {
      message.error('请选择要旋转的图片', 5);
    }
  }



  translateImg = (img, idx) => {
    let { rotatImgList = [], angle = {}, newImages = {} } = this.state;
    const _this = this;
    if (img.uuid) {
      axios.get(`/filestore/right-rotate-image/${img.uuid}/${angle[img.uuid]}`)
        .then(({ data = {} }) => {
          const { code, data: img } = data;
          if (code === '0' && img && img.url) {
            ++idx;
            // 返回来的图片替换掉
            newImages[img.uuid] = img;
            this.setState({ newImages });
            if (rotatImgList.length > idx) {
              _this.translateImg(rotatImgList[idx], idx);
            } else {
              message.success('图片旋转成功', 5);
              //_this.setState({ loading: false })
              _this.props.fetchWorkDetails();
              _this.props.setWorkDetailsLoading(false);
            }
          } else {
            ++idx;
            if (rotatImgList.length > idx) {
              message.error(`第${idx}张图片旋转失败，其他图片还在旋转中...`, 5);
              _this.translateImg(rotatImgList[idx], idx);
            } else {
              message.error(`第${idx}张图片旋转失败`, 5);
              //_this.setState({ loading: false })
              _this.props.fetchWorkDetails();
              _this.props.setWorkDetailsLoading(false);
            }
          }
        })
        .catch((e) => {
          ++idx;
          if (rotatImgList.length > idx) {
            message.error(`第${idx}张图片旋转失败，其他图片还在旋转中...`, 5);
            _this.translateImg(rotatImgList[idx], idx);
          } else {
            message.error(`第${idx}张图片旋转失败`, 5);
            //_this.setState({ loading: false })
            _this.props.fetchWorkDetails();
            _this.props.setWorkDetailsLoading(false);
          }
        });
    } else {
      console.log('图片标识不存在, ', img);
      message.error('旋转图片出错啦，请稍后重试！', 5);
    }
  }

  rotationAngle = (angles) => {
    let angle = this.state.angle;
    console.log('angle', angle);
    for (let item in angle) {
      angle[item] = angle[item] + angles
    }
    this.setState({
      angle: { ...angle }
    })
  }

  closeLayer =  () => {
    //let {  newImages = {} } = this.state;
    //this.props.fetchWorkDetails();
    //this.props.updateImg(newImages);
    this.props.setTranslateImg(false)
  }

  showconfirmLayer = () => {
    const { rotatImgList = [] } = this.state;
    if (rotatImgList.length > 0) {
      this.setState({
        confirmVisible: true
      })
    } else {
      message.error('请选择要旋转的图片', 5);
    }
  }


  render() {
    const { images = [] } = this.props;
    const { angle, loading, selectIdx, confirmVisible, checkedList } = this.state;
    return (
      <Spin spinning={loading}>
        <div className={cx("translate-img")} >
        <div className={cx("translate-title")}>已选中{selectIdx}项</div>
          <div className={cx("img-container")}>
            {
              (images || []).map((fileItem, fileIdx) => (
                <div className={cx("img-item-div")} key={fileIdx} onClick={(e) => this.changeCheckBox(fileIdx, fileItem)}>
                  <img src={`${fileItem.thumb}`} key={fileIdx}  alt="" className={cx('img-item')} style={{ transform: `rotate(${angle[fileItem.uuid] || 0}deg)` }} />
                  <Checkbox  checked={checkedList[fileIdx]} className={cx("checkbox")}  />
                </div>
              ))
            }
          </div>
          <div className={cx("translate-footer")}>
            <div onClick={() => this.rotationAngle(-90)} className={cx("left", "rotating")}>
              <div className={cx("turnleft")}></div>
              左转90°
            </div>
            <div onClick={() => this.rotationAngle(90)} className={cx("right", "rotating")}>
              <div className={cx("turnright")}></div>
              右转90°
            </div>
            <div onClick={this.showconfirmLayer} className={cx("confirm-btn")}>确定</div>
          </div>
          <div onClick={this.closeLayer} className={cx("close")}></div>
        </div>
        <ConfirmLayer
            visible={confirmVisible}
            confirm={this.doingTranslate}
            cancel={() => this.setState({ confirmVisible: false })}
            text={`是否旋转以上${selectIdx}张图片？`}
          />
      </Spin>
    )
  }
}

export default TranslateImg;