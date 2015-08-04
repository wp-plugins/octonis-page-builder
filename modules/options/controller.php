<?php
class optionsControllerOct extends controllerOct {
	public function saveGroup() {
		$res = new responseOct();
		if($this->getModel()->saveGroup(reqOct::get('post'))) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError ($this->getModel('options')->getErrors());
		return $res->ajaxExec();
	}
	public function getPermissions() {
		return array(
			OCT_USERLEVELS => array(
				OCT_ADMIN => array('saveGroup')
			),
		);
	}
}

