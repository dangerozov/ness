nessy.Renderer = function(host) {
	this.host = host;
	this.point = nessy.chain(this.host.Point);
};

nessy.Renderer.prototype = {
	render: function(entity) {
		var rect = this.host.Rectangle.chain;
		var point = this.point;
		
		var texture = entity.texture;
		var mode = texture.mode || "scale";
		var source = texture.image.bounds;
		var target = texture.bounds || source;
		
		target = rect(target)
			.setTopLeft(point(rect(target).getTopLeft().value)
				.add(rect(entity.bounds).getTopLeft().value)
				.value)
			.value;
		
		var scale = point(rect(target).getSize().value)
			.div(point(rect(source).getSize().value))
			.value;

		if (mode == "fill") {
			var image = this.host.graphics.createImage(target.width, target.height, function() {
				var pattern = this.host.graphics.createPattern(entity.texture.image.raw, "repeat");
				
				var previousFillStyle = this.host.graphics.fillStyle;
				this.host.graphics.fillStyle = pattern;
				this.host.graphics.fillRect(this.host.graphics.viewport);
				this.host.graphics.fillStyle = previousFillStyle;
				
			}.bind(this));
			this.host.graphics.drawImage(image, target.x, target.y);
		}
		else if (mode == "scale") {
			entity.texture.image.draw(rect(target).getTopLeft().value, scale);
		}

		if (this.host.debug) {
			var previousStrokeStyle = this.host.graphics.strokeStyle;
			this.host.graphics.strokeStyle = "red";
			this.host.graphics.strokeRect(target);
			this.host.graphics.strokeStyle = previousStrokeStyle;
			
			previousStrokeStyle = this.host.graphics.strokeStyle;
			this.host.graphics.strokeStyle = "green";
			this.host.graphics.strokeRect(target);
			this.host.graphics.strokeStyle = previousStrokeStyle;
		}
	}
};