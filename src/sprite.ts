declare let nessy: any;

export interface Sprite {
    image: HTMLImageElement;
    position: { x:number, y: number };
    visible: boolean;
};

export let getBounds = (sprite: Sprite) => ({
    x: sprite.position.x,
    y: sprite.position.y,
    width: sprite.image.width,
    height: sprite.image.height
});

export let render = (sprite: Sprite, canvas: any) => {
    if (sprite.visible) {
        nessy.graphics.drawImage(canvas, sprite.image, sprite.position.x, sprite.position.y);
    }
};