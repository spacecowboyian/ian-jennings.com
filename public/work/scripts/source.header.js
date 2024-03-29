//var widthKeeper = $('#source-header-applist').innerWidth();

function overflowMenu(event,ui){
	
	var childrenWidth = $('#source-header-applist ul li').outerWidth();
	var parentWidth = $('#source-header-applist').innerWidth();
	var itemCount = parseInt(parentWidth/childrenWidth);
	var currentCount = $('#source-header-applist ul li').not('.ui-sortable-helper').not('.ui-sortable-placeholder').length;
	var items = '.source-header-app-menu li';
	console.log($('#source-header-applist ul li').not('.ui-sortable-helper').not('.ui-sortable-placeholder'));
	if (currentCount < itemCount){
		difference = itemCount - currentCount;
		$('#source-header-overflow ul li:lt('+difference+')').appendTo('#source-header-applist ul');
	} else if (currentCount > itemCount) {
		itemCountNew = itemCount-1;
		$(items+':gt('+itemCountNew+')').prependTo('#source-header-overflow ul');
		$('#source-header-overflow a.overflow-button').effect('highlight',{},400);
	}
	$('#source-header-applist').css('overflow','visible');
	//$('#source-header-overflow a.overflow-button').effect('highlight',{},400);
}

function changeMenu(event,ui){
	
	var childrenWidth = $('#source-header-applist ul li').outerWidth();
	var parentWidth = $('#source-header-applist').innerWidth();
	var itemCount = parseInt(parentWidth/childrenWidth);
	var currentCount = $('#source-header-applist ul li').not('.ui-sortable-helper').length;
	var items = '.source-header-app-menu li';
	//console.log($('#source-header-applist ul li').not('.ui-sortable-helper').not('.ui-sortable-placeholder'));
	
	if (currentCount < itemCount){
		$('#source-header-overflow ul li:first').slideUp().appendTo('#source-header-applist ul').css('width','0px').slideDown().animate({width:'67px'});
	} else if (currentCount > itemCount) {
		$('#source-header-applist ul li:last').hide().prependTo('#source-header-overflow ul').slideDown();
		$('#source-header-overflow a.overflow-button').effect('highlight',{},400);
	}
	$('#source-header-applist').css('overflow','visible');
	//$('#source-header-overflow a.overflow-button').effect('highlight',{},400);
}

var resizeTimer = 0;
function doResize()
{
   if (resizeTimer)
   clearTimeout(resizeTimer);
   resizeTimer = setTimeout('overflowMenu()', 400);
}

$(document).ready(function(){
	//Make all links void
	$('a').not("[href]").attr('href','javascript:void(0);');

	$('#source-header-applist ul, #source-header-overflow ul').sortable({
		connectWith: '.source-header-app-menu ul',
		appendTo: 'body',
		//containment: '#source-header',
		start: function(event,ui){
			$('#source-header-applist ul').children('li').removeClass('before').removeClass('after');
			if ($(ui.placeholder).parents('div.source-header-app-menu').attr('id')=='source-header-applist'){
				//$(ui.placeholder).animate({width:'0px',margin:'0px'});
				//console.log(ui.placeholder);
			} else {
				//$(ui.placeholder).slideUp();
			}
			$(ui.placeholder).hide();
		},
		change: function(event,ui){
			//ui.placeholder.css('width','65px').css('margin','0px 1px').show();
			
			//$('#source-header-applist').css('overflow','hidden');
			$(ui.placeholder).show();
			changeMenu(event,ui);
			
		},
		stop: function(event,ui){
			$('#source-header-applist ul').children('li.active').prev().addClass('before');
			$('#source-header-applist ul').children('li.active').next().addClass('after');
			$('#source-header-applist ul, #source-header-overflow ul').sortable('refresh');
			
		}
	}).disableSelection();
	
	$(window).resize(function(){
		doResize();
		$('#source-header-applist').css('overflow','hidden');
	});
	
	overflowMenu();

	
	$('div#source-header-overflow a.overflow-button').click(function(){
		$('div#source-header-overflow ul#list-over').slideToggle(200);
	});
	
	$('div#source-header-appdrawer a.overflow-button').toggle(
		function(){
			$('div#source-header-appdrawer').animate({height:'210px'});
		},
		function(){
			$('div#source-header-appdrawer').animate({height:'55px'});
		}
	);
	$('div#source-header-appdrawer ul#bin').sortable({
		//revert: true,
		connectWith: 'div#source-header-appdrawer ul',
		start: function(event,ui){
			$('div#source-header-appdrawer ul#dock').children('li').removeClass('before').removeClass('after');
		},
		over: function(event,ui){
			$(ui.placeholder).show();
			$(ui.helper).removeClass('denied');
		},
		stop: function(event,ui){
			$('div#source-header-appdrawer ul#dock').children('li.active').prev().addClass('before');
			$('div#source-header-appdrawer ul#dock').children('li.active').next().addClass('after');
			$('div#source-header-appdrawer ul#dock').sortable('refresh');
			
		}
	});
	$('div#source-header-appdrawer ul#dock').sortable({
		//revert: true,
		start: function(event,ui){
			$(this).children('li').removeClass('before').removeClass('after');
		},
        over: function(event, ui) { 
         	if ($(this).children().length > 10 ) {
         		$(ui.placeholder).hide();
         		$(ui.helper).addClass('denied');
			}
		},
        receive: function(event, ui) { 
         	if ($(this).children().length > 10 ) {
         		$(ui.sender).sortable('cancel');
         		$(ui.helper).removeClass('denied');
			}
		},
		stop: function(event,ui){
			$(this).children('li.active').prev().addClass('before');
			$(this).children('li.active').next().addClass('after');
			$(this).sortable('refresh');
			
		},
		connectWith: 'div#source-header-appdrawer ul'
	});
});