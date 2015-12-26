import graphics = require("./graphics");

export let getBounds = (image: HTMLImageElement) => ({
    x: 0,
    y: 0,
    width: image.width,
    height: image.height
});

export let render = (image: HTMLImageElement, canvas: any) => {
    graphics.drawImage(canvas, image, image.x, image.y);
};
