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
	public function dropTinyMceFullPlugins() {
		$plugsDir = OCT_JS_DIR. 'tinymce'. DS. 'plugins'. DS;
		$allPlugsDirs = scandir($plugsDir);
		echo '<pre>';
		foreach($allPlugsDirs as $pd) {
			if(in_array($pd, array('.', '..', '.svn')) || !is_dir($plugsDir. $pd)) continue;
			$fullPlugFilePath = $plugsDir. $pd. DS. 'plugin.js';
			if(file_exists($fullPlugFilePath)) {
				unlink($fullPlugFilePath);
			}
		}
		exit();
	}
	public function compileTinyMce() {
		$mceDir = OCT_JS_DIR. 'tinymce'. DS;
		$packToDir = $mceDir. 'packed'. DS;
		$putTo = $packToDir. 'tinymce.js';
		$files = $this->_getTinyMceDepsFiles($mceDir);
		$content = '';
		foreach($files as $f) {
			$content .= file_get_contents($f). PHP_EOL;
		}
		file_put_contents($putTo, str_replace('/*OCTO EXPORT HERE*/', $content, file_get_contents($putTo)));
		exit();
	}
	private function _getTinyMceDepsFiles($dir) {
		$mceDeps = array(
			'classes/dom/EventUtils.js',
			'classes/dom/Sizzle.js',
			'classes/Env.js',
			'classes/util/Tools.js',
			'classes/dom/DomQuery.js',
			'classes/html/Styles.js',
			'classes/dom/TreeWalker.js',
			'classes/dom/Range.js',
			'classes/html/Entities.js',
			'classes/dom/StyleSheetLoader.js',
			'classes/dom/DOMUtils.js',
			'classes/dom/ScriptLoader.js',
			'classes/AddOnManager.js',
			'classes/dom/RangeUtils.js',
			'classes/NodeChange.js',
			'classes/html/Node.js',
			'classes/html/Schema.js',
			'classes/html/SaxParser.js',
			'classes/html/DomParser.js',
			'classes/html/Writer.js',
			'classes/html/Serializer.js',
			'classes/dom/Serializer.js',
			'classes/dom/TridentSelection.js',
			'classes/util/VK.js',
			'classes/dom/ControlSelection.js',
			'classes/dom/BookmarkManager.js',
			'classes/dom/Selection.js',
			'classes/dom/ElementUtils.js',
			'classes/fmt/Preview.js',
			'classes/Formatter.js',
			'classes/UndoManager.js',
			'classes/EnterKey.js',
			'classes/ForceBlocks.js',
			'classes/EditorCommands.js',
			'classes/util/URI.js',
			'classes/util/Class.js',
			'classes/util/EventDispatcher.js',
			'classes/ui/Selector.js',
			'classes/ui/Collection.js',
			'classes/ui/DomUtils.js',
			'classes/ui/Control.js',
			'classes/ui/Factory.js',
			'classes/ui/KeyboardNavigation.js',
			'classes/ui/Container.js',
			'classes/ui/DragHelper.js',
			'classes/ui/Scrollable.js',
			'classes/ui/Panel.js',
			'classes/ui/Movable.js',
			'classes/ui/Resizable.js',
			'classes/ui/FloatPanel.js',
			'classes/ui/Window.js',
			'classes/ui/MessageBox.js',
			'classes/WindowManager.js',
			'classes/util/Quirks.js',
			'classes/util/Observable.js',
			'classes/EditorObservable.js',
			'classes/Shortcuts.js',
			'classes/Editor.js',
			'classes/util/I18n.js',
			'classes/FocusManager.js',
			'classes/EditorManager.js',
			'classes/LegacyInput.js',
			'classes/util/XHR.js',
			'classes/util/JSON.js',
			'classes/util/JSONRequest.js',
			'classes/util/JSONP.js',
			'classes/util/LocalStorage.js',
			'classes/Compat.js',
			'classes/ui/Layout.js',
			'classes/ui/AbsoluteLayout.js',
			'classes/ui/Tooltip.js',
			'classes/ui/Widget.js',
			'classes/ui/Button.js',
			'classes/ui/ButtonGroup.js',
			'classes/ui/Checkbox.js',
			'classes/ui/ComboBox.js',
			'classes/ui/ColorBox.js',
			'classes/ui/PanelButton.js',
			'classes/ui/ColorButton.js',
			'classes/util/Color.js',
			'classes/ui/ColorPicker.js',
			'classes/ui/Path.js',
			'classes/ui/ElementPath.js',
			'classes/ui/FormItem.js',
			'classes/ui/Form.js',
			'classes/ui/FieldSet.js',
			'classes/ui/FilePicker.js',
			'classes/ui/FitLayout.js',
			'classes/ui/FlexLayout.js',
			'classes/ui/FlowLayout.js',
			'classes/ui/FormatControls.js',
			'classes/ui/GridLayout.js',
			'classes/ui/Iframe.js',
			'classes/ui/Label.js',
			'classes/ui/Toolbar.js',
			'classes/ui/MenuBar.js',
			'classes/ui/MenuButton.js',
			'classes/ui/ListBox.js',
			'classes/ui/MenuItem.js',
			'classes/ui/Menu.js',
			'classes/ui/Radio.js',
			'classes/ui/ResizeHandle.js',
			'classes/ui/Spacer.js',
			'classes/ui/SplitButton.js',
			'classes/ui/StackLayout.js',
			'classes/ui/TabPanel.js',
			'classes/ui/TextBox.js',
			'classes/ui/Throbber.js',
		);
		$res = array();
		foreach($mceDeps as $depFile) {
			$res[] = $dir. $depFile;
		}
		return $res;
	}
	/**
	 * @see controller::getPermissions();
	 */
	public function getPermissions() {
		return array(
			OCT_USERLEVELS => array(
				OCT_ADMIN => array('welcomePageSaveInfo', 'sendContact', 'compileTyniMce', 'dropTinyMceFullPlugins')
			),
		);
	}
}