local task = {}

function getms(dt)
	return string.format("%.4f", dt)
end

function task.waitFor(condition)
	return function()
		return {
			completed = false,
			update = function(self, dt)
				local result = condition()
				--print("condition = " .. tostring(result))
				self.completed = result
				if self.completed then
					return dt
				else
					return 0
				end
			end
		}
	end
end

function task.serial(taskCreates)
	return aggregate(taskCreates, pairSerial)
end

function pairSerial(firstCreate, secondCreate)
	return function()
		local first = firstCreate()
		local second = secondCreate()

		return {
			completed = false,
			update = function(self, dt)

				while first.completed == false and dt > 0 do
					dt = first:update(dt)
				end

				if first.completed then
					while second.completed == false and dt > 0 do
						dt = second:update(dt)
					end
				end

				if second.completed then
					self.completed = true
				end

				return dt
			end
		}
	end
end

function task.whenAny(taskCreates)
	return aggregate(taskCreates, pairWhenAny)
end

function aggregate(array, func)
	local first = array[1]
	for i, second in ipairs(array) do
		if i > 1 then
			first = func(first, second)
		end
	end
	return first
end

function pairWhenAny(firstCreate, secondCreate)
	return function()
		local first = firstCreate()
		local second = secondCreate()

		return {
			completed = false,
			update = function(self, dt)

				local firstTimeLeft = dt
				while first.completed == false and firstTimeLeft > 0 do
					--print("first")
					firstTimeLeft = first:update(dt)
				end

				if first.completed then self.completed = true return firstTimeLeft end

				local secondTimeLeft = dt
				while second.completed == false and secondTimeLeft > 0 do
					--print("second")
					secondTimeLeft = second:update(dt)
				end

				if second.completed then self.completed = true return secondTimeLeft end

				if firstTimeLeft > secondTimeLeft then
					return secondTimeLeft
				else
					return firstTimeLeft
				end
			end
		}
	end
end

function task.func(func)
	return function()
		return {
			completed = false,
			update = function(self, dt)
				func()
				--print("taskFromFunc - completed " .. getms(dt))
				self.completed = true
				return dt
			end
		}
	end
end

function task.delay(time)
	local waitId = id
	return function()
		local elapsed = 0
		return {
			completed = false,
			update = function(self, dt)
				if self.completed then return dt end
				
				local inc = elapsed + dt
				--print("wait = " .. getms(elapsed) .. " + " .. getms(dt) .. " = " .. getms(inc))
				elapsed = inc

				if elapsed >= time then
					self.completed = true
					local left = elapsed - time
					--print("wait = " .. getms(elapsed) .. " - " .. getms(time) .. " = " .. getms(left))
					return left
				else
					return 0
				end
			end
		}
	end
end

function task.frame(count)
	count = count or 1
	return function()
		local current = 0
		return {
			completed = false,
			update = function(self, dt)
				if self.completed then return dt end

				current = current + 1
				if current >= count then
					self.completed = true
					return dt
				else
					return 0
				end
			end
		}
	end
end

function task.recur(createTask)
	return function()
		local task = createTask()
		return {
			completed = false,
			update = function(self, dt)
				
				while task.completed == false and dt > 0 do
					dt = task:update(dt)

					if task.completed then
						task = createTask()
					end
				end

				return dt
			end
		}
	end
end

return task