io.stdout:setvbuf("no")

require("plane")
require("water")
require("enemy")

_ = require("underscore")
nessy = require("nessy")
task = nessy.task

camera = { x = 0, y = 0 }

function love.load()

	new(Plane)
	new(Water)

	for x = 50, nessy.viewport().width - 50, 24 do
		for y = 14, nessy.viewport().height - 200, 24 do
			local enemy = new(Enemy)
			enemy.bounds.center = nessy.point(x, y)
		end
	end

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
	--if nessy.debug then 
		love.graphics.print("FPS = " .. tostring(math.floor(1 / love.timer.getAverageDelta())), 20, 40)
		love.graphics.print("Entities = " .. tostring(#nessy.entities), 20, 60)
	--end
end

function love.update()

	_(nessy.entities):chain()
		:where(has("velocity"))
		:each(move)

	_(nessy.entities):chain()
		:where(has("update"))
		:each(update)

	previous = down("j")

	local collidables = _.where(nessy.entities, has("collision"))

	for _, left in pairs(collidables) do
		for _, right in pairs(collidables) do
			if 
				(left.collision.group == "bullets" and right.collision.group == "enemies") or
				(left.collision.group == "enemies" and right.collision.group == "bullets") then
					left.texture.debugColor = nil
					if left.bounds:intersects(right.bounds) then
						nessy.entities.remove(left)
					end
			end
		end
	end


end

function sortByZIndex(left, right)
	return left.zIndex < right.zIndex
end

function has(component)
	return function(entity)
		return entity[component] ~= nil
	end
end

local yield = false

--[[local test = task.recur(task.serial({
	task.delay(0.001),
	task.func(function() print("SEND") yield = true end)
}))()

local waiter = task.recur(task.serial({
	task.waitFor(function() return yield end),
	task.func(function() print("RECEIVE") yield = false end)
}))()]]

--[[local uber = task.recur(task.whenAny({
	task.serial({
		task.delay(0.001),
		task.func(function() print("SEND") yield = true end)		
	}),
	task.serial({
		task.waitFor(function() return yield end),
		task.func(function() print("RECEIVE") yield = false end)
	})
}))()]]

function update(entity)

	--print("update")

	--uber:update(love.timer.getDelta())

	--waiter:update(love.timer.getDelta())
	--test:update(love.timer.getDelta())

	entity:update(love.timer.getDelta())
end

function move(entity)
	entity.bounds.location = entity.bounds.location + (entity.velocity * love.timer.getDelta())
end