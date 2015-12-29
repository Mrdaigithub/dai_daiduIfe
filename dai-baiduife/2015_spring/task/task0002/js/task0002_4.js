;(function () {
    var str;
    ajax('data.json',{
        onsuccess: function (responseText,xhr) {
            str = JSON.parse(responseText);
        }
    });

    //删除提示
    function rmtip(){
        if ($('ul').children.length !== 0){
            var leg = $('ul').children.length;
            for (var i=0;i<leg;leg--){
                $('ul').removeChild($('ul').children[0]);
            }
        }
    }

    //删除提示背景
    function rmbg(){
        for (var i=0;i<$('ul').children.length;i++){
            if ($('ul').children[i].className === 'bgddd'){
                $('ul').children[i].className = '';
            }
        }
    }

    //输入智能提示
    function suggest(){
        $.on('input','keyup', function () {
            rmtip();
            var reg = new RegExp('^'+$('input').value);
            var redfont = $('input').value;
            var word = [];
            var redspan = [];
            var ffspan = [];
            for (var i=0;i<str.length;i++){
                if (reg.test(str[i])){
                    word[i] = document.createElement('li');
                    redspan[i] = document.createElement('span');
                    redspan[i].className = 'redspan';
                    ffspan[i] = document.createElement('span');
                    redspan[i].innerHTML = redfont;
                    ffspan[i].innerHTML = str[i].substr(redfont.length,str[i].length-redfont.length);
                    $('ul').appendChild(word[i]);
                    word[i].appendChild(redspan[i]);
                    word[i].appendChild(ffspan[i]);
                }
            }
        })

        $.on('ul','mouseover', function () {
            rmbg();
            var e = event || window.event;
            if (e.target.nodeName === 'SPAN'){
                e.target.parentNode.className = 'bgddd';
            }else{
                e.target.className = 'bgddd';
            }
        })

        //鼠标选择提示
        $.click('ul', function (event) {
            var e = event || window.event;
            if (e.target.nodeName === 'SPAN'){
                $('input').value = e.target.parentNode.innerText;
            }else{
                $('input').value = e.target.innerText;
            }
            rmtip();
        })
        document.addEventListener('click', function (event) {
            var e = event || window.event;
            if(e.target !== $('input')){
                rmtip();
            }
        },false)

        var index = 0;
        $.on('input','keyup', function (event) {
            var e = event || window.event;
            if (e.keyCode === 38){
                //up键选词条
                rmbg();
                if (index === 0){
                    index = $('ul').children.length-1;
                }else{
                    index--;
                }
                $('ul').children[index].className = 'bgddd';
                //press Enter
                if (e.keyCode === 13){
                    $('input').value = $('ul').children[index].innerText;
                    rmtip();
                }
            }else if (e.keyCode === 40){
                //按down键选词条
                rmbg();
                if (index === $('ul').children.length-1){
                    index = 0;
                }else{
                    index++;
                }
                $('ul').children[index].className = 'bgddd';
            }else if (e.keyCode === 13){
                //press Enter
                $('input').value = $('ul').children[index].innerText;
                rmtip();
                index = 0;
            }
        })
    }
    suggest();
})()