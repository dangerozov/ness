describe("Rectangle", function() {

	var rect

	beforeEach(function() {
		rect = new nessy.Rectangle(10, 20, 30, 40)
	})

	it("Should create rectangle from x, y, w, h", function() {
		var rect = new nessy.Rectangle(10, 20, 30, 40)

		expect(rect.x).toBe(10)
		expect(rect.y).toBe(20)
		expect(rect.width).toBe(30)
		expect(rect.height).toBe(40)
	})

	it("Should create rectangle from w, h", function() {
		var rect = new nessy.Rectangle(30, 40)

		expect(rect.width).toBe(30)
		expect(rect.height).toBe(40)
	})

	it("Shoud get left", function() { 
		expect(rect.left).toBe(10)
	})

	it("Should set left", function() {
		rect.left = 50

		expect(rect.x).toBe(50)
	})

	it("Shoud get right", function() {
		expect(rect.right).toBe(10 + 30)
	})

	it("Should set right", function() {
		rect.right = 50

		expect(rect.x).toBe(20)
	})

	it("Shoud get top", function() {
		expect(rect.top).toBe(20)
	})

	it("Should set top", function() {
		rect.top = 50

		expect(rect.y).toBe(50)
	})

	it("Shoud get bottom", function() {
		expect(rect.bottom).toBe(20 + 40)
	})

	it("Should set bottom", function() {
		rect.bottom = 50

		expect(rect.y).toBe(10)
	})

	it("Should get size", function() {
		var size = rect.size

		expect(size.x).toBe(30)
		expect(size.y).toBe(40)
	})

	it("Should set size", function() {
		rect.size = new nessy.Point(50, 60)

		expect(rect.width).toBe(50)
		expect(rect.height).toBe(60)
	})

	it("Should get location", function() {
		var location = rect.location

		expect(location.x).toBe(10)
		expect(location.y).toBe(20)
	})

	it("Should set location", function() {
		rect.location = new nessy.Point(50, 60)

		expect(rect.x).toBe(50)
		expect(rect.y).toBe(60)
	})

	it("Should get topCenter", function() {
		var topCenter = rect.topCenter

		expect(topCenter.x).toBe(25)
		expect(topCenter.y).toBe(20)
	})

	it("Should set topCenter", function() {
		rect.topCenter = new nessy.Point(50, 60)

		expect(rect.x).toBe(35)
		expect(rect.y).toBe(60)
	})

	it("Should get topRight", function() {
		var topRight = rect.topRight

		expect(topRight.x).toBe(40)
		expect(topRight.y).toBe(20)
	})

	it("Should set topRight", function() {
		rect.topRight = new nessy.Point(50, 60)

		expect(rect.x).toBe(20)
		expect(rect.y).toBe(60)
	})

	it("Should get middleLeft", function() {
		var middleLeft = rect.middleLeft

		expect(middleLeft.x).toBe(10)
		expect(middleLeft.y).toBe(40)
	})

	it("Should set middleLeft", function() {
		rect.middleLeft = new nessy.Point(50, 60)

		expect(rect.x).toBe(50)
		expect(rect.y).toBe(40)
	})

	it("Should get center", function() {
		var center = rect.center

		expect(center.x).toBe(25)
		expect(center.y).toBe(40)
	})

	it("Should set center", function() {
		rect.center = new nessy.Point(50, 60)

		expect(rect.x).toBe(35)
		expect(rect.y).toBe(40)
	})

	it("Should get middleRight", function() {
		var middleRight = rect.middleRight

		expect(middleRight.x).toBe(40)
		expect(middleRight.y).toBe(40)
	})

	it("Should set middleRight", function() {
		rect.middleRight = new nessy.Point(50, 60)

		expect(rect.x).toBe(20)
		expect(rect.y).toBe(40)
	})

	it("Should get bottomLeft", function() {
		var bottomLeft = rect.bottomLeft

		expect(bottomLeft.x).toBe(10)
		expect(bottomLeft.y).toBe(60)
	})

	it("Should set bottomLeft", function() {
		rect.bottomLeft = new nessy.Point(50, 60)

		expect(rect.x).toBe(50)
		expect(rect.y).toBe(20)
	})

	it("Should get bottomCenter", function() {
		var bottomCenter = rect.bottomCenter

		expect(bottomCenter.x).toBe(25)
		expect(bottomCenter.y).toBe(60)
	})

	it("Should set bottomCenter", function() {
		rect.bottomCenter = new nessy.Point(50, 60)

		expect(rect.x).toBe(35)
		expect(rect.y).toBe(20)
	})

	it("Should get bottomRight", function() {
		var bottomRight = rect.bottomRight

		expect(bottomRight.x).toBe(40)
		expect(bottomRight.y).toBe(60)
	})

	it("Should set bottomRight", function() {
		rect.bottomRight = new nessy.Point(50, 60)

		expect(rect.x).toBe(20)
		expect(rect.y).toBe(20)
	})
})