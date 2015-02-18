local task = {}

--[[function getms(dt)
	return string.format("%.4f", dt)
end]]

function task.whenAny(tasks)
	return function()
		return {
			tasks = tasks,

			completed = false,
			update = function(self, dt)
				local minimalTimeLeft = dt
				for _, task in ipairs(self.tasks) do
					task = task()
					local currentTimeLeft = task:update(dt)
					print(currentTimeLeft)
					self.completed = task.completed

					if currentTimeLeft < minimalTimeLeft then
						minimalTimeLeft = currentTimeLeft
					end
				end
				return dt
			end
		}
	end
end

function task.waitFor(condition)
	return function()
		return {
			condition = condition,
			completed = false,
			update = function(self, dt)
				self.completed = condition()
				return dt
			end
		}
	end
end

function task.serial(tasks)
	return function()
		local enum = enumerator(tasks)
		enum:advance()

		return {
			tasks = enum,

			completed = false,
			update = function(self, dt)
				while not self.completed and  dt > 0 and self.tasks.hasCurrent do					
					dt = self.tasks.current:update(dt)
					if self.tasks.current.completed then
						self.tasks:advance()
					end
				end

				if not self.tasks.hasCurrent then
					--print("task array - completed " .. getms(dt))
					self.completed = true
				end

				return dt
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
	return function()
		return {
			elapsed = 0,
			time = time,

			completed = false,
			update = function(self, dt)
				if self.completed then return dt end
				
				self.elapsed = self.elapsed + dt
				--print("wait got " .. getms(dt) .. " elapsed = " .. getms(self.elapsed))

				if self.elapsed >= self.time then
					--print("wait - completed " .. getms(self.elapsed))
					self.completed = true
					return self.elapsed - self.time
				else
					return 0
				end
			end
		}
	end
end

function task.recur(createTask)
	return function()
		return {
			task = createTask(),

			completed = false,
			update = function(self, dt)
				if self.completed then return dt end
				while dt > 0 do
					
					dt = self.task:update(dt)
					if self.task.completed then
						--print("recur - completed " .. getms(dt))
						self.task = createTask()
					end
				end
				return dt
			end
		}
	end
end

function enumerator(array)
	return {
		id = 0,
		array = array,
		advance = function(self)
			self.id = self.id + 1
			if self.id <= #self.array then
				self.current = self.array[self.id]()
				self.hasCurrent = true
			else
			    self.current = nil
			    self.hasCurrent = false
			end
		end,
		current = nil,
		hasCurrent = false
	}
end

return task