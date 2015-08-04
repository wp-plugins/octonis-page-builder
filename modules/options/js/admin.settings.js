jQuery(document).ready(function(){
	jQuery('#octSettingsSaveBtn').click(function(){
		jQuery('#octSettingsForm').submit();
		return false;
	});
	jQuery('#octSettingsForm').submit(function(){
		jQuery(this).sendFormOct({
			btn: jQuery('#octSettingsSaveBtn')
		});
		return false;
	});
});