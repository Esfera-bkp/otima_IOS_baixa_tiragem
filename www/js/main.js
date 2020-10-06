

// var URLSERVER = "http://192.168.100.7/OTIMA/otima.baixatiragem.php/public_html/";
var URLSERVER = "http://otima.otimagrafica.com.br/";
var URLUPDATE = URLSERVER + "index/atualiza";
var URLSEND = URLSERVER + "app/sendMail.php";
var URLIMAGES = URLSERVER + "uploads/";//shop_images/
var PATHAPP = "OTIMABT/";
var VERSAO = "1";
var PROD = true;
var ORCAMENTOFILE = "orcamento.json";
var USER_PLIST = "user.json";

var USER;

var isAndroid = false;
var isWIN = false;
var isIOS = false;

// global variables
var db = null;
var dbName = 'baixatiragemDBv2';

var target_directory;

var ORCAMENTO = null;

var CONDICAOVENDAFUTURA = 17;
var CONDICAO14DIAS = 3;
function loadDb() {
  // console.log(JSON.stringify(db));
  if (db == null) {
    db = window.sqlitePlugin.openDatabase({ name: dbName, location: 'default' });
  }
}
function redireciona(url) {
  setTimeout(
    function () {

      window.location.href = url;
    }, 800);
}
function verificaDB() {
  loga('aqui');
  showLoading();
  loadDb();
  db.transaction(function (tx) {



    tx.executeSql("SELECT * from app_versao ;", [], function (tx, res) {
      console.log(" qtde recentes: " + res.rows.length);
      if (res.rows.length > 0) {
        updateDb(res.rows.item(0).versao);
      } else {

        updateDb(1);
      }
    }, function () {

    });
  }, function () {

    updateDb(1);
  });


}
function loadAjuste() {
  loadDb();
  db.transaction(function (tx) {



    tx.executeSql("SELECT * from app_ajustes  ;", [], function (tx, res) {
      console.log(" qtde porcentagem: " + res.rows.length);
      if (res.rows.length > 0) {
        // console.log(" a porcentagem: " + res.rows.item(0).porcentagem);
        // alert(res.rows.item(0).porcentagem);
        window.localStorage.setItem('AJUSTE', res.rows.item(0).porcentagem);
        // var ajuste = window.localStorage.getItem('AJUSTE');
        // alert(ajuste);

      } else {
        window.localStorage.setItem('AJUSTE', 0);

      }
    }, function () {

    });
  }, function () {


  });
}
function loga(texto) {
  console.log(texto);
}
function updateDb(versao) {
  loga(URLUPDATE + "?versao=" + versao);
  $.get(URLUPDATE + "?versao=" + versao, function (data) {
    if (data == '-1') {
      loga('ja esta atualizado');
      loadAjuste();
      closeLoading();
    } else {
      loga('nao esta atualizado');
      loadDb();
      var arrayUpdate = data.split("##-##");
      var qtdeItens = arrayUpdate.length;
      db.transaction(function (tx) {

        for (var i = 0; i < (qtdeItens - 1); i++) {
          var query = arrayUpdate[i];
          query = query.split("\n").join("");
          query = query.split("\r").join("");
          query = query.split("\\\"").join("'");
          query = query.split("\\'").join("\'");

          loga(query);
          tx.executeSql(query, [], function (tx, res) {
            loga("rowsAffected: " + res.rowsAffected + " ");
          }, function () {
            loga('faio a query |' + query + '|');
          });

        }
        loadAjuste();
        closeLoading();
        // tabelasImagens();
      }, function (e) {
        loga("Return: " + e.message);
        loadAjuste();
        closeLoading();
      });

    }

  }).error(function () {
    closeLoading();
  });

}


function enviaLogin() {

  if (trim($('#email').val()) == '') {

    navigator.notification.alert(
      'Preencha com o email',
      function () { },
      'Atenção',
      'Ok'
    );
  } else
    if (trim($('#senha').val()) == '') {

      navigator.notification.alert(
        'Preencha com a sua senha',
        function () { },
        'Atenção',
        'Ok'
      );
    } else {
      var email = $('#email').val();
      var senha = md5($('#senha').val());
      showLoading();
      loadDb();

      db.transaction(function (tx) {

        tx.executeSql("SELECT * from app_usuarios where email='" + email + "' and senha = '" + senha + "' and libera = 1 ;", [], function (tx, res) {
          console.log(" qtde usuarios achados: " + res.rows.length);
          if (res.rows.length == 1) {
            loga(res.rows.item(0).email);
            window.localStorage.setItem('USUARIO_ID', res.rows.item(0).id);
            window.localStorage.setItem('USUARIO_EMAIL', res.rows.item(0).email);
            window.localStorage.setItem('USUARIO_ASSINATURA', nl2br(res.rows.item(0).assinatura));
            window.localStorage.setItem('USUARIO_MULTIPLICADOR', res.rows.item(0).multiplicador);
            window.localStorage.setItem('USUARIO_NOME', res.rows.item(0).nome);
            removeOrcamento(false);
            console.log($('#email').val());
            console.log("USUARIO_MULTIPLICADOR:" + res.rows.item(0).multiplicador);
            console.log({ 'email': $('#email').val(), 'senha': $('#senha').val() });
            saveUser({ 'email': $('#email').val(), 'senha': $('#senha').val() });

            redireciona('produtos.html');
          } else {

            navigator.notification.alert(
              'Usuário e/ou senha incorretos ',
              function () { },
              'Atenção',
              'Ok'
            );

            closeLoading();
          }
        }, function () {

        }
        );
      }, function () {
        closeLoading();
      }
      );


    }


  return false;
}
var qtde_images = 0;
var qtteVerify = 0;
function tabelasImagens() {
  loadDb();
  db.transaction(function (tx) {



    tx.executeSql("SELECT * from app_produtos ;", [], function (tx, res) {
      console.log(" qtde app_produtos: " + res.rows.length);
      qtde_images += res.rows.length;
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          item = res.rows.item(i);
          // loga(item.image);


          verificaImagem(PATHAPP + item.image, URLIMAGES + "produtos/" + item.image);
        };
      } else
        closeLoading();

    }, function () {
      baixouimagem();
    });
    tx.executeSql("SELECT * from app_produtos_tipos ;", [], function (tx, res) {
      console.log(" qtde app_produtos_tipos: " + res.rows.length);
      qtde_images += res.rows.length;
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          item = res.rows.item(i);
          // loga(item.image);

          verificaImagem(PATHAPP + item.image, URLIMAGES + "produtos-tipos/" + item.image);
        };
      } else
        closeLoading();

    }, function () {
      baixouimagem();
    });
    tx.executeSql("SELECT * from app_produtos_tipos_modelos ;", [], function (tx, res) {
      console.log(" qtde app_produtos_tipos_modelos: " + res.rows.length);
      qtde_images += res.rows.length;
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          item = res.rows.item(i);
          // loga(item.image);

          verificaImagem(PATHAPP + item.image, URLIMAGES + "produtos-tipos-modelos/" + item.image);
        };
      } else
        closeLoading();

    }, function () {
      baixouimagem();
    });
    tx.executeSql("SELECT * from app_produtos_tipos_modelos_cores ;", [], function (tx, res) {
      console.log(" qtde app_produtos_tipos_modelos_cores: " + res.rows.length);
      qtde_images += res.rows.length;
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          item = res.rows.item(i);
          // loga(item.image);

          verificaImagem(PATHAPP + item.image, URLIMAGES + "produtos-tipos-modelos-cores/" + item.image);
        };
      } else
        closeLoading();

    }, function () {
      baixouimagem();
    });


  }, function () {

    baixouimagem();
  });
}
var counter_images = 0;
function baixouimagem() {
  counter_images++;
  // loga(counter_images +"=="+ qtde_images);
  if (counter_images == qtde_images) {
    closeLoading();
    if (teveerro) {


    }

  };
}
function verificaImagem(fileSource, urldown) {
  window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
    target_directory = fileSystem.root.nativeURL;
    console.log('O Target Directory é: ')
    console.log(target_directory)
    fileSystem.root.getFile(fileSource, { create: true, exclusive: false }, function (entry) {

      entry.file(function (file) {


        var reader = new FileReader();
        reader.onloadend = function (evt) {


          if (evt.target.result != null && file.size == 0) {
            entry.remove(function () { }, fail);
          }


          if (evt.target.result == null || file.size == 0) {


            if (trim(file.name) != 'OTIMABT') {
              //     qtteVerify++;
              // loga('qtteVerify = '+qtteVerify);

              var nametourl = file.name;

              console.log("baixarimagens:|"+nametourl + "|"+file.name);
              if (isWIN) {
                downloadImage(encodeURI(urldown), target_directory + file.name);
              } else {
                downloadImage(encodeURI(urldown), target_directory + PATHAPP + file.name);

              }
            } else {
              baixouimagem();
            }
          } else {


            loga('ja tem')
            baixouimagem();
          }
        };

        reader.readAsDataURL(file);


      }, function () {
        loga('#####ERRO@@@@@')
      });
    }, function (entry) {

      loga('erro')
    });


  });

}
function downloadImage(url, filename) {
  // console.log('downloadImage ' + url);
  // loga('filename ' + filename);
  // loga('target_directory + filename = ' + target_directory + filename);
  try {
    window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function (fs) {


      var ft = new FileTransfer();
      ft.download(
        url,
        filename,
        // target_directory + filename, 
        function (entry) {
          // loga("download complete!:" + entry.fullPath ); //path of the downloaded file 
          baixouimagem();
        },
        function (error) {
          baixouimagem();
          teveerro = true;
          loga("download error source " + error.source);
          loga("download error target " + error.target);
          loga("download error code " + error.code);
          loga("download error http_status " + error.http_status);



        }
      );
    });
  }
  catch (e) {
    baixouimagem();
    loga("cathed error " + JSON.stringify(e));

  }



}

function closeLoading() {
  $('.overlay').remove();
}
function showLoading() {
  if ($('.overlay').length > 0) {

  } else {
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



$(document).ready(function () {

  $('.box').css('height', ($(document).height() - ($(document).height() / 4.1)) + 'px');

  $('.tab-nav li a').click(function (e) {
    e.preventDefault();
    $this = $(this);
    $indice = $this.closest('li').index();
    $indice++;
    // console.log($indice );
    $('.tabs .tab-content.active').removeClass('active');
    $('.tabs .contents .tab-content:nth-child(' + $indice + ')').addClass('active');

    $('.tabs .tab-nav .active').removeClass('active');
    $('.tabs .tab-nav li:nth-child(' + $indice + ')').addClass('active');
    // $href = $this.attr('href');
    // $href = $href.replace('#','');
  });
});


function fail(e) {
  loga('fail');
}


