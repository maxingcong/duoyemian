/**
 * 通用请求模块
 */
import { message } from 'antd';
import axios from 'axios';
import Cookie from 'js-cookie';

module.exports = (data) => {
  return axios(data).then(res => res.data).then((resData = {}) => {
    if (resData.code == 401 || resData.code == 'SYS_406') {
      message.error(resData.message || resData.msg || `接口${data.url || ''}请求出错`, 10);
      if (resData.code == 'SYS_406') {
        Cookie.remove('JSESSIONID');
      }
      setTimeout(() => {
        window.location.href = '/login'
      },1000);
      return false;
    } else if (resData.code != 0) {
      message.error(resData.message || resData.msg ||  `接口${data.url || ''}请求出错`, 10);
      return false;
    }
    return resData.data || resData || false;
  });
}

