<?php

class Summary extends GlobalModel
{
	
	public function getSummary($sumID){
		try {
			return dibi::fetchAll("SELECT Dataset, Endpoint
		FROM Summary WHERE SumID = %u", $sumID);
		} catch (Dibi\Exception $e) {
			$this->log($e, __FUNCTION__);
			
			return null;
		}
	}
	
}