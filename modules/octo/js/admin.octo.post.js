var g_octPostConverted = false;
jQuery(document).ready(function(){
	if(jQuery('.octPostSettingsShell').is(':visible')) {
		g_octPostConverted = true;
	}
	if(g_octPostConverted) {
		octSwitchPostConvertedBoxes( true );
	}
	jQuery('.octActivatePostBtn').click(function(){
		jQuery.sendFormOct({
			btn: this
		,	data: {mod: 'octo', action: 'convertToOcto', pid: jQuery(this).data('pid')}
		,	onSuccess: function(res) {
				if(!res.error) {
					jQuery('.octActivateForPostShell').slideUp( g_octAnimationSpeed );
					jQuery('.octPostSettingsShell').slideDown( g_octAnimationSpeed );
					octSwitchPostConvertedBoxes( true );
				}
			}
		});
		return false;
	});
	jQuery('.octReturnPostFromOcto').click(function(){
		if(confirm(toeLangOct('Are you sure want back to usual view from Octo?'))) {
			jQuery.sendFormOct({
				btn: this
			,	data: {mod: 'octo', action: 'returnFromOcto', pid: jQuery(this).data('pid')}
			,	onSuccess: function(res) {
					if(!res.error) {
						jQuery('.octActivateForPostShell').slideDown( g_octAnimationSpeed );
						jQuery('.octPostSettingsShell').slideUp( g_octAnimationSpeed );
						octSwitchPostConvertedBoxes( false );
					}
				}
			});
		}
		return false;
	});
	jQuery('.octEditTplBtn').click(function(){
		octSetEditBtnLink();	// Do this each click - as user can change link after edit post start
	});
	octSetEditBtnLink();
});
function octSetEditBtnLink() {
	if(jQuery('#view-post-btn a:first').size()) {
		var postViewUrl = jQuery('#view-post-btn a:first').attr('href');
		postViewUrl += (postViewUrl.indexOf('?') > 0 ? '&' : '?')+ 'octo_edit=1';
		jQuery('.octEditTplBtn').attr('href', postViewUrl);
	}
}
function octSwitchPostConvertedBoxes(enable) {
	enable 
		? jQuery('#postdivrich').slideUp( g_octAnimationSpeed ) 
		: jQuery('#postdivrich').slideDown( g_octAnimationSpeed );
	jQuery('#postbox-container-1 .postbox').each(function(){
		if(toeInArray(jQuery(this).attr('id'), ['formatdiv', 'postimagediv']) != -1) {
			enable 
				? jQuery( this ).slideUp( g_octAnimationSpeed ) 
				: jQuery( this ).slideDown( g_octAnimationSpeed );
		}
	});
	jQuery('#postbox-container-2 .postbox').each(function(){
		if(toeInArray(jQuery(this).attr('id'), ['authordiv']) == -1) {
			enable 
				? jQuery( this ).slideUp( g_octAnimationSpeed ) 
				: jQuery( this ).slideDown( g_octAnimationSpeed );
		}
	});
}