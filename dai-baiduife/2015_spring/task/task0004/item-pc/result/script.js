(function () {
    "use strict";
    const DOC = document;

    (function () {

        //检测localStorage是否存在,不存在就添加初始数据
        if (localStorage.getItem('localData') === null){
            localStorage.setItem('localData','[{"folderName":"默认分类","files":[{"fileName":"README","taskList":[{"taskName":"README","taskData":"2016-01-15","taskContent":"xxxxxxxxxxxxxxxxx","complete":true}]}]}]')
        }

        //控制高度和宽度
        $('.addFilesBtn')[1].style.width =
            window.getComputedStyle($('#middle')).width;
        window.addEventListener('resize', function () {
            $('.addFilesBtn')[1].style.width =
                window.getComputedStyle($('#middle')).width;
        },false);

        //任务列表双击隐藏
        $("#left").addEventListener('dblclick', function (event) {
            let e = window.event || event;
            if (e.target.nodeName === 'H3'){
                if (nextNode(e.target).style.display === 'block'){
                    nextNode(e.target).style.display = 'none';
                }else{
                    nextNode(e.target).style.display = 'block';
                }
            }
        },false);

        //加载left的文件and文件夹
        loadFile();

        //加载middle的task
        loadTask();

        //加载right
        loadTaskContent();
    })();

    $('#left').addEventListener('click', function (event) {
        let e = window.event || event;

        //删除分类列表
        if ((e.target.className === 'rmFileBtn') &&
            (e.target.parentNode.nodeName === 'LI') &&
            (confirm('Are you sure?'))){
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        }else if ((e.target.className === 'rmFileBtn') &&
            (e.target.parentNode.nodeName === 'H3') &&
            (confirm('Are you sure?'))){
            this.removeChild(e.target.parentNode.parentNode);
        }

        //添加分类
        if(e.target.className === 'addFilesBtn'){
            $('#createMask').style.display ='block';
        }

        //leftBar添加选中的标记
        (function () {
            let flag = $('#checked');
            if ((e.target.nodeName === 'LI' || e.target.nodeName === 'H3')){
                flag.id = null;
                e.target.id = 'checked';
            }

            //加载middle的task
            loadTask();

            //加载right
            loadTaskContent();
        })();
    },false);


    //创建文件或文件夹
    $('#createMask').addEventListener('click', function (event) {
        let e = window.event || event,
            localData = JSON.parse(localStorage.getItem('localData'));

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
                let dataTree = {
                    folderName:inputFileNameVal,
                    files:[]
                };
                localData.push(dataTree);
                localStorage.setItem('localData',JSON.stringify(localData));

                //重新加载left的文件and文件夹
                loadFile();
            }else{

                //创建文件

                //修改本地存储数据
                let dataTree = {
                    fileName:inputFileNameVal,
                    taskList:[]
                },
                    folderName = prevNode($('#checked').parentNode).innerText.replace(/X$/,'');
                for(let i=0; i<localData.length; i++){
                    if(localData[i].folderName === folderName){
                        console.log(inputFileNameVal);
                        localData[i].files.push(dataTree);
                        break;
                    }
                }
                localStorage.setItem('localData',JSON.stringify(localData));

                //重新加载left的文件and文件夹
                loadFile();
            }


        }
    },false);

    (function () {
        let checked = $('.taskBox')[0].children[1].children[0];
        $('#middle').addEventListener('click', function (event) {
            let e = window.event || event;

            //点击middle的完成分类按钮
            if (e.target.nodeName === 'A'){
                let labelChecked = $('.labelChecked')[0];
                labelChecked.className = null;
                e.target.className = 'labelChecked';
            }else if (e.target.nodeName === 'LI'){
                checked.style.backgroundColor = null;
                e.target.style.backgroundColor = '#3F3E33';
                checked = e.target;
            }

            if(e.target === $('.addFilesBtn')[1]){
                $('#readTask').style.display = 'none';
                $('#writeTask').style.display = 'block';
            }
            loadTaskContent();
        },false)
    })();

})();