const cursors = {
	0: 'default',
	1: 'nw-resize',
	2: 'ne-resize',
	3: 'sw-resize',
	4: 'se-resize',
	5: 'n-resize',
	6: 'e-resize',
	7: 's-resize',
	8: 'w-resize',
};

function getSide(x, y, offset) {
	if(offset === undefined)
		offset = 5;

	let _x, _y;

	// Top-left
	_x = app.selection.x;
	_y = app.selection.y;
	if(isInRange(x, _x - offset, _x + offset) && isInRange(y, _y - offset,  _y + offset))
		return 1;

	// Top-right
	_x = app.selection.x + (app.selection.parts.x * app.selection.width);
	_y = app.selection.y;
	if(isInRange(x, _x - offset, _x + offset) && isInRange(y, _y - offset, _y + offset))
		return 2;

	// Bottom-left
	_x = app.selection.x;
	_y = app.selection.y + (app.selection.parts.y * app.selection.height);
	if(isInRange(x, _x - offset, _x + offset) && isInRange(y, _y - offset,  _y + offset))
		return 3;

	// Bottom-right
	_x = app.selection.x + (app.selection.parts.x * app.selection.width);
	_y = app.selection.y + (app.selection.parts.y * app.selection.height);
	if(isInRange(x, _x - offset, _x + offset) && isInRange(y, _y - offset,  _y + offset))
		return 4;

	// Top
	_y = app.selection.y;
	if(isInRange(y, _y - offset, _y + offset))
		return 5;

	// Right
	_x = app.selection.x + (app.selection.parts.x * app.selection.width);
	if(isInRange(x, _x - offset, _x + offset))
		return 6;

	// Bottom
	_y = app.selection.y + (app.selection.parts.y * app.selection.height);
	if(isInRange(y, _y - offset, _y + offset))
		return 7;

	// Left
	_x = app.selection.x;
	if(isInRange(x, _x - offset, _x + offset))
		return 8;

	return 0;
}

function resizeSide(side, x, y) {
	// Top-left
	if(side == 1) {
		app.selection.x = app.selection.startX + x;
		app.selection.y = app.selection.startY + y;

		app.selection.width = app.selection.startW - Math.round(x / app.selection.parts.x) * (KEYS[KEY_SHIFT] ? 2 : 1);
		app.selection.height = app.selection.startH - Math.round(y / app.selection.parts.y) * (KEYS[KEY_SHIFT] ? 2 : 1);
	}
	// Top-right
	if(side == 2) {
		if(KEYS[KEY_SHIFT]) {
			app.selection.x = app.selection.startX - x;
		}
		app.selection.y = app.selection.startY + y;

		app.selection.width = app.selection.startW + Math.round(x / app.selection.parts.x) * (KEYS[KEY_SHIFT] ? 2 : 1);
		app.selection.height = app.selection.startH - Math.round(y / app.selection.parts.y) * (KEYS[KEY_SHIFT] ? 2 : 1);
	}
	// Bottom-left
	if(side == 3) {
		if(KEYS[KEY_SHIFT]) {
			app.selection.y = app.selection.startY - y;
		}
			
		app.selection.x = app.selection.startX + x;

		app.selection.width = app.selection.startW - Math.round(x / app.selection.parts.x) * (KEYS[KEY_SHIFT] ? 2 : 1);
		app.selection.height = app.selection.startH + Math.round(y / app.selection.parts.y) * (KEYS[KEY_SHIFT] ? 2 : 1);
	}
	// Bottom-right
	if(side == 4) {
		if(KEYS[KEY_SHIFT]) {
			app.selection.y = app.selection.startY - y;
			app.selection.x = app.selection.startX - x;
		}

		app.selection.width = app.selection.startW + Math.round(x / app.selection.parts.x) * (KEYS[KEY_SHIFT] ? 2 : 1);
		app.selection.height = app.selection.startH + Math.round(y / app.selection.parts.y) * (KEYS[KEY_SHIFT] ? 2 : 1);
	}
	// Top
	if(side == 5) {
		if(KEYS[KEY_ALT]) {
			app.selection.width = app.selection.startW - Math.round(y / app.selection.parts.y) * (KEYS[KEY_SHIFT] ? 2 : 1);
		}
		if(KEYS[KEY_SHIFT] && KEYS[KEY_ALT]) {
			app.selection.x = app.selection.startX + y;
		}

		app.selection.y = app.selection.startY + y;
		app.selection.height = app.selection.startH - Math.round(y / app.selection.parts.y) * (KEYS[KEY_SHIFT] ? 2 : 1);
	}
	// Right
	if(side == 6) {
		if(KEYS[KEY_SHIFT]) {
			app.selection.x = app.selection.startX - x;
		}
		if(KEYS[KEY_ALT]) {
			app.selection.height = app.selection.startH + Math.round(x / app.selection.parts.x) * (KEYS[KEY_SHIFT] ? 2 : 1);
		}
		if(KEYS[KEY_SHIFT] && KEYS[KEY_ALT]) {
			app.selection.y = app.selection.startY - x;
		}

		app.selection.width = app.selection.startW + Math.round(x / app.selection.parts.x) * (KEYS[KEY_SHIFT] ? 2 : 1);
	}
	// Bottom
	if(side == 7) {
		if(KEYS[KEY_SHIFT]) {
			app.selection.y = app.selection.startY - y;
		}
		if(KEYS[KEY_ALT]) {
			app.selection.width = app.selection.startW + Math.round(y / app.selection.parts.y) * (KEYS[KEY_SHIFT] ? 2 : 1);
		}
		if(KEYS[KEY_SHIFT] && KEYS[KEY_ALT]) {
			app.selection.x = app.selection.startX - y;
		}

		app.selection.height = app.selection.startH + Math.round(y / app.selection.parts.y) * (KEYS[KEY_SHIFT] ? 2 : 1);
	}
	// Left
	if(side == 8) {
		if(KEYS[KEY_ALT]) {
			app.selection.height = app.selection.startH - Math.round(x / app.selection.parts.x) * (KEYS[KEY_SHIFT] ? 2 : 1);
		}
		if(KEYS[KEY_SHIFT] && KEYS[KEY_ALT]) {
			app.selection.y = app.selection.startY + x;
		}

		app.selection.x = app.selection.startX + x;
		app.selection.width = app.selection.startW - Math.round(x / app.selection.parts.x)  * (KEYS[KEY_SHIFT] ? 2 : 1);
	}
}