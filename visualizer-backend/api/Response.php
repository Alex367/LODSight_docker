<?php

class Response
{
	public $status;
	
	public $data;
	
	public $message;
	
	public function __construct($status, $method, $data, $message)
	{
		$hiddenMessages = [ERR, DB_ERROR, REQUEST_ERROR];
		
		$this->status = $status;
		$this->message = $message;
		$this->data = $data;
		if($status !== DB_ERROR){ // already logged in try-catch statement in models
			$this->log($method);
		}
		if(in_array($status, $hiddenMessages)){
			$this->data = (object)array();
		  $this->data->success = false;
		}
		$this->message = in_array($status, $hiddenMessages) && APP_ENV !== 'TEST' ? 'Neočekávaná chyba' : (string)$message;
	}
	
	private function log($request)
	{
		$arr = array(
			'request' => $request,
			'message' => $this->message,
			'data' => json_encode($this->data),
			'ip' => filter_var($_SERVER["REMOTE_ADDR"], FILTER_VALIDATE_IP),
			'date' => date("Y-m-d H:i:s")
		);
		try{
			dibi::query("INSERT INTO request_log", $arr);
		}catch(Dibi\Exception $e){
		
		}
	}
	
}