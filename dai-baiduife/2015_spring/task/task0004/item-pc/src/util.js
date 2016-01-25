"use strict";
//工具函数
let tools = {

    ////选择器
    $:function (selector){
        if(/^#/.test(selector)){
            return document.querySelector(selector);
        }else{
            return document.querySelectorAll(selector);
        }
    },

    //上一个兄弟节点
    prevNode: function (element){
    return element.previousElementSibling;
    },

    //下一个兄弟节点
    nextNode: function (element){
    return element.nextElementSibling;
    }
};

//视图修改

let setView = {
    div : document.createElement('div'),
    li : document.createElement('li'),

    //清除上次的视图，将用来重绘
    clearDirty: function (name) {
        let clearBox = tools.$(name),
            clearList = clearBox.children;
        for(let i=clearList.length; i>0; i--){
            clearBox.removeChild(clearList[0]);
        }
    },

    //判断是否有一样的taskDate
    sameTaskDate: function (compareDate) {
        let localData = JSON.parse(localStorage.getItem('localData')),
            taskBox = tools.$('.taskBox');
        for(let i=0; i<taskBox.length; i++){
            if(taskBox[i].getElementsByClassName('taskDate')[0].innerHTML === compareDate){
                return true;
            }
        }
        return false;
    },

    //页面载入时加载left文件and文件夹
    loadFileView: function(){
        let localData = JSON.parse(localStorage.getItem('localData'));
        this.clearDirty('#leftBox');
        for(let i=0; i<localData.length; i++){
            let filesBox = this.div.cloneNode(true);
            filesBox.className = 'filesBox';
            let str = '';
            if(localData[i].checked){
                str += '<h3 id="fileChecked">';
            }else{
                str += '<h3>';
            }
            str += localData[i].folderName +
                '<span class="rmFileBtn">X</span>' +
                '</h3>' + '<ul style="display: block;">';
            for(let j=0; j<localData[i].files.length; j++){
                if(localData[i].files[j].checked){
                    str += '<li id="fileChecked">';
                }else{
                    str += '<li>';
                }
                str += localData[i].files[j].fileName +
                    '<span class="rmFileBtn">X</span></li>';
            }
            str += '</ul>';
            filesBox.innerHTML = str;
            tools.$('#leftBox').appendChild(filesBox);
        }
    },

    //加载middle的task
    loadTaskView: function(){
        let localData = JSON.parse(localStorage.getItem('localData')),
            fileChecked = document.getElementById('fileChecked');
        this.clearDirty('#middleBox');
        if(fileChecked.nodeName === 'H3'){
            for(let i=0; i<localData.length; i++){
                console.log('ok');
                if(localData[i].folderName === fileChecked.innerText.replace(/X/,'')){
                    for(let j=0; j<localData[i].files.length; j++){
                        console.log('ok');
                        //查找labelChecked
                        if(tools.$('#labelChecked') === tools.$('#label').children[0]){
                            console.log('0');
                        }
                    }
                }
            }
        }else if(fileChecked.nodeName === 'LI'){
            for(let i=0; i<localData.length; i++){
                let taskDateBox = [undefined];
                for(let j=0; j<localData[i].files.length; j++){
                    if(localData[i].files[j].fileName === fileChecked.innerText.replace(/X/,'')){
                        switch (tools.$('#labelChecked')){

                            //不定义是否完成,全部显示
                            case tools.$('#label').children[0]:
                                for(let k=0; k<localData[i].files[j].taskList.length; k++){
                                    let str = '',
                                        taskBox = this.div.cloneNode(true);
                                    taskBox.className = 'taskBox';

                                    //判断是否已经创建相同的时间块
                                    if(this.sameTaskDate(localData[i].files[j].taskList[k].taskDate)){
                                        //找到相同时间块
                                        let singleTask = this.li.cloneNode(true);
                                        if(localData[i].files[j].taskList[k].taskComplete){
                                            singleTask.className = 'taskComplete';
                                        }
                                        if(localData[i].files[j].taskList[k].checked){
                                            singleTask.id = 'taskChecked';
                                        }
                                        singleTask.innerHTML = localData[i].files[j].taskList[k].taskName;
                                        //找到相同时间块
                                        for(let m=0; m<tools.$('.taskDate').length; m++){
                                            if(tools.$('.taskDate')[m].innerText === localData[i].files[j].taskList[k].taskDate){
                                                tools.nextNode(tools.$('.taskDate')[m]).appendChild(singleTask);
                                                break;
                                            }
                                        }
                                    }else{
                                        //没有相同时间块
                                        str += '<div class="taskDate">' + localData[i].files[j].taskList[k].taskDate +
                                            '</div>' +
                                            '<ul class="taskList">';

                                        //添加完成标志
                                        if(localData[i].files[j].taskList[k].complete){
                                            if(localData[i].files[j].taskList[k].checked){
                                                str += '<li class="taskComplete" id="taskChecked">' +
                                                    localData[i].files[j].taskList[k].taskName + '</li>' +
                                                    '</ul>';
                                            }else{
                                                str += '<li class="taskComplete">' +
                                                    localData[i].files[j].taskList[k].taskName + '</li>' +
                                                    '</ul>';
                                            }
                                        }else{
                                            //不添加完成标志
                                            //添加选中任务标志
                                            if(localData[i].files[j].taskList[k].checked){
                                                str += '<li id="taskChecked">' +
                                                    localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
                                            }else{
                                                //没有选中任务
                                                str += '<li>' +
                                                    localData[i].files[j].taskList[k].taskName + '</li>' + '</ul>';
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
                                for(let k=0; k<localData[i].files[j].taskList.length; k++){
                                    let str = '',
                                        taskBox = this.div.cloneNode(true);
                                    taskBox.className = 'taskBox';
                                    if(!localData[i].files[j].taskList[k].complete){
                                        //判断是否已经创建相同的时间块
                                        if(this.sameTaskDate(localData[i].files[j].taskList[k].taskDate)){
                                            //找到相同时间块
                                            let singleTask = this.li.cloneNode(true);
                                            if(localData[i].files[j].taskList[k].taskComplete){
                                                singleTask.className = 'taskComplete';
                                            }
                                            if(localData[i].files[j].taskList[k].checked){
                                                singleTask.id = 'taskChecked';
                                            }
                                            singleTask.innerHTML = localData[i].files[j].taskList[k].taskName;
                                            //找到相同时间块
                                            for(let m=0; m<tools.$('.taskDate').length; m++){
                                                if(tools.$('.taskDate')[m].innerText === localData[i].files[j].taskList[k].taskDate){
                                                    tools.nextNode(tools.$('.taskDate')[m]).appendChild(singleTask);
                                                    break;
                                                }
                                            }
                                        }else{
                                            //没有相同时间块
                                            str += '<div class="taskDate">' + localData[i].files[j].taskList[k].taskDate +
                                                '</div>' +
                                                '<ul class="taskList">';
                                            //添加完成标志
                                            if(localData[i].files[j].taskList[k].complete){
                                                if(localData[i].files[j].taskList[k].checked){
                                                    str += '<li class="taskComplete" id="taskChecked">' +
                                                        localData[i].files[j].taskList[k].taskName +
                                                        '</li>' +
                                                        '</ul>';
                                                }else{
                                                    str += '<li class="taskComplete">' +
                                                        localData[i].files[j].taskList[k].taskName +
                                                        '</li>' +
                                                        '</ul>';
                                                }
                                            }else{
                                                str += '<li>' +
                                                    localData[i].files[j].taskList[k].taskName +
                                                    '</li>' +
                                                    '</ul>';
                                                if(localData[i].files[j].taskList[k].checked){
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

                            //只显示已完成任务
                            case tools.$('#label').children[2]:
                                for(let k=0; k<localData[i].files[j].taskList.length; k++){
                                    let str = '',
                                        taskBox = this.div.cloneNode(true);
                                    taskBox.className = 'taskBox';
                                    if(localData[i].files[j].taskList[k].complete){
                                        //判断是否已经创建相同的时间块
                                        if(this.sameTaskDate(localData[i].files[j].taskList[k].taskDate)){
                                            //找到相同时间块
                                            let singleTask = this.li.cloneNode(true);
                                            if(localData[i].files[j].taskList[k].taskComplete){
                                                singleTask.className = 'taskComplete';
                                            }
                                            if(localData[i].files[j].taskList[k].checked){
                                                singleTask.id = 'taskChecked';
                                            }
                                            singleTask.innerHTML = localData[i].files[j].taskList[k].taskName;
                                            //找到相同时间块
                                            for(let m=0; m<tools.$('.taskDate').length; m++){
                                                if(tools.$('.taskDate')[m].innerText === localData[i].files[j].taskList[k].taskDate){
                                                    tools.nextNode(tools.$('.taskDate')[m]).appendChild(singleTask);
                                                    break;
                                                }
                                            }
                                        }else{
                                            //没有相同时间块
                                            str += '<div class="taskDate">' + localData[i].files[j].taskList[k].taskDate +
                                                '</div>' +
                                                '<ul class="taskList">';
                                            //添加完成标志
                                            if(localData[i].files[j].taskList[k].complete){
                                                if(localData[i].files[j].taskList[k].checked){
                                                    str += '<li class="taskComplete" id="taskChecked">' +
                                                        localData[i].files[j].taskList[k].taskName +
                                                        '</li>' +
                                                        '</ul>';
                                                }else{
                                                    str += '<li class="taskComplete">' +
                                                        localData[i].files[j].taskList[k].taskName +
                                                        '</li>' +
                                                        '</ul>';
                                                }
                                            }else{
                                                str += '<li>' +
                                                    localData[i].files[j].taskList[k].taskName +
                                                    '</li>' +
                                                    '</ul>';
                                                if(localData[i].files[j].taskList[k].checked){
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
    loadContentView: function(){
        let localData = JSON.parse(localStorage.getItem('localData')),
            fileChecked = tools.$('#fileChecked'),
            folderName = null,
            taskName = tools.$('#taskChecked').innerText,
            readTask = tools.$('#readTask'),
            writeTask = tools.$('#writeTask');

        if(fileChecked.nodeName === 'H3'){
            folderName = fileChecked.innerText.replace(/X/,'');
        }else if(fileChecked.nodeName === 'LI'){
            folderName = tools.prevNode(fileChecked.parentNode).innerText.replace(/X/,'');
        }
        for(let i=0; i<localData.length; i++){
            if(localData[i].folderName === folderName){
                for(let j=0; j<localData[i].files.length; j++){
                    for(let k=0; k<localData[i].files[j].taskList.length; k++){
                        if(localData[i].files[j].taskList[k].taskName === taskName){
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
let setData = {

    //添加文件夹数据
    addFolderData: function(folderName){
        let localData = JSON.parse(localStorage.getItem('localData'));
        let dataTree = {
            folderName:folderName,
            checked:false,
            files:[]
        };
        localData.push(dataTree);
        localStorage.setItem('localData',JSON.stringify(localData));
    },

    //添加文件数据
    addFileData: function (fileName, folderName) {
        let localData = JSON.parse(localStorage.getItem('localData'));
        let dataTree = {
            folderName:folderName,
            fileName:fileName,
            checked:false,
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
            folderName:folderName,
            fileName:fileName,
            taskName: taskData[0],
            taskDate: taskData[1],
            taskContent: taskData[2],
            complete: false,
            checked: false
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
    setTaskComplete: function (completeBool,taskName,checkedFileNode) {
        let localData = JSON.parse(localStorage.getItem('localData'));
        if(checkedFileNode.nodeName === 'H3'){
            let folderName = checkedFileNode.innerText.replace(/X/,'');
            for(let i=0; i<localData.length; i++){
                if(localData[i].folderName === folderName){
                    for(let j=0; j<localData[i].files.length; j++){
                        for(let k=0; k<localData[i].files[j].taskList.length; k++){
                            if(localData[i].files[j].taskList[k].taskName === taskName.innerText &&
                                localData[i].files[j].taskList[k].fileName === localData[i].files[j].fileName){
                                localData[i].files[j].taskList[k].complete = completeBool;
                                break;
                            }
                        }
                    }
                }
            }
        }else if(checkedFileNode.nodeName === 'LI'){
            let folderName = tools.prevNode(checkedFileNode.parentNode).innerText.replace(/X/,'');
            let fileName = checkedFileNode.innerText.replace(/X/,'');
            for(let i=0; i<localData.length; i++){
                if(localData[i].folderName === folderName){
                    for(let j=0; j<localData[i].files.length; j++){
                        if(localData[i].files[j].fileName === fileName){
                            for(let k=0; k<localData[i].files[j].taskList.length; k++){
                                if(localData[i].files[j].taskList[k].taskName === taskName){
                                    localData[i].files[j].taskList[k].complete = completeBool;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        localStorage.setItem('localData',JSON.stringify(localData));
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
    },

    //添加left标记
    checkedFiles: function(newCheckedNode,oldCheckedNode){
        let localData = JSON.parse(localStorage.getItem('localData')),
            oldCheckedName = oldCheckedNode.innerText.replace(/X/,''),
            newCheckedName = newCheckedNode.innerText.replace(/X/,'');
        //清除原先标记
        if(oldCheckedNode.nodeName === 'H3'){
            for(let i=0; i<localData.length; i++){
                if(localData[i].folderName === oldCheckedName){
                    localData[i].checked = false;
                    break;
                }
            }
        }else if(oldCheckedNode.nodeName === 'LI'){
            for(let i=0; i<localData.length; i++){
                for(let j=0; j<localData[i].files.length; j++){
                    if(localData[i].files[j].fileName === oldCheckedName){
                        localData[i].files[j].checked = false;
                        break;
                    }
                }
            }
        }
        //添加标记
        if(newCheckedNode.nodeName === 'H3'){
            for(let i=0; i<localData.length; i++){
                if(localData[i].folderName === newCheckedName){
                    localData[i].checked = true;
                    break;
                }
            }
        }else if(newCheckedNode.nodeName === 'LI'){
            for(let i=0; i<localData.length; i++){
                for(let j=0; j<localData[i].files.length; j++){
                    if(localData[i].files[j].fileName === newCheckedName){
                        localData[i].files[j].checked = true;
                        break;
                    }
                }
            }
        }
        localStorage.setItem('localData',JSON.stringify(localData));
    },

    //添加任务选中标记
    addTaskChecked: function (newCheckedNode,fileNode) {
        let localData = JSON.parse(localStorage.getItem('localData'));
        for(let i=0; i<localData.length; i++){
            for(let j=0; j<localData[i].files.length; j++){
                for(let k=0; k<localData[i].files[j].taskList.length; k++){
                    if(localData[i].files[j].taskList[k].checked){
                        localData[i].files[j].taskList[k].checked = false;
                        break;
                    }
                }
            }
        }

        if(fileNode.nodeName === 'H3'){
            let folderName = fileNode.innerText.replace(/X/,'');
            for(let i=0; i<localData.length; i++){
                if(localData[i].folderName === folderName){
                    for(let j=0; j<localData[i].files.length; j++){
                        for(let k=0; k<localData[i].files[j].taskList.length; k++){
                            if(localData[i].files[j].taskList[k].taskName === newCheckedNode.innerText &&
                                localData[i].files[j].taskList[k].fileName === localData[i].files[j].fileName){
                                localData[i].files[j].taskList[k].checked = true;
                                break;
                            }
                        }
                    }
                }
            }
        }else if(fileNode.nodeName === 'LI'){
            let folderName = tools.prevNode(fileNode.parentNode).innerText.replace(/X/,'');
            let fileName = fileNode.innerText.replace(/X/,'');
            for(let i=0; i<localData.length; i++){
                if(localData[i].folderName === folderName){
                    for(let j=0; j<localData[i].files.length; j++){
                        if(localData[i].files[j].fileName === fileName){
                            for(let k=0; k<localData[i].files[j].taskList.length; k++){
                                if(localData[i].files[j].taskList[k].taskName === newCheckedNode.innerText){
                                    localData[i].files[j].taskList[k].checked = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        localStorage.setItem('localData',JSON.stringify(localData));
    }
    //页面加载重置标记
    //resetCheckedFiles: function () {
    //    let localData = JSON.parse(localStorage.getItem('localData')),
    //        oldChecked = $('#fileChecked'),
    //        newChecked = $('#leftBox').getElementsByTagName('li')[0],
    //        oldCheckedName = oldChecked.innerText.replace(/X/,''),
    //        newCheckedName = newChecked.innerText.replace(/X/,'');
    //
    //    console.log(newChecked);
    //    //清除原先标记
    //    if(oldChecked.nodeName === 'H3'){
    //        for(let i=0; i<localData.length; i++){
    //            if(localData[i].folderName === oldCheckedName){
    //                localData[i].checked = false;
    //                break;
    //            }
    //        }
    //    }else if(oldChecked.nodeName === 'LI'){
    //        for(let i=0; i<localData.length; i++){
    //            for(let j=0; j<localData[i].files.length; j++){
    //                if(localData[i].files[j].fileName === oldCheckedName){
    //                    localData[i].files[j].checked = false;
    //                    break;
    //                }
    //            }
    //        }
    //    }
    //    localData[0].files[0].checked = true;
    //    localStorage.setItem('localData',JSON.stringify(localData));
    //}
};

export {tools,setData,setView};