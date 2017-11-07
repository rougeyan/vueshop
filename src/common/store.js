// 作为数据存储;
// 第一个是存:
// 通用
export function saveToLocal (id, key, val) {
    // 因为前面localStore已经存储了localStore 可以识别到localstore 的对应ID的__seller__;
    let seller = window.localStorage.__seller__;
    if (!seller) {
        seller = {};
        // 数组对应id的
        seller[id] = {};
    } else {
        // 这里seller 变量提升了;
        seller = JSON.parse(seller);
        if (!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = val;
    window.localStorage.__seller__ = JSON.stringify(seller);
};
// 有存就有读
// 读取
export function loadFromLocal (id, key, def) {
    // 获取,没有返回默认值;
    // 有则
    let seller = window.localStorage.__seller__;
    if (!seller) {
        return def;
    }
    seller = JSON.parse(seller)[id];
    if (!seller) {
        return def;
    }
    // id 已经数据都的话
    // 当前页面的状态;
    // 同真为真; 其他为假;
    let ret = seller[key];
    console.log(ret + '1111111');
    return ret || def;
};

