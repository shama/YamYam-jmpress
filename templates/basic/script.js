$(function() {
	$.jmpress("template", "main", {
		children: function(idx) {
			return {
				x: 0,
				y: idx * 950
			}
		}
	});
	$.jmpress("template", "title", {
		scale: 4,
		x: -6000,
		y: -1000
	});
	$.jmpress("template", "end", {
		scale: 4,
		x: -6000
	});
	$.jmpress("template", "subtitle", {
		scale: 2,
		x: -2000
	});
	$.jmpress("template", "page", {});
	$("#jmpress").jmpress("toggle", 27, {
		viewPort: {
			height: 768,
			width: 1024,
			maxScale: 1
		},
		stepSelector: "section",
		presentationMode: {
			url: "http://sokra.github.com/jmpress.js/presentation-screen.html"
		}
	}, true);
});