import { message } from "antd"
import axios from 'axios';

const download = (obj) => (
  axios({
    method: 'GET',
    url: `${obj.url}?t=${Date.now()}`,
    // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
    responseType: 'blob',
  }).then((res) => {
    if (!res) {
      return message.error('下载失败');
    }
    // 将lob对象转换为域名结合式的url
    let blobUrl = window.webkitURL.createObjectURL(res.data);
    let link = document.createElement('a');
    document.body.appendChild(link);
    link.style.display = 'none';
    link.setAttribute('download', obj.name);
    link.href = blobUrl;
    link.click();
    document.body.removeChild(link)
    setTimeout(() => {
      window.webkitURL.revokeObjectURL(blobUrl);
    }, 1000);
    // 
  }).catch((error) => {
    console.log('文件下载失败', error)
    message.error('文件下载失败', 5);
  })
);

// const download = (url) => {
//   const downloadFileA = document.createElement('a')
//   document.body.append(downloadFileA)
//   downloadFileA.href=url;
//   downloadFileA.setAttribute('download', true);
//   //downloadFileA.download = '';
//   // 超链接 target="_blank" 要增加 rel="noopener noreferrer" 来堵住钓鱼安全漏洞。如果你在链接上使用 target="_blank"属性，并且不加上rel="noopener"属性，那么你就让用户暴露在一个非常简单的钓鱼攻击之下。(摘要)
//   downloadFileA.rel = 'noopener noreferrer'
//   downloadFileA.click()
//   document.body.removeChild(downloadFileA)
// }
export default download;
