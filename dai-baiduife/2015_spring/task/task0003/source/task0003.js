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


    taskBox.addEventListener('click', function (event) {
        let e = window.event || event;
        //分类列表删除

        //删除分类文件夹
        if (e.target.className === 'closeBtn'
            && e.target.parentNode.nodeName === 'H4'){
            if (confirm('Are you sure ?')){
                e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
            }
        }else if (e.target.className === 'closeBtn'
            && e.target.parentNode.nodeName === 'LI'){
            //删除分类task单文件
            if (confirm('Are you sure ?')){
                e.target.parentNode.parentNode.removeChild(e.target.parentNode);
            }
        }else if (e.target.nodeName === 'H4' || e.target.nodeName === 'LI'){
            //分类列表添加选中背景
            if (folderListChecked){
                folderListChecked.style.backgroundColor = null;
            }
            e.target.style.backgroundColor = 'rgb(255,255,255)';
            folderListChecked = e.target;
        }
    },false);

    //add遮罩层
    let leftBar = DOC.getElementsByClassName('left')[0],
        mask = DOC.getElementById('mask'),
        createTask = DOC.getElementById('createTask'),
        taskName = DOC.getElementById('taskName'),
        bigTask = tasklist[0].cloneNode(true),
        smallTask = tasklist[0].getElementsByTagName('ul')[0].getElementsByTagName('li')[0].cloneNode(true),
        ul = document.createElement('ul');
    bigTask.removeChild(bigTask.children[1]);
    bigTask.appendChild(ul);
    //按下新增分类
    addBtn[0].addEventListener('click', function (event) {
        let e = window.event || event;
        mask.style.display = 'block';
    },false);

    //操作在创建分类界面
    createTask.addEventListener('click', function (event) {
        let e = window.event || event;
        //按下close关闭遮罩层
        if (e.target.id === 'noBtn'){
            mask.style.display = 'none';
        }else if (e.target.id === 'okBtn'){
            let taskNameVal = taskName.value;
            let cheackParentsBtn = createTask.getElementsByTagName('input')[1];
            //添加分类文件夹
            if (cheackParentsBtn.checked){
                let copyBigTask = bigTask.cloneNode(true);
                copyBigTask.children[0].children[0].innerText = taskName.value;
                taskName.value = null;
                taskBox.appendChild(copyBigTask);
                mask.style.display = 'none';
            }else{
                let copySmallTask = smallTask.cloneNode(true);
                copySmallTask.children[0].innerText = taskName.value;
                if (folderListChecked === null){
                    alert('请先选中要添加task的文件夹！！');
                }else if (folderListChecked.nodeName === 'H4'){
                    folderListChecked.parentNode.children[1].appendChild(copySmallTask);
                }else if (folderListChecked.nodeName === 'LI'){
                    folderListChecked.parentNode.appendChild(copySmallTask);
                }
                taskName.value = null;
                mask.style.display = 'none';
            }
        }
    },false);


    //middle界面
    middleTitle.addEventListener('click', function (event) {
        let e = window.event || event;
        if (e.target.nodeName === 'A'){
            taskListChecked.style.backgroundColor = null;
            e.target.style.backgroundColor = 'rgb(255, 255, 255)';
            taskListChecked = e.target;
        }
    },false)
})();





















