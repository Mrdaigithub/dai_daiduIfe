"use strict";
(function () {
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

        //加载本地数据的file and folder
        (function (){
            let localData = JSON.parse(localStorage.getItem('localData'));
            for(let i=0; i<localData.length; i++){
                let filesBox = document.createElement('div');
                filesBox.className = 'filesBox';
                $('#left').appendChild(filesBox);
                let fileHtml = '';

                //添加选中标记
                fileHtml += '<h3>'+localData[i].folderName+'<span class="rmFileBtn">X</span></h3><ul style="display: block;">';
                for (let j=0; j<localData[i].files.length; j++){
                    fileHtml += '<li>'+localData[i].files[j].fileName+'<span class="rmFileBtn">X</span></li>';
                }
                fileHtml += '</ul>';
                filesBox.innerHTML = fileHtml;
                $('.filesBox')[0].children[1].children[0].id = 'checked';
            }
        })();

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

        //leftBar添加选中的标记
        (function () {
            let flag = $('#checked');
            if ((e.target.nodeName === 'LI')){
                flag.id = null;
                e.target.id = 'checked';
            }

            //加载middle的task
            loadTask();

            //加载right
            loadTaskContent();
        })();
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
            loadTaskContent();
        },false)
    })();

})();