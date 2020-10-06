var SAVING = false;
function saveOrcamento(orcamento){
	if(!SAVING){
		SAVING = true;
	window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,  function (fileSystem) {
		fileSystem.root.getFile(PATHAPP+ORCAMENTOFILE, null, function (fileEntry) {
			fileEntry.file(function (file) {
				// console.log('entrou');
				var reader = new FileReader();
				reader.onloadend = function(evt) {
					// console.log('orcamentos aberto: '+evt.target.result);
					if (trim(evt.target.result) =="") {
						createAndAddOrcamento(orcamento);
					}else{
						console.log('salva');
						
						fileEntry.createWriter(function (writer) {							
							$json = JSON.stringify(orcamento);
							writer.onwriteend = function(evt) {
								ORCAMENTO = orcamento;
								SAVING = false;
								console.log('orcamento salvo!'+ $json);
								// writer.truncate($json.length);   
								// writer.onwriteend = function(evt) {								
								// 		// console.log('pagina salva! ' + JSON.stringify(pagina));
								
								// 	}
							}
							writer.write($json);
						}, function(){console.log('ERRO novo2');SAVING = false;});
					}



				};
				reader.readAsText(file);
				}, function(){console.log('ERRO novo3');SAVING = false;});//file entry
		}, function(evt){
			console.log('Nunca tinha salvo um orcamento antes ');
			createAndAddOrcamento(orcamento);
		});//get file
	}, function(){console.log('ERRO novo22');SAVING = false;});//file system

	}
}

function loadOrcamento(){

// console.log('getPage');
window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,  function (fileSystem) {
	fileSystem.root.getFile(PATHAPP+ORCAMENTOFILE, null, function (fileEntry) {
		fileEntry.file(function (file) {
				// console.log('entrou');
				var reader = new FileReader();
				reader.onloadend = function(evt) {
					loga('load '+evt.target.result);

					if (trim(evt.target.result.length)>0) {
						var $orc = $.parseJSON(evt.target.result);
						ORCAMENTO = $orc;
						// loga("ORCAMENTO: "+ORCAMENTO);
						if (typeof orcamentoLoaded == 'function') { orcamentoLoaded(); }
					}else{	
						

					}
					
					
				}
				reader.readAsText(file);
				}, function(){console.log('ERRO novo1');});//file entry
	}, function(evt){
		ORCAMENTO = new Object();;
		console.log('não tenho orcamento');			
		});//get file
}, function(){
	ORCAMENTO = new Object();;
	console.log('Erro orcamento');			
	});//file system

}


function removeOrcamento(backtohome){

	if (backtohome) {
		navigator.notification.confirm(
			"Deseja retornar a tela de seleção produtos e iniciar um novo orçamento?",
			function (b){
				if(b == 1){
					window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,  function (fileSystem) {
						fileSystem.root.getFile(PATHAPP+ORCAMENTOFILE, null, function (fileEntry) {
							fileEntry.remove(function(){
								ORCAMENTO = null;
								
								document.location.href='produtos.html';
								
							}, function(){console.log('erro ao remover user files.')});
						}, fail);
						
						
					}, fail);
				}
				else {
					loga("não");
				}
			}, 
			'Atenção',
			["Sim", "Não"]
			);
	}else{

		window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,  function (fileSystem) {
			fileSystem.root.getFile(PATHAPP+ORCAMENTOFILE, null, function (fileEntry) {
				fileEntry.remove(function(){
					ORCAMENTO = null;
					
				}, function(){console.log('erro ao remover user files.')});
			}, fail);
			
			
		}, fail);
	}




}
function createAndAddOrcamento(orcamento){
	loga('createAndAddOrcamento');
	SAVING = false;
	window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
		target_directory = fileSystem.root.nativeURL; 
		fileSystem.root.getFile(PATHAPP+ORCAMENTOFILE, {create: true, exclusive: false}, function (fileEntry) {
			fileEntry.createWriter(function (writer) {
				// $array = [];
				// $array[0] = orcamento;
				$json = JSON.stringify(orcamento);
				writer.onwriteend = function(evt) {
					ORCAMENTO = orcamento;

					console.log('orcamentos json criado e salvo!');
					// writer.truncate($json.length);   
					// writer.onwriteend = function(evt) {								
					// 	// console.log('pagina salva! ' + JSON.stringify(pagina));
					
					// }
				}
				writer.write($json);
			}, fail);
		}, fail);
	}, fail);
}

