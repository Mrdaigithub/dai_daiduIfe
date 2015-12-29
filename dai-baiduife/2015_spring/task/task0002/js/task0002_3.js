function move(much){
        var moveX = much*-900
        $('ul').style.transform = 'matrix(1,0,0,1,'+moveX+',0)';
}

function rmactive(){
    for (var i=0;i<$('#btnBox').children.length;i++){
        if (/active/.test($('#btnBox').children[i].className)){
            $('#btnBox').children[i].className = 'btn'+(i+1);
            break;
        }
    }
}

//按钮驱动的轮播图滚动效果
$.click('#btnBox', function (event) {
    var e = event || window.event;
    console.log(e.target);
    switch(e.target){
        case $('#btnBox').children[0] :
            move(0);
            rmactive();
            e.target.className = 'btn1 active';
            break;
        case $('#btnBox').children[1] :
            move(1);
            rmactive();
            e.target.className = 'btn2 active';
            break;
        case $('#btnBox').children[2] :
            move(2);
            rmactive();
            e.target.className = 'btn3 active';
            break;
    }
});
////自动循环轮播事件
var count = 1;
function timers(){
    //最后一张
    console.log(count);
    move(count);
    if(count === $('ul').children.length-1){
        $('ul').style.transition = '0s';
        count = 1;
        if ($('ul').style.transition === '0s'){
            move(count);
        }
    }
    if ($('ul').style.transition === '0s'){
        $('ul').style.transition = '1s';
    }
    rmactive();
    $('#btnBox').children[count-1].className = 'btn'+(count+1-1)+' active';
    count++;
    setTimeout(timers,2000);
}
timers();