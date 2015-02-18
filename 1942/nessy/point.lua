local Point = {
	__tostring = function(self) return string.format("{ x: %d y: %d }", self.x, self.y) end,

	__add = function(p1, p2)
		if type(p2) == "number" then
			return nessy.point(p1.x + p2, p1.y + p2)
		else
			return nessy.point(p1.x + p2.x, p1.y + p2.y)
		end
	end,

	__sub = function(p1, p2) 
		if type(p2) == "number" then
			return nessy.point(p1.x - p2, p1.y - p2)
		else
			return nessy.point(p1.x - p2.x, p1.y - p2.y)
		end
	end,

	__div = function(p1, p2)
		if type(p2) == "number" then
			return nessy.point(p1.x / p2, p1.y / p2)
		else
			return nessy.point(p1.x / p2.x, p1.y / p2.y)
		end
	end,

	__mul = function(p1, p2)
		if type(p2) == "number" then
			return nessy.point(p1.x * p2, p1.y * p2)
		else
			return nessy.point(p1.x * p2.x, p1.y * p2.y)
		end
	end
}

function Point:unpack()
	return self.x, self.y
end

function Point:map(func)
	return nessy.point(func(self.x), func(self.y))
end

function point(x, y)
	local point = new(Point, {
		x = x or 0,
		y = y or 0
	})

	return point
end

return point