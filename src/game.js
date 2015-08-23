﻿var host = new nessy.Host()
host.plug("gameloop", nessy.GameLoop)
host.plug("timer", nessy.Timer)
host.plug("Point", nessy.Point)
host.plug("Rectangle", nessy.Rectangle)
host.plug("graphics", nessy.Graphics, { width: 800, height: 600 })
host.plug("Texture", nessy.Texture)
host.plug("renderer", nessy.Renderer)
host.plug("keyboard", nessy.Keyboard)
host.plug("mouse", nessy.Mouse)
host.plug("entities", nessy.EntityStore)

host.debug = true

var textures = {}

var Game = function(host) {
	this.host = host
}

Game.prototype = {
	preload: serial([
			loadImage("resources/plane.png", function(img) { textures.plane = (new this.host.Texture(img)) }),
			loadImage("resources/water.png", function(img) { textures.water = (new this.host.Texture(img)) })
		]),	
	init: function() {
		
		var water = new Water(this.host)
		var plane = {
			bounds: textures.plane.bounds.copy(),
			texture: {
				image: textures.plane
			}
		}
		plane.bounds.center = this.host.graphics.viewport.center

		this.host.entities.add(plane)

		this.host.entities.onUpdate(["update"], function(entity) { entity.update() })
		this.host.entities.onDraw(["texture"], function(entity) { this.host.renderer.render(entity) }.bind(this))

		var d = repeat(serial(delay(3), call(function() { console.log("after 3 sec") })))()
		var p = repeat(serial(delay(1/48), call(function() {
			plane.bounds.x += 1
		})))()

		this.plane = plane
		this.water = water
	},	
	update: function() {
		if (this.host.keyboard.isDown(39)) this.plane.bounds.x += 10
		if (this.host.keyboard.isDown(37)) this.plane.bounds.x -= 10
		if (this.host.keyboard.isDown(40)) this.plane.bounds.y += 10
		if (this.host.keyboard.isDown(38)) this.plane.bounds.y -= 10
	},	
	draw: function() {
		if (this.host.keyboard.isDown(13)) {
			this.host.graphics.fillStyle = "white"
			this.host.graphics.print("pEnter pressed", 200, 200)
		}
		if (this.host.mouse.isDown) {
			this.host.graphics.fillStyle = "white"
			this.host.graphics.print("pMouse pressed", this.host.mouse.x + 2, this.host.mouse.y + 2)
		}
	}
}

host.plug("game", Game)

host.gameloop.run()