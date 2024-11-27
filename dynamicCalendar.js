const root = document.getElementById("root");
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", "1000");
svg.setAttribute("height", "800");
svg.setAttribute("viewBox", "0 0 1000 800");
root.appendChild(svg);

let viewBox = svg.viewBox.baseVal;
let defaultViewBox = {x: viewBox.x, y: viewBox.y, width: viewBox.width, height: viewBox.height};
let isPanning = false;
let startPoint = {x: 0, y: 0};


redSquare = {
    x: 0, y: 0, width: 25, height: 25, fillColor: "#ffc3c3", strokeColor: "red", strokeWidth: 2,
}

blueSquare = {
    x: 40, y: 40, width: 25, height: 25, fillColor: "#a0e6f1", strokeColor: "blue", strokeWidth: 2,
}

appendToSvg(createRect(redSquare));
appendToSvg(createRect(blueSquare));

function createRect(data) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    data.x !== undefined && rect.setAttribute('x', data.x);
    data.y !== undefined && rect.setAttribute('y', data.y);
    data.width !== undefined && rect.setAttribute('width', data.width);
    data.height !== undefined && rect.setAttribute('height', data.height);
    data.fillColor !== undefined && rect.setAttribute('fill', data.fillColor);
    data.strokeColor !== undefined && rect.setAttribute('stroke', data.strokeColor);
    data.strokeWidth !== undefined && rect.setAttribute('stroke-width', data.strokeWidth);
    data.rx !== undefined && rect.setAttribute('rx', data.rx);
    data.ry !== undefined && rect.setAttribute('ry', data.ry);

    // Add event listener for popover
    rect.addEventListener('mouseover', (event) => showPopover(event, g, rect));
    // rect.addEventListener('mouseout', hidePopover);

    g.addEventListener('click', g.click = function click(event) {
        event.stopPropagation();
        // hidePopover();
        console.log("Square is Clicked!");

    }, false);

    g.appendChild(rect);

    return g;
}

function createRectWithData(data) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    Object.keys(data).forEach(key => {
        rect.setAttribute(key, data[key]);
    });
    return rect;
}


function appendToSvg(element) {
    svg.appendChild(element);
}


svg.addEventListener('mousedown', (event) => {
    isPanning = true;
    startPoint = {x: event.clientX, y: event.clientY};
});

document.addEventListener('mousemove', (event) => {
    if (!isPanning) return;
    const dx = (startPoint.x - event.clientX) * (viewBox.width / svg.clientWidth);
    const dy = (startPoint.y - event.clientY) * (viewBox.height / svg.clientHeight);
    viewBox.x += dx;
    viewBox.y += dy;
    startPoint = {x: event.clientX, y: event.clientY};
    updateViewBox();
});

document.addEventListener('mouseup', () => {
    isPanning = false;
});


svg.addEventListener('wheel', (event) => {
    event.preventDefault();


    const mousePos = getMousePosOnSvg(svg, event);
    const scale = event.deltaY > 0 ? 1.1 : 0.9;
    const newWidth = viewBox.width * scale;
    const newHeight = viewBox.height * scale;

    viewBox.x = mousePos.x - (mousePos.x - viewBox.x) * (newWidth / viewBox.width);
    viewBox.y = mousePos.y - (mousePos.y - viewBox.y) * (newHeight / viewBox.height);
    viewBox.width = newWidth;
    viewBox.height = newHeight;

    updateViewBox();
})

svg.addEventListener('contextmenu', (event) => {
    console.log('Returning to Default ViewBox');
    console.log(event);
    event.preventDefault();
    // setDefaultViewBox();
    console.log(`ViewBox: ${viewBox.x}, ${viewBox.y}, ${viewBox.width}, ${viewBox.height}`);
});

function getMousePosOnSvg(selectedSvg, event) {
    const point = selectedSvg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    // const svgPoint = point.matrixTransform(selectedSvg.getScreenCTM().inverse());
    const svgPoint = point.matrixTransform(selectedSvg.getCTM().inverse());
    const svgX = viewBox.x + (svgPoint.x * viewBox.width / svg.clientWidth);
    const svgY = viewBox.y + (svgPoint.y * viewBox.height / svg.clientHeight);

    return {x: svgX, y: svgY};
}

function updateViewBox() {
    svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
}

function setDefaultViewBox() {
    svg.setAttribute('viewBox', `${defaultViewBox.x} ${defaultViewBox.y} ${defaultViewBox.width} ${defaultViewBox.height}`);
}

function removeListenersAndElement(element) {
    let elm = document.getElementById(element);
    elm.showPopover()
}

function showPopover(event, g, rect) {
    console.log("Mouse Over Show Popover")
    const popover = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const localPoint = getMousePosOnSvg(svg, event);

    popover.setAttribute('x', localPoint.x + 10);
    popover.setAttribute('y', localPoint.y + 10);
    popover.setAttribute('id', 'popover');
    popover.setAttribute('fill', 'black');
    // popover.textContent = `x: ${data.x}, y: ${data.y}, width: ${data.width}, height: ${data.height}`;
    // popover.textContent = `Fill Color: ${data.fillColor}, Stroke Color: ${data.strokeColor}, Stroke Width: ${data.strokeWidth}`;
    popover.textContent = `x: ${rect.getAttribute('x')}, y: ${rect.getAttribute('y')}, width: ${rect.getAttribute('width')}, height: ${rect.getAttribute('height')}`;

    g.appendChild(popover);

    g.addEventListener('mousemove', g.mousemove = function mousemove(event) {
        event.stopPropagation();
        // console.log("Inside MouseMove Event: ", event);
        const movePoint = getMousePosOnSvg(svg, event);
        popover.setAttribute('x', movePoint.x + 10);
        popover.setAttribute('y', movePoint.y + 10);
    }, false);

    g.addEventListener('mouseout', g.mouseout = function mouseout(event) {
        event.stopPropagation();
        // hidePopover();
        g.removeEventListener('mousemove', g.mousemove);
        g.removeEventListener('mouseout', g.mouseout);
        g.removeEventListener('click', g.click);
        console.log(popover.parentElement.mouseout);
        console.log(g.mouseout);
        g.removeChild(popover);
    }, false);

}

function hidePopover() {
    const popover = document.getElementById('popover');
    if (popover) {
        svg.removeChild(popover);
    }
}
