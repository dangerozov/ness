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

function nessy.draw(mode)
	mode = mode or "scale";

	return function (entity)
		local textureWidth = entity.texture:getWidth()
		local textureHeight = entity.texture:getHeight()

		local scaleX = math.floor(entity.bounds.width / textureWidth)
		local scaleY = math.floor(entity.bounds.height / textureHeight)
		--print(tostring(scaleX) .. " x " .. tostring(scaleY))

		if mode == "fill" then
			--print("from " .. tostring(entity.bounds.x) .. " to " .. tostring(entity.bounds.x + scaleX * textureWidth) .. " step " .. tostring(textureWidth))
			for x = entity.bounds.x, entity.bounds.x + (scaleX - 1) * textureWidth, textureWidth do
				for y = entity.bounds.y,  entity.bounds.y + (scaleY - 1) * textureHeight, textureHeight do
					love.graphics.draw(entity.texture, x, y)
				end
			end

		elseif mode == "scale" then
			love.graphics.draw(entity.texture, entity.bounds.topLeft.x, entity.bounds.topLeft.y, 0, entity.bounds.width / textureWidth, entity.bounds.height / textureHeight)
		end		

		if nessy.debug then 
			nessy.drawRectangle(nessy.rectangle(entity.bounds.topLeft.x, entity.bounds.topLeft.y, textureWidth, textureHeight), "red")
			nessy.drawRectangle(nessy.rectangle(entity.bounds.topLeft.x, entity.bounds.topLeft.y, entity.bounds.width, entity.bounds.height), "green")
		end
	end
end

function nessy.drawRectangle(rect, color)
	love.graphics.setLineWidth(1)
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