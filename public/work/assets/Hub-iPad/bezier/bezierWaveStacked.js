// graphics constants
var gr;
var penBlue = new jsPen(new jsColor("#63A3FF"), 1);
var penRed = new jsPen(new jsColor("#9F0333"), 1);
var matrix = [];

function generateRandomMatrix(x,y) {
	return range(1,y).map(function() { 
		return generateRandomNumbers(x); 
	});
};

function generateRandomNumbers(n) {
	return range(.5,n).map(function() {
		return Math.random();
	});
};

init = function() {

	// create sliders
	$("#percentageSegments").slider({ min: 1, max: 10 });
	$("#dataPoints").slider({ min: 2, max: 25 });
	$("#control").slider({ min: 0, max: 1, step: 0.1 });
	
	bindSliderInputs();

	// events
	$("#percentageSegments").bind("slidechange", drawMain);
	$("#dataPoints").bind("slidechange", drawMain);
	$("#control").bind("slidechange", drawMain);
	$("#generate").bind("click", drawMain);

	drawMain();
};

getConfig = function() {
	return {
		frame: new jsPoint($(window).width(), $(window).height()),
		percentageSegments: $("#percentageSegments").slider("value"),
		dataPoints: $("#dataPoints").slider("value"),
		ctrlHorzOffsetPercent: $("#control").slider("value")
	};
};

bindSliderInputs = function() {

	$("input[data-forSlider]").each(function() {

		var inputEl = $(this);
		var sliderEl = $("#" + $(this).attr("data-forSlider"));

		// set the initial input value
		sliderEl.slider("value", inputEl.val());

		// when the input value changes, change the slider value
		inputEl.bind("change", function(ev) { 
			sliderEl.slider("value", inputEl.val());
		});

		// when the slider value changes, change the input value
		sliderEl.bind("slide", function(ev, ui) { inputEl.val(ui.value); });
	});
};

drawMain = function() {

	var config = getConfig();

	// create jsGraphics object
	gr = new jsGraphics(document.getElementById("canvas"));
	gr.clear();

	matrix = generateRandomMatrix(config.dataPoints, config.percentageSegments);
	//drawStackedIndexedSeries(matrix, gr.drawLine, penRed, config);
	drawStackedIndexedSeries(matrix, drawBezierCubic, penBlue, config);
};

/** @param ctrlHorzOffset	The horizontal offset of the control points as a percentage of the difference in x-coordinates of the given points. */
drawBezierCubic = function(pen, p1, p2, config) {
	var dx = (p2.x - p1.x) * config.ctrlHorzOffsetPercent;
	var c1 = new jsPoint(p1.x + dx, p1.y);
	var c2 = new jsPoint(p2.x - dx, p2.y);
	var points = [jsPointInt(p1), jsPointInt(c1), jsPointInt(c2), jsPointInt(p2)];
	gr.drawBezier(pen, points);
};

drawSeries = function(data, drawFunction, pen) {
	return drawIndexedSeries(data.map(function(x, i) {
		return { value: x, index: i };
	}), drawFunction, pen);
};

drawStackedIndexedSeries = function(matrix, drawFunction, pen, config) {
	var cumulativeData = range(1,matrix[0].length).map(function() { return 0; });
	matrix.each(function(data, i) {
		var penLighter = new jsPen(pen.color.getLighterShade(i*10), pen.width);
		cumulativeData = cumulativeData.map(function(value, i) { return value + data[i]; });
		drawIndexedSeries(cullTrendingData(cumulativeData), drawFunction, penLighter, config);
	});
};

/** A line draw function that takes a pen, p1, and p2. */
drawIndexedSeries = function(culledData, drawFunction, pen, config) {

	var dx = config.frame.x/culledData[culledData.length-1].index;
	var dy = 150;//frame.y/percentageSegments;

	for(var i=1; i<culledData.length; i++) {
		var p1 = new jsPoint(dx * culledData[i-1].index, config.frame.y - dy * culledData[i-1].value);
		var p2 = new jsPoint(dx * culledData[i].index, config.frame.y - dy * culledData[i].value);
		drawFunction(pen, p1, p2, config);
	};
};

/** Returns a new jsPoint rounding x and y to integers so it's safe for drawBezier. */
jsPointInt = function(p) {
	return new jsPoint(Math.round(p.x), Math.round(p.y));
};

/** Returns a list of {value, index} pairs. */
cullTrendingData = function(values) {

	var newvalues = [{ value: values[0], index: 0 }];
	for(var i=2; i<values.length; i++) {
		var left = values[i-2];
		var center = values[i-1];
		var right = values[i];
		if(left > center && right > center || 
		   left < center && right < center) {
			newvalues.push({
				value: center,
				index: i-1
			});
		}
	}
	newvalues.push({ value: values[values.length-1], index: values.length-1 });

	return newvalues;
};

$(init);
