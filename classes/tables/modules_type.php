<?php
class tableModules_typeOct extends tableOct {
    public function __construct() {
        $this->_table = '@__modules_type';
        $this->_id = 'id';     /*Let's associate it with posts*/
        $this->_alias = 'sup_m_t';
        $this->_addField($this->_id, 'text', 'int')
				->_addField('label', 'text', 'varchar');
    }
}