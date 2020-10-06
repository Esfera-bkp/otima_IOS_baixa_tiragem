function saveOrcamento(favorito){

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,  function (fileSystem) {
		fileSystem.root.getFile(PATHAPP+IDLIVRO+FAVOURITES_PLIST, null, function (fileEntry) {
			fileEntry.file(function (file) {
				// console.log('entrou');
				var reader = new FileReader();
				reader.onloadend = function(evt) {
					console.log('favoritos aberto: '+evt.target.result);
					if (trim(evt.target.result) =="") {
						createAndAddFavorito(favorito);
					}else{
						console.log('adiciona');
						$favs = $.parseJSON(evt.target.result);
						$favs[$favs.length] = favorito;


						fileEntry.createWriter(function (writer) {							
							$json = JSON.stringify($favs);
							writer.onwriteend = function(evt) {
								writer.truncate($json.length);   
								writer.onwriteend = function(evt) {								
										// console.log('pagina salva! ' + JSON.stringify(pagina));
										console.log('favorito adicionado!');
										
									}
								}
								writer.write($json);
							}, fail);
					}



				};
				reader.readAsText(file);
				}, fail);//file entry
		}, function(evt){
			console.log('Nunca tinha salvo um favorito antes ');
			createAndAddFavorito(favorito);
		});//get file
	}, fail);//file system

}

function loadFavoritos(){

// console.log('getPage');
window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,  function (fileSystem) {
	fileSystem.root.getFile(PATHAPP+IDLIVRO+FAVOURITES_PLIST, null, function (fileEntry) {
		fileEntry.file(function (file) {
				// console.log('entrou');
				var reader = new FileReader();
				reader.onloadend = function(evt) {
						 // console.log('loadFavoritos '+evt.target.result);

						 if (trim(evt.target.result.length)>0) {
						 	var $favs = $.parseJSON(evt.target.result);
							// console.log($favs);
							for(var x = 0 ; x < $favs.length ; x++){
								console.log("div#" + $favs[x].id);
								$("div#" + $favs[x].id).addClass("favourite");
								$("div#" + $favs[x].id).addClass($favs[x].classe);
								
							}
						}else{	
							

						}
						
						
					}
					reader.readAsText(file);
				}, fail);//file entry
	}, function(evt){
		// console.log('não tenho favoritos');			
		});//get file
	}, fail);//file system

}

function perguntaFavorito(favorito_id){
	var codigo = 	favorito_id.replace('sumario_','');
	// console.log($('#fav_'+codigo+'').text());
	trecho = $('#fav_'+codigo+'').text();
	navigator.notification.confirm(
		"Deseja excluir o favorito\r\n \""+trecho+"\" ?",
		function (b){
			if(b == 1){
				console.log("sim");
				removeFavorito(favorito_id,true);
			}
			else {
				console.log("não");
			}
		}, 
		'Atenção',
		["Sim", "Não"]
	);
	
}
function removeFavorito(favorito_id,favoritepage){

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,  function (fileSystem) {
		fileSystem.root.getFile(PATHAPP+IDLIVRO+FAVOURITES_PLIST, null, function (fileEntry) {
			fileEntry.file(function (file) {
				// console.log('entrou');
				var reader = new FileReader();
				reader.onloadend = function(evt) {
					console.log('favoritos aberto: '+evt.target.result);

					var $favs = $.parseJSON(evt.target.result);
					for(var x = 0 ; x < $favs.length ; x++){
						if ($favs[x].id==favorito_id) {
							$favs.splice(x, 1);								
							break;
						}
					}

					fileEntry.createWriter(function (writer) {							
						$json = JSON.stringify($favs);
						writer.onwriteend = function(evt) {
							writer.truncate($json.length);   
							writer.onwriteend = function(evt) {								
									// console.log('pagina salva! ' + JSON.stringify(pagina));
									console.log('favorito removido!');
									if (favoritepage) {
										abreFavoritos();									
									}
								}
							}
							writer.write($json);
						}, fail);


				};
				reader.readAsText(file);
				}, fail);//file entry
		}, function(evt){
			console.log('Nunca tinha salvo um favorito antes ');
			createAndAddFavorito(favorito);
		});//get file
	}, fail);//file system




}
function createAndAddFavorito(orcamento){

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
		target_directory = fileSystem.root.nativeURL; 
		fileSystem.root.getFile(PATHAPP+ORCAMENTOFILE, {create: true, exclusive: false}, function (fileEntry) {
			fileEntry.createWriter(function (writer) {
				$array = [];
				$array[0] = orcamento;
				$json = JSON.stringify($array);
				writer.onwriteend = function(evt) {
					

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

