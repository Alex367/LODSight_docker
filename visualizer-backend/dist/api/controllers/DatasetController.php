<?php

class DatasetController extends Controller
{
	
	private $_dataset;
	
	public function __construct(\Interop\Container\ContainerInterface $container)
	{
		parent::__construct($container);
		$this->_dataset = new Dataset();
	}
	
	private function validate()
	{
		$error = false;
		$message = '';
		switch ($this->method) {
			case "getDataset":
				$error = false;
				$message = '';
				break;
			default:
				$error = false;
				$message = '';
		}
		
		return array('error' => $error, 'message' => $message);
	}
	
	public function getDatasets()
	{
		$validator = $this->validate();
		if ($validator['error']) {
			return $this->response(ERR, [], $validator['message']);
		}
		
		$return = [];
		$datasetsDB = $this->_dataset->getDatasets();
		if(is_null($datasetsDB)){
			return $this->response(DB_ERROR, [], Messages::UNEXPECTED);
		}
		
		$minfreqTotal = 1;
		
		foreach($datasetsDB as $row){
			$pathcount = $row['Count'];
			$dataset = $row['Dataset'];
			$endpoint = $row['Endpoint'];
			$maxFreq = $row['MaxFreq'];
			
			if ($pathcount > PATH_COUNT_LIMIT) {
				$minfreqTotal = $minfreq = $maxFreq * LIMITED_DETAIL_PERCENTAGE * 0.01;
			} else{
				$minfreq = 1;
			}
			
			$dataset = $dataset == "" ? "all available" : $dataset;
			$return[] = array(
				'sumid' => $row["SumID"],
				'minfreq' => $minfreq,
				'maxfreq' => PHP_INT_MAX,
				'dataset' => $dataset,
				'endpoint' => $endpoint,
				'pathCount' => $pathcount,
			);
		}
		
		$return = array(
			'minfreq' => $minfreqTotal,
			'maxfreq' => PHP_INT_MAX,
			'data' => $return
		);
		
		return $this->response(OK, ['success' => true, 'data' => $return]);
	}
	
}