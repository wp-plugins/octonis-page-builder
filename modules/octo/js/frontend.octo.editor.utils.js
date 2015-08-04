var octUtils = {
	slidesEditWnd: null
,	addMenuItemWnd: null
,	addMenuItemWndBlock: null
,	subSettingsWnd: null
,	subSettingsWndBlock: null
,	subAddFieldWnd: null
,	subAddFieldWndBlock: null
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
,	converUrl: function(url) {
		if(url.indexOf('http') !== 0) {
			url = 'http://'+ url;
		}
		return url;
	}
};