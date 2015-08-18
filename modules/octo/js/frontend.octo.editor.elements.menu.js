function octElementMenu(menuOriginalId, element, btnsClb) {
	this._$ = null;;
	this._animationSpeed = g_octAnimationSpeed;
	this._menuOriginalId = menuOriginalId;
	this._element = element;
	this._btnsClb = btnsClb;
	this._visible = false;
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
	this._fixClickOnRadio();
	this.reposite();
	if(this._btnsClb) {
		for(var selector in this._btnsClb) {
			if(this._$.find( selector ).size()) {
				this._$.find( selector ).click(function(){
					self._btnsClb[ jQuery(this).data('click-clb-selector') ]();
					return false;
				}).data('click-clb-selector', selector);
			}
		}
	}
	
	this._initSubMenus();
};
octElementMenu.prototype._fixClickOnRadio = function() {
	this._$.find('.octElMenuBtn').each(function(){
		if(jQuery(this).find('[type=radio]').size()) {
			jQuery(this).find('[type=radio]').click(function(){
				jQuery(this).parents('.octElMenuBtn:first').click();
			});
		}
	});
};
octElementMenu.prototype._hideSubMenus = function() {
	if(!this._$) return;	// If menu was already destroyed, with destroy element for example
	var menuAtBottom = this._$.hasClass('octElMenuBottom')
	,	self = this;
	this._$.find('.octElMenuSubPanel[data-sub-panel]:visible').each(function(){
		jQuery(this).slideUp(self._animationSpeed);
	});
	this._$.removeClass('octMenuSubOpened');
	if(!menuAtBottom) {
		this._$.data('animation-in-process', 1).animate({
			'top': this._$.data('prev-top')
		}, this._animationSpeed, function(){
			self._$.data('animation-in-process', 0)
		});
	}
};
octElementMenu.prototype._initSubMenus = function() {
	var self = this;
	if(this._$.find('.octElMenuBtn[data-sub-panel-show]').size()) {
		this._$.find('.octElMenuBtn').click(function(){
			self._hideSubMenus();
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
octElementMenu.prototype.show = function() {
	if(!this._$) return;	// If menu was already destroyed, with destroy element for example
	if(!this._visible) {
		// Let's hide all other element menus in current block before show this one
		var blockElements = this.getElement().getBlock().getElements();
		for(var i = 0; i < blockElements.length; i++) {
			blockElements[ i ].hideMenu();
		}
		// And now - show current menu
		this._$.addClass('active');
		this._visible = true;
	}
};
octElementMenu.prototype.hide = function() {
	if(!this._$) return;	// If menu was already destroyed, with destroy element for example
	if(this._visible) {
		this._hideSubMenus();
		this._$.removeClass('active');
		this._visible = false;
	}
};
octElementMenu.prototype.getElement = function() {
	return this._element;
};
octElementMenu.prototype._initColorpicker = function(params) {
	params = params || {};
	var self = this
	,	color = params.color ? params.color : this._element.get('color')
	,	colorInp = params.colorInp ? params.colorInp : this._$.find('.octColorBtn .octColorpickerInput')
	,	colorPanel = params.colorPanel ? params.colorPanel : this._$.find('.octElMenuSubPanel[data-sub-panel="color"]');
	colorInp.ColorPickerSliders({
		placement: 'bottom'
	,	appendto: colorPanel
	,	color: color
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
			if(typeof(self._element._setColor) === 'function') {
				self._element._setColor( rgbColorStr );
			}
		}
	,	flat: true
	});
};
/**
 * Try to find color picker in menu, if find - init it
 * TODO: Make this work for all menus, that using colopickers
 */
/*octElementMenu.prototype._initColorPicker = function(){
	
};*/
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
	this._initColorpicker({
		color: this._element.get('bgcolor')
	});
};
function octElementMenu_icon(menuOriginalId, element, btnsClb) {
	octElementMenu_icon.superclass.constructor.apply(this, arguments);
}
extendOct(octElementMenu_icon, octElementMenu);
octElementMenu_icon.prototype._afterAppendToElement = function() {
	octElementMenu_icon.superclass._afterAppendToElement.apply(this, arguments);
	var self = this;
	// Open links library
	this._$.find('.octIconLibBtn').click(function(){
		octUtils.showIconsLibWnd( self._element );
		return false;
	});
	// Color settings
	this._initColorpicker();
};
function octElementMenu_grid_col(menuOriginalId, element, btnsClb) {
	octElementMenu_grid_col.superclass.constructor.apply(this, arguments);
}
extendOct(octElementMenu_grid_col, octElementMenu);
octElementMenu_grid_col.prototype._afterAppendToElement = function() {
	octElementMenu_grid_col.superclass._afterAppendToElement.apply(this, arguments);
	var self = this;
	// Enb/Dslb fill color
	var enbFillColorCheck = this._$.find('[name=enb_fill_color]');
	enbFillColorCheck.change(function(){
		self.getElement().set('enb-color', jQuery(this).attr('checked') ? 1 : 0);
		self.getElement()._setColor();	// Just update it from existing color
		return false;
	});
	parseInt(this.getElement().get('enb-color'))
		? enbFillColorCheck.attr('checked', 'checked')
		: enbFillColorCheck.removeAttr('checked');
	// Color settings
	this._initColorpicker();
	// Enb/Dslb bg img
	var enbBgImgCheck = this._$.find('[name=enb_bg_img]');
	enbBgImgCheck.change(function(){
		self.getElement().set('enb-bg-img', jQuery(this).attr('checked') ? 1 : 0);
		self.getElement()._setImg();	// Just update it from existing image
		return false;
	});
	parseInt(this.getElement().get('enb-bg-img'))
		? enbBgImgCheck.attr('checked', 'checked')
		: enbBgImgCheck.removeAttr('checked');
};
function octElementMenu_img(menuOriginalId, element, btnsClb) {
	octElementMenu_img.superclass.constructor.apply(this, arguments);
}
extendOct(octElementMenu_img, octElementMenu);
octElementMenu_img.prototype._afterAppendToElement = function() {
	octElementMenu_img.superclass._afterAppendToElement.apply(this, arguments);
	this.getElement().get('type') === 'video'
		? this.$().find('[name=type][value=video]').attr('checked', 'checked')
		: this.$().find('[name=type][value=img]').attr('checked', 'checked');
};