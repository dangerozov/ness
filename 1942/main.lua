io.stdout:setvbuf("no")

require("plane")
require("water")
require("enemy")

_ = require("underscore")
nessy = require("nessy")

camera = { x = 0, y = 0 }

function love.load()

	new(Plane)
	new(Water)

	local first = new(Enemy)
	local second = new(Enemy)
	second.bounds.bottomCenter = first.bounds.topCenter + nessy.point(0, -10)

	local third = new(Enemy)
	third.bounds.middleRight = second.bounds.middleLeft + nessy.point(-10, 0)

	local fourth = new(Enemy)
	fourth.bounds.middleLeft = second.bounds.middleRight + nessy.point(10, 0)

end

function love.keypressed(key)
	if key == "`" then nessy.debug = not nessy.debug end
end

function love.draw()
	_(nessy.entities):chain()
		:where(has("texture"))
		:sort(function(ent1, ent2) return ent1.zIndex < ent2.zIndex end)
		:each(nessy.draw)

	love.graphics.print("use: WASD + J + `", 20, 20)
	if nessy.debug then 
		love.graphics.print("FPS = " .. tostring(math.floor(1 / love.timer.getAverageDelta())), 20, 40)
		love.graphics.print("Entities = " .. tostring(#nessy.entities), 20, 60)
	end
end

function love.update()

	_(nessy.entities):chain()
		:where(has("velocity"))
		:each(move)

	_(nessy.entities):chain()
		:where(has("update"))
		:each(update)

	previous = down("j")
end

function sortByZIndex(left, right)
	return left.zIndex < right.zIndex
end

function has(component)
	return function(entity)
		return entity[component] ~= nil
	end
end

function update(entity)
	entity:update()
end

function move(entity)
	entity.bounds.location = entity.bounds.location + (entity.velocity * love.timer.getDelta())
end