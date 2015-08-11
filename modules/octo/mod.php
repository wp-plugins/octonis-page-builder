<?php
class octoOct extends moduleOct {
	private $_assetsUrl = 'https://supsystic.com/_assets/octo/';
	public function init() {
		dispatcherOct::addFilter('mainAdminTabs', array($this, 'addAdminTab'));
		add_action('template_redirect', array($this, 'checkOctoShow'));
		// TODO: finish this
		add_action('add_meta_boxes', array($this, 'addMetaBoxes'));
	}
	public function addAdminTab($tabs) {
		/*$tabs[ $this->getCode(). '_add_new' ] = array(
			'label' => __('Add New Page', OCT_LANG_CODE), 'callback' => array($this, 'getAddNewTabContent'), 'fa_icon' => 'fa-plus-circle', 'sort_order' => 10, 'add_bread' => $this->getCode(),
		);*/
		/*$tabs[ $this->getCode(). '_edit' ] = array(
			'label' => __('Edit', OCT_LANG_CODE), 'callback' => array($this, 'getEditTabContent'), 'sort_order' => 20, 'child_of' => $this->getCode(), 'hidden' => 1, 'add_bread' => $this->getCode(),
		);*/
		$tabs['octo'] = array(
			'label' => __('Show All Pages', OCT_LANG_CODE), 'callback' => array($this, 'getTabContent'), 'fa_icon' => 'fa-list', 'sort_order' => 20, //'is_main' => true,
		);
		return $tabs;
	}
	public function getTabContent() {
		return $this->getView()->getTabContent();
	}
	public function getEditLink($id) {
		$postLink = get_permalink( $id );
		return uriOct::_(array('baseUrl' => $postLink, 'octo_edit' => 1));
	}
	public function checkOctoShow() {
		global $wp_query;
		$havePostsListing = $wp_query && is_object($wp_query) && isset($wp_query->posts) && is_array($wp_query->posts) && !empty($wp_query->posts);
		$currentPageId = (int) get_the_ID();
		$isHome = is_home();
		// Check if we can show our template on this page
		if($currentPageId 
			&& $havePostsListing 
			&& (count($wp_query->posts) == 1)
			&& $this->getModel()->isPostConverted($currentPageId)
		) {
			$isEditMode = ((int) reqOct::getVar('octo_edit', 'get') && frameOct::_()->getModule('user')->isAdmin());
			$this->getView()->renderForPost($currentPageId, array(
				'post' => array_shift($wp_query->posts),
				'isEditMode' => $isEditMode));
			exit();
		}
	}
	public function addMetaBoxes() {
		add_meta_box('octMainMetaBox', OCT_WP_PLUGIN_NAME, array($this, 'showMainMetaBox'), null, 'side', 'high');
	}
	public function showMainMetaBox($post) {
		$this->getView()->showMainMetaBox($post);
	}
	public function getAssetsUrl() {
		return $this->_assetsUrl;
	}
}

