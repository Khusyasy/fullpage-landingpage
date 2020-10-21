(function () {
    "use strict";
    /*[pan and fullpage CSS scrolls]*/
    var pnls = document.querySelectorAll('.fullpage-panel').length - 1,
        scdir, hold = false, scrto = 0;

    function _scrollY(obj) {
        var slength, plength, pan, step = 100,
            vh = window.innerHeight / 100,
            vmin = Math.min(window.innerHeight, window.innerWidth) / 100;
        if ((this !== undefined && this.id === 'fullpage') || (obj !== undefined && obj.id === 'fullpage')) {
            pan = this || obj;
            plength = parseInt(pan.offsetHeight / vh);
        }
        if (pan === undefined) {
            return;
        }
        plength = plength || parseInt(pan.offsetHeight / vmin);
        slength = parseInt(pan.style.transform.replace('translateY(', ''));
        slength = Math.round(slength / 100) * 100;
        if (scdir === 'up' && Math.abs(slength) < (plength - (plength / pnls))) {
            slength = slength - step;
        } else if (scdir === 'down' && slength < 0) {
            slength = slength + step;
        } else if (scdir === 'top') {
            slength = 0;
        } else if (scdir === 'num') {
            slength = -(step * scrto);
            console.log(slength);
        }
        if (slength > 0) {
            slength = 0;
        }
        if (Math.abs(slength) > pnls * step) {
            slength = -(pnls * step);
        }
        if (hold === false) {
            hold = true;
            set_page(Math.abs(slength) / step);
            pan.style.transform = 'translateY(' + slength + 'vh)';
            setTimeout(function () {
                hold = false;
            }, 750);
        }
        //console.log(scdir + ':' + slength + ':' + plength + ':' + (plength - plength / pnls));
    }
    /*[swipe detection on touchscreen devices]*/
    function _swipe(obj) {
        var swdir,
            sX,
            sY,
            dX,
            dY,
            threshold = 100,
            /*[min distance traveled to be considered swipe]*/
            slack = 10000,
            /*[max distance allowed at the same time in perpendicular direction]*/
            alT = 500,
            /*[max time allowed to travel that distance]*/
            elT, /*[elapsed time]*/
            stT, /*[start time]*/
            sPY = 0, /* start pan y */
            vh = window.innerHeight / 100;
        obj.addEventListener('touchstart', function (e) {
            var tchs = e.changedTouches[0];
            swdir = 'none';
            sX = tchs.pageX;
            sY = tchs.pageY;
            if (obj.id === 'fullpage') {
                var pan = obj;
                sPY = parseInt(pan.style.transform.replace('translateY(', '')) * vh;
            }
            //stT = new Date().getTime();
            //e.preventDefault();
        }, false);

        obj.addEventListener('touchmove', function (e) {
            if (hold === false) {
                var tchs = e.changedTouches[0], vh = window.innerHeight / 100;
                dX = tchs.pageX - sX;
                dY = tchs.pageY - sY;
                if (obj.id === 'fullpage') {
                    var pan = obj;
                    pan.style.transform = 'translateY(' + ((sPY + dY) / vh) + 'vh)';
                    pan.style.transition = 'none';
                }
            }
            e.preventDefault(); /*[prevent scrolling when inside DIV]*/
        }, false);

        obj.addEventListener('touchend', function (e) {
            if (obj.id === 'fullpage') {
                var pan = obj;
                pan.style.transition = '700ms cubic-bezier(.60,0,.30,1)';
            }
            var tchs = e.changedTouches[0];
            dX = tchs.pageX - sX;
            dY = tchs.pageY - sY;
            elT = new Date().getTime() - stT;
            //if (elT <= alT) {
            /*if (Math.abs(dX) >= threshold && Math.abs(dY) <= slack) {
                swdir = (dX < 0) ? 'left' : 'right';
            } else*/ if (Math.abs(dY) >= threshold && Math.abs(dX) <= slack) {
                swdir = (dY < 0) ? 'up' : 'down';
            } else {
                swdir = 'none';
            }
            if (obj.id === 'fullpage') {
                if (swdir === 'up') {
                    scdir = swdir;
                    _scrollY(obj);
                } else if (swdir === 'down') {
                    scdir = swdir;
                    _scrollY(obj);

                } else if (swdir === 'none') {
                    scdir = swdir;
                    _scrollY(obj);
                }
                e.stopPropagation();
            }
            //}
        }, false);
    }
    function set_page(page_num) {
        for (var i = 0; i < paging.length; i++) {
            paging[i].classList.remove('active');
        }
        paging[page_num].classList.add('active');
    }
    /*[assignments]*/
    var fullpage = document.getElementById('fullpage');
    fullpage.style.transform = 'translateY(0)';
    fullpage.addEventListener('wheel', function (e) {
        if (e.deltaY < 0) {
            scdir = 'down';
        }
        if (e.deltaY > 0) {
            scdir = 'up';
        }
        e.stopPropagation();
    });
    fullpage.addEventListener('wheel', _scrollY);
    _swipe(fullpage);
    for (var i = 1; i <= pnls + 1; i++) {
        var li = document.createElement('li');
        li.textContent = i;
        li.addEventListener('click', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            scrto = this.textContent - 1;
            scdir = 'num';
            _scrollY(fullpage);
        });
        document.getElementById('paging-list').appendChild(li)
    }
    var paging = document.getElementById('paging-list').children;
    set_page(0);
    var tops = document.querySelectorAll('.top');
    for (var i = 0; i < tops.length; i++) {
        tops[i].addEventListener('click', function () {
            scdir = 'top';
            _scrollY(fullpage);
        });
    }
})();