(function () {
    const DOC = document;
    var bgwhite = null;
    let tasklist = DOC.getElementsByClassName('tasklist');
    for (let i=0; i<tasklist.length; i++){
        tasklist[i].addEventListener('click', function (event) {
            let e = window.event || event;
            //分类列表删除
            if (e.target.className === 'closeBtn'
                && e.target.parentNode.nodeName === 'H4'){
                if (confirm('Are you sure ?')){
                    e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
                };
            }else if (e.target.className === 'closeBtn'){
                if (confirm('Are you sure ?')){
                    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
                };
            }else if (e.target.nodeName === 'H4' || e.target.nodeName === 'LI'){
                if (bgwhite){
                    bgwhite.style.backgroundColor = null;
                }
                e.target.style.backgroundColor = 'rgb(255,255,255)';
                bgwhite = e.target;
            }
        },false)
    }
    let addBtn = DOC.getElementById('addBtn');
    let mask = DOC.getElementById('mask');
    addBtn.addEventListener('click', function (event) {
        let e = window.event || event;
        mask.style.display = 'block';
    },false)
    let noBtn = DOC.getElementById('noBtn');
    noBtn.addEventListener('click', function () {
        mask.style.display = 'none';
    },false)
})()