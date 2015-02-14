entities = {}



function has(component)
	return function(entity)
		return entity[component] ~= nil
	end
end



function callEvery(period, func)
	local elapsed = 0
	return function()
		elapsed = elapsed + love.timer.getDelta()
		if elapsed > period then
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