"use strict";
import {tools,setData,setView} from './util.js';
const $ = tools.$;

//页面加载处理
(function () {

    //检测localStorage是否存在,不存在就添加初始数据
    if (localStorage.getItem('localData') === null || JSON.parse(localStorage.getItem('localData')).length === 0){
        localStorage.setItem('localData','[{"folderName":"默认分类","checked":false,"files":[{"fileName":"README","checked":true,"taskList":[{"taskName":"README","taskDate":"2016-01-15","taskContent":"xxxxxxxxxxxxxxxxx","complete":true,"checked":true}]}]}]')
    }

    //控制高度和宽度
    let addFilesBtnWidth = window.getComputedStyle($('#middle')).width,
        addFilesBtnHeight = window.getComputedStyle($('.addFilesBtn')[0]).height,
        headerHeight = window.getComputedStyle($('header')[0]).height,
        winHeight = document.documentElement.clientHeight ||
            document.body.clientHeight;
    $('.addFilesBtn')[1].style.width = addFilesBtnWidth;
    $('#main').style.height = (winHeight - parseInt(headerHeight) - parseInt(addFilesBtnHeight)) + 'px';
    window.addEventListener('resize', function () {
        $('.addFilesBtn')[1].style.width = window.getComputedStyle($('#middle')).width;
        $('#main').style.height = (winHeight - parseInt(headerHeight) - parseInt(addFilesBtnHeight)) + 'px';
    },false);

    //初始化加载view
    setView.loadFileView();
    setView.loadTaskView();
    setView.loadContentView();
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
    console.log('ok');
    let e = window.event || event;

    //删除分类列表

    //删除文件
    if ((e.target.className === 'rmFileBtn') &&
        (e.target.parentNode.nodeName === 'LI') &&
        (confirm('Are you sure?'))){
        //删除子文件数据
        setData.removeFileData(e.target.parentNode.innerText.replace(/X/,''),
            tools.prevNode(e.target.parentNode.parentNode).innerText.replace(/X/,''));
    } else if ((e.target.className === 'rmFileBtn') &&
        (e.target.parentNode.nodeName === 'H3') &&
        (confirm('Are you sure?'))){

        //删除文件夹
        //删除文件夹及其子文件数据
        setData.removeFolderData(e.target.parentNode.innerText.replace(/X/,''));
    } else if(e.target.className === 'addFilesBtn'){
        //添加分类
        $('#createMask').style.display ='block';
    } else if(e.target.nodeName === 'H3'){
        //添加标记在folder
        setData.checkedFiles(e.target, $('#fileChecked'));
    } else if(e.target.nodeName === 'LI'){
        //添加标记在file
        setData.checkedFiles(e.target, $('#fileChecked'));
    }
    //重绘
    setView.loadFileView();
},false);


//创建文件或文件夹
$('#createMask').addEventListener('click', function (event) {
    let e = window.event || event;

    //关闭创建窗口
    if(e.target === $('#cancelBtn')){
        $('#createMask').style.display ='none';
    }
    //创建
    if(e.target === $('#createBtn')){
        let inputFileNameVal = $('#inputFileName').value;
        //创建文件夹
        if($('#folder').checked){
            //修改本地存储数据
            setData.addFolderData(inputFileNameVal);
        } else{
            //创建文件
            let checked = $('#fileChecked');
            if(checked.nodeName === 'LI'){
                setData.addFileData(inputFileNameVal,
                    tools.prevNode(checked.parentNode).innerText.replace(/X/,''));
            }else if(checked.nodeName === 'H3'){
                setData.addFileData(inputFileNameVal,
                    checked.innerText.replace(/X/,''));
            }
        }

        //重绘
        setView.loadFileView();
        $('#createMask').style.display ='none';
    }
},false);


$('#middle').addEventListener('click', function (event) {
    let e = window.event || event,
        label = $('#label'),
        readTask = $('#readTask'),
        writeTask = $('#writeTask');
    //点击middle的完成分类按钮
    if (e.target.nodeName === 'A'){
        for(let i=0; i<label.children.length; i++){
            if(label.children[i].id === 'labelChecked'){
                label.children[i].id = '';
                break;
            }
        }
        e.target.id = 'labelChecked';
    }else if (e.target.nodeName === 'LI'){
        checked.id = '';
        e.target.id = 'taskChecked';
        checked = e.target;
    }
    if(e.target === $('.addFilesBtn')[1]){
        //添加新任务
        readTask.style.display = 'none';
        writeTask.style.display = 'block';
        writeTask.children[0].value = writeTask.children[1].value = writeTask.children[2].value = null;
    }
},false);


$('#right').addEventListener('click', function (event) {
    let e = window.event || event;
    //按下任务完成按钮
    if(e.target === $('.completeBtn')[0]){
        let newTaskData = [writeTask.children[0].value,writeTask.children[1].value,writeTask.children[2].value];
        setData.addTaskData(newTaskData, $('#fileChecked').innerText.replace(/X/,''),
            tools.prevNode($('#fileChecked').parentNode).innerText.replace(/X/,''));
        setView.loadTaskView();
    }
},false);