<?php
class subscribeControllerOct extends controllerOct {
	public function subscribe() {
		$res = new responseOct();
		$data = reqOct::get('post');
		$id = isset($data['id']) ? (int) $data['id'] : 0;
		$nonce = $_REQUEST['_wpnonce'];
		if(!wp_verify_nonce($_REQUEST['_wpnonce'], 'subscribe-'. $id)) {
			die('Some error with your request.........');
		}
		if($this->getModel()->subscribe(reqOct::get('post'), true)) {
			$dest = $this->getModel()->getDest();
			$destData = $this->getModule()->getDestByKey( $dest );
			$lastBlock = $this->getModel()->getLastBlock();
			$withoutConfirm = (isset($lastBlock['params']['sub_ignore_confirm']) && $lastBlock['params']['sub_ignore_confirm']['val'])
				|| (isset($lastBlock['params']['sub_dsbl_dbl_opt_id']) && $lastBlock['params']['sub_dsbl_dbl_opt_id']['val']);
			if(isset($lastBlock['params']['sub_dest']['val']) 
				&& $lastBlock['params']['sub_dest']['val'] == 'mailpoet' 
				&& class_exists('WYSIJA')
				&& ($wisijaConfigModel = WYSIJA::get('config', 'model'))
			) {
				$withoutConfirm = !(bool) $wisijaConfigModel->getValue('confirm_dbleoptin');
			}
			if($destData && isset($destData['require_confirm']) && $destData['require_confirm'] && !$withoutConfirm)
				$res->addMessage(isset($lastBlock['params']['sub_txt_confirm_sent']['val']) 
						? $lastBlock['params']['sub_txt_confirm_sent']['val'] : 
						__('Confirmation link was sent to your email address. Check your email!', OCT_LANG_CODE));
			else
				$res->addMessage(isset($lastBlock['params']['sub_txt_success']) && !empty($lastBlock['params']['sub_txt_success']['val'])
						? $lastBlock['params']['sub_txt_success']
						: __('Thank you for subscribe!', OCT_LANG_CODE));
			$redirectUrl = isset($lastBlock['params']['sub_redirect_url']) && !empty($lastBlock['params']['sub_redirect_url']['val'])
					? $lastBlock['params']['sub_redirect_url']['val']
					: false;
			if(!empty($redirectUrl)) {
				$redirectUrl = trim($redirectUrl);
				if(strpos($redirectUrl, 'http') !== 0) {
					$redirectUrl = 'http://'. $redirectUrl;
				}
				$res->addData('redirect', $redirectUrl);
			}
		} else
			$res->pushError ($this->getModel()->getErrors());
		if(!$res->isAjax()) {
			if(!$res->error()) {
				// Add statistics here when we will have it
				/*$popupActions = reqOct::getVar('oct_actions_'. $id, 'cookie');
				if(empty($popupActions)) {
					$popupActions = array();
				}
				$popupActions['subscribe'] = date('m-d-Y H:i:s');
				reqOct::setVar('oct_actions_'. $id, $popupActions, 'cookie', array('expire' => 7 * 24 * 3600));
				frameOct::_()->getModule('statistics')->getModel()->add(array(
					'id' => $id,
					'type' => 'subscribe',
				));*/
			}
			$res->mainRedirect(isset($redirectUrl) && $redirectUrl ? $redirectUrl : '');
		}
		return $res->ajaxExec();
	}
	public function confirm() {
		
		$res = new responseOct();
		if(!$this->getModel()->confirm(reqOct::get('get'))) {
			$res->pushError ($this->getModel()->getErrors());
		}
		$lastBlock = $this->getModel()->getLastBlock();
		$this->getView()->displaySuccessPage($lastBlock, $res);
		exit();
		// Just simple redirect for now
		//$siteUrl = get_bloginfo('wpurl');
		//redirectOct($siteUrl);
	}
	public function getMailchimpLists() {
		$res = new responseOct();
		if(($lists = $this->getModel()->getMailchimpLists(reqOct::get('post'))) !== false) {
			$res->addData('lists', $lists);
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	public function getPermissions() {
		return array(
			OCT_USERLEVELS => array(
				OCT_ADMIN => array('getMailchimpLists')
			),
		);
	}
}

