(function () {
    const DOC = document;
    let tasklist = DOC.getElementsByClassName('tasklist'),
        taskBox = DOC.getElementById('taskBox'),
        main = DOC.getElementsByClassName('main')[0],
        middle = DOC.getElementsByClassName('middle')[0],
        addBtn = DOC.getElementsByClassName('addBtn'),
        middleTitle = DOC.getElementsByClassName('title')[0];

    var folderListChecked = null,
        taskListChecked = middleTitle.children[0];

    //控制addBtn高度&&宽度
    main.style.height = (window.innerHeight - 60) + 'px';
    addBtn[1].style.width = window.getComputedStyle(middle,null).width ||
        middle.currentStyle.width;
    addBtn[1].style.width = middle.innerWidth;
    window.addEventListener('resize', function () {
        main.style.height = (window.innerHeight - 60) + 'px';
        console.log(window.getComputedStyle(middle,null).width);
        addBtn[1].style.width = window.getComputedStyle(middle,null).width ||
                                middle.currentStyle.width;
    },false);

    //删除localstorage
    function removeLocalData(isFolder,name){
        let data = JSON.parse(localStorage.getItem('localData'));

        //删除localstorage文件夹
        if (isFolder){
            for (let i=0; i<data.length; i++){
                if (data[i].folderName === name){
                    data.splice(i,1);
                    localStorage.setItem('localData',JSON.stringify(data));
                    break;
                }
            }
        }else{
            console.log(name);
            //删除localstorage单文件
            for (let i=0; i<data.length; i++){
                for (let j=0; j<data[i].fileNames.length; j++){
                    if (data[i].fileNames[j] === name){
                        data[i].fileNames.splice(j,1);
                        localStorage.setItem('localData',JSON.stringify(data));
                        return 0;
                    }
                }
            }
        }
    }

    //分类列表删除
    taskBox.addEventListener('click', function (event) {
        let e = window.event || event;

        //删除分类文件夹
        if (e.target.className === 'closeBtn'
            && e.target.parentNode.nodeName === 'H4'){
            if (confirm('Are you sure ?')){
                e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
                removeLocalData(true,e.target.parentNode.children[0].innerText);
            }
        }else if (e.target.className === 'closeBtn'
            && e.target.parentNode.nodeName === 'LI'){
            //删除分类task单文件
            if (confirm('Are you sure ?')){
                e.target.parentNode.parentNode.removeChild(e.target.parentNode);
                removeLocalData(false,e.target.parentNode.children[0].innerText);
            }
        }else if (e.target.nodeName === 'H4' ||
            e.target.nodeName === 'LI' ||
            e.target.parentNode.nodeName === 'H4' ||
            e.target.parentNode.nodeName === 'LI'){

            //分类列表添加选中背景

            //清除上次选中的背景
            if (folderListChecked){
                folderListChecked.style.backgroundColor = null;
            }
            if (e.target.parentNode.nodeName === 'H4'){
                e.target.parentNode.style.backgroundColor = 'rgb(255,255,255)';
                //设置标记
                folderListChecked = e.target.parentNode;
            }else if (e.target.parentNode.nodeName === 'LI'){
                e.target.parentNode.style.backgroundColor = 'rgb(255,255,255)';
                //设置标记
                folderListChecked = e.target.parentNode;
            }else{
                e.target.style.backgroundColor = 'rgb(255,255,255)';
                //设置标记
                folderListChecked = e.target;
            }
        }
    },false);

    //双击文件夹隐藏显示子文件
    taskBox.addEventListener('dblclick', function (event) {
        let e = window.event || event;
        if (e.target.nodeName === 'H4'){
            if (e.target.parentNode.children[1].style.display === ('block')){
                e.target.parentNode.children[1].style.display = 'none';
            }else{
                e.target.parentNode.children[1].style.display = 'block';
            }
        }else if (e.target.parentNode.nodeName === 'H4'){
            if (e.target.parentNode.parentNode.children[1].style.display === ('block')){
                e.target.parentNode.parentNode.children[1].style.display = 'none';
            }else{
                e.target.parentNode.parentNode.children[1].style.display = 'block';
            }
        }
    },false);

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

    var localData = [];

    //添加分类文件夹函数
    function addFolder(taskNameVal){
        let copyBigTask = bigTask.cloneNode(true);

        copyBigTask.children[0].children[0].innerText = taskNameVal;
        taskNameVal = null;
        taskBox.appendChild(copyBigTask);
        mask.style.display = 'none';
    }

    //手动添加task文件函数
    function addFile(taskNameVal){
        let copySmallTask = smallTask.cloneNode(true);
        copySmallTask.children[0].innerText = taskNameVal;
        if (folderListChecked === null){
            alert('请先选中要添加task的文件夹~');
        }else if (folderListChecked.nodeName === 'H4'){
            folderListChecked.parentNode.children[1].appendChild(copySmallTask);
        }else if (folderListChecked.nodeName === 'LI'){
            folderListChecked.parentNode.appendChild(copySmallTask);
        }
        taskNameVal = null;
        mask.style.display = 'none';
    }

    //页面加载自动添加的task文件函数
    function autoAddFile(taskNameVal,folder){
        let copySmallTask = smallTask.cloneNode(true);
        copySmallTask.children[0].innerText = taskNameVal;
        folder.children[1].appendChild(copySmallTask);
    }

    //遍历数组找到对应的folder目录下
    function findFolder(){
        for (let i=0; i<localData.length; i++){
            if (folderListChecked.children[0].innerText === localData[i].folderName){
                return i;
            }
        }
    }

    //检测创建文件夹或文件是否重名
    function isRepeat(isFolder,taskNameVal){
        if (localData !== null){
            if (isFolder){
                for (let i=0; i<localData.length; i++){
                    if (localData[i].folderName === taskNameVal){
                        return true;
                    }
                }
            }else{
                for (let i=0; i<localData.length; i++){
                    for (let j=0; j<localData[i].fileNames.length; j++){
                        if (localData[i].fileNames[j] === taskNameVal){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    //按下新增分类
    addBtn[0].addEventListener('click', function () {
        mask.style.display = 'block';
    },false);

    //操作在创建分类界面
    createTask.addEventListener('click', function (event) {
        let e = window.event || event;

        localData = JSON.parse(localStorage.getItem('localData'));
        if (localData === null){
            localData = [];
        }
        console.log(localData);
        //按下close关闭遮罩层
        if (e.target.id === 'noBtn'){
            mask.style.display = 'none';
        }else if (e.target.id === 'okBtn'){
            let checkParentsBtn = createTask.getElementsByTagName('input')[1];

            //添加分类文件夹
            if (checkParentsBtn.checked){
                if (isRepeat(true,taskName.value)){
                    alert('重复创建');
                    return 0;
                }else{
                    addFolder(taskName.value);
                    let folder = {
                        folderName : taskName.value,
                        fileNames : []
                    };
                    localData.push(folder);
                }
            }else{
                if (isRepeat(false,taskName.value)){
                    alert('重复创建');
                    return 0;
                }else{
                    //添加分类文件下的子文件
                    addFile(taskName.value);
                    if (folderListChecked.nodeName === 'H4'){
                        let i = findFolder();
                        localData[i].fileNames.push(taskName.value);
                    }
                }
            }
        }
        localStorage.setItem('localData',JSON.stringify(localData));
    },false);

    //初始化页面加载localstorage,添加task文件夹和子文件
    (function (){
        let taskData = JSON.parse(localStorage.getItem('localData'));
        if (taskData !== null){
            for (let i=0; i<taskData.length; i++){
                addFolder(taskData[i].folderName);
                for (let j=0; j<taskData[i].fileNames.length; j++){
                    autoAddFile(taskData[i].fileNames[j],tasklist[i+1]);
                }
            }
        }
    })();


    //middle界面
    let rightTitle = DOC.getElementsByClassName('rightTitle'),
        rightTitleName = DOC.getElementById('rightTitleName'),
        inuptTaskName = DOC.getElementById('inuptTaskName'),
        rightDateSpan = DOC.getElementById('rightDateSpan'),
        inputDate = DOC.getElementById('inputDate'),
        rightContentRead = DOC.getElementById('rightContentRead'),
        rightContentWrite = DOC.getElementById('rightContentWrite'),
        saveBtn = DOC.getElementById('saveBtn'),
        btnBox = DOC.getElementById('btnBox');

    middleTitle.addEventListener('click', function (event) {
        let e = window.event || event;
        if (e.target.nodeName === 'A'){
            taskListChecked.style.backgroundColor = null;
            e.target.style.backgroundColor = 'rgb(255, 255, 255)';
            taskListChecked = e.target;
        }
    },false);

    //按下中间的addbtn按钮，添加task，修改rightBar界面
    addBtn[1].addEventListener('click', function () {

        //修改task标题
        rightTitleName.style.display = 'none';
        inuptTaskName.style.display = 'block';

        //修改task Date
        rightDateSpan.style.display = 'none';
        inputDate.style.display = 'inline-block';

        //修改taskContent
        rightContentRead.style.display = 'none';
        rightContentWrite.style.display = 'block';

        //编辑状态下完成按钮消失
        btnBox.style.display = 'none';
    },false);

    //按下save按钮
    saveBtn.addEventListener('click', function (event) {
        let e = window.event || event;
        if (e.target === this.children[1]){
            //修改task标题
            rightTitleName.style.display = 'block';
            inuptTaskName.style.display = 'none';

            //修改task Date
            rightDateSpan.style.display = 'inline-block';
            inputDate.style.display = 'none';

            //修改taskContent
            rightContentRead.style.display = 'block';
            rightContentWrite.style.display = 'none';

            //未编辑状态下完成按钮出现
            btnBox.style.display = 'block';
        }
    },false)
})();





















