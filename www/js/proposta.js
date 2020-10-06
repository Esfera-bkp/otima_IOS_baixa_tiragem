function enviaProposta2(){
	ORCAMENTO = {"descricao_texto" : "descricao_texto","telefone_cliente":"telefone_cliente" ,"contato_cliente":"contato_cliente" ,"email_cliente":"email_cliente" ,"representante":"representante nome" ,"login":"login nome" ,"produto_id":"3","produto_nome":"Caneta Importada","produto_tipo_id":"3","produto_tipo_nome":"Customiza\u00e7\u00e3o Simples","produto_tipo_modelo_cor_id":"cor4","produto_tipo_modelo_cor_nome":"corBranca","produto_tipo_modelo_id":"3","produto_tipo_modelo_nome":"DEMA","produto_tipo_modelo_qtde_subprodutos":"0","customizacoes":["","","",{"relacionamento_id":"3","customizacao_id":"1","customizacao_nome":"Personaliza\u00e7\u00e3o no Clip da Caneta","customizacao_opcao_id":"1","customizacao_opcao_nome":"customizacao_opcao_nome"},{"relacionamento_id":"4","customizacao_id":"3","customizacao_nome":"Personaliza\u00e7\u00e3o no Corpo da Caneta","customizacao_opcao_id":"0","customizacao_opcao_nome":""}],"condicao_ajuste":"0","embalagem_id":"3","embalagem_nome":"Saco Pl\u00e1stico + Encarte Padr\u00e3o Prata","estado_id":"1","estado_nome":"Paran\u00e1","regiao_id":"1","frete_id":"3","frete_nome":"Santa Catarina e Paran\u00e1 - Capital","condicao_nome":"21 dias ap\u00f3s o embarque","comissao_valor":"2","comissao_nome":"12%","nome_cliente":"nome_cliente","email_cliente":"email_cliente","prazoembarque":"25 \u00e0 30 dias \u00fateis ap\u00f3s aprova\u00e7\u00e3o final do virtual e\/ou amostras f\u00edsicas","validade":"15 dias \u00fateis","observacao":"öbs"};
	$.post('http://localhost/OTIMA/otima.baixatiragem.php/public_html/app/sendMail.php',{'obj':ORCAMENTO},function(data){
		closeLoading();
		alert(data);
		if (data==1) {
			navigator.notification.alert(
				'Proposta enviada com sucesso!',  
				function(){
					removeOrcamento(false);
					
					redireciona('produtos.html');
				},         
				'Atenção',            
				'Ok'                  
				);
		}else{
			navigator.notification.alert(
				'Erro ao enviar proposta! erro:'+data,  
				function(){

				},         
				'Atenção',            
				'Ok'                  
				);
		}
	}).error(function(){
		navigator.notification.alert(
			'Sem conexao com o servidor.',  
			function(){
				
			},         
			'Atenção',            
			'Ok'                  
			);
		closeLoading();
	});
}
function enviaProposta(){
	loga(URLSEND);
	showLoading();

	
	// console.log("BEFEORE||");
	// console.log(ORCAMENTO);

	ORCAMENTO.nome_cliente = $('#nomecliente').val();
	ORCAMENTO.email_cliente = $('#emailcliente').val();
	ORCAMENTO.telefone_cliente = $('#telefonecliente').val();
	
	ORCAMENTO.celular = $('#telefonecliente').val();
	ORCAMENTO.contato_cliente = $('#contatocliente').val();
	ORCAMENTO.prazoembarque = $('#prazoembarque').val();
	ORCAMENTO.validade = $('#validade').val();
	ORCAMENTO.observacao = $('#observacao').val();
	
	ORCAMENTO.representante = window.localStorage.getItem('USUARIO_NOME');
	ORCAMENTO.login = window.localStorage.getItem('USUARIO_EMAIL');
	ORCAMENTO.assinatura = window.localStorage.getItem('USUARIO_ASSINATURA');

	ORCAMENTO.versao = VERSAO;
	ORCAMENTO.descricao_texto = window.localStorage.getItem('DESCRICAO');
	ORCAMENTO.foto = window.localStorage.getItem('FOTO');
	ORCAMENTO.texto_icms = window.localStorage.getItem('ICMS');
	

	
	ORCAMENTO.comissao_desconto = $('#inputcomissao').val();
	ORCAMENTO.comissao_nome= $('#inputcomissao').find("option:selected").text();



	ORCAMENTO.tiragens = [];
	var cc=0;
	$('.checks').each(function(){
		if ($(this).is(':checked')) {
			$tr = $(this).closest('tr');
			var objtir = {};
			$qtde2 = $tr.find('.qtde').text().split(' ');
			objtir.tiragem = $qtde2[0];
			objtir.unitario = $tr.find('.valor').text();
			objtir.total = $tr.find('.total').text();
			ORCAMENTO.tiragens.push(objtir);
			loga("ORCAMENTO.tiragens[cc].tiragem:"+objtir);
			
		}
	});
	saveOrcamento(ORCAMENTO);
	loga(ORCAMENTO.tiragens);
	console.log("AFTER||");
	$ORC = base64_encode(JSON.stringify(ORCAMENTO));


	$.ajax({
		data: {'obj':$ORC},
		type: "POST",
		url: URLSEND,
		timeout: 20000,
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
        // dataType: 'html',
        success: function(data){
        	closeLoading();
        	console.log(data);
        	if (data==1) {
        		navigator.notification.alert(
        			'Proposta enviada com sucesso!',  
        			function(){
        				removeOrcamento(true);
						// window.location.href = 'produtos.html';
					},         
					'Atenção',            
					'Ok'                  
					);
        	}else{
        		navigator.notification.alert(
        			'Erro ao enviar proposta! erro:'+data,  
        			function(){

        			},         
        			'Atenção',            
        			'Ok'                  
        			);
        	}
        }
    });
	// $.post(URLSEND,{'obj':ORCAMENTO},function(data){
		// 	closeLoading();
		// 	console.log(data);
		// 	if (data==1) {
		// 		navigator.notification.alert(
		// 			'Proposta enviada com sucesso!',  
		// 			function(){
		// 				removeOrcamento(true);
		// 				// window.location.href = 'produtos.html';
		// 			},         
		// 			'Atenção',            
		// 			'Ok'                  
		// 			);
		// 	}else{
		// 		navigator.notification.alert(
		// 			'Erro ao enviar proposta! erro:'+data,  
		// 			function(){

		// 			},         
		// 			'Atenção',            
		// 			'Ok'                  
		// 			);
		// 	}
		// }).error(function(){
		// 	navigator.notification.alert(
		// 		'Sem conexao com o servidor.',  
		// 		function(){

		// 		},         
		// 		'Atenção',            
		// 		'Ok'                  
		// 		);
		// 	closeLoading();
		// });
	}

	function montaFotoPreview(produto_tipo_modelo_cor_ids){
	// produto_tipo_modelo_cor_ids = produto_tipo_modelo_cor_ids.replace('cor','');
	// loga('produto_tipo_modelo_cor_ids : '+produto_tipo_modelo_cor_ids);
	loadDb();
	db.transaction(function(tx) {
		

		tx.executeSql("SELECT * from app_produtos_tipos_modelos_cores a where a.id in("+produto_tipo_modelo_cor_ids+") order by a.order_id;",[], function(tx, res) {
			
			
			if (res.rows.length>0) {
				
				for (var i = 0; i < res.rows.length; i++) {
					var classe="";
					item = res.rows.item(i);			
					loga('fotos/'+item.image);
					$('#overlay .conteudo .foto_'+item.id).append($('<img src="fotos/'+item.image+'"  />'));

					if(ORCAMENTO.compartimentos.length > 0){

						for(var x = 0; x < ORCAMENTO.compartimentos.length; x ++){

							var item = ORCAMENTO.compartimentos[x];

							for( var i = 0 ; i < item.opcoes.length ; i++){
								var opcao = item.opcoes[i];						
								if(opcao.cor_id==produto_tipo_modelo_cor_ids){
									ORCAMENTO.compartimentos[x].opcoes[i].imagem = item.image;
								}


							}
						}
					}
				}
				if(ORCAMENTO.compartimentos.length > 0){
					saveOrcamento(ORCAMENTO);
				}
				
				
			}

		},function(){

		});
	},function(){});
}
function preVisualizar(){
	$overlay = $('<div id="overlay"><div class="conteudo"></div></div>');
	$('body').prepend($overlay);

	var modelos_ids = '';
	var html = "<a href=\"javascript:closeOverlay();\" class=\"closeoverlay\">X</a><h1 class='previsualizar'>"+ORCAMENTO.produto_nome+' > '+ORCAMENTO.produto_tipo_nome+' > '+ORCAMENTO.produto_tipo_modelo_nome+' > '+ORCAMENTO.produto_tipo_modelo_cor_nome+"</h1>";
	html+="<ul>";
	html+="<li>"+window.localStorage.getItem('DESCRICAO')+"</li>";
	if(ORCAMENTO.customizacoes.length > 0){
		html+="<li><span class='subtitulo'>Customizações</span></li>";
		for(var i = 0; i < ORCAMENTO.customizacoes.length; i ++){
			if (ORCAMENTO.customizacoes[i]!=null) {
				if(trim(ORCAMENTO.customizacoes[i].customizacao_opcao_nome) != ""){
					html+="<li><b>"+ORCAMENTO.customizacoes[i].customizacao_nome+":</b> "+ORCAMENTO.customizacoes[i].customizacao_opcao_nome+"</li>";
				}


			}
		}
	}
	console.log('storage: fotos/'+window.localStorage.getItem('FOTO'))
	html+="<div class='fotos foto_"+ORCAMENTO.produto_tipo_modelo_cor_id+"'><img src='fotos/"+window.localStorage.getItem('FOTO')+"'/></div>";
	montaFotoPreview(ORCAMENTO.produto_tipo_modelo_cor_id);

	if(ORCAMENTO.produto_tipo_modelo_qtde_subprodutos == 0){

		if (typeof(ORCAMENTO.caneta.nome) != "undefined") {

			html+="<li><span class='subtitulo'>Caneta</span></li>";

			html+="<li> "+ORCAMENTO.caneta.nome+"</li>";
			html+="<li><b>Cor: </b> "+ORCAMENTO.caneta.cor+"</li>";
			if(ORCAMENTO.caneta.customizacoes.length > 0){

				for(var i = 0; i < ORCAMENTO.caneta.customizacoes.length; i ++){
					if (ORCAMENTO.caneta.customizacoes[i]!=null) {
						if(trim(ORCAMENTO.caneta.customizacoes[i].customizacao_opcao_nome) != ""){
							html+="<li><b>"+ORCAMENTO.caneta.customizacoes[i].customizacao_nome+":</b> "+ORCAMENTO.caneta.customizacoes[i].customizacao_opcao_nome+"</li>";
						}

					}
				}
			}
		}
	}

	if(ORCAMENTO.compartimentos.length > 0){
			// loga('entaosdaiosdoasidoasidoasdias');

			

			for(var x = 0; x < ORCAMENTO.compartimentos.length; x ++){
				loga('x:'+x);
				var item = ORCAMENTO.compartimentos[x];
				if(trim(item.compartimento_nome) != 'Caneta'){


					html+="<li><span class='subtitulo'>"+item.compartimento_nome+"</span></li>";
					for( var i = 0 ; i < item.opcoes.length ; i++){
						var opcao = item.opcoes[i];
						if(modelos_ids!=''){
							modelos_ids+=",";
						}
						modelos_ids+=opcao.cor_id;
						html+="<li><div class='fotos foto_"+opcao.cor_id+"'></div><h1 class='previsualizar'>"+(opcao.produto_modelo_nome==''? opcao.produto_caneta_nome : opcao.produto_modelo_nome)+"</h1></li>";
						if(opcao.descricao!=''){
							html+="<li>"+opcao.descricao+"</li>";
						}
						if(opcao.customizacoes.length > 0){
							html+="<li><span class='subtitulo'>Customizações</span></li>";
							for(var y = 0; y < opcao.customizacoes.length; y ++){
								if (opcao.customizacoes[y]!=null) {
									if(trim(opcao.customizacoes[y].customizacao_opcao_nome) !=""){
										html+="<li><b>"+opcao.customizacoes[y].customizacao_nome+":</b> "+opcao.customizacoes[y].customizacao_opcao_nome+"</li>";
									}


								}
							}
						}

					}
				}
			}

			




			
		}
		if(ORCAMENTO.produto_tipo_modelo_qtde_subprodutos > 0){
			

			if (ORCAMENTO.subprodutos.length>0) {

				for(var x = 0; x < ORCAMENTO.subprodutos.length; x ++){
					if (ORCAMENTO.subprodutos[x]!=null) {

						html+="<li><h1 class='previsualizar'>"+ORCAMENTO.subprodutos[x].produto_nome+' > '+ORCAMENTO.subprodutos[x].produto_tipo_nome+' > '+ORCAMENTO.subprodutos[x].produto_tipo_modelo_nome+' > '+ORCAMENTO.subprodutos[x].produto_tipo_modelo_cor+"</h1></li>";

						if(ORCAMENTO.subprodutos[x].customizacoes && ORCAMENTO.subprodutos[x].customizacoes.length > 0){
							html+="<li><span class='subtitulo'>Customizações</span></li>";
							for(var i = 0; i < ORCAMENTO.subprodutos[x].customizacoes.length; i ++){
								if (ORCAMENTO.subprodutos[x].customizacoes[i]!=null) {
									if(trim(ORCAMENTO.subprodutos[x].customizacoes[i].customizacao_opcao_nome) !=""){
										html+="<li><b>"+ORCAMENTO.subprodutos[x].customizacoes[i].customizacao_nome+":</b> "+ORCAMENTO.subprodutos[x].customizacoes[i].customizacao_opcao_nome+"</li>";
									}


								}
							}
						}

					}
				}
				
			}




			if (ORCAMENTO.caneta) {
				html+="<li><h1>Caneta "+ORCAMENTO.caneta.nome+"</h1></li>";


				html+="<li><b>Cor: </b> "+ORCAMENTO.caneta.cor+"</li>";
				if(ORCAMENTO.caneta.customizacoes.length > 0){

					for(var i = 0; i < ORCAMENTO.caneta.customizacoes.length; i ++){
						if (ORCAMENTO.caneta.customizacoes[i]!=null) {
							if(trim(ORCAMENTO.caneta.customizacoes[i].customizacao_opcao_nome) !=""){
								html+="<li><b>"+ORCAMENTO.caneta.customizacoes[i].customizacao_nome+":</b> "+ORCAMENTO.caneta.customizacoes[i].customizacao_opcao_nome+"</li>";
							}


						}
					}
				}
			}
		}



		if(ORCAMENTO.embalagem_nome){
			html+="<li><span class='subtitulo'>Embalagem</span></li>";		
			html+="<li>"+ORCAMENTO.embalagem_nome+"</li>";
		}
		if($('.checks').length > 0){
			html+="<li><span class='subtitulo'>Preços</span></li>";		
			html+="<li><table class='tabela'  cellpadding=0 cellspacing=0>"+
			"<thead>"+
			"<tr>"+
			"<th >Tiragem</th>"+
			"<th >Unitário</th>"+
			"<th  nowrap='nowrap' >Valor total</th>"+
			"</tr>"+
			"</thead>"+
			"<tbody>";		
			var cc=0;
			$('.checks').each(function(){
				if ($(this).is(':checked')) {
					$tr = $(this).closest('tr');				
					html+="<tr><td>"+$tr.find('.qtde').text()+"</td><td>"+$tr.find('.valor').text()+"</td><td>"+$tr.find('.total').text()+"</td></tr>";
					cc++;
				}
			});
			html+="</tbody></table></li>";		
		}

		html+="<li><b>"+window.localStorage.getItem('ICMS')+"</b></li>";		

		if(ORCAMENTO.frete_nome){				
			html+="<li><b>Transporte</b>"+ORCAMENTO.frete_nome+" - <b>Prazo: </b>"+ORCAMENTO.frete_prazo+"</li>";
		}
		if(ORCAMENTO.condicao_nome){				
			html+="<li><b>Condição de pagamento</b>"+ORCAMENTO.condicao_nome+"</li>";
		}

		html+="</ul>";

		loga("HTML->"+html);
		$('#overlay .conteudo').html(html);
		if(modelos_ids!=''){						
			montaFotoPreview(modelos_ids);
		}

		



	}

	function closeOverlay(){
		$('#overlay').remove();
	}