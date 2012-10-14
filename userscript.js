// ==UserScript==
// @name           Mediavida Edición Elite
// @namespace      Mediavida-Edicion-Elite
// @description    Añade controles avanzados a los posts en MV
// @include        http://www.mediavida.com/foro/*
// @exclude        http://www.mediavida.com/foro/reportes.php
// ==/UserScript==

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js");
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
		
		var balcklistToggle ="<div id='toggle'><div> "; 
	
		var blacklistInfo = "<span class='blacklisted-post'>Click en <img src='http://www.mvwat.com/mvusertools/blacklist-mini.png'> para desbloquear.</span>";
	
		var blacklistAvatar = "~";
	
		//Inject CSS in header
		{
		var css = 
			".usertools TABLE TD\
			{\
					padding: 3px;\
			}\
			.usertools A\
			{\
			}\
			.firma\
			{\
					background: url(http://www.mvwat.com/mvusertools/firma.png) no-repeat;\
					text-indent: -9999px;\
					width: 14px;\
					height: 11px;\
					display: block;\
					outline: 0;\
					margin-top: 1px;\
			}\
			.firma:hover\
			{\
					background-position: 0 -11px;\
			}\
			.mensaje\
			{\
					background: url(http://www.mvwat.com/mvusertools/mensaje.png) no-repeat;\
					text-indent: -9999px;\
					width: 14px;\
					height: 10px;\
					outline: 0;\
					display: block;\
					margin-top: 1px;\
			}\
			.mensaje:hover\
			{\
					background-position: 0 -10px;\
			}\
			.blacklist-off\
			{\
					background: url(http://www.mvwat.com/mvusertools/blacklist.png) no-repeat;\
					text-indent: -9999px;\
					width: 12px;\
					height: 12px;\
					outline: 0;\
					display: block;\
					margin-top: 1px;\
			}\
			.blacklist-off:hover\
			{\
					background-position: 0 -12px;\
			}\
			.blacklist-on\
			{\
					background: url(http://www.mvwat.com/mvusertools/blacklist.png) no-repeat;\
					text-indent: -9999px;\
					width: 12px;\
					height: 12px;\
					outline: 0;\
					display: block;\
					margin-top: 1px;\
					background-position: 0 -12px;\
			}\
			.blacklist-on:hover\
			{\
					background-position: 0 0px;\
			}\
			.blacklist\
			{\
			}\
			.ut-online\
			{\
					background: url(http://www.mvwat.com/mvusertools/online.png) no-repeat;\
					text-indent: -99999px;\
					width: 8px;\
					height: 12px;\
					display: block;\
					outline: 0;\
			}\
			\
			.offline\
			{\
					background: url(http://www.mvwat.com/mvusertools/offline.png) no-repeat;\
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
					background: url(http://www.mvwat.com/mvusertools/toggle-on.png) no-repeat;\
					width: 34px;\
					height: 34px;\
					cursor: pointer;\
			}\
			.toggle-off\
			{\
					background: url(http://www.mvwat.com/mvusertools/toggle-off.png) no-repeat;\
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
				background: url('http://www.mvwat.com/mvusertools/bicons.png') no-repeat scroll 0 3px transparent;\
				width: 11px; \
				height: 17px; \
				display: block; \
			}\
			.bimg {\
				background: url('http://www.mvwat.com/mvusertools/bicons.png') no-repeat scroll -25px 3px transparent;\
				width: 12px; \
				height: 17px; \
				display: block; \
				margin-left: 1px; \
			}\
			.bvideo {\
				background: url('http://www.mvwat.com/mvusertools/bicons.png') no-repeat scroll -12px 3px transparent;\
				width: 12px; \
				height: 17px; \
				display: block; \
			}\
			.bcentericon {\
				background: url('http://www.mvwat.com/mvusertools/bicons.png') no-repeat scroll -37px 3px transparent;\
				width: 14px; \
				height: 17px; \
				display: block; \
			}\
			.blist {\
				background: url('http://www.mvwat.com/mvusertools/bicons.png') no-repeat scroll -51px 3px transparent;\
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
			div.post.mark {\
				background-color: #fff1e3;\
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
		
		
		
		// nueva botonera
		
		jQuery('button[accesskey="b"]').hide();
		jQuery('<button class="alt bleft bb" accesskey="b" type="button" onclick="bbstyle(0)">b</button>').insertAfter('button[accesskey="b"]');
		jQuery('button[accesskey="i"]').hide();
		jQuery('<button class="alt bcenter bi" accesskey="i" type="button" onclick="bbstyle(2)">i</button><button class="alt bcenter2 bu" accesskey="u" type="button" onclick="bbstyle(4)">u</button><button class="alt bright bs" id = "button_x" accesskey="x" type="button" onclick="bbstyle(24)">s</button><button class="alt bsolo" id = "button_c" accesskey="c" type="button" onclick="bbstyle(22)" title="[center]"><a class="bcentericon"></a></button><button class="alt bsolo" id = "button_list" type="button" onclick="bbstyle(28)" title="[list] Usar * para cada elemento de la lista"><a class="blist"></a></button>').insertAfter('button[accesskey="i"]');
		jQuery('button[accesskey="l"]').hide();
		jQuery('<button class="alt bsolo" accesskey="l" type="button" onclick="bbstyle(8)">[url=]</button>').insertAfter('button[accesskey="l"]');
		jQuery('button[accesskey="m"]').hide();
		jQuery('<button class="alt bleft" accesskey="m" type="button" onclick="bbstyle(10)" title="[img]"><a class="bimg"></a></button>').insertAfter('button[accesskey="m"]');
		jQuery('button[accesskey="v"]').hide();
		jQuery('<button class="alt bcenter" accesskey="v" type="button" onclick="bbstyle(12)" title="[video]"><a class="bvideo"></a></button><button title="[audio]" id = "button_audio" class="alt bright" type="button" onclick="bbstyle(30)"><a class="baudio"></a></button>').insertAfter('button[accesskey="v"]');
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
		
		// hilos con live destacados
		jQuery('img[alt="live"]').closest('tr').addClass('ut-live');
		
		// hilos sobre relaciones y amor destacados (DESCARTADO, YA EXISTE UNA CATEGORIA DE AMOR Y RELACIONES)
		// jQuery('<img alt="Relaciones" src="http://www.mvwat.com/mvusertools/heart.png" style="width: 12px; height: 12px;">').insertAfter('a[class="hb"]:contains("amor"), a[class="hb"]:contains("rollo"), a[class="hb"]:contains("novia"), a[class="hb"]:contains("celos")');
		
		
		// Alien_crrpt = Alien_derp
		jQuery('div[class="autor"]:contains("Alien_crrpt")').children().children('dt').replaceWith('<dt><a href="/id/Alien_crrpt">Alien_derp</a></dt>');
		
		
		//Set Toggle Class
		
		$("#scrollpages").append(balcklistToggle);
		
		if (localStorage.getItem('blacklist') == 'on') {
			$('#toggle').addClass("toggle-on");
			$('#toggle').removeClass("toggle-off");
			console.log("encendido");
		}
		else {
			$('#toggle').addClass("toggle-off");
			$('#toggle').removeClass("toggle-on");
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
								<div class='online-pos'><a class='tooltip offline' href='http://www.mediavida.com/id/" + jQuery(this).data('name') + "' original-title='Perfil' ></a></div>\
								<div class='mensaje-pos'><a class='tooltip mensaje' href='http://www.mediavida.com/mensajes/nuevo/" + jQuery(this).data('name') + "' original-title='Mensaje'></a></div>\
								<div class='firma-pos'><a class='tooltip firma' href='http://www.mediavida.com/id/" + jQuery(this).data('name') + "/firmas' original-title='Firma'></a></div>\
								<div class='blacklist-pos'><a class='tooltip blacklist blacklist-off' href='javascript:void(0)' original-title='Blacklist'></a></div>\
						</div>");
		});
		$('.online').hide();
		$('.online').parent().parent().find('.offline').toggleClass('ut-online offline');
		
		//Primera carga del a página. Tapar los posts de la blacklist si procede.
		
		jQuery("img[src^='/img/users/avatar']").parent().prepend("<div class='tapavatares'><span></span></div>");
		
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
				$('#toggle').addClass("toggle-off");
				$('#toggle').removeClass("toggle-on");
				localStorage.setItem('blacklist', 'off');
			}
			else {
				$('#toggle').addClass("toggle-on");
				$('#toggle').removeClass("toggle-off");
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
		$("a.tooltip").tipsy();
	}

// load jQuery and execute the main function
addJQuery(main);
