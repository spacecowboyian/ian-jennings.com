

$(document).ready(function(){

	var image,imageWidth,background,loop,openCaliper;
	dot = jQuery('<div/>',{class:'loop-dot'});
	caliper = jQuery('<div/>',{class:'caliper'}).html('<span class="size"></span>');
	$('img.stage-image').load(function(){
		image = $(this).attr('src');
		imageWidth = $(this).width();
		$('div.stage').css({
			width:$(this).width(),
			height:$(this).height()
		});
		background = jQuery('<img/>',{src:image,class:'loop-image',width:imageWidth * 4});
		loop = jQuery('<div/>',{class: 'loop'}).html(background).append(dot);
	});
	$('div.stage').hover(function(e){ 
		$(this).append(loop);
		//console.log((e.pageY + 15)+','+(e.pageX + 15));
	},function(){
		loop.remove();
	});
	$('div.stage').mousemove(function(e){
		var offset = $(this).offset();
		$(loop).css({
            top: e.pageY-offset.top-10-100 + "px",
            left: e.pageX-offset.left-10-100 + "px"
        });
        $(background).css({
        	top: "-"+parseInt((e.pageY-offset.top)*4-140)+"px",
            left: "-"+parseInt((e.pageX-offset.left)*4-136)+"px"
        });
    });
	$('div.stage').click(function(e){
		var offset = $(this).offset();
		calTop = e.pageY-offset.top-12;
		calLeft = e.pageX-offset.left-10;
		if (!openCaliper){
			e.preventDefault();
			$(caliper).clone().appendTo('div.stage').addClass('open').css({
				top:calTop+'px',
				left:calLeft+'px'
			});
			$('div.caliper.open span').hide();
			openCaliper = 1;
		} else {
			$('div.caliper.open span').show();
			calPos = $('div.caliper.open').offset();
			yDif = Math.abs(e.pageY-calPos.top);
			xDif = Math.abs(e.pageX-calPos.left);
			if (yDif > xDif){
				console.log(e.pageY);
				$('div.caliper.open').height(yDif+2);
				if (e.pageY<calPos.top){
					$('div.caliper.open').css('top',calTop+2+'px');
				}
				$('div.caliper.open span').text(yDif+2+'px').css('margin-top',(yDif)/2.25);
			} else {
				console.log('X WINS!');
				$('div.caliper.open').width(xDif+2);
				if (e.pageX<calPos.left){
					$('div.caliper.open').css('left',calLeft+2+'px');
				}
				$('div.caliper.open span').text(xDif+2+'px').css('margin-left',(xDif)/2.25);
			}
			
			$('div.caliper.open').removeClass('open');
			openCaliper = null;
		}
	});
});