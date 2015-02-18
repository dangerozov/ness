local Rectangle = {}

function Rectangle:gs_left(value)
	if value ~= nil then self.x = value end
	return self.x
end

function Rectangle:gs_right(value)
	if value ~= nil then self.x = value - self.width end
	return self.x + self.width
end

function Rectangle:gs_top(value)
	if value ~= nil then self.y = value end
	return self.y 	
end

function Rectangle:gs_bottom(value)
	if value ~= nil then self.y = value - self.height end
	return self.y + self.height
end

function Rectangle:gs_size(value)
	if value ~= nil then
		self.width = value.x
		self.height = value.y
	end
	return nessy.point(self.width, self.height)
end

function Rectangle:gs_location(value)
	self:set("location", value)
	return nessy.point(self.left, self.top)
end

function Rectangle:gs_topCenter(value)
	self:set("topCenter", value)
	return nessy.point(self.center.x, self.top)
end

function Rectangle:gs_topRight(value)
	self:set("topRight", value)
	return nessy.point(self.right, self.top)
end

function Rectangle:gs_middleLeft(value)
	self:set("middleLeft", value)
	return nessy.point(self.left, self.center.y)
end

function Rectangle:gs_center(value)
	self:set("center", value)
	return nessy.point(self.x + self.width / 2, self.y + self.height / 2)
end

function Rectangle:gs_middleRight(value)
	self:set("middleRight", value)
	return nessy.point(self.right, self.center.y)
end

function Rectangle:gs_bottomLeft(value)
	self:set("bottomLeft", value)
	return nessy.point(self.left, self.bottom)
end

function Rectangle:gs_bottomCenter(value)
	self:set("bottomCenter", value)
	return nessy.point(self.center.x, self.bottom)
end

function Rectangle:gs_bottomRight(value)
	self:set("bottomRight", value)
	return nessy.point(self.right, self.bottom)
end

function Rectangle:set(anchor, point)
	if point ~= nil then 
		local offset = point - self[anchor]
		self.x = self.x + offset.x
		self.y = self.y + offset.y
	end
end

function Rectangle:unpack()
	return self.x, self.y, self.width, self.height
end

function Rectangle:copy()
	return nessy.rectangle(self.x, self.y, self.width, self.height)
end

function Rectangle:draw(color)
	local x, y, width, height = self:unpack()

	local r, g, b, a = love.graphics.getColor()
	love.graphics.setColor(nessy.color(color))
	love.graphics.rectangle("line", x, y, width, height)
	love.graphics.setColor(r, g, b, a)
end

function Rectangle:__tostring() 
	return string.format("{ x: %d y: %d w: %d h: %d }", self.x, self.y, self.width, self.height)
end

function rectangle(x, y, width, height)
	local rectangle = new(Rectangle, {
		x = x or 0,
		y = y or 0,
		width = width or 0,
		height = height or 0
	})

	return rectangle
end

return rectangle