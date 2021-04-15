// 关键字智能回复

// 比如 发货 返回选项 [发货时间、发货地址、选择顺丰发货]
const respondMap = new Map([
    ['发货', '今天 6:00 前下单，今天发货'],
    ['包邮', '满5元包邮'],
    ['尺寸', '本产品尺寸为 1m * 1m * 1m'],
]);

function getRespond(inputStr) {
    const reg = new RegExp(`(${[...respondMap.keys()].join('|')})`);
    const match = inputStr.match(reg);
    if (match != null && ![undefined, null].includes(match[0])) {
        return respondMap.get(match[0]);
    } else {
        return null;
    }
}

module.exports = getRespond;
