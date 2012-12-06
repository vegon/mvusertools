// ==UserScript==
// @name           MV-Usertools
// @namespace      MVusertools
// @version        1.8
// @description    Añade controles avanzados a los posts en MV
// @include        http://www.mediavida.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require        http://www.mvusertools.com/ext/libs/tinycon.min.js
// @require        http://www.mvusertools.com/ext/libs/jquery.a-tools-1.5.2.js
// @require        http://www.mvusertools.com/ext/libs/sisyphus.js
// ==/UserScript==

////// VARIABLES REUTILIZABLES //////
var bbcode = new Array();
var bbtags = new Array("[b]", "[/b]", "[i]", "[/i]", "[u]", "[/u]", "[url]", "[/url]", "[url=]", "[/url]", "[img]", "[/img]", "[video]", "[/video]", "[spoiler]", "[/spoiler]", "[spoiler=]", "[/spoiler]", "[spoiler=NSFW]", "[/spoiler]", "[code]", "[/code]", "[center]", "[/center]", "[s]", "[/s]", "[bar]", "[/bar]", "[list]", "[/list]", "[audio]", "[/audio]");
var theSelection = false;
var clientPC = navigator.userAgent.toLowerCase();
var clientVer = parseInt(navigator.appVersion);
var is_ie = ((clientPC.indexOf("msie") != -1) && (clientPC.indexOf("opera") == -1));
var is_win = ((clientPC.indexOf("win") != -1) || (clientPC.indexOf("16bit") != -1));
var baseHeight;
var is_dark = jQuery("link[rel='stylesheet']").filter(function(){return this.href.match('\/style\/[0-9]+\/mv_oscuro\.css')}).length > 0;
var postitlive = jQuery("div#pi_body div.embedded object").length > 0;
var utnoti = jQuery('div#userinfo a[href^="/foro/favoritos"] strong.bubble').html();
var utavisos = jQuery('div#userinfo a[href^="/notificaciones"] strong.bubble').html();
var utmsj = jQuery('div#userinfo a[href^="/mensajes"] strong.bubble').html();
////// VARIABLES REUTILIZABLES //////


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

var blacklistInfo = "<span class='blacklisted-post'" + (is_dark ? " style='color: #626262 !important;'" : "") + ">Click en <img src='http://www.mvusertools.com/ext/img/blacklist-mini.png'> para desbloquear.</span>";

var blacklistAvatar = "~";

//Inject CSS in header
{
var css = 
	".sprite {\
		background: url(http://www.mvusertools.com/ext/img/sprites18-3.png) no-repeat;\
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
	.ut-offline\
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
			background: url(http://www.mvusertools.com/ext/img/blacklisted.png) no-repeat;\
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
	.config {\
	background-position: -78px -34px;\
	width: 14px;\
	height: 14px;\
	display: inline-block;\
	margin: 0 3px;\
	top: 3px;\
	position: relative;\
	}\
	#ut-mask {\
	background: #ffffff; width: 100%; height: 100%; position: fixed; opacity: 0.9; z-index: 9998;\
	}\
	#ut-mask-menu {\
	background: #000000; width: 100%; height: 100%; position: fixed; opacity: 0.9; z-index: 9998;\
	}\
	#ut-dialog {\
	width: 500px; top: 10px; left: 50%; margin-left: -250px; position: absolute; z-index: 9999;\
	}\
	#ut-dialog-menu {\
	width: 500px; top: 50px; left: 50%; margin-left: -250px; position: absolute; z-index: 9999;\
	}\
	.ut-boton-sino{\
	cursor: pointer;\
	color: #EF5000;\
	}\
	#ut-window {\
	background: #ffffff; border-radius: 6px; padding: 10px 10px 30px 10px; border: 1px solid #cccccc;\
	}\
	#ut-menu-contenido {\
	background: #fff;\
	min-height: 270px;\
	}\
	#ut-menu-contenido TABLE{\
	border-top: 1px solid #ccc;\
	}\
	.newquote a.toggled, .newquoteblack a.toggled{\
	border-style: solid !important;\
	border-width: 1px !important;\
	margin: 0 !important;\
	padding: 0 3px !important;\
	}\
	.newquote a.toggled {\
	border-color: #CCCCCC #CCCCCC #CCCCCC !important;\
	}\
	.newquoteblack a.toggled{\
	border-color: #CCCCCC #CCCCCC #CCCCCC !important;\
	}\
	.newquote div.quote, .newquoteblack div.quote{\
	border: 1px solid #CCCCCC !important;\
	margin: 0 0 8px !important;\
	border-radius: 0 6px 6px 6px !important;\
	}\
	.tinycol.bigscreen{\
	margin-top: 800px;\
	}\
	.postit.bigscreen{\
	width: 958px;\
	padding-left: 0px;\
	}\
	#pi_body.bigscreen{\
	width: 938px;\
	}\
	.embedded.bigscreen{\
	;\
	}\
	#bigscreen-mode{\
	background-position: -99px -28px;\
	width: 41px;\
	height: 23px;\
	float: right;\
	margin: 5px 0 5px 10px;\
	cursor: pointer;\
	}\
	#bigscreen-mode:hover{\
	background-position: -142px -28px;\
	}\
	#bigscreen-mode-off{\
	background-position: -99px 0;\
	width: 41px;\
	height: 23px;\
	float: right;\
	margin: 5px 0px 5px 10px;\
	cursor: pointer;\
	}\
	#bigscreen-mode-off:hover{\
	background-position: -141px 0;\
	}\
	.post .spoiler-content {\
		background-color: #F0F2ED;\
		padding: 5px;\
		border-bottom: 1px solid #d7d9d4;\
	}\
	.post.odd .spoiler-content {\
		background-color: #E7E9E4;\
	}\
	.post .spoiler-content-black {\
		background-color: #435058;\
		padding: 5px;\
		border-bottom: 1px solid #252C31;\
	}\
	.post.odd .spoiler-content-black {\
		background-color: #39444B;\
	}\
	#ut-menu-tabs div{\
		margin: 0 10px 0 0;\
		padding: 3px 4px;\
		background: #eee;\
		display: inline-block;\
		cursor: pointer;\
		border-top: 1px solid #CCCCCC;\
		border-right: 1px solid #CCCCCC;\
		border-left: 1px solid #CCCCCC;\
		color: #999;\
		font-size: 13px;\
	}\
	#ut-menu-tabs div.active{\
		background: #444;\
		color: #eee;\
		border-top: 1px solid #CCCCCC;\
		border-right: 1px solid #CCCCCC;\
		border-left: 1px solid #CCCCCC;\
	}\
	#ut-menu-tabs div.active:hover{\
		background: #444;\
		color: #eee;\
		border-top: 1px solid #CCCCCC;\
		border-right: 1px solid #CCCCCC;\
		border-left: 1px solid #CCCCCC;\
	}\
	#ut-menu-tabs div:hover{\
		background: #ddd;\
		color: #222;\
	}\
	#ut-menu-contenido .ut-opciones td:nth-child(2n+1){\
		width: 420px;\
	}\
	.ut-arrow-up{\
		background-position: -75px -53px;\
		width: 12px;\
		height: 17px;\
		display: block; \
	}\
	.ut-arrow-down{\
		background-position: -75px -70px;\
		width: 12px;\
		height: 17px;\
		display: block; \
	}\
	#ut-boton-plus{\
	background-color: #888888 !important;\
	}\
	#ut-boton-plus:hover {\
	background-color: #777777 !important;\
	}\
	.ut-titleymacro{\
	padding: 0 0 2px 3px;\
	border-left: 2px solid #FF5500;\
	margin: 10px 0;\
	}\
	.ut-titletxt{\
	font-weight: bold;\
	cursor: default;\
	}\
	.ut-macrotxt {\
	color: #222222;\
	text-overflow: ellipsis;\
	-o-text-overflow: ellipsis;\
    text-overflow: ellipsis;\
    overflow:hidden;\
    white-space:nowrap;\
    width: 460px;\
	}\
	.icon-down-list{\
		background-position: -97px -59px;\
		width: 12px;\
		height: 9px;\
		display: inline-block;\
		vertical-align: middle;\
	}\
	.icon-trash{\
		background-position: -97px -72px;\
		width: 11px;\
		height: 14px;\
		display: inline-block;\
		vertical-align: middle;\
	}\
	.icon-trash-orange{\
		background-position: -114px -72px; \
		width: 11px;\
		height: 14px;\
		display: inline-block;\
		}\
	#ut-button-macros-list{\
	position: absolute;\
	top: 132px;\
	left: 112px;\
	width: 125px;\
	border-radius: 0px 0px 5px 5px;\
	background-color: #565656;\
	border: 1px solid #AAAAAA;\
	color: #eee;\
	}\
	#ut-button-macros-list li{\
	display: block;\
	cursor: pointer;\
	border-bottom: 1px solid #888888;\
	padding: 1px 1px 1px 3px;\
	}\
	#ut-button-macros-list li:hover{\
	background-color: #aaaaaa;\
	}\
	.ut-button-macros-list-barrendera{\
	top: 68px !important;\
	left: 248px !important;\
	}\
	#ut-button-macros-list-anadir {\
	padding: 1px 1px 2px 3px;\
	cursor: pointer;\
	display: block;\
	color: #ccc;\
	background-color: #333;\
	border-radius: 0 0 5px 5px;\
	}\
	#ut-button-macros-list-anadir:hover {\
	color: #fff;\
	background-color: #ff7700;\
	}\
	#ut-macro {\
	overflow: auto;\
	width: 98%;\
	margin-top: 5px;\
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


/////////// MENU ///////////////////////////////////////////////////////////////  
var bottominfo = '<p style="margin-top: 20px; font-size: 9px; color: #888888;">Si ves algún fallo prueba siempre a hacer ctrl+f5. Si así no se ha solucionado comunícanoslo con un post en <a href="http://www.mediavida.com/foro/4/mv-usertools-extension-para-firefox-chrome-safari-413818">el hilo oficial</a> indicando navegador y su versión, sistema operativo y, si es posible, una screen del error.<br /><br />Instrucciones y más información en <a href="http://mvusertools.com" target="_blank">la web oficial de la extensión</a>.</p>';

var utlinksfooter = localStorage["utlinksfooter"];
var utlinksfooteroscuro = localStorage["utlinksfooteroscuro"];
var uttablamods = localStorage["uttablamods"];
var utmarcapaginas = localStorage["utmarcapaginas"];
var uticonosportada = localStorage["uticonosportada"];
var uticonosdestacados = localStorage["uticonosdestacados"];
var utlivesdestacados = localStorage["utlivesdestacados"];
var utnewquote = localStorage["utnewquote"];
var utuserinfo = localStorage["utuserinfo"];
var utestilospoilers = localStorage["utestilospoilers"];
var utbigscreen = localStorage["utbigscreen"];
var utordenarposts = localStorage["utordenarposts"];
var utfavicon = localStorage["utfavicon"];
	// Forma del menu
jQuery('<div id="ut-config" class="last" style="margin-left: 10px;"><strong class="bar"><a id="ut-menu" style="cursor:pointer;"><span class="sprite config"></span><span class="uextra">Ut</span></a></strong></div>').insertAfter('div#userinfo');
jQuery('<div style="display: none;" id="ut-mask-menu"></div>').insertBefore('#background');
var utmenutabs = '<div id="ut-menu-tabs"><div id="ut-menu-tab1" class="active">Modulos</div><div id="ut-menu-tab2">Estilos</div><div id="ut-menu-tab4">Macros</div><div id="ut-menu-tab3">Sobre MV-UT</div></div>';
var utmenutabla1 = '<table id="ut-menu-tabla1" class="ut-opciones"><tbody><tr><td>Links importantes al final de la página</td><td><span class="ut-boton-sino" id="ut-linksfooter-si">Si</span> <span class="ut-boton-sino" id="ut-linksfooter-no">No</span></td></tr><tr style="background: none;"><td><p id="ut-utlinksfooteroscuro" style="color: #999999;">Links importantes estilo oscuro usando theme predeterminado</p></td><td><span class="ut-boton-sino" id="ut-utlinksfooteroscuro-si">Si</span> <span class="ut-boton-sino" id="ut-utlinksfooteroscuro-no">No</span></td></tr><tr><td>Tabla de mods</td><td><span class="ut-boton-sino" id="ut-tablamods-si">Si</span> <span class="ut-boton-sino" id="ut-tablamods-no">No</span></td></tr><tr><td>Iconos de las noticias en portada</td><td><span class="ut-boton-sino" id="ut-uticonosportada-si">Si</span> <span class="ut-boton-sino" id="ut-uticonosportada-no">No</span></td></tr><tr><td>Iconos de las noticias en destacados</td><td><span class="ut-boton-sino" id="ut-uticonosdestacados-si">Si</span> <span class="ut-boton-sino" id="ut-uticonosdestacados-no">No</span></td></tr><tr><td>Información del usuario al dejar el ratón sobre su nick</td><td><span class="ut-boton-sino" id="ut-utuserinfo-si">Si</span> <span class="ut-boton-sino" id="ut-utuserinfo-no">No</span></td></tr><tr><td>Botón para ensanchar streams en hilos con Live! y postit (Experimental)</td><td><span class="ut-boton-sino" id="ut-utbigscreen-si">Si</span> <span class="ut-boton-sino" id="ut-utbigscreen-no">No</span></td></tr><tr><td>Opción para ordenar hilos por respuestas sin leer</td><td><span class="ut-boton-sino" id="ut-utordenarposts-si">Si</span> <span class="ut-boton-sino" id="ut-utordenarposts-no">No</span></td></tr><tr><td>Avisos en el favicon</td><td><span class="ut-boton-sino" id="ut-utfavicon-si">Si</span> <span class="ut-boton-sino" id="ut-utfavicon-no">No</span></td></tr></tbody></table>';
var utmenutabla2 = '<table id="ut-menu-tabla2" class="ut-opciones" style="display: none;"><tbody><tr><td>Marcapáginas</td><td><span class="ut-boton-sino" id="ut-marcapaginas-si">Si</span> <span class="ut-boton-sino" id="ut-marcapaginas-no">No</span></td></tr><tr><td>Hilos con Live! activado destacados (solo para theme predeterminado)</td><td><span class="ut-boton-sino" id="ut-utlivesdestacados-si">Si</span> <span class="ut-boton-sino" id="ut-utlivesdestacados-no">No</span></td></tr><tr><td>Nuevo estilo para los quotes</td><td><span class="ut-boton-sino" id="ut-utnewquote-si">Si</span> <span class="ut-boton-sino" id="ut-utnewquote-no">No</span></td></tr><td>Nuevo estilo para los spoilers</td><td><span class="ut-boton-sino" id="ut-utestilospoilers-si">Si</span> <span class="ut-boton-sino" id="ut-utestilospoilers-no">No</span></td></tr></tbody></table>';
var utmenutabla3 = '<table id="ut-menu-tabla3" style="display: none;"><tbody><tr><td><a href="http://mvusertools.com" target="_blank"><img src="http://www.mediavida.com/img/f/mediavida/2012/11/55268_mv_usertools_extension_para_firefox_chrome_opera_safari_0_full.png" width="48" height="48"><p>MV-Usertools</a> desarrollado por <a href="/id/Vegon">Vegon</a> y <a href="/id/cm07">cm07</a></p><br /><br /><p>Para comunicar bugs usa el <a href="http://www.mediavida.com/foro/4/mv-usertools-extension-para-firefox-chrome-opera-safari-413818">hilo oficial</a>. Si tienes dudas de como funciona algun modulo u opción visita el <a href="http://mvusertools.com/caracteristicas">manual en la web oficial</a> que siempre está actualizado con las ultimas novedades.</p><br /><br /><p>Si las MV-Usertools te resultan utiles y quieres agradecernos las horas de trabajo detrás de ellas, tiranos algunas monedas.</p><br /><form action="https://www.paypal.com/cgi-bin/webscr" method="post"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="2TD967SQAC6HC"><input type="image" src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal. La forma rápida y segura de pagar en Internet."><img alt="" border="0" src="https://www.paypalobjects.com/es_ES/i/scr/pixel.gif" width="1" height="1"></form></td></tr></tbody></table>';
var utmenutabla4 = '<table id="ut-menu-tabla4" style="display: none;"><tbody><tr><td><form id="ut-macros-form"><input id="ut-title" placeholder="Título" maxlength="17"><br /><textarea id="ut-macro" placeholder="Macro"></textarea><br /><input type="submit" value="Guardar" style="margin-top: 3px;" ></form><ul id="ut-macros"></ul></td></tr></tbody></table>';
jQuery('<div style="display: none;" id="ut-dialog-menu"><div id="ut-window"><div id="ut-menu-contenido">'+ utmenutabs +''+ utmenutabla1 +''+ utmenutabla2 +''+ utmenutabla4 +''+ utmenutabla3 +'</div>'+ bottominfo +'<a style="float: right; margin-top: 10px; cursor: pointer;" id="ut-menu-cerrar">Cerrar</a></div></div>').insertBefore('#content_head');
jQuery('#ut-menu-tabla1 tr:odd, #ut-menu-tabla2 tr:odd, #ut-menu-tabla3 tr:odd').addClass('odd');
jQuery('#ut-menu-tab1').click(function () {
	jQuery('#ut-menu-tab1').addClass('active');
	jQuery('#ut-menu-tab2').removeClass('active');
	jQuery('#ut-menu-tab3').removeClass('active');
	jQuery('#ut-menu-tab4').removeClass('active');
	jQuery('#ut-menu-tabla1').show();
	jQuery('#ut-menu-tabla2').hide();
	jQuery('#ut-menu-tabla3').hide();
	jQuery('#ut-menu-tabla4').hide();
	});
jQuery('#ut-menu-tab2').click(function () {
	jQuery('#ut-menu-tab1').removeClass('active');
	jQuery('#ut-menu-tab2').addClass('active');
	jQuery('#ut-menu-tab3').removeClass('active');
	jQuery('#ut-menu-tab4').removeClass('active');
	jQuery('#ut-menu-tabla1').hide();
	jQuery('#ut-menu-tabla2').show();
	jQuery('#ut-menu-tabla3').hide();
	jQuery('#ut-menu-tabla4').hide();
	});
jQuery('#ut-menu-tab3').click(function () {
	jQuery('#ut-menu-tab1').removeClass('active');
	jQuery('#ut-menu-tab2').removeClass('active');
	jQuery('#ut-menu-tab3').addClass('active');
	jQuery('#ut-menu-tab4').removeClass('active');
	jQuery('#ut-menu-tabla1').hide();
	jQuery('#ut-menu-tabla2').hide();
	jQuery('#ut-menu-tabla3').show();
	jQuery('#ut-menu-tabla4').hide();
	});
jQuery('#ut-menu-tab4').click(function () {
	jQuery('#ut-menu-tab1').removeClass('active');
	jQuery('#ut-menu-tab2').removeClass('active');
	jQuery('#ut-menu-tab3').removeClass('active');
	jQuery('#ut-menu-tab4').addClass('active');
	jQuery('#ut-menu-tabla1').hide();
	jQuery('#ut-menu-tabla2').hide();
	jQuery('#ut-menu-tabla3').hide();
	jQuery('#ut-menu-tabla4').show();
	});
	

jQuery('#ut-menu').click(function () {
	jQuery('#ut-mask-menu').show();
	jQuery('#ut-dialog-menu').show();
	});
jQuery('#ut-menu-cerrar').click(function() {
	jQuery('#ut-dialog-menu').hide();
	jQuery('#ut-mask-menu').hide();
	});
jQuery('#ut-mask-menu').click(function() {
	jQuery('#ut-dialog-menu').hide();
	jQuery('#ut-mask-menu').hide();
});
var nicklenght = jQuery('div#userinfo a[href^="/id/"] span').text().length;
jQuery(function() {
	if (nicklenght > 8) {
		jQuery('#nav_bar #buscar').css('width','130px');
		jQuery('#nav_bar #sbii').css('width','93px');
		jQuery('#nav_bar .bbii').css('left','103px');
	}
});
jQuery(function() {
	if (nicklenght == 7) {
		jQuery('#nav_bar #buscar').css('width','170px');
		jQuery('#nav_bar #sbii').css('width','133px');
		jQuery('#nav_bar .bbii').css('left','143px');
	}
});
	// Boton de utlinksfooter
jQuery('#ut-linksfooter-si').click(function() {
	localStorage["utlinksfooter"] = 'si';
	jQuery('#ut-linksfooter-no').css('color','#999999');
	jQuery('#ut-linksfooter-si').css('color','#EF5000');
	jQuery('#ut-utlinksfooteroscuro').css('color','#222222');
});
jQuery('#ut-linksfooter-no').click(function() {
	localStorage["utlinksfooter"] = 'no';
	jQuery('#ut-linksfooter-si').css('color','#999999');
	jQuery('#ut-linksfooter-no').css('color','#EF5000');
	jQuery('#ut-utlinksfooteroscuro').css('color','#999999');
});
if (utlinksfooter == 'si' || utlinksfooter == undefined) {
	jQuery('#ut-linksfooter-no').css('color','#999999');
	jQuery('#ut-utlinksfooteroscuro').css('color','#222222');
}
if (utlinksfooter == 'no') {
	jQuery('#ut-linksfooter-si').css('color','#999999');
	jQuery('#ut-utlinksfooteroscuro').css('color','#999999');
}
	// Boton de utlinksfooteroscuro
jQuery('#ut-utlinksfooteroscuro-si').click(function() {
	localStorage["utlinksfooteroscuro"] = 'si';
	jQuery('#ut-utlinksfooteroscuro-no').css('color','#999999');
	jQuery('#ut-utlinksfooteroscuro-si').css('color','#EF5000');
});
jQuery('#ut-utlinksfooteroscuro-no').click(function() {
	localStorage["utlinksfooteroscuro"] = 'no';
	jQuery('#ut-utlinksfooteroscuro-si').css('color','#999999');
	jQuery('#ut-utlinksfooteroscuro-no').css('color','#EF5000');
});
if (utlinksfooteroscuro == 'si') {
	jQuery('#ut-utlinksfooteroscuro-no').css('color','#999999');
}
if (utlinksfooteroscuro == 'no' || utlinksfooteroscuro == undefined) {
	jQuery('#ut-utlinksfooteroscuro-si').css('color','#999999');
}
	// Boton de uttablamods
jQuery('#ut-tablamods-si').click(function() {
	localStorage["uttablamods"] = 'si';
	jQuery('#ut-tablamods-no').css('color','#999999');
	jQuery('#ut-tablamods-si').css('color','#EF5000');
});
jQuery('#ut-tablamods-no').click(function() {
	localStorage["uttablamods"] = 'no';
	jQuery('#ut-tablamods-si').css('color','#999999');
	jQuery('#ut-tablamods-no').css('color','#EF5000');
});
if (uttablamods == 'si' || uttablamods == undefined) {
	jQuery('#ut-tablamods-no').css('color','#999999');
}
if (uttablamods == 'no') {
	jQuery('#ut-tablamods-si').css('color','#999999');
}
	// Marcapaginas
jQuery('#ut-marcapaginas-si').click(function() {
	localStorage["utmarcapaginas"] = 'si';
	jQuery('#ut-marcapaginas-no').css('color','#999999');
	jQuery('#ut-marcapaginas-si').css('color','#EF5000');
});
jQuery('#ut-marcapaginas-no').click(function() {
	localStorage["utmarcapaginas"] = 'no';
	jQuery('#ut-marcapaginas-si').css('color','#999999');
	jQuery('#ut-marcapaginas-no').css('color','#EF5000');
});
if (utmarcapaginas == 'si' || utmarcapaginas == undefined) {
	jQuery('#ut-marcapaginas-no').css('color','#999999');
}
if (utmarcapaginas == 'no') {
	jQuery('#ut-marcapaginas-si').css('color','#999999');
}
	// Iconos de las noticias en portada
jQuery('#ut-uticonosportada-si').click(function() {
	localStorage["uticonosportada"] = 'si';
	jQuery('#ut-uticonosportada-no').css('color','#999999');
	jQuery('#ut-uticonosportada-si').css('color','#EF5000');
});
jQuery('#ut-uticonosportada-no').click(function() {
	localStorage["uticonosportada"] = 'no';
	jQuery('#ut-uticonosportada-si').css('color','#999999');
	jQuery('#ut-uticonosportada-no').css('color','#EF5000');
});
if (uticonosportada == 'si' || uticonosportada == undefined) {
	jQuery('#ut-uticonosportada-no').css('color','#999999');
}
if (uticonosportada == 'no') {
	jQuery('#ut-uticonosportada-si').css('color','#999999');
}
	// Iconos de las noticias en destacados
jQuery('#ut-uticonosdestacados-si').click(function() {
	localStorage["uticonosdestacados"] = 'si';
	jQuery('#ut-uticonosdestacados-no').css('color','#999999');
	jQuery('#ut-uticonosdestacados-si').css('color','#EF5000');
});
jQuery('#ut-uticonosdestacados-no').click(function() {
	localStorage["uticonosdestacados"] = 'no';
	jQuery('#ut-uticonosdestacados-si').css('color','#999999');
	jQuery('#ut-uticonosdestacados-no').css('color','#EF5000');
});
if (uticonosdestacados == 'si' || uticonosdestacados == undefined) {
	jQuery('#ut-uticonosdestacados-no').css('color','#999999');
}
if (uticonosdestacados == 'no') {
	jQuery('#ut-uticonosdestacados-si').css('color','#999999');
}
	// Lives destacados
jQuery('#ut-utlivesdestacados-si').click(function() {
	localStorage["utlivesdestacados"] = 'si';
	jQuery('#ut-utlivesdestacados-no').css('color','#999999');
	jQuery('#ut-utlivesdestacados-si').css('color','#EF5000');
});
jQuery('#ut-utlivesdestacados-no').click(function() {
	localStorage["utlivesdestacados"] = 'no';
	jQuery('#ut-utlivesdestacados-si').css('color','#999999');
	jQuery('#ut-utlivesdestacados-no').css('color','#EF5000');
});
if (utlivesdestacados == 'si' || utlivesdestacados == undefined) {
	jQuery('#ut-utlivesdestacados-no').css('color','#999999');
}
if (utlivesdestacados == 'no') {
	jQuery('#ut-utlivesdestacados-si').css('color','#999999');
}
	// Nuevos quotes
jQuery('#ut-utnewquote-si').click(function() {
	localStorage["utnewquote"] = 'si';
	jQuery('#ut-utnewquote-no').css('color','#999999');
	jQuery('#ut-utnewquote-si').css('color','#EF5000');
});
jQuery('#ut-utnewquote-no').click(function() {
	localStorage["utnewquote"] = 'no';
	jQuery('#ut-utnewquote-si').css('color','#999999');
	jQuery('#ut-utnewquote-no').css('color','#EF5000');
});
if (utnewquote == 'si' || utnewquote == undefined) {
	jQuery('#ut-utnewquote-no').css('color','#999999');
}
if (utnewquote == 'no') {
	jQuery('#ut-utnewquote-si').css('color','#999999');
}
	// Información de usuario en el hover del nick
jQuery('#ut-utuserinfo-si').click(function() {
	localStorage["utuserinfo"] = 'si';
	jQuery('#ut-utuserinfo-no').css('color','#999999');
	jQuery('#ut-utuserinfo-si').css('color','#EF5000');
});
jQuery('#ut-utuserinfo-no').click(function() {
	localStorage["utuserinfo"] = 'no';
	jQuery('#ut-utuserinfo-si').css('color','#999999');
	jQuery('#ut-utuserinfo-no').css('color','#EF5000');
});
if (utuserinfo == 'si' || utuserinfo == undefined) {
	jQuery('#ut-utuserinfo-no').css('color','#999999');
}
if (utuserinfo == 'no') {
	jQuery('#ut-utuserinfo-si').css('color','#999999');
}
	// Estilo spoilers
jQuery('#ut-utestilospoilers-si').click(function() {
	localStorage["utestilospoilers"] = 'si';
	jQuery('#ut-utestilospoilers-no').css('color','#999999');
	jQuery('#ut-utestilospoilers-si').css('color','#EF5000');
});
jQuery('#ut-utestilospoilers-no').click(function() {
	localStorage["utestilospoilers"] = 'no';
	jQuery('#ut-utestilospoilers-si').css('color','#999999');
	jQuery('#ut-utestilospoilers-no').css('color','#EF5000');
});
if (utestilospoilers == 'si' || utestilospoilers == undefined) {
	jQuery('#ut-utestilospoilers-no').css('color','#999999');
}
if (utestilospoilers == 'no') {
	jQuery('#ut-utestilospoilers-si').css('color','#999999');
}
	// Modo bigscreen
jQuery('#ut-utbigscreen-si').click(function() {
	localStorage["utbigscreen"] = 'si';
	jQuery('#ut-utbigscreen-no').css('color','#999999');
	jQuery('#ut-utbigscreen-si').css('color','#EF5000');
});
jQuery('#ut-utbigscreen-no').click(function() {
	localStorage["utbigscreen"] = 'no';
	jQuery('#ut-utbigscreen-si').css('color','#999999');
	jQuery('#ut-utbigscreen-no').css('color','#EF5000');
});
if (utbigscreen == 'si' || utbigscreen == undefined) {
	jQuery('#ut-utbigscreen-no').css('color','#999999');
}
if (utbigscreen == 'no') {
	jQuery('#ut-utbigscreen-si').css('color','#999999');
}
	// Boton ordenar posts
jQuery('#ut-utordenarposts-si').click(function() {
	localStorage["utordenarposts"] = 'si';
	jQuery('#ut-utordenarposts-no').css('color','#999999');
	jQuery('#ut-utordenarposts-si').css('color','#EF5000');
});
jQuery('#ut-utordenarposts-no').click(function() {
	localStorage["utordenarposts"] = 'no';
	jQuery('#ut-utordenarposts-si').css('color','#999999');
	jQuery('#ut-utordenarposts-no').css('color','#EF5000');
});
if (utordenarposts == 'si' || utordenarposts == undefined) {
	jQuery('#ut-utordenarposts-no').css('color','#999999');
}
if (utordenarposts == 'no') {
	jQuery('#ut-utordenarposts-si').css('color','#999999');
}
	// Avisos en el favicon
jQuery('#ut-utfavicon-si').click(function() {
	localStorage["utfavicon"] = 'si';
	jQuery('#ut-utfavicon-no').css('color','#999999');
	jQuery('#ut-utfavicon-si').css('color','#EF5000');
});
jQuery('#ut-utfavicon-no').click(function() {
	localStorage["utfavicon"] = 'no';
	jQuery('#ut-utfavicon-si').css('color','#999999');
	jQuery('#ut-utfavicon-no').css('color','#EF5000');
});
if (utfavicon == 'si' || utfavicon == undefined) {
	jQuery('#ut-utfavicon-no').css('color','#999999');
}
if (utfavicon == 'no') {
	jQuery('#ut-utfavicon-si').css('color','#999999');
}


// Mensaje al updatear y reset de opciones
var utversion = localStorage["utversion"];
var utpatchnotes = '<p style="font-size: 16px; font-weight: bold;">Actualización 1.8</p><br /><br />\
																- Actualización 100% centrada en la creación y edición de hilos y respuestas.<br /><br />\
																- Reedición de la botonera presentada en la versión 1.6. Código más limpio y liviano y con una segunda barra de botones.<br /><br />\
																- Sistema de macros personalizados. Guarda textos que reutilizas a menudo, como formatos para crear hilos nuevos, emotes, etc. Más información <a href="http://mvusertools.com/caracteristicas#macros" target="_blank">aquí</a>.<br /><br />\
																- Si tienes un accidente y tu navegador se cierra o refrescas sin querer la página, no perderás lo que llevaras escrito. Cuando vuelvas a la página todo estará por donde lo dejaste.<br /><br />\
																- Editar la info de tu perfil ahora es más fácil con la botonera también disponible allí.<br /><br />\
																- Botonera disponible ahora también en el fast-edit de tus posts. Para quien no lo sepa, doble click en el texto de un post tuyo y puedes editarlo al vuelo.<br /><br />\
																- Corrección de errores y mejoras internas en el código.\
																';
jQuery('<div style="display: none" id="ut-mask"></div>').insertBefore('#background');
jQuery('<div style="display: none" id="ut-dialog"><a href="http://mvusertools.com" target="_blank"><img style="margin: 0 150px;" src="http://www.mediavida.com/img/f/mediavida/2012/10/02632_mv_usertools_extension_para_firefox_chrome_safari_0_full.png"></a><div id="ut-window">'+ utpatchnotes +''+ bottominfo +'<a style="float: right; margin-top: 10px; cursor: pointer;" id="ut-box-cerrar">Cerrar</a></div></div>').insertBefore('#content_head');
jQuery(function() {
	if (utversion != '1.8') {
		jQuery('div#ut-mask').show();
		jQuery('div#ut-dialog').show();
		localStorage["utversion"] = '1.8';
		// localStorage["utlinksfooter"] = 'si';
		// localStorage["uttablamods"] = 'si';
		// localStorage["utmarcapaginas"] = 'si';
		// localStorage["uticonosportada"] = 'si';
		// localStorage["uticonosdestacados"] = 'si';
		// localStorage["utlivesdestacados"] = 'si';
		// localStorage["utnewquote"] = 'si';
		// localStorage["utuserinfo"] = 'si';
		// localStorage["utestilospoilers"] = 'si';
		// localStorage["utbigscreen"] = 'si';
		// localStorage["utfavicon"] = 'si';
	}
});
jQuery('#ut-box-cerrar').click(function() {
	jQuery('div#ut-mask').hide();
	jQuery('div#ut-dialog').hide();
});
jQuery('#ut-mask').click(function() {
	jQuery('div#ut-mask').hide();
	jQuery('div#ut-dialog').hide();
});



// MACROS kaod <3
jQuery(document).ready(function() { 
	JSON.encode = JSON.encode || JSON.stringify;
	JSON.decode = JSON.decode || JSON.parse;

	var storeJSON = function(key, object) {
		localStorage.setItem(key, JSON.encode(object));
	};

	var macros = JSON.decode(localStorage.getItem('macros')) || {};
	var updateMacros = function(store, $container) {
		var macros = {};
		$container.children().each(function(){
			var $macro = jQuery(this);
			var title = $macro.data('macro');
			if (!(title in store)) {
				$macro.slideUp('slow', function() {
					$macro.remove();
				});
			} else {
				macros[title] = $macro;
			}
		});

		var title;
		for (title in store) {
			if (!(title in macros)) {
				var $spantitle = jQuery('<span class="ut-titletxt">').text(title);
				var $spanmacro = jQuery('<div class="ut-macrotxt"' + (is_dark ? " style='color: #EEEEEE !important;'" : "") + '>').text(store[title]);
				var $title = jQuery('<a>').html(' <a style="cursor:pointer;" title="Borrar macro" class="ut-remove-macro"><i class="sprite icon-trash-orange"></i></a>').prepend($spantitle).append($spanmacro); // solo +title+ para la lista de titulos
				var $item = jQuery('<li class="ut-titleymacro">')
					.data('macro', title)
					.append($title)
					.hide();
				$container.append($item);
				$item.slideDown('slow');
			}
		}
	};
	var updateMacrosButton = function(store, $container2) {
		var macros = {};
		$container2.children().each(function(){
			var $macro = jQuery(this);
			var title = $macro.data('macro');
			if (!(title in store)) {
				$macro.slideUp('slow', function() {
					$macro.remove();
				});
			} else {
				macros[title] = $macro;
			}
		});

		var title;
		for (title in store) {
			if (!(title in macros)) {
				var $spantitle = jQuery('<span class="ut-titletxt-list">').text(title);
				var $title = jQuery('<div>').html(' ').prepend($spantitle);
				var $item = jQuery('<li class="ut-titleymacro-list">')
					.data('macro', title)
					.append($title)
					.hide();
				$container2.append($item);
				$item.slideDown('slow');
			}
		}
	};

	jQuery(function() {
		var $macros = jQuery('#ut-macros');
		var $macrosbutton = jQuery('#ut-button-macros-list ul');
		updateMacros(macros, $macros);
		updateMacrosButton(macros, $macrosbutton);

		jQuery("#ut-macros-form").submit(function() {
			var $title = jQuery("#ut-title");
			var $macro = jQuery("#ut-macro");
			var title = $title.val();
			var macro = $macro.val();

			if (title !== "" && macro !== "") {
				macros[title] = macro;
				storeJSON('macros', macros);
				$title.val('');
				$macro.val('');
				updateMacros(macros, $macros);
				updateMacrosButton(macros, $macrosbutton);
			}

			return false;
		});

		$macros.on('click', 'a.ut-remove-macro', function() {
			delete macros[jQuery(this).parent().parent().data('macro')]; // Si titulo es A y macro es B: macros['A'] te responderá 'B'
			storeJSON('macros', macros);
			updateMacros(macros, $macros);
			updateMacros(macros, $macrosbutton);
			
			return false;
		});
		$macrosbutton.on('click', 'li', function() {
			jQuery('textarea#cuerpo').insertAtCaretPos(macros[jQuery(this).data('macro')]);
			jQuery('#ut-button-macros-list').hide();
			return false;
		});
	});
});

jQuery(function() {
	if (jQuery('#goext').length > 0){
		jQuery('#ut-button-macros-list').addClass('ut-button-macros-list-barrendera');
	}
});



// Avisos en el favicon
jQuery(function(){
	if (utfavicon == 'si' || utfavicon == undefined) {
		if (utnoti === undefined) {var utnoti_int = parseInt(0,10);}
		else {var utnoti_int = parseInt(jQuery('div#userinfo a[href^="/foro/favoritos"] strong.bubble').html(),10);}
		if (utavisos === undefined) {var utavisos_int = parseInt(0,10);}
		else {var utavisos_int = parseInt(jQuery('div#userinfo a[href^="/notificaciones"] strong.bubble').html(),10);}
		if (utmsj === undefined) {var utmsj_int = parseInt(0,10);}
		else {var utmsj_int = parseInt(jQuery('div#userinfo a[href^="/mensajes"] strong.bubble').html(),10);}
		var utavisostotal = utnoti_int + utmsj_int + utavisos_int;
		jQuery('body').addClass(''+ utavisostotal +'');
		Tinycon.setBubble(utavisostotal);
		Tinycon.setOptions({
			fallback: true
		});
	}
});


// Ordenar por respuestas sin leer en favoritos (bug con hilos con 1k)
jQuery(function(){
	if (utordenarposts == 'si' || utordenarposts == undefined) {
		var $table = jQuery('div#main table.full');
		jQuery('<span style="font-size: 10px; margin-left: 20px;">Ordenar por: <span style="cursor: pointer; color: #EF5000;" id="ut-fav-fecha">Fecha</span> | <span style="cursor: pointer; color: #999999;" id="ut-fav-posts">Respuestas sin leer</span></span>').insertAfter('body#favoritos table#tfav th span.left');
		jQuery('<span style="font-size: 10px; margin-left: -110px;">Ordenar por: <span style="cursor: pointer; color: #EF5000;" id="ut-fav-fecha">Fecha</span> | <span style="cursor: pointer; color: #999999;" id="ut-fav-posts">Respuestas sin leer</span></span>').insertAfter('body#foros table.full th span.left');
		var originalRows = $table.find('tr').slice(1).get(),
			rows = originalRows.slice(0);

		jQuery("#ut-fav-posts").click(function(){
			rows.sort(function(a, b) {
				var keyA = +$(a).find('a.unreadcount').text();
				var keyB = +$(b).find('a.unreadcount').text();
				if (keyA < keyB) return 1;
				if (keyA > keyB) return -1;
				return 0;
			});
			jQuery.each(rows, function(index, row) {
				$table.children('tbody').append(row);
			});
			jQuery("#ut-fav-posts").css('color','#EF5000');
			jQuery("#ut-fav-fecha").css('color','#999999');
		});

		jQuery("#ut-fav-fecha").click(function(){
			jQuery.each(originalRows, function(index, row) {
			   $table.children('tbody').append(row);
			});
			jQuery("#ut-fav-posts").css('color','#999999');
			jQuery("#ut-fav-fecha").css('color','#EF5000');
		});
	}
});


// Estilos para los spoilers
jQuery(function(){
	if (utestilospoilers == 'si' || utestilospoilers == undefined) {
		jQuery(function(){
			if (is_dark == 0) {
				jQuery('.spoiler').each(function() {
					spoiler_id = jQuery(this).attr('rel');
					jQuery('#' + spoiler_id).addClass('spoiler-content');
				});
			}
			else {
				jQuery('.spoiler').each(function() {
					spoiler_id = jQuery(this).attr('rel');
					jQuery('#' + spoiler_id).addClass('spoiler-content-black');
				});
			}
		});
	}	
});


// Modo bigscreen en live con stream
jQuery(function() {
	if (utbigscreen == 'si' || utbigscreen == undefined) {
		if (postitlive != 0) {
			jQuery('<div id="bigscreen-mode" class="sprite"></div>').insertAfter('a#showform');
			jQuery('<div style="display: none;" id="bigscreen-mode-off" class="sprite"></div>').insertAfter('a#showform');
		
			jQuery('#bigscreen-mode').click(function() {
				jQuery('div.tinycol').addClass('bigscreen');
				jQuery('div.postit').addClass('bigscreen');
				jQuery('div#pi_body').addClass('bigscreen');
				jQuery('div#pi_body div.embedded').addClass('bigscreen');
				jQuery('div#pi_body div.embedded object').attr({
				  width: '930',
				  height: '550'
				});
				jQuery('div#pi_body div.embedded object embed').attr({
				  width: '930',
				  height: '550'
				});
				jQuery('#bigscreen-mode').hide();
				jQuery('#bigscreen-mode-off').show();
			});
			jQuery('#bigscreen-mode-off').click(function() {
				jQuery('div.tinycol').removeClass('bigscreen');
				jQuery('div.postit').removeClass('bigscreen');
				jQuery('div#pi_body').removeClass('bigscreen');
				jQuery('div#pi_body div.embedded').removeClass('bigscreen');
				jQuery('div#pi_body div.embedded object').attr({
				  width: '560',
				  height: '315'
				});
				jQuery('div#pi_body div.embedded object embed').attr({
				  width: '560',
				  height: '315'
				});
				jQuery('#bigscreen-mode').show();
				jQuery('#bigscreen-mode-off').hide();
			});
		}
	}
});	

// Información del perfil en la lista de users
jQuery(function() {
	if (utuserinfo == 'si' || utuserinfo == undefined) {
		jQuery(document).ready(function() {
			var pendingInfoBox = undefined;
			var infoBoxX = undefined;
			var infoBoxY = undefined;

			function checkUserInfoBox() {
				if(pendingInfoBox != undefined) {
					launchUserInfoBox(pendingInfoBox);
				}
			}

			function launchUserInfoBox() {
				jQuery.get('http://www.mediavida.com/id/' + pendingInfoBox, function(data) {
					jQuery('.infoavatar', data).each(function() {
						if(pendingInfoBox == undefined) return false;
						jQuery('#ajax_usercard').remove();
						jQuery('body').append('<div id="ajax_usercard">'+ jQuery(this).html() +'</div>');
						var box = jQuery('#ajax_usercard');
						if (is_dark == 0) {
							box.css('background-Color', 'whitesmoke');
						}
						else {
							box.css('background-color', '#39444B');
						}
						box.css('borderRadius', '6px');
						box.css('padding', '10px 5px 5px 5px');
						box.css('position', 'absolute');
						box.css('left', infoBoxX);
						box.css('top', infoBoxY);
						box.css('overflow', 'hidden');
						box.css('boxShadow', '1px 1px 5px rgba(0, 0, 0, 0.25)');
						box.css('zIndex', '9999');

						var uavatar = jQuery('.useravatar', box);
						uavatar.css('float', 'left');
						uavatar.css('padding', '5px');
						uavatar.css('marginRight', '5px');

						var uinfo = jQuery('.userinfo', box);
						uinfo.css('borderRadius', '6px');
						uinfo.css('width', '254px');
						uinfo.css('height', '90px');
						uinfo.css('backgroundColor', '#F4F6F1');
						uinfo.css('float', 'left');
						uinfo.css('padding', '5px');
						uinfo.css('position', 'relative');
						uinfo.css('zoom', '1');
						
					});
				});
			}

			jQuery('.post .autor dt a').hover(function(event) {
				offset = jQuery(this).offset();
				pendingInfoBox = jQuery(this).html();
				infoBoxX = offset.left - 10;
				infoBoxY = offset.top + 14;
				setTimeout(checkUserInfoBox, 1000);
			}, function() {
				pendingInfoBox = undefined;
				jQuery('#ajax_usercard').remove();
			});
		});
	}
});	



// Nuevo estilo para los QUOTES
jQuery(function() {
	if (utnewquote == 'si' || utnewquote == undefined) {
		jQuery(function() {
			if (is_dark == 0) {
				jQuery('div.msg div.body').addClass('newquote');
			}
			else {
				jQuery('div.msg div.body').addClass('newquoteblack');
			}
		});	
	}
});	


// Mods de cada foro
jQuery(function() {
	if (uttablamods == 'si' || uttablamods == undefined) {
		jQuery(function() {
			if(jQuery('div#topnav a[href="/foro/"]').length > 0 && jQuery('div.live_info').length == 0) {
				jQuery('div.smallcol, div.tinycol').append('<div class="box"><div id="modlist"><h3>Moderadores</h3></div></div>');
				var url = window.location.pathname;
				var id = url.split("/")[2];
				mods = [
					['nulo'],['bazoo','jadgix','J40','RaymaN','TazzMaTazz'],['Eristoff','kalinka-'],['aLeX','Josekron','Loa','MegalomaniaC','mongui','Prava'],[''],[''],['Atoll','Bloody','Eristoff','Kails','JMBaDBoY','Prava','PruDeN','sacnoth',],['abichuela','AG','alejo','Ch4iNeR','cm07','Korso','lb_nacho','Netzach','VipeR_CS'],[''],['Kaos','PiradoIV'],['TNx7','tutitin'],[''],[''],[''],[''],[''],[''],[''],[''],['Kaneas','TNx7'],[''],[''],['Cryoned','DuPonT'],['darkavm','ElKedao','Privatovic','ukuki'],[''],[''],['Midgard','StumKrav','thunder_'],[''],[''],[''],[''],['Eristoff','ReYzell'],['Andy','eisenfaust','ISAILOVIC','JMBaDBoY','loko_man','ruben132','Sh1n0d4','t0rrY',],[''],[''],[''],[''],[''],['Hir0shz','Ligia','ManOwaR','sPoiLeR',],[''],['ferk','HaZuKi','horvathzeros','J40'],[''],['dangerous','zashael'],[''],[''],[''],[''],[''],[''],[''],[''],[''],['BigmAK','MaSqUi','tutitin','XaViMeTaL'],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['Cheester','cuerpi','darkavm','sk_sk4t3r','TNx7','Txentx0'],['spyro512'],[''],[''],[''],['GR33N'],[''],[''],['Snorky','spyro512'],[''],[''],[''],[''],[''],['JMBaDBoY','Sirius_spa','suggus','ZaGo'],['granaino127','SaBaNdIjA'],['granaino127','SaBaNdIjA'],['darkavm','GryF','Kb','lb_nacho','-Power'],[''],[''],['ElKedao','darkavm','dicon','sk_sk4t3r'],[''],[''],[''],['Atoll','ZaGo'],['DeNz1L','kaitoo','NosFeR_'],['Skelus'],['darkavm','Dolz','Txentx0','urrako'],['babri','dicon','RoDRa','Spank'],['iosp','Hogwarts','lb_nacho'],['zashael'],['Charly-','edvan','frostttt','Kazuya_','zashael'],['0buS','RaymaN','sPoiLeR'],['CsNarsil','CybeR'],['eisenfaust'],['bazoo','StumKrav','thunder_'],['DarkHawX','Korso','Netzach','StumKrav'],['benitogb','BigmAK'],[''],['Andy','ISAILOVIC','JMBaDBoY','loko_man','ruben132','Sh1n0d4','t0rrY'],[''],['allmy','naete','slakk','StumKrav','thunder_'],['gonya707','TRON'],['babri','RoninPiros',],['Bidroid','MagicAnnii'],['ChaRliFuM','menolikeyou','undimmer'],['locof','Pedrosa7','Syuk',],[''],['alexander','ferk','horvathzeros','J40'],[''],[''],['cm07','RoninPiros'],[''],['Rundull'],[''],[''],[''],[''],['']
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
	}
});


// Links importantes en el footer
jQuery(function(){
	if (utlinksfooter == 'si' || utlinksfooter == undefined) {
		jQuery(function(){
		   if(jQuery('a.boton[href^="/foro/post.php?f"]').length > 0){
				jQuery('div#userinfo strong.bar').clone().addClass('linksfooter2').each(function(){
					if (is_dark || utlinksfooteroscuro == 'si') {
						jQuery(this).addClass('linksfooternegro').removeClass('bar').insertAfter('div.tfooter').prepend('<a href="/foro/">Foros</a> <a href="/foro/spy">Spy</a> |');
					}
					else {
						jQuery(this).addClass('linksfooterblanco').removeClass('bar').insertAfter('div.tfooter').prepend('<a href="/foro/">Foros</a> <a href="/foro/spy">Spy</a> |');
						jQuery('.linksfooter2 a[href^="/id/"] img').attr('src', 'http://www.mvusertools.com/ext/img/keko_bar.png');
						jQuery('.linksfooter2 a[href^="/notificaciones"] img').attr('src', 'http://www.mvusertools.com/ext/img/avisos_bar.png');
						jQuery('.linksfooter2 a[href^="/foro/favoritos"] img').attr('src', 'http://www.mvusertools.com/ext/img/fav_bar.png');
						jQuery('.linksfooter2 a[href^="/mensajes"] img').attr('src', 'http://www.mvusertools.com/ext/img/mail_bar.png');
					}
				});
				jQuery('.linksfooter2 .separator').remove();
				jQuery('.linksfooter2 #ut-menu').remove();
				jQuery('.linksfooter2 a[href^="/id/"]').children('span').text('Perfil');
					//Noti
				jQuery(function() {
				if (utnoti != undefined) {
					jQuery('.linksfooter2 a[href^="/foro/favoritos"] span.uextra').append(' ('+ utnoti +')');
				}
				});
				jQuery('.linksfooter2 a[href^="/foro/favoritos"] strong.bubble').remove();
					//Avisos
				jQuery(function() {
				if (utavisos != undefined) {
					jQuery('.linksfooter2 a[href^="/notificaciones"] span.uextra').append(' ('+ utavisos +')');
				}
				});
				jQuery('.linksfooter2 a[href^="/notificaciones"] strong.bubble').remove();
					//Mensajes
				jQuery(function() {
				if (utmsj != undefined) {
					jQuery('.linksfooter2 a[href^="/mensajes"] span.uextra').append(' ('+ utmsj +')');
				}
				});
				jQuery('.linksfooter2 a[href^="/mensajes"] strong.bubble').remove();
			 }
			 else {
				 jQuery('div#userinfo strong.bar').clone().addClass('linksfooter2').each(function(){
						if (is_dark || utlinksfooteroscuro == 'si') {
							jQuery(this).addClass('linksfooternegro').removeClass('bar').insertAfter('form#postform[action="/foro/post_action.php"]').prepend('<a href="/foro/spy">Spy</a> |');
						}
						else {
							jQuery(this).addClass('linksfooterblanco').removeClass('bar').insertAfter('form#postform[action="/foro/post_action.php"]').prepend('<a href="/foro/spy">Spy</a> |');
							jQuery('.linksfooter2 a[href^="/id/"] img').attr('src', 'http://www.mvusertools.com/ext/img/keko_bar.png');
							jQuery('.linksfooter2 a[href^="/notificaciones"] img').attr('src', 'http://www.mvusertools.com/ext/img/avisos_bar.png');
							jQuery('.linksfooter2 a[href^="/foro/favoritos"] img').attr('src', 'http://www.mvusertools.com/ext/img/fav_bar.png');
							jQuery('.linksfooter2 a[href^="/mensajes"] img').attr('src', 'http://www.mvusertools.com/ext/img/mail_bar.png');
						}
					});		 
				jQuery('.linksfooter2 .separator').remove();
				jQuery('.linksfooter2 #ut-menu').remove();
				jQuery('.linksfooter2 a[href^="/id/"]').children('span').text('Perfil');
					//Noti
				jQuery(function() {
				if (utnoti != undefined) {
					jQuery('.linksfooter2 a[href^="/foro/favoritos"] span.uextra').append(' ('+ utnoti +')');
				}
				});
				jQuery('.linksfooter2 a[href^="/foro/favoritos"] strong.bubble').remove();
					//Avisos
				jQuery(function() {
				if (utavisos != undefined) {
					jQuery('.linksfooter2 a[href^="/notificaciones"] span.uextra').append(' ('+ utavisos +')');
				}
				});
				jQuery('.linksfooter2 a[href^="/notificaciones"] strong.bubble').remove();
					//Mensajes
				jQuery(function() {
				if (utmsj != undefined) {
					jQuery('.linksfooter2 a[href^="/mensajes"] span.uextra').append(' ('+ utmsj +')');
				}
				});
				jQuery('.linksfooter2 a[href^="/mensajes"] strong.bubble').remove();
			 }
		});
	}
});

// Marcapaginas en los posts que entras directamente
jQuery(function(){
	if (utmarcapaginas == 'si' || utmarcapaginas == undefined) {
		jQuery('div.mark').attr('style', 'background-image: url("http://www.mvusertools.com/ext/img/marcapaginas2.png") !important; background-repeat: no-repeat !important; background-position: 100px top !important;');
	}
});

// > Greentext (no funciona, hace que dejen de ir los popups de las imagenes y los el hover de los quotes)
// > Implicando que no mola
		// jQuery('div[id^="cuerpo_"]').html(
		// function (i,h) {
			// return h.replace(/^\s*&gt.*/mg, function(a) {
				// if (is_dark) {
			        // return "<span style='color: #A7BD68;'>" + a + "</span>"
			    // } else {
			        // return "<span style='color: #789922;'>" + a + "</span>"
			    // }
			// });	
		// });

//Icono del foro del que viene la noticia en Portada
jQuery(function(){
	if (uticonosportada == 'si' || uticonosportada == undefined) {
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
		jQuery('div.item div.bbar div.left:first-child').contents().filter(function(){
			return this.nodeType === 3;
		}).remove();
		jQuery('div.item div.bbar div.left:first-child').prepend('En ');
	}
});
		
		//Icono del foro del que viene la noticia en Destacados
jQuery(function(){
	if (uticonosdestacados == 'si' || uticonosdestacados == undefined) {
		jQuery('ul.mini a[href^="/foro"]').each(function(i) {
			var enlace = this + "";
			var split = enlace.split('/');
			var path = split.splice(1, split.length - 1);
			var pathIndexToGet = 3;
			var foro = path[pathIndexToGet];
			var foroicon = 'http://www.mediavida.com/style/img/icon/foro/' + foro + '.png';
			jQuery(this).closest('li').attr('style','background-image: url('+ foroicon +') !important; background-repeat: no-repeat !important; background-position: 5px center !important; padding: 10px 8px 10px 35px !important;');
		});
	}
});


// nueva botonera
jQuery('button[accesskey="b"]').hide();
jQuery('<button class="alt bleft bb" accesskey="b" type="button" onclick="bbstyle(0)">b</button>').insertAfter('button[accesskey="b"]');
jQuery('button[accesskey="i"]').hide();
jQuery('<button class="alt bcenter bi" accesskey="i" type="button" onclick="bbstyle(2)">i</button><button class="alt bcenter2 bu" accesskey="u" type="button" onclick="bbstyle(4)">u</button><button id="ut-boton-s" class="alt bright bs" accesskey="x" type="button">s</button><button class="alt bsolo" id="ut-boton-center" accesskey="c" type="button" title="[center]"><a class="sprite bcentericon"></a></button><button class="alt bsolo" id="ut-boton-list" type="button" title="[list] Usar * para cada elemento de la lista"><a class="blist sprite"></a></button>').insertAfter('button[accesskey="i"]');
jQuery('button[accesskey="l"]').hide();
jQuery('<button class="alt bsolo" accesskey="l" type="button" onclick="bbstyle(8)">[url=]</button>').insertAfter('button[accesskey="l"]');
jQuery('button[accesskey="m"]').hide();
jQuery('<button class="alt bleft" accesskey="m" type="button" onclick="bbstyle(10)" title="[img]"><a class="bimg sprite"></a></button>').insertAfter('button[accesskey="m"]');
jQuery('button[accesskey="v"]').hide();
jQuery('<button class="alt bcenter" accesskey="v" type="button" onclick="bbstyle(12)" title="[video]"><a class="bvideo sprite"></a></button><button title="[audio]" id="ut-boton-audio" class="alt bright" type="button"><a class="baudio sprite"></a></button>').insertAfter('button[accesskey="v"]');
jQuery('button[accesskey="s"]').hide();
jQuery('<button class="alt bleft" accesskey="s" type="button" onclick="bbstyle(14)">[spoiler]</button>').insertAfter('button[accesskey="s"]');
jQuery('button[accesskey="d"]').hide();
jQuery('<button class="alt bcenter" accesskey="d" type="button" onclick="bbstyle(16)">[spoiler=]</button>').insertAfter('button[accesskey="d"]');
jQuery('button[accesskey="n"]').hide();
jQuery('<button class="alt bright" accesskey="n" type="button" onclick="bbstyle(18)">NSFW</button><button title="Pulsa para ver más opciones" id="ut-boton-plus" class="alt bsolo" type="button"><a class="ut-arrow-down sprite"></a></button><script></script>').insertAfter('button[accesskey="n"]');

jQuery("#ut-boton-s").click(function() {
	if (jQuery('textarea#cuerpo').getSelection().text.length > 0) {
		jQuery("textarea#cuerpo").replaceSelection('[s]' + jQuery('textarea#cuerpo').getSelection().text + '[/s]').setCaretPos();
	}
	else {
		jQuery("textarea#cuerpo").insertAtCaretPos('[s][/s]').setCaretPos(jQuery('textarea#cuerpo').getSelection().end -3);
	}
});
jQuery("#ut-boton-center").click(function() {
	if (jQuery('textarea#cuerpo').getSelection().text.length > 0) {
		jQuery("textarea#cuerpo").replaceSelection('[center]' + jQuery('textarea#cuerpo').getSelection().text + '[/center]').setCaretPos();
	}
	else {
		jQuery("textarea#cuerpo").insertAtCaretPos('[center][/center]').setCaretPos(jQuery('textarea#cuerpo').getSelection().end -8);
	}
});
jQuery("#ut-boton-list").click(function() {
	if (jQuery('textarea#cuerpo').getSelection().text.length > 0) {
		jQuery("textarea#cuerpo").replaceSelection('[list]' + jQuery('textarea#cuerpo').getSelection().text + '[/list]').setCaretPos();
	}
	else {
		jQuery("textarea#cuerpo").insertAtCaretPos('[list][/list]').setCaretPos(jQuery('textarea#cuerpo').getSelection().end -6);
	}
});
jQuery("#ut-boton-audio").click(function() {
	if (jQuery('textarea#cuerpo').getSelection().text.length > 0) {
		jQuery("textarea#cuerpo").replaceSelection('[audio]' + jQuery('textarea#cuerpo').getSelection().text + '[/audio]').setCaretPos();
	}
	else {
		jQuery("textarea#cuerpo").insertAtCaretPos('[audio][/audio]').setCaretPos(jQuery('textarea#cuerpo').getSelection().end -7);
	}
});


// Segunda linea en la botonera
var utsegundabarra = '<button class="alt bsolo" id="ut-boton-bar" type="button">[bar]</button><button class="alt bsolo" type="button" onclick="bbstyle(20)">[code]</button><button id="ut-button-macros" class="alt bsolo" type="button">macros <i class="sprite icon-down-list"></i></button><div id="ut-button-macros-list" style="display: none;"><ul></ul><a href="#ut-dialog-menu" id="ut-button-macros-list-anadir">añadir macro</a></div>'
jQuery('<div id="ut-botonera2" style="overflow: hidden;margin: 10px 0;clear: both; display: none;">'+ utsegundabarra +'</div>').insertAfter('form#postear div[style="overflow: hidden;margin: 10px 0;clear: both"]');
jQuery('<div id="ut-botonera2" style="overflow: hidden;margin: 10px 0;clear: both; display: none;">'+ utsegundabarra +'</div>').insertAfter('form#postform div[style="overflow: hidden;margin-bottom: 10px;clear: both"]');
jQuery('#ut-boton-plus').click(function(){
	if (jQuery('#ut-botonera2').is( ":visible" )){
		jQuery('#ut-botonera2').slideUp();
		jQuery('#ut-boton-plus a').toggleClass('ut-arrow-down').toggleClass('ut-arrow-up');
		jQuery('#ut-boton-plus').attr('title', 'Pulsa para ver más opciones');
	}
	else {
		jQuery('#ut-botonera2').slideDown();
		jQuery('#ut-boton-plus a').toggleClass('ut-arrow-down').toggleClass('ut-arrow-up');
		jQuery('#ut-boton-plus').attr('title', 'Pulsa para ocultar la segunda linea de opciones');
	}
});
jQuery("#ut-boton-bar").click(function() {
	if (jQuery('textarea#cuerpo').getSelection().text.length > 0) {
		jQuery("textarea#cuerpo").replaceSelection('[bar]' + jQuery('textarea#cuerpo').getSelection().text + '[/bar]').setCaretPos();
	}
	else {
		jQuery("textarea#cuerpo").insertAtCaretPos('[bar][/bar]').setCaretPos(jQuery('textarea#cuerpo').getSelection().end -5);
	}
});
jQuery("#ut-button-macros").click(function() {
	if (jQuery('#ut-button-macros-list[style="display: none;"]').length){
	jQuery('#ut-button-macros-list').show();
	}
	else {
	jQuery('#ut-button-macros-list').hide();
	}
});
jQuery('#ut-button-macros-list').mouseup(function() {
	 return false
});
jQuery('#ut-button-macros').mouseup(function() {
	 return false
});
jQuery(document).mouseup(function() {
	jQuery('#ut-button-macros-list').hide();
});
jQuery("#ut-button-macros-list-anadir").click(function() {
	jQuery('#ut-mask-menu').show();
	jQuery('#ut-dialog-menu').show();
	jQuery('#ut-menu-tab1').removeClass('active');
	jQuery('#ut-menu-tab2').removeClass('active');
	jQuery('#ut-menu-tab3').removeClass('active');
	jQuery('#ut-menu-tab4').addClass('active');
	jQuery('#ut-menu-tabla1').hide();
	jQuery('#ut-menu-tabla2').hide();
	jQuery('#ut-menu-tabla3').hide();
	jQuery('#ut-menu-tabla4').show();
});


// Nueva botonera en el perfil
jQuery('<div style="overflow: hidden;margin: 0 0 5px 0;clear: both"><button type="button" accesskey="b" class="alt bleft bb" id="ut-boton-b-perfil">b</button><button type="button" accesskey="i" class="alt bcenter bi" id="ut-boton-i-perfil">i</button><button type="button" accesskey="u" class="alt bright bu" id="ut-boton-u-perfil">u</button><button type="button" accesskey="l" class="alt bsolo" id="ut-boton-url-perfil">[url=]</button><button type="button" accesskey="s" class="alt bleft" id="ut-boton-spoiler-perfil">[spoiler]</button><button type="button" accesskey="d" class="alt bcenter" id="ut-boton-spoiler2-perfil">[spoiler=]</button><button type="button" accesskey="n" class="alt bright" id="ut-boton-nsfw-perfil">NSFW</button></div>').insertBefore('body.usuarios textarea[name="info"]');
jQuery("#ut-boton-b-perfil").click(function() {
	if (jQuery('textarea[name="info"]').getSelection().text.length > 0) {
		jQuery('textarea[name="info"]').replaceSelection('[b]' + jQuery('textarea[name="info"]').getSelection().text + '[/b]').setCaretPos();
	}
	else {
		jQuery('textarea[name="info"]').insertAtCaretPos('[b][/b]').setCaretPos(jQuery('textarea[name="info"]').getSelection().end -3);
	}
});
jQuery("#ut-boton-i-perfil").click(function() {
	if (jQuery('textarea[name="info"]').getSelection().text.length > 0) {
		jQuery('textarea[name="info"]').replaceSelection('[i]' + jQuery('textarea[name="info"]').getSelection().text + '[/i]').setCaretPos();
	}
	else {
		jQuery('textarea[name="info"]').insertAtCaretPos('[i][/i]').setCaretPos(jQuery('textarea[name="info"]').getSelection().end -3);
	}
});
jQuery("#ut-boton-u-perfil").click(function() {
	if (jQuery('textarea[name="info"]').getSelection().text.length > 0) {
		jQuery('textarea[name="info"]').replaceSelection('[u]' + jQuery('textarea[name="info"]').getSelection().text + '[/u]').setCaretPos();
	}
	else {
		jQuery('textarea[name="info"]').insertAtCaretPos('[u][/u]').setCaretPos(jQuery('textarea[name="info"]').getSelection().end -3);
	}
});
jQuery("#ut-boton-url-perfil").click(function() {
	if (jQuery('textarea[name="info"]').getSelection().text.length > 0) {
		jQuery('textarea[name="info"]').replaceSelection('[url=]' + jQuery('textarea[name="info"]').getSelection().text + '[/url]').setCaretPos();
	}
	else {
		jQuery('textarea[name="info"]').insertAtCaretPos('[url=][/url]').setCaretPos(jQuery('textarea[name="info"]').getSelection().end -5);
	}
});
jQuery("#ut-boton-spoiler-perfil").click(function() {
	if (jQuery('textarea[name="info"]').getSelection().text.length > 0) {
		jQuery('textarea[name="info"]').replaceSelection('[spoiler]' + jQuery('textarea[name="info"]').getSelection().text + '[/spoiler]').setCaretPos();
	}
	else {
		jQuery('textarea[name="info"]').insertAtCaretPos('[spoiler][/spoiler]').setCaretPos(jQuery('textarea[name="info"]').getSelection().end -9);
	}
});
jQuery("#ut-boton-spoiler2-perfil").click(function() {
	if (jQuery('textarea[name="info"]').getSelection().text.length > 0) {
		jQuery('textarea[name="info"]').replaceSelection('[spoiler=]' + jQuery('textarea[name="info"]').getSelection().text + '[/spoiler]').setCaretPos();
	}
	else {
		jQuery('textarea[name="info"]').insertAtCaretPos('[spoiler=][/spoiler]').setCaretPos(jQuery('textarea[name="info"]').getSelection().end -9);
	}
});
jQuery("#ut-boton-nsfw-perfil").click(function() {
	if (jQuery('textarea[name="info"]').getSelection().text.length > 0) {
		jQuery('textarea[name="info"]').replaceSelection('[spoiler=NSFW]' + jQuery('textarea[name="info"]').getSelection().text + '[/spoiler]').setCaretPos();
	}
	else {
		jQuery('textarea[name="info"]').insertAtCaretPos('[spoiler=NSFW][/spoiler]').setCaretPos(jQuery('textarea[name="info"]').getSelection().end -9);
	}
});

// Botonera en el fast-edit div.msg div.body div textarea
function botonessolounavez() {
	jQuery(function(){
		jQuery(document).one('mouseenter','div.msg div.body div textarea' , function(){
			fasteditbuttons();
		});
		function fasteditbuttons() {
			jQuery('<div style="overflow: hidden;margin: 0 0px 10px -5px;clear: both"><button type="button" accesskey="b" class="alt bleft bb" id="ut-boton-b-fast">b</button><button type="button" accesskey="i" class="alt bcenter bi" id="ut-boton-i-fast">i</button><button type="button" accesskey="u" class="alt bcenter2 bu" id="ut-boton-u-fast">u</button><button type="button" accesskey="x" class="alt bright bs" id="ut-boton-s-fast">s</button><button title="[center]" type="button" accesskey="c" id="ut-boton-center-fast" class="alt bsolo"><a class="sprite bcentericon"></a></button><button title="[list] Usar * para cada elemento de la lista" type="button" id="ut-boton-list-fast" class="alt bsolo"><a class="blist sprite"></a></button><button type="button" accesskey="l" class="alt bsolo" id="ut-boton-url-fast">[url=]</button><button title="[img]" type="button" accesskey="m" class="alt bleft" id="ut-boton-img-fast"><a class="bimg sprite"></a></button><button title="[video]" type="button" accesskey="v" class="alt bcenter" id="ut-boton-video-fast"><a class="bvideo sprite"></a></button><button type="button" class="alt bright" title="[audio]" id="ut-boton-audio-fast"><a class="baudio sprite"></a></button><button type="button" accesskey="s" class="alt bleft" id="ut-boton-spoiler-fast">[spoiler]</button><button type="button" accesskey="d" class="alt bcenter" id="ut-boton-spoiler2-fast">[spoiler=]</button><button type="button" accesskey="n" class="alt bright" id="ut-boton-nsfw-fast">NSFW</button><button type="button" id="ut-boton-bar-fast" class="alt bsolo">[bar]</button><button type="button" class="alt bsolo" id="ut-boton-code-fast">[code]</button></div>').insertBefore('div.msg div.body div textarea:not("div.extraportada textarea")');
		}
	});
}
jQuery(document).ready(function(){
	botonessolounavez();
});
jQuery(document).on('click', 'button.cancelButton', function() {
	botonessolounavez();
});
jQuery(document).on('click', 'button.saveButton', function() {
	botonessolounavez();
});
jQuery(document).on('click', '#ut-boton-b-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[b]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/b]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[b][/b]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -3);
	}
});
jQuery(document).on('click', '#ut-boton-i-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[i]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/i]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[i][/i]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -3);
	}
});
jQuery(document).on('click', '#ut-boton-u-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[u]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/u]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[u][/u]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -3);
	}
});
jQuery(document).on('click', '#ut-boton-s-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[s]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/s]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[s][/s]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -3);
	}
});
jQuery(document).on('click', '#ut-boton-center-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[center]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/center]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[center][/center]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -8);
	}
});
jQuery(document).on('click', '#ut-boton-list-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[list]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/list]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[list][/list]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -6);
	}
});
jQuery(document).on('click', '#ut-boton-url-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[url=]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/url]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[url=][/url]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -5);
	}
});
jQuery(document).on('click', '#ut-boton-img-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[img]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/img]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[img][/img]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -5);
	}
});
jQuery(document).on('click', '#ut-boton-video-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[video]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/video]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[video][/video]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -7);
	}
});
jQuery(document).on('click', '#ut-boton-audio-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[audio]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/audio]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[audio][/audio]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -7);
	}
});
jQuery(document).on('click', '#ut-boton-spoiler-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[spoiler]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/spoiler]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[spoiler][/spoiler]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -9);
	}
});
jQuery(document).on('click', '#ut-boton-spoiler2-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[spoiler=]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/spoiler]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[spoiler=][/spoiler]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -9);
	}
});
jQuery(document).on('click', '#ut-boton-nsfw-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[spoiler=NSFW]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/spoiler]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[spoiler=NSFW][/spoiler]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -9);
	}
});
jQuery(document).on('click', '#ut-boton-bar-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[bar]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/bar]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[bar][/bar]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -5);
	}
});
jQuery(document).on('click', '#ut-boton-code-fast', function() {
	if (jQuery('div.msg div.body div textarea').getSelection().text.length > 0) {
		jQuery('div.msg div.body div textarea').replaceSelection('[code]' + jQuery('div.msg div.body div textarea').getSelection().text + '[/code]').setCaretPos();
	}
	else {
		jQuery('div.msg div.body div textarea').insertAtCaretPos('[code][/code]').setCaretPos(jQuery('div.msg div.body div textarea').getSelection().end -6);
	}
});

// Salvar forms
jQuery('form#postear').sisyphus({
  customKeyPrefix: 'utextendido',
  timeout: 10,
  autoRelease: true
 });
 jQuery('form#postform.single').sisyphus({
  customKeyPrefix: 'utfast',
  timeout: 10,
  autoRelease: true
 });

// hilos con live destacados (solo funciona con theme normal)
if (utlivesdestacados == 'si' || utfavicon == undefined) {
	jQuery(document).on('mouseover','body', function(){
		jQuery('img[alt="live"]').closest('tr').addClass('ut-live');
	});
}


// hilos sobre relaciones y amor destacados (DESCARTADO, YA EXISTE UNA CATEGORIA DE AMOR Y RELACIONES)
// jQuery('<img alt="Relaciones" src="http://www.mvwat.com/mvusertools/heart.png" style="width: 12px; height: 12px;">').insertAfter('a[class="hb"]:contains("amor"), a[class="hb"]:contains("rollo"), a[class="hb"]:contains("novia"), a[class="hb"]:contains("celos")');


// Alien_crrpt = Alien_derp
jQuery('div[class="autor"]:contains("Alien_crrpt")').children().children('dt').replaceWith('<dt><a href="/id/Alien_crrpt">Alien_derp</a></dt>');
jQuery('div[class="autor"]:contains("Masme")').children().children('dt').replaceWith('<dt><a href="/id/Masme">Madme</a></dt>');
jQuery('div[class="autor"]:contains("Ekisu")').children().children('dt').replaceWith('<dt><a href="/id/Ekisu">X-Crim</a></dt>');
	jQuery('div[class="autor"]:contains("X-Crim")').children().children('dd:first').replaceWith('<dd style="font-size: 10px">Mod de Mario Kart</dd>');

// Version en el footer
jQuery(function(){
	if (utversion == undefined) {
		jQuery('div#footer div.f_info p').append('• Estás usando <a href="http://mvusertools.com" target="_blank">MV-Usertools</a>');
	}
	else {
		jQuery('div#footer div.f_info p').append('• Estás usando <a href="http://mvusertools.com" target="_blank">MV-Usertools</a> versión '+ utversion +'');
	}
});


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
						<div class='online-pos'><a class='tooltip ut-offline sprite' href='http://www.mediavida.com/id/" + jQuery(this).data('name') + "' original-title='Perfil' ></a></div>\
						<div class='mensaje-pos'><a class='tooltip mensaje sprite' href='http://www.mediavida.com/mensajes/nuevo/" + jQuery(this).data('name') + "' original-title='Mensaje'></a></div>\
						<div class='firma-pos'><a class='tooltip ut-firma sprite' href='http://www.mediavida.com/id/" + jQuery(this).data('name') + "/firmas' original-title='Firma'></a></div>\
						<div class='blacklist-pos'><a class='tooltip blacklist blacklist-off sprite' href='javascript:void(0)' original-title='Blacklist'></a></div>\
				</div>");
});
jQuery('div.autor dd.online').hide();
jQuery('div.autor dd.online').parent().parent().find('.ut-offline').toggleClass('ut-online ut-offline');

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