function formatTime(date, fmt) {
  let ret;
  let opt = {// yyyy-MM-dd HH:mm:ss
    "y+": date.getFullYear().toString(),        // 年
    "M+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "m+": date.getMinutes().toString(),         // 分
    "s+": date.getSeconds().toString()          // 秒
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : PrefixInteger(opt[k], ret[1].length))
    };
  };
  return fmt;
}
function PrefixInteger(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}
export default formatTime;