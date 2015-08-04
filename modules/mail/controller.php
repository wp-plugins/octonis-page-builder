<?php
class mailControllerOct extends controllerOct {
	public function testEmail() {
		$res = new responseOct();
		$email = reqOct::getVar('test_email', 'post');
		if($this->getModel()->testEmail($email)) {
			$res->addMessage(__('Now check your email inbox / spam folders for test mail.'));
		} else 
			$res->pushError ($this->getModel()->getErrors());
		$res->ajaxExec();
	}
	public function saveMailTestRes() {
		$res = new responseOct();
		$result = (int) reqOct::getVar('result', 'post');
		frameOct::_()->getModule('options')->getModel()->save('mail_function_work', $result);
		$res->ajaxExec();
	}
	public function saveOptions() {
		$res = new responseOct();
		$optsModel = frameOct::_()->getModule('options')->getModel();
		$submitData = reqOct::get('post');
		if($optsModel->saveGroup($submitData)) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError ($optsModel->getErrors());
		$res->ajaxExec();
	}
	public function getPermissions() {
		return array(
			OCT_USERLEVELS => array(
				OCT_ADMIN => array('testEmail', 'saveMailTestRes', 'saveOptions')
			),
		);
	}
}
