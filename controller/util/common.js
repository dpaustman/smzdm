let cheerio = require('cheerio');

function jsRight(sr, rightn) {
    return sr.substring(sr.length - rightn, sr.length)
}

function getNow(type = 1) {
    let date = new Date()

    let a = date.getFullYear()
    let b = jsRight(('0' + (date.getMonth() + 1)), 2)
    let c = jsRight(('0' + date.getDate()), 2)
    let d = jsRight(('0' + date.getHours()), 2)
    let e = jsRight(('0' + date.getMinutes()), 2)
    let f = jsRight(('0' + date.getSeconds()), 2)
    let output
    switch (type) {
        case 0:
            output = a + '年' + b + '月' + c + '日'
            break
        case 1:
            output = a + '-' + b + '-' + c + ' ' + d + ':' + e + ':' + f
            break
        case 2:
            output = a + '年' + b + '月' + c + '日' + d + '时' + e + '分' + f + '秒'
            break
        case 3:
            output = a + '-' + b + '-' + c + ' ' + d + ':' + e
            break
        case 4:
            output = a + '年' + b + '月' + c + '日  ' + d + '时' + e + '分'
            break
        case 5:
            output = b + '/' + c + '/' + a
            break
        case 6:
            output = a + '-' + b + '-' + c
            break
        case 7:
            output = a + '-' + b

            break
        case 8:
            output = a + b + c
            break
    }
    return output
}


/**
 * @param {any} options={
 *  html:'',
 *  parentNode:'', // 主结点
 *  children:{
 *      node:'', //子结点名
 *      name:'', //键值
 *      formatter(selecter) //格式转换,
 *      mode:0/1(0：默认，返回array，数据按children中定义；1：返回object,key按children定义)
 *  }
 * }
 */
function parseHTML(options) {
    let $ = cheerio.load(options.html);
    let data = [];
    let parentNode = $(options.parentNode);

    if (parentNode.length === 0) {
        return data;
    }

    // detail: http://es6.ruanyifeng.com/?search=delete&x=0&y=0#docs/reflect
    if (Reflect.has(options, 'mode')) {
        let data = {};
        parentNode.each((i, pNode) => {
            let item = options.children[i];
            let node = (Reflect.has(item, 'node')) ? $(pNode).find(item.node) : $(pNode);
            data[item.name] = (typeof item.formatter === 'function') ? item.formatter(node) : node.text().trim();
            if (typeof options.formatter == 'function') {
                data = options.formatter(data);
            }
        });
        return data;
    }

    parentNode.each((i, pNode) => {
        let nodeData = {};
        options.children.forEach(item => {
            let node = (Reflect.has(item, 'node')) ? $(pNode).find(item.node) : $(pNode);
            if (typeof item.formatter === 'function') {
                nodeData[item.name] = item.formatter(node);
            } else {
                let text = node.text().trim();
                nodeData[item.name] = text == '' ? 0 : text;
            }
        });

        if (typeof options.formatter == 'function') {
            nodeData = options.formatter(nodeData);
        }
        data.push(nodeData);
    });
    return data;
}

module.exports = {
    getNow,
    parseHTML
}