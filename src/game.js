nessy.plug("gameloop", new nessy.GameLoop())
nessy.plug("timer", new nessy.Timer())
nessy.plug("graphics", new nessy.Graphics({ width: 800, height: 600 }))

nessy.plug("keyboard", new nessy.Keyboard())
nessy.plug("mouse", new nessy.Mouse())
nessy.plug("entities", new nessy.EntityStore())

nessy.debug = true

var game = {
	sprites: {
		plane: (new nessy.Spritesheet("resources/plane.png")).sprite(new nessy.Rectangle(24, 24))
	},
	init: function() {
		var water = new Water()
		var plane = {
			bounds: this.sprites.plane.bounds.copy(),
			texture: {
				sprite: this.sprites.plane
			}
		}
		plane.bounds.center = nessy.graphics.viewport.center

		nessy.entities.add(plane)

		nessy.entities.onUpdate(["update"], function(entity) { entity.update() })
		nessy.entities.onDraw(["texture"], function(entity) { nessy.renderer.render(entity) })

		var d = repeat(serial(delay(3), call(function() { console.log("after 3 sec") })))()
		var p = repeat(serial(delay(1/48), call(function() {
			nessy.plane.bounds.x += 1
		})))()

		this.plane = plane
		this.water = water
	},
	update: function() {
		if (nessy.keyboard.isDown(39)) this.plane.bounds.x += 10
		if (nessy.keyboard.isDown(37)) this.plane.bounds.x -= 10
		if (nessy.keyboard.isDown(40)) this.plane.bounds.y += 10
		if (nessy.keyboard.isDown(38)) this.plane.bounds.y -= 10
	},
	draw: function() {
		if (nessy.keyboard.isDown(13)) {
			nessy.graphics.fillStyle = "white"
			nessy.graphics.print("pEnter pressed", 200, 200)			
		}
		if(nessy.mouse.isDown){
			nessy.graphics.fillStyle = "white"
			nessy.graphics.print("pMouse pressed", nessy.mouse.x + 2, nessy.mouse.y + 2)			
		}
	}
}
nessy.plug("game", game)

game.init()
nessy.gameloop.run()