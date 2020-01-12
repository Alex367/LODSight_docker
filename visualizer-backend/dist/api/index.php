<?php

require_once 'config/config.php';
require_once 'config/autoload.php';
require_once './Response.php';

$c = new \Slim\Container($configuration);

$api = new \Slim\App($c);

unset($api->getContainer()['errorHandler']);

$api->group('/', function () use ($api) {
	$this->post('getGraph', '\GraphController:getGraph');
	$this->post('getDatasets', '\DatasetController:getDatasets');
	
})->add(new ApiAuthenticateController());

$api->run();


