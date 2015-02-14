nessy = require("nessy")
require("entities")

Plane = {
	zIndex = 1,
	textureName = "resources/plane.png",
}

function Plane:init()
	self.texture = love.graphics.newImage(self.textureName)
	self.draw = drawTexture
	self.update = updatePlane

	self.bounds = nessy.rectangle(0, 0, self.texture:getWidth(), self.texture:getHeight())
	self.bounds.center = nessy.viewport().center

	self.weapon = {}
	self.weapon.maxBullets = 1
	self.weapon.bullets = 1
	self.weapon.reload = callEveryCheater(0.5, function() 
		self:reload()
	end)

	local viewport = nessy.viewport()
	self.screenBounds = nessy.rectangle(0, 0, viewport.width - 40, viewport.height - 40)
	self.screenBounds.center = viewport.center


	table.insert(entities, self)
end

function Plane:update()
	if down("a") then self.bounds.x = self.bounds.x - 10 end
	if down("d") then self.bounds.x = self.bounds.x + 10 end
	if down("w") then self.bounds.y = self.bounds.y - 10 end
	if down("s") then self.bounds.y = self.bounds.y + 10 end

	if (self.bounds.left < self.screenBounds.left) then
		self.bounds.left = self.screenBounds.left
	end

	if (self.bounds.right > self.screenBounds.right) then
		self.bounds.right = self.screenBounds.right
	end

	if (self.bounds.top < self.screenBounds.top) then
		self.bounds.top = self.screenBounds.top
	end

	if (self.bounds.bottom > self.screenBounds.bottom) then
		self.bounds.bottom = self.screenBounds.bottom
	end

	if down("j") then self:shoot() end
	
	self.weapon.reload()
end

function Plane:shoot()
	if self.weapon.bullets == 0 then return end
	self.weapon.bullets = self.weapon.bullets - 1

	--local x, y = self.bounds:topCenter():match()


	local bullet = {}
	bullet.zIndex = 1
	bullet.draw = drawTexture
	bullet.texture = bulletTexture
	bullet.bounds = nessy.rectangle(0, 0, bullet.texture:getWidth(), bullet.texture:getHeight())
	bullet.bounds.bottomCenter = self.bounds.topCenter
	bullet.velocity = nessy.point(0, -20)

	bullet.update = function (self) 
		if self.bounds.bottom < nessy.viewport().top then
			table.remove(entities, 3)
		end
	end


	table.insert(entities, bullet)
end

function Plane:reload()
	--if self.weapon.bullets == 0 then self.weapon.bullets = 3 end
	if self.weapon.bullets < self.weapon.maxBullets then
		self.weapon.bullets = self.weapon.bullets + 1
	end
end

function down(key)
	return love.keyboard.isDown(key)
end

function drawTexture(entity)

	nessy.draw(entity)


	--love.graphics.draw(entity.texture, x, y)
end