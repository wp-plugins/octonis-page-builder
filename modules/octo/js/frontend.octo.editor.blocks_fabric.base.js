/**
 * Blocks fabric - main object for whole blocks manipulations
 */
function octBlockFabric() {
	this._blocks = [];
	this._isSorting = false;
	this._animationSpeed = g_octAnimationSpeed;
}
octBlockFabric.prototype.addFromHtml = function(blockData, jqueryHtml) {
	var block = this.add( blockData );
	block.setRaw( jqueryHtml );
};
octBlockFabric.prototype.add = function(blockData) {
	var blockData = jQuery.extend({}, blockData);
	if(!blockData.original_id) {
		blockData.original_id = blockData.id;
		blockData.id = 0;
	}
	var blockClass = window[ 'octBlock_'+ blockData.cat_code ];
	if(blockClass) {
		var block = new blockClass( blockData );
		var blockIter = this._blocks.push( block );
		block.setIter( blockIter - 1 );
		return block;
	} else {
		console.log('Block Class For '+ blockData.cat_code+ ' Not Found!!!');
	}
};