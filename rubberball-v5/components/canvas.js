var canvas = {
    element: document.querySelector('canvas'),
    objectsToRender: [],
    objectsToRenderOnce: [],
    ctx: document.querySelector('canvas').getContext('2d'),
    render: () => {
        canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
        canvas.objectsToRender.forEach(i => {
            i.render();
        });
        canvas.objectsToRenderOnce.forEach(i => {
            i.render();
        });
        canvas.objectsToRenderOnce = [];
    }
}

export default canvas;
