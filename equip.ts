import array = require("./src/array");

type Slot = { type: string[], item: Item, parent: Item };
type Item = { template: string, type: string[], slots: Slot[] };

// [[offhand], [mainhand]] => offhand OR mainhand
// [offhand, mainhand] => offhand AND mainhand

// find all slots with these attributes
// and then equip item in these slots

// bag - item with slots, that we can put another items into



var templates = {
	Soul: {
		template: "Soul",
		type: <string[]>[],
		slots: [
			{
				type: ["body"],
                item: <Item>null,
                parent: <Item>null
			}
		]
	},

	Human: {
		template: "Human",
		type: <string[]>["body"],
		slots: [
			{
				type: ["mainhand"],
                item: <Item>null,
                parent: <Item>null
			},
			{
				type: ["offhand"],
                item: <Item>null,
                parent: <Item>null
			},
			{
				type: ["bag"],
                item: <Item>null,
                parent: <Item>null
			}
		]
	},

	Sword: {
		template: "Sword",
		type: <string[]>["mainhand"],
		slots: <Slot[]>[]
	},

	Shield: {
		template: "Shield",
		type: <string[]>["offhand"],
		slots: <Slot[]>[]
	},

	Axe: {
		template: "Axe",
		type: <string[]>["mainhand", "offhand"],
		slots: <Slot[]>[]
	},

	Bow: {
		template: "Bow",
		type: <string[]>["mainhand", "offhand"],
		slots: <Slot[]>[{ type: ["arrow"] }]
	},
	
	Arrow: {
		template: "Arrow",
		type: <string[]>["arrow"],
		slots: <Slot[]>[]
	},

	Bag: {
		template: "Bag",
		type: <string[]>["bag"],
		slots: <Slot[]>array.range(0, 5).map(() => ({ type: [] }))
	},
	
	Cursor: {
		template: "Cursor",
		type: <string[]>["cursor"],
		slots: <Slot[]>[{ type: [] }]	
	},

	Potion: {
		template: "Potion",
		type: <string[]>["potion"],
		slots: <Slot[]>[]	
	}
};

function create(template: Item) {
	var obj = {
        type: template.type,
        slots: template.slots.map(function(slot) { slot.parent = obj; return slot; }),
        template: template.template
    };
    
	return obj;
}

function findSlots(bag: Item, item: Item) {
	var slots = bag.slots
		.filter(function(slot) {
			var a = array.except(item.type, slot.type);
			return !array.some(a) || a.length < item.type.length;
		});

	slots.map(function(slot) { console.log(slot); });
	
	return slots;
}

function exchange(leftSlot: Slot, rightSlot: Slot) {
	var leftItem = leftSlot.item;
	leftSlot.item = rightSlot.item;
	rightSlot.item = leftItem;
}

function findSlot(bag: Item, item: Item) {
    var emptySlots = bag.slots.filter(slot => slot.item === void 0 || slot.item === null);
	var slot = array.first(
        emptySlots,
		slot => canContain(slot, item));
		
	return slot;
}

function canContain(slot: Slot, item: Item) {
	var result = !array.some(array.except(slot.type, item.type));

	return result;
}
/*	hasType(item) {
		var result = this.type
			.contains(type)

		return result
	}*/
(function run() {
	log("This is your Soul");
	var soul = create(templates.Soul);	
	log(soul);
	
	// cursor is not an item with slot, it's just cursor 
	// for moving items around
	log("Cursor has dragged Human body");
	var cursor = create(templates.Cursor);
	var human = create(templates.Human);
	var cursorSlot = findSlot(cursor, human);
	cursorSlot.item = human;
	log(cursor);
	
	log("and dropped it into Soul's Body slot");
	var slot = findSlot(soul, cursorSlot.item);
	exchange(cursorSlot, slot);
	log(cursor);
	log(soul);
	
	console.log(slot);
	
	log("Now we create Bag and equip it");
	var bag = create(templates.Bag);
	slot = findSlot(human, bag);
	cursorSlot.item = bag;
	exchange(slot, cursorSlot);
	log(soul);
	
	log("and put Sword and Shield into Bag");
	var sword = create(templates.Sword);
	var swordSlot = findSlot(bag, sword);
	cursorSlot.item = sword;
	exchange(swordSlot, cursorSlot);
	
	var shield = create(templates.Shield);
	var shieldSlot = findSlot(bag, shield);
	cursorSlot.item = shield;
	exchange(shieldSlot, cursorSlot);
	log(soul);
	
	log("and then equip Sword and Shield from Bag into Human's hands");
	var mainhandSlot = findSlot(human, sword);
	exchange(swordSlot, mainhandSlot);
	var offhandSlot = findSlot(human, shield);
	exchange(shieldSlot, offhandSlot);
	log(soul);

	var axe = create(templates.Axe);
	var slots = findSlots(human, axe);
})();

// stackable items - to design
var arrow1 = {
	type: "arrow",
	count: 10
};

var arrow2 = {
	type: "arrow",
	count: 5
};

function stack(left: any, right: any) {
	if (left.type == right.type) {
		return {
			type: left.type,
			count: left.count + right.count
		};
	}
}
// end stackable items

// slots of inventory and equipment are the same 
// in inventory slot you can put any item 
// but in equipment slot you can put only item with suitable attributes
// (sword for mainhand, plate armor for chest etc.)

// bow - weapon with bag ability, it adds additional slot for arrows

/* Human body - is an item with its attributes and passives.
For example, two-headed ogre can wear two helmets and two necklaces,
but he has passive, that decreases his attack speed due to 
slower sync between his heads :) */
		
/* Maybe character class is also an item with passive and active skills (knight, thief, archer etc.)
And player can equip it into "class" slot of "body"
For example, class Shaman, body Elf [slot:"class & (shaman|warrior|archer)"] */

/* Everything - every item, skill, weapon, body has tags/attributes.
When soul gain Exp, every used attribute gain Exp. So Soul become more efficient 
when using these attributes (human, shaman, physical, one-handed, sword, cloth, armor, fire, projectile, fireball).
When attribute gains level, it gains skillpoints, that player can distribute into this attribute passive skills.
For example, Soul can have Passive skill "You can have an additional body (so you don't need to create new character
when you want to change race, class etc)" */

function getTab(count: number) {
	return array.range(0, count)
		.map(function() { return "- - "; })
		.join("");
}

function toStr(obj: any, tabCount: number) {
	/**
	* Soul [
	* 		"body": Human [
	* 			"mainhand": null
	* 		]
	* ]
	*/
	
	if (obj === void 0 || obj === null) return "[empty]";
	
	var tab = getTab(tabCount);
	
	var text = "";
	
	text += obj.template + " [";
	if (obj.slots.length > 0) {
		text += "\n";
		for (var slot of obj.slots) {
			text += tab + (slot.type.length > 0 ? slot.type : "any") + ": " + toStr(slot.item, tabCount + 1) + "\n";
		}
		
		text += getTab(tabCount - 1) + "]";
	}
	else {
		text += "]";
	}
	return text;
}

function log(obj: any) {
	var div = document.createElement("div");
	div.innerText = (obj instanceof Object) ? toStr(obj, 1) : obj;
	document.body.appendChild(div);
	document.body.appendChild(document.createElement("br"));
}