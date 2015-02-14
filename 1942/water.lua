nessy = require("nessy")

water = 
{
	zIndex = 0,
	textureName = "resources/water.png",
	bounds = {}
}

function initWater()
	water.texture = love.graphics.newImage(water.textureName)
	water.draw = nessy.draw("fill")
	water.update = scroll
	water.bounds = nessy.viewport()

	nessy.entities.add(water)
end

function drawFill(columns, rows)
	return function(entity)
		
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
