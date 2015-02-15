local nessy = {
	entities = require("nessy.entities"),
	point = require("nessy.point"),
	rectangle = require("nessy.rectangle")
}

nessy.debug = false

function nessy.toScreen(point)
	return nessy.point(point.x, love.graphics.getHeight() - point.y)
end

function nessy.color(name)
	if name == "green" then return 0, 255, 0
	elseif name == "blue" then return 0, 0, 255
	elseif name == "red" then return 255, 0, 255
	elseif name == "white" then return 255, 255, 255
	elseif name == "gold" then return 0, 0, 0
	end
end

function nessy.image(path)
	local raw = love.graphics.newImage(path)
	local image = {
		raw = raw,
		bounds = nessy.rectangle(0, 0, raw:getWidth(), raw:getHeight())
	}

	return image
end

function nessy.draw(entity)
	local mode = entity.texture.mode or "scale"
	local source = entity.texture.image.bounds
	local target = (entity.texture.bounds or source):copy()
	target.topLeft = entity.bounds.topLeft + target.topLeft

	local scale = target.size / source.size

	if mode == "fill" then
		for x = target.x, target.x + (math.floor(scale.x) - 1) * source.width, source.width do
			for y = target.y,  target.y + (math.floor(scale.y) - 1) * source.height, source.height do
				love.graphics.draw(entity.texture.image.raw, x, y)
			end
		end

	elseif mode == "scale" then
		love.graphics.draw(entity.texture.image.raw, target.x, target.y, 0, scale.x, scale.y)
	end		

	if nessy.debug then 
		nessy.drawRectangle(nessy.rectangle(target.x, target.y, target.width, target.height), "red")
		nessy.drawRectangle(nessy.rectangle(entity.bounds.x, entity.bounds.y, entity.bounds.width, entity.bounds.height), "green")
	end
end

function nessy.drawRectangle(rect, color)
	love.graphics.setColor(nessy.color(color))
	love.graphics.rectangle("line", rect.x, rect.y, rect.width, rect.height)
	love.graphics.setColor(nessy.color("white"))
end

function nessy.viewport()
	return nessy.rectangle(0, 0, love.graphics.getWidth(), love.graphics.getHeight())
end

function new(parent, child)
	child = child or {}
	setmetatable(child, parent)

	parent.__index = function(self, field)
		local property = getDefault(self, field)

		if property == nil then
			local getter = getDefault(self, "gs_" .. field)
			if getter ~= nil then
		    	property = getter(self)
			end
		end

		return property
	end

	parent.__newindex = function(self, field, value)
		local setter = getDefault(self, "gs_" .. field)
		if setter ~= nil then
			setter(self, value)
		else
			rawset(self, field, value)
		end
	end

	return child
end

function getDefault(self, field)
	local meta = getmetatable(self)
	local value = rawget(self, field)

	return value == nil and rawget(meta, field) or value
end

function string.starts(self, value)
   return string.sub(self, 1, string.len(value)) == value
end

return nessy