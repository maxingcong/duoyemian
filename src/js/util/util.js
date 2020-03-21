export default {
  getParaFromUrl: (para) => {
    try {
      const reg = new RegExp(`(^|&)${para}=([^&]*)(&|$)`, 'i');
      const r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return '';
    } catch (e) {
      return '';
    }
  }
};