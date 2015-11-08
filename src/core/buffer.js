nessy.buffer = (() => {
	var b = {};
    
    var wrap = (ctor) => {
        return (buffer) => {
            var view = new ctor(buffer);
            view.setAt = (index, value) => {
                view[index] = value;
            };
            view.getAt = (index) => view[index];
            return view;
        };
    };
    
    
    b.primitiveTypes = {
        Int8: { size: 1, view: wrap(Int8Array) },
        Uint8: { size: 1, view: wrap(Uint8Array) },
        Int16: { size: 2, view: wrap(Int16Array) },
        Uint16: { size: 2, view: wrap(Uint16Array) },
        Int32: { size: 4, view: wrap(Int32Array) },
        Uint32: { size: 4, view: wrap(Uint32Array) },
        Float32: { size: 4, view: wrap(Float32Array) },
        Float64: { size: 8, view: wrap(Float64Array) }
    };
    
    b.instantiateView = (type, buffer) => {
        var instance = {};
        nessy.obj.forEach(type.props, (propType, propName) => {
            instance[propName] = {
                type: propType,
                view: propType.view(buffer)
            };
        });
        return instance;
    };
    
    var createView = (type) => {
        return (buffer) => {
            var instance = b.instantiateView(type, buffer);
            
            return {
                setAt: (index, object) => {
                    var offsetInBytes = index * type.size;
                    nessy.obj.forEach(instance, (prop, key) => {
                        var offset = Math.ceil(offsetInBytes / prop.type.size);
                        console.log(offset);
                        
                        var value = object[key];
                        prop.view.setAt(offset, value);
                        offsetInBytes = (offset + 1) * prop.type.size;
                    });
                },
                getAt: (index) => {
                    
                }
            };
        };
    };
    
    b.defineType = (callback) => {
        var type = {};
        
        type.props = callback(b.primitiveTypes);
        type.size = nessy.array
            .sum(nessy.obj.values(type.props)
            .map(props => props.size));
        type.view = createView(type);
        
        return type;
    };
    
    b.createView = (type, buffer) => {
        var view = type.view(buffer);        
        return view;
    };
	
	return b;
})();