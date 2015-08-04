<?php
class mailModelOct extends modelOct {
	public function testEmail($email) {
		$email = trim($email);
		if(!empty($email)) {
			if($this->getModule()->send($email, 
				__('Test email functionslity', OCT_LANG_CODE), 
				sprintf(__('This is test email for testing email functionality on your site, %s.', OCT_LANG_CODE), OCT_SITE_URL))
			) {
				return true;
			} else {
				$this->pushError( $this->getModule()->getMailErrors() );
			}
		} else
			$this->pushError (__('Empty email address', OCT_LANG_CODE), 'test_email');
		return false;
	}
}