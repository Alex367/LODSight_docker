<?php

class Entity {
	public $id;
	public $name;
	public $prefix;
	public $fromCSet;
	
	function __construct($id, $name, $prefix, $fromCSet = false) {
		$this->id = $id;
		$this->name = $name;
		$this->prefix = $prefix;
		$this->fromCSet = $fromCSet;
	}
	
	function setPrefixcc($prefix) {
		$this->prefix = $prefix;
	}
	
}