<?php

/**
 * Created by PhpStorm.
 * User: Pavel
 * Date: 8/6/2018
 * Time: 23:05
 */
class GlobalModel
{
	protected function log($message, $method){
		$log_args = array(
			'query' => dibi::$sql,
			'message' => $message->getMessage(),
			'method' => $method,
			'ip' => filter_var($_SERVER["REMOTE_ADDR"], FILTER_VALIDATE_IP),
			'date' => date("Y-m-d H:i:s")
		);
		
		dibi::query("INSERT INTO dibi_log", $log_args);
	}
}