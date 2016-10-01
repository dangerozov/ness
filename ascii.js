var chars = {
    middot: '·',
    null: ' '
};

var colors = {
    black: 'black',
    red: 'red',
    aliceblue: 'aliceblue',
    gray: 'gray'
};

var brush = {
    rect: {
        get: function(x, y, br) {
            return br[y * 3 + x];
        },
        double: function(fore, back) {
            return [['╔═', fore, back], ['══', fore, back], ['═╗', fore, back],
                    ['║ ', fore, back], [null, null, null], [' ║', fore, back],
                    ['╚═', fore, back], ['══', fore, back], ['═╝', fore, back]]
        },
        fill: function(char, fore, back) {
            return [[char, fore, back], [char, fore, back], [char, fore, back],
                    [char, fore, back], [char, fore, back], [char, fore, back],
                    [char, fore, back], [char, fore, back], [char, fore, back]];
        },
        outline: function(char, fore, back) {
            return [[char, fore, back], [char, fore, back], [char, fore, back],
                    [char, fore, back], [null, null, null], [char, fore, back],
                    [char, fore, back], [char, fore, back], [char, fore, back]];
        }
    },
    line: {
        fill: function(char, fore, back) {
            return [[char, fore, back], [char, fore, back], [char, fore, back]];
        }
    }
};

var createCanvas = (function() {
    var createSpan = function() {
        var span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.textAlign = 'center';
        return span;
    };

    var createDiv = function() {
        var div = document.createElement('div');
        div.style.fontFamily = 'monospace';
        return div;
    };

    var findSpanWidth = function() {
        var div = document.body.appendChild(createDiv());        
        var span = div.appendChild(createSpan());        
        span.innerText = '12';
        var width = span.offsetWidth;
        document.body.removeChild(div); 
        return width;
    };
    
    return function(width, height) {
        var spanWidth = findSpanWidth() + 'px';
        var pixels = new Array(width * height);
        for (var i = 0; i < pixels.length; i++) {
            var span = createSpan();
            span.style.width = spanWidth;
            pixels[i] = span;
        }

        var div = createDiv();
        for (var row = 0; row < height; row++) {
            for (var column = 0; column < width; column++) {
                div.appendChild(pixels[row * width + column]);
            }
            div.appendChild(document.createElement('br'));
        }
        
        return {
            width: width,
            height: height,
            pixels: pixels,
            display: div
        };
    };
})();

var buffer = {
    create: function(width, height) {
        var size = width * height;
        var buf = {
            width: width,
            height: height,
            size: size,
            chars: new Array(size),
            fores: new Array(size),
            backs: new Array(size)
        };
        buffer.clear(chars.null, null, null, buf);
        return buf;
    },
    clear: function(char, fore, back, buf) {
        for (var i = 0; i < buf.size; i++) {
            buf.chars[i] = char;
            buf.fores[i] = fore;
            buf.backs[i] = back;
        }
    },
    set: function(char, fore, back, x, y, buf) {
        if (0 > x || x >= buf.width ||
            0 > y || y >= buf.height) return;
        var i = y * buf.width + x;
        buf.chars[i] = char;
        buf.fores[i] = fore;
        buf.backs[i] = back;
    },
    getChar: function(x, y, buf) {
        if (0 > x || x >= buf.width ||
            0 > y || y >= buf.height) return;
        var i = y * buf.width + x;
        return buf.chars[i];
    },
    getFore: function(x, y, buf) {
        if (0 > x || x >= buf.width ||
            0 > y || y >= buf.height) return;
        var i = y * buf.width + x;
        return buf.fores[i];
    },
    getBack: function(x, y, buf) {
        if (0 > x || x >= buf.width ||
            0 > y || y >= buf.height) return;
        var i = y * buf.width + x;
        return buf.backs[i];
    },
    copy: function(w, h, x0, y0, buf0, x1, y1, buf1) {
        for (var i = 0; i < Math.min(w, buf0.width); i++) {
            for (var j = 0; j < Math.min(h, buf0.height); j++) {
                buffer.set(
                    buffer.getChar(x0 + i, y0 + j, buf0),
                    buffer.getFore(x0 + i, y0 + j, buf0),
                    buffer.getBack(x0 + i, y0 + j, buf0),
                    x1 + i,
                    y1 + j,
                    buf1);
            }
        }
    }
};

var draw = {
    fill: function(char, fore, back, buf) {
        for (var x = 0; x < buf.width; x++) {
            for (var y = 0; y < buf.height; y++) {
                draw.one(char, fore, back, x, y, buf);
            }
        }
    },
    one: function(char, fore, back, x, y, buf) {
        var ch = buffer.getChar(x, y, buf);
        var fo = buffer.getFore(x, y, buf);
        var ba = buffer.getBack(x, y, buf);
        buffer.set(char || ch, fore || fo, back || ba, x, y, buf);
    },
    text: function(s, fore, back, x, y, buf) {
        var flooredX = Math.floor(x); 
        if (flooredX !== x) {
            x = flooredX;
            s = ' ' + s;
        }
        
        s = (s.length % 2 === 0) ? s : s + ' ';
        s = s.replace(/ /g, chars.null);
        for (var i = 0; i < s.length / 2; i++) {
            var pair = s[i*2] + ((i*2+1) < s.length ? s[i*2+1] : '');
            draw.one(pair, fore, back, x + i, y, buf);
        }
    },
    wideText: function(s, fore, back, x, y, buf) {
        for (var i = 0; i < s.length; i++) {
            draw.one(s[i], fore, back, x + i, y, buf);
        }
    },
    rect: function(br, x, y, width, height, buf) {
        var x0 = x, y0 = y, x1 = x + width - 1, y1 = y + height - 1;
        
        var topLeft = brush.rect.get(0, 0, br); 
        draw.one(topLeft[0], topLeft[1], topLeft[2], x0, y0, buf);
        var bottomLeft = brush.rect.get(0, 2, br);
        draw.one(bottomLeft[0], bottomLeft[1], bottomLeft[2], x0, y1, buf);
        var topRight = brush.rect.get(2, 0, br);
        draw.one(topRight[0], topRight[1], topRight[2], x1, y0, buf);
        var bottomRight = brush.rect.get(2, 2, br);
        draw.one(bottomRight[0], bottomRight[1], bottomRight[2], x1, y1, buf);

        var topCenter = brush.rect.get(1, 0, br);
        var bottomCenter = brush.rect.get(1, 2, br);
        for (var i = x + 1; i < x1; i++) {
            draw.one(topCenter[0], topCenter[1], topCenter[2], i, y0, buf);
            draw.one(bottomCenter[0], bottomCenter[1], bottomCenter[2], i, y1, buf);
        }
        
        var middleLeft = brush.rect.get(0, 1, br);
        var middleRight = brush.rect.get(2, 1, br);
        for (var i = y + 1; i < y1; i++) {
            draw.one(middleLeft[0], middleLeft[1], middleLeft[2], x0, i, buf);
            draw.one(middleRight[0], middleRight[1], middleRight[2], x1, i, buf);
        }

        var center = brush.rect.get(1, 1, br);
        for (var i = x + 1; i < x1; i++)
            for (var j = y + 1; j < y1; j++)
                draw.one(center[0], center[1], center[2], i, j, buf);
    },
    line: function(br, x0, y0, x1, y1, buf) {
        draw.one(br[0][0], br[0][1], br[0][2], x0, y0, buf);
        if (x0 !== x1) {
            for (var i = x0 + 1; i < x1; i++)
                draw.one(br[1][0], br[1][1], br[1][2], i, y0, buf);
        } else if (y0 !== y1) {
            for (var i = y0 + 1; i < y1; i++)
                draw.one(br[1][0], br[1][1], br[1][2], x0, i, buf);
        }
        draw.one(br[2][0], br[2][1], br[2][2], x1, y1, buf);
    }
};

var context = {
    create: function(canvas) {
        var ctx = {
            canvas: canvas,
            buffer: buffer.create(canvas.width, canvas.height)
        };
        buffer.clear(chars.null, null, colors.black, ctx.buffer);
        return ctx;
    },
    render: function(ctx) {
        var pixels = ctx.canvas.pixels;
        for (var i = 0; i < ctx.buffer.size; i++) {
            pixels[i].innerText = ctx.buffer.chars[i];
            pixels[i].style.color = ctx.buffer.fores[i];
            pixels[i].style.background = ctx.buffer.backs[i];
        }
    }
};

var drawHpBar = function(name, hp, y, buf) {
    draw.text(name, null, null, 0.5, y, buf);
    var barX0 = Math.floor(name.length / 2) + 1;
    draw.line(brush.line.fill(null, null, 'gray'), barX0, y, buf.width-1, y, buf);
    draw.line(brush.line.fill(null, null, 'steelblue'), barX0, y, buf.width - 1 - (buf.width - 1) * (1 - (hp[0] / hp[1])), y, buf);
    var shp = hp[0] + '/' + hp[1];
    draw.text(shp, 'white', null, buf.width - 1 - (shp.length / 2)+0.5, y, buf);
};

var drawArmsHpBar = function(lhp, rhp, y, buf) {
    draw.text('Arm', null, null, 0, y, buf);
    draw.wideText('L', null, null, 2, y, buf);
    draw.line(brush.line.fill(null, null, 'grey'), 3, y, 8, y, buf);
    draw.line(brush.line.fill(null, null, 'steelblue'), 3, y, 8 - 8 * (1 - lhp[0] / lhp[1]), y, buf);
    var slhp = lhp[0] + '/' + lhp[1];
    draw.text(slhp, 'white', null, 8 - (slhp.length / 2) + 0.5, y, buf);

    draw.wideText('R', null, null, 9, y, buf);
    draw.line(brush.line.fill(null, null, 'grey'), 10, y, 15, y, buf);
    draw.line(brush.line.fill(null, null, 'steelblue'), 10, y, 15 - 15 * (1 - rhp[0] / rhp[1]), y, buf);
    var srhp = rhp[0] + '/' + rhp[1];
    draw.text(srhp, 'white', null, 15 - (srhp.length / 2) + 0.5, y, buf);
};

var drawLegHpBar = function(hp, y, buf) {
    draw.text('Leg', null, null, 1, y, buf);
    var barX0 = 3;
    draw.line(brush.line.fill(null, null, 'gray'), barX0, y, buf.width-1, y, buf);
    draw.line(brush.line.fill(null, null, 'steelblue'), barX0, y, buf.width - 1 - (buf.width - 1) * (1 - (hp[0] / hp[1])), y, buf);
    var shp = hp[0] + '/' + hp[1];
    draw.text(shp, 'white', null, buf.width - 1 - (shp.length / 2)+0.5, y, buf);
};

var drawWanzerStats = function(state) {
    draw.one(state.wanzer.pilot.alias[0], state.wanzer.pilot.alias[1], state.wanzer.pilot.alias[2], 0, 0, state.ui);
    draw.text(state.wanzer.pilot.name, null, null, 1.5, 0, state.ui);

    drawHpBar('Body', state.wanzer.bodyHp, 1, state.ui);
    drawArmsHpBar(state.wanzer.larmHp, state.wanzer.rarmHp, 2, state.ui);
    drawLegHpBar(state.wanzer.leg, 3, state.ui);
};

window.onload = function() {
    var canvas = createCanvas(64, 36);
    document.body.appendChild(canvas.display);

    var ctx = context.create(canvas);

    var state = {};

    var init = function() {

        state.world = buffer.create(20, 20);

        state.middotBrush = brush.rect.fill(chars.middot, 'white', 'black');
        state.diezOutlineBrush = brush.rect.outline('#', 'white', 'black');

        state.doubleBrush = brush.rect.double('white', 'black');

        state.cursor = {
            position: [10, 10]
        };

        state.camera = {
            position: [0, 0],
            size: [20, 20]
        };

        state.wanzer = {
            position: [9, 9],
            bodyHp: [330, 579],
            rarmHp: [60, 295],
            larmHp: [295, 295],
            leg: [400, 440],
            pilot: {
                alias: ['KT', 'pink', null],
                name: 'Kazuki Takemura'
            }
        };

        state.ui = buffer.create(16, 34);
        state.uiLineBrush = brush.line.fill('║ ', 'white', null);
    };
    
    document.body.addEventListener('keypress', function(ev) {
        switch (ev.code) {
            case 'KeyW': state.cursor.position[1]--; break;
            case 'KeyA': state.cursor.position[0]--; break;
            case 'KeyS': state.cursor.position[1]++; break;
            case 'KeyD': state.cursor.position[0]++; break;
        }
    });

    var onUpdate = function() {

    };

    var onDraw = function() {
        draw.rect(state.doubleBrush, 0, 0, canvas.width, canvas.height, ctx.buffer);

        draw.fill(chars.null, null, 'black', state.world);

        draw.rect(brush.rect.fill(chars.middot, 'gray', null), 0, 0, state.world.width, state.world.height, state.world);
        draw.rect(state.diezOutlineBrush, 0, 0, state.world.width, state.world.height, state.world);

        draw.one(chars.null, null, 'gray', state.cursor.position[0], state.cursor.position[1], state.world);
        
        draw.one(state.wanzer.pilot.alias, 'pink', null, state.wanzer.position[0], state.wanzer.position[1], state.world);

        buffer.copy(
            state.camera.size[0],
            state.camera.size[1],
            state.camera.position[0], state.camera.position[1], state.world,
            1, 1, ctx.buffer);

        buffer.copy(
            state.camera.size[0],
            state.camera.size[1],
            state.camera.position[0], state.camera.position[1], state.world,
            25, 1, ctx.buffer);

        draw.one('╦═', null, null, canvas.width - 18, 0, ctx.buffer);
        draw.one('╩═', null, null, canvas.width - 18, canvas.height - 1, ctx.buffer);
        draw.line(state.uiLineBrush, canvas.width - 18, 1, canvas.width - 18, canvas.height - 2, ctx.buffer);

        draw.fill(chars.null, 'white', 'black', state.ui);

        if (state.cursor.position[0] == state.wanzer.position[0] &&
            state.cursor.position[1] == state.wanzer.position[1]) {

            drawWanzerStats(state);
        }

        buffer.copy(
            state.ui.width,
            state.ui.height,
            0, 0, state.ui,
            canvas.width - 17, 1, ctx.buffer);
        
        context.render(ctx);
    };

    init();
    requestAnimationFrame(function on() {
        onUpdate();
        buffer.clear(chars.null, null, 'black', ctx.buffer);
        onDraw();
        requestAnimationFrame(on);
    });
};
