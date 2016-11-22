//index.html
//jQuery
$(function(){
	//左侧滑动栏
	$(".baseUI>li>ul").hide();
	$(".baseUI>li").off("mouseover");
	$(".baseUI>li").on("mouseover",function(){
		if ($(this).children('ul').css("display") == "none") {
			$(".baseUI>li").children('ul').slideUp();
			$(this).children('ul').slideDown();
		}
	});
	//点击的时候添加class
	$(".baseUI>li>ul").on("click","li",function(event){
		if ( !$(this).hasClass('current') ) {
			$(this).addClass('current').siblings().removeClass('current');
		}
	});
});
$(document).ready(function(){
	//模拟鼠标移入事件
	$(".baseUI>li").eq(0).trigger("mouseover");
	$(".baseUI>li>ul>li").eq(0).trigger("click");
});

//angular
var app = angular.module('myApp',['ngRoute','app.allSub']);	//注入路由
app.config(["$routeProvider",function($routeProvider){
	$routeProvider.when("/loadhtml/allSubject/a/:a/b/:b/c/:c/d/:d",{
		templateUrl:"loadhtml/allSubject.html",
		controller:"allSubCtrl"
	}).when("/loadhtml/addSubject",{
		templateUrl:"loadhtml/addSubject.html",
		controller:"allSubCtrl"
	});
}]);


