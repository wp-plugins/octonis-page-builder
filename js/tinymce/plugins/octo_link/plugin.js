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

tinymce.PluginManager.add('octo_link', function(editor) {
	function renderLinkEditor() {
		var html = ''
		,	tagIn = '<div class="mce-not-inline mce-menu-item mce-menu-item-normal mce-first mce-stack-layout-item mce-link-row">'
		,	tagOut = '</div>';
		html += tagIn+ '<span class="mce-input-name-txt">link</span> <input type="text" name="href" value="">'+ tagOut;
		html += tagIn+ '<span class="mce-input-name-txt">title</span> <input type="text" name="title" value="">'+ tagOut;
		html += tagIn+ '<input type="checkbox" name="target_blank" value="1"> <span class="mce-input-name-txt">open link in a new window</span>'+ tagOut;
		return html;
	}
	function _getControlPanel(e) {
		return e.control.panel ? e.control.panel : e.control;
	}
	function updateContent(e) {
		var control = _getControlPanel(e);
		var href
		,	data = {}
		,	dom = editor.dom
		,	linkWnd = jQuery('#'+ control._id)
		,	hrefCtrl = linkWnd.find('[name="href"]')
		,	titleCtrl = linkWnd.find('[name="title"]')
		,	targetBlankCtrl = linkWnd.find('[name="target_blank"]');
		data.href = hrefCtrl.val();
		data.title = titleCtrl.val();
		data.target = targetBlankCtrl.attr('checked') ? '_blank' : null;
		href = data.href;
		// Delay confirm since onSubmit will move focus
		function delayedConfirm(message, callback) {
			var rng = editor.selection.getRng();
			window.setTimeout(function() {
				editor.windowManager.confirm(message, function(state) {
					editor.selection.setRng(rng);
					callback(state);
				});
			}, 0);
		}
		function insertLink() {
			var linkAttrs = {
				href: href
			,	target: data.target ? data.target : null
			,	rel: data.rel ? data.rel : null
			,	"class": data["class"] ? data["class"] : null
			,	title: data.title ? data.title : null
			};
			if (control._lastAnchorElm) {
				editor.focus();
				dom.setAttribs(control._lastAnchorElm, linkAttrs);

				control._lastSelection.select(control._lastAnchorElm);
				editor.undoManager.add();
			} else {
				if (control._lastOnlyText) {
					var newA = dom.createHTML('a', linkAttrs, dom.encode(control._lastSelContent));
					editor.insertContent( newA );
					if(!editor._lastCreatedNode) {	// This is really bad, but we hope that this will not happens
						console.error('Can not find last inserted node for '+ newA);
					}
					control._lastSelection.select( editor._lastCreatedNode );
					updateSelections(e);
				} else {
					editor.execCommand('mceInsertLink', false, linkAttrs);
				}
			}
			control._lastLinkSet = (new Date()).getMilliseconds();
		}
		if (!href) {
			editor.execCommand('unlink');
			return;
		}
		// Is email and not //user@domain.com
		if (href.indexOf('@') > 0 && href.indexOf('//') == -1 && href.indexOf('mailto:') == -1) {
			delayedConfirm(
				'The URL you entered seems to be an email address. Do you want to add the required mailto: prefix?',
				function(state) {
					if (state) {
						href = 'mailto:' + href;
					}
					insertLink();
				}
			);
			return;
		}
		insertLink();
	}
	function updateSelections(e) {
		var control = _getControlPanel(e);
		var dom = editor.dom;
		var selectedElm = editor.selection.getNode();
		control._lastAnchorElm = dom.getParent(selectedElm, 'a[href]');
		control._lastOnlyText = isOnlyTextSelected(control._lastAnchorElm);
		control._lastSelContent = editor.selection.getContent();
		control._lastSelNode = editor.selection.getNode();
		control._lastSelection = editor.selection;
	}
	function isOnlyTextSelected(anchorElm) {
		var html = editor.selection.getContent();
		// Partial html and not a fully selected anchor element
		if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') == -1)) {
			return false;
		}
		if (anchorElm) {
			var nodes = anchorElm.childNodes, i;
			if (nodes.length === 0) {
				return false;
			}
			for (i = nodes.length - 1; i >= 0; i--) {
				if (nodes[i].nodeType != 3) {
					return false;
				}
			}
		}
		return true;
	}
	function updateLinkWnd(e) {
		// TODO: Fix this to make it work in correct way
		if(!e.control.panel) return;
		var data = {}
		,	dom = editor.dom
		,	value;
		var linkWnd = jQuery('#'+ e.control.panel._id)
		,	linkWndVisible = linkWnd.is(':visible')
		,	hrefCtrl = linkWnd.find('[name="href"]')
		,	titleCtrl = linkWnd.find('[name="title"]')
		,	targetBlankCtrl = linkWnd.find('[name="target_blank"]');
		
		if(!linkWndVisible) return;
		
		// Move focus inside edit wnd
		hrefCtrl.focus();
		
		var control = _getControlPanel(e);
		
		if(!control._octInited) {
			hrefCtrl.change(function(){
				updateContent(e);
			}).click(function(){
				var clickTime = (new Date()).getMilliseconds();
				if(control._lastLinkSet && clickTime - control._lastLinkSet <= 100) {	// Input just clicked, but not focused - as wee need to move focus inside editor after link changed
					jQuery(this).focus();
				}
			});
			titleCtrl.change(function(){
				updateContent(e);
			}).click(function(){
				var clickTime = (new Date()).getMilliseconds();
				if(control._lastLinkSet && clickTime - control._lastLinkSet <= 100) {	// Input just clicked, but not focused - as wee need to move focus inside editor after link changed
					jQuery(this).focus();
				}
			});
			targetBlankCtrl.change(function(){
				updateContent(e);
			});
			octInitCustomCheckRadio( linkWnd );
			control._octInited = true;
		}
		updateSelections(e);
		
		data.href = control._lastAnchorElm ? dom.getAttrib(control._lastAnchorElm, 'href') : '';
		if (control._lastAnchorElm) {
			data.target = dom.getAttrib(control._lastAnchorElm, 'target');
		} else if (editor.settings.default_link_target) {
			data.target = editor.settings.default_link_target;
		}
		if ((value = dom.getAttrib(control._lastAnchorElm, 'rel'))) {
			data.rel = value;
		}
		if ((value = dom.getAttrib(control._lastAnchorElm, 'class'))) {
			data['class'] = value;
		}
		if ((value = dom.getAttrib(control._lastAnchorElm, 'title'))) {
			data.title = value;
		}
		hrefCtrl.val( data.href );
		titleCtrl.val( data.title ? data.title : '' );
		data.target == '_blank'
			? targetBlankCtrl.attr('checked', 'checked')
			: targetBlankCtrl.removeAttr('checked');
		octCheckUpdate( targetBlankCtrl );
	}
	editor.addButton('octo_link', {
		type: 'panelbutton'
	,	icon: 'link'
	,	tooltip: 'Insert/edit link'
	,	shortcut: 'Meta+K'
	,	onclick: updateLinkWnd
	,	stateSelector: 'a[href]'
	,	panel: {
			role: 'application'
		,	html: renderLinkEditor
		,	border: 1	// All other menus have border: 1 by default, this should look like same
		,	onhide: function(e) {
				updateContent(e);
			}
		}
	});
});
