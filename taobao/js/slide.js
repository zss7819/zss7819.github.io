$(function(){
//	js轮播图
	var index = 0;				
	function change() {
		index ++;
		if(index >7){
			index = 0;
		}
		//fadeTo() 方法将被选元素的不透明度逐渐地改变为指定的值(（褪色效果)。
		$(".slide_01 .imgList li a img").fadeTo(0, 0.5).hide();
		$(".slide_01 .imgList li a").eq(index).find('img').show().fadeTo(400, 1);
		$(".slide_01 .indexList li").eq(index).addClass('cur').siblings('li').removeClass('cur');											
	}
	
	var timer = setInterval(change, 2000);  //定时器
	$(".slide_01 .imgList").hover(function(){		//鼠标移入悬停效果
		clearInterval(timer);
	},function(){
		timer = setInterval(change, 2000);
	});
	
	$(".slide_01 .indexList li").mouseover(function() {  
		index = $(this).index();
		$(this).addClass('cur').siblings('li').removeClass('cur');
		$(".slide_01 .imgList li a img").fadeTo(0, 0.5).hide();
		$(".slide_01 .imgList li a").eq(index).find('img').show().fadeTo(400, 1);
	});	
});
			