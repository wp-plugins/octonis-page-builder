<?php
class supsystic_promoControllerOct extends controllerOct {
    public function welcomePageSaveInfo() {
		$res = new responseOct();
		installerOct::setUsed();
		if($this->getModel()->welcomePageSaveInfo(reqOct::get('get'))) {
			$res->addMessage(__('Information was saved. Thank you!', OCT_LANG_CODE));
		} else {
			$res->pushError($this->getModel()->getErrors());
		}
		$originalPage = reqOct::getVar('original_page');
		$http = isset($_SERVER['HTTPS']) && !empty($_SERVER['HTTPS']) ? 'https://' : 'http://';
		if(strpos($originalPage, $http. $_SERVER['HTTP_HOST']) !== 0) {
			$originalPage = '';
		}
		redirectOct($originalPage);
	}
	public function sendContact() {
		$res = new responseOct();
		$time = time();
		$prevSendTime = (int) get_option(OCT_CODE. '_last__time_contact_send');
		if($prevSendTime && ($time - $prevSendTime) < 5 * 60) {	// Only one message per five minutes
			$res->pushError(__('Please don\'t send contact requests so often - wait for response for your previous requests.'));
			$res->ajaxExec();
		}
        $data = reqOct::get('post');
        $fields = $this->getModule()->getContactFormFields();
		foreach($fields as $fName => $fData) {
			$validate = isset($fData['validate']) ? $fData['validate'] : false;
			$data[ $fName ] = isset($data[ $fName ]) ? trim($data[ $fName ]) : '';
			if($validate) {
				$error = '';
				foreach($validate as $v) {
					if(!empty($error))
						break;
					switch($v) {
						case 'notEmpty':
							if(empty($data[ $fName ])) {
								$error = $fData['html'] == 'selectbox' ? __('Please select %s', OCT_LANG_CODE) : __('Please enter %s', OCT_LANG_CODE);
								$error = sprintf($error, $fData['label']);
							}
							break;
						case 'email':
							if(!is_email($data[ $fName ])) 
								$error = __('Please enter valid email address', OCT_LANG_CODE);
							break;
					}
					if(!empty($error)) {
						$res->pushError($error, $fName);
					}
				}
			}
		}
		if(!$res->error()) {
			$msg = 'Message from: '. get_bloginfo('name').', Host: '. $_SERVER['HTTP_HOST']. '<br />';
			$msg .= 'Plugin: '. OCT_WP_PLUGIN_NAME. '<br />';
			foreach($fields as $fName => $fData) {
				if(in_array($fName, array('name', 'email', 'subject'))) continue;
				if($fName == 'category')
					$data[ $fName ] = $fData['options'][ $data[ $fName ] ];
                $msg .= '<b>'. $fData['label']. '</b>: '. nl2br($data[ $fName ]). '<br />';
            }
			if(frameOct::_()->getModule('mail')->send('support@supsystic.team.zendesk.com', $data['subject'], $msg, $data['name'], $data['email'])) {
				update_option(OCT_CODE. '_last__time_contact_send', $time);
			} else {
				$res->pushError( frameOct::_()->getModule('mail')->getMailErrors() );
			}
			
		}
        $res->ajaxExec();
	}
	/**
	 * @see controller::getPermissions();
	 */
	public function getPermissions() {
		return array(
			OCT_USERLEVELS => array(
				OCT_ADMIN => array('welcomePageSaveInfo', 'sendContact')
			),
		);
	}
}