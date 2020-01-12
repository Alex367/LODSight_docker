<?php

class Tools
{
	
	public function __construct()
	{
		exit('Init function is not allowed');
	}
	
	public static function date_compare($a, $b)
	{
		$t1 = strtotime($a['date']);
		$t2 = strtotime($b['date']);
		
		return $t2 - $t1;
	}
	
	public static function stripInput($input)
	{
		if (is_array($input)) {
			foreach ($input as &$inp) {
				$inp = self::stripInput($inp);
			}
		} else {
			$input = strip_tags($input);
			$input = $input == "null" ? null : $input;
		}
		
		return $input;
	}
	
	public static function generateHash($length, $table = false, $col = 'hash')
	{
		
		$hash = bin2hex(openssl_random_pseudo_bytes($length / 2));
		
		if ($table) {
			try {
				$cnt = dibi::fetchSingle("SELECT COUNT(*) FROM [$table] WHERE [$col] = %s", $hash);
			} catch (DibiException $e) {
				return false;
			}
		} else {
			$cnt = 0;
		}
		
		if ($cnt > 0) {
			self::generateHash($length, $table);
		} else {
			return $hash;
		}
	}
}