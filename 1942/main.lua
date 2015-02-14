io.stdout:setvbuf("no")

require("plane")
require("water")

_ = require("underscore")
nessy = require("nessy")

camera = { x = 0, y = 0 }
screen = nessy.rectangle(0, 0, 512, 512)

function love.load()
	nessy.debug = true

	love.window.setMode(screen.width, screen.height)

	new(Plane):init()

	initWater()

	bulletTexture = love.graphics.newImage("resources/bullet.png")

end

function love.keypressed(key)
	if key == "`" then nessy.debug = not nessy.debug end
end

function love.draw()
	_(nessy.entities):chain()
		:where(has("texture"))
		:sort(function(ent1, ent2) return ent1.zIndex < ent2.zIndex end)
		:each(draw)

	drawPrint("Entities = " .. tostring(#nessy.entities), 20, 20)
end

function draw(entity)
	entity:draw()
end

function drawPrint(msg, x, y)
	love.graphics.print(msg, x, y)
end

function love.update()

	_(nessy.entities):chain()
		:where(has("velocity"))
		:each(move)

	_(nessy.entities):chain()
		:where(has("update"))
		:each(update)

	scroll()

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