//选择器
function $(selector){
    if(/^#/.test(selector)){
        return document.querySelector(selector);
    }else{
        return document.querySelectorAll(selector);
    }
}

//上一个兄弟节点
function prevNode(element){
    return element.previousElementSibling;
}

//下一个兄弟节点
function nextNode(element){
    return element.nextElementSibling;
}