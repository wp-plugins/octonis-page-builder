<?php
class subscribeViewOct extends viewOct {
	public function generateFormStart_wordpress($block) {
		return $this->_generateFormStartCommon($block, 'wordpress');
	}
	public function generateFormEnd_wordpress($block) {
		return $this->_generateFormEndCommon($block);
	}
	public function generateFormStart_aweber($block) {
		return '<form class="octSubscribeForm octSubscribeForm_aweber" method="post" action="http://www.aweber.com/scripts/addlead.pl">';
	}
	public function generateFormEnd_aweber($block) {
		$redirectUrl = isset($block['params']['sub_redirect_url']['val']) && !empty($block['params']['sub_redirect_url']['val'])
			? $block['params']['sub_redirect_url']['val']
			: false;
		if(!empty($redirectUrl)) {
			$redirectUrl = trim($redirectUrl);
			if(strpos($redirectUrl, 'http') !== 0) {
				$redirectUrl = 'http://'. $redirectUrl;
			}
		}
		if(empty($redirectUrl)) {
			$redirectUrl = uriOct::getFullUrl();
		}
		$res = '';
		$res .= htmlOct::hidden('listname', array('value' => $block['params']['sub_aweber_listname']['val']));
		$res .= htmlOct::hidden('meta_message', array('value' => '1'));
		$res .= htmlOct::hidden('meta_required', array('value' => 'email'));
		$res .= htmlOct::hidden('redirect', array('value' => $redirectUrl));
		if(isset($block['params']['sub_aweber_adtracking']) && !empty($block['params']['sub_aweber_adtracking']['val'])) {
			$res .= htmlOct::hidden('meta_adtracking', array('value' => $block['params']['sub_aweber_adtracking']['val']));
		}
		$res .= '</form>';
		return $res;
	}
	public function generateFormStart_mailchimp($block) {
		return $this->_generateFormStartCommon($block, 'mailchimp');
	}
	public function generateFormEnd_mailchimp($block) {
		return $this->_generateFormEndCommon($block);
	}
	public function generateFormStart_mailpoet($block) {
		return $this->_generateFormStartCommon($block, 'mailpoet');
	}
	public function generateFormEnd_mailpoet($block) {
		return $this->_generateFormEndCommon($block);
	}
	private function _generateFormStartCommon($block, $key = '') {
		return '<!--sub_form_start_open--><form class="octSubscribeForm'. (empty($key) ? '' : ' octSubscribeForm_'. $key).'" action="'. OCT_SITE_URL. '" method="post"><!--sub_form_start_close-->';
	}
	private function _generateFormEndCommon($block) {
		$res = '<!--sub_form_end_open-->';
		$res .= htmlOct::hidden('mod', array('value' => 'subscribe'));
		$res .= htmlOct::hidden('action', array('value' => 'subscribe'));
		$res .= htmlOct::hidden('id', array('value' => $block['id']));
		$res .= htmlOct::hidden('_wpnonce', array('value' => wp_create_nonce('subscribe-'. $block['id'])));
		$res .= '<div class="octSubMsg"></div>';
		$res .= '</form>';
		$res .= '<!--sub_form_end_close-->';
		return $res;
	}
	public function displaySuccessPage($block, $res) {
		$this->assign('block', $block);
		$this->assign('res', $res);
		parent::display('subSuccessPage');
	}
}
