function Slot(obj) {
	if (obj instanceof Slot) return obj
	if (!(this instanceof Slot)) return new Slot(obj)

	this.type = obj.type
	this.item = obj.item === undefined ? null : obj.item
	this.parent = obj.parent
}

Slot.empty = function(slot) {
	return slot.item == null
}

// [[offhand], [mainhand]] => offhand OR mainhand
// [offhand, mainhand] => offhand AND mainhand

// найти все слоты на которые маппится тип итема
// а дальше эквипнуть этот итем в эти слоты

// bag - это предмет со слотами в который можно положить другие предметы

var templates = {
	Soul: {
		template: "Soul",
		type: [],
		slots: [
			{
				type: ["body"]
			}
		]
	},

	Human: {
		template: "Human",
		type: ["body"],
		slots: [
			{
				type: ["mainhand"]
			},
			{
				type: ["offhand"]
			},
			{
				type: ["bag"]
			}
		]
	},

	Sword: {
		template: "Sword",
		type: ["mainhand"],
		slots: []
	},

	Shield: {
		template: "Shield",
		type: ["offhand"],
		slots: []
	},

	Axe: {
		template: "Axe",
		type: ["mainhand", "offhand"],
		slots: []
	},

	Bow: {
		template: "Bow",
		type: ["mainhand", "offhand"],
		slots: [{ type: ["arrow"] }]
	},
	
	Arrow: {
		template: "Arrow",
		type: ["arrow"],
		slots: []
	},

	Bag: {
		template: "Bag",
		type: ["bag"],
		slots: linq.range(0, 5).map(function() { return { type: [] } })
	},
	
	Cursor: {
		template: "Cursor",
		type: ["cursor"],
		slots: [{ type: [] }]	
	},

	Potion: {
		template: "Potion",
		type: ["potion"],
		slots: []	
	}
}

function create(template) {
	var obj = { }
	obj.type = template.type.toArray()
	obj.slots = template.slots.map(function(slot) { slot.parent = obj; return slot }).map(Slot)			
	obj.template = template.template
	
	return obj
}

function multiPut(bag, item) {
	var slots = bag.slots
		.filter(function(slot) {
			var a = item.type.except(slot.type)
			return !a.some() || a.length < item.type.length
		})

	slots.map(function(slot) { console.log(slot) })
	
	return slots
}

function exchange(leftSlot, rightSlot) {
	var leftItem = leftSlot.item
	leftSlot.item = rightSlot.item
	rightSlot.item = leftItem
}

function findSlot(bag, item) {
	var slot = bag.slots
		.filter(Slot.empty)
		.first(function(slot) { return canContain(slot, item) })
		
	return slot
}

function canContain(slot, item) {
	var result = !slot.type
		.except(item.type)
		.some()

	return result
}
/*	hasType(item) {
		var result = this.type
			.contains(type)

		return result
	}*/
function run() {
	log("This is your Soul")
	var soul = create(templates.Soul)		
	log(soul)
	
	// курсор это не предмет со слотом, это просто курсор, для взаимодействия с предметами
	// перетаскивания их из одного слота в другой
	log("Cursor has dragged Human body")
	var cursor = create(templates.Cursor)		
	var human = create(templates.Human)
	var cursorSlot = findSlot(cursor, human)
	cursorSlot.item = human
	log(cursor)
	
	log("and dropped it into Soul's Body slot")
	var slot = findSlot(soul, cursorSlot.item)
	exchange(cursorSlot, slot)
	log(cursor)
	log(soul)
	
	console.log(slot)
	
	log("Now we create Bag and equip it")
	var bag = create(templates.Bag)
	var slot = findSlot(human, bag)
	cursorSlot.item = bag
	exchange(slot, cursorSlot)
	log(soul)
	
	log("and put Sword and Shield into Bag")
	var sword = create(templates.Sword)
	var swordSlot = findSlot(bag, sword)
	cursorSlot.item = sword
	exchange(swordSlot, cursorSlot)
	
	var shield = create(templates.Shield)
	var shieldSlot = findSlot(bag, shield)
	cursorSlot.item = shield
	exchange(shieldSlot, cursorSlot)
	log(soul)
	
	log("and then equip Sword and Shield from Bag into Human's hands")
	var mainhandSlot = findSlot(human, sword)
	exchange(swordSlot, mainhandSlot)
	var offhandSlot = findSlot(human, shield)
	exchange(shieldSlot, offhandSlot)
	log(soul)

	var axe = create(templates.Axe)
	var slots = multiPut(human, axe)
}

// ячейки инвентаря и эквипмента это ОДНО И ТО ЖЕ, 
// просто в ячейку инвентаря можно положить ВСЁ, 
// а в ячейку эквипмента по валидации, ПАМ ПАМ ОПА ОПА

// bow - это оружие со способностью bag, т.е. дает дополнительный слот для стрел, хо хо хо

// есть item-template из которого создается конкретный айтем и который впоследствии можно изменять энчантить затачивать и т.д.

/* Human body - это премет со своими статами и пассивами. Например огр с двумя головами
может носить два шлема и амулета, но при это у него есть пассива, которая уменьшает скорость атаки */

// stackable items
var arrow1 = {
	type: "arrow",
	count: 10
}

var arrow2 = {
	type: "arrow",
	count: 5
}

function stack(left, right) {
	if (left.type == right.type) {
		return {
			type: left.type,
			count: left.count + right.count
		}
	}
}
// end stackable items




		
/* Класс это тоже предмет с пассивами и активами (рыцарь, вор, лучник и т.д.) И одевается он в ячейку тела.
Например, Шаман - тип "шаман", Эльф - ячейки классов = ["шаман", "воин", "лучник"] */
/* У всего - у каждого предмета, скилла, оружия, тела, есть теги/атрибуты. Когда душа получает опыт,
с помощью чего-то, каждый использованный при этом атрибут, получает опыт. Когда атрибут левелапится он получает очки,
которые можно распределить в пассивы этому атрибуту */

function getTab(count) {
	return linq.range(0, count)
		.map(function() { return "- - " })
		.join("")
}

function toStr(obj, tabCount) {
	/**
	 * Soul [
	 * 		"body": Human [
	 * 			"mainhand": null
	 * 		]
	 * ]
	 */
	 
	if (obj == null) return "[empty]" 
	
	var tab = getTab(tabCount)
	 
	var text = ""
	
	text += obj.template + " ["
	if (obj.slots.length > 0) {
		text += "\n"
		for (var slot of obj.slots) {
			text += tab + (slot.type.length > 0 ? slot.type : "any") + ": " + toStr(slot.item, tabCount + 1) + "\n"
		}
		
		text += getTab(tabCount - 1) + "]"
	}
	else {
		text += "]"
	}
	return text
}

function log(obj) {
	var div = document.createElement("div")
	div.innerText = (obj instanceof Object) ? toStr(obj, 1) : obj
	document.body.appendChild(div)
	document.body.appendChild(document.createElement("br"))
}