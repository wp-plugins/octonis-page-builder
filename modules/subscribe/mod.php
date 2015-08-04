<?php
class subscribeOct extends moduleOct {
	private $_destList = array();
	public function getDestList() {
		if(empty($this->_destList)) {
			$this->_destList = array(
				'wordpress' => array('label' => __('WordPress', OCT_LANG_CODE), 'require_confirm' => true),
				'aweber' => array('label' => __('Aweber', OCT_LANG_CODE)),
				'mailchimp' => array('label' => __('MailChimp', OCT_LANG_CODE), 'require_confirm' => true),
				'mailpoet' => array('label' => __('MailPoet', OCT_LANG_CODE), 'require_confirm' => true),
			);
		}
		return $this->_destList;
	}
	public function getDestByKey($key) {
		$this->getDestList();
		return isset($this->_destList[ $key ]) ? $this->_destList[ $key ] : false;
	}
	public function generateFormStart($block) {
		$res = '';
		if(isset($block['params']['sub_dest']) && !empty($block['params']['sub_dest']['val'])) {
			$subDest = $block['params']['sub_dest']['val'];
			$view = $this->getView();
			$generateMethod = 'generateFormStart_'. $subDest;
			if(method_exists($view, $generateMethod)) {
				$res = $view->$generateMethod( $block );
			}
			$res = dispatcherOct::applyFilters('subFormStart', $res, $block);
		}
		return $res;
	}
	public function generateFormEnd($block) {
		$res = '';
		if(isset($block['params']['sub_dest']) && !empty($block['params']['sub_dest']['val'])) {
			$subDest = $block['params']['sub_dest']['val'];
			$view = $this->getView();
			$generateMethod = 'generateFormEnd_'. $subDest;
			if(method_exists($view, $generateMethod)) {
				$res = $view->$generateMethod( $block );
			}
			$res = dispatcherOct::applyFilters('subFormEnd', $res, $block);
		}
		return $res;
	}
	public function getAvailableUserRolesForSelect() {
		global $wp_roles;
		$res = array();
		$allRoles = $wp_roles->roles;
		$editableRoles = apply_filters('editable_roles', $allRoles);
		
		if(!empty($editableRoles)) {
			foreach($editableRoles as $role => $data) {
				if(in_array($role, array('administrator', 'editor'))) continue;
				if($role == 'subscriber') {	// Subscriber - at the begining of array
					$res = array($role => $data['name']) + $res;
				} else {
					$res[ $role ] = $data['name'];
				}
			}
		}
		return $res;
	}
}

