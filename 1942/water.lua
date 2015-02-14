nessy = require("nessy")
require("entities")

water = 
{
	zIndex = 0,
	textureName = "resources/water.png",
	bounds = {}
}

function initWater()
	water.texture = love.graphics.newImage(water.textureName)
	water.draw = drawFill(
		screen.width / water.texture:getWidth(),
		screen.height / water.texture:getHeight() + 1)
	water.update = scroll

	water.bounds.x = 0
	water.bounds.y = -water.texture:getHeight()

	table.insert(entities, water)
end

function drawFill(columns, rows)
	return function(entity)
		local xStep = entity.texture:getWidth()
		local yStep = entity.texture:getHeight()

		for x = entity.bounds.x, columns * xStep, xStep do
			for y = entity.bounds.y, rows * yStep, yStep do
				love.graphics.draw(entity.texture, x, y)
			end
		end
	end
end

function scrollInternal(pixelsPerSecond)
	local delta = love.timer.getDelta()
	local offset = pixelsPerSecond * delta

	water.bounds.y = water.bounds.y + offset
	if water.bounds.y > 0 then water.bounds.y = -water.texture:getHeight() end
end

function scroll()
	scrollInternal(16)
end
