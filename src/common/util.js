// **
// *解释url参数;
// @example  http://localhost:8080/?id=12345&a=b#/goods
// @ return Object {id:12345, a:b}
// 主要是针对字符串的
export function urlParse () {
    let url = window.location.search;
    let obj = {};
    // 字符串操作;
    //               ?       id              =         12345       >>>>>>>>>>  &a=b 同理;
    // 理解:  [?&] 匹配问号 [^?&] 匹配 id   =匹配=         [^?&] 匹配12345 非问号和&
    let reg = /[?&][^?&]+=[^?&]+/g;
    // (?和&) 非 (?和&)  =匹配 =  /g 全局;
    let arr = url.match(reg);
    console.log(arr);
    // 定义和用法  match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
    // 返回一个数组;
    // ['?']
    // 数组循环
    if (arr) {
        arr.forEach((item) => {
            // 去除第一个字符; 然后等号分割;
            let tempArr = item.substring(1).split('=');
            // decodeURIComponent 不是很知道是什么意思;
            let key = decodeURIComponent(tempArr[0]);
            let val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        });
    }
    console.log(obj);
    return obj;
}
