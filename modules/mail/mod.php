<?php
class mailOct extends moduleOct {
	public function init() {
		parent::init();
		//dispatcherOct::addFilter('optionsDefine', array($this, 'addOptions'));
	}
	public function send($to, $subject, $message, $fromName = '', $fromEmail = '', $replyToName = '', $replyToEmail = '', $additionalHeaders = null, $additionalParameters = null) {
		$headersArr = array();
		$eol = "\r\n";
        if(!empty($fromName) && !empty($fromEmail)) {
            $headersArr[] = 'From: '. $fromName. ' <'. $fromEmail. '>';
        }
		if(!empty($replyToName) && !empty($replyToEmail)) {
            $headersArr[] = 'Reply-To: '. $replyToName. ' <'. $replyToEmail. '>';
        }
		if(!function_exists('wp_mail'))
			frameOct::_()->loadPlugins();
		add_filter('wp_mail_content_type', array($this, 'mailContentType'));

        $result = wp_mail($to, $subject, $message, implode($eol, $headersArr));
		remove_filter('wp_mail_content_type', array($this, 'mailContentType'));

		return $result;
	}
	public function getMailErrors() {
		global $ts_mail_errors;
		global $phpmailer;
		// Clear prev. send errors at first
		$ts_mail_errors = array();

		// Let's try to get errors about mail sending from WP
		if (!isset($ts_mail_errors)) $ts_mail_errors = array();
		if (isset($phpmailer)) {
			$ts_mail_errors[] = $phpmailer->ErrorInfo;
		}
		if(empty($ts_mail_errors)) {
			$ts_mail_errors[] = __('Can not send email - problem with send server');
		}
		return $ts_mail_errors;
	}
	public function mailContentType($contentType) {
		$contentType = 'text/html';
        return $contentType;
	}
	public function getTabContent() {
		return $this->getView()->getTabContent();
	}
	public function addOptions($opts) {
		$opts[ $this->getCode() ] = array(
			'label' => __('Mail', OCT_LANG_CODE),
			'opts' => array(
				'mail_function_work' => array('label' => __('Mail function tested and work', OCT_LANG_CODE), 'desc' => ''),
				'notify_email' => array('label' => __('Notify Email', OCT_LANG_CODE), 'desc' => __('Email address used for all email notifications from plugin', OCT_LANG_CODE), 'html' => 'text', 'def' => get_option('admin_email')),
			),
		);
		return $opts;
	}
}