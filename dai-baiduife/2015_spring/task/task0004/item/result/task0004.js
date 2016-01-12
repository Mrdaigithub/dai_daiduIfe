'use strict';

(function () {
    var DOC = document;
    var DATA = [{
        todoName: '任务分类1',
        taskList: [{
            taskName: '任务1',
            taskDate: '2015-01-01',
            taskContent: '任务1的描述描述描述描述描述描述描述',
            flag: '任务分类1'
        }, {
            taskName: '任务2',
            taskDate: '2015-02-02',
            taskContent: '任务2的描述描述描述描述描述描述描述',
            flag: '任务分类1'
        }, {
            taskName: '任务3',
            taskDate: '2015-05-05',
            taskContent: '任务3的描述描述描述描述描述描述描述',
            flag: '任务分类1'
        }]
    }, {
        todoName: '任务分类2',
        taskList: [{
            taskName: '任务1',
            taskDate: '2015-01-01',
            taskContent: '任务1的描述描述描述描述描述描述描述',
            flag: '任务分类2'
        }, {
            taskName: '任务2',
            taskDate: '2015-02-02',
            taskContent: '任务2的描述描述描述描述描述描述描述',
            flag: '任务分类2'
        }, {
            taskName: '任务3',
            taskDate: '2015-05-05',
            taskContent: '任务3的描述描述描述描述描述描述描述',
            flag: '任务分类2'
        }]
    }, {
        todoName: '任务分类3',
        taskList: [{
            taskName: '任务1',
            taskDate: '2015-01-01',
            taskContent: '任务1的描述描述描述描述描述描述描述',
            flag: '任务分类3'
        }, {
            taskName: '任务2',
            taskDate: '2015-02-02',
            taskContent: '任务2的描述描述描述描述描述描述描述',
            flag: '任务分类3'
        }, {
            taskName: '任务3',
            taskDate: '2015-05-05',
            taskContent: '任务3的描述描述描述描述描述描述描述',
            flag: '任务分类3'
        }]
    }];
    //选择器
    var $ = function $(query) {
        if (/^#/.test(query)) {
            return DOC.querySelector(query);
        } else {
            return DOC.querySelectorAll(query);
        }
    };

    //删除mian子元素
    var removeMainChild = function removeMainChild() {
        var main = $('#main');
        for (var i = main.children.length; i > 0; i--) {
            main.removeChild(main.children[0]);
        }
    };

    //创建to-do界面

    function createTodoView() {
        var main = $('#main');
        $('#title').innerHTML = 'To-do';
        $('#back').style.display = 'none';
        var child = '';
        for (var i = 0; i < DATA.length; i++) {
            child += '<li>' + DATA[i].todoName + '</li>';
        }
        main.innerHTML = child;
    }
    createTodoView();

    //创建任务分类界面

    function createTaskListView(node) {
        var main = $('#main'),
            child = '';
        $('#title').dataset.flag = node;
        //改标题
        $('h1')[0].innerHTML = node;
        //出现back按钮
        $('#back').style.display = 'inline-block';
        for (var i = 0; i < DATA.length; i++) {
            if (DATA[i].todoName === node) {
                for (var j = 0; j < DATA[i].taskList.length; j++) {
                    child += '<li>' + DATA[i].taskList[j].taskName + '</li>';
                }
                main.innerHTML = child;
                break;
            }
        }
    }

    //创建任务详情界面

    function createTaskView(prevNode, node) {

        //改标题
        $('#title').innerHTML = node.innerHTML;
        var main = $('#main');
        var name = node.innerHTML;
        var child = '';
        for (var i = 0; i < DATA.length; i++) {
            if (DATA[i].todoName === prevNode) {
                for (var j = 0; j < DATA[i].taskList.length; j++) {
                    if (DATA[i].taskList[j].taskName === name) {
                        for (var key in DATA[i].taskList[j]) {
                            if (key !== 'flag') {
                                child += '<li>' + DATA[i].taskList[j][key] + '</li>';
                            } else {
                                $('#title').dataset.flag = DATA[i].taskList[j][key];
                            }
                        }
                    }
                }
            }
        }
        main.innerHTML = child;
    }

    //创建界面
    $('ul')[0].addEventListener('touchend', function (event) {
        var e = window.event || event,
            title = $('#title').innerHTML;
        if (e.target.nodeName === 'LI') {

            //在todo界面
            if (title === 'To-do') {

                //清屏
                removeMainChild();

                //创建任务分类界面
                createTaskListView(e.target.innerHTML);

                //在任务分类界面
            } else if (/^任务分类/.test(title)) {

                    //清屏
                    removeMainChild();

                    //创建任务详情界面
                    createTaskView(title, e.target);
                }
        }
    }, false);

    //返回方法
    function toBack() {
        if ($('#title').innerHTML !== 'To-do') {
            var title = $('#title').innerHTML,
                flag = $('#title').dataset.flag;
            if (flag === title) {

                //创建to-do界面
                createTodoView();
            } else {
                createTaskListView(flag);
            }
        } else {
            return false;
        }
    }

    $('#back').addEventListener('touchend', toBack, false);
    //+100
    (function () {
        var x = null,
            disX = null,
            initialX = null;
        DOC.addEventListener('touchmove', function (event) {
            var e = window.event || event;
            if (x === null) {
                initialX = e.touches[0].clientX;
            }
            x = e.touches[0].clientX;
            disX = x - initialX;
        }, false);

        DOC.addEventListener('touchend', function () {
            if (disX > 15) {
                toBack();
            }
            x = null;
            initialX = null;
            disX = null;
        }, false);
    })();
})();