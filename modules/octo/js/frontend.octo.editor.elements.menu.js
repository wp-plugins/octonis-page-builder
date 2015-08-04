function octElementMenu(menuOriginalId, element, btnsClb) {
	this._$ = null;;
	this._animationSpeed = g_octAnimationSpeed;
	this._menuOriginalId = menuOriginalId;
	this._element = element;
	this._btnsClb = btnsClb;
	this.init();
}
octElementMenu.prototype._afterAppendToElement = function() {
	
};
octElementMenu.prototype.$ = function() {
	return this._$;
};
octElementMenu.prototype.init = function() {
	var self = this;
	this._$ = jQuery('#'+ this._menuOriginalId)
		.clone()
		.attr('id', 'octElMenu_'+ mtRand(1, 99999))
		.appendTo( this._element.$() );
	this._afterAppendToElement();
	octInitCustomCheckRadio( this._$ );
	this.reposite();
	if(this._$.find('.octImgRemoveBtn').size()) {
		this._$.find('.octImgRemoveBtn').click(function(){
			self.destroy();
			return false;
		});
	}
	if(this._btnsClb) {
		for(var selector in this._btnsClb) {
			if(this._$.find( selector ).size()) {
				this._$.find( selector ).click(function(){
					self._btnsClb[ selector ]();
					return false;
				});
			}
		}
	}
	this._initSubMenus();
};
octElementMenu.prototype._initSubMenus = function() {
	var self = this;
	if(this._$.find('.octElMenuBtn[data-sub-panel-show]').size()) {
		this._$.find('.octElMenuBtn').click(function(){
			var menuAtBottom = self._$.hasClass('octElMenuBottom');
			jQuery('.octElMenuSubPanel[data-sub-panel]:visible').each(function(){
				jQuery(this).slideUp(self._animationSpeed);
			});
			self._$.removeClass('octMenuSubOpened');
			if(!menuAtBottom) {
				self._$.data('animation-in-process', 1).animate({
					'top': self._$.data('prev-top')
				}, self._animationSpeed, function(){
					self._$.data('animation-in-process', 0)
				});
			}
		});
		this._$.find('.octElMenuBtn[data-sub-panel-show]').click(function(){
			var subPanelShow = jQuery(this).data('sub-panel-show')
			,	subPanel = self._$.find('.octElMenuSubPanel[data-sub-panel="'+ subPanelShow+ '"]')
			,	menuPos = self._$.position()
			,	subPanelHeight = subPanel.outerHeight()
			,	menuAtBottom = self._$.hasClass('octElMenuBottom')
			,	menuTop = self._$.data('animation-in-process') ? self._$.data('prev-top') : menuPos.top;

			if(!subPanel.is(':visible')) {
				subPanel.slideDown( self._animationSpeed );
				if(!menuAtBottom) {
					self._$.data('prev-top', menuTop).animate({
						'top': menuTop - subPanelHeight
					}, self._animationSpeed);
				}
				self._$.addClass('octMenuSubOpened')
			}
			return false;
		});
	}
};
octElementMenu.prototype.reposite = function() {
	this._$.css({
		'left': ((this._element.$().width() - this._$.width()) / 2)+ 'px'
	});
	var elementOffset = this._element.$().offset();
	this._menuOnBottom = elementOffset.top <= g_octTopBarH || this._element.$().data('menu-to-bottom');
	if(this._menuOnBottom) {
		this._$.addClass('octElMenuBottom');
	}
};
octElementMenu.prototype.destroy = function() {
	if(this._$) {
		this._$.remove();
		this._$ = null;
	}
};
function octElementMenu_btn(menuOriginalId, element, btnsClb) {
	octElementMenu_btn.superclass.constructor.apply(this, arguments);
}
extendOct(octElementMenu_btn, octElementMenu);
octElementMenu_btn.prototype._afterAppendToElement = function() {
	octElementMenu_btn.superclass._afterAppendToElement.apply(this, arguments);
	// Link settings
	var self = this
	,	btnLink = this._element._getEditArea()
	,	linkInp = this._$.find('[name=btn_item_link]')
	,	titleInp = this._$.find('[name=btn_item_title]')
	,	newWndInp = this._$.find('[name=btn_item_link_new_wnd]');

	linkInp.val( btnLink.attr('href') ).change(function(){
		btnLink.attr('href', jQuery(this).val());
	});
	titleInp.val( btnLink.attr('title') ).change(function(){
		btnLink.attr('title', jQuery(this).val());
	});
	btnLink.attr('target') == '_blank' ? newWndInp.attr('checked', 'checked') : newWndInp.removeAttr('checked');
	newWndInp.change(function(){
		jQuery(this).attr('checked') ? btnLink.attr('target', '_blank') : btnLink.removeAttr('target');
	});
	// Color settings
	var colorInp = this._$.find('.octColorBtn .octColorpickerInput')
	,	colorPanel = this._$.find('.octElMenuSubPanel[data-sub-panel="color"]');
	colorInp.ColorPickerSliders({
		placement: 'bottom'
	,	appendto: colorPanel
	,	color: this._element.get('bgcolor')
	,	order: {
			hsl: 1
		,	opacity: 2
		}
	,	customswatches: 'different-swatches-groupname'
	,	swatches: ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)', 'blue']
	,	noChangeAfterInit: true
	,	labels: {
			hslhue: 'color tone'
		,	hslsaturation: 'saturation'
		,	hsllightness: 'brightness'
		,	opacity: 'alfa'
		}
	,	onchange: function(container, color) {
			var rgbColorStr = color.tiny.toRgbString();
			colorInp.css({
				'background-color': rgbColorStr
			});
			self._element._setBgColor( rgbColorStr );
		}
	,	flat: true
	});
};
