var request = require('request');
var cheerio = require('cheerio');
var category= [];
request('https://habrahabr.ru/', function (error, response, html) {

				if (!error && response.statusCode == 200) {
					
					var $ = cheerio.load(html);
					 $('.tabs-menu_habrahabr li').each(function(i, element){
							var attr = {};
							attr.category = $(element).find('span').text().trim();
							attr.href = $(element).find('a').attr('href');
							// console.log(attr.category);
							// console.log(attr.href);
							category.push(attr);
						 });
					
					 //console.log(category);

						
				}


			});
module.exports = {category};