import func = require("./func");

interface Rectangle {
    x: number,
    y: number,
    width: number,
    height: number
}

interface Graphics {
    clearRect: (canvas: CanvasRenderingContext2D, rect: Rectangle) => void;
    fillRect: (canvas: CanvasRenderingContext2D, rect: Rectangle) => void;
    strokeRect: (canvas: CanvasRenderingContext2D, rect: Rectangle) => void;
    fillText: (canvas: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth?: number) => void;
    strokeText: (canvas: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth?: number) => void;
    measureText: (canvas: CanvasRenderingContext2D, text: string) => TextMetrics;
    drawImage: (canvas: CanvasRenderingContext2D, image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number) => void;
    createPattern: (canvas: CanvasRenderingContext2D, image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, repetition: string) => CanvasPattern;
    save: (canvas: CanvasRenderingContext2D) => void;
    restore: (canvas: CanvasRenderingContext2D) => void;
    
    getBounds: (canvas: HTMLCanvasElement) => Rectangle;
    sandbox: (canvas: CanvasRenderingContext2D, callback: (canvas: CanvasRenderingContext2D) => void) => void;
    create: (bounds: { width: number, height: number }) => HTMLCanvasElement & { context: CanvasRenderingContext2D };
    
    init: (host: any, bounds: { width: number, height: number }) => any;
}

let graphics: any = { };

["clearRect", "fillRect", "strokeRect",
    "fillText", "strokeText", "measureText",
    "drawImage",
    "createPattern",
    "save", "restore"].forEach(name => {        
        var fn = (<{ [key: string]: any }>CanvasRenderingContext2D.prototype)[name];
        if (typeof fn === "undefined") throw "Not Found";
        graphics[name] = (context: CanvasRenderingContext2D, ...args: any[]) =>
            fn.call(context, ...args);
});

["clearRect", "fillRect", "strokeRect"].forEach(name => {
    graphics[name] = func.map(
        graphics[name],
        (func, context, rect) => func(context, rect.x, rect.y, rect.width, rect.height));
});

["fillText", "strokeText"].forEach(name => {
    graphics[name] = func.map(
        graphics[name],
        (func, context, text, point, maxWidth) => func(context, text, point.x, point.y, maxWidth));
});

graphics.getBounds = (canvas: HTMLCanvasElement) => ({
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
});

graphics.sandbox = (context: CanvasRenderingContext2D, callback: (context: CanvasRenderingContext2D) => void) => {
    graphics.save(context);
    callback(context);
    graphics.restore(context);
};

graphics.create = (bounds: { width: number, height: number }) => {
    let canvas = <HTMLCanvasElement & { context: CanvasRenderingContext2D }>document.createElement("canvas");
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    canvas.context = canvas.getContext("2d");
    return canvas;
};

graphics.init = (host: any, bounds: { width: number, height: number }) => {
    let cnv: HTMLCanvasElement = graphics.create(bounds);
    let div = document.createElement("div");
    div.appendChild(cnv);
    document.body.appendChild(div);    
    
    let self = {
        host: host,
        width: bounds.width,
        height: bounds.height,
        canvas: cnv,
        context: cnv.getContext("2d"),
        draw: () => graphics.clearRect(self.context, graphics.getBounds(self.canvas))        
    }
    
    return self;
};

export = <Graphics>graphics;

