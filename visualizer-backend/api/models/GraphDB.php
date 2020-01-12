<?php

class GraphDB extends GlobalModel
{
	public function getData1($minFreq, $sel_namespaces, $sumids = [])
	{
		try {
			if (empty($sumids)) {
				return [];
			}
			
			if (is_null($sel_namespaces)) {
				return dibi::fetchAll("SELECT Subject_EntityID, Subj.EntityName AS SubjEntityName, SubjPref.URI AS SubjPrefURI,
				Predicate_EntityID,Pred.EntityName as PredEntityName, PredPref.URI as PredPrefURI,
				Object_EntityID, Obj.EntityName AS ObjEntityName, ObjPref.URI AS ObjPrefURI,
				Frequency
				FROM Path JOIN PathTriplet USING(PathID)
			JOIN Entity AS Subj ON PathTriplet.Subject_EntityID = Subj.EntityID
			JOIN Prefix AS SubjPref ON Subj.PrefixID = SubjPref.PrefixID
			JOIN Entity AS Pred ON PathTriplet.Predicate_EntityID = Pred.EntityID
			JOIN Prefix AS PredPref ON Pred.PrefixID = PredPref.PrefixID
			JOIN Entity AS Obj ON PathTriplet.Object_EntityID = Obj.EntityID
			JOIN Prefix AS ObjPref ON Obj.PrefixID = ObjPref.PrefixID
			WHERE
			Path.Frequency >= %u AND Path.SumID IN(?)", $minFreq, $sumids);
			} else {
				return dibi::fetchAll("SELECT Subject_EntityID, Subj.EntityName AS SubjEntityName, SubjPref.URI AS SubjPrefURI,
				Predicate_EntityID,Pred.EntityName as PredEntityName, PredPref.URI as PredPrefURI,
				Object_EntityID, Obj.EntityName AS ObjEntityName, ObjPref.URI AS ObjPrefURI,
				Frequency
				FROM Path JOIN PathTriplet USING(PathID)
			JOIN Entity AS Subj ON PathTriplet.Subject_EntityID = Subj.EntityID
			JOIN Prefix AS SubjPref ON Subj.PrefixID = SubjPref.PrefixID
			JOIN Entity AS Pred ON PathTriplet.Predicate_EntityID = Pred.EntityID
			JOIN Prefix AS PredPref ON Pred.PrefixID = PredPref.PrefixID
			JOIN Entity AS Obj ON PathTriplet.Object_EntityID = Obj.EntityID
			JOIN Prefix AS ObjPref ON Obj.PrefixID = ObjPref.PrefixID
			WHERE
			Path.Frequency >= %u AND Path.SumID IN(?) AND (Subj.PrefixID IN (?) OR Pred.PrefixID IN (?) OR Obj.PrefixID IN (?))", $minFreq, $sumids, $sel_namespaces, $sel_namespaces, $sel_namespaces);
			}
		} catch (Dibi\Exception $e) {
			$this->log($e, __FUNCTION__);
			
			return null;
		}
	}
	
	public function getData2($sumids = [])
	{
		try {
			if (empty($sumids)) {
				return [];
			}
			
				return dibi::fetchAll("SELECT Subject_EntityID, Subj.EntityName AS SubjEntityName, SubjPref.URI AS SubjPrefURI,
	Predicate_EntityID,Pred.EntityName as PredEntityName, PredPref.URI as PredPrefURI,
	Object_EntityID, Obj.EntityName AS ObjEntityName, ObjPref.URI AS ObjPrefURI
	FROM CSet JOIN SetTriplet USING(SetID)
	JOIN Entity AS Subj ON SetTriplet.Subject_EntityID = Subj.EntityID
	JOIN Prefix AS SubjPref ON Subj.PrefixID = SubjPref.PrefixID
	JOIN Entity AS Pred ON SetTriplet.Predicate_EntityID = Pred.EntityID
	JOIN Prefix AS PredPref ON Pred.PrefixID = PredPref.PrefixID
	JOIN Entity AS Obj ON SetTriplet.Object_EntityID = Obj.EntityID
	JOIN Prefix AS ObjPref ON Obj.PrefixID = ObjPref.PrefixID
	WHERE CSet.SumID IN(?)", $sumids);
		} catch (Dibi\Exception $e) {
			$this->log($e, __FUNCTION__);
			
			return null;
		}
	}
}