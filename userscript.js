// ==UserScript==
// @name           MV Usertools
// @namespace      MVusertools
// @description    Añade controles avanzados a los posts en MV
// @include        http://www.mediavida.com/*
// @exclude        http://www.mediavida.com/foro/reportes.php
// @exclude        http://www.mediavida.com/notificaciones*
// @exclude        http://www.mediavida.com/invitaciones*
// @exclude        http://www.mediavida.com/mensajes*
// @exclude        http://www.mediavida.com/online*
// @exclude        http://www.mediavida.com/grupos*
// @exclude        http://www.mediavida.com/g/*
// @exclude        http://www.mediavida.com/clanes*
// @exclude        http://www.mediavida.com/stream*
// ==/UserScript==

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}







function main() {
		jQuery.noConflict();
		// Magia con botones
		var bbcode = new Array();
		var bbtags = new Array("[b]", "[/b]", "[i]", "[/i]", "[u]", "[/u]", "[url]", "[/url]", "[url=]", "[/url]", "[img]", "[/img]", "[video]", "[/video]", "[spoiler]", "[/spoiler]", "[spoiler=]", "[/spoiler]", "[spoiler=NSFW]", "[/spoiler]", "[code]", "[/code]", "[center]", "[/center]", "[s]", "[/s]", "[bar]", "[/bar]", "[list]", "[/list]", "[audio]", "[/audio]");
		var theSelection = false;
		var clientPC = navigator.userAgent.toLowerCase();
		var clientVer = parseInt(navigator.appVersion);
		var is_ie = ((clientPC.indexOf("msie") != -1) && (clientPC.indexOf("opera") == -1));
		var is_win = ((clientPC.indexOf("win") != -1) || (clientPC.indexOf("16bit") != -1));
		var baseHeight;
		var is_dark = jQuery("link[rel='stylesheet']").filter(function(){return this.href.match('\/style\/[0-9]+\/mv_oscuro\.css')}).length > 0;

		function initInsertions() {
			var b;
			if (document.forms[form_name]) {
				b = document;
			} else {
				b = opener.document;
			}
			var a = b.forms[form_name].elements[text_name];
			if (is_ie && typeof (baseHeight) != "number") {
				a.focus();
				baseHeight = b.selection.createRange().duplicate().boundingHeight;
				if (!document.forms[form_name]) {
					document.body.focus();
				}
			}
		}
		function bbstyle2(a) {
			if (a >= 0 && a <= 30) {
				bbfontstyle(bbtags[a], bbtags[a + 1]);
			}
			else
				console.log("fuera de rango");
		}
		function bbfontstyle(b, f) {
			theSelection = false;
			var d = document.forms[form_name].elements[text_name];
			d.focus();
			if ((clientVer >= 4) && is_ie && is_win) {
				theSelection = document.selection.createRange().text;
				if (theSelection) {
					document.selection.createRange().text = b + theSelection + f;
					document.forms[form_name].elements[text_name].focus();
					theSelection = "";
					return;
				}
			} else {
				if (document.forms[form_name].elements[text_name].selectionEnd && (document.forms[form_name].elements[text_name].selectionEnd - document.forms[form_name].elements[text_name].selectionStart > 0)) {
					mozWrap(document.forms[form_name].elements[text_name], b, f);
					document.forms[form_name].elements[text_name].focus();
					theSelection = "";
					return;
				}
			}
			var a = getCaretPosition(d).start;
			var c = a + b.length;
			insert_text(b + f);
			if (!isNaN(d.selectionStart)) {
				d.selectionStart = c;
				d.selectionEnd = c;
			} else {
				if (document.selection) {
					var e = d.createTextRange();
					e.move("character", c);
					e.select();
					storeCaret(d);
				}
			}
			d.focus();
			return;
		}
		function insert_text(g, d, c) {
			var b;
			if (!c) {
				b = document.forms[form_name].elements[text_name];
			} else {
				b = opener.document.forms[form_name].elements[text_name];
			}
			if (d) {
				g = " " + g + " ";
			}
			if (!isNaN(b.selectionStart)) {
				var f = b.selectionStart;
				var e = b.selectionEnd;
				mozWrap(b, g, "");
				b.selectionStart = f + g.length;
				b.selectionEnd = e + g.length;
			} else {
				if (b.createTextRange && b.caretPos) {
					if (baseHeight != b.caretPos.boundingHeight) {
						b.focus();
						storeCaret(b);
					}
					var a = b.caretPos;
					a.text = a.text.charAt(a.text.length - 1) == " " ? a.text + g + " " : a.text + g;
				} else {
					b.value = b.value + g;
				}
			}
			if (!c) {
				b.focus();
			}
		}
		function mozWrap(g, d, j) {
			var c = g.textLength;
			var a = g.selectionStart;
			var e = g.selectionEnd;
			var b = g.scrollTop;
			if (e == 1 || e == 2) {
				e = c;
			}
			var i = (g.value).substring(0, a);
			var h = (g.value).substring(a, e);
			var f = (g.value).substring(e, c);
			g.value = i + d + h + j + f;
			g.selectionStart = e + d.length + j.length;
			g.selectionEnd = g.selectionStart;
			g.focus();
			g.scrollTop = b;
			return;
		}
		function storeCaret(a) {
			if (a.createTextRange) {
				a.caretPos = document.selection.createRange().duplicate();
			}
		}
		function caretPosition() {
			var b = null;
			var a = null;
		}
		function getCaretPosition(e) {
			var c = new caretPosition();
			if (e.selectionStart || e.selectionStart == 0) {
				c.start = e.selectionStart;
				c.end = e.selectionEnd;
			} else {
				if (document.selection) {
					var a = document.selection.createRange();
					var b = document.body.createTextRange();
					b.moveToElementText(e);
					var d;
					for (d = 0; b.compareEndPoints("StartToStart", a) < 0; d++) {
						b.moveStart("character", 1);
					}
					e.sel_start = d;
					c.start = e.sel_start;
					c.end = e.sel_start;
				}
			}
			return c;
		}
		// Fin de la magia

		//Cosas de Vegon
		
		var blacklistBarra = "<div class='nopost barra'> \
			Usuario <span class='mensaje-ocultado'>Blacklisted</span> \
		</div> ";
		
		var balcklistToggle ="<div id='toggle' class='sprite'><div> "; 
	
		var blacklistInfo = "<span class='blacklisted-post'" + (is_dark ? " style='color: #626262 !important;'" : "") + ">Click en <img src='http://www.mvwat.com/mvusertools/blacklist-mini.png'> para desbloquear.</span>";
	
		var blacklistAvatar = "~";
	
		//Inject CSS in header
		{
		var css = 
			".sprite {\
				background: url(http://www.mvwat.com/mvusertools/sprites-new.png) no-repeat;\
			}\
			.usertools TABLE TD\
			{\
					padding: 3px;\
			}\
			.usertools A\
			{\
			}\
			.ut-firma\
			{\
					background-position: 0 -58px;\
					text-indent: -9999px;\
					width: 14px;\
					height: 11px;\
					display: block;\
					outline: 0;\
					margin-top: 1px;\
			}\
			.ut-firma:hover\
			{\
					background-position: 0 -69px;\
			}\
			.mensaje\
			{\
					background-position: -20px -58px;\
					text-indent: -9999px;\
					width: 14px;\
					height: 10px;\
					outline: 0;\
					display: block;\
					margin-top: 1px;\
			}\
			.mensaje:hover\
			{\
					background-position: -20px -68px;\
			}\
			.blacklist-off\
			{\
					background-position: -39px -57px;\
					text-indent: -9999px;\
					width: 12px;\
					height: 12px;\
					outline: 0;\
					display: block;\
					margin-top: 1px;\
			}\
			.blacklist-off:hover\
			{\
					background-position: -39px -69px;\
			}\
			.blacklist-on\
			{\
					background-position: -39px -69px;\
					text-indent: -9999px;\
					width: 12px;\
					height: 12px;\
					outline: 0;\
					display: block;\
					margin-top: 1px;\
			}\
			.blacklist-on:hover\
			{\
					background-position: -39px -57px;\
			}\
			.blacklist\
			{\
			}\
			.ut-online\
			{\
					background-position: -56px -72px;\
					text-indent: -99999px;\
					width: 8px;\
					height: 12px;\
					display: block;\
					outline: 0;\
			}\
			\
			.offline\
			{\
					background-position: -56px -58px;\
					text-indent: -99999px;\
					width: 8px;\
					height: 12px;\
					display: block;\
					outline: 0;\
			}\
			.online-pos\
			{\
					float: left;\
					width: 14px;\
					z-index: 999;\
			}\
			.mensaje-pos\
			{\
					float: left;\
					width: 19px;\
			}\
			.blacklist-pos\
			{\
					float: right;\
					margin-top: -1px;\
					width: 15px;\
			}\
			.firma-pos\
			{\
					float: left;\
					width: 19px;\
			}\
			.mensaje-ocultado\
			{\
					font-weight: bold;\
			}\
			.toggle-on\
			{\
					background-position: -37px -21px;\
					width: 34px;\
					height: 34px;\
					cursor: pointer;\
			}\
			.toggle-off\
			{\
					background-position: 0 -21px;\
					width: 34px;\
					height: 34px;\
					cursor: pointer;\
			}\
			.tapavatares\
			{\
					width: 0px; \
					height: 0px; \
					position:relative;\
			}\
			.tapavatares span {\
					position: abosolute; \
					background: url(http://www.mvwat.com/mvusertools/blacklisted.png) no-repeat;\
					background-position: 0 4px;\
					width: 80px; \
					height: 84px; \
					top: 6px; \
					left: 0px;\
					display: block;\
			}\
			.blacklisted-post\
			{\
					border-radius: 7px;\
					ms-border-radius: 7px;\
					-moz-border-radius: 7px;\
					-webkit-border-radius: 7px;\
					-khtml-border-radius: 7px;\
					padding: 3px 10px 2px 10px;\
					background: #ccc;\
					color: #626262 !important;\
			}\
			.usertools\
			{\
					position: relative;\
					width: 67px;\
					margin-top: 2px;\
			}\
			button::-moz-focus-inner {\
			border: 0;\
			padding: 0;\
			margin:0;\
			}\
			.mbuttons button[type], button.alt[type] {\
				padding:2px 4px !important;\
				\
			}\
			.mbuttons a:hover,button.alt:hover {\
			background-color:#aaaaaa;\
			border:1px solid #c2e1ef;\
			color:#ffffff;\
			}\
			button.alt {\
				border-color: #aaa !important;\
				min-width: 20px;\
				border-radius: 5px !important;\
			}\
			button.bleft {\
				border-radius: 5px 0px 0px 5px !important;\
				margin-right: 0px !important;\
				border-right-width: 0px !important;\
				font-weight: normal !important;\
			}\
			button.bcenter {\
				margin-right: 0px !important;\
				border-left-width: 1px !important;\
				border-left-color: #aaa !important;\
				font-weight: normal !important;\
				border-radius: 0px !important;\
			}\
			button.bcenter2 {\
				margin-right: 0px !important;\
				border-left-width: 0px !important;\
				border-left-color: #aaa !important;\
				font-weight: normal !important;\
				border-radius: 0px !important;\
			}\
			button.bright {\
				border-radius: 0px 5px 5px 0px !important;\
				margin-left: 0px !important;\
				border-left-width: 0px !important;\
				font-weight: normal !important;\
			}\
			button.bright2 {\
				border-radius: 0px 5px 5px 0px !important;\
				font-weight: normal !important;\
			}\
			button.bsolo {\
				border-radius: 5px !important;\
				font-weight: normal !important;\
			}\
			button.bb {\
				font-weight: bold !important;\
			}\
			button.bi {\
				font-style: italic !important;\
			}\
			button.bu {\
				text-decoration: underline !important;\
			}\
			button.bs {\
				text-decoration: line-through !important;\
			}\
			.baudio {\
				background-position: -0px 3px;\
				width: 11px; \
				height: 17px; \
				display: block; \
			}\
			.bimg {\
				background-position: -25px 3px;\
				width: 12px; \
				height: 17px; \
				display: block; \
				margin-left: 1px; \
			}\
			.bvideo {\
				background-position: -12px 3px;\
				width: 12px; \
				height: 17px; \
				display: block; \
			}\
			.bcentericon {\
				background-position: -37px 3px;\
				width: 14px; \
				height: 17px; \
				display: block; \
			}\
			.blist {\
				background-position: -51px 3px;\
				width: 14px; \
				height: 17px; \
				display: block; \
			}\
			.ut-live td {\
				background-color: #FFEEEE;\
			}\
			.ut-live td.alt {\
				background-color: #EFE0E0;\
			}\
			.linksfooter A {\
				opacity: 0.5;\
			}\
			.linksfooter A:hover {\
				opacity: 1;\
			}\
			.linksfooter2 {\
				padding: 5px 6px !important;\
				border-radius: 6px;\
				line-height: 35px;\
			}\
			.linksfooter2 IMG {\
				vertical-align: sub;\
			}\
			.linksfooter2 A {\
				padding: 0px 3px !important;\
			}\
			.linksfooterblanco {\
				background: linear-gradient(to top, #E8EBE3, #D6D8D2) !important;\
				background: -webkit-gradient(linear, left top, left bottom, from(#D6D8D2), to(#E8EBE3)) !important;\
				color: #8e908a;\
				border: 1px solid #C7C9C3;\
				border-bottom: 1px solid #BABCB6;\
			}\
			.linksfooterblanco A {\
				color: #666666;\
			}\
			.linksfooterblanco A:hover {\
				color: #222222;\
			}\
			.linksfooternegro {\
				background: linear-gradient(to top, #1c252b, #010101) !important;\
				background: -webkit-gradient(linear, left top, left bottom, from(#010101), to(#1C252B)) !important;\
				color: #4A4D50;\
				border: 1px solid #555f66;\
				border-bottom: 1px solid #0e1113;\
			}\
			#modlist {\
				margin: 20px 0 0;\
				padding: 10px 10px;\
				border-radius: 6px 6px 6px 6px;\
			}\
			.modlistblanco {\
				border: 1px solid #D4D4D2;\
			}\
			.modlistnegro {\
				border: 1px solid #273037;\
				background-color: #39444B;\
			}\
			#modlist H3{\
				margin-top: 0px !important;\
			}\
			#modlist A{\
				padding: 3px 0 3px 3px;\
				display: block;\
			}\
			.modlistblanco A:nth-child(odd){\
				background: #E8EBE3;\
			}\
			.modlistblanco A:hover{\
				background: #D6D8D2;\
			}\
			.modlistblanco span{\
				color: #555555;\
			}\
			.modlistnegro A:nth-child(odd){\
				background: #435058;\
			}\
			.modlistnegro A:hover{\
				background: #273037;\
			}\
			.modlistnegro span{\
				color: #C5D1EC;\
			}\
			";
		}
		if (typeof GM_addStyle != "undefined") {
			GM_addStyle(css);
		} else if (typeof PRO_addStyle != "undefined") {
			PRO_addStyle(css);
		} else if (typeof addStyle != "undefined") {
			addStyle(css);
		} else {
			var heads = document.getElementsByTagName("head");
			if (heads.length > 0) {
                var node = document.createElement("style");
                node.type = "text/css";
                node.appendChild(document.createTextNode(css));
                heads[0].appendChild(node);
			}
		}

		
		// Mensaje al updatear
		var utupdate = localStorage["utupdate"];
		var utpatchnotes = '<p style="font-size: 16px; font-weight: bold;">Actualización 1.6.6</p><br />- Añadidos enlaces utiles al final de cada página de un hilo.<br />- Listado de los mods del foro que estas visitando en la columna de la derecha.<br />- Temporalmente desactivado el greentext debido a errores en los posts.';
		jQuery(function() {
		if (utupdate != 'ut166') {
			jQuery('<div style="background: #ffffff; width: 100%; height: 100%; position: fixed; opacity: 0.5; z-index: 9998;" id="ut-mask"></div>').insertBefore('#background');
			jQuery('<div style="width: 400px; top: 50%; left: 50%; margin-top: -100px; margin-left: -200px; position: fixed; z-index: 9999;" id="ut-dialog"><a href="http://mvusertools.mvwat.com" target="_blank"><img style="margin: 0 110px 0 110px;" src="http://www.mediavida.com/img/f/mediavida/2012/10/02632_mv_usertools_extension_para_firefox_chrome_safari_0_full.png"></a><div id="ut-patchnotes" style="background: #ffffff; border-radius: 6px; width: 400px; padding: 10px 10px 30px 10px; border: 1px solid #cccccc;">'+ utpatchnotes +'<a style="float: right; margin-top: 20px;" href="#cerrar" id="ut-box-cerrar">Cerrar</a></div></div>').insertBefore('#content_head');
			jQuery('#ut-box-cerrar').click(function() {
				jQuery('#ut-dialog').hide();
				jQuery('#ut-mask').hide();
			});
			jQuery('#ut-mask').click(function() {
				jQuery('#ut-dialog').hide();
				jQuery('#ut-mask').hide();
			});

			localStorage["utupdate"] = 'ut166';
		}
		});
		
		// Mods de cada foro
		jQuery(function() {
			if(jQuery('div#topnav a[href="/foro/"]').length > 0 && jQuery('div.live_info').length == 0) {
				jQuery('div.smallcol, div.tinycol').append('<div class="box"><div id="modlist"><h3>Moderadores</h3></div></div>');
				var url = window.location.pathname;
				var id = url.split("/")[2];
				mods = [
					['nulo'],['bazoo','jadgix','J40','RaymaN','TazzMaTazz'],['Eristoff','kalinka-'],['aLeX','Josekron','Loa','MegalomaniaC','mongui','Prava'],[''],[''],['Atoll','Bloody','Eristoff','Kails','JMBaDBoY','Prava','PruDeN','sacnoth',],['abichuela','AG','alejo','Ch4iNeR','cm07','Korso','lb_nacho','Netzach','VipeR_CS'],[''],['Kaos','PiradoIV'],['TNx7','tutitin'],[''],[''],[''],[''],[''],[''],[''],[''],['Kaneas','TNx7'],[''],[''],['Cryoned','DuPonT'],['darkavm','ElKedao','Privatovic','ukuki'],[''],[''],['Midgard','StumKrav','thunder_'],[''],[''],[''],[''],['Eristoff','ReYzell'],['Andy','eisenfaust','ISAILOVIC','JMBaDBoY','loko_man','ruben132','Sh1n0d4','t0rrY',],[''],[''],[''],[''],[''],['Hir0shz','Ligia','ManOwaR','sPoiLeR',],[''],['ferk','HaZuKi','horvathzeros','J40'],[''],['dangerous','zashael'],[''],[''],[''],[''],[''],[''],[''],[''],[''],['BigmAK','MaSqUi','tutitin','XaViMeTaL'],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['Cheester','cuerpi','darkavm','sk_sk4t3r','TNx7','Txentx0'],['spyro512'],[''],[''],[''],['GR33N'],[''],[''],['Snorky','spyro512'],[''],[''],[''],[''],[''],['JMBaDBoY','Sirius_spa','suggus','ZaGo'],['granaino127','SaBaNdIjA'],['granaino127','SaBaNdIjA'],['darkavm','GryF','Kb','lb_nacho','-Power'],[''],[''],['ElKedao','darkavm','dicon','sk_sk4t3r'],[''],[''],[''],['Atoll','ZaGo'],['DeNz1L','kaitoo','NosFeR_'],['Skelus'],['darkavm','Dolz','Txentx0','urrako'],['babri','dicon','RoDRa','Spank'],['iosp','Hogwarts','lb_nacho'],['zashael'],['Charly-','edvan','frostttt','Kazuya_','zashael'],['RaymaN','sPoiLeR'],['CsNarsil','CybeR'],['eisenfaust'],['bazoo','StumKrav','thunder_'],['DarkHawX','Korso','Netzach','StumKrav'],['benitogb','BigmAK'],[''],['Andy','ISAILOVIC','JMBaDBoY','loko_man','ruben132','Sh1n0d4','t0rrY'],[''],['allmy','naete','slakk','StumKrav','thunder_'],['gonya707','TRON'],['babri','RoninPiros',],['Bidroid','MagicAnnii'],['ChaRliFuM','menolikeyou','undimmer'],['locof','Pedrosa7','Syuk',],[''],['alexander','ferk','horvathzeros','J40'],[''],[''],['cm07','RoninPiros'],[''],[''],[''],[''],[''],[''],['']
				];
				jQuery.each(mods[id], function(i,v) {
					if (mods[id] == '') {
					jQuery('<p/>').html('<span>Este foro no tiene mods o no están listados.</span>').appendTo('#modlist');
					}
					else {
					//jQuery('<li/>').html(v).appendTo('#modlist');
					jQuery('<a/>').html(v).attr('href','/id/'+ v+ '').append('<br />').appendTo('#modlist');
					}
				});	
			}	
		});
		jQuery(function() {
			if (is_dark == 0){
				jQuery('#modlist').addClass('modlistblanco');
			}
			else {
				jQuery('#modlist').addClass('modlistnegro');
			}
		});
		
		
		// Links importantes en el footer
		jQuery(function(){
		   if(jQuery('a.boton[href^="/foro/post.php?f"]').length > 0){
				jQuery('div#userinfo strong.bar').clone().addClass('linksfooter2').each(function(){
					if (is_dark == 0) {
						jQuery(this).addClass('linksfooterblanco').removeClass('bar').insertAfter('div.tfooter').prepend('<a href="/foro/">Foros</a> <a href="/foro/spy">Spy</a> |');
						jQuery('.linksfooter2 a[href^="/id/"] img').attr('src', 'http://www.mvwat.com/mvusertools/keko_bar.png');
						jQuery('.linksfooter2 a[href^="/notificaciones"] img').attr('src', 'http://www.mvwat.com/mvusertools/avisos_bar.png');
						jQuery('.linksfooter2 a[href^="/foro/favoritos"] img').attr('src', 'http://www.mvwat.com/mvusertools/fav_bar.png');
						jQuery('.linksfooter2 a[href^="/mensajes"] img').attr('src', 'http://www.mvwat.com/mvusertools/mail_bar.png');
					}
					else {
						jQuery(this).addClass('linksfooternegro').removeClass('bar').insertAfter('div.tfooter').prepend('<a href="/foro/">Foros</a> <a href="/foro/spy">Spy</a> |');
					}
				});
				jQuery('.linksfooter2 .separator').remove();
				jQuery('.linksfooter2 a[href^="/id/"]').children('span').text('Perfil');
					//Noti
				var utnoti = jQuery('div#userinfo a[href^="/foro/favoritos"] strong.bubble').html();
				jQuery(function() {
				if (utnoti.length > 0) {
					jQuery('.linksfooter2 a[href^="/foro/favoritos"] span.uextra').append(' ('+ utnoti +')');
				}
				});
				jQuery('.linksfooter2 a[href^="/foro/favoritos"] strong.bubble').remove();
					//Avisos
				var utavisos = jQuery('div#userinfo a[href^="/notificaciones"] strong.bubble').html();
				jQuery(function() {
				if (utavisos.length > 0) {
					jQuery('.linksfooter2 a[href^="/notificaciones"] span.uextra').append(' ('+ utavisos +')');
				}
				});
				jQuery('.linksfooter2 a[href^="/notificaciones"] strong.bubble').remove();
					//Mensajes
				var utmsj = jQuery('div#userinfo a[href^="/mensajes"] strong.bubble').html();
				jQuery(function() {
				if (utmsj.length > 0) {
					jQuery('.linksfooter2 a[href^="/mensajes"] span.uextra').append(' ('+ utmsj +')');
				}
				});
				jQuery('.linksfooter2 a[href^="/mensajes"] strong.bubble').remove();
			 }
			 else {
				 jQuery('div#userinfo strong.bar').clone().addClass('linksfooter2').each(function(){
						if (is_dark == 0) {
							jQuery(this).addClass('linksfooterblanco').removeClass('bar').insertAfter('form#postform[action="/foro/post_action.php"]').prepend('<a href="/foro/spy">Spy</a> |');
							jQuery('.linksfooter2 a[href^="/id/"] img').attr('src', 'http://www.mvwat.com/mvusertools/keko_bar.png');
							jQuery('.linksfooter2 a[href^="/notificaciones"] img').attr('src', 'http://www.mvwat.com/mvusertools/avisos_bar.png');
							jQuery('.linksfooter2 a[href^="/foro/favoritos"] img').attr('src', 'http://www.mvwat.com/mvusertools/fav_bar.png');
							jQuery('.linksfooter2 a[href^="/mensajes"] img').attr('src', 'http://www.mvwat.com/mvusertools/mail_bar.png');
						}
						else {
							jQuery(this).addClass('linksfooternegro').removeClass('bar').insertAfter('form#postform[action="/foro/post_action.php"]').prepend('<a href="/foro/spy">Spy</a> |');
						}
					});		 
				jQuery('.linksfooter2 .separator').remove();
				jQuery('.linksfooter2 a[href^="/id/"]').children('span').text('Perfil');
					//Noti
				var utnoti = jQuery('div#userinfo a[href^="/foro/favoritos"] strong.bubble').html();
				jQuery(function() {
				if (utnoti.length > 0) {
					jQuery('.linksfooter2 a[href^="/foro/favoritos"] span.uextra').append(' ('+ utnoti +')');
				}
				});
				jQuery('.linksfooter2 a[href^="/foro/favoritos"] strong.bubble').remove();
					//Avisos
				var utavisos = jQuery('div#userinfo a[href^="/notificaciones"] strong.bubble').html();
				jQuery(function() {
				if (utavisos.length > 0) {
					jQuery('.linksfooter2 a[href^="/notificaciones"] span.uextra').append(' ('+ utavisos +')');
				}
				});
				jQuery('.linksfooter2 a[href^="/notificaciones"] strong.bubble').remove();
					//Mensajes
				var utmsj = jQuery('div#userinfo a[href^="/mensajes"] strong.bubble').html();
				jQuery(function() {
				if (utmsj.length > 0) {
					jQuery('.linksfooter2 a[href^="/mensajes"] span.uextra').append(' ('+ utmsj +')');
				}
				});
				jQuery('.linksfooter2 a[href^="/mensajes"] strong.bubble').remove();
			 }
		});
		
		// Marcapaginas en los posts que entras directamente
		jQuery('div.mark').attr('style', 'background-image: url("http://www.mvwat.com/mvusertools/marcapaginas2.png") !important; background-repeat: no-repeat !important; background-position: 100px top !important;');
		
		
		// > Greentext (no funciona, hace que dejen de ir los popups de las imagenes y los el hover de los quotes)
		// > Implicando que no mola
//		jQuery('div[id^="cuerpo_"]').html(
//		function (i,h) {
//			return h.replace(/^\s*&gt.*/mg, function(a) {
//				if (is_dark) {
//			        return "<span style='color: #A7BD68;'>" + a + "</span>"
//			    } else {
//			        return "<span style='color: #789922;'>" + a + "</span>"
//			    }
//			});	
//		});
		
		//Icono del foro del que viene la noticia en Portada
		jQuery('.bbar a[href^="/foro"]').each(function(i) {
			var enlace = this + "";
			var split = enlace.split('/');
			var path = split.splice(1, split.length - 1);
			var pathIndexToGet = 3;
			var foro = path[pathIndexToGet];
			var foroicon = 'http://www.mediavida.com/style/img/icon/foro/' + foro + '.png';
			jQuery(this).html('<img style="vertical-align: middle; padding: 0 5px 0 0;" src="' + foroicon + '">');
		});
		jQuery('.item h4').each(function (index) {
			jQuery(this).prepend(jQuery('.bbar a[href^="/foro"]').eq(0));
		});
		jQuery('div.left:first-child').contents().filter(function(){
			return this.nodeType === 3;
		}).remove();
		jQuery('.bbar div.left:first-child').prepend('En ');
		
		//Icono del foro del que viene la noticia en Destacados
		jQuery('ul.mini a[href^="/foro"]').each(function(i) {
			var enlace = this + "";
			var split = enlace.split('/');
			var path = split.splice(1, split.length - 1);
			var pathIndexToGet = 3;
			var foro = path[pathIndexToGet];
			var foroicon = 'http://www.mediavida.com/style/img/icon/foro/' + foro + '.png';
			jQuery(this).closest('li').attr('style','background-image: url('+ foroicon +') !important; background-repeat: no-repeat !important; background-position: 5px center !important; padding: 10px 8px 10px 35px !important;');
		});
		
		

		// nueva botonera
		jQuery('button[accesskey="b"]').hide();
		jQuery('<button class="alt bleft bb" accesskey="b" type="button" onclick="bbstyle(0)">b</button>').insertAfter('button[accesskey="b"]');
		jQuery('button[accesskey="i"]').hide();
		jQuery('<button class="alt bcenter bi" accesskey="i" type="button" onclick="bbstyle(2)">i</button><button class="alt bcenter2 bu" accesskey="u" type="button" onclick="bbstyle(4)">u</button><button class="alt bright bs" id = "button_x" accesskey="x" type="button" onclick="bbstyle(24)">s</button><button class="alt bsolo" id = "button_c" accesskey="c" type="button" onclick="bbstyle(22)" title="[center]"><a class="sprite bcentericon"></a></button><button class="alt bsolo" id = "button_list" type="button" onclick="bbstyle(28)" title="[list] Usar * para cada elemento de la lista"><a class="blist sprite"></a></button>').insertAfter('button[accesskey="i"]');
		jQuery('button[accesskey="l"]').hide();
		jQuery('<button class="alt bsolo" accesskey="l" type="button" onclick="bbstyle(8)">[url=]</button>').insertAfter('button[accesskey="l"]');
		jQuery('button[accesskey="m"]').hide();
		jQuery('<button class="alt bleft" accesskey="m" type="button" onclick="bbstyle(10)" title="[img]"><a class="bimg sprite"></a></button>').insertAfter('button[accesskey="m"]');
		jQuery('button[accesskey="v"]').hide();
		jQuery('<button class="alt bcenter" accesskey="v" type="button" onclick="bbstyle(12)" title="[video]"><a class="bvideo sprite"></a></button><button title="[audio]" id = "button_audio" class="alt bright" type="button" onclick="bbstyle(30)"><a class="baudio sprite"></a></button>').insertAfter('button[accesskey="v"]');
		jQuery('button[accesskey="s"]').hide();
		jQuery('<button class="alt bleft" accesskey="s" type="button" onclick="bbstyle(14)">[spoiler]</button>').insertAfter('button[accesskey="s"]');
		jQuery('button[accesskey="d"]').hide();
		jQuery('<button class="alt bcenter" accesskey="d" type="button" onclick="bbstyle(16)">[spoiler=]</button>').insertAfter('button[accesskey="d"]');
		jQuery('button[accesskey="n"]').hide();
		jQuery('<button class="alt bright" accesskey="n" type="button" onclick="bbstyle(18)">NSFW</button><button class="alt bsolo" id = "button_bar" type="button" onclick="bbstyle(26)">[bar]</button><button class="alt bsolo" type="button" onclick="bbstyle(20)">[code]</button><script></script>').insertAfter('button[accesskey="n"]');
		
		jQuery("#button_x").click(function () {
			bbstyle2(24);
		});
		jQuery("#button_c").click(function () {
			bbstyle2(22);
		});
		jQuery("#button_bar").click(function () {
			bbstyle2(26);
		});
		jQuery("#button_audio").click(function () {
			bbstyle2(30);
		});
		jQuery("#button_list").click(function () {
			bbstyle2(28);
		});
		
		// hilos con live destacados (solo funciona con theme normal)
		jQuery('img[alt="live"]').closest('tr').addClass('ut-live');
		
		// hilos sobre relaciones y amor destacados (DESCARTADO, YA EXISTE UNA CATEGORIA DE AMOR Y RELACIONES)
		// jQuery('<img alt="Relaciones" src="http://www.mvwat.com/mvusertools/heart.png" style="width: 12px; height: 12px;">').insertAfter('a[class="hb"]:contains("amor"), a[class="hb"]:contains("rollo"), a[class="hb"]:contains("novia"), a[class="hb"]:contains("celos")');
		
		
		// Alien_crrpt = Alien_derp
		jQuery('div[class="autor"]:contains("Alien_crrpt")').children().children('dt').replaceWith('<dt><a href="/id/Alien_crrpt">Alien_derp</a></dt>');
		jQuery('div[class="autor"]:contains("Masme")').children().children('dt').replaceWith('<dt><a href="/id/Masme">Madme</a></dt>');
		
		//Set Toggle Class
		
		jQuery("#scrollpages").append(balcklistToggle);
		
		if (localStorage.getItem('blacklist') == 'on') {
			jQuery('#toggle').addClass("toggle-on");
			jQuery('#toggle').removeClass("toggle-off");
			console.log("encendido");
		}
		else {
			jQuery('#toggle').addClass("toggle-off");
			jQuery('#toggle').removeClass("toggle-on");
			console.log("apagado");
		}
		
		
		//put usernames where they belong.
		jQuery("a[href^='/id/']")
		.each(function()
		{
			var name = this.href.slice(this.href.lastIndexOf('/') + 1);
			jQuery(this).parent().parent().parent('.autor').data('name', name);
		});
		
		//jQuery("img[src^='/img/users/avatar']").parent().after("<div class='ancla'><div>");
		
		jQuery('.autor').each(function() {
			jQuery(this).append("<div class='usertools'>\
								<div class='online-pos'><a class='tooltip offline sprite' href='http://www.mediavida.com/id/" + jQuery(this).data('name') + "' original-title='Perfil' ></a></div>\
								<div class='mensaje-pos'><a class='tooltip mensaje sprite' href='http://www.mediavida.com/mensajes/nuevo/" + jQuery(this).data('name') + "' original-title='Mensaje'></a></div>\
								<div class='firma-pos'><a class='tooltip ut-firma sprite' href='http://www.mediavida.com/id/" + jQuery(this).data('name') + "/firmas' original-title='Firma'></a></div>\
								<div class='blacklist-pos'><a class='tooltip blacklist blacklist-off sprite' href='javascript:void(0)' original-title='Blacklist'></a></div>\
						</div>");
		});
		jQuery('div.autor dd.online').hide();
		jQuery('div.autor dd.online').parent().parent().find('.offline').toggleClass('ut-online offline');
		
		//Primera carga del a página. Tapar los posts de la blacklist si procede.
		
		jQuery("img[src^='/img/users/avatar']").parent().prepend("<div class=''><span></span></div>");
		
		//jQuery("img[src^='/img/users/avatar']").parent().append("<div class='ancla'><div>");
		
		//jQuery("img[src^='/img/users/avatar']").after("<div class='tapavatares'></div>")
		
		jQuery('.autor').each(function() {
			//Pijadas que marcan el post como blacklisted
			
			var localvalue = 'blacklist.' + jQuery(this).data('name');
			// INFO & BOTONES & AVATARES
			if (localStorage.getItem(localvalue) == 'true') {
				jQuery(this).find(".blacklist").addClass('blacklist-on');
				jQuery(this).find(".blacklist").removeClass('blacklist-off');
				jQuery(this).parent().find(".info").append(blacklistInfo);
			}
			else
			{
				jQuery(this).find(".blacklist").addClass('blacklist-off');
				jQuery(this).find(".blacklist").removeClass('blacklist-on');
				jQuery(this).parent().find(".info").append(blacklistInfo);
				jQuery(this).parent().find(".blacklisted-post").hide();
				jQuery(this).parent().find(".tapavatares").hide();
			}
			// BARRA
			jQuery(this).parent().before(blacklistBarra);
			if (localStorage.getItem('blacklist') == 'on') {
				if (localStorage.getItem(localvalue) == 'true') {
					jQuery(this).parent().hide();
				}
				else {
					jQuery(this).parent().prev().hide();
				}
			}
			else
				jQuery(this).parent().prev().hide();


		});
		// Fin de la primera carga
		
		jQuery("#toggle").click(function () {
		
		//	jQuery('#toggle').toggleClass("toggle-on toggle-off");
		
			if (localStorage.getItem('blacklist') == 'on') {
				jQuery('#toggle').addClass("toggle-off");
				jQuery('#toggle').removeClass("toggle-on");
				localStorage.setItem('blacklist', 'off');
			}
			else {
				jQuery('#toggle').addClass("toggle-on");
				jQuery('#toggle').removeClass("toggle-off");
				localStorage.setItem('blacklist', 'on');
			}
			console.log(localStorage.getItem('blacklist'));
			//Tenemos un nuevo estado. Si ahora es on, tenemos que ocultar, si es off tenemos que mostrar
			jQuery('.autor').each(function() {
				var localvalue = 'blacklist.' + jQuery(this).data('name');
				if (localStorage.getItem('blacklist') == 'on') {
					if (localStorage.getItem(localvalue) == 'true') {
						jQuery(this).parent().prev().show();
						jQuery(this).parent().hide();
					}
				}
				else {
					if (localStorage.getItem(localvalue) == 'true') {
						jQuery(this).parent().prev().hide();
						jQuery(this).parent().slideDown();
						jQuery('.social').show();
					}
				}
			});
		});
		// Fin de actualización

		jQuery(".blacklist").click(function () {
			var localvalue = 'blacklist.' + jQuery(this).parent().parent().parent().data('name');
			if (localStorage.getItem(localvalue) == 'true')
				localStorage.removeItem(localvalue);
			else
				localStorage.setItem(localvalue, 'true');
				
			console.log('set ' + localvalue + ' = ' + localStorage.getItem(localvalue));
	
	
			// En caso de blacklist ON Tapar los posts del autor si ahora esta blacklisted, o mostrarlos en caso contrario.
			// Si esta off, añadir pijadas o quitarlas.
			
			jQuery('.autor').each(function() {
				var localvalue = 'blacklist.' + jQuery(this).data('name');
				
				
				if (localStorage.getItem(localvalue) == 'true') {
					jQuery(this).find(".blacklist").addClass('blacklist-on');
					jQuery(this).find(".blacklist").removeClass('blacklist-off');
					jQuery(this).parent().find(".blacklisted-post").show();
					jQuery(this).parent().find(".tapavatares").show();
				}
				else
				{
					jQuery(this).find(".blacklist").addClass('blacklist-off');
					jQuery(this).find(".blacklist").removeClass('blacklist-on');
					jQuery(this).parent().find(".blacklisted-post").hide();
					jQuery(this).parent().find(".tapavatares").hide();
				}
					
				if (localStorage.getItem('blacklist') == 'on') {
					if (localStorage.getItem(localvalue) == 'true') {
						jQuery(this).parent().prev().show();
						jQuery(this).parent().slideUp();
					}
					else {
						jQuery(this).parent().slideDown();
						jQuery(this).parent().prev().hide();
					}
				}
				else
					if (localStorage.getItem(localvalue) == 'true') {
						//añadir pijadas
					}
					else {
						//quitar pijadas
					}
			});
			// Fin de actualización
		});
		jQuery("a.tooltip").tipsy();
	}

// load jQuery and execute the main function
addJQuery(main);
