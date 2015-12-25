nessy.Host = function() { };

nessy.Host.prototype = {
	pluggers: [
		function(plugin) {
			if (plugin.plugger !== undefined)	 {
				this.pluggers.push(plugin.plugger.bind(plugin));
			}
		}
	],
	
	plug: function(name, Plugin, arg) {
		
		var plugin = Plugin instanceof Function ? new Plugin(this, arg) : Plugin;
		this[name] = plugin;
		this.pluggers.forEach(function(plugger) {
			plugger.bind(this)(plugin);
		}.bind(this));
	}
};