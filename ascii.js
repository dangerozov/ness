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
        double: function(fore, back) {
            return [[['╔═', fore, back], ['══', fore, back], ['═╗', fore, back]],
                    [['║ ', fore, back], [null, null, null], [' ║', fore, back]],
                    [['╚═', fore, back], ['══', fore, back], ['═╝', fore, back]]]
        },
        fill: function(char, fore, back) {
            return [[[char, fore, back], [char, fore, back], [char, fore, back]],
                    [[char, fore, back], [char, fore, back], [char, fore, back]],
                    [[char, fore, back], [char, fore, back], [char, fore, back]]];
        },
        stroke: function(char, fore, back) {
            return [[[char, fore, back], [char, fore, back], [char, fore, back]],
                    [[char, fore, back], [null, null, null], [char, fore, back]],
                    [[char, fore, back], [char, fore, back], [char, fore, back]]];
        }
    },
    line: {
        create: function(leftChar, middleChar, rightChar, fore, back) {
            return [[leftChar, fore, back], [middleChar, fore, back], [rightChar, fore, back]];
        },
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
        span.style.textShadow = '0px 0px 8px';
        return span;
    };

    var createDiv = function() {
        var div = document.createElement('div');
        div.style.fontFamily = 'monospace';
        return div;
    };

    var findSpanWidth = function(length) {
        var div = document.body.appendChild(createDiv());        
        var span = div.appendChild(createSpan());        
        span.innerText = new Array(length + 1).join('1');
        var width = span.offsetWidth;
        document.body.removeChild(div);
        return width;
    };
    
    return function(width, height, charsPerPixel) {
        var spanWidth = findSpanWidth(charsPerPixel);

        var cssSpanWidth = spanWidth + 'px';
        var pixels = new Array(width * height);
        for (var i = 0; i < pixels.length; i++) {
            var span = createSpan();
            span.style.width = cssSpanWidth;
            pixels[i] = span;
        }

        var cssDivWidth = (width * spanWidth) + 'px';
        var div = createDiv();
        div.style.width = cssDivWidth;
        pixels.forEach(pixel => div.appendChild(pixel));       

        return {
            width: width,
            height: height,
            pixels: pixels,
            charsPerPixel: charsPerPixel,
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
        return buf;
    },
    set: function(char, fore, back, x, y, buf) {
        if (x < 0 || buf.width <= x ||
            y < 0 || buf.height <= y) return;
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
    }
};

var draw = {
    fill: function(br, ctx) {
        for (var x = 0; x < ctx.width; x++) {
            for (var y = 0; y < ctx.height; y++) {
                draw.one(br, x, y, ctx);
            }
        }
    },
    one: function(br, x, y, ctx) {
        var ch = buffer.getChar(x, y, ctx.buffer);
        var fo = buffer.getFore(x, y, ctx.buffer);
        var ba = buffer.getBack(x, y, ctx.buffer);
        buffer.set(br[0] || ch, br[1] || fo, br[2] || ba, x, y, ctx.buffer);
    },
    text: (function() {
        var temp = [null, null, null];

        return function(br, x, y, ctx) {
            temp[1] = br[1];
            temp[2] = br[2];

            var str = br[0];

            var spacesToAdd = str.length % ctx.charsPerPixel;
            spacesToAdd = spacesToAdd === 0 ? 0 : ctx.charsPerPixel - spacesToAdd;
            for (var i = 0; i < spacesToAdd; i++) str += ' ';
            
            var groups = str.length / ctx.charsPerPixel;
            for (var i = 0; i < groups; i++, x++) {
                var group = '';
                for (var j = 0; j < ctx.charsPerPixel; j++) {
                    var char = str[i * ctx.charsPerPixel + j];
                    char = char === ' ' ? chars.null : char;

                    group += char;
                }

                temp[0] = group;
                draw.one(temp, x, y, ctx);
            }
        };
    })(),
    wideText: (function() {
        var temp = [null, null, null];
        
        return function(s, fore, back, x, y, buf) {
            temp[1] = fore;
            temp[2] = back;

            for (var i = 0; i < s.length; i++) {
                var char = s[i];
                char = char === ' ' ? chars.null : char;

                temp[0] = char;
                draw.one(temp, x + i, y, buf);
            }
        };
    })(),
    rect: function(br, x, y, width, height, ctx) {
        var x0 = x, y0 = y, x1 = x + width - 1, y1 = y + height - 1;
        
        draw.one(br[0][0], x0, y0, ctx);
        draw.one(br[2][0], x0, y1, ctx);
        draw.one(br[0][2], x1, y0, ctx);
        draw.one(br[2][2], x1, y1, ctx);

        for (var i = x + 1; i < x1; i++) {
            draw.one(br[0][1], i, y0, ctx);
            draw.one(br[2][1], i, y1, ctx);
        }
        
        for (var i = y + 1; i < y1; i++) {
            draw.one(br[1][0], x0, i, ctx);
            draw.one(br[1][2], x1, i, ctx);
        }

        for (var i = x + 1; i < x1; i++)
            for (var j = y + 1; j < y1; j++)
                draw.one(br[1][1], i, j, ctx);
    },
    line: function(br, x0, y0, x1, y1, ctx) {
        draw.one(br[0], x0, y0, ctx);
        if (x0 !== x1) {
            for (var i = x0 + 1; i < x1; i++)
                draw.one(br[1], i, y0, ctx);
        } else if (y0 !== y1) {
            for (var i = y0 + 1; i < y1; i++)
                draw.one(br[1], x0, i, ctx);
        }
        draw.one(br[2], x1, y1, ctx);
    },
    clear: function(char, fore, back,ctx) {
        for (var i = 0; i < ctx.buffer.size; i++) {
            ctx.buffer.chars[i] = char;
            ctx.buffer.fores[i] = fore;
            ctx.buffer.backs[i] = back;
        }
    }
};

var context = {
    create: function(canvas) {
        var ctx = {
            canvas: canvas,
            buffer: buffer.create(canvas.width, canvas.height),
            width: canvas.width,
            height: canvas.height,
            charsPerPixel: canvas.charsPerPixel
        };
        
        draw.clear(chars.null, null, colors.black, ctx);
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

var drawHpBar = function(state, hp, x, y, ctx) {
    draw.text(state.wanzer.bodyBrush, x, y, ctx);
    var barX0 = Math.floor(state.wanzer.bodyBrush[0].length / 2) + 1;
    draw.line(state.grayLineBrush, x + barX0, y, x + 16-1, y, ctx);
    draw.line(state.blueLineBrush, x + barX0, y, x + 16 - 1 - (16 - 1) * (1 - (hp[0] / hp[1])), y, ctx);
    var shp = hp[0] + '/' + hp[1];
    state.wanzer.hpTextBrush[0] = shp;
    draw.text(state.wanzer.hpTextBrush, x + 16 - 1 - (shp.length / 2)+0.5, y, ctx);
};

var drawArmsHpBar = function(state, lhp, rhp, x, y, ctx) {
    draw.text(state.wanzer.armsBrush, x, y, ctx);
    draw.wideText('L', 'white', null, x + 2, y, ctx);
    draw.line(state.grayLineBrush, x + 3, y, x + 8, y, ctx);
    draw.line(state.blueLineBrush, x + 3, y, x + 8 - 8 * (1 - lhp[0] / lhp[1]), y, ctx);
    var slhp = lhp[0] + '/' + lhp[1];
    state.wanzer.hpTextBrush[0] = slhp;
    draw.text(state.wanzer.hpTextBrush, x + 8 - (slhp.length / 2) + 0.5, y, ctx);

    draw.wideText('R', 'white', null, x + 9, y, ctx);
    draw.line(state.grayLineBrush, x + 10, y, x + 15, y, ctx);
    draw.line(state.blueLineBrush, x + 10, y, x + 15 - 15 * (1 - rhp[0] / rhp[1]), y, ctx);
    var srhp = rhp[0] + '/' + rhp[1];
    state.wanzer.hpTextBrush[0] = srhp;
    draw.text(state.wanzer.hpTextBrush, x + 15 - (srhp.length / 2) + 0.5, y, ctx);
};

var drawLegsHpBar = function(state, hp, x, y, ctx) {
    draw.text(state.wanzer.legsBrush, x, y, ctx);
    var barX0 = 3;
    draw.line(state.grayLineBrush, x + barX0, y, x + 16-1, y, ctx);
    draw.line(state.blueLineBrush, x + barX0, y, x + 16 - 1 - (16 - 1) * (1 - (hp[0] / hp[1])), y, ctx);
    var shp = hp[0] + '/' + hp[1];
    state.wanzer.hpTextBrush[0] = shp;
    draw.text(state.wanzer.hpTextBrush, x + 16 - 1 - (shp.length / 2)+0.5, y, ctx);
};

var drawWanzerStats = function(x, y, state) {
    draw.one(state.wanzer.pilot.alias, x, y, state.ctx);
    draw.text(state.wanzer.pilot.name, x + 1, y + 0, state.ctx);

    drawHpBar(state, state.wanzer.bodyHp, x, y + 1, state.ctx);
    drawArmsHpBar(state, state.wanzer.larmHp, state.wanzer.rarmHp, x, y + 2, state.ctx);
    drawLegsHpBar(state, state.wanzer.legs, x, y + 3, state.ctx);
};

window.onload = function() {
    var canvas = createCanvas(64, 36, 2);
    document.body.appendChild(canvas.display);

    var state = {
        ctx: context.create(canvas)
    };

    var init = function() {

        state.middotBrush = brush.rect.fill(chars.middot, 'white', 'black');
        state.diezOutlineBrush = brush.rect.stroke('#', 'green', 'black');

        state.doubleBrush = brush.rect.double('white', 'black');

        state.cursor = {
            position: [25, 10],
            brush: [chars.null, null, 'gray']
        };

        state.camera = {
            position: [0, 0],
            size: [20, 20]
        };

        state.wanzer = {
            position: [24, 9],
            bodyBrush: [' Body', 'white', null],
            hpTextBrush: [null, 'white', null],
            bodyHp: [330, 579],
            armsBrush: ['Arm', 'white', null],
            rarmHp: [60, 295],
            larmHp: [295, 295],
            legsBrush: [' Legs', 'white', null],
            legs: [400, 440],
            pilot: {
                alias: ['KT', 'pink', null],
                name: [' Kazuki Takemura', 'white', null]
            }
        };

        state.uiLine = brush.line.create('╦═', '║ ', '╩═', 'white', null);

        state.blackBrush = [chars.null, null, 'black'];
        state.grayLineBrush = brush.line.fill(null, null, 'gray');
        state.blueLineBrush = brush.line.fill(null, null, 'steelblue');

        state.grayRect = brush.rect.fill(chars.middot, 'gray', null);

        state.textBrush = ['Welcome World', 'blue', null];
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
        draw.rect(state.doubleBrush, 0, 0, canvas.width, canvas.height, state.ctx);

        draw.rect(state.grayRect, 15, 1, 20, 20, state.ctx);
        draw.rect(state.diezOutlineBrush, 15, 1, 20, 20, state.ctx);

        draw.one(state.cursor.brush, state.cursor.position[0], state.cursor.position[1], state.ctx);
        
        draw.one(
            state.wanzer.pilot.alias,
            state.wanzer.position[0],
            state.wanzer.position[1],
            state.ctx);

        draw.text(state.textBrush, 18, 3, state.ctx);

        draw.line(state.uiLine, canvas.width - 18, 0, canvas.width - 18, canvas.height - 1, state.ctx);

        if (state.cursor.position[0] == state.wanzer.position[0] &&
            state.cursor.position[1] == state.wanzer.position[1]) {

            drawWanzerStats(state.ctx.width - 17, 1, state);
        }
        
        context.render(state.ctx);
    };

    init();
    requestAnimationFrame(function on() {
        onUpdate();
        draw.clear(chars.null, null, 'black', state.ctx);
        onDraw();
        requestAnimationFrame(on);
    });
};
