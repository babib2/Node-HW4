// подключаем express
var express = require('express');
// создаем приложение
var app = express();
// подключаем поддержку шаблонизаторов
var templating = require('consolidate').handlebars;
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');
var yandexParser = require('./yandex');
var habraParser = require('./habra');



// выбираем функцию шаблонизации для hbs
app.engine('hbs', templating);
// по умолчанию используем .hbs шаблоны%
app.set('view engine', 'hbs');
// указываем директорию для загрузки шаблонов
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded());
// обрабатываем запросы к главной странице
app.get('/', function(req, res){
// выводим данные на основе шаблона
	res.render('hello');
});
app.post('/news/', function(req, res){

		if(req.body.serves == 'habra'){	
			res.render('news', {
						category: habraParser.category,
						link: 'habra',
					});	
		}
		if(req.body.serves == 'yandex'){
			res.render('news', {
						category: yandexParser.category,
						link: 'yandex',
					});	
		}

});

app.post('/category/', function(req, res){
	var category= [];
		if(req.body.serves == 'habra'){	
			

			 request(req.body.title, function (error, response, html) {
				if (!error && response.statusCode == 200) {

					var $ = cheerio.load(html);
					
					$(".post_teaser").each(function(i, element){

						var attr = {};
						attr.title= $(element).find('.post__title').text().trim();
						attr.text = $(element).find('.content').text().trim();
								
						category.push(attr);
					 });		
					 							
				}
										

				res.render('category', {
					news: category,

				});	
			});	
		}
		if(req.body.serves == 'yandex'){
			request('https://news.yandex.ru' + req.body.title, function (error, response, html) {
				if (!error && response.statusCode == 200) {

					var $ = cheerio.load(html);
					$('.rubric__right .story__content').each(function(i, element){
						var attr = {};
						attr.title = $(element).find('.story__title > a').text().trim();
						attr.text = $(element).find('.story__text').text();
						// console.log(attr.category);
						// console.log(attr.href);
						category.push(attr);
						console.log(category);
					 });	
				}
					res.render('category', {
							news: category,
					});	
			});	
		}
		

		
});


app.listen(8080, function(){
	console.log("Server start");

})
