(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _util = require('./util.js');

var $ = _util.tools.$;

//页面加载处理
(function () {

    //检测localStorage是否存在,不存在就添加初始数据
    if (localStorage.getItem('localData') === null) {
        localStorage.setItem('localData', '[{"folderName":"默认分类","checked":false,"files":[{"fileName":"README","checked":true,"taskList":[{"taskName":"README","taskDate":"2016-01-15","taskContent":"xxxxxxxxxxxxxxxxx","complete":true,"checked":true}]}]}]');
    }

    //控制高度和宽度
    var addFilesBtnWidth = window.getComputedStyle($('#middle')).width,
        addFilesBtnHeight = window.getComputedStyle($('.addFilesBtn')[0]).height,
        headerHeight = window.getComputedStyle($('header')[0]).height,
        winHeight = document.documentElement.clientHeight || document.body.clientHeight;
    $('.addFilesBtn')[1].style.width = addFilesBtnWidth;
    $('#main').style.height = winHeight - parseInt(headerHeight) - parseInt(addFilesBtnHeight) + 'px';
    window.addEventListener('resize', function () {
        $('.addFilesBtn')[1].style.width = window.getComputedStyle($('#middle')).width;
        $('#main').style.height = winHeight - parseInt(headerHeight) - parseInt(addFilesBtnHeight) + 'px';
    }, false);

    //初始化加载view
    _util.setView.loadFileView();
    _util.setView.loadTaskView();
    _util.setView.loadContentView();
})();

//任务列表双击隐藏
$("#left").addEventListener('dblclick', function (event) {
    var e = window.event || event;
    if (e.target.nodeName === 'H3') {
        if (_util.tools.nextNode(e.target).style.display === ('block' || null)) {
            _util.tools.nextNode(e.target).style.display = 'none';
        } else {
            _util.tools.nextNode(e.target).style.display = 'block';
        }
    }
}, false);
//
//
//$('#left').addEventListener('click', function (event) {
//    let e = window.event || event;
//    //删除分类列表
//    //删除文件
//    if ((e.target.className === 'rmFileBtn') &&
//        (e.target.parentNode.nodeName === 'LI') &&
//        (confirm('Are you sure?'))){
//        //删除子文件数据
//        setData.removeFileData(e.target.parentNode.innerText.replace(/X$/,''),
//            prevNode(e.target.parentNode.parentNode).innerText.replace(/X$/,''));
//        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
//        //删除文件夹
//    }else if ((e.target.className === 'rmFileBtn') &&
//        (e.target.parentNode.nodeName === 'H3') &&
//        (confirm('Are you sure?'))){
//        //删除文件夹及其子文件数据
//        setData.removeFolderData(e.target.parentNode.innerText.replace(/X$/,''));
//        this.removeChild(e.target.parentNode.parentNode);
//    }
//    //添加分类
//    if(e.target.className === 'addFilesBtn'){
//        $('#createMask').style.display ='block';
//    }
//    //leftBar添加选中的标记
//    (function () {
//        let flag = $('#checked');
//        if ((e.target.nodeName === 'LI' || e.target.nodeName === 'H3')){
//            flag.id = null;
//            e.target.id = 'checked';
//        }
//        //加载middle的task
//        loadTask();
//        //加载right
//        loadTaskContent();
//    })();
//},false);
//
////创建文件或文件夹
//$('#createMask').addEventListener('click', function (event) {
//    let e = window.event || event,
//        localData = JSON.parse(localStorage.getItem('localData'));
//    //关闭创建窗口
//    if(e.target === $('#cancelBtn')){
//        $('#createMask').style.display ='none';
//    }
//    //创建
//    if(e.target === $('#createBtn')){
//        let inputFileNameVal = $('#inputFileName').value;
//        //创建文件夹
//        if($('#folder').checked){
//            //修改本地存储数据
//            setData.addFolderData(inputFileNameVal);
//            //重新加载left的文件and文件夹
//            loadFile();
//        }else{
//            //创建文件
//            let checked = $('#checked');
//            console.log(checked);
//            if(checked.nodeName === 'LI'){
//                setData.addFileData(inputFileNameVal,
//                    prevNode($('#checked').parentNode).innerText.replace(/X$/,''));
//            }else if(checked.nodeName === 'H3'){
//                setData.addFileData(inputFileNameVal,checked.innerText.replace(/X$/,''));
//            }
//            //重新加载left的文件and文件夹
//            loadFile();
//        }
//    }
//},false);
//
//(function () {
//    let checked = $('.taskBox')[0].children[1].children[0];
//    $('#middle').addEventListener('click', function (event) {
//        let e = window.event || event;
//        //点击middle的完成分类按钮
//        if (e.target.nodeName === 'A'){
//            let labelChecked = $('.labelChecked')[0];
//            labelChecked.className = null;
//            e.target.className = 'labelChecked';
//        }else if (e.target.nodeName === 'LI'){
//            checked.id = '';
//            e.target.id = 'taskChecked';
//            checked = e.target;
//        }
//        if(e.target === $('.addFilesBtn')[1]){
//        }
//        loadTaskContent();
//    },false)
//})();
//
//$('#right').addEventListener('click', function (event) {
//    let e = window.event || event;
//    //按下任务完成按钮
//    if(e.target === $('#completeBtn')){
//        let taskChecked = $('#taskChecked');
//        //setData.setTaskComplete(true,e.target.innerText,)
//    }
//},false);

},{"./util.js":2}],2:[function(require,module,exports){
"use strict";
//工具函数

Object.defineProperty(exports, "__esModule", {
    value: true
});
var tools = {

    ////选择器
    $: function $(selector) {
        if (/^#/.test(selector)) {
            return document.querySelector(selector);
        } else {
            return document.querySelectorAll(selector);
        }
    },

    //上一个兄弟节点
    prevNode: function prevNode(element) {
        return element.previousElementSibling;
    },

    //下一个兄弟节点
    nextNode: function nextNode(element) {
        return element.nextElementSibling;
    }
};

//视图修改

var setView = {
    div: document.createElement('div'),
    li: document.createElement('li'),

    //清除上次的视图，将用来重绘
    clearDirty: function clearDirty(name) {
        var clearList = document.getElementById(name);
        if (clearList.length > 0) {
            var parent = clearList[0].parentNode;
            for (var i = 0; i < clearList.length; i++) {
                parent.removeChild(clearList[i]);
            }
        }
    },

    //页面载入时加载left文件and文件夹
    loadFileView: function loadFileView() {
        var localData = JSON.parse(localStorage.getItem('localData'));
        this.clearDirty('leftBox');
        for (var i = 0; i < localData.length; i++) {
            var filesBox = this.div.cloneNode(true);
            filesBox.className = 'filesBox';
            var str = '';
            if (localData[i].checked) {
                str += '<h3 id="fileChecked>';
            } else {
                str += '<h3>';
            }
            str += localData[i].folderName + '<span class="rmFileBtn">X</span>' + '</h3>' + '<ul>';
            for (var j = 0; j < localData[i].files.length; j++) {
                if (localData[i].files[j].checked) {
                    str += '<li id="fileChecked">';
                } else {
                    str += '<li>';
                }
                str += localData[i].files[j].fileName + '<span class="rmFileBtn">X</span></li>';
            }
            str += '</ul>';
            filesBox.innerHTML = str;
            tools.$('#leftBox').appendChild(filesBox);
        }
    },

    //加载middle的task
    loadTaskView: function loadTaskView() {
        var localData = JSON.parse(localStorage.getItem('localData')),
            fileChecked = document.getElementById('fileChecked');
        this.clearDirty('middleBox');
        if (fileChecked.nodeName === 'H3') {
            for (var i = 0; i < localData.length; i++) {
                console.log('ok');
                if (localData[i].folderName === fileChecked.innerText.replace(/X/, '')) {
                    for (var j = 0; j < localData[i].files.length; j++) {
                        console.log('ok');
                        //查找labelChecked
                        if ($('#labelChecked') === $('#label').children[0]) {
                            console.log('0');
                        }
                    }
                }
            }
        } else if (fileChecked.nodeName === 'LI') {
            for (var i = 0; i < localData.length; i++) {
                var taskDateBox = [undefined];
                for (var j = 0; j < localData[i].files.length; j++) {
                    if (localData[i].files[j].fileName === fileChecked.innerText.replace(/X/, '')) {
                        switch (tools.$('#labelChecked')) {
                            case tools.$('#label').children[0]:
                                for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                    var str = '',
                                        taskBox = this.div.cloneNode(true);
                                    taskBox.className = 'taskBox';

                                    //判断是否已经创建相同的时间块
                                    for (var l = 0; l < taskDateBox.length; l++) {
                                        if (localData[i].files[j].taskList[k].taskDate === taskDateBox[l]) {
                                            var _singleTask = this.li.cloneNode(true);
                                            if (localData[i].files[j].taskList[k].taskComplete) {
                                                _singleTask.className = 'taskComplete';
                                            }
                                            if (localData[i].files[j].taskList[k].checked) {
                                                _singleTask.id = 'taskChecked';
                                            }
                                            //找到相同时间块
                                            for (var m = 0; m < tools.$('.taskDate').length; m++) {
                                                if (tools.$('.taskDate')[m].innerText === localData[i].files[j].taskList[k].taskDate) {
                                                    tools.nextNode(tools.$('.taskDate')[m]).appendChild(_singleTask);
                                                    break;
                                                }
                                            }
                                        } else {

                                            //没有相同时间块
                                            str += '<div class="taskDate">' + localData[i].files[j].taskList[k].taskDate + '</div>' + '<ul class="taskList">';
                                            //添加完成标志
                                            if (localData[i].files[j].taskList[k].complete) {
                                                if (localData[i].files[j].taskList[k].checked) {
                                                    str += '<li class="taskComplete" id="taskChecked">' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                                } else {
                                                    str += '<li class="taskComplete">' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                                }
                                            } else {
                                                str += '<li>' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                                if (localData[i].files[j].taskList[k].checked) {
                                                    singleTask.id = 'taskChecked';
                                                }
                                            }
                                            taskBox.innerHTML = str;
                                            //将taskDate存入数组
                                            taskDateBox.push(localData[i].files[j].taskList[k].taskDate);
                                            tools.$('#middleBox').appendChild(taskBox);
                                        }
                                    }
                                }
                                break;
                            case tools.$('#label').children[1]:
                                for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                    var str = '',
                                        taskBox = this.div.cloneNode(true);
                                    taskBox.className = 'taskBox';

                                    //判断是否已经创建相同的时间块
                                    if (!localData[i].files[j].taskList.complete) {
                                        for (var l = 0; l < taskDateBox.length; l++) {
                                            if (localData[i].files[j].taskList[k].taskDate === taskDateBox[l]) {
                                                var _singleTask2 = this.li.cloneNode(true);
                                                //找到相同时间块
                                                for (var m = 0; m < tools.$('.taskDate').length; m++) {
                                                    if (tools.$('.taskDate')[m].innerText === localData[i].files[j].taskList[k].taskDate) {
                                                        tools.nextNode(tools.$('.taskDate')[m]).appendChild(_singleTask2);
                                                        break;
                                                    }
                                                }
                                            } else {

                                                //没有相同时间块
                                                str += '<div class="taskDate">' + localData[i].files[j].taskList[k].taskDate + '</div>' + '<ul class="taskList">' + '<li>' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                                taskBox.innerHTML = str;
                                                //将taskDate存入数组
                                                taskDateBox.push(localData[i].files[j].taskList[k].taskDate);
                                                tools.$('#middleBox').appendChild(taskBox);
                                            }
                                        }
                                    }
                                }
                                break;
                            case tools.$('#label').children[2]:
                                for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                    var str = '',
                                        taskBox = this.div.cloneNode(true);
                                    taskBox.className = 'taskBox';

                                    //判断是否已经创建相同的时间块

                                    //有相同时间快
                                    for (var l = 0; l < taskDateBox.length; l++) {
                                        if (localData[i].files[j].taskList[k].taskDate === taskDateBox[l]) {
                                            var _singleTask3 = this.li.cloneNode(true);
                                            _singleTask3.className = 'taskComplete';
                                            //找到相同时间块
                                            for (var m = 0; m < tools.$('.taskDate').length; m++) {
                                                if (tools.$('.taskDate')[m].innerText === localData[i].files[j].taskList[k].taskDate) {
                                                    tools.nextNode(tools.$('.taskDate')[m]).appendChild(_singleTask3);
                                                    break;
                                                }
                                            }
                                        } else {

                                            //没有相同时间块
                                            str += '<div class="taskDate">' + localData[i].files[j].taskList[k].taskDate + '</div>' + '<ul class="taskList">' + '<li class="taskComplete">' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                            taskBox.innerHTML = str;
                                            //将taskDate存入数组
                                            taskDateBox.push(localData[i].files[j].taskList[k].taskDate);
                                            tools.$('#middleBox').appendChild(taskBox);
                                        }
                                    }
                                }
                                break;
                        }
                    }
                }
            }
        }
    },
    loadContentView: function loadContentView() {
        var localData = JSON.parse(localStorage.getItem('localData')),
            fileChecked = tools.$('#fileChecked'),
            folderName = null,
            taskName = tools.$('#taskChecked').innerText,
            readTask = tools.$('#readTask'),
            writeTask = tools.$('#writeTask');

        if (fileChecked.nodeName === 'H3') {
            folderName = fileChecked.innerText.replace(/X/, '');
        } else if (fileChecked.nodeName === 'LI') {
            folderName = tools.prevNode(fileChecked.parentNode).innerText.replace(/X/, '');
        }
        for (var i = 0; i < localData.length; i++) {
            if (localData[i].folderName === folderName) {
                for (var j = 0; j < localData[i].files.length; j++) {
                    for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                        if (localData[i].files[j].taskList[k].taskName === taskName) {
                            writeTask.children[0].value = readTask.children[0].innerText = localData[i].files[j].taskList[k].taskName;
                            writeTask.children[1].value = readTask.children[1].innerText = localData[i].files[j].taskList[k].taskDate;
                            writeTask.children[2].innerHTML = readTask.children[2].innerText = localData[i].files[j].taskList[k].taskContent;
                            break;
                        }
                    }
                }
            }
        }
    }
};

//JSON 数据修改
var setData = {

    //添加文件夹数据
    addFolderData: function addFolderData(folderName) {
        var localData = JSON.parse(localStorage.getItem('localData'));
        var dataTree = {
            folderName: folderName,
            files: []
        };
        localData.push(dataTree);
        localStorage.setItem('localData', JSON.stringify(localData));
    },

    //添加文件数据
    addFileData: function addFileData(fileName, folderName) {
        var localData = JSON.parse(localStorage.getItem('localData'));
        var dataTree = {
            fileName: fileName,
            taskList: []
        };
        for (var i = 0; i < localData.length; i++) {
            if (localData[i].folderName === folderName) {
                localData[i].files.push(dataTree);
                localStorage.setItem('localData', JSON.stringify(localData));
                break;
            }
        }
    },

    //添加任务数据
    addTaskData: function addTaskData(taskData, fileName, folderName) {
        var localData = JSON.parse(localStorage.getItem('localData'));
        var dataTree = {
            taskName: taskData.taskName,
            taskDate: taskData.taskDate,
            taskContent: taskData.taskContent,
            complete: taskData.complete
        };
        for (var i = 0; i < localData.length; i++) {
            if (localData[i].folderName === folderName) {
                for (var j = 0; j < localData[i].files.length; j++) {
                    if (localData[i].files[j].fileName === fileName) {
                        localData[i].files[j].taskList.push(dataTree);
                        localStorage.setItem('localData', JSON.stringify(localData));
                        break;
                    }
                }
            }
        }
    },

    //修改任务完成情况
    setTaskComplete: function setTaskComplete(completeBool, taskName, fileName, folderName) {
        var localData = JSON.parse(localStorage.getItem('localData'));
        for (var i = 0; i < localData.length; i++) {
            if (localData[i].folderName === folderName) {
                for (var j = 0; j < localData[i].files.length; j++) {
                    if (localData[i].files[j].fileName === fileName) {
                        for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                            if (localData[i].files[j].taskList[k].taskName === taskName) {
                                localData[i].files[j].taskList[k].complete = completeBool;
                                localStorage.setItem('localData', JSON.stringify(localData));
                                break;
                            }
                        }
                    }
                }
            }
        }
    },

    //删除文件夹及其子文件数据
    removeFolderData: function removeFolderData(folderName) {
        var localData = JSON.parse(localStorage.getItem('localData'));
        for (var i = 0; i < localData.length; i++) {
            if (localData[i].folderName === folderName) {
                localData.splice(i, 1);
                localStorage.setItem('localData', JSON.stringify(localData));
                break;
            }
        }
    },

    //删除子文件数据
    removeFileData: function removeFileData(fileName, folderName) {
        var localData = JSON.parse(localStorage.getItem('localData'));
        for (var i = 0; i < localData.length; i++) {
            if (localData[i].folderName === folderName) {
                for (var j = 0; j < localData[i].files.length; j++) {
                    if (localData[i].files[j].fileName === fileName) {
                        localData[i].files.splice(j, 1);
                        localStorage.setItem('localData', JSON.stringify(localData));
                        break;
                    }
                }
            }
        }
    },

    //删除任务数据
    removeTaskData: function removeTaskData(taskName, fileName, folderName) {
        var localData = JSON.parse(localStorage.getItem('localData'));
        for (var i = 0; i < localData.length; i++) {
            if (localData[i].folderName === folderName) {
                for (var j = 0; j < localData[i].files.length; j++) {
                    if (localData[i].files[j].fileName === fileName) {
                        for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                            if (localData[i].files[j].taskList[k].taskName === taskName) {
                                localData[i].files[j].taskList.splice(k, 1);
                                localStorage.setItem('localData', JSON.stringify(localData));
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
};

exports.tools = tools;
exports.setData = setData;
exports.setView = setView;

},{}]},{},[1])


//# sourceMappingURL=bundle.js.map
