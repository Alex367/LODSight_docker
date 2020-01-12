<?php

class Predicates extends GlobalModel
{
	public function getPredicates($sumids = [])
	{
		try {
			if (empty($sumids)) {
				return [];
			}
			
			return dibi::fetchAll("SELECT DISTINCT
	Predicate_EntityID,Pred.EntityName as PredEntityName, PredPref.URI as PredPrefURI
	FROM Path JOIN PathTriplet USING(PathID)
	JOIN Entity AS Pred ON PathTriplet.Predicate_EntityID = Pred.EntityID
	JOIN Prefix AS PredPref ON Pred.PrefixID = PredPref.PrefixID
	WHERE Path.SumID IN(?)", $sumids);
		} catch (Dibi\Exception $e) {
			$this->log($e, __FUNCTION__);
			
			return null;
		}
	}
}