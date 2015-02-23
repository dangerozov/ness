nessy = require("nessy")

local enemies = nessy.spritesheet("resources/enemies.png")

Enemy = {
	sprites = {
		grey = {
			front = enemies:sprite(nessy.rectangle(0, 0, 14, 14)),
			back = enemies:sprite(nessy.rectangle(15, 0, 27, 13))
		}
	},
	zIndex = 1
}

function Enemy:ctor()
	self.texture = {
		sprite = Enemy.sprites.grey.front
	}

	self.bounds = self.texture.sprite.bounds:copy()
	self.bounds.center = nessy.viewport().center

	self.collision = {
		group = "enemies"
	}

	nessy.entities.add(self)
end