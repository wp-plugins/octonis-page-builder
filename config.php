<?php
    global $wpdb;
    if (!defined('WPLANG') || WPLANG == '') {
        define('OCT_WPLANG', 'en_GB');
    } else {
        define('OCT_WPLANG', WPLANG);
    }
    if(!defined('DS')) define('DS', DIRECTORY_SEPARATOR);

    define('OCT_PLUG_NAME', basename(dirname(__FILE__)));
    define('OCT_DIR', WP_PLUGIN_DIR. DS. OCT_PLUG_NAME. DS);
    define('OCT_TPL_DIR', OCT_DIR. 'tpl'. DS);
    define('OCT_CLASSES_DIR', OCT_DIR. 'classes'. DS);
    define('OCT_TABLES_DIR', OCT_CLASSES_DIR. 'tables'. DS);
	define('OCT_HELPERS_DIR', OCT_CLASSES_DIR. 'helpers'. DS);
    define('OCT_LANG_DIR', OCT_DIR. 'lang'. DS);
    define('OCT_IMG_DIR', OCT_DIR. 'img'. DS);
    define('OCT_TEMPLATES_DIR', OCT_DIR. 'templates'. DS);
    define('OCT_MODULES_DIR', OCT_DIR. 'modules'. DS);
    define('OCT_FILES_DIR', OCT_DIR. 'files'. DS);
    define('OCT_ADMIN_DIR', ABSPATH. 'wp-admin'. DS);

    define('OCT_SITE_URL', get_bloginfo('wpurl'). '/');
    define('OCT_JS_PATH', WP_PLUGIN_URL.'/'.basename(dirname(__FILE__)).'/js/');
    define('OCT_CSS_PATH', WP_PLUGIN_URL.'/'.basename(dirname(__FILE__)).'/css/');
    define('OCT_IMG_PATH', WP_PLUGIN_URL.'/'.basename(dirname(__FILE__)).'/img/');
    define('OCT_MODULES_PATH', WP_PLUGIN_URL.'/'.basename(dirname(__FILE__)).'/modules/');
    define('OCT_TEMPLATES_PATH', WP_PLUGIN_URL.'/'.basename(dirname(__FILE__)).'/templates/');
    define('OCT_JS_DIR', OCT_DIR. 'js/');

    define('OCT_URL', OCT_SITE_URL);

    define('OCT_LOADER_IMG', OCT_IMG_PATH. 'loading.gif');
	define('OCT_TIME_FORMAT', 'H:i:s');
    define('OCT_DATE_DL', '/');
    define('OCT_DATE_FORMAT', 'm/d/Y');
    define('OCT_DATE_FORMAT_HIS', 'm/d/Y ('. OCT_TIME_FORMAT. ')');
    define('OCT_DATE_FORMAT_JS', 'mm/dd/yy');
    define('OCT_DATE_FORMAT_CONVERT', '%m/%d/%Y');
    define('OCT_WPDB_PREF', $wpdb->prefix);
    define('OCT_DB_PREF', 'oct_');
    define('OCT_MAIN_FILE', 'oct.php');

    define('OCT_DEFAULT', 'default');
    define('OCT_CURRENT', 'current');
	
	define('OCT_EOL', "\n");    
    
    define('OCT_PLUGIN_INSTALLED', true);
    define('OCT_VERSION', '1.0.1');
    define('OCT_USER', 'user');
    
    define('OCT_CLASS_PREFIX', 'octc');     
    define('OCT_FREE_VERSION', false);
	define('OCT_TEST_MODE', true);
    
    define('OCT_SUCCESS', 'Success');
    define('OCT_FAILED', 'Failed');
	define('OCT_ERRORS', 'octErrors');
	
	define('OCT_ADMIN',	'admin');
	define('OCT_LOGGED','logged');
	define('OCT_GUEST',	'guest');
	
	define('OCT_ALL',		'all');
	
	define('OCT_METHODS',		'methods');
	define('OCT_USERLEVELS',	'userlevels');
	/**
	 * Framework instance code, unused for now
	 */
	define('OCT_CODE', 'oct');

	define('OCT_LANG_CODE', 'oct_lng');
	/**
	 * Plugin name
	 */
	define('OCT_WP_PLUGIN_NAME', 'Octonis Page Builder');
	/**
	 * Custom defined for plugin
	 */
	define('OCT_COMMON', 'common');
	define('OCT_FB_LIKE', 'fb_like');
	define('OCT_VIDEO', 'video');
	
	define('OCT_HOME_PAGE_ID', 0);
