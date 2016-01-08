(function() {
    const DOC = document;
    let tasklist = DOC.getElementsByClassName('tasklist'),
        taskBox = DOC.getElementById('taskBox'),
        main = DOC.getElementsByClassName('main')[0],
        middle = DOC.getElementsByClassName('middle')[0],
        addBtn = DOC.getElementsByClassName('addBtn'),
        middleTitle = DOC.getElementsByClassName('title')[0];

    var folderListChecked = null,
        taskListChecked = middleTitle.children[0],
        localData = [];

    //控制addBtn高度&&宽度
    main.style.height = (window.innerHeight - 60) + 'px';
    addBtn[1].style.width = window.getComputedStyle(middle, null).width ||
        middle.currentStyle.width;
    addBtn[1].style.width = middle.innerWidth;
    window.addEventListener('resize', function() {
        main.style.height = (window.innerHeight - 60) + 'px';
        addBtn[1].style.width = window.getComputedStyle(middle, null).width ||
            middle.currentStyle.width;
    }, false);

    //删除localstorage
    function removeLocalData(isFolder, name) {
        let data = JSON.parse(localStorage.getItem('localData'));

        //删除localstorage文件夹
        if (isFolder) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].folderName === name) {
                    data.splice(i, 1);
                    localStorage.setItem('localData', JSON.stringify(data));
                    break;
                }
            }
        } else {
            //删除localstorage单文件
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].files.length; j++) {
                    if (data[i].files[j].fileName === name) {
                        data[i].files.splice(j, 1);
                        localStorage.setItem('localData', JSON.stringify(data));
                        return 0;
                    }
                }
            }
        }
    }

    //分类列表删除
    taskBox.addEventListener('click', function(event) {
        let e = window.event || event;

        //删除分类文件夹
        if (e.target.className === 'closeBtn' && e.target.parentNode.nodeName === 'H4') {
            if (confirm('Are you sure ?')) {
                e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
                removeLocalData(true, e.target.parentNode.children[0].innerText);
            }
        } else if (e.target.className === 'closeBtn' && e.target.parentNode.nodeName === 'LI') {
            //删除分类task单文件
            if (confirm('Are you sure ?')) {
                e.target.parentNode.parentNode.removeChild(e.target.parentNode);
                removeLocalData(false, e.target.parentNode.children[0].innerText);
            }
        } else if (e.target.nodeName === 'H4' ||
            e.target.nodeName === 'LI' ||
            e.target.parentNode.nodeName === 'H4' ||
            e.target.parentNode.nodeName === 'LI') {

            //分类列表添加选中背景

            //清除上次选中的背景
            if (folderListChecked) {
                folderListChecked.style.backgroundColor = null;
            }
            if (e.target.parentNode.nodeName === 'H4') {
                e.target.parentNode.style.backgroundColor = 'rgb(255,255,255)';
                //设置标记
                folderListChecked = e.target.parentNode;
            } else if (e.target.parentNode.nodeName === 'LI') {
                e.target.parentNode.style.backgroundColor = 'rgb(255,255,255)';
                //设置标记
                folderListChecked = e.target.parentNode;
            } else {
                e.target.style.backgroundColor = 'rgb(255,255,255)';
                //设置标记
                folderListChecked = e.target;
            }
        }
    }, false);

    //双击文件夹隐藏显示子文件
    taskBox.addEventListener('dblclick', function(event) {
        let e = window.event || event;
        if (e.target.nodeName === 'H4') {
            if (e.target.parentNode.children[1].style.display === ('block')) {
                e.target.parentNode.children[1].style.display = 'none';
            } else {
                e.target.parentNode.children[1].style.display = 'block';
            }
        } else if (e.target.parentNode.nodeName === 'H4') {
            if (e.target.parentNode.parentNode.children[1].style.display === ('block')) {
                e.target.parentNode.parentNode.children[1].style.display = 'none';
            } else {
                e.target.parentNode.parentNode.children[1].style.display = 'block';
            }
        }
    }, false);

    //add遮罩层
    let mask = DOC.getElementById('mask'),
        createTask = DOC.getElementById('createTask'),
        taskName = DOC.getElementById('taskName'),
        bigTask = tasklist[0].cloneNode(true),
        smallTask = tasklist[0].getElementsByTagName('ul')[0].getElementsByTagName('li')[0].cloneNode(true),
        ul = DOC.createElement('ul');
    ul.style.display = 'block';
    bigTask.removeChild(bigTask.children[1]);
    bigTask.appendChild(ul);

    //添加分类文件夹函数
    function addFolder(taskNameVal) {
        let copyBigTask = bigTask.cloneNode(true);

        copyBigTask.children[0].children[0].innerText = taskNameVal;
        taskBox.appendChild(copyBigTask);
        mask.style.display = 'none';
    }

    //手动添加task文件函数
    function addFile(taskNameVal) {
        let copySmallTask = smallTask.cloneNode(true);
        copySmallTask.children[0].innerText = taskNameVal;
        if (folderListChecked === null) {
            alert('请先选中要添加task的文件夹~');
        } else if (folderListChecked.nodeName === 'H4') {
            folderListChecked.parentNode.children[1].appendChild(copySmallTask);
        } else if (folderListChecked.nodeName === 'LI') {
            folderListChecked.parentNode.appendChild(copySmallTask);
        }

        mask.style.display = 'none';
    }

    //页面加载自动添加的files文件函数
    function autoAddFile(taskNameVal, folder) {
        let copySmallTask = smallTask.cloneNode(true);
        copySmallTask.children[0].innerText = taskNameVal;
        folder.children[1].appendChild(copySmallTask);
    }

    //遍历数组找到对应的folder目录下
    function findFolder() {
        for (let i = 0; i < localData.length; i++) {
            if (folderListChecked.children[0].innerText === localData[i].folderName) {
                return i;
            }
        }
    }

    //检测创建文件夹或文件是否重名
    function isRepeat(isFolder, taskNameVal) {
        if (localData !== null) {
            if (isFolder) {
                for (let i = 0; i < localData.length; i++) {
                    if (localData[i].folderName === taskNameVal) {
                        return true;
                    }
                }
            } else {
                for (let i = 0; i < localData.length; i++) {
                    for (let j = 0; j < localData[i].files.length; j++) {
                        if (localData[i].files[j].fileName === taskNameVal) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    //按下新增分类
    addBtn[0].addEventListener('click', function() {
        mask.style.display = 'block';
    }, false);

    //操作在创建分类界面
    createTask.addEventListener('click', function(event) {
        let e = window.event || event;

        localData = JSON.parse(localStorage.getItem('localData'));
        if (localData === null) {
            localData = [];
        }
        //按下close关闭遮罩层
        if (e.target.id === 'noBtn') {
            mask.style.display = 'none';
        } else if (e.target.id === 'okBtn') {
            let checkParentsBtn = createTask.getElementsByTagName('input')[1];

            //添加分类文件夹
            if (checkParentsBtn.checked) {
                if (isRepeat(true, taskName.value)) {
                    alert('重复创建');
                    return 0;
                } else {
                    addFolder(taskName.value);
                    let folder = {
                        folderName: taskName.value,
                        files: []
                    };
                    localData.push(folder);
                    taskName.value = null;
                }
            } else {
                if (isRepeat(false, taskName.value)) {
                    alert('重复创建');
                    return 0;
                } else {
                    //添加分类文件下的子文件
                    addFile(taskName.value);
                    if (folderListChecked.nodeName === 'H4') {
                        let i = findFolder();
                        let fileData = {
                            fileName: taskName.value,
                            taskList: []
                        };
                        localData[i].files.push(fileData);
                    }
                    taskName.value = null;
                }
            }
        }
        localStorage.setItem('localData', JSON.stringify(localData));
    }, false);

    //初始化页面加载localstorage,添加task文件夹和子文件
    (function() {
        let taskData = JSON.parse(localStorage.getItem('localData'));
        if (taskData !== null) {
            for (let i = 0; i < taskData.length; i++) {
                addFolder(taskData[i].folderName);
                for (let j = 0; j < taskData[i].files.length; j++) {
                    autoAddFile(taskData[i].files[j].fileName, tasklist[i + 1]);
                }
            }
        }
    })();


    //middle界面
    let rightTitle = DOC.getElementsByClassName('rightTitle'),
        rightTitleName = DOC.getElementById('rightTitleName'),
        inputTaskName = DOC.getElementById('inputTaskName'),
        rightDateSpan = DOC.getElementById('rightDateSpan'),
        inputDate = DOC.getElementById('inputDate'),
        rightContentRead = DOC.getElementById('rightContentRead'),
        rightContentWrite = DOC.getElementById('rightContentWrite'),
        saveBtn = DOC.getElementById('saveBtn'),
        btnBox = DOC.getElementById('btnBox');

    middleTitle.addEventListener('click', function(event) {
        let e = window.event || event;
        if (e.target.nodeName === 'A') {
            taskListChecked.style.backgroundColor = null;
            e.target.style.backgroundColor = 'rgb(255, 255, 255)';
            taskListChecked = e.target;
        }
    }, false);

    //按下中间的addbtn按钮，添加task，修改rightBar界面
    addBtn[1].addEventListener('click', function() {
        editModel();
    }, false);

    let taskFiles = DOC.createElement('li'),
        taskFilesBox = DOC.createElement('ul'),
        taskDate = DOC.createElement('div'),
        taskList = DOC.createElement('div'),
        dataTaskBox = DOC.getElementById('dataTaskBox');
    taskList.className = 'dataTask';
    taskDate.className = 'taskDate';

    //设置task数据
    function setTaskData() {
        let localData = JSON.parse(localStorage.getItem('localData'));
        let taskData = {
            taskName: inputTaskName.value,
            taskDate: inputDate.value,
            taskContent: rightContentWrite.value,
            complete: false
        };
        for (let i = 0; i < localData.length; i++) {
            for (let j = 0; j < localData[i].files.length; j++) {
                if (localData[i].files[j].fileName === folderListChecked.children[0].innerText) {
                    localData[i].files[j].taskList.push(taskData);
                    return localData;
                }
            }
        }
    }

    //创建middleTask
    function createTasks(names, dates) {
        //创建大的taskBox
        let copyTaskList = taskList.cloneNode(true);
        dataTaskBox.appendChild(copyTaskList);

        //创建task时间
        let copyTaskDate = taskDate.cloneNode(true);
        copyTaskDate.innerText = dates;
        copyTaskList.appendChild(copyTaskDate);

        //创建taskListBox
        let copyTaskFilesBox = taskFilesBox.cloneNode(true);
        copyTaskList.appendChild(copyTaskFilesBox);

        //创建单个task
        let copyTaskFiles = taskFiles.cloneNode(true);
        copyTaskFiles.innerText = names;
        copyTaskFilesBox.appendChild(copyTaskFiles);
        if (setTaskComplete(copyTaskFiles)) {
            copyTaskFiles.className = 'taskCpmplete';
        }
    }

    //性能爆炸点，修改flag
    //添加task在middleBar
    function addTask() {
        let localData = JSON.parse(localStorage.getItem('localData'));
        if (localData !== null) {

            //删除上次列表
            for (let l = dataTaskBox.children.length; l > 0; l--) {
                dataTaskBox.removeChild(dataTaskBox.children[0]);
            }
            console.log(localData);
            for (let i = 0; i < localData.length; i++) {
                for (let j = 0; j < localData[i].files.length; j++) {
                    for (let k = 0; k < localData[i].files[j].taskList.length; k++) {

                        //遍历 dataTaskBox 下的 taskDate 数组 ,检测是否有相同的
                        let dataTaskBoxDate = dataTaskBox.getElementsByClassName('taskDate');
                        if (dataTaskBoxDate.length > 0) {
                            for (let l = 0; l < dataTaskBoxDate.length; l++) {
                                if (localData[i].files[j].taskList[k].taskDate ===
                                    dataTaskBoxDate[l].innerText) {

                                    //创建单个task
                                    let copyTaskFiles = taskFiles.cloneNode(true);
                                    copyTaskFiles.innerText = localData[i].files[j].taskList[k].taskName;
                                    dataTaskBoxDate[l].parentNode.children[1].appendChild(copyTaskFiles);
                                    if (setTaskComplete(copyTaskFiles)) {
                                        copyTaskFiles.className = 'taskCpmplete';
                                    }
                                } else {
                                    createTasks(localData[i].files[j].taskList[k].taskName,
                                        localData[i].files[j].taskList[k].taskDate);
                                }
                                break;
                            }
                        } else {
                            createTasks(localData[i].files[j].taskList[k].taskName,
                                localData[i].files[j].taskList[k].taskDate);
                        }
                    }
                }
            }
        }
    }

    //加载时添加middle taskList
    addTask();

    //处理task文件
    saveBtn.addEventListener('click', function(event) {
        let e = window.event || event;
        if (folderListChecked) {
            //按下save按钮
            if (e.target === this.children[1]) {
                console.log('ok');
                let taskData = setTaskData();
                console.log(JSON.stringify(taskData));
                readOnlyModel();
                localStorage.setItem('localData', JSON.stringify(taskData));
                addTask();
            }
        }else{
            alert('先选一个task文件目录文件');
        }
    }, false)

    //进入编辑模式
    function editModel(name, date, content) {
        console.log(arguments);
        //修改task标题
        rightTitleName.style.display = 'none';
        inputTaskName.style.display = 'block';

        //修改task Date
        rightDateSpan.style.display = 'none';
        inputDate.style.display = 'inline-block';

        //修改taskContent
        rightContentRead.style.display = 'none';
        rightContentWrite.style.display = 'block';

        //编辑状态下完成按钮消失
        btnBox.style.display = 'none';

        if (name) {
            inputTaskName.value = name;
        } else {
            inputTaskName.value = null;
        }
        if (date) {
            inputDate.value = date;
        } else {
            inputDate.value = null;
        }
        if (content) {
            rightContentWrite.value = content;
        } else {
            rightContentWrite.value = null;
        }
    }

    //进入只读模式
    function readOnlyModel(name,date,content) {

        //修改task标题
        rightTitleName.style.display = 'block';
        inputTaskName.style.display = 'none';

        //修改task Date
        rightDateSpan.style.display = 'inline-block';
        inputDate.style.display = 'none';

        //修改taskContent
        rightContentRead.style.display = 'block';
        rightContentWrite.style.display = 'none';

        //未编辑状态下完成按钮出现
        btnBox.style.display = 'block';

        if (name) {
            rightTitleName.innerText = name;
        } else {
            rightTitleName.innerText = null;
        }
        if (date) {
            rightDateSpan.innerText = date;
        } else {
            rightDateSpan.innerText = null;
        }
        if (content) {
            rightContentRead.innerText = content;
        } else {
            rightContentRead.innerText = null;
        }
    }

    //选中task文件
    let taskFlag = null;
    dataTaskBox.addEventListener('click', function(event) {
        let e = window.event || event;
        if (e.target.nodeName === 'LI') {
            if (taskFlag !== null) {
                taskFlag.style.backgroundColor = null;
            }
            e.target.style.backgroundColor = 'rgb(242,242,242)';
            taskFlag = e.target;
            let taskDatas = getTaskData(taskFlag.innerText);
            readOnlyModel(taskDatas.taskName,taskDatas.taskDate,taskDatas.taskContent);
        }
    }, false)

    //修改或得到complete标志
    function setTaskComplete(node, bool) {
        let taskData = JSON.parse(localStorage.getItem('localData'));

        //更改完成标记
        for (let i = 0; i < taskData.length; i++) {
            for (let j = 0; j < taskData[i].files.length; j++) {
                for (let k = 0; k < taskData[i].files[j].taskList.length; k++) {
                    if (taskData[i].files[j].taskList[k].taskName === node.innerText) {
                        if (bool) {
                            taskData[i].files[j].taskList[k].complete = bool;
                            localStorage.setItem('localData', JSON.stringify(taskData));
                        }
                        return taskData[i].files[j].taskList[k].complete;
                    };
                }
            }
        }
    }

    function getTaskData(name) {
        let localData = JSON.parse(localStorage.getItem('localData'));
        for (let i = 0; i < localData.length; i++) {
            for (let j = 0; j < localData[i].files.length; j++) {
                for (let k = 0; k < localData[i].files[j].taskList.length; k++) {
                    if (localData[i].files[j].taskList[k].taskName === name) {
                        return localData[i].files[j].taskList[k];
                    }
                }
            }
        }
    }
    //添加完成标志
    btnBox.addEventListener('click', function(event) {
        let e = window.event || event;
        if (taskFlag !== null) {

            //按下完成按钮
            if (e.target === this.children[0]) {
                taskFlag.className = 'taskCpmplete';
                setTaskComplete(taskFlag, true);

                //按下编辑按钮
            } else if (e.target === this.children[1]) {
                let taskDatas = getTaskData(taskFlag.innerText);
                console.log(taskDatas);
                editModel(taskDatas.taskName, taskDatas.taskData, taskDatas.taskContent);
            }
        } else {
            alert('先选一个task');
        }
    }, false)

})();
