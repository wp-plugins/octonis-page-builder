<?php
class supsystic_promoOct extends moduleOct {
	private $_mainLink = '';
	private $_specSymbols = array(
		'from'	=> array('?', '&'),
		'to'	=> array('%', '^'),
	);
	private $_minDataInStatToSend = 20;	// At least 20 points in table shuld be present before send stats
	public function __construct($d) {
		parent::__construct($d);
		$this->getMainLink();
	}
	public function init() {
		parent::init();
		add_action('admin_footer', array($this, 'displayAdminFooter'), 9);
		if(is_admin()) {
			$this->checkStatisticStatus();
		}
		$this->weLoveYou();
		dispatcherOct::addFilter('mainAdminTabs', array($this, 'addAdminTab'));
	}
	public function addAdminTab($tabs) {
		$tabs['overview'] = array(
			'label' => __('Overview', OCT_LANG_CODE), 'callback' => array($this, 'getOverviewTabContent'), 'fa_icon' => 'fa-info', 'sort_order' => 5,
		);
		return $tabs;
	}
	public function getOverviewTabContent() {
		return $this->getView()->getOverviewTabContent();
	}
	// We used such methods - _encodeSlug() and _decodeSlug() - as in slug wp don't understand urlencode() functions
	private function _encodeSlug($slug) {
		return str_replace($this->_specSymbols['from'], $this->_specSymbols['to'], $slug);
	}
	private function _decodeSlug($slug) {
		return str_replace($this->_specSymbols['to'], $this->_specSymbols['from'], $slug);
	}
	public function decodeSlug($slug) {
		return $this->_decodeSlug($slug);
	}
	public function modifyMainAdminSlug($mainSlug) {
		$firstTimeLookedToPlugin = !installerOct::isUsed();
		if($firstTimeLookedToPlugin) {
			$mainSlug = $this->_getNewAdminMenuSlug($mainSlug);
		}
		return $mainSlug;
	}
	private function _getWelcomMessageMenuData($option, $modifySlug = true) {
		return array_merge($option, array(
			'page_title'	=> __('Welcome to Supsystic Secure', OCT_LANG_CODE),
			'menu_slug'		=> ($modifySlug ? $this->_getNewAdminMenuSlug( $option['menu_slug'] ) : $option['menu_slug'] ),
			'function'		=> array($this, 'showWelcomePage'),
		));
	}
	public function addWelcomePageToMenus($options) {
		$firstTimeLookedToPlugin = !installerOct::isUsed();
		if($firstTimeLookedToPlugin) {
			foreach($options as $i => $opt) {
				$options[$i] = $this->_getWelcomMessageMenuData( $options[$i] );
			}
		}
		return $options;
	}
	private function _getNewAdminMenuSlug($menuSlug) {
		// We can't use "&" symbol in slug - so we used "|" symbol
		$newSlug = $this->_encodeSlug(str_replace('admin.php?page=', '', $menuSlug));
		return 'welcome-to-'. frameOct::_()->getModule('adminmenu')->getMainSlug(). '|return='. $newSlug;
	}
	public function addWelcomePageToMainMenu($option) {
		$firstTimeLookedToPlugin = !installerOct::isUsed();
		if($firstTimeLookedToPlugin) {
			$option = $this->_getWelcomMessageMenuData($option, false);
		}
		return $option;
	}
	public function showWelcomePage() {
		$this->getView()->showWelcomePage();
	}
	public function displayAdminFooter() {
		if(frameOct::_()->isAdminPlugPage()) {
			$this->getView()->displayAdminFooter();
		}
	}
	private function _preparePromoLink($link, $ref = '') {
		if(empty($ref))
			$ref = 'user';
		return $link;
	}
	public function weLoveYou() {
		if(!frameOct::_()->getModule(implode('', array('l','ic','e','ns','e')))) {
			// Nothing for now
		}
	}
	public function showAdditionalmainAdminShowOnOptions($popup) {
		$this->getView()->showAdditionalmainAdminShowOnOptions($popup);
	}
	/**
	 * Public shell for private method
	 */
	public function preparePromoLink($link, $ref = '') {
		return $this->_preparePromoLink($link, $ref);
	}
	public function checkStatisticStatus(){
		// Do not send usage functionas statitistics
		return;
		if(frameOct::_()->getModule('options')->isEmpty('send_stats')) {	// Enabled by default
			frameOct::_()->getModule('options')->getModel()->save('send_stats', 1);
		}
		$canSend = (int) frameOct::_()->getModule('options')->get('send_stats');
		if($canSend) {
			$this->getModel()->checkAndSend();
		}
	}
	public function getMinStatSend() {
		return $this->_minDataInStatToSend;
	}
	public function getMainLink() {
		if(empty($this->_mainLink)) {
			$this->_mainLink = 'http://octonis.com/';
		}
		return $this->_mainLink ;
	}
	public function getContactFormFields() {
		$fields = array(
            'name' => array('label' => __('Your name', OCT_LANG_CODE), 'valid' => 'notEmpty', 'html' => 'text'),
			'email' => array('label' => __('Your email', OCT_LANG_CODE), 'html' => 'email', 'valid' => array('notEmpty', 'email'), 'placeholder' => 'example@mail.com', 'def' => get_bloginfo('admin_email')),
			'website' => array('label' => __('Website', OCT_LANG_CODE), 'html' => 'text', 'placeholder' => 'http://example.com', 'def' => get_bloginfo('url')),
			'subject' => array('label' => __('Subject', OCT_LANG_CODE), 'valid' => 'notEmpty', 'html' => 'text'),
            'category' => array('label' => __('Topic', OCT_LANG_CODE), 'valid' => 'notEmpty', 'html' => 'selectbox', 'options' => array(
				'plugins_options' => __('Plugin options', OCT_LANG_CODE),
				'bug' => __('Report a bug', OCT_LANG_CODE),
				'functionality_request' => __('Require a new functionallity', OCT_LANG_CODE),
				'other' => __('Other', OCT_LANG_CODE),
			)),
			'message' => array('label' => __('Message', OCT_LANG_CODE), 'valid' => 'notEmpty', 'html' => 'textarea', 'placeholder' => __('Hello Octonis Team!', OCT_LANG_CODE)),
        );
		foreach($fields as $k => $v) {
			if(isset($fields[ $k ]['valid']) && !is_array($fields[ $k ]['valid']))
				$fields[ $k ]['valid'] = array( $fields[ $k ]['valid'] );
		}
		return $fields;
	}
	public function isPro() {
		return frameOct::_()->getModule('license') ? true : false;
	}
}