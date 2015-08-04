<?php
class mailViewOct extends viewOct {
	public function getTabContent() {
		frameOct::_()->getModule('templates')->loadJqueryUi();
		frameOct::_()->addScript('admin.'. $this->getCode(), $this->getModule()->getModPath(). 'js/admin.'. $this->getCode(). '.js');
		
		$this->assign('options', frameOct::_()->getModule('options')->getCatOpts( $this->getCode() ));
		$this->assign('testEmail', frameOct::_()->getModule('options')->get('notify_email'));
		return parent::getContent('mailAdmin');
	}
}
