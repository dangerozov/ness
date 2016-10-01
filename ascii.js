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

var context = {
    create: function(canvas) {
        var size = canvas.width * canvas.height;
        var ctx = {
            canvas: canvas,
            buffer: {
                size: size,
                chars: new Array(size),
                foreColors: new Array(size),
                backColors: new Array(size)
            }
        };
        context.clear(colors.black, ctx);
        return ctx;
    },
    clear: function(color, ctx) {
        for (var i = 0; i < ctx.buffer.size; i++) {
            ctx.buffer.chars[i] = chars.null;
            ctx.buffer.foreColors[i] = color;
            ctx.buffer.backColors[i] = color
        }
    },
    render: function(ctx) {
        var pixels = ctx.canvas.pixels;
        for (var i = 0; i < ctx.buffer.size; i++) {
            pixels[i].innerText = ctx.buffer.chars[i];
            pixels[i].style.color = ctx.buffer.foreColors[i];
            pixels[i].style.background = ctx.buffer.backColors[i];
        }
    },
    write: function(char, fore, back, x, y, ctx) {
        var index = y * ctx.canvas.width + x;
        ctx.buffer.chars[index] = char || ctx.buffer.chars[index];
        ctx.buffer.foreColors[index] = fore || ctx.buffer.foreColors[index];
        ctx.buffer.backColors[index] = back || ctx.buffer.backColors[index];
    },
    writeLine: function(string, fore, back, x, y, ctx) {
        for (var i = 0; i < string.length; i++) {
            context.write(string[i], fore, back, x + i, y, ctx);
        }
    },
    drawRect: function(fore, back, x, y, width, height, ctx) {
        var x0 = x, y0 = y, x1 = x + width - 1, y1 = y + height - 1;

        context.write(chars.null + '╔', fore, back, x0, y0, ctx);
        context.write('╗' + chars.null, fore, back, x1, y0, ctx);
        context.write('╝' + chars.null, fore, back, x1, y1, ctx);
        context.write(chars.null + '╚', fore, back, x0, y1, ctx);

        for (var i = x + 1; i < x1; i++) {
            context.write('══', fore, back, i, y0, ctx);
            context.write('══', fore, back, i, y1, ctx);
        }
        
        for (var i = y + 1; i < y1; i++) {
            context.write(chars.null + '║', fore, back, x0, i, ctx);
            context.write('║' + chars.null, fore, back, x1, i, ctx);
        }
    },
    drawRect2: function(char, fore, back, x, y, width, height, ctx) {
        var x0 = x, y0 = y, x1 = x + width - 1, y1 = y + height - 1;

        context.write(char, fore, back, x0, y0, ctx);
        context.write(char, fore, back, x1, y0, ctx);
        context.write(char, fore, back, x1, y1, ctx);
        context.write(char, fore, back, x0, y1, ctx);

        for (var i = x + 1; i < x1; i++) {
            context.write(char, fore, back, i, y0, ctx);
            context.write(char, fore, back, i, y1, ctx);
        }
        
        for (var i = y + 1; i < y1; i++) {
            context.write(char, fore, back, x0, i, ctx);
            context.write(char, fore, back, x1, i, ctx);
        }
    },
    fillRect: function(char, fore, back, x, y, width, height, ctx) {
        var x0 = x, y0 = y, x1 = x + width, y1 = y + height;
        for (var i = x; i < x1; i++)
            for (var j = y; j < y1; j++)
                context.write(char, fore, back, i, j, ctx);
    }
};

var html = function(s) { return s.replace(/ /g, chars.null); };
var makeEven = function(s) { return s.length % 2 !== 0 ? s += chars.null : s; };

var splitText = function(text, n) {
    var result = [];
    var s = '';
    for (var i = 0; i < text.length; i++) {
        s += text[i];
        if (s.length == n) { 
            result.push(s); s = '';
        }
    }
    return result;
};

var toCodes = function(s) {
    var result = [];
    for (var i = 0; i < s.length; i++) {
        result.push(s.charCodeAt(i));
    }
    return result;
}

window.onload = function() {
    var canvas = createCanvas(64, 36);
    document.body.appendChild(canvas.display);

    var ctx = context.create(canvas);
    context.clear(colors.black, ctx);
    context.drawRect('white', null, 0, 0, canvas.width, canvas.height, ctx);
    context.render(ctx);

    var x = Math.floor(canvas.width / 2 - 'ASCII'.length / 2);
    var y = 0;

    setInterval(function on() {
        y++; if (y >= canvas.height - 1) y = 1;

        context.clear(colors.black, ctx);

        context.fillRect(null, null, 'purple', 5, 10, 50, 50, ctx);

        context.writeLine(html('With interval'), 'lightblue', null, x, y, ctx);
        context.writeLine(splitText(makeEven(html('Text without interval')), 2), 'lightblue', null, x, y + 1, ctx);

        context.fillRect(chars.middot, 'white', 'blue', 3, 3, 5, 5, ctx);
        context.drawRect2('#', 'white', 'green', 3, 3, 5, 5, ctx);

        context.drawRect('white', 'black', 0, 0, canvas.width, canvas.height, ctx);

        context.render(ctx);
    }, 1000);
};
