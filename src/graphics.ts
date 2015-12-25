import func = require("./func");

interface Rectangle {
    x: number,
    y: number,
    width: number,
    height: number
}

interface Graphics {
    clearRect: (canvas: HTMLCanvasElement, rect: Rectangle) => void;
    fillRect: (canvas: HTMLCanvasElement, rect: Rectangle) => void;
    strokeRect: (canvas: HTMLCanvasElement, rect: Rectangle) => void;
    fillText: (canvas: HTMLCanvasElement, text: string, x: number, y: number, maxWidth?: number) => void;
    strokeText: (canvas: HTMLCanvasElement, text: string, x: number, y: number, maxWidth?: number) => void;
    measureText: (canvas: HTMLCanvasElement, text: string) => TextMetrics;
    drawImage: (canvas: HTMLCanvasElement, image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number) => void;
    createPattern: (canvas: HTMLCanvasElement, image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, repetition: string) => CanvasPattern;
    save: (canvas: HTMLCanvasElement) => void;
    restore: (canvas: HTMLCanvasElement) => void;
    
    getBounds: (canvas: HTMLCanvasElement) => Rectangle;
    sandbox: (canvas: HTMLCanvasElement, callback: (canvas: HTMLCanvasElement) => void) => void;
    create: (bounds: { width: number, height: number }) => HTMLCanvasElement;
}

let graphics: any = { };

["clearRect", "fillRect", "strokeRect",
    "fillText", "strokeText", "measureText",
    "drawImage",
    "createPattern",
    "save", "restore"].forEach(name => {        
        var fn = (<{ [key: string]: any }>CanvasRenderingContext2D.prototype)[name];
        if (typeof fn === "undefined") throw "Not Found";
        graphics[name] = (canvas: any, ...args: any[]) => fn.call(canvas.getContext("2d"), ...args);
});

["clearRect", "fillRect", "strokeRect"].forEach(name => {
    graphics[name] = func.map(
        graphics[name],
        (func, canvas, rect) => func(canvas, rect.x, rect.y, rect.width, rect.height));
});

["fillText", "strokeText"].forEach(name => {
    graphics[name] = func.map(
        graphics[name],
        (func, canvas, text, point, maxWidth) => func(canvas, text, point.x, point.y, maxWidth));
});

graphics.getBounds = (canvas: HTMLCanvasElement) => ({
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
});

graphics.sandbox = (canvas: HTMLCanvasElement, callback: (canvas: HTMLCanvasElement) => void) => {
    graphics.save(canvas);
    callback(canvas);
    graphics.restore(canvas);
};

graphics.create = (bounds: { width: number, height: number }) => {
    let canvas = document.createElement("canvas");
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    return canvas;
};

export = <Graphics>graphics;

