var yamyam = require("YamYam"),
	jade = require("jade"),
	fs = require("fs");

var sources = fs.readdirSync("src");

var annotations = {
	"@jmpress": function(attrs, annotation) {
		if(annotation.params.animation) {
			attrs["data-jmpress"] = annotation.params.animation;
		}
	},
	"@right": function(attrs) {
		attrs["class"] = (attrs["class"] || "") + "right";
	},
	"@attrs": yamyam.HtmlFormater.ATTRS
}

var stat;
try {
	stat = fs.statSync("out");
} catch(e) {}
if(!stat || !stat.isDirectory())
	fs.mkdirSync("out");

sources.forEach(function(file) {
	console.log(file + " reading...");
	fs.readFile("src/" + file, "utf-8", function(err, fileContent) {
		if(err) {
			console.error("ERROR reading " + file + ": " + err);
			throw err;
		}
		yamyam.parse(fileContent, { format: { block: false, annotations: annotations } }, function(err, result) {
			if(err) {
				console.error("ERROR in " + file + ": " + err);
				throw err;
			}
			/*
				result = 
				[ { annotations: [...],
					content: "..." } ]
			*/
			var blocks = [],
				data = { sections: blocks, settings: {} };
			result.forEach(function(block) {
				var page = {content: block.content};
				
				block.annotations.forEach(function(annotation) {
					if(annotation.name === "@settings" || annotation.name === "@setting") {
						for(var name in annotation.params) {
							data.settings[name] = annotation.params[name];
						}
					} else {
						if(annotation.name) {
							page.template = page["class"] = annotation.name;
						}
						for(var name in annotation.params) {
							page[name] = annotation.params[name];
						}
					}
				});
				
				blocks.push(page);
			});
			console.log(file + " yam read! Now read template...");
			if(!data.settings.template)
				data.settings.template = "basic";
			if(!data.settings.output)
				data.settings.output = file.substr(0, file.indexOf("."));
			fs.readFile("templates/"+data.settings.template+".jade", "utf-8", function(err, templateContent) {
				if(err) {
					console.error("ERROR reading template for " + file + ": " + err);
					throw err;
				}
				var template = jade.compile(templateContent, {});
				fs.writeFile("out/" + data.settings.output + ".html", 
					template(data), "utf-8", function(err) {
					console.log("SUCCESSFUL: " + file + " -> " + data.settings.output);
				});
			});
		});
	});
});




