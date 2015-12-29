$.click('#btn1',listener1);
function listener1(){
    var str = $('#text1').value;
    var arr = uniqArray(str.split(','));
    for (var i=0;i<arr.length;i++){
        if (/\s/g.test(arr[i])){
            arr.splice(i,1);
        }
    }
    $('#p1').innerHTML = arr;
}

$.click('#btn2',listener2);
function listener2(){
    var str = $('#text2').value;
    var arr = uniqArray(str.split(/,|\s+|，|、|;/));
    for (var i=0;i<arr.length;i++){
        if (/\s/g.test(arr[i])){
            arr.splice(i,1);
        }
    }
    $('#p2').innerHTML = arr;
}

$.click('#btn3',listener3);
function listener3(){
    if ($('#box').children.length !== 0){
        var boxchildleg = $('#box').children.length;
        for(var k=0;k<boxchildleg;k++){
            console.log($('#box').childNodes[k]);
            $('#box').removeChild($('#box').childNodes[0]);
        }
    }
    var str = $('#text3').value;
    var arr = uniqArray(str.split(/,|\s+|，|、|;/));
    for (var i=0;i<arr.length;i++){
        if (/\s/g.test(arr[i])){
            arr.splice(i,1);
        }
        if (arr[i] === ''){
            arr.splice(i,1);
        }
    }
    if(arr.length === 0 || arr.length > 10){
        $('#error').style.display = 'block';
        return false;
    }
    else {
        if ($('#error').style.display === 'block'){
            $('#error').style.display = 'none';
        }
        var input = [];
        var labels = [];
        var box = [];
        for(var j=0;j<arr.length;j++){
            box[j] = document.createElement('div');
            $('#box').appendChild(box[j]);

            labels[j] = document.createElement('span');
            labels[j].innerHTML = arr[j];
            box[j].appendChild(labels[j]);

            input[j] = document.createElement('input');
            input[j].type = 'checkbox';
            input[j].label = arr[j];
            box[j].appendChild(input[j]);
        }
    }
}