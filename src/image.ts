declare let nessy;

export let getBounds = (image: HTMLImageElement) => ({
    x: 0,
    y: 0,
    width: image.width,
    height: image.height
});

export let render = (image: HTMLImageElement, canvas: any) => {
    nessy.graphics.drawImage(canvas, image, getBounds(image));
};
