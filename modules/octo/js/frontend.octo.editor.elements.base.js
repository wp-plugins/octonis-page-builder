function octElementBase(jqueryHtml, block) {
	this._iterNum = 0;
	this._animationSpeed = g_octAnimationSpeed;
	this._$ = jqueryHtml;
	this._block = block;
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = '';
	}
	this._innerImgsCount = 0;
	this._innerImgsLoaded = 0;
	//this._$menu = null;
	this._menu = null;
	this._menuClbs = {};
	if(typeof(this._menuClass) === 'undefined') {
		this._menuClass = 'octElementMenu';
	}
	this._menuOnBottom = false;
	//if(typeof(this._code) === 'undefined') {
		this._code = 'base';
	//}
	this._initedComplete = false;
	this._editArea = null;
	
	if(g_octEdit) {
		this._init();
		this._initMenuClbs();
		this._initMenu();

		var images = this._$.find('img');
		if(images && (this._innerImgsCount = images.size())) {
			this._innerImgsLoaded = 0;
			var self = this;
			images.load(function(){
				self._innerImgsLoaded++;
				if(self._$.find('img').size() == self._innerImgsLoaded) {
					self._afterFullContentLoad();
				}
			});
		}
	}
	this._onlyFirstHtmlInit();
	this._initedComplete = true;
}
octElementBase.prototype.getBlock = function() {
	return this._block;
};
octElementBase.prototype._onlyFirstHtmlInit = function() {
	if(this._$ && !this._$.data('first-inited')) {
		this._$.data('first-inited', 1);
		return true;
	}
	return false;
};
octElementBase.prototype.setIterNum = function(num) {
	this._iterNum = num;
	this._$.data('iter-num', num);
};
octElementBase.prototype.getIterNum = function() {
	return this._iterNum;
};
octElementBase.prototype.$ = function() {
	return this._$;
};
octElementBase.prototype.getCode = function() {
	return this._code;
};
octElementBase.prototype._setCode = function(code) {
	this._code = code;
};
octElementBase.prototype._init = function() {
	this._beforeInit();
};
octElementBase.prototype._beforeInit = function() {
	
};
octElementBase.prototype.destroy = function() {
	
};
octElementBase.prototype.get = function(opt) {
	return this._$.attr( 'data-'+ opt );	// not .data() - as it should be saved even after page reload, .data() will not create element attribute
};
octElementBase.prototype.set = function(opt, val) {
	this._$.attr( 'data-'+ opt, val );	// not .data() - as it should be saved even after page reload, .data() will not create element attribute
};
octElementBase.prototype._getEditArea = function() {
	if(!this._editArea) {
		this._editArea = this._$.children('.octElArea');
		if(!this._editArea.size()) {
			this._editArea = this._$.find('.octInputShell');
		}
	}
	return this._editArea;
};
octElementBase.prototype._getOverlay = function() {
	return this._$.find('.octElOverlay');
};
/**
 * Standart button item
 */
function octElement_btn(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'octElMenuBtnExl';
	}
	this._menuClass = 'octElementMenu_btn';
	this._haveAdditionBgEl = null;
	octElement_btn.superclass.constructor.apply(this, arguments);
}
extendOct(octElement_btn, octElementBase);
octElement_btn.prototype._onlyFirstHtmlInit = function() {
	if(octElement_btn.superclass._onlyFirstHtmlInit.apply(this, arguments)) {
		if(this.get('customhover-clb')) {
			var clbName = this.get('customhover-clb');
			if(typeof(this[clbName]) === 'function') {
				var self = this;
				this._getEditArea().hover(function(){
					self[clbName](true, this);
				}, function(){
					self[clbName](false, this);
				});
			}
		}
	}
};
octElement_btn.prototype._hoverChangeFontColor = function( hover, element ) {
	if(hover) {
		jQuery(element)
			.data('original-color', this._getEditArea().css('color'))
			.css('color', jQuery(element).parents('.octEl:first').attr('data-bgcolor'));	// Ugly, but only one way to get this value in dynamic way for now
	} else {
		jQuery(element)
			.css('color', jQuery(element).data('original-color'));
	}
};
octElement_btn.prototype._hoverChangeBgColor = function( hover, element ) {
	var parentElement = jQuery(element).parents('.octEl:first');	// Actual element html
	if(hover) {
		parentElement
			.data('original-color', parentElement.css('background-color'))
			.css('background-color', parentElement.attr('data-bgcolor'));	// Ugly, but only one way to get this value in dynamic way for now
	} else {
		parentElement
			.css('background-color', parentElement.data('original-color'));
	}
};
