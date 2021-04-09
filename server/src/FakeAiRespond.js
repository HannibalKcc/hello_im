// 关键字智能回复
const respondMap = new Map([
    ['发货', '今天 6:00 前下单，今天发货'],
    ['包邮', '满5元包邮'],
    ['尺寸', '本产品尺寸为 1m * 1m * 1m'],
]);

function getRespond(inputStr) {
    const reg = new RegExp(`(${[...respondMap.keys()].join('|')})`);
    if (![undefined, null].includes(inputStr.match(reg)[0])) {
        return respondMap.get(inputStr.match(reg)[0]);
    } else {
        return null;
    }
}

module.exports = getRespond;
