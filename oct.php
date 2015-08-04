<?php
/**
 * Plugin Name: Octonis Page Builder
 * Plugin URI:
 * Description: Build amazing web pages or website without any programming skills. Just choose and customize blocks. Focus on the goal, not on technical issues
 * Version: 1.0.1
 * Author: octonis.com
 * Author URI:
 **/
	/**
	 * Base config constants and functions
	 */
    require_once(dirname(__FILE__). DIRECTORY_SEPARATOR. 'config.php');
    require_once(dirname(__FILE__). DIRECTORY_SEPARATOR. 'functions.php');
	/**
	 * Connect all required core classes
	 */
    importClassOct('dbOct');
    importClassOct('installerOct');
    importClassOct('baseObjectOct');
    importClassOct('moduleOct');
    importClassOct('modelOct');
    importClassOct('viewOct');
    importClassOct('controllerOct');
    importClassOct('helperOct');
    importClassOct('dispatcherOct');
    importClassOct('fieldOct');
    importClassOct('tableOct');
    importClassOct('frameOct');
    importClassOct('reqOct');
    importClassOct('uriOct');
    importClassOct('htmlOct');
    importClassOct('responseOct');
    importClassOct('fieldAdapterOct');
    importClassOct('validatorOct');
    importClassOct('errorsOct');
    importClassOct('utilsOct');
    importClassOct('modInstallerOct');
	importClassOct('installerDbUpdaterOct');
	importClassOct('dateOct');
	/**
	 * Check plugin version - maybe we need to update database, and check global errors in request
	 */
    installerOct::update();
    errorsOct::init();
    /**
	 * Start application
	 */
    frameOct::_()->parseRoute();
    frameOct::_()->init();
    frameOct::_()->exec();
