import React, { Component } from 'react';
import classNames from 'classnames/bind';
import {message, Modal} from 'antd';
import styles from './style.mod.less';
import liCanvas from '../../plugins/literallycanvas/js/index.js';
import '../../plugins/literallycanvas/css/literallycanvas.less';
import axios from 'axios';
import uploadFile from 'app/util/upload';

const cx = classNames.bind(styles);
const { confirm } = Modal;

class Literallycanvas extends Component {
  state = {
    LC: null,
    img: null,
    loading: false,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.zoomByKeyCode.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.zoomByKeyCode.bind(this));
  }

  zoomByKeyCode(e) {
    const keyCode = e.keyCode;
    const zoomOut = [109, 189].indexOf(keyCode) > -1;
    const zoomIn = [107, 187].indexOf(keyCode) > -1;
    
    if (zoomIn || zoomOut) {
      const {LC} = this.state;
      if (LC) {
        const {zoomStep} = LC.opts || {};

        LC.zoom(zoomIn ? zoomStep : -zoomStep);
      }
    }
  }

  translateImg(angle) {
    confirm({
      title: '旋转后图片将无法撤回和重做！',
      content: '是否确认要旋转？',
      onOk: () => {
        this.setState({loading: true});
        const {LC} = this.state;
        const {shapes = []} = LC.getSnapshot() || {};

        if (shapes.length < 1) {
          this.doingTranslate(angle);
        } else {
          const canvas = LC.getImage();
          const url = canvas.toDataURL();
          console.log(LC);
          uploadFile({
            fail: this.dataURLtoBlob(url), 
            callback: (err, data) => {
              if (!err) {
                console.log('uploadFile suc', data);
                const {file, uuids} = data;
                const thumb = file.replace('.jpg', '_thumb.jpg');
                console.log({uuid: uuids, url: file, thumb});
                this.setState({img: {uuid: uuids, url: file, thumb}}, () => {
                  this.doingTranslate(angle);
                });
              } else {
                message.error('旋转图片出错啦，请稍后重试！', 5);
              }
            }
          });
        }
      },
      onCancel: () => {
        console.log('Cancel');
        this.setState({loading: false});
      },
    });
  }

  doingTranslate(angle) {
    const {img} = this.state;
    if (img.uuid) {
      axios.get(`https://tea-ntest.woqufadai.com/filestore/right-rotate-image/${img.uuid}/${angle}`)
        .then(({data = {}}) => {
          const {code, data: img} = data;
          if (code === '0' && img && img.url) {
            this.setState({img}, () => {
              this.drawImageToCanvas();
            });
          } else {
            message.error('您操作太频繁了，请稍后重试！', 5);
            this.setState({loading: false});
          }
        })
        .catch((e) => {
          console.log(e);
          message.error('旋转图片出错啦，请稍后重试！', 5);
          this.setState({loading: false});
        });
    } else {
      console.log('图片标识不存在, ', img);
      message.error('旋转图片出错啦，请稍后重试！', 5);
    }
  }

  getLC(callback) {
    let {LC} = this.state;
    if (!LC) {
      LC = liCanvas.init(
        document.getElementById('literallycanvas'),
        {
          imageURLPrefix: 'http://s.damixia.cn/dmx-static/0.0.16/dist/js/literallycanvas/img',
          primaryColor: '#ff0000',
          secondaryColor: 'transparent',
          zoomMin: 0.1,
        }
      );
    }

    this.setState({LC}, callback);
  }

  getImage(next = false) {
    const {LC} = this.state;
    const {shapes = []} = LC.getSnapshot() || {};
    if (shapes.length < 1) {
      message.error('您没有做任何更改！', 5);
      return;
    }

    const canvas = LC.getImage();
    const data = canvas.toDataURL();
    this.setState({loading: true});
    this.props.callback(this.dataURLtoBlob(data), next);
  }

  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(',');
    //注意base64的最后面中括号和引号是不转译的
    var _arr = arr[1].substring(0,arr[1].length-2);
    var mime = arr[0].match(/:(.*?);/)[1],
      bstr =atob(_arr),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const {img} = nextProps;
    console.log(img);
    if (img) {
      this.setState({img, loading: true}, () => {
        this.getLC(() => {
          this.drawImageToCanvas();
        });
      });
    } else {
      this.setState({img: null, loading: false, LC: null});
    }
  }

  drawImageToCanvas() {
    const image = new Image();
    const {img, LC} = this.state;
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      let {width, height} = image;
      let drawEle = document.getElementsByClassName('lc-drawing')[0];
      let {width: w, height: h} = drawEle.getBoundingClientRect();
      let rotateW = width / w, rotateH = height / h;
      let scale = rotateW > rotateH ? w / width : h / height;

      LC.clear();
      LC.backgroundShapes = [liCanvas.createShape('Image', {
        x: w / 2 - width * scale / 2, y: h / 2 - height * scale / 2, scale, image
      })];

      LC.repaintLayer('background');

      this.setState({loading: false});
    }

    image.src = `${img.url}?timeStamp=${Date.now()}`;
  }

  render() {
    const {img, loading} = this.state;

    return img ? (
      <div className={cx('literallycanvas')}>
        <div className={cx('box')} id='literallycanvas'></div>
        <div className={cx('buttons')}>
          <span className={cx('submit')} onClick={() => this.getImage()}>提交</span>
          <span className={cx('submit')} onClick={() => this.getImage(true)}>提交并批注下一张</span>
        </div>

        <div className={cx('close')} onClick={() => this.props.close()}></div>

        <span className={cx('prev')} onClick={() => this.props.jumpPrev()} title="跳到上一张"></span>
        <span className={cx('next')} onClick={() => this.props.jumpNext()} title="跳到下一张"></span>

        {/* <div className={cx('translate')}>
          <span className={cx('left')} title="往左旋转90度" onClick={() => this.translateImg(-90)}></span>
          <span className={cx('right')} title="往右旋转90度" onClick={() => this.translateImg(90)}></span>
        </div> */}
        
        {
          loading ? (
            <div className={cx('loading')}>
              <span>加载中...</span>
            </div>
          ) : null
        }
      </div>
    ) : null;
  }
}

export default Literallycanvas;