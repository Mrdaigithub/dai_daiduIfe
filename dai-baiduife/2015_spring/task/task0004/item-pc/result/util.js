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


//加载middle的task
function loadTask (){

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
                    $('.taskBox')[0].children[1].children[0].style.backgroundColor = '#3f3e33';
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
                    $('.taskBox')[0].children[1].children[0].style.backgroundColor = '#3f3e33';
                    return 0;
                }
            }
        }
    }
}

function loadTaskContent (){
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
        console.log(task);
        for (let i=0; i<localData.length; i++){
            if (localData[i].folderName === prevNode(files.parentNode).innerText.replace(/X$/,'')){
                for (let j=0; j<localData[i].files.length; j++){
                    if (localData[i].files[j].fileName === files.innerText.replace(/X$/,'')){
                        for (let k=0; k<localData[i].files[j].taskList.length; k++){
                            if (localData[i].files[j].taskList[k].taskName === task){
                                let readTask = $('#readTask'),
                                    writeTask = $('#writeTask');
                                writeTask.children[0].innerHTML = readTask.children[0].innerHTML = localData[i].files[j].taskList[k].taskName;
                                writeTask.children[1].innerHTML = readTask.children[1].innerHTML = localData[i].files[j].taskList[k].taskData;
                                writeTask.children[2].innerHTML = readTask.children[2].innerHTML = localData[i].files[j].taskList[k].taskContent;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}