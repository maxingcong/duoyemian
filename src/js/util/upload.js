import axios from 'axios';
import { message } from 'antd';
import formatTime from 'app/util/formatTime';
// import { base } from 'app/util/base';
const COS = require('cos-js-sdk-v5');

const {protocol, hostname} = location;
var baseApi = `${protocol}//${hostname}`;
var Region = 'ap-guangzhou';
var Bucket = 'tea-202002-1301282269';
var prefix = 'http://' + Bucket + '.cos.' + Region + '.myqcloud.com/';
const stsUrl = baseApi + '/filestore/qcloud/temp-secret/' + Bucket;

const cos = new COS({
  getAuthorization: function (options, callback) {
    // 异步获取临时密钥
    axios.get(stsUrl, {
      params: {
        bucket: options.Bucket,
        region: options.Region,
      }
    }).then(function (response) {
      console.log('response', response);
      const data = response.data.data;
      Region = data.region;
      Bucket = data.bucket;
      callback({
        TmpSecretId: data.secretId,
        TmpSecretKey: data.secretKey,
        XCosSecurityToken: data.sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: Date.now() / 1000,  // 单位是秒
        ExpiredTime: data.expDate
      });
    }).catch(function (error) {
      console.log('获取临时密钥失败', error);
      this.setState({
        uploadLoading: false
      })
    });
  }
});

// 上传文件
const uploadFile = (options) => {
  const _this = this;
  const {file = {}, callback} = options;
  const date = formatTime(new Date(), 'yyyyMMdd');
  axios({
    url: `${baseApi}/filestore/record-file`,
    method: 'POST',
    data: {
      bucket: Bucket,
      path: `tea/pc/work-image/${date}`,
      name: file.name || 'temp.jpg',
      client: 'tea-pc',
      size: (file.size || 0),
      custom: JSON.stringify(file.custom || {}),
      creator: ''
    },
  }).then((respone) => {
    if (!respone.data.suc) {
      _this.setState({
        uploadLoading: false,
      })
      return message.error('上传图片出错');
    }
    const uuid = respone.data.data;
    const suffix = file.name ? file.name.substr(file.name.lastIndexOf('.')) : '.jpg';//后缀
    const cosPath = `tea/pc/work-image/${date}/${uuid}${suffix}`;
    cos.putObject({
      Bucket, /* 必须 */
      Region,    /* 存储桶所在地域，必须字段 */
      Key: cosPath,             /* 必须 */
      Body: file, // 上传文件对象
      onProgress: function (progressData) {
        typeof options.progress === 'function' && options.progress(progressData);
      }
    }, function (err, data) {
      if (!err) {
        if (options.type === 'file') {
          let needCompress = ['.png', '.jpg', '.jpeg', '.mp3', '.mp4', '.mov', '.m4a'].indexOf(suffix.toLocaleLowerCase()) > -1;
          let url = `${baseApi}/filestore/notify-uploaded?uuids=${uuid}`;
          if (needCompress) url = `${baseApi}/filestore/trigger-thumb?uuids=${uuid}`;
          axios({url}).then(() => {
            axios({url: `${baseApi}/netdisk/api/net-disk-files/uuid/${uuid}`}).catch(err => callback(err));
          }).catch(err => callback(err));
        } else {
          axios({url: `${baseApi}/filestore/trigger-thumb?uuids=${uuid}`});
        }

        callback(err, {file: prefix + cosPath, uuids: uuid});
      }
      console.log('cos putObject complete => ', err, data);
    });
  }).catch(function (error) {
    callback(error);
    console.log('cos putObject error => ', error);
  });

};


export default uploadFile;
