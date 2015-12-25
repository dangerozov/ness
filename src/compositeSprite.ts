import rectangle = require("./rectangle");
import array = require("./array");
import point = require("./point");

export interface Sprite {
    position: { x: number, y: number };
}

export interface CompositeSprite<T> {
    items: T[];
    position: { x: number, y: number };
    visible: boolean;
}

export let getBounds = <T>(sprite: CompositeSprite<T>, getItemBounds: (item: T) => rectangle.Rectangle) => {
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

