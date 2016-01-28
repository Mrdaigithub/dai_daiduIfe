"use strict";
import {tools,setData,setView} from './util.js';
const $ = tools.$;
let editMode = false;

//页面加载处理
(function () {

    //检测localStorage是否存在,不存在就添加初始数据
    if (localStorage.getItem('localData') === null || JSON.parse(localStorage.getItem('localData')).length === 0){
        localStorage.setItem('localData','[{"folderName":"默认分类","checked":false,"files":[{"folderName":"默认分类","fileName":"README","checked":true,"taskList":[{"folderName":"默认分类","fileName":"README","taskName":"README","taskDate":"2016-01-15","taskContent":"xxxxxxxxxxxxxxxxx","complete":true,"checked":true}]}]}]')
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
    setView.loadContentView()
})();


$('#left').addEventListener('click', function (event) {
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
        setView.loadFileView();
        setView.loadTaskView();
        setData.addTaskChecked(middleBox.getElementsByTagName('li')[0],$('#fileChecked'));
    } else if(e.target.nodeName === 'LI'){
        //添加标记在file
        setData.checkedFiles(e.target, $('#fileChecked'));
        setView.loadFileView();
        setView.loadTaskView();
        setData.addTaskChecked(document.getElementById('middleBox').getElementsByTagName('li')[0],
            $('#fileChecked'));
    }
    //重绘
    setView.loadFileView();
    setView.loadTaskView();
    setView.loadContentView()
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
            if(!setView.repeatFolderName(inputFileNameVal)){
                setData.addFolderData(inputFileNameVal);
            }else{
                alert('重名..');
            }
        } else{
            //创建文件
            let checked = $('#fileChecked');
            if(checked.nodeName === 'LI'){
                if(!setView.repeatFileName(inputFileNameVal, tools.prevNode(checked.parentNode).innerText.replace(/X/,''))){
                    setData.addFileData(inputFileNameVal, tools.prevNode(checked.parentNode).innerText.replace(/X/,''));
                }else{
                    alert('重名..');
                }
            }else if(checked.nodeName === 'H3'){
                console.log('ok');
                if(!setView.repeatFileName(inputFileNameVal, checked.innerText.replace(/X/,''))){
                    setData.addFileData(inputFileNameVal, checked.innerText.replace(/X/,''));
                }else{
                    alert('重名..');
                }
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
        writeTask = $('#writeTask'),
        middleBox = document.getElementById('middleBox');
    //点击middle的完成分类按钮
    if (e.target.nodeName === 'A'){
        for(let i=0; i<label.children.length; i++){
            if(label.children[i].id === 'labelChecked'){
                label.children[i].id = '';
                break;
            }
        }
        e.target.id = 'labelChecked';
        setView.loadTaskView();
        setData.addTaskChecked(middleBox.getElementsByTagName('li')[0],$('#fileChecked'));
        setView.loadTaskView();
        setView.loadContentView();
    }else if (e.target.nodeName === 'LI'){
        setData.addTaskChecked(e.target,$('#fileChecked'));
        setView.loadTaskView();
        setView.loadContentView();
    }
    if(e.target === $('.addFilesBtn')[1]){
        //添加新任务
        readTask.style.display = 'none';
        writeTask.style.display = 'block';
        writeTask.children[0].value = writeTask.children[1].value = writeTask.children[2].value = null;
        editMode = false;
    }
},false);


$('#right').addEventListener('click', function (event) {
    let e = window.event || event,
        readTask = $('#readTask'),
        writeTask = $('#writeTask'),
        newTaskData = [writeTask.children[0].value,writeTask.children[1].value,writeTask.children[2].value];

    switch (e.target){

        //按下保存按钮
        case $('#saveBtn'):
            if(newTaskData[0] == false ||
                newTaskData[1] == false ||
                newTaskData[2] == false){
                alert('null');
            }else{
                //在新建模式
                if(!editMode){
                    if(!setView.repeatTaskName(writeTask.children[0].value,$('#fileChecked'))){
                        setData.addTaskData(newTaskData, $('#fileChecked'));
                    }else{
                        alert('重名..');
                    }
                }else{
                    //在编辑模式
                    setData.modTaskData(newTaskData, $('#fileChecked'));
                }
                readTask.style.display = 'block';
                writeTask.style.display = 'none';
                editMode = false;
            }
            setView.loadTaskView();
            setView.loadContentView();
            break;

        //按下放弃修改按钮
        case $('#giveUp'):
            readTask.style.display = 'block';
            writeTask.style.display = 'none';
            editMode = false;
            setView.loadContentView();
            break;

        //按下任务完成按钮
        case $('#completeBtn'):
            setData.setTaskComplete(true,$('#taskChecked').innerHTML,$('#fileChecked'));
            setView.loadTaskView();
            break;

        //按下编辑任务按钮
        case $('#editBtn'):
            $('#readTask').style.display = 'none';
            $('#writeTask').style.display = 'block';
            editMode = true;
            setView.loadContentView();
            break;
    }
},false);