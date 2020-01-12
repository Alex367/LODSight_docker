<?php

class EntityStore
{
	public $graph;
	public $namespaces;
	public $nsids;
	public $prefixes;
	private $prefixCount;
	
	function __construct($graph)
	{
		$this->namespaces = array();
		$this->prefixes = array();
		$this->prefixCount = 0;
		$this->graph = $graph;
	}
	
	public function getIndex($entity)
	{
		$ent_index = $this->getExistingEntityIndex($entity);
		if ($ent_index < 0) {
			$ent_index = $this->addEntity($entity);
		}
		
		return $ent_index;
	}
	
	public function getExistingEntityIndex($entity)
	{
		foreach ($this->graph->entities as $index => $store_entity) {
			if ($store_entity->id == $entity->id) {
				return $index;
			}
		}
		
		return -1;
	}
	
	private function addEntity($entity)
	{
		$entity->setPrefixcc($this->resolvePrefix($entity->prefix));
		$this->graph->entities[] = $entity;
		
		return $this->getExistingEntityIndex($entity);
	}
	
	public function addPredicate($predicate)
	{
		$predicate->setPrefixcc($this->resolvePrefix($predicate->prefix));
		$this->graph->predicates[] = $predicate;
	}
	
	function resolvePrefix($namespaceUri, $id = null)
	{
		$prefixIndex = array_search($namespaceUri, $this->namespaces);
		if (!($prefixIndex === false))
			return $this->prefixes[ $prefixIndex ];
		
		$url = "http://prefix.cc/reverse?uri=" . urlencode($namespaceUri) . "&format=json";
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		$content = curl_exec($ch);
		curl_close($ch);
		
		$ccprefixes = json_decode($content);
		if ($ccprefixes != null) {
			foreach ($ccprefixes as $prefix => $namespace) {
				$this->prefixes[] = $prefix;
				$this->namespaces[] = $namespaceUri;
				$this->nsids[] = $id;
				
				return $prefix;
			}
		} else {
			$this->prefixCount++;
			$autoPrefix = "ns$this->prefixCount";
			$this->prefixes[] = $autoPrefix;
			$this->namespaces[] = $namespaceUri;
			$this->nsids[] = $id;
			
			return $autoPrefix;
		}
	}
	
	function getPrefixMappings()
	{
		$mappings = array();
		for ($i = 0; $i < count($this->prefixes); $i++) {
			$mappings[] = new NS($this->prefixes[ $i ], $this->namespaces[ $i ], $this->nsids[ $i ]);
		}
		
		return $mappings;
	}
}