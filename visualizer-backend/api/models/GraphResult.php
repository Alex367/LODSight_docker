<?php

class GraphResult
{
	public $entities;
	public $links;
	public $namespaces;
	public $dataset;
	public $endpoint;
	public $predicates;
	public $maxFrequency;
	
	function __construct($ent, $links, $namespaces, $dataset, $endpoint, $predicates)
	{
		$this->entities = $ent;
		$this->links = $links;
		$this->namespaces = $namespaces;
		$this->dataset = $dataset;
		$this->endpoint = $endpoint;
		$this->predicates = $predicates;
	}
	
	function setMaxFrequency($freq)
	{
		$this->maxFrequency = (int)$freq;
	}
}