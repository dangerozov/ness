nessy = require("nessy")

Water = {
	sprites = {
		water = nessy.spritesheet("resources/water.png"):sprite()
	},
	zIndex = 0
}

function Water:ctor()

	self.bounds = nessy.viewport()

	self.texture = {
		sprite = Water.sprites.water,
		mode = "fill"
	}

	local howManyWillFit = (nessy.viewport().size / self.texture.sprite.bounds.size):map(math.ceil)
	local size = howManyWillFit * self.texture.sprite.bounds.size

	self.texture.bounds = nessy.rectangle(0, 0, size.x, size.y)
	self.texture.bounds.height = self.texture.bounds.height + self.texture.sprite.bounds.height
	
	self.update = scroll(self.texture, 48)
	
	nessy.entities.add(self)
end

function scroll(self, pixelsPerSecond)
	local pixelEvery = 1 / pixelsPerSecond
	local base = self.bounds.y

	local every = callEvery(pixelEvery, function()
		self.bounds.y = self.bounds.y + 1
		if self.bounds.y > base then self.bounds.y = base - self.sprite.bounds.height end
	end)

	return every
end
