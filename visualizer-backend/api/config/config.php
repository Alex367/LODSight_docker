<?php
define('PATH', dirname(dirname(__DIR__)));
require_once(PATH . "/vendor/autoload.php");
require_once("const.php");

error_reporting(-1);

ini_set("log_errors", 1);

$error = true;
if (strstr($_SERVER['HTTP_HOST'], '.local') || $_SERVER['HTTP_HOST'] === 'localhost') {
	ini_set("display_errors", "1");
	error_reporting(E_ALL);
	dibi::connect(array(
		'driver' => 'mysqli',
		'host' => 'localhost',
		'username' => 'root',
		'password' => '',
		'database' => 'lodsight',
		'charset' => 'utf8'
	));
	define('APP_ENV', 'LOCAL');
} else {
	error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_DEPRECATED);
	ini_set("display_errors", "0");
	dibi::connect(array(
		'driver' => 'mysqli',
		'host' => 'localhost',
		'username' => '***',
		'password' => '***',
		'database' => '***',
		'charset' => 'utf8'
	));
	define('APP_ENV', 'PRODUCTION');
	$error = false;
}

$configuration = [
	'settings' => [
		'displayErrorDetails' => true
	]
];