<?php

class Namespaces extends GlobalModel
{
	public function getNamespaces($sumids = [])
	{
		try {
			if (empty($sumids)) {
				return [];
			}
			
			return dibi::fetchAll("SELECT DISTINCT SubjPref.URI AS SubjPrefURI, Subj.PrefixID AS SPrefId,
				PredPref.URI as PredPrefURI, Pred.PrefixID AS PPredId,
				ObjPref.URI AS ObjPrefURI, Obj.PrefixID AS OPredId
				FROM Path JOIN PathTriplet USING(PathID)
			JOIN Entity AS Subj ON PathTriplet.Subject_EntityID = Subj.EntityID
			JOIN Prefix AS SubjPref ON Subj.PrefixID = SubjPref.PrefixID
			JOIN Entity AS Pred ON PathTriplet.Predicate_EntityID = Pred.EntityID
			JOIN Prefix AS PredPref ON Pred.PrefixID = PredPref.PrefixID
			JOIN Entity AS Obj ON PathTriplet.Object_EntityID = Obj.EntityID
			JOIN Prefix AS ObjPref ON Obj.PrefixID = ObjPref.PrefixID
			WHERE Path.SumID IN(?)", $sumids);
		} catch (Dibi\Exception $e) {
			$this->log($e, __FUNCTION__);
			
			return null;
		}
	}
}