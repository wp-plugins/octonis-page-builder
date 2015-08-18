var octUtils = {
	slidesEditWnd: null
,	addMenuItemWnd: null
,	addMenuItemWndBlock: null
,	subSettingsWnd: null
,	subSettingsWndBlock: null
,	subAddFieldWnd: null
,	subAddFieldWndBlock: null
,	iconsLibWnd: null
,	iconsLibWndElement: null
,	showSlidesEditWnd: function(block) {
		var self = this;
		if(!this.slidesEditWnd) {
			this.slidesEditWnd = jQuery('#octManageSlidesWnd').modal({
				show: false
			});
			this.slidesEditWnd.find('.octManageSlidesSaveBtn').click(function(){
				block.beforeSave();
				var listPrev = self.slidesEditWnd.find('.octSlidesListPrev')
				,	slides = block.getSlides()
				,	sliderShell = block.getSliderShell()
				,	tmpDiv = jQuery('<div style="display: none;" />').appendTo('body');
				listPrev.find('.octSlideManageItem').each(function(){
					var slideId = jQuery(this).data('slide-id');
					slides.each(function(){
						if(jQuery(this).data('slide-id') == slideId) {
							tmpDiv.append( jQuery(this) );
							return false;
						}
					});
				});
				sliderShell.html('').append(tmpDiv.find(':data(slide-id)'));
				tmpDiv.remove();
				block.afterSave();
				_octSaveCanvas();
				self.slidesEditWnd.modal('hide');
				return false;
			});
			this.slidesEditWnd.find('.octSlideManageAddBtn').click(function(){
				// Simulate click on Add slide menu btn
				block._clickMenuItem_add_slide({}, {clb: function(){
					self.showSlidesEditWnd(block);
				}});
				if(this.slidesEditWnd)
					this.slidesEditWnd.modal('hide');
				return false;
			});
		}
		var listPrev = this.slidesEditWnd.find('.octSlidesListPrev');
		listPrev.find('*:not(.octSlideManageAddBtn)').remove();
		var slides = block.getSlides();
		if(slides && slides.size()) {
			slides.each(function(){
				var newItem = jQuery('#octSlideManageItemExl').clone().removeAttr('id');
				newItem.find('img:first').attr('src', jQuery(this).find('.octSlideImg').attr('src'));
				newItem.data('slide-id', jQuery(this).data('slide-id'));
				listPrev.prepend( newItem );
				newItem.find('.octSlideManageItemRemove').click(function(){
					//if(confirm(toeLangOct('Are you sure want to remove this slide?'))) {
						jQuery(this).parents('.octSlideManageItem:first').hide(g_octAnimationSpeed, function(){
							jQuery(this).remove();
						});
					//}
					return false;
				});
			});
			listPrev.sortable({
				revert: true
			,	items: '.octSlideManageItem'
			,	placeholder: 'ui-state-highlight'
			//,	axis: 'x'
			});
			listPrev.find('*').disableSelection();
		} else {
			listPrev.prepend( '<div>'+ toeLangOct('You have no slides for now - try to add them at first.')+ '</div>' );
		}
		this.slidesEditWnd.modal('show');
	}
,	_getEllIconsLibHtml: function() {
		return this.iconsLibWnd.find('.octIconsLibList .octIconLibItem');
	}
,	_showAllIconsLib: function() {
		this._getEllIconsLibHtml().show();
	}
,	initIconsLibWnd: function() {
		var self = this;
		this.iconsLibWnd = jQuery('#octIconsLibWnd').modal({
			show: false
		});
		this.iconsLibWnd.find('.octIconsLibSearchTxt').keyup(function(){
			var value = jQuery.trim( jQuery(this).val() );
			if(value && value != '') {
				var keys = jQuery(this).val().split(' ')
				,	allFoundIcons = self._getEllIconsLibHtml()
				,	initialSize = allFoundIcons.size();
				allFoundIcons.show();
				for(var i = 0; i < keys.length; i++) {
					allFoundIcons = allFoundIcons.not('[data-icon*="'+ keys[i]+ '"]');
				}
				allFoundIcons.hide();
				if(initialSize == allFoundIcons.size()) {	// Anything was found
					self._showNothingFoundIconsLib( value );
				}
			} else {
				self._hideNothingFoundIconsLib();
				self._showAllIconsLib();
			}
			return false;
		});
		this.iconsLibWnd.find('.octIconsLibSaveBtn').click(function(){
			octUtils.iconsLibWnd.modal('hide');
			return false;
		});
		var allIcons = this.getFaIconsList()
		,	iconsShell = this.iconsLibWnd.find('.octIconsLibList');
		iconsShell.html('');
		for(var i = 0; i < allIcons.length; i++) {
			var iconName = this._faIconClassToName(allIcons[i]);
			iconsShell.append('<div class="octIconLibItem col-md-3 col-sm-4" onclick="octUtils.selectFaIconFromLib(this); return false;" data-icon="'+ allIcons[i]+ '" data-name="'+ iconName+ '">'
				+ '<i class="octIconLibPrev fa '+ allIcons[i]+ '"></i>'
				+ '<span class="octIconLibTitle">'+ iconName+ '</span>'
			+'</div>');
		}
	}
,	selectFaIconFromLib: function(clickIcon) {
		if(this.iconsLibWndElement) {
			var prevClass = this.iconsLibWndElement.get('icon')
			,	newClass = jQuery(clickIcon).data('icon');
			this.iconsLibWndElement._getEditArea().removeClass( prevClass ).addClass( newClass );
			this.iconsLibWndElement.set('icon', newClass);
			_octSaveCanvas();
		} else
			console.error('Can not find element for icon apply!!!');
		this.iconsLibWnd.modal('hide');
	}
,	_faIconClassToName: function(str) {
		return str.substr(3);
	}
,	_showNothingFoundIconsLib: function(keys) {
		var msgEl = this.iconsLibWnd.find('.octIconsLibEmptySearch');
		if(keys) {
			msgEl.find('.octNothingFoundKeys').html( keys );
		}
		msgEl.slideDown( g_octAnimationSpeed );
	}
,	_hideNothingFoundIconsLib: function() {
		this.iconsLibWnd.find('.octIconsLibEmptySearch').hide();
	}
,	showIconsLibWnd: function(element) {
		if(!this.iconsLibWnd) {
			this.initIconsLibWnd();
		}
		this.iconsLibWndElement = element;
		this._showAllIconsLib();
		this._hideNothingFoundIconsLib();
		this.iconsLibWnd.find('.octIconsLibSearchTxt').val('');
		this.iconsLibWnd.modal('show');
	}
,	converUrl: function(url) {
		if(url.indexOf('http') !== 0) {
			url = 'http://'+ url;
		}
		return url;
	}
,	urlToVideoSrc: function(url) {
		var src = '';
		if((src = url.replace(/.*www\.youtube\.com\/watch\?v\=(.+)/gi, '$1')) !== url) {
			return 'https://www.youtube.com/embed/'+ src;
		} else if((src = url.replace(/.*vimeo\.com.*(\d+)/gi, '$1')) !== url) {
			return 'https://player.vimeo.com/video/'+ src+ '?badge=0';
		}
		return url;
	}
,	getFaIconsList: function() {
		return ['fa-adjust','fa-adn','fa-align-center','fa-align-justify','fa-align-left','fa-align-right','fa-ambulance','fa-anchor','fa-android','fa-angellist','fa-angle-double-down','fa-angle-double-left','fa-angle-double-right','fa-angle-double-up','fa-angle-down','fa-angle-left','fa-angle-right','fa-angle-up','fa-apple','fa-archive','fa-area-chart','fa-arrow-circle-down','fa-arrow-circle-left','fa-arrow-circle-o-down','fa-arrow-circle-o-left','fa-arrow-circle-o-right','fa-arrow-circle-o-up','fa-arrow-circle-right','fa-arrow-circle-up','fa-arrow-down','fa-arrow-left','fa-arrow-right','fa-arrow-up','fa-arrows','fa-arrows-alt','fa-arrows-h','fa-arrows-v','fa-asterisk','fa-at','fa-automobile(alias)','fa-backward','fa-ban','fa-bank(alias)','fa-bar-chart','fa-bar-chart-o(alias)','fa-barcode','fa-bars','fa-bed','fa-beer','fa-behance','fa-behance-square','fa-bell','fa-bell-o','fa-bell-slash','fa-bell-slash-o','fa-bicycle','fa-binoculars','fa-birthday-cake','fa-bitbucket','fa-bitbucket-square','fa-bitcoin(alias)','fa-bold','fa-bolt','fa-bomb','fa-book','fa-bookmark','fa-bookmark-o','fa-briefcase','fa-btc','fa-bug','fa-building','fa-building-o','fa-bullhorn','fa-bullseye','fa-bus','fa-buysellads','fa-cab(alias)','fa-calculator','fa-calendar','fa-calendar-o','fa-camera','fa-camera-retro','fa-car','fa-caret-down','fa-caret-left','fa-caret-right','fa-caret-square-o-down','fa-caret-square-o-left','fa-caret-square-o-right','fa-caret-square-o-up','fa-caret-up','fa-cart-arrow-down','fa-cart-plus','fa-cc','fa-cc-amex','fa-cc-discover','fa-cc-mastercard','fa-cc-paypal','fa-cc-stripe','fa-cc-visa','fa-certificate','fa-chain(alias)','fa-chain-broken','fa-check','fa-check-circle','fa-check-circle-o','fa-check-square','fa-check-square-o','fa-chevron-circle-down','fa-chevron-circle-left','fa-chevron-circle-right','fa-chevron-circle-up','fa-chevron-down','fa-chevron-left','fa-chevron-right','fa-chevron-up','fa-child','fa-circle','fa-circle-o','fa-circle-o-notch','fa-circle-thin','fa-clipboard','fa-clock-o','fa-close(alias)','fa-cloud','fa-cloud-download','fa-cloud-upload','fa-cny(alias)','fa-code','fa-code-fork','fa-codepen','fa-coffee','fa-cog','fa-cogs','fa-columns','fa-comment','fa-comment-o','fa-comments','fa-comments-o','fa-compass','fa-compress','fa-connectdevelop','fa-copy(alias)','fa-copyright','fa-credit-card','fa-crop','fa-crosshairs','fa-css3','fa-cube','fa-cubes','fa-cut(alias)','fa-cutlery','fa-dashboard(alias)','fa-dashcube','fa-database','fa-dedent(alias)','fa-delicious','fa-desktop','fa-deviantart','fa-diamond','fa-digg','fa-dollar(alias)','fa-dot-circle-o','fa-download','fa-dribbble','fa-dropbox','fa-drupal','fa-edit(alias)','fa-eject','fa-ellipsis-h','fa-ellipsis-v','fa-empire','fa-envelope','fa-envelope-o','fa-envelope-square','fa-eraser','fa-eur','fa-euro(alias)','fa-exchange','fa-exclamation','fa-exclamation-circle','fa-exclamation-triangle','fa-expand','fa-external-link','fa-external-link-square','fa-eye','fa-eye-slash','fa-eyedropper','fa-facebook','fa-facebook-f(alias)','fa-facebook-official','fa-facebook-square','fa-fast-backward','fa-fast-forward','fa-fax','fa-female','fa-fighter-jet','fa-file','fa-file-archive-o','fa-file-audio-o','fa-file-code-o','fa-file-excel-o','fa-file-image-o','fa-file-movie-o(alias)','fa-file-o','fa-file-pdf-o','fa-file-photo-o(alias)','fa-file-picture-o(alias)','fa-file-powerpoint-o','fa-file-sound-o(alias)','fa-file-text','fa-file-text-o','fa-file-video-o','fa-file-word-o','fa-file-zip-o(alias)','fa-files-o','fa-film','fa-filter','fa-fire','fa-fire-extinguisher','fa-flag','fa-flag-checkered','fa-flag-o','fa-flash(alias)','fa-flask','fa-flickr','fa-floppy-o','fa-folder','fa-folder-o','fa-folder-open','fa-folder-open-o','fa-font','fa-forumbee','fa-forward','fa-foursquare','fa-frown-o','fa-futbol-o','fa-gamepad','fa-gavel','fa-gbp','fa-ge(alias)','fa-gear(alias)','fa-gears(alias)','fa-genderless(alias)','fa-gift','fa-git','fa-git-square','fa-github','fa-github-alt','fa-github-square','fa-gittip(alias)','fa-glass','fa-globe','fa-google','fa-google-plus','fa-google-plus-square','fa-google-wallet','fa-graduation-cap','fa-gratipay','fa-group(alias)','fa-h-square','fa-hacker-news','fa-hand-o-down','fa-hand-o-left','fa-hand-o-right','fa-hand-o-up','fa-hdd-o','fa-header','fa-headphones','fa-heart','fa-heart-o','fa-heartbeat','fa-history','fa-home','fa-hospital-o','fa-hotel(alias)','fa-html5','fa-ils','fa-image(alias)','fa-inbox','fa-indent','fa-info','fa-info-circle','fa-inr','fa-instagram','fa-institution(alias)','fa-ioxhost','fa-italic','fa-joomla','fa-jpy','fa-jsfiddle','fa-key','fa-keyboard-o','fa-krw','fa-language','fa-laptop','fa-lastfm','fa-lastfm-square','fa-leaf','fa-leanpub','fa-legal(alias)','fa-lemon-o','fa-level-down','fa-level-up','fa-life-bouy(alias)','fa-life-buoy(alias)','fa-life-ring','fa-life-saver(alias)','fa-lightbulb-o','fa-line-chart','fa-link','fa-linkedin','fa-linkedin-square','fa-linux','fa-list','fa-list-alt','fa-list-ol','fa-list-ul','fa-location-arrow','fa-lock','fa-long-arrow-down','fa-long-arrow-left','fa-long-arrow-right','fa-long-arrow-up','fa-magic','fa-magnet','fa-mail-forward(alias)','fa-mail-reply(alias)','fa-mail-reply-all(alias)','fa-male','fa-map-marker','fa-mars','fa-mars-double','fa-mars-stroke','fa-mars-stroke-h','fa-mars-stroke-v','fa-maxcdn','fa-meanpath','fa-medium','fa-medkit','fa-meh-o','fa-mercury','fa-microphone','fa-microphone-slash','fa-minus','fa-minus-circle','fa-minus-square','fa-minus-square-o','fa-mobile','fa-mobile-phone(alias)','fa-money','fa-moon-o','fa-mortar-board(alias)','fa-motorcycle','fa-music','fa-navicon(alias)','fa-neuter','fa-newspaper-o','fa-openid','fa-outdent','fa-pagelines','fa-paint-brush','fa-paper-plane','fa-paper-plane-o','fa-paperclip','fa-paragraph','fa-paste(alias)','fa-pause','fa-paw','fa-paypal','fa-pencil','fa-pencil-square','fa-pencil-square-o','fa-phone','fa-phone-square','fa-photo(alias)','fa-picture-o','fa-pie-chart','fa-pied-piper','fa-pied-piper-alt','fa-pinterest','fa-pinterest-p','fa-pinterest-square','fa-plane','fa-play','fa-play-circle','fa-play-circle-o','fa-plug','fa-plus','fa-plus-circle','fa-plus-square','fa-plus-square-o','fa-power-off','fa-print','fa-puzzle-piece','fa-qq','fa-qrcode','fa-question','fa-question-circle','fa-quote-left','fa-quote-right','fa-ra(alias)','fa-random','fa-rebel','fa-recycle','fa-reddit','fa-reddit-square','fa-refresh','fa-remove(alias)','fa-renren','fa-reorder(alias)','fa-repeat','fa-reply','fa-reply-all','fa-retweet','fa-rmb(alias)','fa-road','fa-rocket','fa-rotate-left(alias)','fa-rotate-right(alias)','fa-rouble(alias)','fa-rss','fa-rss-square','fa-rub','fa-ruble(alias)','fa-rupee(alias)','fa-save(alias)','fa-scissors','fa-search','fa-search-minus','fa-search-plus','fa-sellsy','fa-send(alias)','fa-send-o(alias)','fa-server','fa-share','fa-share-alt','fa-share-alt-square','fa-share-square','fa-share-square-o','fa-shekel(alias)','fa-sheqel(alias)','fa-shield','fa-ship','fa-shirtsinbulk','fa-shopping-cart','fa-sign-in','fa-sign-out','fa-signal','fa-simplybuilt','fa-sitemap','fa-skyatlas','fa-skype','fa-slack','fa-sliders','fa-slideshare','fa-smile-o','fa-soccer-ball-o(alias)','fa-sort','fa-sort-alpha-asc','fa-sort-alpha-desc','fa-sort-amount-asc','fa-sort-amount-desc','fa-sort-asc','fa-sort-desc','fa-sort-down(alias)','fa-sort-numeric-asc','fa-sort-numeric-desc','fa-sort-up(alias)','fa-soundcloud','fa-space-shuttle','fa-spinner','fa-spoon','fa-spotify','fa-square','fa-square-o','fa-stack-exchange','fa-stack-overflow','fa-star','fa-star-half','fa-star-half-empty(alias)','fa-star-half-full(alias)','fa-star-half-o','fa-star-o','fa-steam','fa-steam-square','fa-step-backward','fa-step-forward','fa-stethoscope','fa-stop','fa-street-view','fa-strikethrough','fa-stumbleupon','fa-stumbleupon-circle','fa-subscript','fa-subway','fa-suitcase','fa-sun-o','fa-superscript','fa-support(alias)','fa-table','fa-tablet','fa-tachometer','fa-tag','fa-tags','fa-tasks','fa-taxi','fa-tencent-weibo','fa-terminal','fa-text-height','fa-text-width','fa-th','fa-th-large','fa-th-list','fa-thumb-tack','fa-thumbs-down','fa-thumbs-o-down','fa-thumbs-o-up','fa-thumbs-up','fa-ticket','fa-times','fa-times-circle','fa-times-circle-o','fa-tint','fa-toggle-down(alias)','fa-toggle-left(alias)','fa-toggle-off','fa-toggle-on','fa-toggle-right(alias)','fa-toggle-up(alias)','fa-train','fa-transgender','fa-transgender-alt','fa-trash','fa-trash-o','fa-tree','fa-trello','fa-trophy','fa-truck','fa-try','fa-tty','fa-tumblr','fa-tumblr-square','fa-turkish-lira(alias)','fa-twitch','fa-twitter','fa-twitter-square','fa-umbrella','fa-underline','fa-undo','fa-university','fa-unlink(alias)','fa-unlock','fa-unlock-alt','fa-unsorted(alias)','fa-upload','fa-usd','fa-user','fa-user-md','fa-user-plus','fa-user-secret','fa-user-times','fa-users','fa-venus','fa-venus-double','fa-venus-mars','fa-viacoin','fa-video-camera','fa-vimeo-square','fa-vine','fa-vk','fa-volume-down','fa-volume-off','fa-volume-up','fa-warning(alias)','fa-wechat(alias)','fa-weibo','fa-weixin','fa-whatsapp','fa-wheelchair','fa-wifi','fa-windows','fa-won(alias)','fa-wordpress','fa-wrench','fa-xing','fa-xing-square','fa-yahoo','fa-yelp','fa-yen(alias)','fa-youtube','fa-youtube-play','fa-youtube-square'];
	}
,	extractBootstrapColsClasses: function(element) {
		var	currClasses = jQuery.map(jQuery(element).attr('class').split(' '), jQuery.trim)
		,	newClasses = [];
		for(var i = 0; i < currClasses.length; i++) {
			if(currClasses[ i ] == 'col' || currClasses[ i ].match(/col\-\w{2}\-\d{1,2}/)) {
				newClasses.push( currClasses[ i ] );
			}
		}
		return newClasses;
	}
};