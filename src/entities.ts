import array = require("./array");

type System = {
    components: string[];
    callback: (entity: any) => void;
}

export let init = () => {
    var self: {
        entities: { [key: string]: any }[];
        onUpdateSystems: System[];
        onDrawSystems: System[];
        update: () => void;
        draw: () => void;
        onUpdate: (components: string[], callback: (entity: any) => void) => void;
        onDraw: (components: string[], callback: (entity: any) => void) => void;
        add: (entity: any) => void;
        remove: (entity: any) => void;
    } = {
        entities: [],
        onUpdateSystems: [],
        onDrawSystems: [],
        
        update: () => {
            self.entities.forEach(entity => {
                self.onUpdateSystems
                    .filter(system => array.all(
                        system.components,
                        component => entity[component] !== void 0))
                    .forEach(system => system.callback(entity))
            });
        },
        
        draw: () => {
            self.entities.forEach(entity => {
                self.onDrawSystems
                    .filter(system => array.all(system.components, component => entity[component] !== void 0))
                    .forEach(system => system.callback(entity));
            });
        },
        
        onUpdate: (components, callback) => {
            self.onUpdateSystems.push({ components: components, callback: callback });
        },
        
        onDraw: (components, callback) => {
            self.onDrawSystems.push({ components: components, callback: callback });
        },
        
        add: (entity) => {
            self.entities.push(entity);
        },
        remove: (entity) => {
            let index = self.entities.indexOf(entity);
            self.entities.splice(index, 1);
        }
    };
    
    return self;
};