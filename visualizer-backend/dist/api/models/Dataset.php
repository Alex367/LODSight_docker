<?php

/**
 * Created by PhpStorm.
 * User: Pavel
 * Date: 9/19/2018
 * Time: 11:01
 */
class Dataset extends GlobalModel
{
	public function getDatasets()
	{
		try {
			return dibi::fetchAll("SELECT * FROM Summary JOIN (SELECT COUNT(PathID) AS Count, SumID, MAX(Frequency) AS MaxFreq FROM Path WHERE Frequency > 0 GROUP BY SumID) Path USING (SumID) WHERE DATE(StartedAt) > %s", SHOW_FROM_DATE);
		} catch (Dibi\Exception $e) {
			$this->log($e, __FUNCTION__);
			
			return null;
		}
	}
}