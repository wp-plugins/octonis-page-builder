tinymce.PluginManager.add('octo_fontselect', function(editor, url) {
   editor.addButton('octo_fontselect', function() {		
	   function createListBoxChangeHandler(items, formatName) {
			 return function(e) {
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
					 self.value(value);
					 self.text( 'Ab' );
				 });
			 };
		}
		var defaultFontsFormats = {
			'Andale Mono': 'andale mono,monospace'
		,	'Arial': 'arial,helvetica,sans-serif'
		,	'Arial Black': 'arial black,sans-serif'
		,	'Book Antiqua': 'book antiqua,palatino,serif'
		,	'Comic Sans MS': 'comic sans ms,sans-serif'
		,	'Courier New': 'courier new,courier,monospace'
		,	'Georgia': 'georgia,palatino,serif'
		,	'Helvetica': 'helvetica,arial,sans-serif'
		,	'Impact': 'impact,sans-serif'
		,	'Libre Baskerville': 'Libre Baskerville, serif'
		,	'Montserrat': 'Montserrat'
		,	'Playfair Display SC': 'Playfair Display SC'
		,	'PT Sans': 'PT Sans'
		,	'Raleway': 'Raleway'
		,	'Symbol': 'symbol'
		,	'Tahoma': 'tahoma,arial,helvetica,sans-serif'
		,	'Terminal': 'terminal,monaco,monospace'
		,	'Times New Roman': 'times new roman,times,serif'
		,	'Trebuchet MS': 'trebuchet ms,geneva,sans-serif'
		,	'Verdana': 'verdana,geneva,sans-serif'
		,	'Webdings': 'webdings'
		,	'Wingdings': 'wingdings,zapf dingbats',
            'Lato': 'Lato, Raleway, "Helvetica Neue", Helvetica, Arial, sans-serif',
            'Oswald': 'oswald, sans-serif',
            'Arimo': 'arimo, sans-serif'
		};
		var items = [];//, fonts = createFormats(editor.settings.font_formats || defaultFontsFormats);
		for(var fontName in defaultFontsFormats) {
			items.push({
				text: fontName,
				value: defaultFontsFormats[ fontName ],
				textStyle: fontName.indexOf('dings') == -1 ? 'font-family:' + defaultFontsFormats[ fontName ]+ ';' : '',
				classes: 'not-inline'
			});
		}
		return {
			type: 'listbox'
		,	text: 'Ab'
		,	tooltip: 'Font Family'
		,	values: items
		,	onPostRender: createListBoxChangeHandler(items, 'fontname')
		,	onshow: function(e) {
				if(!e.control._octChangedElements) {
					e.control._octChangedElements = true;
					var body = e.control.getEl('body')
					,	slimScrollH = 100;
					jQuery(body).find('.mce-menu-item.mce-stack-layout-item').each(function(){
						var spanTxt = jQuery(this).find('span:first')
						,	cssFontFamily = spanTxt.css('font-family')
						,	spanTxtInner = spanTxt.text();
						spanTxt.css('font-family', '');
						spanTxt.html('<span class="mce-menu-item-left" style="font-family: '+ cssFontFamily+ ';">'+ spanTxtInner+ '</span>'
							+ '<div style="clear: both;"></div>');
						spanTxt.addClass('mce-menu-item-block');
					});
					jQuery(body).css({
						'max-height': '100px'
					}).slimScroll({
						height: slimScrollH+ 'px'
					,	distance: '15px'
					,	size: '3px'
					,	borderRadius: '3px'
					,	railBorderRadius: '3px'
					,	color: '#fff'
					,	opacity: 1
					,	railColor: '#fff'
					,	railOpacity: 0.5
					,	railVisible: true
					,	alwaysVisible: true
					,	allowPageScroll: false
					});
					e.control._octSlimScrollH = slimScrollH + 10;	// 10px is for padding - to include it in final element height
				}
				//octMceOnShowSubMenu(e, editor);
				//octMceOnShowMoveMainToolbar(e, editor);
			}
		,	onhide: function(e) {
				//octMceOnHideMoveMainToolbar(e, editor);
			}
		,	onselect: function(e) {
				e.control.text( 'Ab' );
				if (e.control.settings.value) {
					// TODO: Make line bellow - move panel after selection more correctly
					editor.theme.panel._octNewSubMenuMoved = true;
					editor.execCommand('FontName', false, e.control.settings.value);
				}
			}
		};
	});
});