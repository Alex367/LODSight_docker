<?php
/**
 * Created by PhpStorm.
 * User: Pavel
 * Date: 8/6/2018
 * Time: 01:24
 */

spl_autoload_register('__autoload');

$classesDir = array (
	PATH.'/api/controllers/',
	PATH.'/api/models/',
	PATH.'/api/helpers/',
);

function __autoload($class_name) {
	global $classesDir;
	foreach ($classesDir as $directory) {
		if (file_exists($directory . $class_name . '.php')) {
			require_once ($directory . $class_name . '.php');
			return;
		}
	}
}