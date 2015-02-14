io.stdout:setvbuf("no")

require("entities")
require("plane")
require("water")

_ = require("underscore")
nessy = require("nessy")

camera = { x = 0, y = 0 }
screen = nessy.rectangle(0, 0, 512, 512)

function love.load()
	nessy.debug = true

	--assert(false, tostring(screen.width))
	love.window.setMode(screen.width, screen.height)

	new(Plane):init()

	initWater()

	bulletTexture = love.graphics.newImage("resources/bullet.png")

end

function love.keypressed(key)
	if key == "`" then nessy.debug = not nessy.debug end
end

function love.draw()
	--love.graphics.translate(camera.x + screen.width / 2, camera.y + screen.height / 2)

	_(entities):chain()
		:where(has("texture"))
		:sort(function(ent1, ent2) return ent1.zIndex < ent2.zIndex end)
		:each(draw)

	drawPrint("Entities = " .. tostring(#entities), 100, 50)
	drawPrint(tostring(screen:center().x), 0, 50)
end

function draw(entity)
	entity:draw()
end

function drawPrint(msg, x, y)
	love.graphics.print(msg, x, y)
end

function love.update()

	_(entities):chain()
		:where(has("velocity"))
		:each(move)

	_(entities):chain()
		:where(has("update"))
		:each(update)

	scroll()

	previous = down("j")
end

function update(entity)
	entity:update()
end

function move(entity)

	local x, y = (entity.bounds:topLeft() + entity.velocity):match();

	entity.bounds.x = x
	entity.bounds.y = y
end