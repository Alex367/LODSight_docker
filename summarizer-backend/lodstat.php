<?php
    require (dirname(__FILE__).'/lib.php');
    if (isset($argc) && $argv[1]==="sum") {
        $todo = scandir(dirname(__FILE__).'/todo/');    
        foreach ($todo as $file) {
            $done=0;
            if (in_array($file, array('.', '..'))) continue; // vyhni se adresarum
            $err_file="/logs/err/$file.err"; $err_last = lastLine($err_file); // posledni radek err logu    
            $out_file="/logs/$file.out"; $out_last = lastLine($out_file); // posledni radek out logu
            $lines = array($err_last,$out_last); // preg_grep pracuje jen s poli
            $stav="STATUS - ";
            if(preg_grep('/log4j/i',$lines) && preg_grep('/waiting for 1ms/i',$lines)){ $stav.="SUCCESSFUL"; $done=1; }
            if(preg_grep('/\d* more/i',$lines) && preg_grep('/searching for predicates|found predicate/i',$lines)){ $stav.="PREDICATES FAILED"; $done=1; }
            if(preg_grep('/\d* more/i',$lines) && preg_grep('/group by/i',$lines)){ $stav.="SPARQL ENDPOINT ERROR"; $done=1; }
            $path="/todo/$file"; 
            if($done==1){
                pisLog($path,$stav); // zapis vysledek
                exec('mv '.dirname(__FILE__).'/todo/'.$file.' '.dirname(__FILE__).'/done/'); // presun popsany log do slozky done
            }
        }
    }else{
        pisLog("error","argc and argv disabled or missing endpoint\n");
    }
?>