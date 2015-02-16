nessy = require("nessy")

Plane = {
	sprites = {
		plane = nessy.spritesheet("resources/plane.png"):sprite(),
		bullet = nessy.spritesheet("resources/bullet.png"):sprite()
	},
	zIndex = 1
}

function Plane:ctor()
	self.texture = {
		sprite = Plane.sprites.plane
	}

	self.update = updatePlane

	self.bounds = self.texture.sprite.bounds:copy()

	self.weapon = {}
	self.weapon.maxBullets = 1
	self.weapon.bullets = 1
	self.weapon.reload = callEveryCheater(0.5, function() 
		self:reload()
	end)

	local viewport = nessy.viewport()
	self.screenBounds = nessy.rectangle(0, 0, viewport.width - 40, viewport.height - 40)
	self.screenBounds.center = viewport.center
	self.bounds.bottomCenter = self.screenBounds.bottomCenter

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
	local speed = 1000

	self.velocity = nessy.point()
	self.velocity = self.velocity + (down("a") and nessy.point(-speed, 0) or nessy.point())
	self.velocity = self.velocity + (down("d") and nessy.point(speed, 0) or nessy.point())
	self.velocity = self.velocity + (down("w") and nessy.point(0, -speed) or nessy.point())
	self.velocity = self.velocity + (down("s") and nessy.point(0, speed) or nessy.point())

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
			sprite = Plane.sprites.bullet,
		},
		zIndex = 1,
	}

	bullet.bounds = Plane.sprites.bullet.bounds:copy()
	bullet.bounds.bottomCenter = self.bounds.topCenter

	bullet.velocity = nessy.point(0, -1000)

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