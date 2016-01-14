"use strict";
(function () {
    const DOC = document;

    //控制高度和宽度
    (function () {
        $('.addFilesBtn')[1].style.width =
            window.getComputedStyle($('#middle')).width;
        window.addEventListener('resize', function () {
            $('.addFilesBtn')[1].style.width =
                window.getComputedStyle($('#middle')).width;
        },false)
    })();

    $('#left').addEventListener('click', function (event) {
        let e = window.event || event;
        if ((e.target.className === 'rmFileBtn') &&
            (e.target.parentNode.nodeName === 'LI') &&
            (confirm('Are you sure?'))){
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        }else if ((e.target.className === 'rmFileBtn') &&
            (e.target.parentNode.nodeName === 'H3') &&
            (confirm('Are you sure?'))){
            this.removeChild(e.target.parentNode.parentNode);
        }
    },false)
})();