<?php
    function pisLog($file,$content){ // loguje do souboru
        $content = date('Y-m-d H:i:s')."|".$content; // casova znacka
        $myfile = file_put_contents(dirname(__FILE__)."$file", $content.PHP_EOL , FILE_APPEND | LOCK_EX);
    }
    function lastLine($file){ // vraci posledni radek souboru
        $line = ''; $f = fopen(dirname(__FILE__)."$file", 'r'); $cursor = -1;
        
        fseek($f, $cursor, SEEK_END);
        $char = fgetc($f);
        
        while ($char === "\n" || $char === "\r") {
            fseek($f, $cursor--, SEEK_END);
            $char = fgetc($f);
        }
        
        while ($char !== false && $char !== "\n" && $char !== "\r") {
            $line = $char.$line;
            fseek($f, $cursor--, SEEK_END);
            $char = fgetc($f);
        }
        return $line;
    }
    function sendMail($mail,$sub,$text){
        $to = $mail;
        $subject = $sub; 
        $message = $text;
        // html mail
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type:text/html;charset=UTF-8';
        // headery navic
        //$headers[] = 'To: Mary <mary@example.com>, Kelly <kelly@example.com>';
        $headers[] = 'From: lodsight <lodsight@vse.cz>';
        //$headers[] = 'Cc: birthdayarchive@example.com';
        //$headers[] = 'Bcc: birthdaycheck@example.com'; 
        mail($to, $subject, $message, implode("\r\n", $headers)); // odesli mail, odradkuj headers
    }
?>