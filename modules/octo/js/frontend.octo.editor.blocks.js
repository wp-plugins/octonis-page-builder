/**
 * Base block object - for extending
 * @param {object} blockData all block data from database (block database row)
 */
octBlockBase.prototype.destroy = function() {
	this._clearElements();
	this._$.slideUp(this._animationSpeed, jQuery.proxy(function(){
		this._$.remove();
		g_octBlockFabric.removeBlockByIter( this.getIter() );
		_octSaveCanvas();
	}, this));
};
octBlockBase.prototype.build = function(params) {
	params = params || {};
	var innerHtmlContent = '';
	if(this._data.css && this._data.css != '') {
		innerHtmlContent += '<style type="text/css" class="octBlockStyle">'+ this._data.css+ '</style>';
	}
	if(this._data.html && this._data.html != '') {
		innerHtmlContent += '<div class="octBlockContent">'+ this._data.html+ '</div>';
	}
	innerHtmlContent = '<div class="octBlock" id="{{block.view_id}}">'+ innerHtmlContent+ '</div>';
	if(!this._data.session_id) {
		this._data.session_id = mtRand(1, 999999);
	}
	if(!this._data.view_id) {
		this._data.view_id = 'octBlock_'+ this._data.session_id;
	}
	var template = twig({
		data: innerHtmlContent
	});
	var generatedHtml = template.render({
		block: this._data
	});
	this._$ = jQuery(generatedHtml);
	if(params.insertAfter) {
		this._$.insertAfter( params.insertAfter );
	}
	this._initElements();
	this._initHtml();
};
octBlockBase.prototype.set = function(key, value) {
	this._data[ key ] = value;
};
octBlockBase.prototype.setData = function(data) {
	this._data = data;
};
octBlockBase.prototype.getData = function() {
	return this._data;
};
octBlockBase.prototype.setParam = function(key, value) {
	if(!this._data.params[ key ]) this._data.params[ key ] = {};
	this._data.params[ key ].val = value;
};
octBlockBase.prototype.appendToCanvas = function() {
	this._$.appendTo('#octCanvas');
};
octBlockBase.prototype.removeElementByIterNum = function(iterNum) {
	this._elements.splice( iterNum, 1 );
	if(this._elements && this._elements.length) {
		for(var i = 0; i < this._elements.length; i++) {
			this._elements[ i ].setIterNum( i );
		}
	}
};
octBlockBase.prototype._initHtml = function() {
	this._beforeInitHtml();
	this._$.prepend( jQuery('#octBlockToolbarEx').clone().removeAttr('id') );
	this._$.find('.octBlockRemove').click(jQuery.proxy(function(){
		if(confirm(toeLangOct('Are you sure want to delete this block?'))) {
			this.destroy();
		}
		return false;
	}, this));
	this._$.find('.octBlockSettings').click(jQuery.proxy(function(event){
		jQuery('#'+ this._$.attr('id')).contextMenu({
			x: event.pageX - 100
		,	y: event.pageY
		});
	}, this));
	this._buildMenu();
};
octBlockBase.prototype._beforeInitHtml = function() {
	
};
octBlockBase.prototype._rebuildCss = function() {
	var template = twig({
		data: this._data.css
	});
	var generatedHtml = template.render({
		block: this._data
	});
	this._$.find('style.octBlockStyle').html( generatedHtml );
};
octBlockBase.prototype._initMenuItem = function(newMenuItemHtml, item) {
	if(this['_initMenuItem_'+ item.type] && typeof(this['_initMenuItem_'+ item.type]) === 'function') {
		var menuItemName = this.getParam('menu_item_name_'+ item.type);
		if(menuItemName && menuItemName != '') {
			newMenuItemHtml.find('.octBlockMenuElTitle').html( menuItemName );
		}
		this['_initMenuItem_'+ item.type]( newMenuItemHtml, item );
	}
};
octBlockBase.prototype._initMenuItem_align = function(newMenuItemHtml, item) {
	if(this._data.params && this._data.params.align) {
		//newMenuItemHtml.find('input[name="params[align]"]').val( this._data.params.align.val );
		//newMenuItemHtml.find('.octBlockMenuElElignBtn').removeClass('active');
		//newMenuItemHtml.find('.octBlockMenuElElignBtn[data-align="'+ this._data.params.align.val+ '"]').addClass('active');
		this._setAlign( this._data.params.align.val, true, newMenuItemHtml );
	}
	var self = this;
	newMenuItemHtml.find('.octBlockMenuElElignBtn').click(function(){
		self._setAlign( jQuery(this).data('align') );
	});
};
octBlockBase.prototype._clickMenuItem_align = function(options) {
	return false;
};
octBlockBase.prototype._setAlign = function( align, ignoreAutoSave, menuItemHtml ) {
	var possibleAligns = ['left', 'center', 'right'];
	for(var i in possibleAligns) {
		this._$.removeClass('octAlign_'+ possibleAligns[ i ]);
	}
	this._$.addClass('octAlign_'+ align);
	this.setParam('align', align);
	
	if(!menuItemHtml) {
		var menuOpt = this._$.data('_contentMenuOpt');
		menuItemHtml = menuOpt.items.align.$node;
	}
	menuItemHtml.find('input[name="params[align]"]').val( align );
	menuItemHtml.find('.octBlockMenuElElignBtn').removeClass('active');
	menuItemHtml.find('.octBlockMenuElElignBtn[data-align="'+ align+ '"]').addClass('active');
	
	if(!ignoreAutoSave) {
		_octSaveCanvas();
	}
};
// For now fill color used only in slider, but we assume that it can be used in other block types too - so let it be in base block type for now.
// But if it will be only for slider block type for a long type - you can move it to slider block class - OOP is really good for us:)
octBlockBase.prototype._initMenuItem_fill_color = function(newMenuItemHtml, item) {
	if(this._data.params && this._data.params.fill_color_enb && parseInt(this._data.params.fill_color_enb.val)) {
		newMenuItemHtml.find('input[name="params[fill_color_enb]"]').attr('checked', 'checked');
		this._updateFillColor( true );
	}
	var self = this;
	newMenuItemHtml.find('input[name="params[fill_color_enb]"]').change(function(){
		self.setParam('fill_color_enb', jQuery(this).attr('checked') ? 1 : 0);
		self._updateFillColor();
	});
	//tinycolor is object of tinycolor lib.
	var initColor = new tinycolor( self.getParam('fill_color') );
	initColor.setAlpha( self.getParam('fill_color_opacity') );
	var fillColorSettings = {
		placement: 'bottom'
	,	color: initColor.toRgbString()
	,	order: {
			hsl: 1
		,	opacity: 2
		}
	,	customswatches: 'different-swatches-groupname'
	,	swatches: ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)', 'blue']
	,	labels: {
			hslhue: 'color tone'
		,	hslsaturation: 'saturation'
		,	hsllightness: 'brightness'
		,	opacity: 'alfa'
		}
	,	onchange: function(container, color) {
			// If it is not visible - this mean it was trigered first time right after init, and in this time we already setup fil color
			if(container.is(':visible')) {
				self._updateFillColorFromColorpicker( color.tiny );
			}
			container.find('.cp-hsllightness .cp-marker').html( Math.round(color.hsla.l * 100) );
			container.find('.cp-opacity .cp-marker').html( Math.round(color.hsla.a * 100) );
			//container.find('.hex_present').val( color.tiny.toHex() );
		}
	};
	if(self._onShowFillColorPicker) {
		fillColorSettings.onshow = function(){
			self._onShowFillColorPicker();
		};
	}
	if(self._onHideFillColorPicker) {
		fillColorSettings.onhide = function(){
			self._onHideFillColorPicker();
		};
	}
	newMenuItemHtml.find('.octColorpickerInput').ColorPickerSliders( fillColorSettings );
};
octBlockBase.prototype._updateFillColorFromColorpicker = function( color, ignoreAutoSave ) {
	this.setParam('fill_color', '#'+ color.toHex());
	this.setParam('fill_color_opacity', color.getAlpha());
	this._updateFillColor( ignoreAutoSave );
};
octBlockBase.prototype._updateFillColor = function( ignoreAutoSave ) {
	var fillColorEnb = this.getParam('fill_color_enb')
	,	overlay = this._$.find('.octCoverOverlay')
	,	overlayUsed = overlay.size();
	if(!overlayUsed) {
		overlay = this._$;
	}
	if(fillColorEnb) {
		var fillColor = this.getParam('fill_color')
		,	fillColorOpacity = this.getParam('fill_color_opacity');

		if(overlayUsed) {
			overlay.css({
				'background-color': fillColor
			,	'opacity': fillColorOpacity
			}).show();
		} else {
			var fillColorObj = new tinycolor( fillColor );
			fillColorObj.setAlpha( fillColorOpacity );
			overlay.css({
				'background-color': fillColorObj.toRgbString()
			});
		}
	} else {
		if(overlayUsed)
			overlay.hide();
	}
	if(!ignoreAutoSave) {
		_octSaveCanvas();
	}
};
octBlockBase.prototype._clickMenuItem_fill_color = function(options) {
	// Show color-picker on menu item click
	options.items.fill_color.$node.find('.octColorpickerInput').trigger('focus');
	/*var fillColorEnb = this.getParam('fill_color_enb')
	,	enbCheck = options.items.fill_color.$node.find('input[name="params[fill_color_enb]"]');
	fillColorEnb ? enbCheck.removeAttr('checked') : enbCheck.attr('checked', 'checked');
	octCheckUpdate( enbCheck );
	enbCheck.trigger('change');*/
	// Just do nothing for now, if require change checkbox - uncoment code below
	return false;
};
octBlockBase.prototype._initMenuItem_bg_img = function(newMenuItemHtml, item) {
	if(this._data.params && this._data.params.bg_img_enb && parseInt(this._data.params.bg_img_enb.val)) {
		newMenuItemHtml.find('input[name="params[bg_img_enb]"]').attr('checked', 'checked');
	}
	var self = this;
	newMenuItemHtml.find('input[name="params[bg_img_enb]"]').change(function(){
		self.setParam('bg_img_enb', jQuery(this).attr('checked') ? 1 : 0);
		self._updateBgImg();
	});
};
octBlockBase.prototype._clickMenuItem_bg_img = function(options) {
	var self = this;
	octCallWpMedia({
		id: this._$.attr('id')
	,	clb: function(opts, attach, imgUrl) {
			// we will use full image url from attach.url always here (not image with selected size imgUrl) - as this is bg image
			// but if you see really big issue with this - just try to do it better - but don't broke everything:)
			self.setParam('bg_img', attach.url);
			self._updateBgImg();
		}
	});
};
octBlockBase.prototype._updateBgImg = function( ignoreAutoSave ) {
	this._rebuildCss();

	if(!ignoreAutoSave) {
		_octSaveCanvas();
	}
};
octBlockBase.prototype._clickMenuItem = function(key, options) {
	if(this['_clickMenuItem_'+ key] && typeof(this['_clickMenuItem_'+ key]) === 'function') {
		return this['_clickMenuItem_'+ key]( options );
	}
};
octBlockBase.prototype._buildMenu = function() {
	if(this._data.params && this._data.params.menu_items && this._data.params.menu_items.val != '') {
		var itemKeys = this._data.params.menu_items.val.split('|')
		,	menuItems = {}
		,	self = this;
		for(var i = 0; i < itemKeys.length; i++) {
			menuItems[ itemKeys[i] ] = {
				type: itemKeys[i]
			,	callback: function(key, options) {
					return self._clickMenuItem( key, options );
				}
			,	iterNum: i
			};
			jQuery.contextMenu.types[ itemKeys[i] ] = function(item, opt, root) {
				var html = jQuery('#octBlockMenuExl').find('.octBlockMenuEl[data-menu="'+ item.type+ '"]');
				if(html && html.size()) {
					var newMenuItemHtml = html.clone();
					newMenuItemHtml.appendTo(this);
					// We can't use i here - as this is callback for earlier call, so use here our defined param iterNum
					if(item.iterNum < itemKeys.length - 1)	{	// Visual delimiter for all menu items except last one
						jQuery('<div class="octBlockMenuDelim" />').appendTo(this);
					}
					self._initMenuItem( newMenuItemHtml, item );
				} else {
					console.log('Can not Find Element Menu Item: '+ item.type+ ' !!!');
				}
			};
		}
		var menuOpts = {
			selector: '#'+ this._$.attr('id')
		,	zIndex: 9999
		,	position: function(opt, x, y) {
				if(!opt._octCustInpInited) {
					octInitCustomCheckRadio( opt.$menu );
					opt._octCustInpInited = true;
				}
				opt.$menu.css({top: y, left: x - opt.$menu.width() / 2});
			}
		,	items: menuItems
		};
		jQuery.contextMenu( menuOpts );
	}
};
octBlockBase.prototype.getContent = function() {
	return this._$.find('.octBlockContent:first');
};
octBlockBase.prototype.getHtml = function() {
	var html = this.getContent().html()
	,	revertReplace = [
			{key: 'session_id'}
		/*,	{key: 'sub_form_start', raw: true}
		,	{key: 'sub_form_end', raw: true}*/
	];
	for(var i = 0; i < revertReplace.length; i++) {
		var key = revertReplace[ i ].key
		,	value = this.get( key )
		,	replaceFrom = [ value ]
		,	replaceTo = revertReplace[i].raw ? '{{block.'+ key+ '|raw}}' : '{{block.'+ key+ '}}';
		if(typeof(value) === 'string' && revertReplace[i].raw) {
			replaceFrom.push( value.replace(/\s+\/>/g, '>') );
		}
		for(var j = 0; j < replaceFrom.length; j++) {
			html = str_replace(html, replaceFrom[ j ], replaceTo);
		}
	}
	return html;
};
octBlockBase.prototype.getIter = function() {
	return this._iter;
};
octBlockBase.prototype.beforeSave = function() {
	if(this._elements && this._elements.length) {
		for(var i = 0; i < this._elements.length; i++) {
			this._elements[ i ].beforeSave();
		}
	}
};
octBlockBase.prototype.afterSave = function() {
	if(this._elements && this._elements.length) {
		for(var i = 0; i < this._elements.length; i++) {
			this._elements[ i ].afterSave();
		}
	}
};
/**
 * Covers block base class
 */

/**
 * Sliders block base class
 */

octBlock_sliders.prototype.beforeSave = function() {
	octBlock_sliders.superclass.beforeSave.apply(this, arguments);
	if(this._slider && this._slider.getCurrentSlide) {
		this._currentSlide = this._slider.getCurrentSlide();
	}
	this._destroySlider();
};
octBlock_sliders.prototype.afterSave = function() {
	octBlock_sliders.superclass.afterSave.apply(this, arguments);
	this._refreshSlides();
	this._initSlider();
};
octBlock_sliders.prototype._destroySlider = function() {
	if(this._slider) {
		this._slider.destroySlider();
	}
};
octBlock_sliders.prototype._clickMenuItem_add_slide = function(options, params) {
	params = params || {};
	var self = this;
	octCallWpMedia({
		id: this._$.attr('id')
	,	clb: function(opts, attach, imgUrl) {
			self.beforeSave();
			var value = self._data.params.new_slide_html.val;
			var newSlideHtml = jQuery( value );
			newSlideHtml.find('.octSlideImg').attr('src', imgUrl);
			self._$.find('.bxslider').append( newSlideHtml );
			var addedElements = self._initElementsForArea( newSlideHtml );
			// We added some elemtns, they were created and initialized - but all elements should be nulled, 
			// it was done in self.beforeSave(); for alll elements except those list. So, lets null them too, they will be re-initialized in 
			// code bellow - self.afterSave();
			if(addedElements && addedElements.length) {
				for(var i = 0; i < addedElements.length; i++) {
					addedElements[ i ].beforeSave();
				}
			}
			self.afterSave();
			_octSaveCanvas();
			// We add slide to the end of slider - so let's go to new slide right now
			self._slider.goToSlide( self._slider.getSlideCount() - 1 );
			if(params.clb && typeof(params.clb) == 'function') {
				params.clb();
			}
		}
	});
};
octBlock_sliders.prototype._clickMenuItem_edit_slides = function(options) {
	octUtils.showSlidesEditWnd( this );
};
octBlock_sliders.prototype._beforeInitHtml = function() {
	octBlock_sliders.superclass._beforeInitHtml.apply(this, arguments);
	this._refreshSlides();
};
octBlock_sliders.prototype._refreshSlides = function() {
	var iter = 1;
	this._$.find('.octSlide').each(function(){
		jQuery(this).data('slide-id', iter);
		iter++;
	});
	this._slides = this._$.find('.octSlide');
};
octBlock_sliders.prototype.getSlides = function() {
	return this._slides;
};
octBlock_sliders.prototype.getSliderShell = function() {
	return this._$.find('.octSliderShell');
};
/**
 * Galleries block
 */
octBlock_galleries.prototype.recalcRows = function() {
	var imgPerRow = parseInt(this.getParam('img_per_row'))
	,	rows = this._$.find('.row');
	
	for(var i = 0; i < rows.length; i++) {
		var rowImgsCount = jQuery(rows[ i ]).find('.octGalItem').size();
		if(rowImgsCount < imgPerRow && rows[ i + 1 ]) {
			// TODO: Make it to append not only first one, but all first elements count (imgPerRow - rowImgsCount)
			jQuery(rows[ i ]).append( jQuery(rows[ i + 1 ]).find('.octGalItem:first') );
		}
		if(rowImgsCount > imgPerRow) {
			if(rows[ i + 1 ]) {
				jQuery(rows[ i + 1 ]).prepend( jQuery(rows[ i ]).find('.octGalItem:last') );
			} else {
				jQuery('<div class="row" />').insertAfter( rows[ i ] ).prepend( jQuery(rows[ i ]).find('.octGalItem:last') );
			}
		}
	}
};
octBlock_galleries.prototype._initHtml = function() {
	octBlock_galleries.superclass._initHtml.apply(this, arguments);
	var self = this
	,	placeholderClasses = this._$.find('.octGalItem').attr('class');
	placeholderClasses += ' ui-state-highlight-gal-item';
	this._$.sortable({
		revert: true
	,	placeholder: placeholderClasses
	,	handle: '.octImgMoveBtn'
	,	items: '.octGalItem'
	,	start: function(event, ui) {
			var galleryItem = self._$.find('.octGalItem:first');
			ui.placeholder.css({
				'height': galleryItem.height()+ 'px'
			});
		}
	,	stop: function(event, ui) {
			self.recalcRows();
			setTimeout(function(){
				_octSaveCanvas();
			}, 400);
		}
	});
	this._initLightbox();
};
octBlock_galleries.prototype._clickMenuItem_add_gal_item = function(options, params) {
	params = params || {};
	var self = this;
	octCallWpMedia({
		id: this._$.attr('id')
	,	clb: function(opts, attach, imgUrl) {
			self.beforeSave();
			var value = self.getParam('new_item_html');
			value = twig({
				data: value
			}).render({
				block: self._data
			});
			var	newItemHtml = jQuery( value );
			newItemHtml.find('.octGalImg').attr('src', imgUrl).attr('data-full-img', attach.url);
			newItemHtml.find('.octGalLink').attr('href', attach.url);

			var appendToRow = self._$.find('.row:last')
			,	imgPerRow = parseInt(self.getParam('img_per_row'));
			if(appendToRow.find('.octGalItem').size() >= imgPerRow) {
				jQuery('<div class="row" />').insertAfter( appendToRow );
				appendToRow = self._$.find('.row:last');
			}
			appendToRow.append( newItemHtml );
			self._initLightbox();
			var addedElements = self._initElementsForArea( newItemHtml );
			// We added some elemtns, they were created and initialized - but all elements should be nulled, 
			// it was done in self.beforeSave(); for alll elements except those list. So, lets null them too, they will be re-initialized in 
			// code bellow - self.afterSave();
			if(addedElements && addedElements.length) {
				for(var i = 0; i < addedElements.length; i++) {
					addedElements[ i ].beforeSave();
				}
			}
			self.afterSave();
			_octSaveCanvas();
			if(params.clb && typeof(params.clb) == 'function') {
				params.clb();
			}
		}
	});
};
octBlock_galleries.prototype._updateFillColorFromColorpicker = function( color, ignoreAutoSave ) {
	this.setParam('fill_color', color.toRgbString());
	this.setParam('fill_color_opacity', color.getAlpha());
	this._updateFillColor( ignoreAutoSave );
};
octBlock_galleries.prototype._updateFillColor = function( ignoreAutoSave ) {
	var fillColorEnb = this.getParam('fill_color_enb')
	,	captions = this._$.find('.octGalItemCaption');
	if(fillColorEnb) {
		var fillColor = this.getParam('fill_color');
		captions.css({
			'background-color': fillColor
		}).show();
	} else {
		captions.hide();
	}
};
octBlock_galleries.prototype._onShowFillColorPicker = function() {
	this._$.find('.octGalItemCaption').addClass('mce-edit-focus');
};
octBlock_galleries.prototype._onHideFillColorPicker = function() {
	this._$.find('.octGalItemCaption').removeClass('mce-edit-focus');
	_octSaveCanvas();
};
/**
 * Menu block base class
 */
octBlock_menus.prototype._afterInitElements = function() {
	octBlock_menus.superclass._afterInitElements.apply(this, arguments);
	// TODO: Fix this drag-&-drop menu items functionality, problem was when we enable it - text editor stop showing-up
	/*this._$.find('.octMenuMain').sortable({
		items: '.octMenuItem'
	,	delay: 150
	,	distance: 5
	});*/
};
octBlock_menus.prototype._clickMenuItem_add_menu_item = function(options, params) {
	this._showAddMenuItemWnd();
};
octBlock_menus.prototype._showAddMenuItemWnd = function() {
	octUtils.addMenuItemWndBlock = this;
	if(!octUtils.addMenuItemWnd) {
		octUtils.addMenuItemWnd = jQuery('#octAddMenuItemWnd').modal({
			show: false
		});
		octUtils.addMenuItemWnd.find('.octAddMenuItemSaveBtn').click(function(){
			var text = jQuery.trim( octUtils.addMenuItemWnd.find('[name="menu_item_text"]').val() )
			,	link = jQuery.trim( octUtils.addMenuItemWnd.find('[name="menu_item_link"]').val() )
			,	newWnd = octUtils.addMenuItemWnd.find('[name="menu_item_new_window"]').attr('checked') ? 1 : 0;
			if(text && text != '') {
				if(link && link != '') {
					var newItemHtml = jQuery( octUtils.addMenuItemWndBlock.getParam('new_item_html') )
					,	linkHtml = newItemHtml.find('a')
					,	menuMainRow = octUtils.addMenuItemWndBlock._$.find('.octMenuMain');
					link = octUtils.converUrl( link );
					linkHtml.attr('data-mce-href', link).attr('href', link).html( text );
					if(newWnd) {
						linkHtml.attr('target', '_blank');
					}
					menuMainRow.append( newItemHtml );
					var addedElements = octUtils.addMenuItemWndBlock._initElementsForArea( newItemHtml );
					_octSaveCanvas();
					octUtils.addMenuItemWnd.modal('hide');
				} else {
					octUtils.addMenuItemWnd.find('[name="menu_item_link"]').addClass('octInputError');
				}
			} else {
				octUtils.addMenuItemWnd.find('[name="menu_item_text"]').addClass('octInputError');
			}
			return false;
		});
		octInitCustomCheckRadio( octUtils.addMenuItemWnd );
	}
	octUtils.addMenuItemWnd.find('[name="menu_item_text"]').removeClass('octInputError').val(''),
	octUtils.addMenuItemWnd.find('[name="menu_item_link"]').removeClass('octInputError').val('');
	octCheckUpdate( octUtils.addMenuItemWnd.find('[name="menu_item_new_window"]').removeAttr('checked') );
	octUtils.addMenuItemWnd.modal('show');
};
/**
 * Subscribe block base class
 */
octBlock_subscribes.prototype.getFields = function() {
	if(!this._fields) {
		/*var fieldsStr = this.getParam('fields');
		this._fields = unserialize(fieldsStr);*/
		this._fields = this.getParam('fields');
	}
	return this._fields;
};
octBlock_subscribes.prototype.updateFields = function() {
	this.setParam('fields', this._fields);
};
octBlock_subscribes.prototype.setFieldParam = function(name, paramKey, paramVal) {
	this.getFields();
	if(this._fields.length) {
		for(var i = 0; i < this._fields.length; i++) {
			if(this._fields[i].name == name) {
				this._fields[i][ paramKey ] = paramVal;
				this.updateFields();
				break;
			}
		}
	}
};
octBlock_subscribes.prototype.setFieldLabel = function(name, label) {
	this.setFieldParam(name, 'label', label);
};
octBlock_subscribes.prototype.setFieldRequired = function(name, required) {
	this.setFieldParam(name, 'required', required);
};
octBlock_subscribes.prototype.addField = function(data) {
	this.getFields();
	this._fields.push( data );
};
octBlock_subscribes.prototype.removeField = function(name) {
	this.getFields();
	if(this._fields.length) {
		for(var i = 0; i < this._fields.length; i++) {
			if(this._fields[i].name == name) {
				this._fields.splice(i, 1);
				this.updateFields();
				break;
			}
		}
	}
};
octBlock_subscribes.prototype._afterInitElements = function() {
	octBlock_subscribes.superclass._afterInitElements.apply(this, arguments);
	var placeholderClasses = this._$.find('.octElInput:first').attr('class');
	placeholderClasses += ' ui-state-highlight-gal-item';
	this._$.find('.octFormShell').sortable({
		items: '.octElInput'
	,	handle: '.octImgMoveBtn'
	,	placeholder: placeholderClasses
	//,	containment: 'parent'
	//,	forceHelperSize: true
	//,	forcePlaceholderSize : true
	//,	cursorAt : {top: -20}
	,	start: function(event, ui) {
			var placeholderSub = ui.item.clone();
			placeholderSub.find('.octElMenu').remove();
			ui.placeholder.html( placeholderSub.html() );
		}
	,	stop: function(event, ui) {
			_octSaveCanvasDelay();
		}
	});
};
octBlock_subscribes.prototype._clickMenuItem_sub_settings = function(options, params) {
	this._showSubSettingsWnd();
};
octBlock_subscribes.prototype._showSubSettingsWnd = function() {
	octUtils.subSettingsWndBlock = this;
	if(!octUtils.subSettingsWnd) {
		octUtils.subSettingsWnd = jQuery('#octSubSettingsWnd').modal({
			show: false
		});
		octUtils.subSettingsWnd.find('.octSubSettingsSaveBtn').click(function(){
			// TODO: Move such functionality (values to parameters) to separate class, or at least - to octUtils
			octUtils.subSettingsWnd.find('.octSettingFieldsShell').find('input, textarea, select').each(function(){
				var paramName = jQuery(this).attr('name')
				,	paramCheckbox = jQuery(this).attr('type') == 'checkbox'
				,	paramValue = '';
				if(paramCheckbox) {
					paramValue = jQuery(this).attr('checked') ? 1 : 0;
				} else {
					paramValue = jQuery(this).val();
				}
				octUtils.subSettingsWndBlock.setParam(paramName, paramValue);
			});
			_octSaveCanvas();
			octUtils.subSettingsWnd.modal('hide');
			return false;
		});
		octInitCustomCheckRadio( octUtils.subSettingsWnd );
		octUtils.subSettingsWnd.find('#octSubSettingsWndTabs').wpTabs();
	}
	// TODO: Move such functionality (parameters to values) to separate class, or at least - to octUtils
	octUtils.subSettingsWnd.find('.octSettingFieldsShell').find('input, textarea, select').each(function(){
		var paramName = jQuery(this).attr('name')
		,	paramCheckbox = jQuery(this).attr('type') == 'checkbox'
		,	paramValue = octUtils.subSettingsWndBlock.getParam( paramName );
		if(paramCheckbox) {
			parseInt(paramValue) 
				? jQuery(this).attr('checked', 'checked')
				: jQuery(this).removeAttr('checked');
			octCheckUpdate( this );
		} else {
			jQuery(this).val( paramValue ? paramValue : jQuery(this).data('default') );
		}
	});
	octUtils.subSettingsWnd.modal('show');
};
octBlock_subscribes.prototype._clickMenuItem_add_field = function(options, params) {
	this._showAddFieldWnd();
};
octBlock_subscribes.prototype._showAddFieldWnd = function() {
	octUtils.subAddFieldWndBlock = this;
	if(!octUtils.subAddFieldWnd) {
		octUtils.subAddFieldWnd = jQuery('#octAddFieldWnd').modal({
			show: false
		});
		octUtils.subAddFieldWnd.find('.octAddFieldSaveBtn').click(function(){
			var label = jQuery.trim( octUtils.subAddFieldWnd.find('[name="new_field_label"]').val() )
			,	name = jQuery.trim( octUtils.subAddFieldWnd.find('[name="new_field_name"]').val() )
			,	htmlType = octUtils.subAddFieldWnd.find('[name="new_field_html"]').val()
			,	required = octUtils.subAddFieldWnd.find('[name="new_field_reuired"]').attr('checked') ? 1 : 0;
			if(label && label != '') {
				if(name && name != '')  {
					octUtils.subAddFieldWndBlock.getFields();
					var newItemHtml = jQuery( octUtils.subAddFieldWndBlock.getParam('new_item_html') )
					,	inputHtml = newItemHtml.find('input')	// TODO: Make this work with all types of input (textarea, select, ...)
					,	formInputsShell = octUtils.subAddFieldWndBlock._$.find('.octFormFieldsShell');
					inputHtml.attr('placeholder', label).attr('name', name).attr('type', htmlType);
					if(required) {
						inputHtml.attr('required', '1');
					}
					formInputsShell.append( newItemHtml );
					var addedElements = octUtils.subAddFieldWndBlock._initElementsForArea( newItemHtml );
					octUtils.subAddFieldWndBlock.addField({
						name: name
					,	label: label
					,	html: htmlType
					,	required: required
					});
					_octSaveCanvas();
					octUtils.subAddFieldWnd.modal('hide');
				} else {
					octUtils.subAddFieldWnd.find('[name="new_field_name"]').addClass('octInputError');
				}
			} else {
				octUtils.subAddFieldWnd.find('[name="new_field_label"]').addClass('octInputError');
			}
			return false;
		});
		octInitCustomCheckRadio( octUtils.subAddFieldWnd );
	}
	octUtils.subAddFieldWnd.find('[name="new_field_label"]').removeClass('octInputError').val('');
	octUtils.subAddFieldWnd.find('[name="new_field_name"]').removeClass('octInputError').val('');
	octUtils.subAddFieldWnd.find('[name="new_field_html"]').removeClass('octInputError').val('text');
	octCheckUpdate( octUtils.subAddFieldWnd.find('[name="new_field_reuired"]').removeAttr('checked') );
	octUtils.subAddFieldWnd.modal('show');
};
/*octBlock_subscribes.prototype.beforeSave = function() {
	octBlock_subscribes.superclass.beforeSave.apply(this, arguments);
};
octBlock_subscribes.prototype.afterSave = function() {
	octBlock_subscribes.superclass.afterSave.apply(this, arguments);
};*/
octBlock_subscribes.prototype.getHtml = function() {
	var html = octBlock_subscribes.superclass.getHtml.apply(this, arguments);
	// We should replace start and end of our form each time we are doing save - as we need this content to be dynamicaly generated
	html = html.replace(/<\!--sub_form_start_open-->.+<\!--sub_form_start_close-->/g, '{{block.sub_form_start|raw}}');
	html = html.replace(/<\!--sub_form_end_open-->.+<\!--sub_form_end_close-->/g, '{{block.sub_form_end|raw}}');
	return html;
};