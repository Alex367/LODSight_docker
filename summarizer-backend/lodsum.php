<?php
    require (dirname(__FILE__).'/lib.php');
    error_reporting(E_ALL ^ E_WARNING);
    // pro poradek
    if(empty($_POST["akce"]) && !isset($argc)){
        echo "Nepodporovaná akce!";
    }
    // formularova akce
    $akce = isset($_POST["akce"]) ? $_POST["akce"] : ""; // kvuli PHP chybejicimu indexu skrze cron
    if($akce==="start") {
        $text = preg_replace('/\n+/', "\n", trim($_POST['endpoints'])); // smaz prazdne radky
        if(!empty($text)){   
            foreach (explode("\n", $text) as $value) {
                list($var['endpoint'], $var['dataset']) = explode(";", $value); // ber endpoint a dataset
                if(!empty($_POST['email'])) $var["email"] = $_POST['email'];  // kdyz je email, ber email
            
                preg_match('/^(http|https|)(:\/\/|)(.{3})/i', $var['endpoint'], $end); preg_match('/^(http|https|)(:\/\/|)(.{3})/i', $var['dataset'], $data); $incase = rand(); // pojmenuj log
                $logname="/todo/sumlog-$end[3]-$data[3]-$incase.log"; // pojmenuj log
                exec("touch .$logname; chmod 777 .$logname"); // vytvor log a nastav mu prava

                foreach($var as $k => $val){
                    if(!empty($val)) pisLog($logname,"$k - $val"); // zapis zakladni info - endpoint, dataset, mail
                }
                pisLog($logname,"out log - ".dirname(__FILE__)."/logs/sumlog-$end[3]-$data[3]-$incase.log.out"); // zapis cestu k out logu
                pisLog($logname,"err log - ".dirname(__FILE__)."/logs/err/sumlog-$end[3]-$data[3]-$incase.log.err"); // zapis cestu k err logu
                pisLog($logname,"lodsight request"); // zapis zajem o zpracovani
            }
            $myarr->code="ok"; $myarr->message = !empty($_POST['email']) ? "Pracuje se na zpracování Vašeho požadavku, o jeho dokončení budete informováni e-mailem." : "Váš požadavek je zpracováván."; // informuj uzivatele
        }else{
            $myarr->code="err"; $myarr->message =  "V textovém poli pro endpointy se nachází prázdné znaky!";    
        }
        // vrat odpoved
        header("Content-type: application/json; charset=utf-8");
        $json=json_encode($myarr);
        echo $json;
    }
    // cron akce
    if(isset($argc) && $argv[1]==="status"){
        $logs = scandir(dirname(__FILE__).'/done/');
        foreach ($logs as $file) {
            if (in_array($file, array('.', '..'))) continue; // vyhni se adresarum
            $path="/done/$file"; preg_match('/status - (.*$)/i',lastLine($path),$line); // precti posledni radek
            if(!empty($line[1])){
                $logfile = file_get_contents(dirname(__FILE__).$path); // nacti log
                preg_match('/email - (.*$)/mi', $logfile, $mail); // zjisti pritomnost mailu
                if(isset($mail[1])){ // odesli mail
                    preg_match('/endpoint - (.*$)/mi', $logfile, $endpoint); $message = "Váš požadavek pro endpoint: <b>$endpoint[1]</b>"; // nazev endpointu
                    preg_match('/dataset - (.*$)/mi', $logfile, $dataset); $message .= isset($dataset[1]) ? " a dataset: <b>$dataset[1]</b>" : ""; // byl i dataset?
                    if(preg_grep('/succ/i',$line)){ $message .= " byl úspěšně zpracován. Během procesu se nevyskytl žádný problém."; }
                    if(preg_grep('/pred/i',$line)){ $message .= " bohužel nemohl být zpracován. Během procesu se vyskytl problém s vyhledáváním predikátů."; }
                    if(preg_grep('/sparql/i',$line)){ $message .= " bohužel nemohl být zpracován. Během procesu se nejspíše vyskytl problém se SPARQL endointem nebo datasetem."; }
                    sendMail($mail[1],"Požadavek byl zpracován",$message);
                    pisLog($path,"INFO - SENT");
                }else{ // zapis, ze nikdo email nechtel
                    pisLog($path,"INFO - NO RECEIVER");    
                }
            }
        }
    }    
?>
