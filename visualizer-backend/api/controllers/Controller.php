<?php

use \Firebase\JWT\JWT;


class Controller
{
	private $request;
	private $response;
	protected $data;
	protected $method;
	
	public function __construct(Interop\Container\ContainerInterface $container)
	{
		$this->request = $container->get('request');
		$this->response = $container->get('response');
		$this->data = (object)Tools::stripInput($this->request->getParsedBody());
		$this->method = $this->request->getUri()->getPath();
	}
	
	protected function getRequest()
	{
		return $this->request;
	}
	
	protected function getResponse()
	{
		return $this->response;
	}
	
	protected function getData()
	{
		return $this->data;
	}
	
	protected function response($status, $data = array(), $message = '')
	{
		
		$data = $status === OK ? $data : $this->getData();
		
		$responseData = new Response($status, $this->method, $data, $message);
		
		$response = $this->getResponse();
		$response = $response->withStatus($status);
		$response = $response->withHeader('Content-type', 'application/json');
		$response->getBody()->write(json_encode($responseData));
		return $response;
	}
}