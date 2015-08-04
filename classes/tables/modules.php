<?php
class tableModulesOct extends tableOct {
    public function __construct() {
        $this->_table = '@__modules';
        $this->_id = 'id';     /*Let's associate it with posts*/
        $this->_alias = 'sup_m';
        $this->_addField('label', 'text', 'varchar')
                ->_addField('type_id', 'selectbox', 'smallint')
                ->_addField('active', 'checkbox', 'tinyint')
                ->_addField('params', 'textarea', 'text')
                ->_addField('code', 'hidden', 'varchar')
                ->_addField('ex_plug_dir', 'hidden', 'varchar');
    }
}