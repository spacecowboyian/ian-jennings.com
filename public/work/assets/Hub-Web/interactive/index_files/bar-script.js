var currentMenu;
var newMenu;
var chatRoomCount = 0;
var currentEdit;



//set menus to proper height
function menuHeight(menu,items){
	$(menu).addClass('open');
	if (typeof items == "undefined"){items = $(menu +' ul li')}
	listHeight = 0;
	items.each(function(){
		listHeight = listHeight + $(this).outerHeight();
	});
	percHeight = $(window).height()*.6;
	if (listHeight >= percHeight){
		newHeight = percHeight + 44;
	} else {
		newHeight = listHeight + 44;
	}
	$(menu).animate({height:newHeight},200,function(){
		$(menu).children('ul').not('.section ul').css('height',newHeight-$(menu).children('h2').outerHeight()+'px');
	});
};
//Open and close menus
function menuMouse(element){
	$('.hub-overlay').remove();
	newMenu  = $(element).parent().attr('id');
	if (newMenu != currentMenu){
		$('#hub-menu ul li a.button.active').removeClass('active');
		$(element).addClass('active');
		if(currentMenu){
			$('#'+currentMenu).parent().children('.button').removeClass('active');
			$('.popout.open').removeClass('open').animate({height:'0'},200,function(){	
				menuHeight('#'+newMenu +' .popout');
				currentMenu  = newMenu;
			});
			
		}  else {
		 	menuHeight('#'+newMenu +' .popout');
			currentMenu  = newMenu;
		}
	} else {
		$('#hub-menu ul li a.button.active').removeClass('active');
		$('#'+currentMenu+' .popout').removeClass('open').animate({height:'0'},200);
		currentMenu = '';
	}
}

//Fake the chat
function roboChat(input){
	$(input).parents('.chat-window').children('.chat-stream').append('<li class="them"><p class="username">'+$(input).parents('.chat-window').parent().children('span').text()+'</p><p class="message">The OTC business has been remarkably successful</p></li>');
	$(input).parents('.chat-window').children('.chat-stream').scrollTop($(input).parents('.chat-window').children('.chat-stream')[0].scrollHeight);
}

function chatSubmit(input){
	if ($(input).hasClass('used')){
		$(input).parents('.chat-window').children('.chat-stream').append('<li class="me"><p class="username">John Username</p><p class="message">'+$(input).attr('value')+'</p></li>');
		setTimeout(function(thisObj) { roboChat(input); }, 1000, this);
	} else {
		$(input).parents('.chat-window').children('.chat-stream').html('<li class="me"><p class="username">John Username</p><p class="message">'+$(input).attr('value')+'</p></li>');
		$(input).addClass('used');
		setTimeout(function(thisObj) { roboChat(input); }, 1000, this);
	}
	$(input).parents('.chat-window').children('.chat-stream').scrollTop($(input).parents('.chat-window').children('.chat-stream')[0].scrollHeight);
	$(input).attr('value','');
}


//Submit chat on enter
function submitenter(myfield,e){
	var keycode;
	if (window.event) keycode = window.event.keyCode;
	else if (e) keycode = e.which;
	else return false;
	
	if (keycode == 13)
	   {
	   chatSubmit(myfield);
	   return false;
	   }
	else
	   return true;
}

function openChat(chatName,ids){
	chatState = '';
	chatID = chatName.replace(/ /gi,'-');
	chatType = chatID.split('-');
	chatType = chatType[0];
	if($(this).parent().hasClass('active')){chatState = ' active';}
	if ($('#chat-'+chatID).length==0){
		$('#hub #chat').prepend('<li class="chat-user" id="chat-'+chatID+'" style="display:none"><a class="hub-chat-status'+chatState+'"></a><span class="hub-chat-name">'+chatName+'</span></li>');
		$('#hub #chat li.open .chat-window').slideUp(200);
		$('#hub #chat li.open').removeClass('open');
		$('#chat-'+chatID).animate({
			width: 'toggle'
		},function(){
			$('#hub .chat-window').clone().appendTo('#chat-'+chatID);				
			$('#chat-'+chatID+' .chat-window form').attr({name:'input-'+chatID, onunfocus:'chatSubmit("input'+chatID+'")'});
			$('#chat-'+chatID+' .chat-window').slideDown(200);
			$('#chat-'+chatID+' .chat-window textarea').focus();
			if (chatType == 'group'){
				$('#chat-'+chatID+' .chat-window').addClass('group');
				$('#chat-'+chatID+' .chat-window h2').show();
				$.each(ids,function(key,value){
					content = $('.section #'+value).parent().clone();
					content.children('a.contact').attr('id','ingroup-'+value);
					content.appendTo('#chat-'+chatID+' .chat-window .party');
					
				});
				$('#chat-'+chatID+' .chat-window h2 a.group-count b').text(ids.length);
			}
		}).addClass('open').draggable({
			containment: '#hub #chat',
			forcePlaceholderSize: true,
			helper: 'clone',
			start: function(event,ui){
				$(this).children('.chat-window').slideUp(200);
				$(this).removeClass('open');
			}
		}).disableSelection();
		
	} else {
		$('#hub #chat li.open .chat-window').slideUp(200,function(){
			$('#hub #chat li.open').removeClass('open');				
		});
		$('#chat-'+chatID+' .chat-window').slideDown(200,function(){
			$('#chat-'+chatID).addClass('open');
			$('#chat-'+chatID+' .chat-window textarea').focus();
			$('#chat-'+chatID+' .chat-window .chat-stream').scrollTop($('#chat-'+chatID+' .chat-window .chat-stream')[0].scrollHeight);	
		});
		
		
	}
	$('#hub-menu-team .section.selected').removeClass('selected');
	$('.group-menu span, .group-menu .hub-group-start, .group-menu .hub-group-cancel').remove();
	$('.group-menu span').hide();
	$('.group-menu a.on').removeClass('on').show();
	$('#hub-menu-team .item a.contact, #hub-menu-team .section-head a.contact-group').css('margin-left','0');
	$('#hub-menu-team .item input, #hub-menu-team .section-head input').remove();
}

function updateChat(chatID,ids){
	$('#'+chatID+' .chat-window .party').empty();
	$.each(ids,function(key,value){
		content = $('.section #'+value).parent().clone();
		content.children('a.contact').attr('id','ingroup-'+value).css('margin-left','0');
		content.children('input').remove();
		content.appendTo('#'+chatID+' .chat-window .party');
	});
	$('#hub-menu-team .section.selected').removeClass('selected');
	$('.group-menu span, .group-menu .hub-group-start, .group-menu .hub-group-cancel, .group-menu .hub-group-update').remove();
	$('.group-menu span').hide();
	$('.group-menu a.on').removeClass('on').show();
	$('#hub-menu-team .item a.contact, #hub-menu-team .section-head a.contact-group').css('margin-left','0');
	$('#hub-menu-team .item input, #hub-menu-team .section-head input').remove();
}

function updateClick(e){
	var groupChat = Array();
	$('#hub-menu-team .section .item input:checked').each(function(index){
		groupChat[index] = $(this).parent().children('.contact').attr('id');
	});
	//console.log(groupChat);
	updateChatID = $(e).parents('.group-menu').attr('id');
	chatID = updateChatID.replace('edit-','');
	updateChat(chatID,groupChat);
	$('#hub-menu-team .group-menu').attr('id','');
	$('#'+chatID+' .group-edit').text('Edit');
	$('#'+chatID+' .group-count b').text(groupChat.length);
}

function overlay(){
	$('<div class="hub-overlay"></div>').insertBefore('#hub');
}

function loadMessage(ID){
	$('.hub-overlay').remove();
	ID = ID.split('-');
	ID = ID[1];
	overlay();
	$('.hub-message-window').clone().attr('id','show-'+ID).appendTo('.hub-overlay').show();
	threadWin = $('.hub-message-window#show-'+ID).children('.hub-message-window-thread');
	threadWin.scrollTop(threadWin[0].scrollHeight);
}



$(document).ready(function(){
	
	//Make all links void
	
	//$('a').attr('href','javascript:void();');
	
	//Work that menu
	$('#hub-menu ul li').not('#hub-menu-search').children('a.button').click(function(){
		menuMouse(this);
	});
	//Work that search
	$('#hub-menu ul li#hub-menu-search a.button').toggle(function(){
		$('#hub-menu-search').animate({width:350});
		console.log($('#hub-menu-search').css('width'));
	},function(){
		$('#hub-menu-search').animate({width:46});
		$('#hub-search-ahead').slideUp(200);
		$('#hub-menu ul li#hub-menu-search input').removeClass('active');
	});
	var hubSearchValOrig = $('#hub-menu ul li#hub-menu-search input').attr('value');
	var hubSearchVal = $('#hub-menu ul li#hub-menu-search input').attr('value');
	var hubSearchValNew;
	$('#hub-menu ul li#hub-menu-search input').focusin(function(){
		if (hubSearchVal != hubSearchValNew){
			$(this).attr('value','');
		}
	});
	$('#hub-menu ul li#hub-menu-search input').focusout(function(){
		if ($(this).attr('value') == ''){
			$(this).attr('value',hubSearchValOrig).removeClass('active');
		} else {
			hubSearchVal = hubSearchValNew;
		}

	});
	$('#hub-menu ul li#hub-menu-search input').keyup(function(){
		if($(this).attr('value')==''){
			$('#hub-search-ahead').slideUp(200);
			$(this).removeClass('active');
		}else{
			$('#hub-search-ahead').slideDown(200);
			menuHeight('#hub-search-ahead','#hub-search-ahead ul li');
			$(this).addClass('active');
		}
		hubSearchValNew = $(this).attr('value');
	});
	
	// Swap selected provider into the current slot
	var activeProvider = $('#hub #hub-menu li#hub-menu-providers .popout ul li.active a:first').text();
	$('#hub #hub-menu ul li#hub-menu-providers a.button').text(activeProvider);
	$('#hub #hub-menu li#hub-menu-providers .popout ul li a.name').click(function(){
		activeProvider = $(this).text();
		if (activeProvider == 'Barclays' || activeProvider == 'Markit'){
			$('#app-screen-0').removeClass('Barclays').removeClass('Markit').removeClass('store').addClass(activeProvider);
		}
		$('#hub #hub-menu ul li#hub-menu-providers a.button').text(activeProvider);
		$('#hub-menu ul li a.button.active').removeClass('active');
		$('.open').removeClass('open').animate({height:'0'},200);
		if($(this).attr('href')){
			$('#provider-frame').attr('src',$(this).attr('href'));
			return null;
		}
		currentMenu = '';
		
	});
	//make providers sortable
	$('#hub #hub-menu li#hub-menu-providers .popout ul').sortable({
			containment: '#hub #hub-menu li#hub-menu-providers .popout ul',
			items: 'li',
			axis: 'y',
			forcePlaceholderSize: true,
			delay: 200,
			helper: 'clone'
		}).disableSelection();
	
	
	$('#hub-menu-messages .item.message').live('click',function(){
		$('#hub-menu-messages .item.message.active').removeClass('active');
		$(this).addClass('active');
		loadMessage($(this).attr('id'));
	});
	
	//Make Team groups sortable
	$( "#hub-menu-team .popout ul" ).sortable({
		axis: 'y',
		items: '.section',
		handle: '.section-head',
		scrollSpeed: 40,
		containment: '#hub-menu-team .popout ul',
		forcePlaceholderSize: true,
		delay: 200,
		helper : 'clone'
	}).disableSelection();
	
	//Make team members sortable through every group	
	$( "#hub-menu-team .popout ul .section" ).sortable({
		connectWith: '#hub-menu-team .popout ul .section',
		axis: 'y',
		items: '.item',
		scrollSpeed: 40,
		containment: '#hub-menu-team .popout ul',
		forcePlaceholderSize: true,
		delay: 200,
		helper : 'clone'
	}).disableSelection();
	
	//Allow groups to be collapsed
	$('.section-head a.arrow').toggle(function(){
		$(this).addClass('closed');
		$(this).parent().siblings().toggle();
		menuHeight('#hub-menu-team .popout');
	}, function(){
		$(this).removeClass('closed');
		$(this).parent().siblings().toggle();
		menuHeight('#hub-menu-team .popout');
	});
	
	//Create new chat window on click of team member
	$('#hub-menu-team .item a').live('click',function(){
		openChat($(this).text());
		
	});	
	//toggle chat window
	$('#hub #chat li .hub-chat-name').live('click',function(){
		var newWindow = $(this).parent().children('.chat-window');
		if($(this).parents('#chat').children('li').hasClass('open')){
			if(!$(this).parent().hasClass('open')){
				$(this).parents('#chat').children('li.open').children('.chat-window').slideUp(200,function(){
					newWindow.parent().children('.chat-window').slideDown(200,function(){
						newWindow.parent().addClass('open');
						newWindow.children('.chat-stream').scrollTop(newWindow.children('.chat-stream')[0].scrollHeight);
					});	
					
				});
				$(this).parents('#chat').children('li.open').removeClass('open');
			}else{
				$(this).parents('#chat').children('li.open').children('.chat-window').slideUp(200);
				$(this).parents('#chat').children('li.open').removeClass('open');
			}
		} else {
			$(this).parent().children('.chat-window').slideDown(200,function(){
				$(this).parent().addClass('open');
				$(this).children('.chat-stream').scrollTop($(this).children('.chat-stream')[0].scrollHeight);
			});			
		}
	});
	$('#hub #chat li a.hub-chat-status').live('click',function(){
		$(this).parent().children('.chat-window').slideUp(100, function(){
			$(this).parent().animate({width:'toggle'},function(){
				$(this).remove();
			});
		});
	});
	
	
	//Create Chat Room
	
	$('#hub #hub-menu-team a.new-room').live('click',function(){
		$(this).addClass('on').after('<span>Select Participants</span><a class="hub-group-start">Start Chat</a><a class="hub-group-cancel">Cancel</a>').hide();
		chatID = $(this).text().replace(/ /gi,'-');
		$('#hub-menu-team .item a.contact, #hub-menu-team .section-head a.contact-group').before('<input type="checkbox" name="roomSelect" value="'+chatID+'" />').css('float','none').css('margin-left','25px');
	});
	
	$('#hub #hub-menu-team .section-head input').live('click',function(){
		if (!$(this).parents('.section').hasClass('selected')){
			$(this).parents('.section').children('ul').children('li.item').children('input').attr('checked', true);
			$(this).parents('.section').addClass('selected');
		} else {
			$(this).parents('.section').children('ul').children('li.item').children('input').attr('checked', false);
			$(this).parents('.section').removeClass('selected');
		}
	});
	
	$('#hub #hub-menu-team .item input').live('click',function(){
		if($(this).not(':checked')){
			$(this).parents('.section').children('ul').children('li.section-head').children('input').attr('checked', false);
			$(this).parents('.section').removeClass('selected');
		}
		if($(this).parents('.section').children('ul').children('li.item').length == $(this).parents('.section').children('ul').children('li.item').children('input:checked').length){
			$(this).parents('.section').children('ul').children('li.section-head').children('input').attr('checked', true);
			$(this).parents('.section').addClass('selected');
		}
	});
	
	$('.group-menu a.hub-group-cancel').live('click',function(){
		$('.group-menu span, .group-menu .hub-group-start, .group-menu .hub-group-cancel').remove();
		$('.group-menu span').hide();
		$('.group-menu a.on').removeClass('on').show();
		$('#hub-menu-team .item a.contact, #hub-menu-team .section-head a.contact-group').css('margin-left','0');
		$('#hub-menu-team .item input, #hub-menu-team .section-head input').remove();
	});
	$('.group-menu a.hub-group-start').live('click',function(){
		var groupChat = Array();
		$('#hub-menu-team .section .item input:checked').each(function(index){
			groupChat[index] = $(this).parent().children('.contact').attr('id');
		});
		openChat('group '+Math.floor(Math.random()*1001),groupChat);
	});
	$('.chat-window.group .group-count').live('click',function(){
		if(!$(this).parents().siblings('.party').is(':visible')){
			$(this).parents().siblings('.chat-stream').animate({
				width: '-=145px'
			},400,function(){
				$(this).siblings('.party').show();
			});
			$(this).children('span').text('(hide)');
		} else {
			$(this).parents().siblings('.party').hide();
			$(this).parents().siblings('.chat-stream').animate({
				width: '+=145px'
			},400);
			$(this).children('span').text('(show)');
		}
	});
	
	$('.chat-window.group .group-edit').live('click',function(){
		if ($(this).text()=='Edit'){
			if(!$('#hub-menu-team .popout').hasClass('open')){
				menuMouse('#hub-menu-team a.button');
			}
			currentEdit = 'edit-'+$(this).parents('.chat-user').attr('id');
			$('#hub-menu-team .group-menu').attr('id',currentEdit);
			$('#hub-menu-team a.new-room').addClass('on').after('<span>Select Participants</span><a class="hub-group-update">Update Chat</a><a class="hub-group-cancel">Cancel</a>').hide();
			$('#hub-menu-team .item a.contact, #hub-menu-team .section-head a.contact-group').before('<input type="checkbox" name="roomSelect" value="'+chatID+'" />').css('float','none').css('margin-left','25px');
			$('.chat-window.group .group-edit').parent().parent().siblings('.party').children('li').children('a').each(function(index){
				contactID = $(this).attr('id').split('-');
				$('#hub-menu-team .item a.contact#'+contactID[1]).siblings('input').attr('checked', true);			
			});
			$('#hub-menu-team .section').each(function(){
				if($(this).children('ul').children('li.item').length == $(this).children('ul').children('li.item').children('input:checked').length){
					$(this).children('ul').children('li.section-head').children('input').attr('checked', true);
					$(this).addClass('selected');
				}
			});
			var origName = $(this).parent().parent().children('.chat-name').text();
			$(this).parent().parent().children('.chat-name').text('').prepend('<input type="text" value="'+origName+'"/>');
			$(this).text('Update');
		} else {
			$(this).live('click',function(){
				updateClick('#hub .group-menu .hub-group-update');
			});
		}
	});
	$('#hub .group-menu .hub-group-update').live('click',function(){
		updateClick(this);
	});
	var researchID;
	var prevResearch;
	$('.ca-actionable a').mouseover(function(){
		prevResearch = researchID;
		researchID = $(this).parent().attr('data-docguid');
		if (prevResearch != researchID){
			$('#hub-research-link-'+prevResearch).hide().remove();
			$('#hub-research-link').clone().attr('id','hub-research-link-'+researchID).insertAfter(this).animate({marginLeft:'5px'},1000,function(){$(this).fadeIn(500)});
		}
	});
	
	$('#hub-menu-handle-click').click(function(){
		if ($(this).hasClass('open')){
		    $('#hub').animate({
		        marginLeft:'-396px'
		    });
		    $(this).removeClass('open').addClass('closed');
	    } else {
	    	 $('#hub').animate({
		        marginLeft:'0px'
		    });
		    $(this).removeClass('closed').addClass('open');
	    }
	});
	
	$('.hub-context-link').live('click',function(){
		$('.hub-context-pop').hide();
		$('.hub-active-link').removeClass('hub-active-link');
		researchID = $(this).parent().attr('data-docguid');
		if (prevResearch != researchID && !$(this).parent().hasClass('hub-active-link')){
			$(this).parent().addClass('hub-active-link');
			$('#hub-research-pop').clone().insertAfter($(this).parent()).attr('id','hub-research-pop-'+researchID).css('margin-left',$(this).parent().outerWidth()).css('margin-top',0-$(this).parent().outerHeight()).fadeIn(500);
			prevResearch = researchID;
		}
	});
	
	$('#app-rail').animate({left:'-400px'},300);
	$('#provider-frame-wrapper').animate({left:'0px'},300);
	$('#hub').animate({left:'0px'},300);
	$('#hub-logo a').toggle(function(){
		$('#app-rail').animate({left:'0px'},300).addClass('open');
		$('#provider-frame-wrapper').animate({left:'400px'},300);
		$('#hub').animate({left:'400px'},300);
		$(this).addClass('active');
	},
	function(){
		$('#app-rail').animate({left:'-400px'},300).removeClass('open');
		$('#provider-frame-wrapper').animate({left:'0px'},300);
		$('#hub').animate({left:'0px'},300);
		$(this).removeClass('active');
	});
	
	$('#prov-add').click(function(){
		overlay();
		$('.hub-provider-add-window').clone().show().appendTo('.hub-overlay');
	});
	
	$('#app-rail .module').resizable({
			maxHeight: 450,
			maxWidth: 260,
			minHeight: 150,
			minWidth: 260,
			grid:150
		});
	$('#app-rail .module').sortable({
		handle: '.mod-header'
	});
	var oldAppClass;
	$('.open-app-store').toggle(function(){
		oldAppClass = $('#app-screen-0').attr('class');
		$('#app-screen-0').removeClass('Barclays').removeClass('Markit').addClass('store');
		$(this).addClass('active');
	},function(){
		$('#app-screen-0').attr('class',oldAppClass);
	});
	
	$('#hub-menu-team .contact-group').each(function(){
		userCount = $(this).parent().siblings().length;
		$('#mod-directory-list .group-list .group:first-child').clone().appendTo('#mod-directory-list .group-list').show().attr('id','c-'+$(this).attr('id')).children('a').text($(this).text()).siblings('span').text(userCount);
	});
	$('#mod-directory-list .group-list').sortable({
			containment: '#mod-directory-list .group-list',
			items: 'li',
			axis: 'y',
			forcePlaceholderSize: true,
			delay: 200,
			helper: 'clone'
	}).disableSelection();
	$('#mod-directory-list .user-list').sortable({
			containment: '#mod-directory-list .user-list',
			items: 'li',
			axis: 'y',
			forcePlaceholderSize: true,
			delay: 200,
			helper: 'clone'
	}).disableSelection();
	$('#mod-directory-list .group-list .group').live('click',function(){
		nID = $(this).attr('id').replace('c-','');
		$('#mod-directory-list .user-list li.list-header h5').text($(this).children('a').text());
		$('#'+nID).parent().siblings('.contact').each(function(){
			$(this).clone().appendTo('#mod-directory-list .user-list').children('a.contact').text($(this).text());
		});
		$('#mod-directory-list .slider').animate({marginLeft:'-330px'});
	});
	$('#mod-directory-list .user-list .back').live('click',function(){
		$('#mod-directory-list .slider').animate({marginLeft:'0'},function(){
			$('#mod-directory-list .user-list li').not('.list-header').remove();
		});
	});
	$('#mod-directory-list .user-list .item').live('click',function(){
		$('#mod-directory-list .vcard').show();
		$('#mod-directory-list .vcard .list-header h5').text($(this).children('.contact').text());
		$('#mod-directory-list .vcard .right img').attr('src',$(this).children('.meta').children('a').children('img').attr('src'))
		$('#mod-directory-list .slider').animate({marginLeft:'-660px'});
	});
	$('#mod-directory-list .vcard .back').live('click',function(){
		$('#mod-directory-list .slider').animate({marginLeft:'-330px'},function(){
			$('#mod-directory-list .vcard').hide();
		});
	});
});