nessy.Host = function() { }

nessy.Host.prototype = {
	pluggers: [
		function(plugin) {
			if (plugin.plugger != null)	 {
				this.pluggers.push(plugin.plugger.bind(plugin))
			}
		}
	],
	
	plug: function(name, Plugin, arg) {
		if (!(Plugin instanceof Function)) throw "Plug failed: " + Plugin + " is not a Function"
		
		var plugin = new Plugin(this, arg)
		this[name] = plugin
		this.pluggers.forEach(function(plugger) {
			plugger.bind(this)(plugin)
		}.bind(this))
	}
}