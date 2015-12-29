$.click('button',listener);
function listener(){
    var oldtime = new Date($('input').value.replace(/-/g,','));
    if (/^\d{4}-\d{2}-\d{2}$/.test($('input').value)){
        timer = 'undefined';
        computedTime(oldtime);
        var timer = setInterval(function () {
            computedTime(oldtime);
            clearInterval(timer);
        },1000);
    }else{
        console.log('stupid user!!');
        return false;
    }
}

function computedTime(oldtime){
    var nowtime = new Date();
    var difftime = oldtime.getTime()-nowtime.getTime();
    if (difftime <= 0){
        $('#text').innerHTML = '聆聆聆..';
        return 0;
        clearInterval(timer);
    }
    var diffday = Math.floor(difftime/1000/60/60/24);
    var diffhour = Math.floor(difftime/1000/60/60-diffday*24);
    var diffmin = Math.floor(difftime/1000/60-diffday*24*60-diffhour*60);
    var diffsec = Math.floor(difftime/1000-diffday*24*60*60-diffhour*60*60-diffmin*60);

    $('#text').innerHTML = '距离'+oldtime.getFullYear()+'年'+parseInt(oldtime.getMonth()+1)+'月'+oldtime.getDay()+'日还有'+addzero(diffday)+'天'+addzero(diffhour)+'小时'+addzero(diffmin)+'分'+addzero(diffsec)+'秒';
}

function addzero(time){
    if (time/10 < 1){
        return '0'+time;
    }else{
        return time;
    }
}