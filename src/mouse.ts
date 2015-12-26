export let init = (host: any) => {
    let canvas: HTMLCanvasElement = host.graphics.canvas;
    
    let mouse = {
        isDown: false,
        x: 0,
        y: 0
    }
    
    canvas.addEventListener("mousedown", () => {
        mouse.isDown = true;
    });
    
    canvas.addEventListener("mouseup", () => {
        mouse.isDown = false;
    });
    
    canvas.addEventListener("mousemove", (event) => {
        let bounds = canvas.getBoundingClientRect();
        mouse.x = event.pageX - (window.pageXOffset + bounds.left);
        mouse.y = event.pageY - (window.pageYOffset + bounds.top);
    });
    
    return mouse;
}