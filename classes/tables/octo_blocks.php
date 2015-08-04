<?php
class tableOcto_blocksOct extends tableOct {
    public function __construct() {
        $this->_table = '@__octo_blocks';
        $this->_id = 'id';
        $this->_alias = 'sup_octo_blocks';
        $this->_addField('oid', 'text', 'int')
				->_addField('cid', 'text', 'int')
				->_addField('unique_id', 'text', 'text')
				->_addField('label', 'text', 'text')
				->_addField('original_id', 'text', 'int')
				->_addField('params', 'text', 'text')
				->_addField('html', 'text', 'text')
				->_addField('css', 'text', 'text')
				->_addField('img', 'text', 'text')
				->_addField('sort_order', 'text', 'int')
				->_addField('is_base', 'text', 'int');
    }
}