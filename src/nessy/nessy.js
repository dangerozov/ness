var nessy = nessy || {
	pluggers: [
		function(plugin) {
			if (plugin.plugger != null)	 {
				this.pluggers.push(plugin.plugger.bind(plugin))
			}
		}
	],
	plug: function(name, plugin) {
		this[name] = plugin
		this.utils.forEach(this.pluggers, function(plugger) {
			plugger.bind(this)(plugin)
		}.bind(this))
	}
}