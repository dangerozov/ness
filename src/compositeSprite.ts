import rectangle = require("./rectangle");
import array = require("./array");
import point = require("./point");

type Sprite = {
    position: { x: number, y: number }
};

type CompositeSprite<T> = {
    items: T[],
    position: { x: number, y: number },
    visible: boolean
}

type Rectangle = { x: number, y: number, width: number, height: number };

export let getBounds = <T>(sprite: CompositeSprite<T>, getItemBounds: (item: T) => Rectangle) => {
    var bounds = array.aggregate(
        sprite.items.map(getItemBounds),
        rectangle.join);

    bounds = rectangle.setTopLeft(bounds, sprite.position);
    return bounds;
}

export let render = <T extends Sprite>(compositeSprite: CompositeSprite<T>, canvas: any, renderItem: (item: T, canvas: any) => void) => {
    if (compositeSprite.visible) {
			compositeSprite.items.forEach(sprite => {
				var oldPosition = sprite.position;
				sprite.position = point.add(sprite.position, compositeSprite.position);
				renderItem(sprite, canvas);
				sprite.position = oldPosition;
			});
		}
}

