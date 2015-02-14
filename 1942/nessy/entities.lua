local Entities = {}

function Entities.add(entity)
	table.insert(Entities, entity)
	entity.id = #Entities
end

function Entities.remove(entity)
	for i = entity.id + 1, #Entities do
		Entities[i].id = Entities[i].id - 1
	end
	table.remove(Entities, entity.id)
end

return Entities