<?php

class NS
{
	//public $str;
	//public $id;
	//public $selected;
	public $name;
	public $id;
	public $prefix;
	
	function __construct($prefix, $namespace, $id)
	{
		//$this->str = $prefix . ": " . $namespace;
		$this->prefix = $prefix;
		$this->name = $namespace;
		$this->id = $id;
		//$this->selected = $selected;
	}
}