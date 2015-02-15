nessy = require("nessy")

Plane = {
	zIndex = 1,
	textureName = "resources/plane.png",
}

function Plane:init()

	bulletTexture = nessy.image("resources/bullet.png")

	self.texture = {
		image = nessy.image(self.textureName)
	}

	self.update = updatePlane

	self.bounds = self.texture.image.bounds:copy()
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

	nessy.entities.add(self)
end

function callEvery(period, func)
	local elapsed = 0
	return function()
		elapsed = elapsed + love.timer.getDelta()
		while elapsed > period do
			elapsed = elapsed - period
			func()
		end
	end
end

function callEveryCheater(period, func)
	local elapsed = 0
	return function()
		local speed = (previous == down("j") == true and 1 or 3)
		local delta = love.timer.getDelta() * speed
		elapsed = elapsed + delta
		if elapsed > period then
			elapsed = elapsed - period
			func()
		end
	end
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

	local bullet = {
		texture = {
			image = bulletTexture,
		},
		zIndex = 1,
	}

	bullet.bounds = nessy.rectangle(0, 0, bullet.texture.image.bounds.width, bullet.texture.image.bounds.height)
	bullet.bounds.bottomCenter = self.bounds.topCenter
	
	bullet.velocity = nessy.point(0, -20)

	bullet.update = function (self) 
		if self.bounds.bottom < nessy.viewport().top then
			nessy.entities.remove(self)
		end
	end

	nessy.entities.add(bullet)
end

function Plane:reload()
	if self.weapon.bullets < self.weapon.maxBullets then
		self.weapon.bullets = self.weapon.bullets + 1
	end
end

function down(key)
	return love.keyboard.isDown(key)
end