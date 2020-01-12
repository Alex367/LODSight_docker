<?php

class GraphController extends Controller
{
	
	private $_namespaces;
	private $_predicates;
	private $_graphDB;
	private $_summary;
	
	public function __construct(\Interop\Container\ContainerInterface $container)
	{
		parent::__construct($container);
		$this->_namespaces = new Namespaces();
		$this->_predicates = new Predicates();
		$this->_graphDB = new GraphDB();
		$this->_summary = new Summary();
	}
	
	private function validate()
	{
		$error = false;
		$message = '';
		switch ($this->method) {
			case "getGraph":
				if (empty($this->data->sumid) || is_null($this->data->minfreq)) {
					$error = true;
					$message = Messages::INCOMPLETE;
					break;
				}
				foreach ($this->data->sumid as $s) {
					if (!is_numeric($s)) {
						$error = true;
						$message = Messages::INVALID . 'sumid';
						break;
					}
				}
				if (!is_numeric($this->data->minfreq)) {
					$error = true;
					$message = Messages::INVALID . 'minfreq';
					break;
				}
				if (isset($this->data->maxfreq)) {
					if (!is_numeric($this->data->maxfreq)) {
						$error = true;
						$message = Messages::INVALID . 'maxfreq';
						break;
					}
				}
				break;
			default:
				$error = false;
				$message = '';
		}
		
		return array('error' => $error, 'message' => $message);
	}
	
	public function getGraph()
	{
		$validator = $this->validate();
		if ($validator['error']) {
			return $this->response(ERR, [], $validator['message']);
		}
		
		$sel_predicates = !empty($this->data->p) ? $this->data->p : null;
		$sel_namespaces = !empty($this->data->ns) ? $this->data->ns : null;
		
		$graph = new Graph(SKIP_ENTITIES);
		
		$namespacesDB = $this->_namespaces->getNamespaces($this->data->sumid);
		if (is_null($namespacesDB)) {
			return $this->response(DB_ERROR, [], Messages::UNEXPECTED);
		}
		foreach ($namespacesDB as $row) {
			$namespaces = [$row['SubjPrefURI'], $row['PredPrefURI'], $row['ObjPrefURI']];
			$ids = [$row['SPrefId'], $row['PPredId'], $row['OPredId']];
			for ($i = 0; $i < 3; $i++) {
				$graph->ent_store->resolvePrefix($namespaces[ $i ], $ids[ $i ]);
			}
		}
		
		$predicatesDB = $this->_predicates->getPredicates($this->data->sumid);
		if (is_null($predicatesDB)) {
			return $this->response(DB_ERROR, [], Messages::UNEXPECTED);
		}
		foreach ($predicatesDB as $row) {
			$predicate = new Entity($row['Predicate_EntityID'], $row['PredEntityName'], $row['PredPrefURI']);
			$predicate->selected = is_null($sel_predicates) ? null : in_array($predicate->id, $sel_predicates);
			
			$graph->ent_store->addPredicate($predicate);
		}
		
		$graphData1 = $this->_graphDB->getData1($this->data->minfreq, $sel_namespaces, $this->data->sumid);
		if (is_null($graphData1)) {
			return $this->response(DB_ERROR, [], Messages::UNEXPECTED);
		}
		$maxFrequency = 0;
		$maxFreq = is_null($this->data->maxfreq) ? PHP_INT_MAX : $this->data->maxfreq;
		foreach ($graphData1 as $row) {
			if ($row['Frequency'] < $maxFreq) {
				$subject = new Entity($row['Subject_EntityID'], $row['SubjEntityName'], $row['SubjPrefURI']);
				$predicate = new Entity($row['Predicate_EntityID'], $row['PredEntityName'], $row['PredPrefURI']);
				$object = new Entity($row['Object_EntityID'], $row['ObjEntityName'], $row['ObjPrefURI']);
				$shouldAddLink = true;
				if (!is_null($sel_predicates)) {
					$shouldAddLink = in_array($predicate->id, $sel_predicates);
				}
				if ($shouldAddLink) {
					$graph->addLink($subject, $predicate, $object, false, $row['Frequency']);
				}
			}
			if ($row['Frequency'] > $maxFrequency) {
				$maxFrequency = $row['Frequency'];
			}
		}
		
		$graphData2 = $this->_graphDB->getData2($this->data->sumid);
		if (is_null($graphData2)) {
			return $this->response(DB_ERROR, [], Messages::UNEXPECTED);
		}
		foreach ($graphData2 as $row) {
			$graph->addLink(
				new Entity($row['Subject_EntityID'], $row['SubjEntityName'], $row['SubjPrefURI'], true),
				new Entity($row['Predicate_EntityID'], $row['PredEntityName'], $row['PredPrefURI'], true),
				new Entity($row['Object_EntityID'], $row['ObjEntityName'], $row['ObjPrefURI'], true),
				true);
		}
		
		$dataset = "";
		$endpoint = "";
		$first = true;
		foreach ($this->data->sumid as $sid) {
			$summary = $this->_summary->getSummary($sid);
			if (is_null($summary)) {
				break;
				
				return $this->response(DB_ERROR, [], Messages::UNEXPECTED);
			}
			foreach ($summary as $row) {
				if (!$first) {
					$dataset .= ", ";
				}
				
				$dataset .= $row['Dataset'];
				$first = false;
				$endpoint = $row['Endpoint'];
			}
		}
		
		$graph_result = new GraphResult($graph->entities, $graph->links, $graph->ent_store->getPrefixMappings($sel_namespaces), $dataset, $endpoint, $graph->predicates);
		$graph_result->setMaxFrequency($maxFrequency);
		
		return $this->response(OK, ['success' => true, 'data' => $graph_result]);
	}
	
}