<?php
class octoViewOct extends viewOct {
	protected $_twig;
	public function getTabContent() {
		frameOct::_()->getModule('templates')->loadJqGrid();
		frameOct::_()->addStyle('admin.octo', $this->getModule()->getModPath(). 'css/admin.octo.css');
		frameOct::_()->addScript('admin.octo', $this->getModule()->getModPath(). 'js/admin.octo.js');
		frameOct::_()->addScript('admin.octo.list', $this->getModule()->getModPath(). 'js/admin.octo.list.js');
		frameOct::_()->addJSVar('admin.octo.list', 'octTblDataUrl', uriOct::mod('octo', 'getListForTbl', array('reqType' => 'ajax')));
		
		//$this->assign('addNewLink', frameOct::_()->getModule('options')->getTabUrl('OCT_add_new'));
		return parent::getContent('octoAdmin');
	}
	public function showMainMetaBox($post) {
		frameOct::_()->getModule('templates')->loadCoreJs();
		frameOct::_()->getModule('templates')->loadAdminCoreJs();
		frameOct::_()->addScript('admin.octo.post', $this->getModule()->getModPath(). 'js/admin.octo.post.js');
		frameOct::_()->addStyle('admin.octo.post', $this->getModule()->getModPath(). 'css/admin.octo.post.css');
		frameOct::_()->addStyle('frontend.octo.editor.octo-icons', $this->getModule()->getAssetsUrl(). 'css/octo-icons.css');
		$this->assign('isPostConverted', $this->getModel()->isPostConverted( $post->ID ));
		$this->assign('post', $post);
		$this->assign('usedBlocksNumber', $this->getModel()->getUsedBlocksNumForPost( $post->ID ));
		parent::display('octoMainMetaBox');
	}
	public function renderForPost($pid, $params = array()) {
		//frameOct::_()->setStylesInitialized(false);
		//frameOct::_()->setScriptsInitialized(false);
		$isEditMode = isset($params['isEditMode']) ? $params['isEditMode'] : false;
		$post = isset($params['post']) ? $params['post'] : get_post($pid);
		$octo = $this->getModel()->getForPost($pid);
		if($isEditMode) {
			$this->loadWpAdminAssets();
		}
		frameOct::_()->getModule('templates')->loadCoreJs();
		frameOct::_()->getModule('templates')->loadBootstrap();
		$this->connectFrontendAssets( $octo, $isEditMode );
		if($isEditMode) {
			$originalBlocksByCategories = $this->getModel('octo_blocks')->getOriginalBlocksByCategories();
			$this->assign('originalBlocksByCategories', $originalBlocksByCategories);
			$this->connectEditorAssets( $octo );
			$this->assign('allPagesUrl', frameOct::_()->getModule('options')->getTabUrl('octo'));
			$this->assign('previewPageUrl', get_permalink($post));
		}
		$this->_prepareOctoForRender( $octo, $isEditMode );
		
		$this->assign('octo', $octo);
		$this->assign('pid', $pid);
		$this->assign('isEditMode', $isEditMode);
		$this->assign('post', $post);
		$this->assign('stylesScriptsHtml', $this->generateStylesScriptsHtml());
		// Render this part - at final step
		$this->assign('commonFooter', $this->getCommonFooter());
		if($isEditMode) {
			$this->assign('editorFooter', $this->getEditorFooter());
		} else {
			$this->assign('footer', $this->getFooter());
		}
		parent::display('octoRenderForPost');
	}
	public function getEditorFooter() {
		return parent::getContent('octoEditorFooter');
	}
	public function getFooter() {
		return parent::getContent('octoFooter');
	}
	// Footer parts that need to be in frontend and in editor too
	public function getCommonFooter() {
		return parent::getContent('octoCommonFooter');
	}
	private function _prepareOctoForRender(&$octo, $isEditMode = false) {
		if(!empty($octo['blocks'])) {
			foreach($octo['blocks'] as $i => $block) {
				$octo['blocks'][ $i ]['rendered_html'] = $this->renderBlock( $octo['blocks'][ $i ], $isEditMode );
			}
		}
	}
	public function renderBlock($block = array(), $isEditMode = false) {
		$this->assign('block', $block);
		$this->assign('isEditMode', $isEditMode);
		$content = parent::getContent('octoRenderBlock');
		$this->_initTwig();
		return $this->_twig->render($content, array('block' => $block));
	}
	public function connectFrontendAssets( $octo = array(), $isEditMode = false ) {
		frameOct::_()->addStyle('animate', $this->getModule()->getAssetsUrl(). 'css/animate.css');
		frameOct::_()->addStyle('frontend.octo.fonts', $this->getModule()->getAssetsUrl(). 'css/frontend.octo.fonts.css');
		frameOct::_()->addStyle('frontend.octo', $this->getModule()->getModPath(). 'css/frontend.octo.css');
		//Sliders
		/*frameOct::_()->addStyle('slider.jssor', $this->getModule()->getModPath(). 'assets/sliders/jssor/jssor.slider.css');
		frameOct::_()->addScript('slider.jssor', $this->getModule()->getModPath(). 'assets/sliders/jssor/jssor.slider.mini.js');*/
		
		frameOct::_()->addStyle('slider.bx', $this->getModule()->getModPath(). 'assets/sliders/bx/jquery.bxslider.css');
		frameOct::_()->addScript('slider.bx', $this->getModule()->getModPath(). 'assets/sliders/bx/jquery.bxslider.min.js');
		
		frameOct::_()->addScript('frontend.octo.editor.blocks_fabric.base', $this->getModule()->getModPath(). 'js/frontend.octo.editor.blocks_fabric.base.js');
		frameOct::_()->addScript('frontend.octo.editor.blocks.base', $this->getModule()->getModPath(). 'js/frontend.octo.editor.blocks.base.js');
		frameOct::_()->addScript('frontend.octo.editor.elements.base', $this->getModule()->getModPath(). 'js/frontend.octo.editor.elements.base.js');
		
		frameOct::_()->addScript('frontend.octo', $this->getModule()->getModPath(). 'js/frontend.octo.js');
		//if(!$isEditMode) {
		frameOct::_()->addJSVar('frontend.octo', 'octOcto', $octo);
		//}
		frameOct::_()->getModule('templates')->loadLightbox();
	}
	public function connectEditorAssets( $octo = array() ) {
		$this->assign('adminEmail', get_bloginfo('admin_email'));
		$this->connectEditorJs( $octo );
		$this->connectEditorCss( $octo );
	}
	public function connectEditorJs( $octo = array() ) {
		frameOct::_()->addScript('jquery-ui-core');
		frameOct::_()->addScript('jquery-ui-widget');
		frameOct::_()->addScript('jquery-ui-mouse');
		
		frameOct::_()->addScript('jquery-ui-draggable');
		frameOct::_()->addScript('jquery-ui-sortable');
		//frameOct::_()->addScript('jquery-ui-dialog');
		
		frameOct::_()->getModule('templates')->loadMediaScripts();
		frameOct::_()->getModule('templates')->loadTinyMce();
		frameOct::_()->getModule('templates')->loadContextMenu();
		//frameOct::_()->getModule('templates')->loadCustomColorpicker();
		frameOct::_()->getModule('templates')->loadCustomBootstrapColorpicker();
		
		frameOct::_()->addScript('twig', OCT_JS_PATH. 'twig.min.js');
		frameOct::_()->addScript('icheck', OCT_JS_PATH. 'icheck.min.js');
		frameOct::_()->addScript('jquery.slimscroll', OCT_JS_PATH. 'jquery.slimscroll.js');
		frameOct::_()->addScript('frontend.octo.editor.menus', $this->getModule()->getModPath(). 'js/frontend.octo.editor.menus.js');
		frameOct::_()->addScript('wp.tabs', OCT_JS_PATH. 'wp.tabs.js');

		frameOct::_()->addScript('frontend.octo.editor.utils', $this->getModule()->getModPath(). 'js/frontend.octo.editor.utils.js');
		frameOct::_()->addScript('frontend.octo.editor.blocks_fabric', $this->getModule()->getModPath(). 'js/frontend.octo.editor.blocks_fabric.js');
		frameOct::_()->addScript('frontend.octo.editor.elements', $this->getModule()->getModPath(). 'js/frontend.octo.editor.elements.js');
		frameOct::_()->addScript('frontend.octo.editor.elements.menu', $this->getModule()->getModPath(). 'js/frontend.octo.editor.elements.menu.js');
		frameOct::_()->addScript('frontend.octo.editor.blocks', $this->getModule()->getModPath(). 'js/frontend.octo.editor.blocks.js');
		frameOct::_()->addScript('frontend.octo.editor', $this->getModule()->getModPath(). 'js/frontend.octo.editor.js');
		//frameOct::_()->addJSVar('frontend.octo.editor', 'octOcto', $octo);
	}
	public function connectEditorCss( $octo = array() ) {
		// We will use other instance of this lib here - to use prev. one in admin area
		frameOct::_()->getModule('templates')->loadFontAwesome();
		frameOct::_()->addStyle('octo.jquery.icheck', $this->getModule()->getModPath(). 'css/jquery.icheck.css');
		frameOct::_()->addStyle('frontend.octo.editor', $this->getModule()->getModPath(). 'css/frontend.octo.editor.css');
		frameOct::_()->addStyle('frontend.octo.editor.tinymce', $this->getModule()->getModPath(). 'css/frontend.octo.editor.tinymce.css');
		frameOct::_()->addStyle('frontend.octo.editor.octo-icons', $this->getModule()->getAssetsUrl(). 'css/octo-icons.css');
	}
	public function loadWpAdminAssets() {
		frameOct::_()->addStyle('wp.common', get_admin_url(). 'css/common.css');
	}
	public function generateWpScriptsStyles() {
		global $wp_scripts, $wp_styles;
		$this->assign('wpScripts', $wp_scripts);
		$this->assign('wpStyles', $wp_styles);
		return parent::getContent('octoWpScripts');
	}
	public function generateStylesScriptsHtml() {
		//global $wp_scripts;
		/*echo '<pre>';
		var_dump($wp_scripts);
		echo '</pre>';*/
		/*if(isset($wp_scripts->registered) && $wp_scripts->registered) {
			$baseUrl = get_bloginfo('wpurl');
			foreach($wp_scripts->registered as $r) {
				frameOct::_()->addScript($r->handle, $baseUrl. $r->src);
				if(isset($r->extra) && isset($r->extra['data'])) {
					frameOct::_()->addJSVar($r->handle, 'dataNoJson', $r->extra['data']);
				}
			}
		}*/
		$sufix = SCRIPT_DEBUG ? '' : '.min';
		$res = array();
		$res[] = $this->generateWpScriptsStyles();
		$styles = frameOct::_()->getStyles();
		if(!empty($styles)) {
			$usedHandles = array();
			$rel = 'stylesheet';
			$media = 'all';
			foreach($styles as $s) {
				if(!isset($usedHandles[ $s['handle'] ])) {
					$handle = $s['handle'];
					// TODO: add default wp src here - to search it by handles
					$rtl_href = isset($s['src']) ? $s['src'] : '';
					$res[] = "<link rel='$rel' id='$handle-rtl-css' href='$rtl_href' type='text/css' media='$media' />";
					$usedHandles[ $s['handle'] ] = 1;
				}
			}
		}
		$jsVars = frameOct::_()->getJSVars();
		if(!empty($jsVars)) {
			$res[] = "<script type='text/javascript'>"; // CDATA and type='text/javascript' is not needed for HTML 5
			$res[] = "/* <![CDATA[ */";
			foreach($jsVars as $scriptH => $vars) {
				foreach($vars as $name => $value) {
					if($name == 'dataNoJson' && !is_array($value)) {
						$res[] = $value;
					} else {
						$res[] = "var $name = ". utilsOct::jsonEncode($value). ";";
					}
				}
			}
			$res[] = "/* ]]> */";
			$res[] = "</script>";
		}
		$scripts = frameOct::_()->getScripts();
		if(!empty($scripts)) {
			$usedHandles = array();
			$includesUrl = includes_url();
			foreach($scripts as $s) {
				if(!isset($usedHandles[ $s['handle'] ])) {
					$handle = $s['handle'];
					$src = isset($s['src']) ? $s['src'] : '';
					if(empty($src)) {
						if($handle == 'jquery') {
							$src = $includesUrl. 'js/jquery/jquery.js';
						} else {
							if(strpos($handle, 'jquery-ui') === 0) {
								$src = $includesUrl. 'js/'. str_replace('-', '/', $handle). '.js';
							}
							if(!empty($sufix)) {
								$src = str_replace('.js', $sufix. '.js', $src);
							}
						}
					}
					$res[] = "<script type='text/javascript' src='$src'></script>";
					$usedHandles[ $s['handle'] ] = 1;
				}
			}
		}
		return implode(OCT_EOL, $res);
	}
	protected function _initTwig() {
		if(!$this->_twig) {
			if(!class_exists('Twig_Autoloader')) {
				require_once(OCT_CLASSES_DIR. 'Twig'. DS. 'Autoloader.php');
			}
			Twig_Autoloader::register();
			$this->_twig = new Twig_Environment(new Twig_Loader_String(), array('debug' => 1));
		}
	}
}
