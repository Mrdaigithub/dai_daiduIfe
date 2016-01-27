(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _util = require('./util.js');

var $ = _util.tools.$;
var editMode = false;

//页面加载处理
(function () {

    //检测localStorage是否存在,不存在就添加初始数据
    if (localStorage.getItem('localData') === null || JSON.parse(localStorage.getItem('localData')).length === 0) {
        localStorage.setItem('localData', '[{"folderName":"默认分类","checked":false,"files":[{"folderName":"默认分类","fileName":"README","checked":true,"taskList":[{"folderName":"默认分类","fileName":"README","taskName":"README","taskDate":"2016-01-15","taskContent":"xxxxxxxxxxxxxxxxx","complete":true,"checked":true}]}]}]');
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
//$("#left").addEventListener('dblclick', function (event) {
//    let e = window.event || event;
//    console.log(e.target);
//    if (e.target.nodeName === 'H3'){
//        if (tools.nextNode(e.target).style.display !== 'block'){
//            tools.nextNode(e.target).style.display = 'block';
//        }else{
//            tools.nextNode(e.target).style.display = 'none';
//        }
//    }
//},false);

$('#left').addEventListener('click', function (event) {
    var e = window.event || event;

    //删除分类列表

    //删除文件
    if (e.target.className === 'rmFileBtn' && e.target.parentNode.nodeName === 'LI' && confirm('Are you sure?')) {
        //删除子文件数据
        _util.setData.removeFileData(e.target.parentNode.innerText.replace(/X/, ''), _util.tools.prevNode(e.target.parentNode.parentNode).innerText.replace(/X/, ''));
    } else if (e.target.className === 'rmFileBtn' && e.target.parentNode.nodeName === 'H3' && confirm('Are you sure?')) {

        //删除文件夹
        //删除文件夹及其子文件数据
        _util.setData.removeFolderData(e.target.parentNode.innerText.replace(/X/, ''));
    } else if (e.target.className === 'addFilesBtn') {
        //添加分类
        $('#createMask').style.display = 'block';
    } else if (e.target.nodeName === 'H3') {
        //添加标记在folder
        _util.setData.checkedFiles(e.target, $('#fileChecked'));
        _util.setView.loadFileView();
        _util.setView.loadTaskView();
        _util.setData.addTaskChecked(middleBox.getElementsByTagName('li')[0], $('#fileChecked'));
    } else if (e.target.nodeName === 'LI') {
        //添加标记在file
        _util.setData.checkedFiles(e.target, $('#fileChecked'));
        _util.setView.loadFileView();
        _util.setView.loadTaskView();
        _util.setData.addTaskChecked(document.getElementById('middleBox').getElementsByTagName('li')[0], $('#fileChecked'));
    }
    //重绘
    _util.setView.loadFileView();
    _util.setView.loadTaskView();
    _util.setView.loadContentView();
}, false);

//创建文件或文件夹
$('#createMask').addEventListener('click', function (event) {
    var e = window.event || event;

    //关闭创建窗口
    if (e.target === $('#cancelBtn')) {
        $('#createMask').style.display = 'none';
    }
    //创建
    if (e.target === $('#createBtn')) {
        var inputFileNameVal = $('#inputFileName').value;
        //创建文件夹
        if ($('#folder').checked) {
            //修改本地存储数据
            _util.setData.addFolderData(inputFileNameVal);
        } else {
            //创建文件
            var checked = $('#fileChecked');
            if (checked.nodeName === 'LI') {
                _util.setData.addFileData(inputFileNameVal, _util.tools.prevNode(checked.parentNode).innerText.replace(/X/, ''));
            } else if (checked.nodeName === 'H3') {
                _util.setData.addFileData(inputFileNameVal, checked.innerText.replace(/X/, ''));
            }
        }

        //重绘
        _util.setView.loadFileView();
        $('#createMask').style.display = 'none';
    }
}, false);

$('#middle').addEventListener('click', function (event) {
    var e = window.event || event,
        label = $('#label'),
        readTask = $('#readTask'),
        writeTask = $('#writeTask'),
        middleBox = document.getElementById('middleBox');
    //点击middle的完成分类按钮
    if (e.target.nodeName === 'A') {
        for (var i = 0; i < label.children.length; i++) {
            if (label.children[i].id === 'labelChecked') {
                label.children[i].id = '';
                break;
            }
        }
        e.target.id = 'labelChecked';
        _util.setView.loadTaskView();
        _util.setData.addTaskChecked(middleBox.getElementsByTagName('li')[0], $('#fileChecked'));
    } else if (e.target.nodeName === 'LI') {
        _util.setData.addTaskChecked(e.target, $('#fileChecked'));
    }
    if (e.target === $('.addFilesBtn')[1]) {
        //添加新任务
        readTask.style.display = 'none';
        writeTask.style.display = 'block';
        writeTask.children[0].value = writeTask.children[1].value = writeTask.children[2].value = null;
        editMode = false;
    }

    _util.setView.loadTaskView();
    _util.setView.loadContentView();
}, false);

$('#right').addEventListener('click', function (event) {
    var e = window.event || event;

    //按下任务完成按钮
    if (e.target === $('.completeBtn')[0]) {
        //在新建模式
        if (!editMode) {
            var newTaskData = [writeTask.children[0].value, writeTask.children[1].value, writeTask.children[2].value];
            _util.setData.addTaskData(newTaskData, $('#fileChecked').innerText.replace(/X/, ''), _util.tools.prevNode($('#fileChecked').parentNode).innerText.replace(/X/, ''));
        } else {
            //在编辑模式
            //let taskName =
        }
        $('#readTask').style.display = 'block';
        $('#writeTask').style.display = 'none';
        editMode = false;
    }

    if (e.target === $('#completeBtn')) {
        _util.setData.setTaskComplete(true, $('#taskChecked').innerHTML, $('#fileChecked'));
    }

    if (e.target === $('#editBtn')) {
        $('#readTask').style.display = 'none';
        $('#writeTask').style.display = 'block';
        editMode = true;
    }

    _util.setView.loadTaskView();
    //setView.loadContentView();
}, false);

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
        var clearBox = tools.$(name),
            clearList = clearBox.children;
        for (var i = clearList.length; i > 0; i--) {
            clearBox.removeChild(clearList[0]);
        }
    },

    //判断是否有一样的taskDate
    sameTaskDate: function sameTaskDate(compareDate) {
        var localData = JSON.parse(localStorage.getItem('localData')),
            taskBox = tools.$('.taskBox');
        for (var i = 0; i < taskBox.length; i++) {
            if (taskBox[i].getElementsByClassName('taskDate')[0].innerHTML === compareDate) {
                return true;
            }
        }
        return false;
    },

    //页面载入时加载left文件and文件夹
    loadFileView: function loadFileView() {
        var localData = JSON.parse(localStorage.getItem('localData'));
        this.clearDirty('#leftBox');
        for (var i = 0; i < localData.length; i++) {
            var filesBox = this.div.cloneNode(true);
            filesBox.className = 'filesBox';
            var str = '';
            if (localData[i].checked) {
                str += '<h3 id="fileChecked">';
            } else {
                str += '<h3>';
            }
            str += localData[i].folderName + '<span class="rmFileBtn">X</span>' + '</h3>' + '<ul style="display: block;">';
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
        this.clearDirty('#middleBox');
        if (fileChecked.nodeName === 'H3') {
            for (var i = 0; i < localData.length; i++) {
                var taskDateBox = [undefined];
                if (localData[i].folderName === fileChecked.innerText.replace(/X/, '')) {
                    for (var j = 0; j < localData[i].files.length; j++) {
                        switch (tools.$('#labelChecked')) {

                            //不定义是否完成,全部显示
                            case tools.$('#label').children[0]:
                                for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                    var str = '',
                                        taskBox = this.div.cloneNode(true);
                                    taskBox.className = 'taskBox';

                                    //判断是否已经创建相同的时间块
                                    if (this.sameTaskDate(localData[i].files[j].taskList[k].taskDate)) {
                                        //找到相同时间块
                                        var _singleTask = this.li.cloneNode(true);
                                        if (localData[i].files[j].taskList[k].complete) {
                                            _singleTask.className = 'taskComplete';
                                        }
                                        if (localData[i].files[j].taskList[k].checked) {
                                            _singleTask.id = 'taskChecked';
                                        }
                                        _singleTask.innerHTML = localData[i].files[j].taskList[k].taskName;
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
                                            //不添加完成标志
                                            //添加选中任务标志
                                            if (localData[i].files[j].taskList[k].checked) {
                                                str += '<li id="taskChecked">' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                            } else {
                                                //没有选中任务
                                                str += '<li>' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                            }
                                        }
                                        taskBox.innerHTML = str;
                                        //将taskDate存入数组
                                        taskDateBox.push(localData[i].files[j].taskList[k].taskDate);
                                        tools.$('#middleBox').appendChild(taskBox);
                                    }
                                }
                                break;

                            //只显示未完成任务
                            case tools.$('#label').children[1]:
                                for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                    var str = '',
                                        taskBox = this.div.cloneNode(true);
                                    taskBox.className = 'taskBox';
                                    if (!localData[i].files[j].taskList[k].complete) {
                                        //判断是否已经创建相同的时间块
                                        var _singleTask2 = this.li.cloneNode(true);
                                        if (this.sameTaskDate(localData[i].files[j].taskList[k].taskDate)) {
                                            //找到相同时间块
                                            if (localData[i].files[j].taskList[k].taskComplete) {
                                                _singleTask2.className = 'taskComplete';
                                            }
                                            if (localData[i].files[j].taskList[k].checked) {
                                                _singleTask2.id = 'taskChecked';
                                            }
                                            _singleTask2.innerHTML = localData[i].files[j].taskList[k].taskName;
                                            //找到相同时间块
                                            for (var m = 0; m < tools.$('.taskDate').length; m++) {
                                                if (tools.$('.taskDate')[m].innerText === localData[i].files[j].taskList[k].taskDate) {
                                                    tools.nextNode(tools.$('.taskDate')[m]).appendChild(_singleTask2);
                                                    break;
                                                }
                                            }
                                        } else {
                                            //没有相同时间块
                                            str += '<div class="taskDate">' + localData[i].files[j].taskList[k].taskDate + '</div>' + '<ul class="taskList">';
                                            //添加完成标志
                                            if (localData[i].files[j].taskList[k].checked) {
                                                str += '<li id="taskChecked">' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                            } else {
                                                str += '<li>' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                            }
                                            taskBox.innerHTML = str;
                                            //将taskDate存入数组
                                            taskDateBox.push(localData[i].files[j].taskList[k].taskDate);
                                            tools.$('#middleBox').appendChild(taskBox);
                                        }
                                    }
                                }
                                break;

                            //只显示已经完成任务
                            case tools.$('#label').children[2]:
                                for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                    var str = '',
                                        taskBox = this.div.cloneNode(true);
                                    taskBox.className = 'taskBox';
                                    if (localData[i].files[j].taskList[k].complete) {
                                        //判断是否已经创建相同的时间块
                                        if (this.sameTaskDate(localData[i].files[j].taskList[k].taskDate)) {
                                            //找到相同时间块
                                            var _singleTask3 = this.li.cloneNode(true);
                                            if (localData[i].files[j].taskList[k].complete) {
                                                _singleTask3.className = 'taskComplete';
                                            }
                                            if (localData[i].files[j].taskList[k].checked) {
                                                _singleTask3.id = 'taskChecked';
                                            }
                                            _singleTask3.innerHTML = localData[i].files[j].taskList[k].taskName;
                                            //找到相同时间块
                                            for (var m = 0; m < tools.$('.taskDate').length; m++) {
                                                if (tools.$('.taskDate')[m].innerText === localData[i].files[j].taskList[k].taskDate) {
                                                    tools.nextNode(tools.$('.taskDate')[m]).appendChild(_singleTask3);
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

                            //不定义是否完成,全部显示
                            case tools.$('#label').children[0]:
                                for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                    var str = '',
                                        taskBox = this.div.cloneNode(true);
                                    taskBox.className = 'taskBox';

                                    //判断是否已经创建相同的时间块
                                    if (this.sameTaskDate(localData[i].files[j].taskList[k].taskDate)) {
                                        //找到相同时间块
                                        var _singleTask4 = this.li.cloneNode(true);
                                        if (localData[i].files[j].taskList[k].complete) {
                                            _singleTask4.className = 'taskComplete';
                                        }
                                        if (localData[i].files[j].taskList[k].checked) {
                                            _singleTask4.id = 'taskChecked';
                                        }
                                        _singleTask4.innerHTML = localData[i].files[j].taskList[k].taskName;
                                        //找到相同时间块
                                        for (var m = 0; m < tools.$('.taskDate').length; m++) {
                                            if (tools.$('.taskDate')[m].innerText === localData[i].files[j].taskList[k].taskDate) {
                                                tools.nextNode(tools.$('.taskDate')[m]).appendChild(_singleTask4);
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
                                            //不添加完成标志
                                            //添加选中任务标志
                                            if (localData[i].files[j].taskList[k].checked) {
                                                str += '<li id="taskChecked">' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                            } else {
                                                //没有选中任务
                                                str += '<li>' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                            }
                                        }
                                        taskBox.innerHTML = str;
                                        //将taskDate存入数组
                                        taskDateBox.push(localData[i].files[j].taskList[k].taskDate);
                                        tools.$('#middleBox').appendChild(taskBox);
                                    }
                                }
                                break;

                            //只显示未完成任务
                            case tools.$('#label').children[1]:
                                for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                    var str = '',
                                        taskBox = this.div.cloneNode(true);
                                    taskBox.className = 'taskBox';
                                    if (!localData[i].files[j].taskList[k].complete) {
                                        //判断是否已经创建相同的时间块
                                        var _singleTask5 = this.li.cloneNode(true);
                                        if (this.sameTaskDate(localData[i].files[j].taskList[k].taskDate)) {
                                            //找到相同时间块
                                            if (localData[i].files[j].taskList[k].taskComplete) {
                                                _singleTask5.className = 'taskComplete';
                                            }
                                            if (localData[i].files[j].taskList[k].checked) {
                                                _singleTask5.id = 'taskChecked';
                                            }
                                            _singleTask5.innerHTML = localData[i].files[j].taskList[k].taskName;
                                            //找到相同时间块
                                            for (var m = 0; m < tools.$('.taskDate').length; m++) {
                                                if (tools.$('.taskDate')[m].innerText === localData[i].files[j].taskList[k].taskDate) {
                                                    tools.nextNode(tools.$('.taskDate')[m]).appendChild(_singleTask5);
                                                    break;
                                                }
                                            }
                                        } else {
                                            //没有相同时间块
                                            str += '<div class="taskDate">' + localData[i].files[j].taskList[k].taskDate + '</div>' + '<ul class="taskList">';
                                            if (localData[i].files[j].taskList[k].checked) {
                                                str += '<li id="taskChecked">' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                            } else {
                                                str += '<li>' + localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                            }
                                            taskBox.innerHTML = str;
                                            //将taskDate存入数组
                                            taskDateBox.push(localData[i].files[j].taskList[k].taskDate);
                                            tools.$('#middleBox').appendChild(taskBox);
                                        }
                                    }
                                }
                                break;

                            //只显示已完成任务
                            case tools.$('#label').children[2]:
                                for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                    var str = '',
                                        taskBox = this.div.cloneNode(true);
                                    taskBox.className = 'taskBox';
                                    if (localData[i].files[j].taskList[k].complete) {
                                        //判断是否已经创建相同的时间块
                                        if (this.sameTaskDate(localData[i].files[j].taskList[k].taskDate)) {
                                            //找到相同时间块
                                            var _singleTask6 = this.li.cloneNode(true);
                                            if (localData[i].files[j].taskList[k].complete) {
                                                _singleTask6.className = 'taskComplete';
                                            }
                                            if (localData[i].files[j].taskList[k].checked) {
                                                _singleTask6.id = 'taskChecked';
                                            }
                                            _singleTask6.innerHTML = localData[i].files[j].taskList[k].taskName;
                                            //找到相同时间块
                                            for (var m = 0; m < tools.$('.taskDate').length; m++) {
                                                if (tools.$('.taskDate')[m].innerText === localData[i].files[j].taskList[k].taskDate) {
                                                    tools.nextNode(tools.$('.taskDate')[m]).appendChild(_singleTask6);
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

                        }
                    }
                }
            }
        }
    },
    loadContentView: function loadContentView() {
        //if(!taskName){
        //    return 0;
        //}
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
            checked: false,
            files: []
        };
        localData.push(dataTree);
        localStorage.setItem('localData', JSON.stringify(localData));
    },

    //添加文件数据
    addFileData: function addFileData(fileName, folderName) {
        var localData = JSON.parse(localStorage.getItem('localData'));
        var dataTree = {
            folderName: folderName,
            fileName: fileName,
            checked: false,
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
            folderName: folderName,
            fileName: fileName,
            taskName: taskData[0],
            taskDate: taskData[1],
            taskContent: taskData[2],
            complete: false,
            checked: false
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
    setTaskComplete: function setTaskComplete(completeBool, taskName, checkedFileNode) {
        var localData = JSON.parse(localStorage.getItem('localData'));
        if (checkedFileNode.nodeName === 'H3') {
            var folderName = checkedFileNode.innerText.replace(/X/, '');
            for (var i = 0; i < localData.length; i++) {
                if (localData[i].folderName === folderName) {
                    for (var j = 0; j < localData[i].files.length; j++) {
                        for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                            console.log(taskName);
                            if (localData[i].files[j].taskList[k].taskName === taskName && localData[i].files[j].taskList[k].fileName === localData[i].files[j].fileName) {
                                localData[i].files[j].taskList[k].complete = completeBool;
                                break;
                            }
                        }
                    }
                }
            }
        } else if (checkedFileNode.nodeName === 'LI') {
            var folderName = tools.prevNode(checkedFileNode.parentNode).innerText.replace(/X/, '');
            var fileName = checkedFileNode.innerText.replace(/X/, '');
            for (var i = 0; i < localData.length; i++) {
                if (localData[i].folderName === folderName) {
                    for (var j = 0; j < localData[i].files.length; j++) {
                        if (localData[i].files[j].fileName === fileName) {
                            for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                if (localData[i].files[j].taskList[k].taskName === taskName) {
                                    localData[i].files[j].taskList[k].complete = completeBool;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        localStorage.setItem('localData', JSON.stringify(localData));
    },

    //删除文件夹及其子文件数据
    removeFolderData: function removeFolderData(folderName) {
        var localData = JSON.parse(localStorage.getItem('localData')),
            checkedFileName = tools.$('#fileChecked').innerText.replace(/X/, '');
        for (var i = 0; i < localData.length; i++) {
            if (localData[i].folderName === folderName) {
                //如果删除的是标记文件夹就把标记转移到第一文件夹上
                if (folderName === checkedFileName) {
                    this.checkedFiles(tools.$('.filesBox')[0].children[0], tools.$('#fileChecked'));
                    //更新数据
                    localData = JSON.parse(localStorage.getItem('localData'));
                }
                localData.splice(i, 1);
                localStorage.setItem('localData', JSON.stringify(localData));
                break;
            }
        }
    },

    //删除子文件数据
    removeFileData: function removeFileData(fileName, folderName) {
        var localData = JSON.parse(localStorage.getItem('localData')),
            checkedFileName = tools.$('#fileChecked').innerText.replace(/X/, '');
        for (var i = 0; i < localData.length; i++) {
            if (localData[i].folderName === folderName) {
                for (var j = 0; j < localData[i].files.length; j++) {
                    if (localData[i].files[j].fileName === fileName) {
                        //如果删除的是标记文件就把标记转移到当前文件的付文件夹上
                        if (fileName === checkedFileName) {
                            this.checkedFiles(tools.prevNode(tools.$('#fileChecked').parentNode), tools.$('#fileChecked'));
                            //更新数据
                            localData = JSON.parse(localStorage.getItem('localData'));
                        }
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
    },

    //添加left标记
    checkedFiles: function checkedFiles(newCheckedNode, oldCheckedNode) {
        var localData = JSON.parse(localStorage.getItem('localData')),
            oldCheckedName = oldCheckedNode.innerText.replace(/X/, ''),
            newCheckedName = newCheckedNode.innerText.replace(/X/, '');
        //清除原先标记
        if (oldCheckedNode.nodeName === 'H3') {
            for (var i = 0; i < localData.length; i++) {
                if (localData[i].folderName === oldCheckedName) {
                    localData[i].checked = false;
                    break;
                }
            }
        } else if (oldCheckedNode.nodeName === 'LI') {
            for (var i = 0; i < localData.length; i++) {
                for (var j = 0; j < localData[i].files.length; j++) {
                    if (localData[i].files[j].fileName === oldCheckedName) {
                        localData[i].files[j].checked = false;
                        break;
                    }
                }
            }
        }
        //添加标记
        if (newCheckedNode.nodeName === 'H3') {
            for (var i = 0; i < localData.length; i++) {
                if (localData[i].folderName === newCheckedName) {
                    localData[i].checked = true;
                    break;
                }
            }
        } else if (newCheckedNode.nodeName === 'LI') {
            for (var i = 0; i < localData.length; i++) {
                for (var j = 0; j < localData[i].files.length; j++) {
                    if (localData[i].files[j].fileName === newCheckedName) {
                        localData[i].files[j].checked = true;
                        break;
                    }
                }
            }
        }
        localStorage.setItem('localData', JSON.stringify(localData));
    },

    //添加任务选中标记
    addTaskChecked: function addTaskChecked(newCheckedNode, fileNode) {
        var localData = JSON.parse(localStorage.getItem('localData'));
        if (newCheckedNode) {
            for (var i = 0; i < localData.length; i++) {
                for (var j = 0; j < localData[i].files.length; j++) {
                    for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                        if (localData[i].files[j].taskList[k].checked) {
                            localData[i].files[j].taskList[k].checked = false;
                            break;
                        }
                    }
                }
            }

            if (fileNode.nodeName === 'H3') {
                var folderName = fileNode.innerText.replace(/X/, '');
                for (var i = 0; i < localData.length; i++) {
                    if (localData[i].folderName === folderName) {
                        for (var j = 0; j < localData[i].files.length; j++) {
                            for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                if (localData[i].files[j].taskList[k].taskName === newCheckedNode.innerText && localData[i].files[j].taskList[k].fileName === localData[i].files[j].fileName) {
                                    localData[i].files[j].taskList[k].checked = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            } else if (fileNode.nodeName === 'LI') {
                var folderName = tools.prevNode(fileNode.parentNode).innerText.replace(/X/, '');
                var fileName = fileNode.innerText.replace(/X/, '');
                for (var i = 0; i < localData.length; i++) {
                    if (localData[i].folderName === folderName) {
                        for (var j = 0; j < localData[i].files.length; j++) {
                            if (localData[i].files[j].fileName === fileName) {
                                for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                    if (localData[i].files[j].taskList[k].taskName === newCheckedNode.innerText) {
                                        localData[i].files[j].taskList[k].checked = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            localStorage.setItem('localData', JSON.stringify(localData));
        } else {
            console.log('没有符合条件的task');
        }
    },

    //重置任务选中标记至第一位
    resetTaskChecked: function resetTaskChecked(fileNode) {
        if (fileNode.nodeName === 'H3') {
            var folderName = fileNode.innerText.replace(/X/, '');
            for (var i = 0; i < localData.length; i++) {
                if (localData[i].folderName === folderName) {
                    for (var j = 0; j < localData[i].files.length; j++) {
                        for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                            if (localData[i].files[j].taskList[k].taskName === newCheckedNode.innerText && localData[i].files[j].taskList[k].fileName === localData[i].files[j].fileName) {
                                localData[i].files[j].taskList[k].checked = true;
                                break;
                            }
                        }
                    }
                }
            }
        } else if (fileNode.nodeName === 'LI') {
            var folderName = tools.prevNode(fileNode.parentNode).innerText.replace(/X/, '');
            var fileName = fileNode.innerText.replace(/X/, '');
            for (var i = 0; i < localData.length; i++) {
                if (localData[i].folderName === folderName) {
                    for (var j = 0; j < localData[i].files.length; j++) {
                        if (localData[i].files[j].fileName === fileName) {
                            for (var k = 0; k < localData[i].files[j].taskList.length; k++) {
                                if (localData[i].files[j].taskList[k].taskName === newCheckedNode.innerText) {
                                    localData[i].files[j].taskList[k].checked = true;
                                    break;
                                }
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
