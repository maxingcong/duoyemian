import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './style.mod.less';
import { Modal, Input, message, Tooltip } from 'antd';

const cx = classNames.bind(styles);

class ModifyPhoto extends Component {
  state = {
    canvasW: 0,
    canvasH: 0,
    canvasL: 0,
    canvasT: 0,
    canvasBakRef: null,
    canvasBakCxt: null,
    canvasImgRef: null,
    canvasImgCxt: null,
    startX: 0,
    startY: 0,
    lineWidth: 2,
    lineColor: '#ff0000',
    drawType: 1,       // 1涂鸦，2文本，3框，4圆，5错，6对，7橡皮擦，8重置
    drawing: false,
    textVal: '',
    imgSrc: null
  }

  componentDidMount() {
    console.log('modifyphoto componentDidMount');
    document.addEventListener('touchstart', this.stopScroll, false);
    document.addEventListener('touchmove', this.stopScroll, false);
  }

  componentWillUnmount() {
    console.log('modifyphoto componentDidMount');
    document.removeEventListener('touchstart', this.stopScroll, false);
    document.removeEventListener('touchmove', this.stopScroll, false);
  }

  stopScroll(e) {
    e.preventDefault();
  }

  getCanvasRefs(callback) {
    let canvasImgRef = this.refs.canvasImg;
    let canvasBakRef = this.refs.canvasBak;
    let canvasImgCxt = canvasImgRef.getContext('2d');
    let canvasBakCxt = canvasBakRef.getContext('2d');

    this.setState({canvasImgRef, canvasImgCxt, canvasBakRef, canvasBakCxt}, () => {
      callback();
    });
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('UNSAFE_componentWillReceiveProps', nextProps, this.state);
    const {src} = nextProps;
    if (src) {
      this.setState({imgSrc: src}, () => {
        this.loadImgToCanvas(src);
      });
    } else {
      this.setState({imgSrc: null});
    }
  }

  loadImgToCanvas() {
    this.getCanvasRefs(() => {
      const {canvasImgCxt, canvasBakRef, imgSrc} = this.state;
      const image = new Image(); 
      image.src = `${imgSrc}?timeStamp=${Date.now()}`;
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        let {width, height} = image;
        let {width: w, height: h} = this.refs.modifyBoxRef.getBoundingClientRect();
        let ww = w / width;
        let hh = h / height;
        width = ww > hh ? width * hh : width * ww;
        height = ww > hh ? height * hh : height * ww;

        this.setState({canvasW: width, canvasH: height}, () => {
          this.clearBakContext();
          this.clearImgContext();

          canvasImgCxt.drawImage(image, 0, 0, width, height);
          
          const {left, top} = canvasBakRef.getBoundingClientRect();
          this.setState({canvasL: left, canvasT: top});
        });	
      }
    });
  }

  drawDown(e) {
    let {clientX, clientY} = e||window.event;
    let {canvasBakCxt, lineColor, lineWidth, drawType, canvasL, canvasT} = this.state;

    clientX = clientX - canvasL;
    clientY = clientY - canvasT;

    canvasBakCxt.lineWidth = lineWidth;
    canvasBakCxt.strokeStyle= lineColor;
    canvasBakCxt.moveTo(clientX ,clientY);
		
    if(drawType === 1){
      canvasBakCxt.beginPath();
    } else if (drawType === 2) {
      this.toggleTextModal();
    } else if (drawType === 3) {
      canvasBakCxt.beginPath();
      canvasBakCxt.moveTo(clientX - 20, clientY - 20);					
      canvasBakCxt.lineTo(clientX + 20, clientY - 20);
      canvasBakCxt.lineTo(clientX + 20, clientY + 20);
      canvasBakCxt.lineTo(clientX - 20, clientY + 20);
      canvasBakCxt.lineTo(clientX - 20, clientY - 20);
      canvasBakCxt.stroke();
    }else if(drawType === 4){
      canvasBakCxt.beginPath();					
      canvasBakCxt.arc(clientX , clientY, 20, 0, Math.PI * 2, false);
      canvasBakCxt.stroke();
    } else if(drawType === 5){
      canvasBakCxt.beginPath();
      canvasBakCxt.moveTo(clientX - 15, clientY - 15);					
      canvasBakCxt.lineTo(clientX + 15, clientY + 15);
      canvasBakCxt.moveTo(clientX - 15, clientY + 15);
      canvasBakCxt.lineTo(clientX + 15, clientY - 15);
      canvasBakCxt.stroke();
    } else if(drawType === 6){
      canvasBakCxt.beginPath();	
      canvasBakCxt.moveTo(clientX - 15, clientY - 15);
      canvasBakCxt.lineTo(clientX  , clientY);	
      canvasBakCxt.lineTo(clientX + 30, clientY - 30);			
      canvasBakCxt.stroke();
    } else if(drawType === 7){
      canvasBakCxt.clearRect(clientX - 10 ,  clientY - 10 , 20 , 20);				
    }	

    this.setState({startX: clientX, startY: clientY, drawing: true});
  }

  drawStop(e) {
    this.setState({drawing: false});
  }

  drawMove(e) {
    let {clientX, clientY} = e||window.event;
    let {canvasBakCxt, drawType, drawing, canvasL, canvasT} = this.state;

    if (!drawing) return;

    clientX = clientX - canvasL;
    clientY = clientY - canvasT;

    if(drawType === 1){
      canvasBakCxt.lineTo(clientX, clientY);
      canvasBakCxt.stroke();						
    }else if(drawType === 7){	
      canvasBakCxt.clearRect(clientX - 10 ,  clientY - 10 , 20 , 20);
    }

    this.setState({startX: clientX, startY: clientY});
  }

  clearBakContext() {
    const {canvasBakCxt, canvasW, canvasH} = this.state;
    canvasBakCxt.clearRect(0, 0, canvasW, canvasH);
    this.setState({drawType: 1});
  }

  clearImgContext() {
    const {canvasImgCxt, canvasW, canvasH} = this.state;
    canvasImgCxt.clearRect(0, 0, canvasW, canvasH);
    this.setState({drawType: 1});
  }

  toggleType(type) {
    this.setState({drawType: type});
  }

  toggleLineColor(color) {
    this.setState({lineColor: color});
  }

  toggleLineWidth(width) {
    this.setState({lineWidth: width});
  }

  saveImg(next = false) {
    const {canvasImgRef, canvasImgCxt, canvasBakRef, canvasW, canvasH} = this.state;
    const image = new Image();
    image.src = canvasBakRef.toDataURL();
    image.onload = () => {
      canvasImgCxt.drawImage(image , 0 ,0 , canvasW , canvasH);
      setTimeout(() => {
        const img = new Image();
        const src = canvasImgRef.toDataURL();
        img.src = src;
        img.onload = () => {
          this.props.callback(this.dataURLtoBlob(src), next);
        };
      }, 300);
    }
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

  toggleTextModal() {
    this.setState({showTextModal: !this.state.showTextModal, textVal: ''});
  }

  drawTextIntoCanvas() {
    const {textVal, canvasBakCxt, startX, startY, lineColor} = this.state;

    if (!textVal) {
      message.error('请输入您要插入的文字', 5);
      return;
    }

    canvasBakCxt.fillStyle = lineColor;
    canvasBakCxt.font = '16px Microsoft YaHei';
    canvasBakCxt.textAlign  = 'center';
    canvasBakCxt.textBaseline = 'middle';
    canvasBakCxt.fillText(textVal, startX, startY);

    this.setState({textVal: '', showTextModal: false});
  }

  render() {
    const {canvasW, canvasH, drawType, lineColor, lineWidth, showTextModal, textVal, imgSrc} = this.state;

    return imgSrc ? (
      <div className={cx('modifyphoto')}>
        <div className={cx('modify')}>
          <div className={cx('modify-box')} ref="modifyBoxRef">
            <canvas className={cx('canvas-img')} ref="canvasImg" width={canvasW} height={canvasH}></canvas>
            <canvas 
              ref="canvasBak" 
              className={cx('canvas-bak')} 
              width={canvasW} height={canvasH}
              onMouseUp={(e) => this.drawStop(e)}
              onMouseLeave={(e) => this.drawStop(e)}
              onMouseDown={(e) => this.drawDown(e)}
              onMouseMove={(e) => this.drawMove(e)}
              style={{cursor: drawType === 2 ? 'text' : 'default'}}
            ></canvas>
          </div>
          <div className={cx('buttons')}>
            <span className={cx('submit')} onClick={() => this.saveImg()}>提交</span>
            <span className={cx('submit')} onClick={() => this.saveImg(true)}>提交并批注下一张</span>
          </div>
        </div>
        <div className={cx('tools')}>
          <ul className={cx('ul')}>
            <Tooltip title="涂鸦" placement="right">
              <li onClick={() => this.toggleType(1)} className={cx(['a', drawType === 1 ? 'cur' : ''])}></li>
            </Tooltip>
            <Tooltip title="文字" placement="right">
              <li onClick={() => this.toggleType(2)} className={cx(['b', drawType === 2 ? 'cur' : ''])}></li>
            </Tooltip>
            <Tooltip title="框" placement="right">
              <li onClick={() => this.toggleType(3)} className={cx(['c', drawType === 3 ? 'cur' : ''])}></li>
            </Tooltip>
            <Tooltip title="圆" placement="right">
              <li onClick={() => this.toggleType(4)} className={cx(['d', drawType === 4 ? 'cur' : ''])}></li>
            </Tooltip>
            <Tooltip title="错" placement="right">
              <li onClick={() => this.toggleType(5)} className={cx(['e', drawType === 5 ? 'cur' : ''])}></li>
            </Tooltip>
            <Tooltip title="对" placement="right">
              <li onClick={() => this.toggleType(6)} className={cx(['f', drawType === 6 ? 'cur' : ''])}></li>
            </Tooltip>
            <Tooltip title="橡皮擦" placement="right">
              <li onClick={() => this.toggleType(7)} className={cx(['g', drawType === 7 ? 'cur' : ''])}></li>
            </Tooltip>
            <Tooltip title="重置" placement="right">
              <li onClick={() => this.clearBakContext()} className={cx('h')}></li>
            </Tooltip>
          </ul>
          {
            drawType === 1 ? (
              <div className={cx('line-style')}>
                <div className={cx('colors')}>
                  <h3>颜色</h3>
                  <span onClick={() => this.toggleLineColor('#ff0000')} className={cx(['a', lineColor === '#ff0000' ? 'cur' : ''])}></span>
                  <span onClick={() => this.toggleLineColor('#ffff00')} className={cx(['b', lineColor === '#ffff00' ? 'cur' : ''])}></span>
                  <span onClick={() => this.toggleLineColor('#356af7')} className={cx(['c', lineColor === '#356af7' ? 'cur' : ''])}></span>
                  <span onClick={() => this.toggleLineColor('#000000')} className={cx(['d', lineColor === '#000000' ? 'cur' : ''])}></span>
                </div>
                <div className={cx('width')}>
                  <h3>粗细</h3>
                  <span onClick={() => this.toggleLineWidth(2)} className={cx(['a', lineWidth === 2 ? 'cur' : ''])} style={{backgroundColor: lineColor}}></span>
                  <span onClick={() => this.toggleLineWidth(3)} className={cx(['b', lineWidth === 3 ? 'cur' : ''])} style={{backgroundColor: lineColor}}></span>
                  <span onClick={() => this.toggleLineWidth(4)} className={cx(['c', lineWidth === 4 ? 'cur' : ''])} style={{backgroundColor: lineColor}}></span>
                  <span onClick={() => this.toggleLineWidth(5)} className={cx(['d', lineWidth === 5 ? 'cur' : ''])} style={{backgroundColor: lineColor}}></span>
                  <span onClick={() => this.toggleLineWidth(6)} className={cx(['e', lineWidth === 6 ? 'cur' : ''])} style={{backgroundColor: lineColor}}></span>
                </div>
              </div>
            ) : null
          }
          
        </div>
        <div className={cx('close')} onClick={() => this.props.close()}></div>

        {/* 文字输入 */}
        <Modal
          title="请输入您要插入的文字"
          visible={showTextModal}
          onOk={() => this.drawTextIntoCanvas()}
          onCancel={() => this.toggleTextModal()}
        >
          <Input placeholder="请输入您要插入的文字" value={textVal} onChange={(e) => this.setState({textVal: e.target.value})}/>
        </Modal>
      </div>
    ) : null
  }
}

export default ModifyPhoto;