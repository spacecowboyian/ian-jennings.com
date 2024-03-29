$.fn.menuMouse = function(){
	$(this).children('ul').children('li').hoverIntent(function(){
		if ($(this).children('.drop').hasClass('right')){
			var rightOffset = $(this).children('.drop').outerWidth() - $(this).outerWidth();
			$(this).children('.drop').css('margin-left','-'+rightOffset+'px');
		}
		$(this).children('.drop').slideDown(200);
		$(this).children('a').addClass('active');
	},
	function(){
		$(this).children('.drop').slideUp(200);
		$(this).children('a').removeClass('active');
	});
}

$.fn.menuClick = function(){
	$(this).children('ul').children('li').children('a').click(function(){
		newThis = $(this).parent();
		if ($(newThis).hasClass('active')){
			$(newThis).removeClass('active').children('.drop').slideUp(200);
		} else {
			$(newThis).parent().children('.active').removeClass('active').children('.drop').slideUp(200);
			$(newThis).addClass('active');
			if ($(newThis).children('.drop').hasClass('right')){
				var rightOffset = $(newThis).children('.drop').outerWidth() - $(newThis).outerWidth();
				$(newThis).children('.drop').css('margin-left','-'+rightOffset+'px');
				}
			$(newThis).children('.drop').slideDown(200);
		}
	});
}

$.fn.menuPopSearch = function(){
	$(this).children('input').focus(function(){
		$(this).attr('value','');
	});
	$(this).children('input').keyup(function(){
		if ($(this).attr('value')==''){
			$(this).parent().siblings('.dd-ahead').slideUp(200);
		} else {
			$(this).parent().siblings('.dd-ahead').slideDown(200);
		}
	});
}

$.fn.listClick = function(){
	$(this).children('ul').children('li').click(function(){
		$(this).parent().children('.active').removeClass('active');
		$(this).addClass('active');
	});
}

$.fn.waveLimit = function(){
	container = $(this).parent().parent();
	wavelimitPos = $(this).position({of:$(this).parent().parent()});
	leftLimit = wavelimitPos.left+'px';
	otherWidth = wavelimitPos.left+$(this).width();
	remainder = container.width()-otherWidth;
	rightLimit = remainder+'px';
	//console.log(rightLimit);
	$('#wave-limit-left').css('width',leftLimit);
	$('#wave-limit-right').css('width',rightLimit).css('right',$(window).width()-(container.offset().left+container.width())+'px');
}

$.fn.appPanel = function(){
	$(this).siblings().removeClass('active');
	$(this).addClass('active');
	var panelID = $('#app-nav li').index(this);
	var panelMove = -422 * panelID;
	$('.app-screen.active').removeClass('active');
	$('.app-screen').eq(panelID).addClass('active');
	$('#app-screen-container').animate({
		marginLeft: panelMove+'px'
	},400,'jswing');
}


$(document).ready(function(){

	//Make all links void
	$('a').not("[href]").attr('href','javascript:void(0);');
	$('.horiz-menu').menuClick();
	$('.horiz-menu.dropdown .drop .dd-search').menuPopSearch();

	if ($('#wave-limit-mid').length!=0){	

		$('#wave-limit-mid').waveLimit();
		$('#wave-limit-mid').draggable({
			axis:'x',
			containment:'parent',
			drag: function(event, ui) {
				$(this).waveLimit();
			}
		});
	}
	
	//Make stack module sortable	
	$( ".module.connected .list ul" ).sortable({
		axis: 'y',
		items: '.item:not(.static)',
		scrollSpeed: 40,
		containment: '.module.connected .list ul',
		forcePlaceholderSize: true,
		delay: 200
	}).disableSelection();
	$('.module.connected .list').listClick();
	
	$('#content .post-list .item').draggable({
		revert:'true',
		helper: function( event ) {
				return $( '<img src="images/hub-item-drag-helper.png"/>' );
			},
		cursorAt: { top: 0, left: 0 }
	});
	$( '.module.connected .list .item' ).droppable({
			accept: "#content .post-list .item",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				$( this ).effect("highlight", {}, 3000);
			}
	});
	
	$('#app-nav li').click(function(){
		$(this).appPanel();
	});
	
	$(document).keypress(function(e){
		//console.log(e.which);
		switch(e.which){
			// user presses right arrow
			case 49:
				$('#app-nav li').eq(0).appPanel();
			break;
			case 50:
				$('#app-nav li').eq(1).appPanel();
			break;
			case 51:
				$('#app-nav li').eq(2).appPanel();
			break;
			case 52:
				$('#app-nav li').eq(3).appPanel();
			break;
			case 53:
				$('#app-nav li').eq(4).appPanel();
			break;
			case 54:
				$('#app-nav li').eq(5).appPanel();
			break;
			
		}
		
		
	});
	
	
});
