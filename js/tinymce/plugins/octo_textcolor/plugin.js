/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */
/*eslint consistent-this:0 */

tinymce.PluginManager.add('octo_textcolor', function(editor) {
	var cols, rows;

	rows = editor.settings.textcolor_rows || 5;
	cols = editor.settings.textcolor_cols || 8;

	function getCurrentColor(format) {
		var color;

		editor.dom.getParents(editor.selection.getStart(), function(elm) {
			var value;
			if (!color && (value = elm.style[format == 'forecolor' ? 'color' : 'background-color'])) {
				color = value;
			}
		});

		return color;
	}
	function applyFormat(format, value) {
		// We didn't used undo/rendo - so skiped this operation to make it work faster
		//editor.undoManager.transact(function() {
			//editor.focus();
			if(editor._octColorPickerBookmark) {
				editor.selection.moveToBookmark( editor._octColorPickerBookmark );
			}
			editor.formatter.apply(format, {value: value});
			//editor.nodeChanged();
		//});
	}
	function removeFormat(format) {
		editor.undoManager.transact(function() {
			//editor.focus();
			editor.formatter.remove(format, {value: null}, null, true);
			//editor.nodeChanged();
		});
	}
	function onColorSelect(format, color) {
		applyFormat(format, color);
	}
	function findBtnEl(panel) {
		if(!panel) return;	// Element was clicked, but panel not opened - for drag-&-drop for example cases
		if(panel._items && panel._items.length) {
			for(var i = 0; i < panel._items.length; i++) {
				if(panel._items[i]._classes && panel._items[i]._classes[0] && panel._items[i]._classes[0] == 'colorbutton') {
					return panel._items[i];
				}
				var btn = findBtnEl(panel._items[i]);
				if(btn) {
					return btn;
				}
			}
		}
		return false;
	}
	function setBtnColor(btn, color) {
		color = color ? color : getCurrentColor('forecolor');
		btn.css({
			'background-color': color
		});
	}
	editor.on('click', function(selection){
		if(editor.theme) {
			var colorBtn = findBtnEl(editor.theme.panel);
			if(!colorBtn) return;	// Element was clicked, but panel not opened - for drag-&-drop for example cases
			var btnHtml = null;
			for(var key in colorBtn._elmCache) {
				btnHtml = colorBtn._elmCache[key];
				break;
			}
			setBtnColor(jQuery(btnHtml).find('.octColorpickerInput'));
		}
	});
	editor.on('BeforeRenderUI', function(e){
		var colorBtn = findBtnEl(e.target.theme.panel);//jQuery('#'+ e.target.theme.panel._id).find('.mce-i-forecolor').parents('.mce-btn:first');
		if(colorBtn) {
			setTimeout(function(){
				var btnHtml = null;
				for(var key in colorBtn._elmCache) {
					btnHtml = colorBtn._elmCache[key];
					break;
				}
				jQuery(btnHtml).html('<div class="octColorpickerInputShell"><div class="octColorpickerInput"></div></div>');
				setBtnColor(jQuery(btnHtml).find('.octColorpickerInput'));
			}, 10);
		}
	});
	editor.addButton('forecolor', {
		type: 'panelbutton'
	,	tooltip: 'Text color'
	,	format: 'forecolor'
	,	classes: 'colorbutton'
	,	panel: {
			role: 'application'
		,	ariaRemember: true
		,	html: ''
		,	classes: 'colorpanel'
		,	border: 1	// All other menus have border: 1 by default, this should look like same
		,	onpostrender: function(e) {
				if(!e.control._octInited) {
					e.control._octFirstTimeChange = true;
					jQuery('#'+ e.control._id).ColorPickerSliders({
						placement: 'bottom'
					,	appendto: '#'+ e.control._id
					,	color: 'rgba(255, 255, 255, 1)'
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
							if(!e.control._octFirstTimeChange) {
								var rgbColorStr = color.tiny.toRgbString();
								onColorSelect( 'forecolor', rgbColorStr );
								//container.find('.cp-hsllightness .cp-marker').html( Math.round(color.hsla.l * 100) );
								//container.find('.cp-opacity .cp-marker').html( Math.round(color.hsla.a * 100) );
								//container.find('.hex_present').val( color.tiny.toHex() );
								//console.log( rgbColorStr );
								setBtnColor(this.connectedinput.find('.octColorpickerInput'), rgbColorStr);
							}
							e.control._octFirstTimeChange = false;
						}
					,	flat: true
					});
					e.control._octInited = true;
				}
			}
		,	onshow: function(e) {
				// We can lost focus from our editor during color manipulation, so let's save it, and when we will apply color - we will restore it
				editor._octColorPickerBookmark = editor.selection.getBookmark(2, true);
				var currentColor = getCurrentColor('forecolor');
				jQuery('#'+ e.control._parent._id).trigger('colorpickersliders.updateColor', currentColor);
			}
		}
	});
});
