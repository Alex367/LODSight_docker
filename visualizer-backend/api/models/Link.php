<?php

class Link
{
	public $start;
	public $end;
	public $label;
	public $fromCSet;
	public $frequency;
	
	function __construct($ent_store, $start, $label, $end, $fromCSet = false, $frequency = 1)
	{
		$this->start = $ent_store->getIndex($start);
		$this->end = $ent_store->getIndex($end);
		
		$label->setPrefixcc($ent_store->resolvePrefix($label->prefix));
		
		$this->label = $label;
		$this->fromCSet = $fromCSet;
		$this->frequency = $frequency;
	}
	
	function equals($ent_store, $start, $label, $end)
	{
		if ($start->id == $ent_store->graph->entities[ $this->start ]->id
			&& $label->id == $this->label->id
			&& $end->id == $ent_store->graph->entities[ $this->end ]->id
		)
			return true;
		else return false;
	}
}