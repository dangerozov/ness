let charCodes = {
    ' ': ' '.charCodeAt(0),
    dot: '.'.charCodeAt(0),
    newLine: '\n'.charCodeAt(0),
    nbsp: 255
};

let colors = {
    black: 'black',
    red: 'red',
    aliceblue: 'aliceblue',
    gray: 'gray'
};

let createCanvas = (width, height) => {
    let pixels = new Array(width * height);
    for (let i = 0; i < pixels.length; i++) {
        pixels[i] = document.createElement('span');
    }

    let div = document.createElement('div');
    div.style.fontFamily = 'monospace';
    for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {
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

let context = {
    create: (canvas) => {
        let size = canvas.width * canvas.height;
        let ctx = {
            canvas: canvas,
            buffer: {
                size: size,
                chars: new Array(size),
                foreColors: new Array(size),
                backColors: new Array(size)
            }
        };
        context.clear(ctx);
        return ctx;
    },
    clear: (ctx, color) => {
        for (let i = 0; i < ctx.buffer.size; i++) {
            ctx.buffer.chars[i] = charCodes.dot;
            ctx.buffer.foreColors[i] = color;
            ctx.buffer.backColors[i] = color
        }
    },
    render: (ctx) => {
        let pixels = ctx.canvas.pixels;
        for (let i = 0; i < ctx.buffer.size; i++) {
            pixels[i].innerText = String.fromCharCode(ctx.buffer.chars[i]);
            pixels[i].style.color = ctx.buffer.foreColors[i];
            pixels[i].style.background = ctx.buffer.backColors[i];
        }
    },
    write: (ctx, char, x, y, fore, back) => {
        let index = y * ctx.canvas.width + x;
        ctx.buffer.chars[index] = typeof char === 'string' ? char.charCodeAt(0) : char;
        ctx.buffer.foreColors[index] = fore || ctx.buffer.foreColors[index];
        ctx.buffer.backColors[index] = back || ctx.buffer.backColors[index];
    },
    writeLine: (ctx, line, x, y, fore, back) => {
        for (let i = 0; i < line.length; i++) {
            context.write(ctx, line[i], x + i, y, fore, back);
        }
    },
    drawRect: (ctx, x, y, width, height, color) => {
        let x0 = x, y0 = y, x1 = x + width - 1, y1 = y + height - 1;

        context.write(ctx, '╔', x0, y0, color);
        context.write(ctx, '╗', x1, y0, color);
        context.write(ctx, '╝', x1, y1, color);
        context.write(ctx, '╚', x0, y1, color);

        for (let i = x + 1; i < x1; i++) {
            context.write(ctx, '═', i, y0, color);
            context.write(ctx, '═', i, y1, color);
        }
        
        for (let i = y + 1; i < y1; i++) {
            context.write(ctx, '║', x0, i, color);
            context.write(ctx, '║', x1, i, color);
        }
    }
};

window.onload = () => {
    let canvas = createCanvas(80, 25);
    document.body.appendChild(canvas.display);

    let ctx = context.create(canvas);
    context.clear(ctx, colors.black);
    context.drawRect(ctx, 0, 0, canvas.width, canvas.height, 'white');
    context.render(ctx);

    let x = Math.floor(canvas.width / 2 - 'ASCII'.length / 2);
    let y = 0;

    setInterval(function on() {
        y++; if (y >= canvas.height - 1) y = 1;

        context.clear(ctx, colors.black);
        context.drawRect(ctx, 0, 0, canvas.width, canvas.height, 'white');
        context.writeLine(ctx, 'ASCII', x, y, 'lightblue');

        context.render(ctx);
    }, 1000);
};
