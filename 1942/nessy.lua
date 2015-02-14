local nessy = {
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

function nessy.draw(entity)

	local x, y = entity.bounds.topLeft:match()
	-- nessy.toScreen(entity.bounds:topLeft()):match()	

	

	if nessy.debug then 
		nessy.drawRectangle(nessy.rectangle(x, y, entity.texture:getWidth(), entity.texture:getHeight()), "red")
		nessy.drawRectangle(nessy.rectangle(x, y, entity.bounds.width, entity.bounds.height), "green")
	end

	love.graphics.draw(entity.texture, x, y)
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

local Point = {
	match = function(self) return self.x, self.y end,
	__tostring = function(self) return string.format("{ x: %d y: %d }", self.x, self.y) end,
	__add = function(p1, p2) return nessy.point(p1.x + p2.x, p1.y + p2.y) end,
	__sub = function(p1, p2) return nessy.point(p1.x - p2.x, p1.y - p2.y) end
}

function nessy.point(x, y)
	x = x or 0
	y = y or 0

	local point = new(Point, {
		x = x,
		y = y	
	})

	return point
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

function log(o)
	print(o)
	for k,v in pairs(o) do
		print(tostring(k) .. tostring(" = ") .. tostring(v))
	end
end

function string.starts(self, value)
   return string.sub(self, 1, string.len(value)) == value
end

return nessy