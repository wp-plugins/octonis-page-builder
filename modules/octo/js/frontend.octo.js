var g_octEdit = false
,	g_octBlockFabric = null;
jQuery(document).ready(function(){
	_octInitFabric();
	if(octOcto && octOcto.blocks && octOcto.blocks.length) {
		for(var i = 0; i < octOcto.blocks.length; i++) {
			g_octBlockFabric.addFromHtml(octOcto.blocks[ i ], jQuery('#octCanvas .octBlock[data-id="'+ octOcto.blocks[ i ].id+ '"]'));
		}
	}
});
function _octInitFabric() {
	g_octBlockFabric = new octBlockFabric();
}