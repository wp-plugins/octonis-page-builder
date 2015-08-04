var g_octMainMenu = null
,	g_octFileFrame = null	// File frame for wp media uploader
,	g_octEdit = true
,	g_octTopBarH = 93;	// Height of the Top Editor Bar
jQuery(document).ready(function(){
	// Adding beforeStart event for sortable
	var oldMouseStart = jQuery.ui.sortable.prototype._mouseStart;
	jQuery.ui.sortable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
		this._trigger("beforeStart", event, this._uiHash());
		oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
	};
	/*jQuery('.octEl').mousedown(function(e){
		jQuery(this).data('_mouseDownTime', (new Date()).getTime());
		var editor = tinymce.get(jQuery(this).attr('id') || 'content');
		console.log(editor);
	});
	jQuery('.octEl').click(function(e){
		var clickTime = jQuery(this).data('_mouseDownTime')
		,	clickTimeDiff = (new Date()).getTime()- clickTime;
		if(clickTimeDiff <= 500) {
			e.stopPropagation();
			tinymce.init({
				selector: this
			,	inline: true
			,	toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image'
			,	menubar: false
			});
			//tinymce.get(jQuery(this).attr('id') || 'content').focus();
		}
	});*/
	// Prevent all default browser event - such as links redirecting, forms submit, etc.
	jQuery('#octCanvas').on('click', 'a', function(event){
		event.preventDefault();
	});
	_octInitMainMenu();
	_octInitDraggable();
	
	_octFitCanvasToScreen();
	jQuery(window).resize(function(){
		_octFitCanvasToScreen();
	});
	jQuery('.octMainSaveBtn').click(function(){
		_octSaveCanvas();
		return false;
	});
});
function _octInitMainMenu() {
	var mainDelay = 100;
	jQuery('.octBlocksBar').slimScroll({
		height: jQuery(window).height() - g_octTopBarH
	,	railVisible: true
	,	alwaysVisible: true
	,	allowPageScroll: true
	,	position: 'right'
	,	color: '#f72497'
	,	opacity: 1
	,	distance: 0
	,	borderRadius: '3px'
	,	wrapperPos: 'fixed'
	});
	jQuery('.octBlocksBar').each(function(){
		var classes = jQuery(this).attr('class');
		jQuery(this).attr('class', 'octBlockBarInner').parent().addClass(classes).attr('data-cid', jQuery(this).data('cid'));
	});
	jQuery('.octMainBar').slimScroll({
		height: jQuery(window).height() - g_octTopBarH
	,	railVisible: true
	,	alwaysVisible: true
	,	allowPageScroll: true
	,	color: '#f72497'
	,	opacity: 1
	,	distance: 0
	,	borderRadius: '3px'
	,	width: jQuery('.octMainBar').width()
	,	wrapperPos: 'fixed'
	,	position: 'left'
	});
	jQuery('.octMainBar').each(function(){
		var classes = jQuery(this).attr('class');
		jQuery(this).attr('class', 'octMainBarInner').parent().addClass(classes);
	});
	g_octMainMenu = new octCategoriesMainMenu('.octMainBar');
	jQuery('.octBlocksBar').each(function(){
		g_octMainMenu.addSubMenu(this);
	});
	jQuery('.octMainBarHandle').click(function(){
		if(g_octMainMenu.isVisible()) {
			g_octMainMenu.checkHide();
		} else {
			g_octMainMenu.checkShow();
		}
		return false;
	});
	jQuery('.octCatElement').mouseover(function(){
		var self = this;
		this._octMouseOver = true;
		var cid = jQuery(this).data('id');
		setTimeout(function(){
			if(self._octMouseOver)
				g_octMainMenu.showSubByCid( cid );
		}, mainDelay);
	}).mouseleave(function(e){
		this._octMouseOver = false;
		var cid = jQuery(this).data('id')
		,	movedTo = jQuery(e.relatedTarget)
		,	movedToBlockBar = false
		,	movedToCatBar = false;
		if(movedTo) {
			movedToBlockBar = movedTo.hasClass('octBlocksBar') || movedTo.parents('.octBlocksBar:first').size();
			if(!movedToBlockBar)	// Do not detect this each time - save processor time:)
				movedToCatBar = movedTo.hasClass('octCatElement') || movedTo.parents('.octMainBar').size();
		}
		if(movedTo && movedTo.size() 
			&& (movedToBlockBar || movedToCatBar)
		) {
			return;
		}
		g_octMainMenu.hideSubByCid( cid );
	});
	jQuery('.octBlocksBar').mouseleave(function(e){
		var cid = jQuery(this).data('cid');
		g_octMainMenu.hideSubByCid( cid );
		/*setTimeout(function(){
			g_octMainMenu.checkHide();
		}, mainDelay);*/
	});
}
function _octInitDraggable() {
	jQuery('#octCanvas').sortable({
		revert: true
	,	placeholder: 'ui-state-highlight'
	/*,	delay: 150
	,	distance: 5*/
	,	handle: '.octBlockMove'	// Use this setting to enable handler, or 2 setting above - to make sure it will not interupt other block/element clicking
	//,	tolerance: 'pointer'
	//,	cursorAt: { top:0, right: 0 }
	,	start: function(event, ui) {
			g_octBlockFabric.checkSortStart( ui );
			g_octMainMenu.checkHide();
		}
	,	stop: function(event, ui) {
			g_octBlockFabric.checkSortStop( ui );
			_octSaveCanvasDelay( 400 );
		}
    });
    jQuery('.octBlocksList .octBlockElement').draggable({
		connectToSortable: '#octCanvas'
	,	helper: 'clone'
	,	revert: 'invalid'
	,	stop: function(event, ui) {
			if(!ui.helper.parents('#octCanvas').size()) {	// Element dropped not in the canvas container
				ui.helper.remove();
				return;
			}
			g_octBlockFabric.addFromDrag( ui.helper, jQuery('#octCanvas').find('.ui-state-highlight') );
			g_octMainMenu.checkHide();
		}
    });
    jQuery('.octBlocksList, .octBlocksList li').disableSelection();
}
function _octFitCanvasToScreen() {
	var canvasHeight = jQuery('#octCanvas').height()
	,	wndHeight = jQuery(window).height();
	if(canvasHeight < wndHeight) {
		jQuery('#octCanvas').height( wndHeight );
	}
}
function _octShowMainLoader() {
	jQuery('.octMainSaveBtn').width( jQuery('.octMainSaveBtn').width() );
	jQuery('.octMainSaveBtn').find('.octMainSaveBtnTxt').hide();
	jQuery('.octMainSaveBtn').find('.octMainSaveBtnLoader').show();
	jQuery('.octMainSaveBtn')
		.attr('disabled', 'disabled')
		.addClass('active');
	//jQuery('#octMainLoder').slideDown( g_octAnimationSpeed );
}
function _octHideMainLoader() {
	jQuery('.octMainSaveBtn').find('.octMainSaveBtnTxt').show();
	jQuery('.octMainSaveBtn').find('.octMainSaveBtnLoader').hide();
	jQuery('.octMainSaveBtn')
		.removeAttr('disabled')
		.removeClass('active');
	//jQuery('#octMainLoder').slideUp( g_octAnimationSpeed );
}
function _octSaveCanvasDelay(delay) {
	delay = delay ? delay : 200;
	setTimeout(_octSaveCanvas, delay);
}
function _octSaveCanvas() {
	if(typeof(octOcto) === 'undefined' || !octOcto || !octOcto.id) {
		return;
	}
	_octShowMainLoader();
	//g_octBlockFabric.beforeSave();
	var saveData = {
		id: octOcto.id
	,	blocks: g_octBlockFabric.getDataForSave()
	};
	jQuery.sendFormOct({
		data: {mod: 'octo', action: 'save', data: saveData}
	,	onSuccess: function(res){
			_octHideMainLoader();
			if(!res.error) {
				if(res.data.id_sort_order_data) {
					var allBlocks = g_octBlockFabric.getBlocks();
					if(allBlocks.length) {
						for(var i = 0; i < res.data.id_sort_order_data.length; i++) {
							var sortOrderFind = parseInt(res.data.id_sort_order_data[ i ].sort_order);
							for(var j = 0; j < allBlocks.length; j++) {
								if(allBlocks[ j ].get('sort_order') == sortOrderFind && !allBlocks[ j ].get('id')) {
									allBlocks[ j ].set('id', parseInt(res.data.id_sort_order_data[ i ].id));
								}
							}
						}
					}
				}
				//g_octBlockFabric.afterSave();
			}
		}
	});
}