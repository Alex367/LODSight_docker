<?php

class Graph
{
	public $entities;
	public $predicates;
	public $links;
	public $ent_store;
	private $skipEntities;
	
	function __construct($skipEntities)
	{
		$this->entities = array();
		$this->ent_store = new EntityStore($this);
		$this->links = array();
		$this->skipEntities = $skipEntities;
		$this->predicates = array();
	}
	
	function addLink($start, $label, $end, $csetlink = false, $frequency = 1)
	{
		$existing = false;
		foreach ($this->skipEntities as $entity) {
			if ($label->name == $entity[1] && $label->prefix == $entity[0]){
				$existing = true;
				break;
			}
			
		}
		if (!$existing) {
			foreach ($this->links as $link) {
				if ($link->equals($this->ent_store, $start, $label, $end)){
					$existing = true;
					break;
				}
			}
		}
		if ($csetlink) {
			$startsInPath = false;
			foreach ($this->entities as $entity) {
				if (!$entity->fromCSet && $entity->id == $start->id){
					$startsInPath = true;
					break;
				}
			}
			if (!$startsInPath)
				$existing = true;
		}
		if (!$existing)
			$this->links[] = new Link($this->ent_store, $start, $label, $end, $csetlink, $frequency);
	}
	
	public function copyNeighborLinksTo($targetGraph)
	{
		$linksToAdd = array();
		foreach ($this->links as $sourceLink) {
			$linkStartEnd = [$this->entities[ $sourceLink->start ], $this->entities[ $sourceLink->end ]];
			
			foreach ($linkStartEnd as $sourceLinkEnt) {
				if ($targetGraph->ent_store->getExistingEntityIndex($sourceLinkEnt) >= 0) {
					$linksToAdd[] = $sourceLink;
					break;
				}
			}
		}
		
		foreach ($linksToAdd as $linkToAdd) {
			$targetGraph->addLink($this->entities[ $linkToAdd->start ], $linkToAdd->label, $this->entities[ $linkToAdd->end ]);
		}
	}
}