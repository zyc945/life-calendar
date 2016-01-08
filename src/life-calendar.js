(function () {
	"use strict";

	var _px = 0.5; // correcting pixels

	// "consts"
	var BOX_SIZE = 13,
		BOX_MARGIN = 3,
		BOX_SIZE_REAL = BOX_SIZE - BOX_MARGIN,

		TABLE_LEFT = 40,
		TABLE_TOP = 70,
	
		COUNT_WEEKS = 52,
		COUNT_YEARS = 90,

		DEF_STROKE_COLOR = '#000',
		DEF_FILL_COLOR = '#000',
		DEF_BOX_COLOR = '#FFF',
		PASTDAY_COLOR = '#000',

		AXIS_LEFT_TEXT = '← Age',
		AXIS_TOP_TEXT = 'Week of the Year →';

	// canvas
	var c = document.createElement('canvas');
	c.width = 725;
	c.height = 1250;
	var ctx = c.getContext('2d');
	ctx.strokeStyle = DEF_STROKE_COLOR;
	ctx.fillStyle = DEF_FILL_COLOR;
	ctx.font = '13px sans-serif';

	// dates
	var currentDate = new Date();
	var bDate = null;

	clearCanvas();
	drawAxis();
	drawMetric();

	// public
	window.LC = {
		init: function (element) {
			element.appendChild(c);
			this.update(null);
		},
		update: function (_bDate) {
			bDate = _bDate || new Date();

			drawTable(COUNT_YEARS, COUNT_WEEKS, generateDates());
		}
	};
	

	// CALENDAR

	function generateDates () {
		var i, j, years = [], weeks;
		for (i = 0; i < COUNT_YEARS; i++) {
			weeks = [];
			for (j = 1; j <= COUNT_WEEKS; j++) {
				var day = getDayObj(i, j);
				weeks.push(day);
			}
			years.push(weeks);
		}
		return years;
	}
	
	function getDayObj(year, week) {
		var weeks = year * COUNT_WEEKS + week;
		var date = addDays(bDate, weeks * 7);
		return {
			isPast: (currentDate - date) > 0
		};
	}
	function addDays (date, days) {
		var clone = new Date(date.getTime());
		clone.setDate(date.getDate() + days);
		return clone;
	}

	// CANVAS

	function clearCanvas () {
		ctx.clearRect(0, 0, c.width, c.height);
	}
	function drawAxis (textLeft, textTop) {
		ctx.textAlign = 'left';

		// left axis
		ctx.save();
		ctx.translate(20, TABLE_TOP + 40);
		ctx.rotate(-Math.PI/2);
		ctx.translate(-20, -(TABLE_TOP + 40));
		ctx.fillText(AXIS_LEFT_TEXT, 20, TABLE_TOP + 40);
		ctx.restore();

		// top axis
		ctx.fillText(AXIS_TOP_TEXT, TABLE_LEFT, TABLE_TOP - 35);
	}
	function drawMetric () {
		// left metric
		ctx.textAlign = 'right';
		for (var i = 0; i < COUNT_YEARS; i++) {
			if (i % 5 === 0) {
				ctx.fillText(i, TABLE_LEFT - 5, TABLE_TOP + 10 + i * BOX_SIZE);
			}
		}

		// top metric
		ctx.textAlign = 'left';
		for (var i = 1; i < COUNT_WEEKS; i++) {
			if (i % 5 === 0 || i === 1) {
				ctx.fillText(i, TABLE_LEFT + (i - 1) * BOX_SIZE, TABLE_TOP - 10);
			}
		}
	}
	function drawTable (rows, cols, values) {
		for (var i = 0; i < rows; i++) {
			drawRow(i, cols, values[i]);
		}
	}
	function drawRow (row, cols, values) {
		for (var i = 0; i < cols; i++) {
			// color by type
			ctx.fillStyle = values[i].isPast ? PASTDAY_COLOR : DEF_BOX_COLOR;

			drawRect(TABLE_LEFT + i * BOX_SIZE, TABLE_TOP + row * BOX_SIZE);
		}
	}
	function drawRect (x, y) {
		ctx.fillRect(_px + x, _px + y, BOX_SIZE_REAL, BOX_SIZE_REAL);
		ctx.strokeRect(_px + x, _px + y, BOX_SIZE_REAL, BOX_SIZE_REAL);
	}

}());