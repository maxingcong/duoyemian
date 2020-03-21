/**
 * 项目基础配置
 */
import { message } from 'antd';
const config = {};

try {
  const initialData = JSON.parse(window.globalData);

  config['basePath'] = initialData.basepath ? `//${initialData.basepath}` : '';
  config['baseApi'] = initialData.apipath ? `//${initialData.apipath}` : '';
  config['uploadApi'] = initialData.uploadpath ? `//${initialData.uploadpath}` : '';
  config['logoutPath'] = initialData.logoutpath ? `//${initialData.logoutpath}` : '';
  config['modifyPwdPath'] = initialData.modifypwdpath ? `//${initialData.modifypwdpath}` : '';
} catch(e) {
  message.error('数据格式化出错', 5);
}

module.exports = config;
