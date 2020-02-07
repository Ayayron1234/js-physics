var canvas = {
    element: document.querySelector('canvas'),
    objectsToRender: [],
    ctx: document.querySelector('canvas').getContext('2d'),
    render: () => {
        canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
        canvas.objectsToRender.forEach(i => {
            i.render();
        });
    },
}

export default canvas;
