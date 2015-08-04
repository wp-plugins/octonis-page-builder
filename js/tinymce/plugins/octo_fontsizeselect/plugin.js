tinymce.PluginManager.add('octo_fontsizeselect', function(editor, url) {
	function createListBoxChangeHandler(items, formatName) {
		return function() {
			var self = this;
			editor.on('nodeChange', function(e) {
				var formatter = editor.formatter;
				var value = null;
				tinymce.util.Tools.each(e.parents, function(node) {
					tinymce.util.Tools.each(items, function(item) {
						if (formatName) {
							if (formatter.matchNode(node, formatName, {value: item.value})) {
								value = item.value;
							}
						} else {
							if (formatter.matchNode(node, item.value)) {
								value = item.value;
							}
						}
						if (value) {
							return false;
						}
					});
					if (value) {
						return false;
					}
				});
				if(!value) {
					var content = editor.selection.getNode();
					if(content) {
						var originalFontSize = jQuery(content).css('font-size');
						if(originalFontSize.indexOf('px') != -1) {	// Pixels to pt conversion
							originalFontSize = Math.round(parseInt(originalFontSize) * 72 / 96);
						}
						value = originalFontSize+ 'pt';
					}
				}
				self.value(value);
			});
		};
	}
	editor.addButton('octo_fontsizeselect', function() {
		var items = [], defaultFontsizeFormats = '8pt 10pt 12pt 14pt 18pt 24pt 36pt';
		var fontsize_formats = editor.settings.fontsize_formats || defaultFontsizeFormats;
		tinymce.util.Tools.each(fontsize_formats.split(' '), function(item) {
			var text = item, value = item;
			// Allow text=value font sizes.
			var values = item.split('=');
			if (values.length > 1) {
				text = values[0];
				value = values[1];
			}
			items.push({text: text, value: value});
		});

		return {
			type: 'listbox'
		,	text: '12pt'
		,	tooltip: 'Font Sizes'
		,	values: items
		//,	fixedWidth: true
		,	onPostRender: createListBoxChangeHandler(items, 'fontsize')
		,	onclick: function(e) {
				if (e.control.settings.value) {
					editor.execCommand('FontSize', false, e.control.settings.value);
				}
			}
		/*,	onmove: function(e) {
				if(!e.control._octRecalc) {
					e.control._octRecalc = true;
					var rootRect = e.control.getRoot().layoutRect();
					e.control.moveTo(rootRect.x);
				}
				e.control._octRecalc = false;
			}*/
		,	onshow: function(e) {
				//octMceOnShowSubMenu(e, editor);
				//octMceOnShowMoveMainToolbar(e, editor);
			}
		,	onhide: function(e) {
				//octMceOnHideMoveMainToolbar(e, editor);
			}
		};
	});
});