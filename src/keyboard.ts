export let init = (host: any) => {
    let self = {
        map: <any[]>[],
        isDown: (keyCode: number) => self.map[keyCode] || false            
    };
    
    document.addEventListener("keydown", event => {
        self.map[event.keyCode] = true;
    })
    
    document.addEventListener("keyup", event => {
        self.map[event.keyCode] = false;
    })
    
    return self;
};