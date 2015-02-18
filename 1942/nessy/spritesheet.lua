local Sprite = {}

function Sprite:draw(point, scale)
	point = point or nessy.point()
	scale = scale or nessy.point(1, 1)

	local x, y = point:unpack()
	local sw, sh = scale:unpack()

	love.graphics.draw(self.spritesheet.raw, self.raw, x, y, 0, sw, sh)
end

local Spritesheet = {
	cache = {}
}

function Spritesheet:sprite(bounds)
	bounds = bounds or self.bounds
	local x, y, width, height = bounds:unpack()
	local sw, sh = self.bounds.size:unpack()

	local sprite = new(Sprite, {
		spritesheet = self,
		raw = love.graphics.newQuad(x, y, width, height, sw, sh),
		bounds = bounds:copy()
	})

	return sprite
end

function spritesheet(path)
	local raw = love.graphics.newImage(path)
	local spritesheet = new(Spritesheet, {
		raw = raw,
		bounds = nessy.rectangle(0, 0, raw:getWidth(), raw:getHeight())
	})

	return spritesheet
end

return spritesheet