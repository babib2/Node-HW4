var request = require('request');
var cheerio = require('cheerio');
var category= [];
	request('https://news.yandex.ru/', function (error, response, html) {
			// console.log('news yandex');
				if (!error && response.statusCode == 200) {
			// console.log('200 OK');		
					var $ = cheerio.load(html);
					 $('.nav-by-rubrics_theme_nav-gray > .tabs-menu > li').each(function(i, element){
							var attr = {};
							attr.category = $(element).find('a').text().trim();
							attr.href = $(element).find('a').attr('href');
							// console.log(attr.category);
							// console.log(attr.href);
							category.push(attr);	
						 });
					// console.log("asd");		
					 //console.log(category);

					
				}
			});
	module.exports = {category};