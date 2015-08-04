<?php
class tableOctoOct extends tableOct {
    public function __construct() {
        $this->_table = '@__octo';
        $this->_id = 'id';     /*Let's associate it with posts*/
        $this->_alias = 'sup_octo';
        $this->_addField('pid', 'text', 'int')
                ->_addField('active', 'checkbox', 'tinyint');
    }
}