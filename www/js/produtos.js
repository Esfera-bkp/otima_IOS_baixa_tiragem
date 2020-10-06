function carregaProdutos(){
	

	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT * from app_produtos order by order_id;",[], function(tx, res) {
			loga(" qtde app_produtos view: " + res.rows.length);

			if (res.rows.length>0) {
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					// alert(item.image);

					$obj = $(  '<li>'+
						// '<a href="javascript:openProduto('+item.id+',\''+item.nome+'\');"><img src="'+target_directory+PATHAPP+item.image+'" /></a>'+
						'<a href="javascript:openProduto('+item.id+',\''+item.nome+'\');"><img src="fotos/'+item.image+'" /></a>'+
						'<span class="line"></span>'+
						'<a href="javascript:openProduto('+item.id+',\''+item.nome+'\');">'+item.nome+'</a>'+
						'</li>');
					$('.box .scroller ul').append($obj);


				}
				

				var largura = 308+20;
				$('.scroller').each(function(){
					$ul = $(this).find('ul');
					$qtdeItens = $ul.find('li').length;

					$ul.css('width',($qtdeItens*largura)+'px');
				});

				closeLoading();
			}else
			closeLoading();

		},function(){

		});



	},function(){


	});
}

function openProduto(produto_id,produto_nome){

	ORCAMENTO.produto_id = produto_id;  
	ORCAMENTO.produto_nome = produto_nome;

	saveOrcamento(ORCAMENTO);

	redireciona('produtos_tipos.html');
			
}



function carregaProdutosTipos(produto_id){	
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT * from app_produtos_tipos where produto_id = "+produto_id+" order by order_id;",[], function(tx, res) {
			loga(" qtde app_produtos_tipos view: " + res.rows.length);

			if (res.rows.length>0) {
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);


					$obj = $(  '<li>'+
						// '<a href="javascript:openProdutoTipo('+item.id+',\''+item.nome+'\');"><img src="'+target_directory+PATHAPP+item.image+'" /></a>'+
						'<a href="javascript:openProdutoTipo('+item.id+',\''+item.nome+'\');"><img src="fotos/'+item.image+'" /></a>'+
						'<span class="line"></span>'+
						'<a href="javascript:openProdutoTipo('+item.id+',\''+item.nome+'\');">'+item.nome+'</a>'+
						'</li>');
					$('.box .scroller ul').append($obj);


				}
				

				var largura = 308+20;
				$('.scroller').each(function(){
					$ul = $(this).find('ul');
					$qtdeItens = $ul.find('li').length;

					$ul.css('width',($qtdeItens*largura)+'px');
				});

				closeLoading();
			}else
			closeLoading();

		},function(){

		});
	},function(){
	});
}
function carregaDescricao(modelo_id,subprodutos,qtde_compartimentos){	
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.descricao, c.texto_icms from app_produtos_tipos_modelos a inner join app_produtos_tipos b on b.id = a.tipo_id inner join app_produtos c on b.produto_id = c.id where a.id = "+modelo_id+";",[], function(tx, res) {
			loga(" pegando descricao: " + res.rows.length);

			if (res.rows.length>0) {
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					window.localStorage.setItem('DESCRICAO',nl2br(item.descricao));
					window.localStorage.setItem('ICMS',item.texto_icms);
					
				}
				loga("$json.subprodutos "+$json.subprodutos);
				if(subprodutos == 'undefined' || typeof(subprodutos) == 'undefined'){
					subprodutos = 0;
				}
				loga("#######qtde_compartimentos "+qtde_compartimentos);
				loga("#######subprodutos "+subprodutos);
				if(parseInt(subprodutos)==0 && parseInt(qtde_compartimentos) == 0){
					redireciona('detalhes.html');

				}else if(qtde_compartimentos >0){		
					redireciona('produtos_tipos_modelos_compartimentos.html');		
				}else{
					redireciona('produtos_tipos_modelos_disposicao.html');		

				}


				
			}else
			closeLoading();

		},function(){

		});
	},function(){
	});
}
function openProdutoTipo(produto_tipo_id,produto_tipo_nome){
	
	ORCAMENTO.produto_tipo_id = produto_tipo_id;	
	ORCAMENTO.produto_tipo_nome = produto_tipo_nome;
	
	saveOrcamento(ORCAMENTO);
	
	redireciona('produtos_tipos_modelos.html');
}
function carregaProdutosTiposModelos(produto_tipo_id){
	loadDb();
	loga("SELECT a.id, a.nome, a.image, (select count(*) from `app_produtos_tipos_modelos_compartimentos` c where c.modelo_id = a.id) as qtde_compartimentos, (select count(*) from `app_produtos_tipos_modelos_produtos` b where b.modelo_id = a.id) as subprodutos from app_produtos_tipos_modelos a where a.tipo_id = "+produto_tipo_id+" order by a.order_id;");
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.id, a.nome, a.image, (select count(*) from `app_produtos_tipos_modelos_compartimentos` c where c.modelo_id = a.id) as qtde_compartimentos, (select count(*) from `app_produtos_tipos_modelos_produtos` b where b.modelo_id = a.id) as subprodutos from app_produtos_tipos_modelos a where a.tipo_id = "+produto_tipo_id+" order by a.order_id;",[], function(tx, res) {
			loga(" qtde app_produtos_tipos view: " + res.rows.length);

			if (res.rows.length>0) {
				var cores = "";
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					if (i!=0) {
						cores += ",";						
					}
					cores += item.id;
					var datajson = JSON.stringify(item);

					datajson = datajson.split("\n").join("");
					datajson = datajson.split("\r").join("");
					datajson = datajson.split("\\\"").join("'");
					datajson = datajson.split("\\'").join("\'");
					
					$obj = $('<li id="item'+item.id+'" data-obj=\''+datajson+'\'>'+
						'<a href="#"><img src="" /></a>'+
						'<menu  class="cores clearfix" ></menu>'+
						'<span class="line"></span>'+
						'<a href="#">'+item.nome+'</a>'+
						'<button onclick="javascript:openProdutoTipoModelo('+item.id+');"  class="btn">Selecionar</button>'+
						'</li>');
					$('.box .scroller ul').append($obj);


				}
				montaCores(cores);
				

				var largura = 308+20;
				$('.scroller').each(function(){
					$ul = $(this).find('ul');
					$qtdeItens = $ul.find('li').length;

					$ul.css('width',($qtdeItens*largura)+'px');
				});
				closeLoading();
				
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}

function montaCores(modelos){
	loadDb();
	db.transaction(function(tx) {
		

		tx.executeSql("SELECT * from app_produtos_tipos_modelos_cores a where a.modelo_id in ("+modelos+") order by a.order_id;",[], function(tx, res) {
			
			
			if (res.rows.length>0) {
				
				for (var i = 0; i < res.rows.length; i++) {
					var classe="";
					item = res.rows.item(i);

					$obj = $('<li id="cor'+item.id+'" data-cor_id="cor'+item.id+'" data-cor_nome="'+item.nome+'"><a href="javascript:selecionaCor('+item.modelo_id+','+item.id+',\''+item.nome+'\',\''+item.cor+'\',\''+item.image+'\');" style="background-color:'+item.cor+';" class="'+classe+'">'+item.id+'</a></li>');
					$('#item'+item.modelo_id+" .cores").append($obj);

					loga('montaCores');
				}
				
				$('.cores').each(function(){
					$(this).find('li:first-child a').addClass("selected");
					eval($(this).find('li:first-child a').attr('href').replace('javascript:',''));
				});
				closeLoading();
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}
function selecionaCor(modelo_id,cor_id,cor_nome,cor,image){
	loga('chamo selecionaCor');
	loga(target_directory+PATHAPP+image);
	ORCAMENTO.produto_tipo_modelo_cor_id = cor_id;	
	ORCAMENTO.produto_tipo_modelo_cor_nome = cor_nome;
	
	$('#item'+modelo_id+" .cores .selected").removeClass('selected');
	$('#item'+modelo_id+" .cores #cor"+cor_id+' a').addClass('selected');
	// $('#item'+modelo_id+" img").attr('src',target_directory+PATHAPP+image);
	$('#item'+modelo_id+" img").attr('src','fotos/'+image);

	window.localStorage.setItem('FOTO',image);

	loga('cor trocada');
}
function openProdutoTipoModelo(produto_tipo_modelo_id){
	loga('openProdutoTipoModelo '+produto_tipo_modelo_id);
	var imgSrc = $('#item'+produto_tipo_modelo_id+" img").attr('src');
	imgSrc = imgSrc.replace('fotos/','');
	
	window.localStorage.setItem('FOTO',imgSrc);

	$json = $('#item'+produto_tipo_modelo_id).data('obj');
	
	loga($json.nome);
	ORCAMENTO.produto_tipo_modelo_id = produto_tipo_modelo_id;	
	ORCAMENTO.produto_tipo_modelo_nome = $json.nome;
	ORCAMENTO.produto_tipo_modelo_qtde_subprodutos = $json.subprodutos;

	ORCAMENTO.produto_tipo_modelo_cor_id   = $('#item'+produto_tipo_modelo_id+" .cores .selected").closest('li').data('cor_id');
	ORCAMENTO.produto_tipo_modelo_cor_nome = $('#item'+produto_tipo_modelo_id+" .cores .selected").closest('li').data('cor_nome');
	
	
	if(parseInt($json.subprodutos)==0 && parseInt($json.qtde_compartimentos) == 0){
		ORCAMENTO.compartimentos =[];
	}
	saveOrcamento(ORCAMENTO);
	carregaDescricao(produto_tipo_modelo_id,$json.subprodutos,$json.qtde_compartimentos);
	
}
function carregaProdutosTiposModelosCompartimentos(modelo_id){
	loadDb();
	// alert('1');
	loga('#################aqui entro');
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.id, a.nome,a.qtde_itens, b.produto_modelo_id,c.descricao, b.produto_modelo_id  as modelos_ids, d.nome as tipo_nomes,f.nome as produto_nome, c.nome as modelos_nomes , e.id as caneta_id , e.nome as caneta_nome  from app_produtos_tipos_modelos_compartimentos a left join app_produtos_tipos_modelos_compartimentos_opcoes b on b.compartimento_id = a.id left join app_produtos_tipos_modelos c on c.id = b.produto_modelo_id left join app_produtos_tipos d on d.id = c.tipo_id left join app_canetas e on e.id = b.caneta_id left join app_produtos f on f.id = d.produto_id    where  a.modelo_id = "+modelo_id+"  order by a.id, b.id, a.nome",[], function(tx, res) {
			loga(" qtde compartimentos itens view: " + res.rows.length);

			if (res.rows.length>0) {
				var composicao = "";
				var strhtml = '';
				// var todos = [];
				// for (var i = 0; i < res.rows.length; i++) {
				// 	todos.push(res.rows.item(i));
				// }
				for (var i = 0; i < res.rows.length; i++) {
					item = res.rows.item(i);
					if(composicao != item.id){

						
						var options = "";
						for(var x = 0; x < res.rows.length; x++){
							// itemx = todos[x];
							// loga('x'+itemx.modelos_ids);
							if(item.id == res.rows.item(x).id){
								if(res.rows.item(x).modelos_ids == 0){

									options+="<a class='item ' data-tipo='caneta' data-compartimento_id='"+item.id+"' data-descricao='"+nl2br(res.rows.item(x).descricao)+"' data-caneta_id='"+res.rows.item(x).caneta_id+"' id='item_"+item.id+"_modelo_"+res.rows.item(x).caneta_id+"' href=\"javascript:adicionaModelo("+item.id+","+res.rows.item(x).caneta_id+")\">"+res.rows.item(x).caneta_nome+"</a>";
								}else{
									options+="<a class='item ' data-tipo='modelo' data-compartimento_id='"+item.id+"' data-descricao='"+nl2br(res.rows.item(x).descricao)+"' data-modelo_id='"+res.rows.item(x).modelos_ids+"' id='item_"+item.id+"_modelo_"+res.rows.item(x).modelos_ids+"' href=\"javascript:adicionaModelo("+item.id+","+res.rows.item(x).modelos_ids+")\">"+ res.rows.item(x).produto_nome +" - "+res.rows.item(x).tipo_nomes+" - "+res.rows.item(x).modelos_nomes+"</a>";
								}
							}
						}
						//<div class="add"><select onblur="adicionaModelo('+item.id+')" id="opcoes_'+item.id+'" class="select_opcoes">'+options+'</select> </div>
						strhtml+= '<li id="compartimento'+item.id+'" data-compartimento="'+item.id+'" data-compartimento_nome="'+item.nome+'" data-qtde_itens="'+item.qtde_itens+'" class="compar" >';
						strhtml+= '<div class="topo">'+item.nome+' </div>';
						strhtml+= '<div class="itens">';
						strhtml+= options;
			                // <a href="#" class="item">Caneta DEMA</a>
			                // <a href="#" class="item">Paper talk listrado</a>
			                strhtml+= '</div>';
			                strhtml+= '</li>';							
			            }
			            composicao = item.id;

			        }
				// strhtml+= '<a href="#">+ Caneta</a>';
				strhtml+= '</li>';	
				$('.box .scroller ul').append($(strhtml));
				
				

				var largura = 308+40;
				$('.scroller').each(function(){
					$ul = $(this).find('ul');
					$qtdeItens = $ul.find('li').length;

					$ul.css('width',($qtdeItens*largura)+'px');
				});

				closeLoading();	
			}else
			closeLoading();

		},function(e){
			
			loga("ERRO: " + e.message);
			loga(e);
			closeLoading();

		});
	},function(){});
}
function adicionaModelo(compartimento_id,modelo_id){
	var the_id = "#opcoes_"+compartimento_id;

	if($('#item_'+compartimento_id+'_modelo_'+modelo_id).hasClass('checked')){
		$('#item_'+compartimento_id+'_modelo_'+modelo_id).toggleClass('checked');
	}else
	if($('#compartimento'+compartimento_id+" .itens .item.checked").length < parseInt($('#compartimento'+compartimento_id+"").data('qtde_itens'))){			
		$('#item_'+compartimento_id+'_modelo_'+modelo_id).toggleClass('checked');
	}else{
		alert('Limite de itens atingido para este compartimento');
	}
	
}

function carregaCompartimentos(){
	console.log('***********carregaCompartimentos');
	for( var x = 0 ; x < ORCAMENTO.compartimentos.length ; x++){
		var item = ORCAMENTO.compartimentos[x];
		var strhtml="";
		strhtml+= '<div class="ummeio"><div id="compartimento'+item.compartimento_id+'" data-compartimento="'+item.compartimento_id+'" data-compartimento_nome="'+item.compartimento_nome+'"  class="compar detalhes" >';
		strhtml+= '<div class="topo">'+item.compartimento_nome+' </div>';
		strhtml+= '<div class="itens">';
		for( var i = 0 ; i < item.opcoes.length ; i++){
			var opcao = item.opcoes[i];
			if(opcao.produto_modelo_id!=''){
				strhtml+= '<a class="item customizable" data-tipo="modelo" href="javascript:;" data-compartimento="'+item.compartimento_id+'"  data-modelo_id="'+opcao.produto_modelo_id+'" data-modelo_nome="'+opcao.produto_modelo_nome+'">'+opcao.produto_modelo_nome+'</a>';                    	
			}else{
				strhtml+= '<a class="item customizable" data-tipo="caneta" href="javascript:;" data-compartimento="'+item.compartimento_id+'"  data-caneta_id="'+opcao.produto_caneta_id+'" data-caneta_nome="'+opcao.produto_caneta_nome+'">'+opcao.produto_caneta_nome+'</a>';                    	

			}
		}

		strhtml+= '</div>';
		strhtml+= '</div>';
		strhtml+= '</div>';

		$('#the_compartimentos').append($(strhtml));

	}
	$('.customizable').click(function(){
		$('.customizable.checked').removeClass('checked');
		$(this).addClass('checked');

		$('#info_no').hide();
		$('#edit_fields').show();
		loga($(this).data('tipo'));
		$('#edit_fields .campos').html('');
		if($(this).data('tipo')=='caneta'){
			$('.customizador .edit_fields .header h4').text($(this).text());
			carregaProdutosTiposModelosCanetasRight($(this).data('caneta_id'));  
		}else if($(this).data('tipo')=='main'){
			$('.customizador .edit_fields .header h4').text(ORCAMENTO.produto_tipo_modelo_nome +' - '+ORCAMENTO.produto_tipo_modelo_cor_nome);
			loga("carregaProdutosTiposModelosEmbalagensRight");
			carregaProdutosTiposModelosEmbalagensRight(ORCAMENTO.produto_tipo_modelo_id);

			carregaProdutosTiposModelosCustomizacoesRight(ORCAMENTO.produto_tipo_modelo_id,true);    
		}else{
			$('.customizador .edit_fields .header h4').text($(this).text());
			loga("carregaProdutosTiposModelosCoresRight");
			carregaProdutosTiposModelosCoresRight($(this).data('modelo_id')); 

			carregaProdutosTiposModelosCustomizacoesRight($(this).data('modelo_id'),false);    
		}


	});
	closeLoading();
}
function salvaCompartimentos(){
	// if($('.compar .itens .item').length>0){
		ORCAMENTO.compartimentos = [];
		$('.compar').each(function(){
			var obj = {};
			obj.compartimento_id = $(this).data('compartimento');
			obj.compartimento_nome = $(this).data('compartimento_nome');			
			obj.opcoes = [];

			$(this).find('.itens .item').each(function(){
				$item = $(this);
				if($item.hasClass('checked')){
					var opcao = {};
					if( $item.data('tipo') == 'modelo'){
						// console.log('========modelo_id=======');
						// console.log($item.data('modelo_id'));
						opcao.produto_modelo_id = $item.data('modelo_id');
						opcao.produto_modelo_nome = $item.text();
						opcao.produto_caneta_nome = '';
						opcao.produto_caneta_id = '';
					}else{
						opcao.produto_modelo_id = '';
						opcao.produto_modelo_nome = '';
						opcao.produto_caneta_nome = $item.text();
						opcao.produto_caneta_id = $item.data('caneta_id');
					}
					opcao.desconto = 0;
					opcao.desconto_nome = '';
					opcao.imagem = '';
					// console.log('========descricao=======');
					// console.log($item.data('descricao'));
					opcao.descricao =  $item.data('descricao');
					opcao.customizacoes = [];
					obj.opcoes.push(opcao);
				}
			});
			ORCAMENTO.compartimentos.push(obj);
			saveOrcamento(ORCAMENTO);
			
			redireciona('detalhes_compartimentos.html');
		});

	// }else{
	// 	navigator.notification.alert(
	// 		'Por favor coloque ao menos um item no kit',  
	// 		function(){},         
	// 		'Atenção',            
	// 		'Ok'                  
	// 		);
	// }

}
function carregaProdutosTiposModelosDisposicoes(modelo_id){
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.composicao, a.produto_modelo_id, b.nome as modelo, c.nome as tipo, d.nome as produto from app_produtos_tipos_modelos_produtos a inner join app_produtos_tipos_modelos b on b.id = a.produto_modelo_id inner join app_produtos_tipos c on b.tipo_id = c.id inner join app_produtos d on d.id = c.produto_id where a.modelo_id = "+modelo_id+" order by a.composicao;",[], function(tx, res) {
			loga(" qtde composicoes itens view: " + res.rows.length);

			if (res.rows.length>0) {
				var composicao = "";
				var strhtml = '';
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					if (composicao!=item.composicao) {
						composicao=item.composicao;
						if (i!=0) {
							strhtml+= '<a href="#">+ Caneta</a>';
							strhtml+= '</li>';							
						}
						strhtml+= '<li id="composicao'+item.composicao+'" data-composicao="'+item.composicao+'" class="dispo" >'
					}
					strhtml+= '<a href="#">+ '+item.produto+' '+item.modelo+'</a>';										

				}
				strhtml+= '<a href="#">+ Caneta</a>';
				strhtml+= '</li>';	
				$('.box .scroller ul').append($(strhtml));
				
				$('.dispo').click(function(){

					ORCAMENTO.produto_tipo_modelo_disposicao = $(this).data('composicao');
					saveOrcamento(ORCAMENTO);
					
					redireciona('detalhes.html');
				})

				var largura = 308+40;
				$('.scroller').each(function(){
					$ul = $(this).find('ul');
					$qtdeItens = $ul.find('li').length;

					$ul.css('width',($qtdeItens*largura)+'px');
				});

				closeLoading();	
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}
function loadSubprodutos(modelo_id,disposicao){
	loga("SELECT a.composicao, a.produto_modelo_id, b.nome as modelo, c.nome as tipo, d.nome as produto from app_produtos_tipos_modelos_produtos a inner join app_produtos_tipos_modelos b on b.id = a.produto_modelo_id inner join app_produtos_tipos c on b.tipo_id = c.id inner join app_produtos d on d.id = c.produto_id where a.modelo_id = "+modelo_id+" and a.composicao = "+disposicao+" order by a.composicao;");
	loadDb();
	ORCAMENTO.subprodutos = [];
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.composicao, a.produto_modelo_id, b.nome as modelo,b.descricao as descricao, c.nome as tipo, d.nome as produto from app_produtos_tipos_modelos_produtos a inner join app_produtos_tipos_modelos b on b.id = a.produto_modelo_id inner join app_produtos_tipos c on b.tipo_id = c.id inner join app_produtos d on d.id = c.produto_id where a.modelo_id = "+modelo_id+" and a.composicao = "+disposicao+" order by a.composicao;",[], function(tx, res) {
			loga(" qtde composicoes no combo: " + res.rows.length);

			if (res.rows.length>0) {
				var composicao = "";
				var strhtml = '';
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					ORCAMENTO.subprodutos[item.produto_modelo_id] = new Object();
					ORCAMENTO.subprodutos[item.produto_modelo_id].produto_modelo_id = item.produto_modelo_id;
					ORCAMENTO.subprodutos[item.produto_modelo_id].produto_nome = item.produto;
					ORCAMENTO.subprodutos[item.produto_modelo_id].produto_tipo_nome = item.tipo;
					ORCAMENTO.subprodutos[item.produto_modelo_id].produto_tipo_modelo_nome = item.modelo;
					ORCAMENTO.subprodutos[item.produto_modelo_id].produto_tipo_modelo_cor = "";
					ORCAMENTO.subprodutos[item.produto_modelo_id].produto_tipo_modelo_cor_id = -1;
					ORCAMENTO.subprodutos[item.produto_modelo_id].produto_tipo_modelo_cor_image = "";
					ORCAMENTO.subprodutos[item.produto_modelo_id].descricao = nl2br(item.descricao);
					ORCAMENTO.subprodutos[item.produto_modelo_id].customizacoes = [];
					strhtml = '<option value="'+item.produto_modelo_id+'">'+item.produto+' '+item.modelo+'</option>';										
					$('#subprodutos').append($(strhtml));

				}
				$('#subprodutos').append($('<option value="-1">Caneta</option>'));
				
				
				

				closeLoading();	
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}

function carregaProdutosTiposModelosCompartimentosCustomizacoes(modelo_id){
	// loga('#####UHUHUHUHUHUH');
	$('#pag1 .wrapper').html('');
	carregaProdutosTiposModelosCustomizacoes(modelo_id);
}
function carregaProdutosTiposModelosCustomizacoes(modelo_id){

	var jatinhacustomizacoes = true;

	if (!isSubproduto) {
		if (typeof(ORCAMENTO.customizacoes)=='undefined') {
			jatinhacustomizacoes = false;
			ORCAMENTO.customizacoes = [];	
		}
	}else{
		if (typeof(ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes)=='undefined') {
			
			ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes = [];
		}else{
			if (ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes.length == 0) {
				jatinhacustomizacoes = false;
				loga('ZERA CUSTOMIZACOES');
			}
		}
		
	}
	
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.id, a.customizacao_id , b.nome from app_produtos_tipos_modelos_customizacoes a inner join app_customizacoes b on b.id = a.customizacao_id where a.modelo_id = "+modelo_id+" order by a.id;",[], function(tx, res) {
			loga(" qtde app_produtos_tipos_modelos_customizacoes view: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = ""
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					if (i!=0) {
						opcoes += ",";						
					}
					opcoes += item.customizacao_id;
					loga('nome: '+item.nome);
					if(ORCAMENTO.compartimentos.length>0 && $('.compar.detalhes .itens .item.active').length > 0){

						var compartimento_id = $('.compar.detalhes .itens .item.active').data('compartimento');
						// var modelo_id = $('.compar.detalhes .itens .item.active').data('modelo_id');
						for( var x = 0 ; x < ORCAMENTO.compartimentos.length ; x++){
							if(ORCAMENTO.compartimentos[x].compartimento_id == compartimento_id){			
								for( var y = 0 ; y < ORCAMENTO.compartimentos[x].opcoes.length ; y++){
									if(ORCAMENTO.compartimentos[x].opcoes[y].produto_modelo_id == modelo_id){
										loga(ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id]);
										if(typeof(ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id]) =='undefined'){
											
											ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id] = new Object();
											ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id].relacionamento_id = item.id;
											ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id].customizacao_id = item.customizacao_id;
											ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id].customizacao_nome = item.nome;
											ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id].customizacao_opcao_id = 0;
											ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id].customizacao_opcao_nome = '';	
										}
										break;
									}
								}
							}
						}
						

					}else if (!jatinhacustomizacoes) {
						if (!isSubproduto) {

							loga("ORCAMENTO.customizacoes:" +ORCAMENTO.customizacoes.length);
							ORCAMENTO.customizacoes[item.id] = new Object();
							ORCAMENTO.customizacoes[item.id].relacionamento_id = item.id;
							ORCAMENTO.customizacoes[item.id].customizacao_id = item.customizacao_id;
							ORCAMENTO.customizacoes[item.id].customizacao_nome = item.nome;
							ORCAMENTO.customizacoes[item.id].customizacao_opcao_id = 0;
							ORCAMENTO.customizacoes[item.id].customizacao_opcao_nome = '';
						}else{
							loga("ORCAMENTO.customizacoes SUBPRODUTOS:" +ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes.length);

							ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes[item.id] = new Object();
							ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes[item.id].relacionamento_id = item.id;
							ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes[item.id].customizacao_id = item.customizacao_id;
							ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes[item.id].customizacao_nome = item.nome;
							ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes[item.id].customizacao_opcao_id = 0;
							ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes[item.id].customizacao_opcao_nome = '';						
						}
						
					}		
					$obj = $(	'<div id="custo'+item.customizacao_id+'" data-rel="'+item.id+'" class="linha relidcusto'+item.id+'">'+
						'	<label class="label" for="inputcusto'+item.customizacao_id+'">'+item.nome+'</label>'+
						'	<select class="big combocustomizacao"  id="inputcusto'+item.customizacao_id+'"  name="inputcusto'+item.customizacao_id+'">'+
						'		<option value="">Selecione</option>'+
						'	</select>'+
						'</div>');
					$('#pag1 .wrapper').append($obj);

				}
				carregaOpcoesCustomizacao(opcoes,'custo');
				$('.combocustomizacao').change(function(){
					var relid = $(this).closest('.linha').data('rel');
					loga($(this).val());
					loga($(this).find("option:selected").text());
					loga(ORCAMENTO.compartimentos.length);
					loga($('.compar.detalhes .itens .item.active').length);
					if(ORCAMENTO.compartimentos.length>0 && $('.compar.detalhes .itens .item.active').length > 0){
						var compartimento_id = $('.compar.detalhes .itens .item.active').data('compartimento');
						var modelo_id = $('.compar.detalhes .itens .item.active').data('modelo_id');
						loga('compartimento_id:'+compartimento_id);
						loga('modelo_id:'+modelo_id);
						for( var x = 0 ; x < ORCAMENTO.compartimentos.length ; x++){
							loga('modelo_id0-');
							if(ORCAMENTO.compartimentos[x].compartimento_id == compartimento_id){			
								loga('modelo_id0');
								for( var i = 0 ; i < ORCAMENTO.compartimentos[x].opcoes.length ; i++){
									loga('modelo_id1');
									if(ORCAMENTO.compartimentos[x].opcoes[i].produto_modelo_id == modelo_id){
										loga('modelo_id2/'+relid);
										loga(ORCAMENTO.compartimentos[x].opcoes[i].customizacoes);

										ORCAMENTO.compartimentos[x].opcoes[i].customizacoes[relid].customizacao_opcao_id = $(this).val();
										ORCAMENTO.compartimentos[x].opcoes[i].customizacoes[relid].customizacao_opcao_nome = $(this).find("option:selected").text();
										
									}
								}
							}
						}
						

					}else if (!isSubproduto) {					
						ORCAMENTO.customizacoes[relid].customizacao_opcao_id = $(this).val();
						ORCAMENTO.customizacoes[relid].customizacao_opcao_nome = $(this).find("option:selected").text();
					}else{
						ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes[relid].customizacao_opcao_id = $(this).val();
						ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes[relid].customizacao_opcao_nome = $(this).find("option:selected").text();
					}
					saveOrcamento(ORCAMENTO);
				});
				if(ORCAMENTO.produto_tipo_modelo_qtde_subprodutos==0){
					carregaProdutosTiposModelosCanetas(modelo_id);						
				}

				

				
			}else{
				if(ORCAMENTO.produto_tipo_modelo_qtde_subprodutos==0){
					carregaProdutosTiposModelosCanetas(modelo_id);						
				}
			}
			closeLoading();

		},function(){

		});
},function(){});
}
var ismain = false;
function carregaProdutosTiposModelosCustomizacoesRight(modelo_id,ismainpar){
	ismain = ismainpar;
	loga('ENTROU - '+modelo_id)
	
	if (typeof(ORCAMENTO.customizacoes)=='undefined') {

		ORCAMENTO.customizacoes = [];	
	}
	
	loga('ENTROU')
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.id, a.customizacao_id , b.nome from app_produtos_tipos_modelos_customizacoes a inner join app_customizacoes b on b.id = a.customizacao_id where a.modelo_id = "+modelo_id+" order by a.id;",[], function(tx, res) {
			loga(" qtde app_produtos_tipos_modelos_customizacoes view: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = ""
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					if (i!=0) {
						opcoes += ",";						
					}
					opcoes += item.customizacao_id;
					loga('nome: '+item.nome);
					if(!ismain && ORCAMENTO.compartimentos.length>0 && $('.compar .itens .item.checked').length > 0){

						var compartimento_id = $('.compar .itens .item.checked').data('compartimento');
						// var modelo_id = $('.compar.detalhes .itens .item.active').data('modelo_id');
						for( var x = 0 ; x < ORCAMENTO.compartimentos.length ; x++){
							if(ORCAMENTO.compartimentos[x].compartimento_id == compartimento_id){			
								for( var y = 0 ; y < ORCAMENTO.compartimentos[x].opcoes.length ; y++){
									if(ORCAMENTO.compartimentos[x].opcoes[y].produto_modelo_id == modelo_id){
										loga(ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id]);
										if(typeof(ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id]) =='undefined'){
											
											ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id] = new Object();
											ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id].relacionamento_id = item.id;
											ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id].customizacao_id = item.customizacao_id;
											ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id].customizacao_nome = item.nome;
											ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id].customizacao_opcao_id = 0;
											ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[item.id].customizacao_opcao_nome = '';	
										}
										break;
									}
								}
							}
						}
						

					}else if (ismain && typeof(ORCAMENTO.customizacoes[item.id]) == 'undefined') {
						


						loga("ORCAMENTO.customizacoes:" +ORCAMENTO.customizacoes.length);

						ORCAMENTO.customizacoes[item.id] = new Object();
						ORCAMENTO.customizacoes[item.id].relacionamento_id = item.id;
						ORCAMENTO.customizacoes[item.id].customizacao_id = item.customizacao_id;
						ORCAMENTO.customizacoes[item.id].customizacao_nome = item.nome;
						ORCAMENTO.customizacoes[item.id].customizacao_opcao_id = 0;
						ORCAMENTO.customizacoes[item.id].customizacao_opcao_nome = '';

						
						
					}		
					$obj = $(	'<div id="custo'+item.customizacao_id+'" data-rel="'+item.id+'" class="linha relidcusto'+item.id+'">'+
						'	<label class="label" for="inputcusto'+item.customizacao_id+'">'+item.nome+'</label>'+
						'	<select class="big combocustomizacao"  id="inputcusto'+item.customizacao_id+'"  name="inputcusto'+item.customizacao_id+'">'+
						'		<option value="">Selecione</option>'+
						'	</select>'+
						'</div>');
					// loga('CHEGOU!!!!!!');
					$('#edit_fields .campos').append($obj);

				}
				carregaOpcoesCustomizacao(opcoes,'custo');
				$('.combocustomizacao').change(function(){
					var relid = parseInt($(this).closest('.linha').data('rel'));
					loga($(this).val());
					loga($(this).find("option:selected").text());
					loga(ORCAMENTO.compartimentos.length);
					loga($('.compar .itens .item.checked').length);
					loga('ismain '+ismain);
					if(!ismain && ORCAMENTO.compartimentos.length>0 && $('.compar .itens .item.checked').length > 0){
						var compartimento_id = $('.compar .itens .item.checked').data('compartimento');
						var modelo_id = $('.compar .itens .item.checked').data('modelo_id');
						loga('compartimento_id:'+compartimento_id);
						loga('modelo_id:'+modelo_id);
						for( var x = 0 ; x < ORCAMENTO.compartimentos.length ; x++){
							loga('modelo_id0-');
							if(ORCAMENTO.compartimentos[x].compartimento_id == compartimento_id){			
								loga('modelo_id0');
								for( var i = 0 ; i < ORCAMENTO.compartimentos[x].opcoes.length ; i++){
									loga('modelo_id1');
									if(ORCAMENTO.compartimentos[x].opcoes[i].produto_modelo_id == modelo_id){
										loga('modelo_id2/'+relid);
										loga(ORCAMENTO.compartimentos[x].opcoes[i].customizacoes);

										ORCAMENTO.compartimentos[x].opcoes[i].customizacoes[relid].customizacao_opcao_id = $(this).val();
										ORCAMENTO.compartimentos[x].opcoes[i].customizacoes[relid].customizacao_opcao_nome = $(this).find("option:selected").text();
										
									}
								}
							}
						}
						

					}else /*if (!isSubproduto)*/ {		
						loga('customizacao_opcao_id '+$(this).val());			
						loga('relid '+relid);			
						loga('RCAMENTO.customizacoes[relid].customizacao_opcao_id '+ORCAMENTO.customizacoes[relid].customizacao_opcao_id);			
						ORCAMENTO.customizacoes[relid].customizacao_opcao_id = $(this).val();
						ORCAMENTO.customizacoes[relid].customizacao_opcao_nome = $(this).find("option:selected").text();
						loga('RCAMENTO.customizacoes[relid].customizacao_opcao_id '+ORCAMENTO.customizacoes[relid].customizacao_opcao_id);			
					}
					// else{
					// 	ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes[relid].customizacao_opcao_id = $(this).val();
					// 	ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes[relid].customizacao_opcao_nome = $(this).find("option:selected").text();
					// }
					saveOrcamento(ORCAMENTO);
				});
				if(ORCAMENTO.produto_tipo_modelo_qtde_subprodutos==0){
					carregaProdutosTiposModelosCanetas(modelo_id);						
				}

				

				
			}else{
				if(ORCAMENTO.produto_tipo_modelo_qtde_subprodutos==0){
					carregaProdutosTiposModelosCanetas(modelo_id);						
				}
			}
			closeLoading();

		},function(){

		});
},function(){});
}
function selecionaModeloCor(compartimento_id,modelo_id){
	var valor = $('#inputcor_subproduto').val();
	var nome = $('#inputcor_subproduto').find('option:selected').text();
	
	for( var x = 0 ; x < ORCAMENTO.compartimentos.length ; x++){
		if(ORCAMENTO.compartimentos[x].compartimento_id == compartimento_id){			
			for( var i = 0 ; i < ORCAMENTO.compartimentos[x].opcoes.length ; i++){
				if(ORCAMENTO.compartimentos[x].opcoes[i].produto_modelo_id == modelo_id){
					loga('###SALVADO COR '+valor+"|"+nome);
					ORCAMENTO.compartimentos[x].opcoes[i].cor_id = valor;
					ORCAMENTO.compartimentos[x].opcoes[i].cor_nome = nome;
					// $('#compartimento'+compartimento_id).find('.compartimento_modelo_cor span').text(nome);
					
				}
			}
		}
	}
	saveOrcamento(ORCAMENTO);	

}
function carregaProdutosTiposModelosCompartimentosCores(compartimento_id,modelo_id){
	
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.id, a.nome , a.image from app_produtos_tipos_modelos_cores a  where a.modelo_id = "+modelo_id+" order by a.order_id;",[], function(tx, res) {
			// loga(" qtde cores subprodutos: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = "<option>Selecione uma cor</option>"
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					
					// opcoes += item.customizacao_id;
					// loga('COR nome: '+item.nome);
					var selected = '';
					// if (typeof(ORCAMENTO.subprodutos[modelo_id]) !='undefined' && ORCAMENTO.subprodutos[modelo_id].produto_tipo_modelo_cor_id == item.id) {
					// 	selected = ' selected="selected" ';
					// }							
					opcoes+= "<option value='"+item.id+"' data-img='"+item.image+"' "+selected+" >"+item.nome+"</option>";

				}

				
				$('#'+compartimento_id+'_opcoes_'+modelo_id+'').html(opcoes);
				
				// $('#inputcor_subproduto').change(function(){
				// 	var relid = $(this).closest('.linha').data('rel');
				// 	loga($(this).val());
				// 	loga($(this).find("option:selected").text());
				// 	loga($(this).find("option:selected").data('img'));
				// 	ORCAMENTO.subprodutos[modelo_id].produto_tipo_modelo_cor = $(this).find("option:selected").text();
				// 	ORCAMENTO.subprodutos[modelo_id].produto_tipo_modelo_cor_id = $(this).val();
				// 	ORCAMENTO.subprodutos[modelo_id].produto_tipo_modelo_cor_image = $(this).find("option:selected").data('img');

				// 	saveOrcamento(ORCAMENTO);
				// });
				

				

				
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}
function carregaProdutosTiposModelosCores(modelo_id){
	// ORCAMENTO.subprodutos[item.produto_modelo_id].produto_tipo_modelo_cor = "";
	// ORCAMENTO.subprodutos[item.produto_modelo_id].produto_tipo_modelo_cor_id = -1;
	var jatinhacustomizacoes = true;

	
	
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.id, a.nome , a.image from app_produtos_tipos_modelos_cores a  where a.modelo_id = "+modelo_id+" order by a.order_id;",[], function(tx, res) {
			loga(" qtde cores subprodutos: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = ""
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					
					opcoes += item.customizacao_id;
					loga('COR nome: '+item.nome);
					var selected = '';
					if (typeof(ORCAMENTO.subprodutos[modelo_id]) !='undefined' && ORCAMENTO.subprodutos[modelo_id].produto_tipo_modelo_cor_id == item.id) {
						selected = ' selected="selected" ';
					}							
					opcoes+= "<option value='"+item.id+"' data-img='"+item.image+"' "+selected+" >"+item.nome+"</option>";

				}

				$obj = $(	'<div id="cor_subproduto" data-rel="'+modelo_id+'" class="linha ">'+
					'	<label class="label" for="inputcor_subproduto">Cor</label>'+
					'	<select class="big "  id="inputcor_subproduto"  name="inputcor_subproduto">'+
					'		<option value="" data-img="" >Selecione</option>'+opcoes+
					'	</select>'+
					'</div>');
				$('#subprodutos').after($obj);
				
				$('#inputcor_subproduto').change(function(){
					var relid = $(this).closest('.linha').data('rel');
					loga($(this).val());
					loga($(this).find("option:selected").text());
					loga($(this).find("option:selected").data('img'));
					ORCAMENTO.subprodutos[modelo_id].produto_tipo_modelo_cor = $(this).find("option:selected").text();
					ORCAMENTO.subprodutos[modelo_id].produto_tipo_modelo_cor_id = $(this).val();
					ORCAMENTO.subprodutos[modelo_id].produto_tipo_modelo_cor_image = $(this).find("option:selected").data('img');
					
					saveOrcamento(ORCAMENTO);
				});
				

				

				
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}
function carregaProdutosTiposModelosCoresRight(modelo_id){
	// ORCAMENTO.subprodutos[item.produto_modelo_id].produto_tipo_modelo_cor = "";
	// ORCAMENTO.subprodutos[item.produto_modelo_id].produto_tipo_modelo_cor_id = -1;
	var jatinhacustomizacoes = true;

	
	
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.id, a.nome , a.image from app_produtos_tipos_modelos_cores a  where a.modelo_id = "+modelo_id+" order by a.order_id;",[], function(tx, res) {
			loga(" qtde cores caneta: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = ""
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					
					opcoes += item.customizacao_id;
					loga('COR nome: '+item.nome);
					var selected = '';

					var compartimento_id = $('.compar .itens .item.checked').data('compartimento');
					var modelo_id = $('.compar .itens .item.checked').data('modelo_id');
					// loga('###comparar1  '+compartimento_id+"|"+modelo_id);
					for( var x = 0 ; x < ORCAMENTO.compartimentos.length ; x++){
						if(ORCAMENTO.compartimentos[x].compartimento_id == compartimento_id){			
							// loga('###comparar2  '+ORCAMENTO.compartimentos[x].compartimento_id+"|"+compartimento_id);
							for( var y = 0 ; y < ORCAMENTO.compartimentos[x].opcoes.length ; y++){
								if(ORCAMENTO.compartimentos[x].opcoes[y].produto_modelo_id == modelo_id){
									// loga('###comparar3  '+ORCAMENTO.compartimentos[x].opcoes[y].produto_modelo_id+"|"+modelo_id);
									if(item.id == ORCAMENTO.compartimentos[x].opcoes[y].cor_id)	{
									// loga('###comparar4  '+ORCAMENTO.compartimentos[x].opcoes[y].cor_id+"|"+item.id);
									selected = ' selected="selected" ';
											// break;
										}			
									// break;															
								}
							}
							// break;
						}
					}

					// if (typeof(ORCAMENTO.subprodutos[modelo_id]) !='undefined' && ORCAMENTO.subprodutos[modelo_id].produto_tipo_modelo_cor_id == item.id) {
					// 	selected = ' selected="selected" ';
					// }							
					opcoes+= "<option value='"+item.id+"' data-img='"+item.image+"' "+selected+" >"+item.nome+"</option>";

				}

				$obj = $(	'<div id="cor_subproduto" data-rel="'+modelo_id+'" class="linha ">'+
					'	<label class="label" for="inputcor_subproduto">Cor</label>'+
					'	<select class="big "  id="inputcor_subproduto"  name="inputcor_subproduto">'+
					'		<option value="" data-img="" >Selecione</option>'+opcoes+
					'	</select>'+
					'</div>');
				$('#edit_fields .campos').prepend($obj);
				
				$('#inputcor_subproduto').change(function(){
					var compartimento_id = $('.compar .itens .item.checked').data('compartimento');
					selecionaModeloCor(compartimento_id,$('.compar .itens .item.checked').data('modelo_id'));

					// var relid = $(this).closest('.linha').data('rel');
					// loga($(this).val());
					// loga($(this).find("option:selected").text());
					// loga($(this).find("option:selected").data('img'));
					// ORCAMENTO.subprodutos[modelo_id].produto_tipo_modelo_cor = $(this).find("option:selected").text();
					// ORCAMENTO.subprodutos[modelo_id].produto_tipo_modelo_cor_id = $(this).val();
					// ORCAMENTO.subprodutos[modelo_id].produto_tipo_modelo_cor_image = $(this).find("option:selected").data('img');
					
					// saveOrcamento(ORCAMENTO);
				});
				

				

				
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}
function carregaOpcoesCustomizacao(customizacao_id,prefixo){
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT * from app_customizacoes_opcoes a where a.customizacao_id in("+customizacao_id+") order by a.order_id;",[], function(tx, res) {
			loga(" qtde app_customizacoes_opcoes view: " + res.rows.length);

			if (res.rows.length>0) {
				
				for (var i = 0; i < res.rows.length; i++) {
					// loga('i: '+i);
					item = res.rows.item(i);
					var selected="";
					// loga('#'+prefixo+item.customizacao_id);
					var relid = $('#'+prefixo+item.customizacao_id).data('rel');
					// loga('passou'+relid);
					if(!ismain && ORCAMENTO.compartimentos.length>0 && $('.compar .itens .item.checked').length > 0){

						var compartimento_id = $('.compar .itens .item.checked').data('compartimento');
						var modelo_id = $('.compar .itens .item.checked').data('modelo_id');
						for( var x = 0 ; x < ORCAMENTO.compartimentos.length ; x++){
							if(ORCAMENTO.compartimentos[x].compartimento_id == compartimento_id){			
								for( var y = 0 ; y < ORCAMENTO.compartimentos[x].opcoes.length ; y++){
									if(ORCAMENTO.compartimentos[x].opcoes[y].produto_modelo_id == modelo_id){
										
										


										if(ORCAMENTO.compartimentos[x].opcoes[y].customizacoes[relid].customizacao_opcao_id == item.id){
											selected = " selected = 'selected' ";
											break;
										}
									}
								}
							}
						}
						

					}else /*if(!isSubproduto)*/{
						loga('relid'+relid+"|"+item.id);
						loga(ORCAMENTO.customizacoes[relid]);
						if (typeof(ORCAMENTO.customizacoes[relid])!='undefined') {
							if(ORCAMENTO.customizacoes[relid].customizacao_opcao_id == item.id){
								selected = " selected = 'selected' ";
							}
						}						
					}
					// else{
					// 	// loga('else passou'+relid);
					// 	if (typeof(ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes[relid])!='undefined') {
					// 		if(ORCAMENTO.subprodutos[$('#subprodutos').val()].customizacoes[relid].customizacao_opcao_id == item.id){
					// 			selected = " selected = 'selected' ";
					// 		}
					// 	}						
					// }

					$obj = $('<option value="'+item.id+'" '+selected+' >'+item.nome+'</option>');
					$('#'+prefixo+item.customizacao_id+' select').append($obj);
					

				}


				

				
				closeLoading();
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}



function carregaProdutosTiposModelosCanetas(modelo_id){
	if(typeof(ORCAMENTO.caneta) == 'undefined' || typeof(ORCAMENTO.caneta.id) == 'undefined' || ORCAMENTO.caneta == '{}' || ORCAMENTO.caneta == {} || ORCAMENTO.caneta == null){
		ORCAMENTO.caneta = new Object();
	}
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.caneta_id , b.nome from app_produtos_tipos_modelos_canetas a inner join app_canetas b on b.id = a.caneta_id where a.modelo_id = "+modelo_id+" order by a.id;",[], function(tx, res) {
			loga(" qtde app_produtos_tipos_modelos_canetas view: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = ""
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					
					opcoes += '<option value="'+item.caneta_id+'">'+item.nome+'</option>';

					

				}

				$obj = $(	'<h2>Caneta</h2>');
				$('#pag1 .wrapper').append($obj);
				$obj = $(	'<div id="caneta"  class="linha">'+
								// '	<label class="label" for="inputcaneta">Caneta</label>'+
								'	<select class="big" id="inputcaneta" onchange="javascript:mudouCaneta(this);"  name="inputcaneta">'+
								'		<option value="">Selecione</option>'+opcoes+
								'	</select>'+
								'</div>');
				$('#pag1 .wrapper').append($obj);
				$obj = $(	'<div id="canetacor"  class="linha" style="display:block;">'+
					'	<label class="label" for="inputcanetacor">Cor</label>'+
					'	<select class="big" id="inputcanetacor" onchange="javascript:mudouCorCaneta(this);"  name="inputcanetacor">'+
					'		<option value="">Selecione</option>'+
					'	</select>'+
					'</div>');
				$('#pag1 .wrapper').append($obj);


				closeLoading();
				
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}

function carregaCores(obj){
	loadDb();
	loga('###4.2');
	loga('###4.2 = '+ORCAMENTO.caneta.id);
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.id, a.cor, a.caneta_id, a.image from app_canetas_cores a where a.caneta_id =  "+ORCAMENTO.caneta.id +" order by a.id;",[], function(tx, res) {
			loga(" qtde cores view: " + res.rows.length);

			// $('#canetacor select .option').remove();
			
			if (res.rows.length>0) {
				var opcoes = ""
				
				for (var i = 0; i < res.rows.length; i++) {
					
					var selected = "";
					var item = res.rows.item(i);
					if (ORCAMENTO.caneta.cor_id!=-1) {
						if(ORCAMENTO.caneta.cor_id == item.id){
							selected = " selected = 'selected' ";
						}
					}						
					

					$obj = $('<option value="'+item.id+'" '+selected+' data-img="'+item.image+'" class="option" >'+item.cor+'</option>');
					$('#inputcanetacor').append($obj);					

					
				}
				// $('#canetacor').show();



			}else
			closeLoading();

		},function(){

		});
	},function(){});
}
function mudouCorCaneta(obj){
	ORCAMENTO.caneta.cor_id = $('#inputcanetacor').val();
	ORCAMENTO.caneta.cor = $('#inputcanetacor').find("option:selected").text();
	ORCAMENTO.caneta.cor_img = $('#inputcanetacor').find("option:selected").data('img');
	saveOrcamento(ORCAMENTO);		
}
function mudouCaneta(obj){
	loga('mudouCaneta '+$('#inputcaneta').val())
	if ($('#inputcaneta').val()!='') {
		loadDb();
		var caneta_id = $('#inputcaneta').val();

		ORCAMENTO.caneta.id = $('#inputcaneta').val();
		ORCAMENTO.caneta.nome = $('#inputcaneta').find("option:selected").text();
		ORCAMENTO.caneta.cor    = "";
		ORCAMENTO.caneta.cor_id = -1;
		ORCAMENTO.caneta.cor_img = "";
		ORCAMENTO.caneta.customizacoes = [];
		carregaCores();
		saveOrcamento(ORCAMENTO);

		db.transaction(function(tx) {

			tx.executeSql("SELECT a.id, a.customizacao_id , b.nome from app_canetas_customizacoes a inner join app_customizacoes b on b.id = a.customizacao_id where a.caneta_id = "+caneta_id+" order by a.id;",[], function(tx, res) {
				loga(" qtde app_canetas_customizacoes view: " + res.rows.length);

				$('.canetacustom').remove();
				if (res.rows.length>0) {
					var opcoes = ""
					
					for (var i = 0; i < res.rows.length; i++) {


						item = res.rows.item(i);
						if (i!=0) {
							opcoes += ",";						
						}
						opcoes += item.customizacao_id;
						// loga('nome: '+item.nome);		
						// loga("ORCAMENTO.caneta.customizacoes:" +ORCAMENTO.caneta.customizacoes.length);
						ORCAMENTO.caneta.customizacoes[item.id] = new Object();
						ORCAMENTO.caneta.customizacoes[item.id].relacionamento_id = item.id;
						ORCAMENTO.caneta.customizacoes[item.id].customizacao_id = item.customizacao_id;
						ORCAMENTO.caneta.customizacoes[item.id].customizacao_nome = item.nome;
						ORCAMENTO.caneta.customizacoes[item.id].customizacao_opcao_id = 0;
						ORCAMENTO.caneta.customizacoes[item.id].customizacao_opcao_nome = '';
						saveOrcamento(ORCAMENTO);

						$obj = $(	'<div id="canetacusto'+item.customizacao_id+'" data-rel="'+item.id+'" class="canetacustom linha relidcusto'+item.id+'">'+
						// $obj = $(	'<div id="canetacusto'+item.customizacao_id+'" class="linha canetacustom">'+
						'	<label class="label" for="inputcanetacusto'+item.customizacao_id+'">'+item.nome+'</label>'+
						'	<select class="big combocanetacustomizacao"  id="inputcanetacusto'+item.customizacao_id+'"  name="inputcanetacusto'+item.customizacao_id+'">'+
						'		<option value="">Selecione</option>'+
						'	</select>'+
						'</div>');
						$('#pag1 .wrapper').append($obj);

					}
					carregaOpcoesCustomizacao(opcoes,'canetacusto');
					$('.combocanetacustomizacao').change(function(){
						var relid = $(this).closest('.linha').data('rel');
						loga($(this).val());
						loga($(this).find("option:selected").text());
						ORCAMENTO.caneta.customizacoes[relid].customizacao_opcao_id = $(this).val();
						ORCAMENTO.caneta.customizacoes[relid].customizacao_opcao_nome = $(this).find("option:selected").text();
						saveOrcamento(ORCAMENTO);
					});


					

					
				}else
				closeLoading();

			},function(){

			});
		},function(){});
		
	}else{
		$('.canetacustom').remove();
	}
}
function carregaProdutosTiposModelosCanetasRight(caneta_id){
	loga('mudouCaneta '+caneta_id)
	loadDb();
	if (caneta_id!='') {
	loga('####2 ');

		$obj = $(	'<div id="canetacor"  class="linha" style="display:block;">'+
			'	<label class="label" for="inputcanetacor">Cor</label>'+
			'	<select class="big" id="inputcanetacor" onchange="javascript:mudouCorCaneta(this);"  name="inputcanetacor">'+
			'		<option value="">Selecione</option>'+
			'	</select>'+
			'</div>');
		$('#edit_fields .campos').append($obj);
		loga('####3 ');
		// loga(ORCAMENTO.caneta);
		// loga('id: '+ORCAMENTO.caneta.id);
		// loga('length: '+ORCAMENTO.caneta.length);
		// loga($('.compar .itens .item.checked').text());
		loga('####4 ');
		if(typeof(ORCAMENTO.caneta) == 'undefined' || typeof(ORCAMENTO.caneta.id) == 'undefined' || ORCAMENTO.caneta == '{}' || ORCAMENTO.caneta == {} || ORCAMENTO.caneta == null){
			loga('####4.1 ');
			loga('####4.1 ');
			ORCAMENTO.caneta = new Object();
			ORCAMENTO.caneta.id = caneta_id;
			ORCAMENTO.caneta.nome = $('.compar .itens .item.checked').text();
			ORCAMENTO.caneta.cor    = "";
			ORCAMENTO.caneta.cor_id = -1;
			ORCAMENTO.caneta.cor_img = "";
			ORCAMENTO.caneta.customizacoes = [];

		}
		loga('####5 ');
		carregaCores();
		loga('####6 ');
		saveOrcamento(ORCAMENTO);
		loga('####7 ');

		db.transaction(function(tx) {

			tx.executeSql("SELECT a.id, a.customizacao_id , b.nome from app_canetas_customizacoes a inner join app_customizacoes b on b.id = a.customizacao_id where a.caneta_id = "+caneta_id+" order by a.id;",[], function(tx, res) {
				loga(" qtde app_canetas_customizacoes view: " + res.rows.length);

				$('.canetacustom').remove();
				if (res.rows.length>0) {
					var opcoes = ""
					
					for (var i = 0; i < res.rows.length; i++) {


						item = res.rows.item(i);
						if (i!=0) {
							opcoes += ",";						
						}
						opcoes += item.customizacao_id;
						// loga('nome: '+item.nome);		
						// loga("ORCAMENTO.caneta.customizacoes:" +ORCAMENTO.caneta.customizacoes.length);
						ORCAMENTO.caneta.customizacoes[item.id] = new Object();
						ORCAMENTO.caneta.customizacoes[item.id].relacionamento_id = item.id;
						ORCAMENTO.caneta.customizacoes[item.id].customizacao_id = item.customizacao_id;
						ORCAMENTO.caneta.customizacoes[item.id].customizacao_nome = item.nome;
						ORCAMENTO.caneta.customizacoes[item.id].customizacao_opcao_id = 0;
						ORCAMENTO.caneta.customizacoes[item.id].customizacao_opcao_nome = '';
						saveOrcamento(ORCAMENTO);

						$obj = $(	'<div id="canetacusto'+item.customizacao_id+'" data-rel="'+item.id+'" class="canetacustom linha relidcusto'+item.id+'">'+
						// $obj = $(	'<div id="canetacusto'+item.customizacao_id+'" class="linha canetacustom">'+
						'	<label class="label" for="inputcanetacusto'+item.customizacao_id+'">'+item.nome+'</label>'+
						'	<select class="big combocanetacustomizacao"  id="inputcanetacusto'+item.customizacao_id+'"  name="inputcanetacusto'+item.customizacao_id+'">'+
						'		<option value="">Selecione</option>'+
						'	</select>'+
						'</div>');
						$('#edit_fields .campos').append($obj);

					}
					carregaOpcoesCustomizacao(opcoes,'canetacusto');
					$('.combocanetacustomizacao').change(function(){
						var relid = $(this).closest('.linha').data('rel');
						loga($(this).val());
						loga($(this).find("option:selected").text());
						ORCAMENTO.caneta.customizacoes[relid].customizacao_opcao_id = $(this).val();
						ORCAMENTO.caneta.customizacoes[relid].customizacao_opcao_nome = $(this).find("option:selected").text();
						saveOrcamento(ORCAMENTO);
					});


					

					
				}else
				closeLoading();

			},function(){

			});
		},function(){});
		
	}else{
		$('.canetacustom').remove();
	}
}


function carregaProdutosTiposModelosEmbalagens(modelo_id){
	
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.embalagem_id , b.nome from app_produtos_tipos_modelos_embalagens a inner join app_embalagens b on b.id = a.embalagem_id where a.modelo_id = "+modelo_id+" order by a.id;",[], function(tx, res) {
			loga(" qtde app_produtos_tipos_modelos_embalagens view: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = ""
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					var selected = '';

					if(ORCAMENTO.embalagem_id ==item.embalagem_id ){
						selected = 'selected = "selected" ';
					}
					opcoes += '<option '+selected+' value="'+item.embalagem_id+'">'+item.nome+'</option>';


				}


				$obj = $(	'<div id="embalagem" class="linha">'+
					'	<label class="label" for="inputembalagem">Embalagem</label>'+
					'	<select class="big" id="inputembalagem"  name="inputembalagem">'+
					'		<option value="">Selecione</option>'+opcoes+
					'	</select>'+
					'</div>');
				$('#pag2 .wrapper').append($obj);

				$('#inputembalagem').change(function(){

					loga($(this).val());

					ORCAMENTO.embalagem_id= $(this).val();
					ORCAMENTO.embalagem_nome = $(this).find("option:selected").text();
					saveOrcamento(ORCAMENTO);
				});

				
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}
function carregaProdutosTiposModelosEmbalagensRight(modelo_id){
	
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT a.embalagem_id , b.nome from app_produtos_tipos_modelos_embalagens a inner join app_embalagens b on b.id = a.embalagem_id where a.modelo_id = "+modelo_id+" order by a.id;",[], function(tx, res) {
			loga(" qtde app_produtos_tipos_modelos_embalagens view: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = ""
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);
					var selected = '';

					if(ORCAMENTO.embalagem_id ==item.embalagem_id ){
						selected = 'selected = "selected" ';
					}
					opcoes += '<option '+selected+' value="'+item.embalagem_id+'">'+item.nome+'</option>';

					

				}


				$obj = $(	'<div id="embalagem" class="linha">'+
					'	<label class="label" for="inputembalagem">Embalagem</label>'+
					'	<select class="big" id="inputembalagem"  name="inputembalagem">'+
					'		<option value="">Selecione</option>'+opcoes+
					'	</select>'+
					'</div>');
				$('.customizador .campos').append($obj);

				$('#inputembalagem').change(function(){

					loga($(this).val());

					ORCAMENTO.embalagem_id= $(this).val();
					ORCAMENTO.embalagem_nome = $(this).find("option:selected").text();
					saveOrcamento(ORCAMENTO);
				});

				
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}
function carregaFretes(){
	
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT * from app_fretes  order by id;",[], function(tx, res) {
			loga(" qtde estados view: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = ""
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);									
					$obj = $('<option value="'+item.id+'" data-rel="'+item.percentual+'" data-prazo="'+item.prazo+'" >'+item.nome+'</option>');
					$('#inputfrete').append($obj);					
				}					
				
				$('#inputfrete').change(function(){

					loga($(this).val());
					loga($(this).find("option:selected").text());
					ORCAMENTO.frete_id = $(this).val();
					ORCAMENTO.frete_nome = $(this).find("option:selected").text();
					ORCAMENTO.frete_percentual = $(this).find("option:selected").data('rel');
					ORCAMENTO.frete_prazo = $(this).find("option:selected").data('prazo');
					saveOrcamento(ORCAMENTO);
				});
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}
function carregaAgencias(){
	
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT * from app_agencias  order by id;",[], function(tx, res) {
			loga(" qtde app_agencias view: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = ""
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);									
					$obj = $('<option value="'+item.id+'" data-rel="'+item.porcentagem+'" >'+ number_format(item.comissao, 2, ",", "") +'%</option>');
					$('#inputagencia').append($obj);					
				}					
				
				$('#inputagencia').change(function(){

					loga($(this).val());
					loga($(this).find("option:selected").text());
					ORCAMENTO.agencia_id = $(this).val();
					ORCAMENTO.agencia_comissao = $(this).find("option:selected").text();
					ORCAMENTO.agencia_percentual = $(this).find("option:selected").data('rel');
					
					saveOrcamento(ORCAMENTO);
				});
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}
function carregaCondicoes(){
	
	loadDb();
	ORCAMENTO.condicoes_extras = [];
	db.transaction(function(tx) {

		tx.executeSql("SELECT * from app_condicoes  order by order_id;",[], function(tx, res) {
			loga(" qtde condicoes view: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = ""
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);									
					$obj = $('<option value="'+item.ajuste+'" data-codigo="'+item.id+'">'+item.nome+'</option>');
					$('#inputcondicao').append($obj);
					if(item.id == CONDICAO14DIAS){
						//14 dias
						var cond = {
							id:CONDICAO14DIAS,
							ajuste:item.ajuste,
							nome:item.nome,
							tiragens:[]
						};
						ORCAMENTO.condicoes_extras.push(cond);
					}else if(item.id == CONDICAOVENDAFUTURA){
						//venda futura
						var cond = {
							id:CONDICAOVENDAFUTURA,
							ajuste:item.ajuste,
							nome:item.nome,
							tiragens:[]
						};
						ORCAMENTO.condicoes_extras.push(cond);
					}
				}					
				ORCAMENTO.condicao_ajuste = 0;

				$('#inputcondicao').change(function(){

					loga($(this).val());
					loga($(this).find("option:selected").text());
					ORCAMENTO.condicao_id = $(this).find("option:selected").data('codigo');
					ORCAMENTO.condicao_ajuste = $(this).val();
					ORCAMENTO.condicao_nome = $(this).find("option:selected").text();
					saveOrcamento(ORCAMENTO);
				});
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}
function montaComissoeskit(){
	if(ORCAMENTO.compartimentos.length > 0){
		var htmlSelect = $('#inputcomissao').html();
		$('#comissaokit').show();
		$('#comissaokit ul').html('');
		ORCAMENTO.desconto = 0;
		ORCAMENTO.desconto_nome = '';
		$li = $('<li>'+ORCAMENTO.produto_tipo_modelo_nome+' > '+ORCAMENTO.produto_tipo_modelo_cor_nome+'<select class="inputcomissaocaixa" id="inputcomissaocaixa"   name="inputcomissaocaixa">'+htmlSelect+'</select></li>');          	               
		$('#comissaokit ul').append($li);
		for( var x = 0 ; x < ORCAMENTO.compartimentos.length ; x++){
			var item = ORCAMENTO.compartimentos[x];
	        // var strhtml="";
	        // strhtml+= '<div class="ummeio"><div id="compartimento'+item.compartimento_id+'" data-compartimento="'+item.compartimento_id+'" data-compartimento_nome="'+item.compartimento_nome+'"  class="compar detalhes" >';
	        //           strhtml+= '<div class="topo">'+item.compartimento_nome+' </div>';
	        //           strhtml+= '<div class="itens">';
	        for( var i = 0 ; i < item.opcoes.length ; i++){
	        	var opcao = item.opcoes[i];
	        	$li = $('<li>'+opcao.produto_modelo_nome+'<select class="inputcomissaokit" id="inputcomissaokit_'+opcao.produto_modelo_id+'" data-compartimento="'+item.compartimento_id+'"  data-modelo_id="'+opcao.produto_modelo_id+'" data-modelo_nome="'+opcao.produto_modelo_nome+'"  name="inputcomissaokit">'+htmlSelect+'</select></li>');          	               
	        	$('#comissaokit ul').append($li);
	        }

	                  // strhtml+= '</div>';
	                  // strhtml+= '</div>';
	                  // strhtml+= '</div>';

	        // $('#the_compartimentos').append($(strhtml));
	    }
	    $('.inputcomissaocaixa').change(function(){
	    	loga('inputcomissaocaixa changed');	    	
	    	ORCAMENTO.desconto = $(this).val();
	    	ORCAMENTO.desconto_nome = $(this).find('option:selected').text();
	    	saveOrcamento(ORCAMENTO);
	    	calculaValores();
	    });
	    $('.inputcomissaokit').change(function(){
	    	loga('inputcomissaokit changed');
	    	var compartimento_id = $(this).data('compartimento');
	    	var modelo_id = $(this).data('modelo_id');
	    	loga('compartimento_id' +compartimento_id);
	    	loga('modelo_id' +modelo_id);
	    	for( var x = 0 ; x < ORCAMENTO.compartimentos.length ; x++){
	    		var item = ORCAMENTO.compartimentos[x];
	    		if(item.compartimento_id == compartimento_id){
	    			for( var i = 0 ; i < item.opcoes.length ; i++){
	    				var opcao = item.opcoes[i];
	    				if(opcao.produto_modelo_id == modelo_id){
	    					ORCAMENTO.compartimentos[x].opcoes[i].desconto = $(this).val();
	    					ORCAMENTO.compartimentos[x].opcoes[i].desconto_nome = $(this).find('option:selected').text();
	    					saveOrcamento(ORCAMENTO);
	    					calculaValores();
	    					break;
	    				}                  	
	    			}
	    		}
	    	}

	    });
	}
}
function carregaComissoes(){
	
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT * from app_comissoes  order by order_id;",[], function(tx, res) {
			loga(" qtde comissoes: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = ""
				
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);									

					$obj = $('<option value="'+item.desconto+'">'+item.nome+'</option>');
					$('#inputcomissao').append($obj);					
				}					
				montaComissoeskit();
				$('#inputcomissao').change(function(){

					loga($(this).val());
					loga($(this).find("option:selected").text());
					ORCAMENTO.comissao_desconto = $(this).val();
					ORCAMENTO.comissao_nome= $(this).find("option:selected").text();
					saveOrcamento(ORCAMENTO);
					calculaValores();
				});
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}
function carregaEstados(){
	
	loadDb();
	db.transaction(function(tx) {

		tx.executeSql("SELECT * from app_ufs  order by id;",[], function(tx, res) {
			loga(" qtde estados view: " + res.rows.length);

			if (res.rows.length>0) {
				var opcoes = ""
				for (var i = 0; i < res.rows.length; i++) {

					item = res.rows.item(i);									
					$obj = $('<option value="'+item.id+'" data-rel="'+item.regiao_id+'" >'+item.nome+'</option>');
					$('#inputestado').append($obj);					
				}		
				$('#inputestado').change(function(){

					loga($(this).val());
					loga($(this).find("option:selected").text());
					ORCAMENTO.estado_id = $(this).val();
					ORCAMENTO.estado_nome = $(this).find("option:selected").text();
					ORCAMENTO.regiao_id = $(this).find("option:selected").data('rel');
					saveOrcamento(ORCAMENTO);
				});			
				
			}else
			closeLoading();

		},function(){

		});
	},function(){});
}

var valores = new Array();

function calculaValores(){
	if ($('#inputestado').val()=='' ||  $('#inputfrete').val()=='' || $('#inputcondicao').val()=='') {
		navigator.notification.alert(
			'Para calcular os valores é necessário selecionar o estado de destino, o frete e condição de pagamento!',  
			function(){},         
			'Atenção',            
			'Ok'                  
			);
	}else{
		loga('vamos calcular');
		valores = new Array();
		showLoading();
		loadDb();
		db.transaction(function(tx) {
			loga("SELECT a.tiragem_id, b.nome from app_produtos_tipos_tiragens a inner join app_tiragens b on b.id = a.tiragem_id where a.tipo_id = "+ORCAMENTO.produto_tipo_id+"  order by b.order_id,a.id;");
			tx.executeSql("SELECT a.tiragem_id, b.nome from app_produtos_tipos_tiragens a inner join app_tiragens b on b.id = a.tiragem_id where a.tipo_id = "+ORCAMENTO.produto_tipo_id+"  order by b.order_id,a.id;",[], function(tx, res) {
				loga(" qtde tiragens: " + res.rows.length);
				$('#tabelaValores tbody.the_tbody').html('');
				if (res.rows.length>0) {

					for (var i = 0; i < res.rows.length; i++) {
						item = res.rows.item(i);									

						valores[i] = new Object();
						valores[i].tiragem_id = item.tiragem_id;
						valores[i].valor = 0.0;
						var subitens="";
						if( ORCAMENTO.compartimentos.length > 0){
						subitens+=' <a href="javascript:;" data-tiragem="'+item.tiragem_id+'" class="veritens" >Ver Itens</a> ';
						subitens+='<div class="discriminacao"><table>';
						subitens+=	'<tr>'+
		                      '<td>'+ORCAMENTO.produto_tipo_modelo_nome+' > '+ORCAMENTO.produto_tipo_modelo_cor_nome+'</td>'+							                      
		                      // '<td id="tiragem_'+item.tiragem_id+'_compartimento_'+itemOpc.compartimento_id+'_opcao_'+(opcao.produto_modelo_id!='' ? opcao.produto_modelo_id : opcao.produto_caneta_id)+'">0.00</td>'+
		                      '<td id="tiragem_'+item.tiragem_id+'_compartimentocaixa" class="vl_item">0.00</td>'+
		                    '</tr>';
							for(var x = 0; x < ORCAMENTO.compartimentos.length; x ++){

								

								for( var y = 0 ; y <  ORCAMENTO.compartimentos[x].opcoes.length ; y++){
									var opcao =  ORCAMENTO.compartimentos[x].opcoes[y];	
									var idtd = 'tiragem_'+item.tiragem_id+'_compartimento_'+ORCAMENTO.compartimentos[x].compartimento_id+'_opcao_'+(opcao.produto_modelo_id!=''?opcao.produto_modelo_id:opcao.produto_caneta_id)+'';					
									loga("idtd: "+idtd+" vl: 0");
									subitens+=	'<tr>'+
							                       '<td>'+(opcao.produto_modelo_nome!='' ? opcao.produto_modelo_nome : opcao.produto_caneta_nome)+'</td>'+							                      
							                      // '<td>'+opcao.produto_modelo_nome+'</td>'+							                      
							                      // '<td id="tiragem_'+item.tiragem_id+'_compartimento_'+itemOpc.compartimento_id+'_opcao_'+(opcao.produto_modelo_id!='' ? opcao.produto_modelo_id : opcao.produto_caneta_id)+'">0.00</td>'+
							                      '<td id="'+idtd+'">0.00</td>'+
							                    '</tr>';									


								}
							}
						subitens+='</table></div>';
						}
						$obj = $('<tr id="tiragem_'+item.tiragem_id+'" class="tiragemlinha" data-rel="'+item.tiragem_id+'">'+
							'<td class="qtde">'+item.nome+subitens+'</td>'+
							'<td class="valor"></td>'+
							'<td class="total"></td>'+
							'<td>'+
							'<div class="checkbtn">'+
							' <input type="checkbox" name="tiragem[]" class="checks" value="'+item.tiragem_id+'" id="checktiragem'+item.tiragem_id+'" />'+
							' <label for="checktiragem'+item.tiragem_id+'"></label>'+
							'</div>'+							
							'</td>'+
							'</tr>');
						$('#tabelaValores tbody.the_tbody').append($obj);					
					}
					trazValores();		


				}
				$('.veritens').click( function(){
					$(this).closest('tr').find('.discriminacao').toggle();
					$(this).toggleClass('active')
				});


			},function(e){
				loga('e:'+JSON.stringify(e));
			});
		},function(){});
	}
}
function setaValor(valor,tiragem_id){
	valor = parseFloat(valor).toFixed(2);
	// loga('setaValor--'+valor);
	for(var r=0; r < valores.length; r++){
		if(valores[r].tiragem_id == tiragem_id){
			// loga("vl|"+valor+'|'+tiragem_id);
			valores[r].valor = 0 + parseFloat(valores[r].valor) + parseFloat(valor);
			valores[r].valor = parseFloat(valores[r].valor).toFixed(2);
			break;
		}
	}
}
function trazValores(){
	loadDb();
	db.transaction(function(tx) {
		$('.tiragemlinha').each(function(){
			$linha = $(this);
			var valor = 0;
			$mtiragem_id = $linha.data('rel');

			somaProduto($mtiragem_id);
			somaEmbalagem($mtiragem_id);
			somaCustomizacoes($mtiragem_id);
			somaCanetas($mtiragem_id);
			somaCanetasCustomizacoes($mtiragem_id);
			somaCompartimentos($mtiragem_id);
			somaCompartimentosCustomizacoes($mtiragem_id);

			somaSubProdutos($mtiragem_id);
			somaSubProdutosCustomizacoes($mtiragem_id);
			
		});

	},function(){
	// closeLoading();
});

	setTimeout(
		function() 
		{
			somavalores();
		}, 5000);														

}
function somaProduto(ztiragem_id){
	loadDb();
	db.transaction(function(tx) {
	//preco embalagem
	
	tx.executeSql("SELECT * from app_precos_produtos a  where a.regiao_id ="+ORCAMENTO.regiao_id+" and a.modelo_id =  "+ORCAMENTO.produto_tipo_modelo_id+" and a.tiragem_id = "+ztiragem_id+" ;",[], function(tx, res) {
					// loga(" qtde preco: " + res.rows.length);
					if (res.rows.length>0) {
						for (var q = 0; q < res.rows.length; q++) {
							item = res.rows.item(q);
							
							setaValor(parseFloat(item.valor),parseInt(item.tiragem_id));

							$obj = $('<span>prd->'+item.valor+'|</span>');
							$('#tiragem_'+item.tiragem_id+' .valor').append($obj);		
							var idcaixa = '#tiragem_'+item.tiragem_id+'_compartimentocaixa';
							if($(idcaixa).length>0){			
								$(idcaixa).text(item.valor);	
								console.log("vlcaixa - >"+item.valor);				
							}
						}						
					}

				},function(e){
					loga('deu pau3 e:'+JSON.stringify(e));
					});//end embalagem

},function(){
	// closeLoading();
});

}
function somaSubProdutos(ztiragem_id){
	loadDb();
	db.transaction(function(tx) {
		//SUBPRODUTOS
		if(ORCAMENTO.produto_tipo_modelo_qtde_subprodutos > 0){
			// loga('SUBPRODUTOS calulando customizacoes');
			if (ORCAMENTO.subprodutos.length>0) {
				for(var x = 0; x < ORCAMENTO.subprodutos.length; x++){	
					if (ORCAMENTO.subprodutos[x]) {
						tx.executeSql("SELECT * from app_precos_produtos a  where a.regiao_id ="+ORCAMENTO.regiao_id+" and a.modelo_id =  "+ORCAMENTO.subprodutos[x].produto_modelo_id+" and a.tiragem_id = "+ztiragem_id+" ;",[], function(tx, res) {
							// loga("SUBPRODUTO qtde preco: " + res.rows.length);
							if (res.rows.length>0) {
								for (var z = 0; z < res.rows.length; z++) {
									prsub = res.rows.item(z);
									
									setaValor(parseFloat(prsub.valor),parseInt(prsub.tiragem_id));

									$obj = $('<span>sub->'+prsub.valor+'|</span>');
									$('#tiragem_'+prsub.tiragem_id+' .valor').append($obj);					
								}						
							}



						},function(e){
							loga('deu pau2b e:'+JSON.stringify(e));
						});


					}
				}

			}
		}//end subproduto
	},function(){
	// closeLoading();
});

}

function somaCompartimentos(ztiragem_id){
	loadDb();
	db.transaction(function(tx) {
		//SUBPRODUTOS
		if(ORCAMENTO.compartimentos.length > 0){
			// loga('SUBPRODUTOS calulando customizacoes');
			
			for(var x = 0; x < ORCAMENTO.compartimentos.length; x++){	
				var item = ORCAMENTO.compartimentos[x];
				for( var i = 0 ; i < item.opcoes.length ; i++){
					var opcao = item.opcoes[i];
					if(opcao.produto_modelo_id){


					var query = "SELECT * from app_precos_produtos a  where a.regiao_id ="+ORCAMENTO.regiao_id+" and a.modelo_id =  "+opcao.produto_modelo_id+" and a.tiragem_id = "+ztiragem_id+" ;";
					loga(query);
					tx.executeSql(query,[], function(tx, res) {
							loga("somaCompartimentos SUBPRODUTO qtde preco: " + res.rows.length);
							if (res.rows.length>0) {
								for (var z = 0; z < res.rows.length; z++) {
									prsub = res.rows.item(z);
									
									setaValor(parseFloat(prsub.valor),parseInt(prsub.tiragem_id));

									$obj = $('<span>sub->'+prsub.valor+'|</span>');
									$('#tiragem_'+prsub.tiragem_id+' .valor').append($obj);


									for(var x1 = 0; x1 < ORCAMENTO.compartimentos.length; x1++){											
										for( var i1 = 0 ; i1 < ORCAMENTO.compartimentos[x1].opcoes.length ; i1++){
											 if(ORCAMENTO.compartimentos[x1].opcoes[i1].produto_modelo_id == prsub.modelo_id){
												var idtable ='tiragem_'+prsub.tiragem_id+'_compartimento_'+ORCAMENTO.compartimentos[x1].compartimento_id+'_opcao_'+ORCAMENTO.compartimentos[x1].opcoes[i1].produto_modelo_id;
												loga('soma compartimento #'+idtable+" vl: "+prsub.valor);
												$('#'+idtable).text(prsub.valor);

											 }
										}
									}



								}						
							}



						},function(e){
							loga('deu pau2c e:'+JSON.stringify(e));
						});
				}


				}
			}

			
		}//end subproduto
	},function(){
	// closeLoading();
});

}

function somaCompartimentosCustomizacoes(ztiragem_id){
	loadDb();
	db.transaction(function(tx) {
		//SUBPRODUTOS
		if( ORCAMENTO.compartimentos.length > 0){
			// loga('KITS OPCOES calulando customizacoes');
			
			for(var x = 0; x < ORCAMENTO.compartimentos.length; x++){	
				var item = ORCAMENTO.compartimentos[x];
				if (ORCAMENTO.subprodutos[x]) {
						//SUBPRODUTOS precos das customizacoes
						for( var i = 0 ; i < item.opcoes.length ; i++){
							var opcao = item.opcoes[i];
							// loga(' SUBPRODUTO calulando customizacoes');
							if (opcao.customizacoes.length>0) {
								for(var y = 0; y < opcao.customizacoes.length; y++){	
									if (opcao.customizacoes[y]) {
										tx.executeSql("SELECT * from app_precos_customizacoes a  where a.regiao_id ="+ORCAMENTO.regiao_id+" and a.opcao_id =  "+opcao.customizacoes[y].customizacao_opcao_id+" and a.tiragem_id = "+ztiragem_id+" ;",[], function(tx, res) {
											loga(" qtde preco customizacao subproduto: " + res.rows.length);
											if (res.rows.length>0) {
												for (var a = 0; a < res.rows.length; a++) {
													prcus = res.rows.item(a);

													setaValor(parseFloat(prcus.valor),parseInt(prcus.tiragem_id));	

													$obj = $('<span>sc->'+prcus.valor+'|</span>');
													$('#tiragem_'+prcus.tiragem_id+' .valor').append($obj);	

													for(var x1 = 0; x1 < ORCAMENTO.compartimentos.length; x1++){											
														for( var i1 = 0 ; i1 < ORCAMENTO.compartimentos[x1].opcoes.length ; i1++){
															 if(ORCAMENTO.compartimentos[x1].opcoes[i1].produto_modelo_id == prsub.modelo_id){
																var idtable ='tiragem_'+prcus.tiragem_id+'_compartimento_'+ORCAMENTO.compartimentos[x1].compartimento_id+'_opcao_'+ORCAMENTO.compartimentos[x1].opcoes[i1].produto_modelo_id;
																loga('soma compartimento customizacoes #'+idtable+" vl: "+prcus.valor);
																var vlsum = parseFloat($('#'+idtable).text());			
																vlsum  += prcus.valor;
																$('#'+idtable).text(vlsum);		

															 }
														}
													}

		
												}						
											}

										},function(e){
											loga('deu pau2d e:'+JSON.stringify(e));
										});

									}
								}

							}
						}										

					}
				}


		}//end subproduto
	},function(){
		// closeLoading();
	});

}
function somaSubProdutosCustomizacoes(ztiragem_id){
	loadDb();
	db.transaction(function(tx) {
		//SUBPRODUTOS
		if(ORCAMENTO.produto_tipo_modelo_qtde_subprodutos > 0){
			loga('SUBPRODUTOS calulando customizacoes');
			if (ORCAMENTO.subprodutos.length>0) {
				for(var x = 0; x < ORCAMENTO.subprodutos.length; x++){	
					if (ORCAMENTO.subprodutos[x]) {
						//SUBPRODUTOS precos das customizacoes
						if(ORCAMENTO.subprodutos[x].customizacoes){
							// loga(' SUBPRODUTO calulando customizacoes');
							if (ORCAMENTO.subprodutos[x].customizacoes.length>0) {
								for(var y = 0; y < ORCAMENTO.subprodutos[x].customizacoes.length; y++){	
									if (ORCAMENTO.subprodutos[x].customizacoes[y]) {
										tx.executeSql("SELECT * from app_precos_customizacoes a  where a.regiao_id ="+ORCAMENTO.regiao_id+" and a.opcao_id =  "+ORCAMENTO.subprodutos[x].customizacoes[y].customizacao_opcao_id+" and a.tiragem_id = "+ztiragem_id+" ;",[], function(tx, res) {
											loga(" qtde preco customizacao subproduto: " + res.rows.length);
											if (res.rows.length>0) {
												for (var a = 0; a < res.rows.length; a++) {
													prcus = res.rows.item(a);

													setaValor(parseFloat(prcus.valor),parseInt(prcus.tiragem_id));	

													$obj = $('<span>sc->'+prcus.valor+'|</span>');
													$('#tiragem_'+prcus.tiragem_id+' .valor').append($obj);					
												}						
											}

										},function(e){
											loga('deu pau2e e:'+JSON.stringify(e));
										});

									}
								}

							}
						}										

					}
				}

			}
		}//end subproduto
	},function(){
		// closeLoading();
	});

}
function somaEmbalagem(ztiragem_id){
	loadDb();
	db.transaction(function(tx) {
	//preco embalagem
	
	tx.executeSql("SELECT * from app_precos_embalagens a  where a.regiao_id ="+ORCAMENTO.regiao_id+" and a.embalagem_id =  "+ORCAMENTO.embalagem_id+" and a.tiragem_id = "+ztiragem_id+" ;",[], function(tx, res) {
		if (res.rows.length>0) {
			for (var e = 0; e < res.rows.length; e++) {
				prcus = res.rows.item(e);


				setaValor(parseFloat(prcus.valor),parseInt(prcus.tiragem_id));
				$obj = $('<span>emb->'+prcus.valor+'|</span>');
				$('#tiragem_'+prcus.tiragem_id+' .valor').append($obj);
				var idcaixa = '#tiragem_'+prcus.tiragem_id+'_compartimentocaixa';
				if($(idcaixa).length>0){					
					var vlcaixa = parseFloat($(idcaixa).text());				
					vlcaixa += 0+prcus.valor;
					
					console.log("embvlcaixa - >"+vlcaixa);
					console.log("EMBALAGEM - >"+prcus.valor);
					$(idcaixa).text(vlcaixa);				
				}	
			}						
		}

	},function(e){
		loga('deu pau3 e:'+JSON.stringify(e));
					});//end embalagem

},function(){
	// closeLoading();
});

}
function somaCustomizacoes(ztiragem_id){
	loadDb();
	db.transaction(function(tx) {

	//precos das customizacoes
	if(ORCAMENTO.customizacoes){

		if (ORCAMENTO.customizacoes.length>0) {
			for(var x = 0; x < ORCAMENTO.customizacoes.length; x++){	
				// loga(ORCAMENTO.customizacoes[x]);
				if (ORCAMENTO.customizacoes[x]) {
					// loga("SELECT * from app_precos_customizacoes a  where a.regiao_id ="+ORCAMENTO.regiao_id+" and a.opcao_id =  "+ORCAMENTO.customizacoes[x].customizacao_opcao_id+" and a.tiragem_id = "+ztiragem_id+" ;");
					tx.executeSql("SELECT * from app_precos_customizacoes a  where a.regiao_id ="+ORCAMENTO.regiao_id+" and a.opcao_id =  "+ORCAMENTO.customizacoes[x].customizacao_opcao_id+" and a.tiragem_id = "+ztiragem_id+" ;",[], function(tx, res) {

						if (res.rows.length>0) {
							for (var w = 0; w < res.rows.length; w++) {
								prcus = res.rows.item(w);
								
								setaValor(parseFloat(prcus.valor),parseInt(prcus.tiragem_id));

								$obj = $('<span>cus->'+prcus.valor+'|</span>');
								$('#tiragem_'+prcus.tiragem_id+' .valor').append($obj);	

								var idcaixa = '#tiragem_'+prcus.tiragem_id+'_compartimentocaixa';
								if($(idcaixa).length>0){					
									var vlcaixa = parseFloat($(idcaixa).text());				
									vlcaixa += 0+prcus.valor;
									$(idcaixa).text(vlcaixa);
									console.log("custovlcaixa - >"+vlcaixa);
									console.log("CUSTOMIZACOES - >"+prcus.valor);
								}				
							}						
						}

					},function(e){
						loga('deu pau2f e:'+JSON.stringify(e));
					});

				}
			}

		}
					}//end customizacoes


				},function(){
	// closeLoading();
});

}
function somaCanetas(ztiragem_id){
	loadDb();
	db.transaction(function(tx) {


					//preco caneta
					if (ORCAMENTO.caneta.id){
						loga('calulando caneta ');
						tx.executeSql("SELECT * from app_precos_canetas a  where a.regiao_id ="+ORCAMENTO.regiao_id+" and a.caneta_id =  "+ORCAMENTO.caneta.id+" and a.tiragem_id = "+ztiragem_id+" ;",[], function(tx, res) {
							loga('qtde de canetas--'+res.rows.length);
							if (res.rows.length>0) {
								loga('qtde de canetas > 0');
								for (var t = 0; t < res.rows.length; t++) {
									var prcus = res.rows.item(t);
									
									setaValor(parseFloat(prcus.valor),parseInt(prcus.tiragem_id));	
									// loga('<span>ca->'+prcus.valor+'|</span>'); 	
									$obj = $('<span>ca->'+prcus.valor+'|</span>');
									$('#tiragem_'+prcus.tiragem_id+' .valor').append($obj);		

									for(var x1 = 0; x1 < ORCAMENTO.compartimentos.length; x1++){											
										for( var i1 = 0 ; i1 < ORCAMENTO.compartimentos[x1].opcoes.length ; i1++){
											 if(ORCAMENTO.compartimentos[x1].opcoes[i1].produto_caneta_id == prcus.caneta_id){
												var idtable ='tiragem_'+prcus.tiragem_id+'_compartimento_'+ORCAMENTO.compartimentos[x1].compartimento_id+'_opcao_'+ORCAMENTO.compartimentos[x1].opcoes[i1].produto_caneta_id;
												loga('soma compartimento caneta #'+idtable+" vl: "+prcus.valor);
												$('#'+idtable).text(prcus.valor);

											 }
										}
									}			
								}						
							}


							// if(ORCAMENTO.caneta.customizacoes){
							// 	loga('calulando customizacoes de canetas');
							// 	if (ORCAMENTO.caneta.customizacoes.length>0) {
							// 		for(var x = 0; x < ORCAMENTO.caneta.customizacoes.length; x++){	
							// 			if (ORCAMENTO.caneta.customizacoes[x]) {
							// 				tx.executeSql("SELECT * from app_precos_customizacoes a  where a.regiao_id ="+ORCAMENTO.regiao_id+" and a.opcao_id =  "+ORCAMENTO.caneta.customizacoes[x].customizacao_opcao_id+" and a.tiragem_id = "+ztiragem_id+" ;",[], function(tx, res) {
							// 					// loga(" qtde preco: " + res.rows.length);
							// 					if (res.rows.length>0) {
							// 						for (var t = 0; t < res.rows.length; t++) {
							// 							prcuscan = res.rows.item(t);
							// 							valor += prcuscan.valor;	
							// 							setaValor(parseFloat(prcuscan.valor),parseInt(prcuscan.tiragem_id));
							// 							if (prcuscan.tiragem_id==16){
							// 								// loga('CANETA app_precos_customizacoes item.valor:'+prcuscan.valor);
							// 							}
							// 							$obj = $('<span>ca->'+prcuscan.valor+'|</span>');
							// 							$('#tiragem_'+prcuscan.tiragem_id+' .valor').append($obj);					
							// 						}						
							// 					}

							// 				},function(e){
							// 					loga('deu pau2 e:'+JSON.stringify(e));
							// 				});

							// 			}
							// 		}

							// 	}
							// }


						},function(e){
							loga('deu pau4 e:'+JSON.stringify(e));
						});
						
					}//end caneta


				},function(){
	// closeLoading();
});

}
function somaCanetasCustomizacoes(ztiragem_id){
	loadDb();
	db.transaction(function(tx) {




		if(ORCAMENTO.caneta.customizacoes){
			loga('calulando customizacoes de canetas');
			if (ORCAMENTO.caneta.customizacoes.length>0) {
				for(var x = 0; x < ORCAMENTO.caneta.customizacoes.length; x++){	
					if (ORCAMENTO.caneta.customizacoes[x]) {
						tx.executeSql("SELECT * from app_precos_customizacoes a  where a.regiao_id ="+ORCAMENTO.regiao_id+" and a.opcao_id =  "+ORCAMENTO.caneta.customizacoes[x].customizacao_opcao_id+" and a.tiragem_id = "+ztiragem_id+" ;",[], function(tx, res) {
							loga(" qtde precos de CANETAS CUSTOMIZACOES: " + res.rows.length);
							if (res.rows.length>0) {
								for (var t = 0; t < res.rows.length; t++) {
									prcuscan = res.rows.item(t);
									valor += prcuscan.valor;	
									setaValor(parseFloat(prcuscan.valor),parseInt(prcuscan.tiragem_id));
									if (prcuscan.tiragem_id==16){
									// loga('CANETA app_precos_customizacoes item.valor:'+prcuscan.valor);
								}
								$obj = $('<span>cc->'+prcuscan.valor+'|</span>');
								$('#tiragem_'+prcuscan.tiragem_id+' .valor').append($obj);	
								for(var x1 = 0; x1 < ORCAMENTO.compartimentos.length; x1++){											
										for( var i1 = 0 ; i1 < ORCAMENTO.compartimentos[x1].opcoes.length ; i1++){
											 if(ORCAMENTO.compartimentos[x1].opcoes[i1].produto_caneta_id == ORCAMENTO.caneta.id){
												var idtable ='tiragem_'+prcuscan.tiragem_id+'_compartimento_'+ORCAMENTO.compartimentos[x1].compartimento_id+'_opcao_'+ORCAMENTO.compartimentos[x1].opcoes[i1].produto_caneta_id;
												loga('soma compartimento caneta #'+idtable+" vl: "+prcuscan.valor);
												var vlsum = parseFloat($('#'+idtable).text());			
												vlsum  += prcuscan.valor;
												$('#'+idtable).text(vlsum);		

												// $('#'+idtable).text(prcuscan.valor);

											 }
										}
									}					
							}						
						}

					},function(e){
						loga('deu pau2a e:'+JSON.stringify(e));
					});

					}
				}

			}
		}





	},function(){
	// closeLoading();
});

}
function somavalores(){
	ORCAMENTO.comissao_desconto = $('#inputcomissao').val();
	ORCAMENTO.comissao_nome= $('#inputcomissao').find("option:selected").text();

	ORCAMENTO.agencia_id = $("#inputagencia").val();
	ORCAMENTO.agencia_comissao = $("#inputagencia").find("option:selected").text();
	ORCAMENTO.agencia_percentual = $("#inputagencia").find("option:selected").data('rel');
	var ajuste = window.localStorage.getItem('AJUSTE');
	ORCAMENTO.ajuste = ajuste;
	var multiplicador_usuario = window.localStorage.getItem('USUARIO_MULTIPLICADOR');
	ORCAMENTO.multiplicador_usuario = multiplicador_usuario;

for(var cv = 0 ; cv < ORCAMENTO.condicoes_extras.length ; cv++){						
	ORCAMENTO.condicoes_extras[cv].tiragens = [];
}
	for(var c=0; c < valores.length; c++){
		var soma = 0.0;
		

			// soma+=parseFloat($valores[c]);
			if(valores[c]){
				loga(">>--"+valores[c].tiragem_id+"##"+parseFloat(valores[c].valor));
				


				var unitario = parseFloat(valores[c].valor).toFixed(2);

				if(multiplicador_usuario>0){
					unitario = unitario * multiplicador_usuario;					
				}


				var comissao = unitario *  (parseFloat(ORCAMENTO.condicao_ajuste).toFixed(2)/100);
				comissao  = comissao.toFixed(2);

				unitario = parseFloat(unitario) + parseFloat(comissao);
				// loga(">>--condicao"+unitario);
				unitario = unitario - (unitario * (parseFloat(ORCAMENTO.comissao_desconto).toFixed(2) /100));
				// loga(">>--comissao"+unitario);
				unitario = unitario + (unitario * (parseFloat(ORCAMENTO.frete_percentual).toFixed(2) /100));

				if (parseFloat(ORCAMENTO.agencia_percentual).toFixed(3) > 0) {
					unitario = unitario / parseFloat(ORCAMENTO.agencia_percentual).toFixed(3);        			
				}
				if(ajuste>0){
					var vlAjuste = (unitario*ajuste)/100;
					console.log('vlAjuste:'+vlAjuste);
					unitario = unitario +  parseFloat(vlAjuste).toFixed(2);	
				}
				// loga(">>--frete"+unitario);
				unitario = parseFloat(unitario).toFixed(2);

						// loga('ORCAMENTO.condicao_id'+ORCAMENTO.condicao_id);
						// loga('CONDICAOVENDAFUTURA'+CONDICAOVENDAFUTURA);
				if(ORCAMENTO.condicao_id!=CONDICAOVENDAFUTURA)	{
					//coloca venda futura
					for(var cv = 0 ; cv < ORCAMENTO.condicoes_extras.length ; cv++){
						// loga('ORCAMENTO.condicoes_extras.length'+ORCAMENTO.condicoes_extras.length);
						if(ORCAMENTO.condicoes_extras[cv].id == CONDICAOVENDAFUTURA){
							// ORCAMENTO.condicoes_extras[cv].tiragens = [];
							var cvUnitario = parseFloat(valores[c].valor).toFixed(2);
							var comissao = cvUnitario *  (parseFloat(ORCAMENTO.condicoes_extras[cv].ajuste).toFixed(2)/100);
							comissao  = comissao.toFixed(2);
							cvUnitario = parseFloat(cvUnitario) + parseFloat(comissao);							
							cvUnitario = cvUnitario - (cvUnitario * (parseFloat(ORCAMENTO.comissao_desconto).toFixed(2) /100));							
							cvUnitario = cvUnitario + (cvUnitario * (parseFloat(ORCAMENTO.frete_percentual).toFixed(2) /100));
							if (parseFloat(ORCAMENTO.agencia_percentual).toFixed(3) > 0) {
								cvUnitario = cvUnitario / parseFloat(ORCAMENTO.agencia_percentual).toFixed(3);        			
							}												
							cvUnitario = parseFloat(cvUnitario).toFixed(2);
							$qtde2 = $('#tiragem_'+valores[c].tiragem_id+' .qtde').text().split(' ');
			
							var qtt = parseInt($qtde2[0]);
							var objVal = {
								tiragem_id:valores[c].tiragem_id,
								qtde: qtt,
								unitario:cvUnitario,
								total:parseFloat(cvUnitario*qtt).toFixed(2)
							};
							// loga('venda futura');
							// loga(objVal);
							ORCAMENTO.condicoes_extras[cv].tiragens.push(objVal);
						}
					}
					if(ORCAMENTO.condicao_id!=CONDICAO14DIAS)	{
						//coloca 14 dias

						for(var cv = 0 ; cv < ORCAMENTO.condicoes_extras.length ; cv++){
						if(ORCAMENTO.condicoes_extras[cv].id == CONDICAO14DIAS){
							// ORCAMENTO.condicoes_extras[cv].tiragens = [];
							var cvUnitario = parseFloat(valores[c].valor).toFixed(2);
							var comissao = cvUnitario *  (parseFloat(ORCAMENTO.condicoes_extras[cv].ajuste).toFixed(2)/100);
							comissao  = comissao.toFixed(2);
							cvUnitario = parseFloat(cvUnitario) + parseFloat(comissao);							
							cvUnitario = cvUnitario - (cvUnitario * (parseFloat(ORCAMENTO.comissao_desconto).toFixed(2) /100));							
							cvUnitario = cvUnitario + (cvUnitario * (parseFloat(ORCAMENTO.frete_percentual).toFixed(2) /100));
							if (parseFloat(ORCAMENTO.agencia_percentual).toFixed(3) > 0) {
								cvUnitario = cvUnitario / parseFloat(ORCAMENTO.agencia_percentual).toFixed(3);        			
							}												
							cvUnitario = parseFloat(cvUnitario).toFixed(2);

							$qtde2 = $('#tiragem_'+valores[c].tiragem_id+' .qtde').text().split(' ');
							var qtt = parseInt($qtde2[0]);
							var objVal = {
								tiragem_id:valores[c].tiragem_id,
								qtde: qtt,
								unitario:cvUnitario,
								total:parseFloat(cvUnitario*qtt).toFixed(2)
							};
							ORCAMENTO.condicoes_extras[cv].tiragens.push(objVal);
						}
					}
					}
				}





				var idcaixa = '#tiragem_'+valores[c].tiragem_id+'_compartimentocaixa';
				if($(idcaixa).length>0){			
					var valorCaixa = parseFloat($(idcaixa).text());	
					var comissao = valorCaixa *  (parseFloat(ORCAMENTO.condicao_ajuste).toFixed(2)/100);
					comissao  = comissao.toFixed(2);

					valorCaixa = parseFloat(valorCaixa) + parseFloat(comissao);
					// loga(">>--condicao"+valorCaixa);
					valorCaixa = valorCaixa - (valorCaixa * (parseFloat(ORCAMENTO.comissao_desconto).toFixed(2) /100));
					// loga(">>--comissao"+valorCaixa);
					valorCaixa = valorCaixa + (valorCaixa * (parseFloat(ORCAMENTO.frete_percentual).toFixed(2) /100));

					if (parseFloat(ORCAMENTO.agencia_percentual).toFixed(3) > 0) {
						valorCaixa = valorCaixa / parseFloat(ORCAMENTO.agencia_percentual).toFixed(3);        			
					}
					
					// loga(">>--frete"+valorCaixa);
					valorCaixa = parseFloat(valorCaixa).toFixed(2);
					$(idcaixa).text(valorCaixa);

					$tabelaitem = $(idcaixa).closest('.discriminacao');
					$tabelaitem.find('table .vl_item').each(function(){
						var valorItem = parseFloat($(this).text());	
						var comissao = valorItem *  (parseFloat(ORCAMENTO.condicao_ajuste).toFixed(2)/100);
						comissao  = comissao.toFixed(2);

						valorItem = parseFloat(valorItem) + parseFloat(comissao);
						// loga(">>--condicao"+valorItem);
						valorItem = valorItem - (valorItem * (parseFloat(ORCAMENTO.comissao_desconto).toFixed(2) /100));
						// loga(">>--comissao"+valorItem);
						valorItem = valorItem + (valorItem * (parseFloat(ORCAMENTO.frete_percentual).toFixed(2) /100));

						if (parseFloat(ORCAMENTO.agencia_percentual).toFixed(3) > 0) {
							valorItem = valorItem / parseFloat(ORCAMENTO.agencia_percentual).toFixed(3);        			
						}
						
						// loga(">>--frete"+valorItem);
						valorItem = parseFloat(valorItem).toFixed(2);
						$(this).text(valorItem);
					});
				}
				unitario = parseFloat(unitario).toFixed(1);

				$('#tiragem_'+valores[c].tiragem_id+' .valor').html('R$ '+ number_format(unitario, 2, ',', '.') );
				$qtde = parseInt($('#tiragem_'+valores[c].tiragem_id+' .qtde').text());
				var total = parseFloat($qtde*unitario).toFixed(2);
				// total = parseFloat(total).toFixed(2);
				$('#tiragem_'+valores[c].tiragem_id+' .total').html('R$ '+ number_format(total, 2, ',', '.') );
			}
		}
		saveOrcamento(ORCAMENTO);
		closeLoading();
	}
