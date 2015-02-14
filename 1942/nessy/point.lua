local Point = {
	match = function(self) return self.x, self.y end,
	__tostring = function(self) return string.format("{ x: %d y: %d }", self.x, self.y) end,
	__add = function(p1, p2) return nessy.point(p1.x + p2.x, p1.y + p2.y) end,
	__sub = function(p1, p2) return nessy.point(p1.x - p2.x, p1.y - p2.y) end
}

function point(x, y)
	local point = new(Point, {
		x = x or 0,
		y = y or 0
	})

	return point
end

return point