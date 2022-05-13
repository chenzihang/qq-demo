/*
防抖函数
@func 需要执行的函数
@wait 间隔
*/
export function debounce(func, wait) {
  let timeout;
  return function () {
      let context = this;
      let args = arguments;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
          func.apply(context, args)
      }, wait);
  }
}