nessy.Texture = function(host) {
	var Texture = function(texture, bounds) {
		if (!(texture instanceof Image)) throw "Not Image"
		
		this.raw = texture
		this.bounds = bounds || new host.Rectangle(texture.width, texture.height)
	}
	
	Texture.prototype = {
		draw: function(point, scale) {
			point = point || host.Point.zero
			scale = scale || host.Point.one
	
			host.graphics.drawImage(this.raw, point.x, point.y)
		}
	}
	
	return Texture
}