
 // var URLSERVER = "http://192.168.0.185/JURUA/LIVRO/jurua.livros.php/public_html/";
 var URLSERVER = "http://otima.otimagrafica.com.br/";
 var URLUPDATE = URLSERVER+"index/atualiza";
 var URLIMAGES =URLSERVER+"uploads/";//shop_images/
 var PATHAPP ="OTIMABT/";


 var USER;

 var isAndroid = false;
 var isWIN = false;
 var isIOS = false;

// global variables
var db = null;
var dbName = 'baixatiragemDBv1';




// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
 console.log('Error: ' + error.message + ' code: ' + error.code);
 
}

// this is called when a successful transaction happens
function successCallBack() {
 console.log("Tabelas OK");
 
}

function nullHandler(){};

function loadDb(){  
  // console.log(JSON.stringify(db));
  if (db == null) {
    db = window.sqlitePlugin.openDatabase({name: dbName});  
  }
}
function verificaDB(){
  alert('verificaDB');
  showLoading();
  loadDb();
  db.transaction(function(tx) {



    tx.executeSql("SELECT * from app_versao ;",[], function(tx, res) {
      console.log(" qtde recentes: " + res.rows.length);
      if (res.rows.length>0) {
        updateDb(res.rows.item(0).versao);
      }else{
        updateDb(0);              
      }               
    },function(){
      updateDb(0);
    });
  },function(){
    updateDb(0);
  });

}
function loga(texto){
console.log(texto);  
}
function updateDb(versao){
loga('update');
  $.get(URLUPDATE+"?versao="+versao,function(data){
    loga('retorno data'+ data);
    loadDb();
    var arrayUpdate = data.split("##-##");
    var qtdeItens = arrayUpdate.length;
    db.transaction(function(tx){

      for(var i = 0; i < (qtdeItens-1); i++){
        var query = arrayUpdate[i];
        query = query.split("\n").join("");
        query = query.split("\r").join("");
        query = query.split("\\\"").join("'");
        query = query.split("\\'").join("\'");
        tx.executeSql(query, [], function(tx,res) {
          console.log("rowsAffected: " + res.rowsAffected + " ");
        },function(){
          console.log('faio a query |'+query+'|');
        });

      }
    }, function(e) {
      console.log("Return: " + e.message);
      closeLoading();
    });

    closeLoading();
  }).error(function(){
    closeLoading();
  });

}


function enviaLogin(){

  if (trim($('#email').val()) == '') {

    navigator.notification.alert(
     'Preencha com o email',  // message
      function(){},         // callback
      'Atenção',            // title
      'Ok'                  // buttonName
      );
  }else
  if (trim($('#senha').val()) == '') {

    navigator.notification.alert(
       'Preencha com a sua senha',  // message
        function(){},         // callback
        'Atenção',            // title
        'Ok'                  // buttonName
        );
  }else{
            // alert('logou');
            doLogin($('#email').val(),$('#senha').val(),$('#device_name').val())            

          }


          return false;
        }


        function closeLoading(){
          $('.overlay').remove();
        }
        function showLoading(){
          if($('.overlay').length>0){

          }else{
            $overlay = $('<div class="overlay"></div>');
            $loader = $('<div class="loader"><span>Carregando...</span></div>');
            var opts = {
                lines: 17, // The number of lines to draw
                length: 7, // The length of each line
                width: 2, // The line thickness
                radius: 15, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1, // Rounds per second
                trail: 94, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: '30%', // Top position relative to parent
                left: '50%' // Left position relative to parent
              };

              var spinner = new Spinner(opts).spin();
              $loader.prepend(spinner.el);
              $overlay.append($loader);
              $('body').prepend($overlay);

            }
          }


var largura = 308+20;
$(document).ready(function(){

  $('.box').css('height',($(document).height()-135-23 )+'px');
  $('.scroller').each(function(){
    $ul = $(this).find('ul');
    $qtdeItens = $ul.find('li').length;
    $ul.css('width',($qtdeItens*largura)+'px');
  });
  $('.tab-nav li a').click(function(e){
    e.preventDefault();
    $this = $(this);
    $indice = $this.closest('li').index();
    $indice++;
    console.log($indice );
    $('.tabs .tab-content.active').removeClass('active');
    $('.tabs .contents .tab-content:nth-child('+$indice+')').addClass('active');
    // $href = $this.attr('href');
    // $href = $href.replace('#','');
  });
});





