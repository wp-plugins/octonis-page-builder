<?php
class templatesOct extends moduleOct {
    protected $_styles = array();
    public function init() {
        if (is_admin()) {
			if($isAdminPlugOptsPage = frameOct::_()->isAdminPlugOptsPage()) {
				$this->loadCoreJs();
				$this->loadAdminCoreJs();
				$this->loadCoreCss();
				$this->loadChosenSelects();
				frameOct::_()->addScript('adminOptionsOct', OCT_JS_PATH. 'admin.options.js', array(), false, true);
				add_action('admin_enqueue_scripts', array($this, 'loadMediaScripts'));
			}
			// Some common styles - that need to be on all admin pages - be careful with them
			frameOct::_()->addStyle('supsystic-for-all-admin-'. OCT_CODE, OCT_CSS_PATH. 'supsystic-for-all-admin.css');
		}
        parent::init();
    }
	public function loadMediaScripts() {
		wp_enqueue_media();
	}
	public function loadAdminCoreJs() {
		frameOct::_()->addScript('jquery-ui-dialog');
		frameOct::_()->addScript('jquery-ui-slider');
		frameOct::_()->addScript('wp-color-picker');
		frameOct::_()->addScript('tooltipster', OCT_JS_PATH. 'jquery.tooltipster.min.js');
		frameOct::_()->addScript('icheck', OCT_JS_PATH. 'icheck.min.js');
	}
	public function loadCoreJs() {
		frameOct::_()->addScript('jquery');

		frameOct::_()->addScript('commonOct', OCT_JS_PATH. 'common.js');
		frameOct::_()->addScript('coreOct', OCT_JS_PATH. 'core.js');
		
		//frameOct::_()->addScript('selecter', OCT_JS_PATH. 'jquery.fs.selecter.min.js');
		
		$ajaxurl = admin_url('admin-ajax.php');
		$jsData = array(
			'siteUrl'					=> OCT_SITE_URL,
			'imgPath'					=> OCT_IMG_PATH,
			'cssPath'					=> OCT_CSS_PATH,
			'loader'					=> OCT_LOADER_IMG, 
			'close'						=> OCT_IMG_PATH. 'cross.gif', 
			'ajaxurl'					=> $ajaxurl,
			//'options'					=> frameOct::_()->getModule('options')->getAllowedPublicOptions(),
			'OCT_CODE'					=> OCT_CODE,
			//'ball_loader'				=> OCT_IMG_PATH. 'ajax-loader-ball.gif',
			//'ok_icon'					=> OCT_IMG_PATH. 'ok-icon.png',
		);
		if(is_admin()) {
			$jsData['isPro'] = frameOct::_()->getModule('supsystic_promo')->isPro();
		}
		$jsData = dispatcherOct::applyFilters('jsInitVariables', $jsData);
		frameOct::_()->addJSVar('coreOct', 'OCT_DATA', $jsData);
	}
	public function loadCoreCss() {
		$this->_styles = array(
			'styleOct'			=> array('path' => OCT_CSS_PATH. 'style.css', 'for' => 'admin'), 
			'supsystic-uiOct'	=> array('path' => OCT_CSS_PATH. 'supsystic-ui.css', 'for' => 'admin'), 
			'dashicons'			=> array('for' => 'admin'),
			'bootstrap-alerts'	=> array('path' => OCT_CSS_PATH. 'bootstrap-alerts.css', 'for' => 'admin'),
			'tooltipster'		=> array('path' => OCT_CSS_PATH. 'tooltipster.css', 'for' => 'admin'),
			'icheck'			=> array('path' => OCT_CSS_PATH. 'jquery.icheck.css', 'for' => 'admin'),
			//'uniform'			=> array('path' => OCT_CSS_PATH. 'uniform.default.css', 'for' => 'admin'),
			//'selecter'			=> array('path' => OCT_CSS_PATH. 'jquery.fs.selecter.min.css', 'for' => 'admin'),
			'wp-color-picker'	=> array('for' => 'admin'),
		);
		foreach($this->_styles as $s => $sInfo) {
			if(!empty($sInfo['path'])) {
				frameOct::_()->addStyle($s, $sInfo['path']);
			} else {
				frameOct::_()->addStyle($s);
			}
		}
		$this->loadFontAwesome();
	}
	public function loadJqueryUi() {
		static $loaded = false;
		if(!$loaded) {
			frameOct::_()->addStyle('jquery-ui', OCT_CSS_PATH. 'jquery-ui.min.css');
			frameOct::_()->addStyle('jquery-ui.structure', OCT_CSS_PATH. 'jquery-ui.structure.min.css');
			frameOct::_()->addStyle('jquery-ui.theme', OCT_CSS_PATH. 'jquery-ui.theme.min.css');
			frameOct::_()->addStyle('jquery-slider', OCT_CSS_PATH. 'jquery-slider.css');
			$loaded = true;
		}
	}
	public function loadJqGrid() {
		static $loaded = false;
		if(!$loaded) {
			$this->loadJqueryUi();
			frameOct::_()->addScript('jq-grid', OCT_JS_PATH. 'jquery.jqGrid.min.js');
			frameOct::_()->addStyle('jq-grid', OCT_CSS_PATH. 'ui.jqgrid.css');
			$langToLoad = utilsOct::getLangCode2Letter();
			if(!file_exists(OCT_JS_DIR. 'i18n'. DS. 'grid.locale-'. $langToLoad. '.js')) {
				$langToLoad = 'en';
			}
			frameOct::_()->addScript('jq-grid-lang', OCT_JS_PATH. 'i18n/grid.locale-'. $langToLoad. '.js');
			$loaded = true;
		}
	}
	public function loadFontAwesome() {
		frameOct::_()->addStyle('font-awesomeOct', frameOct::_()->getModule('octo')->getAssetsUrl(). 'css/font-awesome.css');
	}
	public function loadChosenSelects() {
		frameOct::_()->addStyle('jquery.chosen', OCT_CSS_PATH. 'chosen.min.css');
		frameOct::_()->addScript('jquery.chosen', OCT_JS_PATH. 'chosen.jquery.min.js');
	}
	public function loadDatePicker() {
		frameOct::_()->addScript('jquery-ui-datepicker');
	}
	public function loadJqplot() {
		static $loaded = false;
		if(!$loaded) {
			$jqplotDir = 'jqplot/';

			frameOct::_()->addStyle('jquery.jqplot', OCT_CSS_PATH. 'jquery.jqplot.min.css');

			frameOct::_()->addScript('jplot', OCT_JS_PATH. $jqplotDir. 'jquery.jqplot.min.js');
			frameOct::_()->addScript('jqplot.canvasAxisLabelRenderer', OCT_JS_PATH. $jqplotDir. 'jqplot.canvasAxisLabelRenderer.min.js');
			frameOct::_()->addScript('jqplot.canvasTextRenderer', OCT_JS_PATH. $jqplotDir. 'jqplot.canvasTextRenderer.min.js');
			frameOct::_()->addScript('jqplot.dateAxisRenderer', OCT_JS_PATH. $jqplotDir. 'jqplot.dateAxisRenderer.min.js');
			frameOct::_()->addScript('jqplot.canvasAxisTickRenderer', OCT_JS_PATH. $jqplotDir. 'jqplot.canvasAxisTickRenderer.min.js');
			frameOct::_()->addScript('jqplot.highlighter', OCT_JS_PATH. $jqplotDir. 'jqplot.highlighter.min.js');
			frameOct::_()->addScript('jqplot.cursor', OCT_JS_PATH. $jqplotDir. 'jqplot.cursor.min.js');
			frameOct::_()->addScript('jqplot.barRenderer', OCT_JS_PATH. $jqplotDir. 'jqplot.barRenderer.min.js');
			frameOct::_()->addScript('jqplot.categoryAxisRenderer', OCT_JS_PATH. $jqplotDir. 'jqplot.categoryAxisRenderer.min.js');
			frameOct::_()->addScript('jqplot.pointLabels', OCT_JS_PATH. $jqplotDir. 'jqplot.pointLabels.min.js');
			frameOct::_()->addScript('jqplot.pieRenderer', OCT_JS_PATH. $jqplotDir. 'jqplot.pieRenderer.min.js');
			$loaded = true;
		}
	}
	public function loadBootstrap() {
		static $loaded = false;
		if(!$loaded) {
			frameOct::_()->addStyle('bootstrap', frameOct::_()->getModule('octo')->getAssetsUrl(). 'css/bootstrap.min.css');
			frameOct::_()->addStyle('bootstrap-theme', frameOct::_()->getModule('octo')->getAssetsUrl(). 'css/bootstrap-theme.min.css');
			frameOct::_()->addScript('bootstrap', OCT_JS_PATH. 'bootstrap.min.js');
			
			frameOct::_()->addStyle('jasny-bootstrap', OCT_CSS_PATH. 'jasny-bootstrap.min.css');
			frameOct::_()->addScript('jasny-bootstrap', OCT_JS_PATH. 'jasny-bootstrap.min.js');
			$loaded = true;
		}
	}
	public function loadTinyMce() {
		static $loaded = false;
		if(!$loaded) {
			frameOct::_()->addScript('oct.tinymce', OCT_JS_PATH. 'tinymce/tinymce.min.js');
			frameOct::_()->addScript('oct.jquery.tinymce', OCT_JS_PATH. 'tinymce/jquery.tinymce.min.js');
			$loaded = true;
		}
	}
	public function loadContextMenu() {
		static $loaded = false;
		if(!$loaded) {
			frameOct::_()->addScript('jquery-ui-position');
			frameOct::_()->addScript('jquery.contextMenu', OCT_JS_PATH. 'jquery.context-menu/jquery.contextMenu.js');
			frameOct::_()->addStyle('jquery.contextMenu', OCT_JS_PATH. 'jquery.context-menu/jquery.contextMenu.css');
			$loaded = true;
		}
	}
	public function loadCustomColorpicker() {
		static $loaded = false;
		if(!$loaded) {
			frameOct::_()->addScript('jquery.colorpicker.spectrum', OCT_JS_PATH. 'jquery.colorpicker/spectrum.js');
			frameOct::_()->addStyle('jquery.colorpicker.spectrum', OCT_JS_PATH. 'jquery.colorpicker/spectrum.css');
			$loaded = true;
		}
	}
	public function loadCustomBootstrapColorpicker() {
		static $loaded = false;
		if(!$loaded) {
			frameOct::_()->addScript('jquery.bootstrap.colorpicker.tinycolor', OCT_JS_PATH. 'jquery.bootstrap.colorpicker/tinycolor.js');
			frameOct::_()->addScript('jquery.bootstrap.colorpicker', OCT_JS_PATH. 'jquery.bootstrap.colorpicker/jquery.colorpickersliders.js');
			frameOct::_()->addStyle('jquery.bootstrap.colorpicker', OCT_JS_PATH. 'jquery.bootstrap.colorpicker/jquery.colorpickersliders.css');
			$loaded = true;
		}
	}
	/**
	 * Load JS lightbox plugin, for now - this is prettyphoto
	 */
	public function loadLightbox() {
		static $loaded = false;
		if(!$loaded) {
			frameOct::_()->addScript('prettyphoto', OCT_JS_PATH. 'prettyphoto/js/jquery.prettyPhoto.js');
			frameOct::_()->addStyle('prettyphoto', OCT_JS_PATH. 'prettyphoto/css/prettyPhoto.css');
			$loaded = true;
		}
	}
}
