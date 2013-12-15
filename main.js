(function (window, document, undefined) {
    'use strict';

    var c   = document.getElementById('canvas'),
        ctx = c.getContext('2d'),
        w   = c.width,
        h   = c.height,
        cx  = w * .5,
        cy  = h * .5,
        t   = 0.000006,
        size = 4,
        delay = 30,
        mouseX = w *.5,
        mouseY = h * .5;

    c.addEventListener('mousemove', function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    ctx.fillStyle = '#000001';
    ctx.save();

    var zoomOutSquares = function fn(ctx, x, y) {
        fn.cache = fn.cache || {iteration: 0}

        var iteration = fn.cache.iteration;

        ctx.globalAlpha = Math.min(.8, noise(
            Math.cos((x - y) / size *(iteration*t)),
            Math.sin((x + y) / size * (iteration*t)),
            noise(iteration/size*0.000001, t, t*t)
        ));

        ctx.fillRect(x, y, size, size);

        fn.cache.iteration = (iteration + 1) % (2<<19);
    },

    zoomOut = function fn(ctx, x, y) {
        fn.cache = fn.cache || {iteration: 2<<12, direction: 1, ax: 0, ay: 0, vx: 0, vy: 0};

        fn.cache.ax += (mouseX - cx) * .01;
        fn.cache.ay += (mouseY - cy) * .01;

        var iteration = fn.cache.iteration,
            ax = fn.cache.ax,
            ay = fn.cache.ay,
            vx = fn.cache.vx,
            vy = fn.cache.vy,
            s = Math.sin(0.000000002 * iteration * (y - x*x*t)),
            c = Math.cos(0.000000001 * iteration * (x + y * y * t));

        ctx.globalAlpha = Math.min(.4, noise(
            (s*s + (c*c)) * noise(Math.atan2(s, c), 1, s),
            s * c - y * t,
            noise(x * t, t * y, x * y * t * t)
        ));

        ctx.save();
        ctx.fillStyle = '#a00';
        ctx.fillRect(x, y, size, size);
        ctx.restore();

        if (iteration < 0 || iteration >= (2<<19)) {
            fn.cache.direction *= -1;
        }

        fn.cache.vx += ax;
        fn.cache.vy += ay;
        fn.cache.iteration = (iteration + fn.cache.direction);
    };

    setTimeout(function fn() {
        ctx.globalAlpha = .8;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);

        ctx.restore();
        ctx.save();
        for (var x = 0, y; x < w; x += size) {
            for (y = 0; y < h; y += size) {
                zoomOutSquares(ctx, x, y);
                zoomOut(ctx, x, y);
            }
        }
        setTimeout(fn, delay);
    }, delay);
}(window, document));