"use strict";

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


//视图修改

let setView = {

    //清除上次的视图，将用来重绘
    clearDirty: function (name) {
        let clearList = document.getElementsByTagName(name);
        if(clearList.length > 0){
            let parent = clearList[0].parentNode;
            for(let i=0; i<clearList.length; i++){
                parent.removeChild(clearList[i]);
            }
        }
    },

    //页面载入时加载left文件and文件夹
    LoadFileView: function(){
        let localData = JSON.parse(localStorage.getItem('localData'));
        for(let i=0; i<localData.length; i++){
            let filesBox = document.createElement('div'),
                str = '';
            filesBox.className = 'filesBox';
            str += '<h3>' + localData[i].folderName +
                '<span class="rmFileBtn">X</span>' +
                '</h3>' + '<ul style="display: block;">';
            for(let j=0; j<localData[i].files.length; j++){
                str += '<li>' + localData[i].files[j].fileName +
                    '<span class="rmFileBtn">X</span></li>';
            }
            str += '</ul>';
            filesBox.innerHTML = str;
            left.appendChild(filesBox);
        }
    }
};


//加载left的文件and文件夹
function loadFile(){
    (function () {
        //清空分类列表
        let filesBox = $('.filesBox');
        if(filesBox.length > 0){
            let Parent = $('#left');
            for(let i=0; i<filesBox.length; i++){
                Parent.removeChild(filesBox[i]);
            }
        }
    })();

    //创建
    let localData = JSON.parse(localStorage.getItem('localData')),
        checkedNode = $('#checked'),
        left = $('#left'),
        li = left.getElementsByTagName('li'),
        flag  = 0;
    if(checkedNode){
        //找到原先的标记
        for(let i=0; i<li.length; i++){
            if(li[i] === checked){
                flag = i;
                break;
            }
        }
    }

    for(let i=0; i<localData.length; i++){
        let filesBox = document.createElement('div'),
            str = '';
        filesBox.className = 'filesBox';
        str += '<h3>' + localData[i].folderName +
            '<span class="rmFileBtn">X</span>' +
            '</h3>' + '<ul style="display: block;">';
        for(let j=0; j<localData[i].files.length; j++){
            str += '<li>' + localData[i].files[j].fileName +
                    '<span class="rmFileBtn">X</span></li>';
        }
        str += '</ul>';
        filesBox.innerHTML = str;
        left.appendChild(filesBox);
    }
    left.getElementsByTagName('li')[flag].id = 'checked';
}

//加载middle的task
function loadTask(){

    let filesFlag = $('#checked');
    let localData = JSON.parse(localStorage.getItem('localData'));

    //清除middle
    (function () {
        let taskBox = $('.taskBox');
        if (taskBox.length > 0){
            let parent = taskBox[0].parentNode;
            for (let i=taskBox.length; i>0; i--){
                parent.removeChild(taskBox[0])
            }
        }
    })();

    if (filesFlag.nodeName === 'H3'){
        for (let i=0; i<localData.length; i++){
            let str = '';
            let taskDate = '';

            //遍历找到选中的folderName
            if (localData[i].folderName === filesFlag.innerText.replace(/X$/,'')){
                for (let j=0; j<localData[i].files.length; j++){
                    for (let k=0; k<localData[i].files[j].taskList.length; k++){

                        //如果任务时间不一样
                        if (taskDate !== localData[i].files[j].taskList[k].taskData){
                            taskDate = localData[i].files[j].taskList[k].taskData;
                            //创建taskBox
                            var taskBox = document.createElement('div');
                            taskBox.className = 'taskBox';
                            $('#middle').appendChild(taskBox);

                            //创建任务时间div and taskList

                            //任务已完成
                            if (localData[i].files[j].taskList[k].complete){
                                str += '<div class="taskDate">' + localData[i].files[j].taskList[k].taskData +
                                    '</div><ul class="taskList">' + '<li class="taskComplete">' + localData[i].files[j].taskList[k].taskName +
                                    '</li>';
                            }else{

                                //任务未完成
                                str += '<div class="taskDate">' + localData[i].files[j].taskList[k].taskData +
                                    '</div><ul class="taskList">' + '<li>' + localData[i].files[j].taskList[k].taskName +
                                    '</li>';
                            }

                            //如果时间不一样，不创建taskBox and taskDate
                        }else{
                            str += '<li>' + localData[i].files[j].taskList[k].taskName + '</li>';
                        }
                    }
                    str += '</ul>';
                    taskBox.innerHTML = str;
                    $('.taskBox')[0].children[1].children[0].id = 'taskChecked';
                }
            }
        }

    }else if (filesFlag.nodeName === 'LI'){
        //遍历找到选中的filesName
        for (let i=0; i<localData.length; i++){

            let str = '',
                taskDate = '';

            for (let j=0; j<localData[i].files.length; j++){

                //找到选中的file
                if (localData[i].files[j].fileName === filesFlag.innerText.replace(/X$/,'')){
                    for (let k=0; k<localData[i].files[j].taskList.length; k++){

                        //如果任务时间不一样
                        if (taskDate !== localData[i].files[j].taskList[k].taskData){
                            taskDate = localData[i].files[j].taskList[k].taskData;

                            //创建taskBox
                            var taskBox = document.createElement('div');
                            taskBox.className = 'taskBox';
                            $('#middle').appendChild(taskBox);

                            //创建任务时间div and taskList

                            //任务已完成
                            if (localData[i].files[j].taskList[k].complete){
                                str += '<div class="taskDate">' + localData[i].files[j].taskList[k].taskData +
                                    '</div><ul class="taskList">' + '<li class="taskComplete">' + localData[i].files[j].taskList[k].taskName +
                                    '</li>';
                            }else{

                                //任务未完成
                                str += '<div class="taskDate">' + localData[i].files[j].taskList[k].taskData +
                                    '</div><ul class="taskList">' + '<li>' + localData[i].files[j].taskList[k].taskName +
                                    '</li>';
                            }

                            //如果时间不一样，不创建taskBox and taskDate
                        }else{
                            str += '<li>' + localData[i].files[j].taskList[k].taskName + '</li>';
                        }
                    }
                    str += '</ul>';
                    taskBox.innerHTML = str;
                    $('.taskBox')[0].children[1].children[0].id = 'taskChecked';
                    return 0;
                }
            }
        }
    }
}

function loadTaskContent(){
    let localData = JSON.parse(localStorage.getItem('localData')),
        taskList = $('#middle').getElementsByTagName('li'),
        files = $('#checked'),
        task = null;

    for (let i=0; i<taskList.length; i++){
        if (taskList[i].style.backgroundColor){
            task = taskList[i].innerHTML;
            break;
        }
    }

    if (files.nodeName === 'LI'){
        for (let i=0; i<localData.length; i++){
            if (localData[i].folderName === prevNode(files.parentNode).innerText.replace(/X$/,'')){
                for (let j=0; j<localData[i].files.length; j++){
                    if (localData[i].files[j].fileName === files.innerText.replace(/X$/,'')){
                        for (let k=0; k<localData[i].files[j].taskList.length; k++){
                            if (localData[i].files[j].taskList[k].taskName === task){
                                let readTask = $('#readTask'),
                                    writeTask = $('#writeTask');
                                writeTask.children[0].value = readTask.children[0].innerText = localData[i].files[j].taskList[k].taskName;
                                writeTask.children[1].value = readTask.children[1].innerText = localData[i].files[j].taskList[k].taskData;
                                writeTask.children[2].innerHTML = readTask.children[2].innerText = localData[i].files[j].taskList[k].taskContent;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}


//JSON 数据修改
let setData = {

    //添加文件夹数据
    addFolderData: function(folderName){
        let localData = JSON.parse(localStorage.getItem('localData'));
        let dataTree = {
            folderName:folderName,
            files:[]
        };
        localData.push(dataTree);
        localStorage.setItem('localData',JSON.stringify(localData));
    },

    //添加文件数据
    addFileData: function (fileName, folderName) {
        let localData = JSON.parse(localStorage.getItem('localData'));
        let dataTree = {
            fileName:fileName,
            taskList:[]
        };
        for(let i=0; i<localData.length; i++){
            if(localData[i].folderName === folderName){
                localData[i].files.push(dataTree);
                localStorage.setItem('localData',JSON.stringify(localData));
                break;
            }
        }
    },

    //添加任务数据
    addTaskData: function (taskData, fileName, folderName) {
        let localData = JSON.parse(localStorage.getItem('localData'));
        let dataTree = {
            taskName: taskData.taskName,
            taskDate: taskData.taskDate,
            taskContent: taskData.taskContent,
            complete: taskData.complete
        };
        for(let i=0; i<localData.length; i++){
            if(localData[i].folderName === folderName){
                for(let j=0; j<localData[i].files.length; j++){
                    if(localData[i].files[j].fileName === fileName){
                        localData[i].files[j].taskList.push(dataTree);
                        localStorage.setItem('localData',JSON.stringify(localData));
                        break;
                    }
                }
            }
        }
    },

    //修改任务完成情况
    setTaskComplete: function (completeBool,taskName,fileName,folderName) {
        let localData = JSON.parse(localStorage.getItem('localData'));
        for(let i=0; i<localData.length; i++){
            if(localData[i].folderName === folderName){
                for(let j=0; j<localData[i].files.length; j++){
                    if(localData[i].files[j].fileName === fileName){
                        for(let k=0; k<localData[i].files[j].taskList.length; k++){
                            if(localData[i].files[j].taskList[k].taskName === taskName){
                                localData[i].files[j].taskList[k].complete = completeBool;
                                localStorage.setItem('localData',JSON.stringify(localData));
                                break;
                            }
                        }
                    }
                }
            }
        }
    },

    //删除文件夹及其子文件数据
    removeFolderData: function(folderName){
        let localData = JSON.parse(localStorage.getItem('localData'));
        for(let i=0; i<localData.length; i++){
            if(localData[i].folderName === folderName){
                localData.splice(i,1);
                localStorage.setItem('localData',JSON.stringify(localData));
                break;
            }
        }
    },

    //删除子文件数据
    removeFileData: function(fileName,folderName){
        let localData = JSON.parse(localStorage.getItem('localData'));
        for(let i=0; i<localData.length; i++){
            if(localData[i].folderName === folderName){
                for(let j=0; j<localData[i].files.length; j++){
                    if(localData[i].files[j].fileName === fileName){
                        localData[i].files.splice(j,1);
                        localStorage.setItem('localData',JSON.stringify(localData));
                        break;
                    }
                }
            }
        }
    },

    //删除任务数据
    removeTaskData: function(taskName,fileName,folderName){
        let localData = JSON.parse(localStorage.getItem('localData'));
        for(let i=0; i<localData.length; i++){
            if(localData[i].folderName === folderName){
                for(let j=0; j<localData[i].files.length; j++){
                    if(localData[i].files[j].fileName === fileName){
                        for(let k=0; k<localData[i].files[j].taskList.length; k++){
                            if(localData[i].files[j].taskList[k].taskName === taskName){
                                localData[i].files[j].taskList.splice(k,1);
                                localStorage.setItem('localData',JSON.stringify(localData));
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
};