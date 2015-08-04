function octMainMenu(element) {
	this._visible = false;
	this._$ = jQuery(element);
	this._animationSpeed = 300;
	this._mouseOver = false;
	this._catWidth = 120;
	this._blockWidth = 340;
	this._openBtnLeft = 30;
	this._init();
}
octMainMenu.prototype._init = function() {
	this._$.mouseover(jQuery.proxy(function(){
		this._mouseOver = true;
	}, this)).mouseleave(jQuery.proxy(function(){
		this._mouseOver = false;
	}, this));
};
octMainMenu.prototype.checkShow = function() {
	if(!this._visible) {
		this.show();
		return true;
	}
	return false;
};
octMainMenu.prototype.show = function() {
	this._visible = true;
	this._$.stop();
};
octMainMenu.prototype.checkHide = function() {
	if(this._visible) {
		this.hide();
	}
};
octMainMenu.prototype.hide = function() {
	this._visible = false;
	this._$.stop();
};
octMainMenu.prototype.isVisible = function() {
	return this._visible;
};
octMainMenu.prototype.getRaw = function() {
	return this._$;
};
octMainMenu.prototype.isMouseOver = function() {
	return this._mouseOver;
};
octMainMenu.prototype._setOpenBtnPos = function(pos) {
	jQuery('.octMainBarHandle').stop().animate({
		'left': pos+ 'px'
	}, this._animationSpeed);
	if(pos == this._openBtnLeft) {
		jQuery('.octMainBarHandle').removeClass('active').find('.octo-icon').addClass('icon-pluss-b').removeClass('icon-close-b');
	} else {
		jQuery('.octMainBarHandle').addClass('active').find('.octo-icon').addClass('icon-close-b').removeClass('icon-pluss-b');
	}
};
/**
 * Categories Menu Class (Main Menu)
 */
function octCategoriesMainMenu(element) {
	octCategoriesMainMenu.superclass.constructor.apply(this, arguments);
	this._subMenus = [];
	this._cidToSubId = {};
}
extendOct(octCategoriesMainMenu, octMainMenu);
octCategoriesMainMenu.prototype.addSubMenu = function(subMenuObj) {
	var newSubObj = new octBlocksMainMenu(subMenuObj);
	var newIter = this._subMenus.push( newSubObj );
	this._cidToSubId[ newSubObj.getRaw().data('cid') ] = newIter - 1;
};
octCategoriesMainMenu.prototype.showSubByCid = function(cid) {
	if(this._subMenus[ this._cidToSubId[ cid ] ].checkShow()) {
		this._$.find('[data-id="'+ cid+ '"]').addClass('active');
		for(var i = 0; i < this._subMenus.length; i++) {
			if(this._subMenus[i].getCid() !== cid) {
				this.hideSubByCid( this._subMenus[i].getCid() );
			}
		}
	}
};
octCategoriesMainMenu.prototype.hideSubByCid = function(cid) {
	if(this._subMenus[ this._cidToSubId[ cid ] ].checkHide()) {
		this._$.find('[data-id="'+ cid+ '"]').removeClass('active');
	}
};
octCategoriesMainMenu.prototype.show = function() {
	octCategoriesMainMenu.superclass.show.apply(this, arguments);
	var self = this;
	this._$.animate({
		'left': '0px'
	}, this._animationSpeed, function(){
		self._$.find('.octMainBarInner').slimScroll({
			height: jQuery(window).height()
		});
	});
	this._setOpenBtnPos( this._catWidth + this._openBtnLeft );
};
octCategoriesMainMenu.prototype.checkHide = function() {
	if(this._visible && !this.isMouseOver()) {
		for(var i = 0; i < this._subMenus.length; i++) {
			if(this._subMenus[i].isMouseOver())
				return false;
		}
		this.hide();
		return true;
	}
	return false;
};
octCategoriesMainMenu.prototype.hide = function() {
	octCategoriesMainMenu.superclass.hide.apply(this, arguments);
	this._$.animate({
		'left': -this._catWidth+ 'px'
	}, this._animationSpeed);
	for(var i = 0; i < this._subMenus.length; i++) {
		this._subMenus[i].checkHide();
	}
	this._setOpenBtnPos( this._openBtnLeft );
};
octCategoriesMainMenu.prototype.isSubMenuVisible = function() {
	for(var i = 0; i < this._subMenus.length; i++) {
		if(this._subMenus[i].isVisible()) {
			return true;
		}
	}
	return false;
};
/**
 * Blocks Menu Class (Sub Menus)
 */
function octBlocksMainMenu(element) {
	octBlocksMainMenu.superclass.constructor.apply(this, arguments);
	this._cid = this._$.data('cid');
}
extendOct(octBlocksMainMenu, octMainMenu);
octBlocksMainMenu.prototype.getCid = function() {
	return this._cid;
};
octBlocksMainMenu.prototype.show = function() {
	octBlocksMainMenu.superclass.show.apply(this, arguments);
	var self = this;
	this._$.animate({
		'left': this._catWidth+ 'px'
	}, this._animationSpeed, function(){
		self._$.find('.octBlockBarInner').slimScroll({
			height: jQuery(window).height()
		});
	});
	this._setOpenBtnPos( this._catWidth + this._openBtnLeft + this._blockWidth );
};
octBlocksMainMenu.prototype.hide = function() {
	octBlocksMainMenu.superclass.hide.apply(this, arguments);
	this._$.animate({
		'left': -this._blockWidth+ 'px'
	}, this._animationSpeed);
	this._setOpenBtnPos( this._catWidth + this._openBtnLeft );
};
octBlocksMainMenu.prototype.checkHide = function() {
	if(this._visible && !this.isMouseOver()) {
		this.hide();
		return true;
	}
	return false;
};