;function isArray(arr){
    return Object.prototype.toString.call(arr) === '[object Array]';
}

function isFunction(fn){
    return Object.prototype.toString.call(fn) === '[object Function]'
}


//递归来实现一个深度克隆
function cloneObject(src){
    var obj = {};
    for(var key in src){
        if (typeof(src[key]) !== 'object' || src[key] === null){
            obj[key] = src[key];
        }else{
            if(Object.prototype.toString.call(src[key]) === '[object Object]'){
                obj[key] = cloneObject(src[key]);
            }else if(Object.prototype.toString.call(src[key]) === '[object Array]'){
                obj[key] = src[key].slice(0);
            }
        }
    }
    return obj;
}

// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr) {
    // your implement
    var thatArr = [];
    thatArr.push(arr[0]);
    for(var i=1;i<arr.length;i++){
        var count = 0;
        for(var j=0;j<thatArr.length;j++){
            if (arr[i] === thatArr[j]){
                count++;
            }
        }
        if (count < 1){
            thatArr.push(arr[i]);
        }
    }
    return thatArr;
}

// 很多同学肯定对于上面的代码看不下去，接下来，我们真正实现一个trim
// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    // your implement
    var reg = /(^\s*)|(\s*$)/g;
    str.replace(reg,'');
    return str;
}

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    // your implement
    for (var i=0;i<arr.length;i++){
        fn(arr[i],i);
    }
}

// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
    var length = 0;
    for(var key in obj){
        length++;
    }
    return length;
}

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    // your implement
    element.className = newClassName;
    return element;
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    // your implement
    return (element.parentNode === siblingNode.parentNode);
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var pos = {};
    pos.x = element.offsetLeft;
    pos.y = element.offsetTop;
    return pos;
}

// 实现一个简单的Query
function $(selector) {
    var doc = document;
    var doms = doc.getElementsByTagName('*');
    if (/^#/.test(selector)){
        // 返回id为adom的DOM所包含的所有子节点中，第一个样式定义包含classa的对象
        if (/^#\w+\s+\.\w+$/.test(selector)){
            var idName = doc.getElementById(selector.replace(/(^#)|(\s*\.\w+$)/g,''));
            for(var i=0;i<idName.children.length;i++){
                if (idName.children[i].className === selector.replace(/^#\w+\s+\./,'')){
                    return idName.children[i];
                }
            }
        }else{
            //返回id为adom的DOM对象
            return doc.getElementById(selector.replace(/^#/,''));
        }
    }else if (/^\./.test(selector)){
        //返回第一个样式定义包含classa的对象
        var classname = selector.replace(/^\./,'');
        for (var i=0;i<doms.length;i++){
            if (doms[i].className === classname){
                return doms[i];
            }
        }
    }else if(/^\[data-\S+]$/.test(selector)){
        var dataAttr = selector.replace(/(^\[)|(\]$)/g,'');
        console.log(dataAttr.split('='));
        if (/=/.test(dataAttr)){
            // 返回第一个包含属性data-time且值为2015的对象
            var attrName = dataAttr.split('=')[0];
            var attrVal = dataAttr.split('=')[1];
            var attr = [];
            for(var i=0;i<doms.length;i++){
                if (doms[i].getAttribute(attrName) === attrVal){
                    return doms[i];
                }
            }
        }else{
            // 返回第一个包含属性data-log的对象
            for(var i=0;i<doms.length;i++){
                if (doms[i].getAttribute(dataAttr) !== null){
                    return doms[i];
                }
            }
        }
    }else{
        //返回第一个<a>对象
        return doc.getElementsByTagName(selector)[0];
    }

    // 给一个element绑定一个针对event事件的响应，响应函数为listener
    function addEvent(element, event, listener) {
        // your implement
        element.addEventListener(event,listener,false);
    }

// 移除element对象对于event事件发生时执行listener的响应
    function removeEvent(element, event, listener) {
        // your implement
        element.removeEventListener(event,listener,false);
    }

// 实现对click事件的绑定
    function addClickEvent(element, listener) {
        // your implement
        element.addEventListener('click',listener,false);
    }

// 实现对于按Enter键时的事件绑定
    function addEnterEvent(element, listener) {
        // your implement
        element.onkeydown = function (e) {
            e = e || window.event;
            if (e.keyCode === 13){
                listener();
            }
        }
    }
}
/*接下来我们把上面几个函数和$做一下结合，把他们变成$对象的一些方法

 addEvent(element, event, listener) -> $.on(element, event, listener);
 removeEvent(element, event, listener) -> $.un(element, event, listener);
 addClickEvent(element, listener) -> $.click(element, listener);
 addEnterEvent(element, listener) -> $.enter(element, listener);*/
$.on = function (element,event,listener) {
    $(element).addEventListener(event,listener,false);
};
$.un = function (element, event, listener) {
    $(element).removeEventListener(event,listener,false);
};
$.click = function (element, listener) {
    $(element).addEventListener('click',listener,false);
};
$.enter = function (element, listener) {
    $(element).onkeydown = function (e) {
        if (e.keyCode === 13){
            listener();
        }
    }
};
//事件委托
$.delegate = function(element, tag, eventName, listener) {
    $(element).addEventListener(eventName, function (event) {
        var e = event || window.event;
        var target = e.srcElement? e.srcElement : e.target;
        if (target.nodeName === 'LI'){
            listener(e);
        }
    },false);
};

function isIE() {
    // your implement
    适用ie11以下版本
    var ua = navigator.userAgent;
    if (/msie/i.test(ua)){
        return (/\d+/.exec(/msie\s*\d+/gi.exec(ua)));
    }else{
        return -1;
    }
}

//学习Ajax，并尝试自己封装一个Ajax方法。实现如下方法：
function ajax(url, options) {
    try{
        var xmlhttp = new XMLHttpRequest();
    }catch (ie6){
        var xmlhttp = new ActiveXObject('Microsoft.XMLHttp');
    }

    var type = options.type || 'GET';
    var data = options.data || {};
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
            if(options.onsuccess){
                options.onsuccess(xmlhttp.responseText,xmlhttp);
            }
        }else{
            if(options.onfail){
                options.onfail(xmlhttp.responseText,xmlhttp);
                return false;
            }
        }
    }
    //get形式发送
    if (type.toUpperCase() === 'GET'){
        url += '?';
        for (var key in options.data){
            url += (key +'='+ options.data[key]+'&');
        }
        url = url.substr(0,url.length-1);
        xmlhttp.open(type,url);
        xmlhttp.send();
    }else{
        //post形式发送
        var datas = '';
        for (var key in options.data){
            datas += (key +'='+ options.data[key]+'&');
        }
        datas = datas.substr(0,datas.length-1);
        xmlhttp.open(type,url);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send(datas);
    }

}

//dom操作

//找到上一个兄弟节点
function prev(elememnt){
    var parents = elememnt.parentNode;
    for (var i=0;i<parents.children.length;i++){
        if (parents.children[i] === elememnt){
            return parents.children[--i];
        }
    }
}

//找到下一个兄弟节点
function next(elememnt){
    var parents = elememnt.parentNode;
    for (var i=0;i<parents.children.length;i++){
        if (parents.children[i] === elememnt){
            return parents.children[++i];
        }
    }
}