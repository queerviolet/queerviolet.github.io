var cybermedium = require("./defaultFont");

module.exports = function(text, font){
	if(typeof font === typeof undefined) font = cybermedium;
	
	var result = [];
	
	text.split("").forEach(function(char){
		font[char.toLowerCase()].forEach(function(line, i){
			result[i] = (result[i] || "") + line;
		});
	});
	
	return {
		print: function(){
			result.forEach(function(line){
				console.log(line);
			});
		},
		raw: function(){
			return result;
		}
	};
};