<?php

/**
 * Created by PhpStorm.
 * User: Pavel
 * Date: 8/6/2018
 * Time: 00:13
 */

use \Firebase\JWT\JWT;

class ApiAuthenticateController
{
	public function __invoke($request, $response, $next)
	{
		$jwtDecoded = null;
		if ($request->hasHeader('OPTIONAL')) {
			$password = filter_var($request->getHeaderLine('OPTIONAL'), FILTER_SANITIZE_STRING);
			
			if ($this->auth($password)) {
				$req = $request->getUri()->getPath();
				$_req = RequestValidatorController::isRequestEnabled($req);
				if ($_req !== false) {
					return $next($request, $response);
				} else {
					return $this->deny_access($response);
				}
			} else {
				return $this->deny_access($response);
			}
		} else {
			return $this->deny_access($response);
		}
	}
	
	private function deny_access($response)
	{
		$response = $response->withStatus(UNAUTHORIZED);
		
		return $response;
	}
	
	private function auth($password)
	{
		if (isset($password) && $password == 'BBWdad6bGPRpveaBEyFu4EkqRUrm9ER88EtQVtEWb2bAWCPL') {
			return true;
		} else {
			return false;
		}
	}
}