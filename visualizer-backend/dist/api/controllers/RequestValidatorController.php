<?php

/**
 * Created by PhpStorm.
 * User: Pavel
 * Date: 8/6/2018
 * Time: 00:26
 */
class RequestValidatorController
{
	private static $allowedRequests = array(
		'getDatasets' => true,
		'getGraph' => true,
	);
	
	public static function isRequestEnabled($req)
	{
		if (in_array($req, array_keys(self::$allowedRequests))) {
			return self::$allowedRequests[ $req ];
		} else {
			return false;
		}
	}
	
}