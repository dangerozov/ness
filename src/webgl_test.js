var webgl = (() => {
    console.log("===== binary stuff =====");
    var simpleType = nessy.buffer.defineType(types => ({
        x: types.Uint16,
        y: types.Uint32,
        z: types.Uint8
    }));
    
    var buffer = new ArrayBuffer(simpleType.size * 100);
    var view = nessy.buffer.createView(simpleType, buffer);
    view.setAt(0, { x: 10, y: 20, z: 30 });
    
    var fourByteView = new Uint16Array(buffer);
    console.log("x =", fourByteView[0]);
    var eightByteView = new Uint32Array(buffer);
    console.log("y =", eightByteView[1]);
    var byteView = new Uint8Array(buffer);
    console.log("z =", byteView[8]);
    
    var vertexType = nessy.buffer.defineType(types => ({
        posX0: types.Float32,
        posY0: types.Float32,
        posX1: types.Float32,
        posY1: types.Float32,
        color: types.Uint32
    }));
    console.log("Vertex size =", vertexType.size);
    
    var imageType = nessy.buffer.defineType(types => ({
        first: vertexType,
        second: vertexType,
        third: vertexType,
        fourth: vertexType
    }));
    console.log("Image size =", imageType.size);

    vertices = new ArrayBuffer(imageType.size * 2000);
    positions = new Float32Array(vertices);
    colors = new Uint32Array(vertices);
    bytes = new Uint8Array(vertices);
        
    colors[0] = 4294967295;
    console.log(colors[0], colors[1]);        
    console.log(bytes[0], bytes[1], bytes[2], bytes[3], bytes[4]);
	
})();