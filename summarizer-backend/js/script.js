autosize($('textarea'));

$(function() {
    $('[data-toggle="popover"]').popover({
        trigger: 'focus'
    });  
    
    $('#reqForm').submit(function (e) {
        
        dialog = $( "#dialog-confirm" ).dialog({
            closeOnEscape: true,
            autoOpen: false,
            resizable: false,
            height: "auto",
            width: 450,
            modal: true,
            buttons: {
                "Odeslat požadavek": function() {
                    $('.cover').show();
                    var n=0;
                    var line=$('#endpoints').val().split('\n');
                    $.each(line, function(){
                        n++;
                        e.preventDefault();
                    });    
                    if(n>10){
                        $('.cover').hide();
                        $('#hlaska').addClass("alert-danger"); $('#hlaska').html("Prosím, snižte svůj požadavek pouze na 10 endpointů!"); $('#hlaska').show();
                        e.preventDefault(); 
                    }else{
                        sendData(); 
                    } 
                    $(this).dialog("close");
                },
                "Vyplnit e-mail": function() {
                    $(this).dialog("close");
                    $('#email').focus();
                },
                "Zrušit": function() {
                    $(this).dialog("close");
                }
            },
            open: function(event, ui) {
                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            }
        });
        
        $('#hlaska').hide(); $('#hlaska').removeClass("alert-success"); $('#hlaska').removeClass("alert-danger"); $('.cover').show(); // smaz hlasku z formulare
        if($('#email').val()=='' && $('#endpoints').val()==''){ // vsechno empty
            $('#email').addClass('empty'); $('#endpoints').addClass('empty');
            $('#hlaska').addClass("alert-danger"); $('#hlaska').html("Pro úspěšné odeslání formuláře je třeba vyplnit alespoň jeden endpoint!"); $('#hlaska').show();
            $('.cover').hide();
            e.preventDefault();    
        }else if($('#email').val()=='' && $('#endpoints').val()!=''){ // email empty, endpointy ok
            $('#email').addClass('empty'); $('#endpoints').removeClass('empty');
            dialog.dialog("open");
            $('.cover').hide();
            e.preventDefault();    
        }else if($('#email').val()!='' && $('#endpoints').val()==''){   // email ok, endpointy empty
            $('#email').removeClass('empty'); $('#endpoints').addClass('empty');   
            $('#hlaska').addClass("alert-danger"); $('#hlaska').html("Pro úspěšné odeslání formuláře je třeba vyplnit alespoň jeden endpoint!");
            $('.cover').hide();
            e.preventDefault();
        }else{
            $('#email').removeClass('empty'); $('#endpoints').removeClass('empty');
            var n=0;
            var line=$('#endpoints').val().split('\n');
            $.each(line, function(){
                n++;
                e.preventDefault();
            });    
            if(n>10){ // maximalne 10 endpointu naraz
                $('.cover').hide();
                $('#hlaska').addClass("alert-danger"); $('#hlaska').html("Prosím, snižte svůj požadavek pouze na 10 endpointů!"); $('#hlaska').show();
                e.preventDefault();
            }else{
                sendData(); 
            }   
        }
    });

    // AJAX defaults pro odchycení chyb
    $.ajaxSetup({
        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) alert('Not connected.\n Verify Network.');
            else if (jqXHR.status == 404) alert('Requested page not found. [404]');
            else if (jqXHR.status == 500) alert('Internal Server Error [500].');
            else if (exception === 'parsererror') alert('Requested JSON parse failed.');
            else if (exception === 'timeout') alert('Time out error.');
            else if (exception === 'abort') alert('Ajax request aborted.');
            else alert('Uncaught Error.\n' + jqXHR.responseText);
        },
        complete: function(data){ // vypis chybu, kdyz response obsahuje 'error'
            var reg = /error/i;
            if (reg.test(data.responseText)) alert(data.responseText);
        }
    });
});

function sendData(){
    $.ajax({
        type: 'POST',
        url: 'lodsum.php',
        data: $('#reqForm').serialize(),
        success: function(data)	{ 
            if(data.code=="ok"){ // ok hlaseni
                $('.cover').hide();
                $('#hlaska').addClass("alert-success"); $('#hlaska').html(data.message); $('#hlaska').show();    
            }
            if(data.code=="err"){ // error hlaseni
                $('.cover').hide();
                $('#hlaska').addClass("alert-danger"); $('#hlaska').html(data.message); $('#hlaska').show();
            }
        },
        dataType: 'json'
    });
    return false;
}