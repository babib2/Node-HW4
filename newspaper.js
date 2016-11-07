// подключаем express
var express = require('express');
// создаем приложение
var app = express();
// подключаем поддержку шаблонизаторов
var templating = require('consolidate').handlebars;
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');

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

			res.render('news', {
				category: category,

			});		
		}


	});	

});

app.post('/category/', function(req, res){
		var category= [];
		var uri;
		var url;
		
		
		if(req.body.title == 'Лучшие'){
			uri = 'top/';		
		}
		if(req.body.title == 'Интересные'){
			uri = 'interesting/';	 
		}else{
			uri = 'all/';
					
		} 	
		url = 'https://habrahabr.ru/'+ uri;

		 request(url, function (error, response, html) {
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
});


app.listen(8070, function(){
	console.log("Server start");

})
