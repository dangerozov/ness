nessy = require("nessy")

water = 
{
	zIndex = 0,
	textureName = "resources/water.png",
	bounds = {}
}

function initWater()

	water.bounds = nessy.viewport()

	water.texture = {
		image = nessy.image(water.textureName),
		mode = "fill"
	}

	local howManyWillFit = (nessy.viewport().size / water.texture.image.bounds.size):map(math.ceil)
	local size = howManyWillFit * water.texture.image.bounds.size

	water.texture.bounds = nessy.rectangle(0, 0, size.x, size.y)
	water.texture.bounds.height = water.texture.bounds.height + water.texture.image.bounds.height
	
	water.update = scroll(water.texture, 48)
	
	nessy.entities.add(water)
end

function scroll(self, pixelsPerSecond)
	local pixelEvery = 1 / pixelsPerSecond
	local base = self.bounds.y

	local every = callEvery(pixelEvery, function()
		self.bounds.y = self.bounds.y + 1
		if self.bounds.y > base then self.bounds.y = base - self.image.bounds.height end
	end)

	return every
end
