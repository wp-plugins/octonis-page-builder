jQuery(document).ready(function(){
	jQuery('#octMailTestForm').submit(function(){
		jQuery(this).sendFormOct({
			btn: jQuery(this).find('button:first')
		,	onSuccess: function(res) {
				if(!res.error) {
					jQuery('#octMailTestForm').slideUp( 300 );
					jQuery('#octMailTestResShell').slideDown( 300 );
				}
			}
		});
		return false;
	});
	jQuery('.octMailTestResBtn').click(function(){
		var result = parseInt(jQuery(this).data('res'));
		jQuery.sendFormOct({
			btn: this
		,	data: {mod: 'mail', action: 'saveMailTestRes', result: result}
		,	onSuccess: function(res) {
				if(!res.error) {
					jQuery('#octMailTestResShell').slideUp( 300 );
					jQuery('#'+ (result ? 'octMailTestResSuccess' : 'octMailTestResFail')).slideDown( 300 );
				}
			}
		});
		return false;
	});
	jQuery('#octMailSettingsForm').submit(function(){
		jQuery(this).sendFormOct({
			btn: jQuery(this).find('button:first')
		});
		return false; 
	});
});