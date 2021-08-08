var app = {
	selection: {
		// Selection style
		fillStyle: '0, 0, 0',
		strokeStyle: '#ffffff50',
		opacity: 0.5,
		// Selection position
		x: 0,
		y: 0,
		// mouseDown selection position & size
		startX: 0,
		startY: 0,
		startW: 0,
		startH: 0,
		// Selection size
		minWidth: 20,
		minHeight: 20,
		width: 100,
		height: 100,
		// Parts
		parts: {
			x: 1,
			y: 1
		}
	},
	layout: {
		// Layout (canvas) size
		width: 0,
		height: 0
	},
	mouse: {
		// Mouse pressed state
		pressed: false,
		// Mouse onPress position
		startX: 0,
		startY: 0,
		// Mouse position
		posX: 0,
		posY: 0
	},
	// Is resizing
	resize: false,
	// Side to resize
	side: 0
};

const image = document.getElementById('img');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mousemove', mouseMove);
document.addEventListener('mouseup', mouseUp);

const widthInput = document.getElementById('widthInput');
widthInput.setAttribute('min', app.selection.minWidth);
widthInput.addEventListener('change', onInputUpdate);

const heightInput = document.getElementById('heightInput');
widthInput.setAttribute('min', app.selection.minHeight);
heightInput.addEventListener('change', onInputUpdate);

const xInput = document.getElementById('xInput');
xInput.addEventListener('change', onInputUpdate);

const yInput = document.getElementById('yInput');
yInput.addEventListener('change', onInputUpdate);

const xParts = document.getElementById('xParts');
xParts.addEventListener('change', onInputUpdate);

const yParts = document.getElementById('yParts');
yParts.addEventListener('change', onInputUpdate);

const opacityInput = document.getElementById('opacityInput');
opacityInput.addEventListener('input', onInputUpdate);

image.addEventListener('load', init);
document.addEventListener('ready', init);
window.addEventListener('resize', init);
window.addEventListener('load', init);

document.getElementById('fileInput').onchange = function(e) {
	image.src = URL.createObjectURL(this.files[0]);
};


function init() {
	initCanvas();

	app.selection.x = Math.round((app.layout.width - (app.selection.parts.x * app.selection.width)) / 2);
	app.selection.y = Math.round((app.layout.height - (app.selection.parts.y * app.selection.height)) / 2);

	updateInputs();
	drawSelection();
}

function initCanvas() {
	canvas.width = app.layout.width = image.width;
	canvas.height = app.layout.height = image.height;
}

function mouseDown(e) {
	if(e.button == 2) {
		return;
	}

	app.selection.startX = app.selection.x;
	app.selection.startY = app.selection.y;

	app.selection.startW = app.selection.width;
	app.selection.startH = app.selection.height;

	app.mouse.startX = e.clientX - image.offsetLeft;
	app.mouse.startY = e.clientY - image.offsetTop;

	app.side = getSide(app.mouse.startX, app.mouse.startY, 8);
	app.resize = app.side != 0;

	app.mouse.pressed = true;
}

function mouseUp(e) {
	app.mouse.pressed = false;
	app.resize = false;

	document.body.style.cursor = 'default';
}

function mouseMove(e) {
	app.mouse.posX = e.clientX - image.offsetLeft;
	app.mouse.posY = e.clientY - image.offsetTop;

	let _side = getSide(app.mouse.posX, app.mouse.posY, 8);
	document.body.style.cursor = cursors[app.resize != false ? app.side : _side];

	if(!app.mouse.pressed || e.buttons != 1) {
		return;
	}
	let offsetX = app.mouse.posX - app.mouse.startX;
	let offsetY = app.mouse.posY - app.mouse.startY;

	// Resize
	if(app.resize) {
		resizeSide(app.side, offsetX, offsetY);
	}
	// Moving
	else {
		document.body.style.cursor = 'move';
		app.selection.x = app.selection.startX + offsetX;
		app.selection.y = app.selection.startY + offsetY;
	}

	applyConstraints();
	updateInputs();
	drawSelection();
}

function drawSelection() {
	// Apply styles
	ctx.fillStyle = `rgba(${app.selection.fillStyle}, ${app.selection.opacity})`;
	ctx.strokeStyle = app.selection.strokeStyle;

	// Redraw fill
	ctx.clearRect(0, 0, app.layout.width, app.layout.height);
	ctx.fillRect(0, 0, app.layout.width, app.layout.height);

	ctx.beginPath();

	let _x, _y;

	for(var y = 0; y < app.selection.parts.y; y++) {
		_y = app.selection.y + (y * app.selection.height);

		for(var x = 0; x < app.selection.parts.x; x++) {
			_x = app.selection.x + (x * app.selection.width);

			ctx.clearRect(_x, _y, app.selection.width, app.selection.height);

			if(y == 0) {
				// Left
				ctx.moveTo(_x, 0);
				ctx.lineTo(_x, app.layout.height);

				// Right
				if(x == app.selection.parts.x - 1) {
					ctx.moveTo(_x + app.selection.width, 0);
					ctx.lineTo(_x + app.selection.width, app.layout.height);
				}
			}
		}

		// Top
		ctx.moveTo(0, _y);
		ctx.lineTo(app.layout.width, _y);

		// Bottom
		if(y == app.selection.parts.y - 1) {
			ctx.moveTo(0, _y + app.selection.height);
			ctx.lineTo(app.layout.width, _y + app.selection.height);
		}
	}
	ctx.stroke();
}

function applyConstraints() {
	// Selection size
	app.selection.width = clamp(app.selection.width, app.selection.minWidth, app.layout.width);
	app.selection.height = clamp(app.selection.height, app.selection.minHeight, app.layout.height);

	// Selection position
	app.selection.x = clamp(app.selection.x, 0, app.layout.width - (app.selection.width * app.selection.parts.x));
	app.selection.y = clamp(app.selection.y, 0, app.layout.height - (app.selection.height * app.selection.parts.y));
	
	// Refactor this
	app.selection.x = clamp(app.selection.x, 0, app.selection.x);
	app.selection.y = clamp(app.selection.y, 0, app.selection.y);

	// Selection parts
	app.selection.parts.x = clamp(app.selection.parts.x, 1, Math.floor(app.layout.width / app.selection.width));
	app.selection.parts.y = clamp(app.selection.parts.y, 1, Math.floor(app.layout.height / app.selection.height));
}

function updateInputs() {
	widthInput.value = app.selection.width;
	heightInput.value = app.selection.height;

	xInput.value = app.selection.x;
	yInput.value = app.selection.y;

	xParts.value = app.selection.parts.x;
	yParts.value = app.selection.parts.y;

	opacityInput.value = app.selection.opacity;
}

function onInputUpdate() {
	app.selection.width = Math.round(widthInput.value);
	app.selection.height = Math.round(heightInput.value);

	app.selection.x = Math.round(xInput.value);
	app.selection.y = Math.round(yInput.value);

	app.selection.parts.x = Math.round(xParts.value);
	app.selection.parts.y = Math.round(yParts.value);

	app.selection.opacity = opacityInput.value;

	applyConstraints();
	updateInputs();
	drawSelection();
}

function getFullSelectionCanvas() {
	let ratio = image.width / image.naturalWidth;

	let _canvas = document.createElement('canvas');
	let _ctx = _canvas.getContext('2d');
	_canvas.width = (app.selection.parts.x * app.selection.width) / ratio;
	_canvas.height = (app.selection.parts.y * app.selection.height) / ratio;

	let _x, _y;
	for(var y = 0; y < app.selection.parts.y; y++) {
		_y = (app.selection.y + (y * app.selection.height));
		for(var x = 0; x < app.selection.parts.x; x++) {
			_x = (app.selection.x + (x * app.selection.width));

			_ctx.drawImage(image,
				_x / ratio, _y / ratio,
				app.selection.width / ratio, app.selection.height / ratio,
				x * app.selection.width / ratio, y * app.selection.height / ratio,
				app.selection.width / ratio, app.selection.height / ratio);
		}
	}
	return _canvas;
}

document.getElementById('saveBtn').addEventListener('click', function() {
	var zip = new JSZip();

	let origW = image.naturalWidth;
	let origH = image.naturalHeight;
	let ratio = image.width / origW;

	let _canvas = document.createElement('canvas');
	let _ctx = _canvas.getContext('2d');
	_canvas.width = app.selection.width / ratio;
	_canvas.height = app.selection.height / ratio;

	// _canvas.position = 'absolute';
	// document.body.append(_canvas);

	let _x, _y, idx = 0;
	for(var y = 0; y < app.selection.parts.y; y++) {
		_y = (app.selection.y + (y * app.selection.height));
		for(var x = 0; x < app.selection.parts.x; x++) {
			_x = (app.selection.x + (x * app.selection.width));

			_ctx.drawImage(image,
				_x / ratio, _y / ratio,
				_canvas.width, _canvas.height,
				0, 0, _canvas.width, _canvas.height);

			zip.file(`${++idx}.jpg`, _canvas.toDataURL('image/jpg').split(',')[1], {base64: true});
		}
	}

	zip.file('img_full.jpg', getFullSelectionCanvas().toDataURL('image/jpg').split(',')[1], {base64: true});

    zip.generateAsync({
        type: "base64"
    }).then(function(content) {
        window.location.href = "data:application/zip;base64," + content;
    });
});