;(function (){
    var vbox;
    var oldX;
    var oldY;
    var LmoveX;
    var RmoveX
    //vbox移动
    function move(event){
        var e = window.event || event;
        var nowX = e.x;
        var nowY = e.y;
        vbox.style.transform = 'matrix(1,0,0,1,'+(nowX-oldX)+','+(nowY-oldY)+')';
        //要移动的距离
        LmoveX = ($('.fl').clientWidth+2)-(e.x-$('.box').offsetLeft)+(($('.box').clientWidth)+2)-($('.fl').clientWidth+2)*2;
        RmoveX = e.x - $('.box').offsetLeft - ($('.fl').clientWidth+2);
    }

    $.on('.box','mousedown', function (event) {
        var e = window.event || event;
        if (e.target.nodeName === 'LI'){
            vbox = document.createElement('div');
            vbox.className = 'vbox';
            e.target.appendChild(vbox);
            oldX = e.x;
            oldY = e.y;
            oldbox = e.target.parentNode;
            document.addEventListener('mousemove',move,false);
        }
    })

    $.on('.box','mouseup', function (event) {
        var e = window.event || event;
        var oldbox = e.target.parentNode.parentNode
        //从左到右放置虚拟dom
        if ((oldbox === $('.fl')) &&  (LmoveX < 0)){
            console.log('ok');
            var li = document.createElement('li');
            oldbox.removeChild($('li'));
            next(oldbox).appendChild(li);
        }else if((oldbox === $('.fr')) &&  (RmoveX < 0)){
            var li = document.createElement('li');
            var rmli = $('.fr').getElementsByTagName('li')[0];
            $('.fr').removeChild(rmli);
            prev(oldbox).appendChild(li);
        }
        //删除vbox拖动事件
        document.removeEventListener('mousemove',move,false);
        //删除虚拟box
        vbox.parentNode.removeChild($('.vbox'));
    })
})()