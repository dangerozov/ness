io.stdout:setvbuf("no")

require("plane")
require("water")

_ = require("underscore")
nessy = require("nessy")

camera = { x = 0, y = 0 }

function love.load()

	new(Plane):init()

	initWater()
end

function love.keypressed(key)
	if key == "`" then nessy.debug = not nessy.debug end
end

function love.draw()
	_(nessy.entities):chain()
		:where(has("texture"))
		:sort(function(ent1, ent2) return ent1.zIndex < ent2.zIndex end)
		:each(nessy.draw)

	love.graphics.print("FPS = " .. tostring(math.floor(1 / love.timer.getAverageDelta())), 20, 20)
	love.graphics.print("Entities = " .. tostring(#nessy.entities), 20, 40)
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
	entity.bounds.topLeft = entity.bounds.topLeft + entity.velocity
end