// ==UserScript==
// @name           MV-Usertools
// @namespace      MVusertools
// @version        1.9.2
// @description    Añade controles avanzados a los posts en MV
// @include        http://www.mediavida.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require        http://www.mvusertools.com/ext/libs/tinycon.min.js
// @require        http://www.mvusertools.com/ext/libs/jquery.a-tools-1.5.2.js
// @require        http://www.mvusertools.com/ext/libs/sisyphus.js
// @require        http://www.mvusertools.com/ext/libs/mousetrap.js
// @require        http://www.mvusertools.com/ext/libs/jquery.scrollto.js
// ==/UserScript==

window.opera.addEventListener("BeforeEvent.DOMContentLoaded", function() {
    var utversion = "1.9.2";
    var bbcode = new Array;
    var bbtags = new Array("[b]", "[/b]", "[i]", "[/i]", "[u]", "[/u]", "[url]", "[/url]", "[url=]", "[/url]", "[img]", "[/img]", "[video]", "[/video]", "[spoiler]", "[/spoiler]", "[spoiler=]", "[/spoiler]", "[spoiler=NSFW]", "[/spoiler]", "[code]", "[/code]", "[center]", "[/center]", "[s]", "[/s]", "[bar]", "[/bar]", "[list]", "[/list]", "[audio]", "[/audio]");
    var theSelection = false;
    var clientPC = window.navigator.userAgent.toLowerCase();
    var clientVer = window.parseInt(window.navigator.appVersion);
    var is_ie = clientPC.indexOf("msie") != -1 && clientPC.indexOf("opera") == -1;
    var is_win = clientPC.indexOf("win") != -1 || clientPC.indexOf("16bit") != -1;
    var baseHeight;
    var is_dark = window.jQuery("link[rel='stylesheet']").filter(function() {
        return this.href.match("/style/[0-9]+/mv_oscuro.css");
    }).length > 0;
    var postitlive = window.jQuery("div#pi_body div.embedded object").length > 0;
    var liveactivado = window.jQuery("div.live_info").length > 0;
    var utnoti = window.jQuery('#userinfo a[href^="/foro/favoritos"] strong.bubble').html();
    var utavisos = window.jQuery('#userinfo a[href^="/notificaciones"] strong.bubble').html();
    var utmsj = window.jQuery('#userinfo a[href^="/mensajes"] strong.bubble').html();
    var utusername = window.jQuery(".lu").html();
    function initInsertions() {
        var b;
        if (document.forms[window.form_name]) {
            b = document;
        } else {
            b = window.opener.document;
        }
        var a = b.forms[window.form_name].elements[window.text_name];
        if (is_ie && typeof baseHeight != "number") {
            a.focus();
            baseHeight = b.selection.createRange().duplicate().boundingHeight;
            if (!document.forms[window.form_name]) {
                document.body.focus();
            }
        }
    }
    function bbstyle2(a) {
        if (a >= 0 && a <= 30) {
            bbfontstyle(bbtags[a], bbtags[a + 1]);
        } else window.console.log("fuera de rango");
    }
    function bbfontstyle(b, f) {
        theSelection = false;
        var d = document.forms[window.form_name].elements[window.text_name];
        d.focus();
        if (clientVer >= 4 && is_ie && is_win) {
            theSelection = document.selection.createRange().text;
            if (theSelection) {
                document.selection.createRange().text = b + theSelection + f;
                document.forms[window.form_name].elements[window.text_name].focus();
                theSelection = "";
                return;
            }
        } else {
            if (document.forms[window.form_name].elements[window.text_name].selectionEnd && document.forms[window.form_name].elements[window.text_name].selectionEnd - document.forms[window.form_name].elements[window.text_name].selectionStart > 0) {
                mozWrap(document.forms[window.form_name].elements[window.text_name], b, f);
                document.forms[window.form_name].elements[window.text_name].focus();
                theSelection = "";
                return;
            }
        }
        var a = getCaretPosition(d).start;
        var c = a + b.length;
        insert_text(b + f);
        if (!window.isNaN(d.selectionStart)) {
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
            b = document.forms[window.form_name].elements[window.text_name];
        } else {
            b = window.opener.document.forms[window.form_name].elements[window.text_name];
        }
        if (d) {
            g = " " + g + " ";
        }
        if (!window.isNaN(b.selectionStart)) {
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
        var i = g.value.substring(0, a);
        var h = g.value.substring(a, e);
        var f = g.value.substring(e, c);
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
        var c = new caretPosition;
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
    var blacklistBarra = "<div class='nopost barra'> 	Usuario <span class='mensaje-ocultado'>Blacklisted</span> </div> ";
    var balcklistToggle = "<div id='toggle' class='sprite'><div> ";
    var blacklistInfo = "<span class='blacklisted-post'" + (is_dark ? " style='color: #626262 !important;'" : "") + ">Click en <img src='http://www.mvusertools.com/ext/img/blacklist-mini.png'> para desbloquear.</span>";
    var blacklistAvatar = "~";
    {
        var css = ".sprite {		background: url(http://www.mvusertools.com/ext/img/sprites18-3.png) no-repeat;	}	.usertools TABLE TD	{			padding: 3px;	}	.usertools A	{	}	.ut-firma	{			background-position: 0 -58px;			text-indent: -9999px;			width: 14px;			height: 11px;			display: block;			outline: 0;			margin-top: 1px;	}	.ut-firma:hover	{			background-position: 0 -69px;	}	.mensaje	{			background-position: -20px -58px;			text-indent: -9999px;			width: 14px;			height: 10px;			outline: 0;			display: block;			margin-top: 1px;	}	.mensaje:hover	{			background-position: -20px -68px;	}	.blacklist-off	{			background-position: -39px -57px;			text-indent: -9999px;			width: 12px;			height: 12px;			outline: 0;			display: block;			margin-top: 1px;	}	.blacklist-off:hover	{			background-position: -39px -69px;	}	.blacklist-on	{			background-position: -39px -69px;			text-indent: -9999px;			width: 12px;			height: 12px;			outline: 0;			display: block;			margin-top: 1px;	}	.blacklist-on:hover	{			background-position: -39px -57px;	}	.blacklist	{	}	.ut-online	{			background-position: -56px -72px;			text-indent: -99999px;			width: 8px;			height: 12px;			display: block;			outline: 0;	}		.ut-offline	{			background-position: -56px -58px;			text-indent: -99999px;			width: 8px;			height: 12px;			display: block;			outline: 0;	}	.online-pos	{			float: left;			width: 14px;			z-index: 999;	}	.mensaje-pos	{			float: left;			width: 19px;	}	.blacklist-pos	{			float: right;			margin-top: -1px;			width: 15px;	}	.firma-pos	{			float: left;			width: 19px;	}	.mensaje-ocultado	{			font-weight: bold;	}	.toggle-on	{			background-position: -37px -21px;			width: 34px;			height: 34px;			cursor: pointer;	}	.toggle-off	{			background-position: 0 -21px;			width: 34px;			height: 34px;			cursor: pointer;	}	.tapavatares	{			width: 0px; 			height: 0px; 			position:relative;	}	.tapavatares span {			position: abosolute; 			background: url(http://www.mvusertools.com/ext/img/blacklisted.png) no-repeat;			background-position: 0 4px;			width: 80px; 			height: 84px; 			top: 6px; 			left: 0px;			display: block;	}	.blacklisted-post	{			border-radius: 7px;			ms-border-radius: 7px;			-moz-border-radius: 7px;			-webkit-border-radius: 7px;			-khtml-border-radius: 7px;			padding: 3px 10px 2px 10px;			background: #ccc;			color: #626262 !important;	}	.usertools	{			position: relative;			width: 67px;			margin-top: 2px;	}	button::-moz-focus-inner {	border: 0;	padding: 0;	margin:0;	}	.mbuttons button[type], button.alt[type] {		padding:2px 4px !important;			}	.mbuttons a:hover,button.alt:hover {	background-color:#aaaaaa;	border:1px solid #c2e1ef;	color:#ffffff;	}	button.alt {		border-color: #aaa !important;		min-width: 20px;		border-radius: 5px !important;	}	button.bleft {		border-radius: 5px 0px 0px 5px !important;		margin-right: 0px !important;		border-right-width: 0px !important;		font-weight: normal !important;	}	button.bcenter {		margin-right: 0px !important;		border-left-width: 1px !important;		border-left-color: #aaa !important;		font-weight: normal !important;		border-radius: 0px !important;	}	button.bcenter2 {		margin-right: 0px !important;		border-left-width: 0px !important;		border-left-color: #aaa !important;		font-weight: normal !important;		border-radius: 0px !important;	}	button.bright {		border-radius: 0px 5px 5px 0px !important;		margin-left: 0px !important;		border-left-width: 0px !important;		font-weight: normal !important;	}	button.bright2 {		border-radius: 0px 5px 5px 0px !important;		font-weight: normal !important;	}	button.bsolo {		border-radius: 5px !important;		font-weight: normal !important;	}	button.bb {		font-weight: bold !important;	}	button.bi {		font-style: italic !important;	}	button.bu {		text-decoration: underline !important;	}	button.bs {		text-decoration: line-through !important;	}	.baudio {		background-position: -0px 3px;		width: 11px; 		height: 17px; 		display: block; 	}	.bimg {		background-position: -25px 3px;		width: 12px; 		height: 17px; 		display: block; 		margin-left: 1px; 	}	.bvideo {		background-position: -12px 3px;		width: 12px; 		height: 17px; 		display: block; 	}	.bcentericon {		background-position: -37px 3px;		width: 14px; 		height: 17px; 		display: block; 	}	.blist {		background-position: -51px 3px;		width: 14px; 		height: 17px; 		display: block; 	}	.ut-live td {		background-color: #FFEEEE;	}	.ut-live td.alt {		background-color: #EFE0E0;	}	#modlist {		margin: 20px 0 0;		padding: 10px 10px;		border-radius: 6px 6px 6px 6px;	}	.modlistblanco {		border: 1px solid #D4D4D2;	}	.modlistnegro {		border: 1px solid #273037;		background-color: #39444B;	}	#modlist H3{		margin-top: 0px !important;	}	#modlist A{		padding: 3px 0 3px 3px;		display: block;	}	.modlistblanco A:nth-child(odd){		background: #E8EBE3;	}	.modlistblanco A:hover{		background: #D6D8D2;	}	.modlistblanco span{		color: #555555;	}	.modlistnegro A:nth-child(odd){		background: #435058;	}	.modlistnegro A:hover{		background: #273037;	}	.modlistnegro span{		color: #C5D1EC;	}	.config {	background-position: -78px -29px;	width: 14px;	height: 14px;	display: inline-block;	margin: 0 3px;	position: relative;	}	.utmenubutton{	padding-left: 15px;	}	#ut-mask {	background: #ffffff; width: 100%; height: 100%; position: fixed; opacity: 0.9; z-index: 9998;	}	#ut-mask-menu {	background: #000000; width: 100%; height: 100%; position: fixed; opacity: 0.9; z-index: 9998;	}	#ut-dialog {	width: 500px; top: 10px; left: 50%; margin-left: -250px; position: absolute; z-index: 9999;	}	#ut-dialog-menu {	width: 500px; top: 50px; left: 50%; margin-left: -250px; position: absolute; z-index: 9999;	}	.ut-boton-sino{	cursor: pointer;	color: #EF5000;	}	#ut-window {	background: #ffffff; border-radius: 6px; padding: 10px 10px 30px 10px; border: 1px solid #cccccc;	}	#ut-menu-contenido {	background: #fff;	min-height: 270px;	}	#ut-menu-contenido TABLE{	border-top: 1px solid #ccc;	}	.newquote a.toggled, .newquoteblack a.toggled{	border-style: solid !important;	border-width: 1px !important;	margin: 0 !important;	padding: 0 3px !important;	}	.newquote a.toggled {	border-color: #CCCCCC #CCCCCC #CCCCCC !important;	}	.newquoteblack a.toggled{	border-color: #CCCCCC #CCCCCC #CCCCCC !important;	}	.newquote div.quote, .newquoteblack div.quote{	border: 1px solid #CCCCCC !important;	margin: 0 0 8px !important;	border-radius: 0 6px 6px 6px !important;	}	.tinycol.bigscreen{	margin-top: 800px;	}	.postit.bigscreen{	width: 958px;	padding-left: 0px;	}	#pi_body.bigscreen{	width: 938px;	}	.embedded.bigscreen{	;	}	#bigscreen-mode{	background-position: -99px -28px;	width: 41px;	height: 23px;	float: right;	margin: 5px 0 5px 10px;	cursor: pointer;	}	#bigscreen-mode:hover{	background-position: -142px -28px;	}	#bigscreen-mode-off{	background-position: -99px 0;	width: 41px;	height: 23px;	float: right;	margin: 5px 0px 5px 10px;	cursor: pointer;	}	#bigscreen-mode-off:hover{	background-position: -141px 0;	}	.post .spoiler-content {		background-color: #F0F2ED;		padding: 5px;		border-bottom: 1px solid #d7d9d4;	}	.post.odd .spoiler-content {		background-color: #E7E9E4;	}	.post .spoiler-content-black {		background-color: #435058;		padding: 5px;		border-bottom: 1px solid #252C31;	}	.post.odd .spoiler-content-black {		background-color: #39444B;	}	#ut-menu-tabs div{		margin: 0 10px 0 0;		padding: 3px 4px;		background: #eee;		display: inline-block;		cursor: pointer;		border-top: 1px solid #CCCCCC;		border-right: 1px solid #CCCCCC;		border-left: 1px solid #CCCCCC;		color: #999;		font-size: 13px;	}	#ut-menu-tabs div.active{		background: #444;		color: #eee;		border-top: 1px solid #CCCCCC;		border-right: 1px solid #CCCCCC;		border-left: 1px solid #CCCCCC;	}	#ut-menu-tabs div.active:hover{		background: #444;		color: #eee;		border-top: 1px solid #CCCCCC;		border-right: 1px solid #CCCCCC;		border-left: 1px solid #CCCCCC;	}	#ut-menu-tabs div:hover{		background: #ddd;		color: #222;	}	#ut-menu-contenido .ut-opciones td:nth-child(2n+1){		width: 420px;	}	.ut-arrow-up{		background-position: -75px -53px;		width: 12px;		height: 17px;		display: block; 	}	.ut-arrow-down{		background-position: -75px -70px;		width: 12px;		height: 17px;		display: block; 	}	#ut-boton-plus{	background-color: #888888 !important;	}	#ut-boton-plus:hover {	background-color: #777777 !important;	}	.ut-titleymacro{	padding: 0 0 2px 3px;	border-left: 2px solid #FF5500;	margin: 10px 0;	}	.ut-titletxt{	font-weight: bold;	cursor: default;	}	.ut-macrotxt {	color: #222222;	text-overflow: ellipsis;	-o-text-overflow: ellipsis;    text-overflow: ellipsis;    overflow:hidden;    white-space:nowrap;    width: 460px;	}	.ut-macrotxt:hover {    white-space:pre-wrap;	}	.icon-down-list{		background-position: -97px -59px;		width: 12px;		height: 9px;		display: inline-block;		vertical-align: middle;	}	.UT-trash{		background-position: -97px -72px;		width: 11px;		height: 14px;		display: inline-block;		vertical-align: middle;	}	.UT-trash-orange{		background-position: -114px -72px; 		width: 11px;		height: 14px;		display: inline-block;		}	#ut-button-macros-list{	position: absolute;	top: 132px;	left: 154px;	width: 125px;	border-radius: 0px 0px 5px 5px;	background-color: #565656;	border: 1px solid #AAAAAA;	color: #eee;	}	#ut-button-macros-list li{	display: block;	cursor: pointer;	border-bottom: 1px solid #888888;	padding: 1px 1px 1px 3px;	}	#ut-button-macros-list li:hover{	background-color: #aaaaaa;	}	.ut-button-macros-list-barrendera{	top: 68px !important;	left: 290px !important;	}	#ut-button-macros-list-anadir {	padding: 1px 1px 2px 3px;	cursor: pointer;	display: block;	color: #ccc;	background-color: #333;	border-radius: 0 0 5px 5px;	}	#ut-button-macros-list-anadir:hover {	color: #fff;	background-color: #ff7700;	}	#ut-macro {	overflow: auto;	width: 98%;	margin-top: 5px;	}	#ut-foros-fav LI{	margin: 0 0 5px;	transition: all 0.5s;	-moz-transition: all 0.5s;	-ms-transition: all 0.5s;	-webkit-transition: all 0.5s;	-o-transition: all 0.5s;	}	#ut-foros-fav LI:hover{	}	#ut-foros-fav LI A{	background: #ccc;	border-radius: 3px 3px 3px 3px;	border: 1px solid #EEEEEE;	vertical-align: middle;	padding: 3px 4px;	display: inline-block;	transition: all 0.5s;	-moz-transition: all 0.5s;	-ms-transition: all 0.5s;	-webkit-transition: all 0.5s;	-o-transition: all 0.5s;	}	#ut-foros-fav LI A:hover{	background: #999;	}	#foros-fav-float{	position: absolute;	top: 200px;	margin-left: 1005px;	opacity: 0.2;	margin-top: 10px;	transition: opacity 0.5s;	-moz-transition: opacity 0.5s;	-ms-transition: opacity 0.5s;	-webkit-transition: opacity 0.5s;	-o-transition: opacity 0.5s;	}	#foros-fav-float:hover {	opacity: 1;	}	.foros-fav-float-sticky{	top: 0px !important;	position: fixed !important;	}	.ut-foros-fav-borrar{	display: inline-block;	margin: 0 0 0 10px;	vertical-align: middle;	opacity: 0.04;	transition: all 0.5s;	-moz-transition: all 0.5s;	-ms-transition: all 0.5s;	-webkit-transition: all 0.5s;	-o-transition: all 0.5s;	cursor: pointer;	}	.ut-foros-fav-borrar:hover{	opacity: 1;	}	.ut-foros-fav-borrar:hover{	opacity: 1;	}	.ut-foro-fav-add {	background: url('http://www.mvusertools.com/ext/img/star.png') no-repeat scroll center -30px #FF9300;	height: 38px;	margin: 40px 0 0 -8px;	width: 40px;	transition: margin 0.5s;	-moz-transition: margin 0.5s;	-ms-transition: margin 0.5s;	-webkit-transition: margin 0.5s;	-o-transition: margin 0.5s;	cursor: pointer;	}	.ut-foro-fav-added {	background: url('http://www.mvusertools.com/ext/img/star.png') no-repeat scroll center 8px #FF9300;	}	.ut-foro-fav-add-moveup{	margin: 3px 0 0 -8px;	}	.ut-filtrar {	cursor: pointer;	}	.ut-opacity {	opacity: 0.2;	}	#ut-filtros-fav{	}	#utFavQuitar{	cursor: pointer;	margin: 5px 0 20px 0;	width: 80px;	opacity: 0.7;	}	#utFavAviso{	cursor: pointer;	margin: 5px 0 20px 0;	font-size: 9px;	opacity: 0.5;	}	#utFavAviso:hover{	opacity: 1;	}	#utFavAvisoTxt{	border: 1px solid #ccc;	border-radius: 6px;	padding: 5px;	margin: -15px 0 20px 0;	display: none;	font-size: 9px;	}	#ut-filtros-fav .foroicon{	display: inline-block;	padding: 0 4px 4px;	}	#ut-filtros-tags .cat2{	display: inline-block;	margin: 0 15px 5px 5px;	}	#ut-fav-filto-titulo{	font-size: 14px;	margin: 0 0 9px;	font-family: Trebuchet MS,Arial,Verdana,sans-serif;	font-weight: bold;	}	.ut-linksfooter{	margin-top: 15px;	}	.ut-linksfooter-blanco{	border: 1px solid #C7C9C3 !important;	border-top:1px solid #C7C9C3 !important;	border-bottom:1px solid #BABCB6 !important;	background: linear-gradient(to top, #E8EBE3, #D6D8D2) !important;	background: -webkit-gradient(linear, left top, left bottom, from(#D6D8D2), to(#E8EBE3)) !important;	}	.ut-linksfooter-blanco A{	color: #777 !important;	}	.ut-linksfooter-blanco A:hover{	color: #444 !important;	}	.ut-linksfooter-blanco a.lu, .ut-linksfooter-blanco a.ln, .ut-linksfooter-blanco a.lf, .ut-linksfooter-blanco a.lm, .ut-linksfooter-blanco li.logout{	background-image: url('http://mvusertools.com/ext/img/ut_topbar_icons.gif') !important;	}	.ut-linksfooter-blanco strong.bubble {	background-image: url('http://mvusertools.com/ext/img/bubble.png') !important;	text-shadow: 0 0 3px #000000 !important;	}	";
    }
    if (typeof window.GM_addStyle != "undefined") {
        window.GM_addStyle(css);
    } else if (typeof window.PRO_addStyle != "undefined") {
        window.PRO_addStyle(css);
    } else if (typeof window.addStyle != "undefined") {
        window.addStyle(css);
    } else {
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(css));
            heads[0].appendChild(node);
        }
    }
    var bottominfo = '<p style="margin-top: 20px; font-size: 9px; color: #888888;">Si ves algún fallo prueba siempre a hacer ctrl+f5. Si así no se ha solucionado comunícanoslo con un post en <a href="http://www.mediavida.com/foro/4/mv-usertools-extension-para-firefox-chrome-safari-413818">el hilo oficial</a> indicando navegador y su versión, sistema operativo y, si es posible, una screen del error.<br /><br />Instrucciones y más información en <a href="http://mvusertools.com" target="_blank">la web oficial de la extensión</a>.</p>';
    var utlinksfooter = window.localStorage["utlinksfooter"];
    var utlinksfooteroscuro = window.localStorage["utlinksfooteroscuro"];
    var uttablamods = window.localStorage["uttablamods"];
    var utmarcapaginas = window.localStorage["utmarcapaginas"];
    var uticonosportada = window.localStorage["uticonosportada"];
    var uticonosdestacados = window.localStorage["uticonosdestacados"];
    var utlivesdestacados = window.localStorage["utlivesdestacados"];
    var utnewquote = window.localStorage["utnewquote"];
    var utuserinfo = window.localStorage["utuserinfo"];
    var utestilospoilers = window.localStorage["utestilospoilers"];
    var utbigscreen = window.localStorage["utbigscreen"];
    var utordenarposts = window.localStorage["utordenarposts"];
    var utfavicon = window.localStorage["utfavicon"];
    var utmensajeupdate = window.localStorage["utmensajeupdate"];
    var utsalvarposts = window.localStorage["utsalvarposts"];
    var utforosfavs = window.localStorage["utforosfavs"];
    var utfiltrarfavs = window.localStorage["utfiltrarfavs"];
    var utantiguoslinksuserinfo = window.localStorage["utantiguoslinksuserinfo"];
    var utCambiosNombre = window.localStorage["utCambiosNombre"];
    var utcerrarspoilers = window.localStorage["utcerrarspoilers"];
    window.jQuery('<div id="ut-config" class="last" style="margin-left: 10px;"><ul class="bar" style="margin: 0px 0px 0px 10px; padding: 0px 12px;"><li><a id="ut-menu" class="sprite config uextra" style="cursor: pointer; margin: 0px 0px 0px -5px;"><span class="utmenubutton">Ut</span></a></li></ul></div>').insertAfter("#userinfo");
    window.jQuery('<div style="display: none;" id="ut-mask-menu"></div>').insertBefore("#background");
    var utmenutabs = '<div id="ut-menu-tabs"><div id="ut-menu-tab1" class="active">Modulos</div><div id="ut-menu-tab2">Estilos</div><div id="ut-menu-tab4">Macros</div><div id="ut-menu-tab3">Sobre MV-UT</div></div>';
    var utmenutabla1 = '<table id="ut-menu-tabla1" class="ut-opciones"><tbody><tr><td>Ventana con aviso y notas de actualización al actualizar.</td><td><span class="ut-boton-sino" id="ut-utmensajeupdate-si">Si</span> <span class="ut-boton-sino" id="ut-utmensajeupdate-no">No</span></td></tr><tr><td>Tener siempre a la vista foros favoritos.</td><td><span class="ut-boton-sino" id="ut-utforosfavs-si">Si</span> <span class="ut-boton-sino" id="ut-utforosfavs-no">No</span></td></tr><tr><td>Activar filtro para hilos en favoritos.</td><td><span class="ut-boton-sino" id="ut-utfiltrarfavs-si">Si</span> <span class="ut-boton-sino" id="ut-utfiltrarfavs-no">No</span></td></tr><td>Links importantes al final de la página</td><td><span class="ut-boton-sino" id="ut-linksfooter-si">Si</span> <span class="ut-boton-sino" id="ut-linksfooter-no">No</span></td></tr><tr style="background: none;"><td><p id="ut-utlinksfooteroscuro" style="color: #999999;">Links importantes estilo oscuro usando theme predeterminado</p></td><td><span class="ut-boton-sino" id="ut-utlinksfooteroscuro-si">Si</span> <span class="ut-boton-sino" id="ut-utlinksfooteroscuro-no">No</span></td></tr><tr><td>Tabla de mods</td><td><span class="ut-boton-sino" id="ut-uttablamods-si">Si</span> <span class="ut-boton-sino" id="ut-uttablamods-no">No</span></td></tr><tr><td>Información del usuario al dejar el ratón sobre su nick</td><td><span class="ut-boton-sino" id="ut-utuserinfo-si">Si</span> <span class="ut-boton-sino" id="ut-utuserinfo-no">No</span></td></tr><tr><td>Opción para ordenar hilos por respuestas sin leer</td><td><span class="ut-boton-sino" id="ut-utordenarposts-si">Si</span> <span class="ut-boton-sino" id="ut-utordenarposts-no">No</span></td></tr><tr><td>Avisos en el favicon</td><td><span class="ut-boton-sino" id="ut-utfavicon-si">Si</span> <span class="ut-boton-sino" id="ut-utfavicon-no">No</span></td></tr><tr><td>Botón para ensanchar streams en hilos con Live! y postit (Experimental)</td><td><span class="ut-boton-sino" id="ut-utbigscreen-si">Si</span> <span class="ut-boton-sino" id="ut-utbigscreen-no">No</span></td></tr><tr><td>Recupera el texto escrito en el formulario extendido si se cierra la pestaña o navegador (Experimental)</td><td><span class="ut-boton-sino" id="ut-utsalvarposts-si">Si</span> <span class="ut-boton-sino" id="ut-utsalvarposts-no">No</span></td></tr></tbody></table>';
    var utmenutabla2 = '<table id="ut-menu-tabla2" class="ut-opciones" style="display: none;"><tbody><tr><td>Marcapáginas</td><td><span class="ut-boton-sino" id="ut-utmarcapaginas-si">Si</span> <span class="ut-boton-sino" id="ut-utmarcapaginas-no">No</span></td></tr><tr><td>Hilos con Live! activado destacados (solo para theme predeterminado)</td><td><span class="ut-boton-sino" id="ut-utlivesdestacados-si">Si</span> <span class="ut-boton-sino" id="ut-utlivesdestacados-no">No</span></td></tr><tr><td>Nuevo estilo para los spoilers</td><td><span class="ut-boton-sino" id="ut-utestilospoilers-si">Si</span> <span class="ut-boton-sino" id="ut-utestilospoilers-no">No</span></td></tr><tr><td>Quitar ventanas flotantes en Avisos, Favs y Msj dejandolo como antes</td><td><span class="ut-boton-sino" id="ut-utantiguoslinksuserinfo-si">Si</span> <span class="ut-boton-sino" id="ut-utantiguoslinksuserinfo-no">No</span></td></tr><tr><td>Cambiar algunos nombres de usuarios y foros</td><td><span class="ut-boton-sino" id="ut-utCambiosNombre-si">Si</span> <span class="ut-boton-sino" id="ut-utCambiosNombre-no">No</span></td></tr><tr><td>Añadir botón para cerrar spoilers al final del mismo</td><td><span class="ut-boton-sino" id="ut-utcerrarspoilers-si">Si</span> <span class="ut-boton-sino" id="ut-utcerrarspoilers-no">No</span></td></tr></tbody></table>';
    var utmenutabla3 = '<table id="ut-menu-tabla3" style="display: none;"><tbody><tr><td><a href="http://mvusertools.com" target="_blank"><img src="http://www.mediavida.com/img/f/mediavida/2012/11/55268_mv_usertools_extension_para_firefox_chrome_opera_safari_0_full.png" width="48" height="48"><p>MV-Usertools</a> desarrollado por <a href="/id/Vegon">Vegon</a> y <a href="/id/cm07">cm07</a></p><br /><br /><p><a style="cursor: pointer;" id="ut-menu-notasdeparche">Notas del último parche.</a> Versión ' + utversion + '.</p><br /><p>Atajos de teclado:<ul><li>- Ir a Favoritos: ctrl+alt+f</li><li>- Ir a Perfil: ctrl+alt+p</li><li>- Ir a Avisos: ctrl+alt+a</li><li>- Ir a Mensajes: ctrl+alt+z</li><li>- Ir a Foros: ctrl+alt+o</li><li>- Ir a Spy: ctrl+alt+y</li><li>- Abrir/Cerrar todos los spoilers: ctrl+alt+s</li><li>- Ir a la anterior página del hilo: ctrl+alt+m</li><li>- Ir a la siguiente página del hilo: ctrl+alt+k</li></ul></p><br /><br /><p>Para comunicar bugs usa el <a href="http://www.mediavida.com/foro/4/mv-usertools-extension-para-firefox-chrome-opera-safari-413818">hilo oficial</a>. Si tienes dudas de como funciona algun modulo u opción visita el <a href="http://mvusertools.com/caracteristicas">manual en la web oficial</a> que siempre está actualizado con las ultimas novedades.</p><br /><br /><p>Si las MV-Usertools te resultan utiles y quieres agradecernos las horas de trabajo detrás de ellas, tiranos algunas monedas.</p><br /><form action="https://www.paypal.com/cgi-bin/webscr" method="post"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="2TD967SQAC6HC"><input type="image" src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal. La forma rápida y segura de pagar en Internet."><img alt="" border="0" src="https://www.paypalobjects.com/es_ES/i/scr/pixel.gif" width="1" height="1"></form></td></tr></tbody></table>';
    var utmenutabla4 = '<table id="ut-menu-tabla4" style="display: none;"><tbody><tr><td><form id="ut-macros-form"><input id="ut-title" placeholder="Título" maxlength="17"><br /><textarea id="ut-macro" placeholder="Macro"></textarea><br /><input type="submit" value="Guardar" style="margin-top: 3px;" ></form><ul id="ut-macros"></ul></td></tr></tbody></table>';
    window.jQuery('<div style="display: none;" id="ut-dialog-menu"><div id="ut-window"><div id="ut-menu-contenido">' + utmenutabs + "" + utmenutabla1 + "" + utmenutabla2 + "" + utmenutabla4 + "" + utmenutabla3 + "</div>" + bottominfo + '<a style="float: right; margin-top: 10px; cursor: pointer;" id="ut-menu-cerrar">Cerrar</a></div></div>').insertBefore("#content_head");
    window.jQuery("#ut-menu-tabla1 tr:odd, #ut-menu-tabla2 tr:odd, #ut-menu-tabla3 tr:odd").addClass("odd");
    window.jQuery("#ut-menu-tab1").click(function() {
        window.jQuery("#ut-menu-tab1").addClass("active");
        window.jQuery("#ut-menu-tab2").removeClass("active");
        window.jQuery("#ut-menu-tab3").removeClass("active");
        window.jQuery("#ut-menu-tab4").removeClass("active");
        window.jQuery("#ut-menu-tabla1").show();
        window.jQuery("#ut-menu-tabla2").hide();
        window.jQuery("#ut-menu-tabla3").hide();
        window.jQuery("#ut-menu-tabla4").hide();
    });
    window.jQuery("#ut-menu-tab2").click(function() {
        window.jQuery("#ut-menu-tab1").removeClass("active");
        window.jQuery("#ut-menu-tab2").addClass("active");
        window.jQuery("#ut-menu-tab3").removeClass("active");
        window.jQuery("#ut-menu-tab4").removeClass("active");
        window.jQuery("#ut-menu-tabla1").hide();
        window.jQuery("#ut-menu-tabla2").show();
        window.jQuery("#ut-menu-tabla3").hide();
        window.jQuery("#ut-menu-tabla4").hide();
    });
    window.jQuery("#ut-menu-tab3").click(function() {
        window.jQuery("#ut-menu-tab1").removeClass("active");
        window.jQuery("#ut-menu-tab2").removeClass("active");
        window.jQuery("#ut-menu-tab3").addClass("active");
        window.jQuery("#ut-menu-tab4").removeClass("active");
        window.jQuery("#ut-menu-tabla1").hide();
        window.jQuery("#ut-menu-tabla2").hide();
        window.jQuery("#ut-menu-tabla3").show();
        window.jQuery("#ut-menu-tabla4").hide();
    });
    window.jQuery("#ut-menu-tab4").click(function() {
        window.jQuery("#ut-menu-tab1").removeClass("active");
        window.jQuery("#ut-menu-tab2").removeClass("active");
        window.jQuery("#ut-menu-tab3").removeClass("active");
        window.jQuery("#ut-menu-tab4").addClass("active");
        window.jQuery("#ut-menu-tabla1").hide();
        window.jQuery("#ut-menu-tabla2").hide();
        window.jQuery("#ut-menu-tabla3").hide();
        window.jQuery("#ut-menu-tabla4").show();
    });
    window.jQuery("#ut-menu").click(function() {
        window.jQuery("#ut-mask-menu").show();
        window.jQuery("#ut-dialog-menu").show();
    });
    window.jQuery("#ut-menu-cerrar").click(function() {
        window.jQuery("#ut-dialog-menu").hide();
        window.jQuery("#ut-mask-menu").hide();
    });
    window.jQuery("#ut-mask-menu").click(function() {
        window.jQuery("#ut-dialog-menu").hide();
        window.jQuery("#ut-mask-menu").hide();
    });
    var nicklenght = window.jQuery('#userinfo a[href^="/id/"]').text().length;
    window.jQuery(function() {
        if (nicklenght > 10) {
            window.jQuery("#nav_bar #buscar").css("width", "130px");
            window.jQuery("#nav_bar #sbii").css("width", "93px");
            window.jQuery("#nav_bar .bbii").css("left", "103px");
        }
    });
    window.jQuery(function() {
        if (nicklenght == 7) {
            window.jQuery("#nav_bar #buscar").css("width", "170px");
            window.jQuery("#nav_bar #sbii").css("width", "133px");
            window.jQuery("#nav_bar .bbii").css("left", "143px");
        }
    });
    var utOpcionesSi = function(opcion) {
        window.jQuery("#ut-" + opcion + "-si").click(function() {
            window.localStorage["" + opcion + ""] = "si";
            window.jQuery("#ut-" + opcion + "-no").css("color", "#999999");
            window.jQuery("#ut-" + opcion + "-si").css("color", "#EF5000");
        });
        window.jQuery("#ut-" + opcion + "-no").click(function() {
            window.localStorage["" + opcion + ""] = "no";
            window.jQuery("#ut-" + opcion + "-si").css("color", "#999999");
            window.jQuery("#ut-" + opcion + "-no").css("color", "#EF5000");
        });
        if (window.localStorage[opcion] == "si" || window.localStorage[opcion] == undefined) {
            window.jQuery("#ut-" + opcion + "-no").css("color", "#999999");
        }
        if (window.localStorage[opcion] == "no") {
            window.jQuery("#ut-" + opcion + "-si").css("color", "#999999");
        }
    };
    var utOpcionesNo = function(opcion) {
        window.jQuery("#ut-" + opcion + "-si").click(function() {
            window.localStorage[opcion] = "si";
            window.jQuery("#ut-" + opcion + "-no").css("color", "#999999");
            window.jQuery("#ut-" + opcion + "-si").css("color", "#EF5000");
        });
        window.jQuery("#ut-" + opcion + "-no").click(function() {
            window.localStorage[opcion] = "no";
            window.jQuery("#ut-" + opcion + "-si").css("color", "#999999");
            window.jQuery("#ut-" + opcion + "-no").css("color", "#EF5000");
        });
        if (window.localStorage[opcion] == "si") {
            window.jQuery("#ut-" + opcion + "-no").css("color", "#999999");
        }
        if (window.localStorage[opcion] == "no" || window.localStorage[opcion] == undefined) {
            window.jQuery("#ut-" + opcion + "-si").css("color", "#999999");
        }
    };
    utOpcionesSi("utordenarposts");
    utOpcionesSi("utbigscreen");
    utOpcionesSi("utestilospoilers");
    utOpcionesSi("utuserinfo");
    utOpcionesSi("utnewquote");
    utOpcionesSi("utlivesdestacados");
    utOpcionesSi("uticonosdestacados");
    utOpcionesSi("uticonosportada");
    utOpcionesSi("utmarcapaginas");
    utOpcionesSi("uttablamods");
    utOpcionesSi("utfavicon");
    utOpcionesSi("utforosfavs");
    utOpcionesSi("utfiltrarfavs");
    utOpcionesSi("utCambiosNombre");
    utOpcionesNo("utsalvarposts");
    utOpcionesNo("utmensajeupdate");
    utOpcionesNo("utlinksfooteroscuro");
    utOpcionesNo("utantiguoslinksuserinfo");
    utOpcionesNo("utcerrarspoilers");
    window.jQuery("#ut-linksfooter-si").click(function() {
        window.localStorage["utlinksfooter"] = "si";
        window.jQuery("#ut-linksfooter-no").css("color", "#999999");
        window.jQuery("#ut-linksfooter-si").css("color", "#EF5000");
        window.jQuery("#ut-utlinksfooteroscuro").css("color", "#222222");
    });
    window.jQuery("#ut-linksfooter-no").click(function() {
        window.localStorage["utlinksfooter"] = "no";
        window.jQuery("#ut-linksfooter-si").css("color", "#999999");
        window.jQuery("#ut-linksfooter-no").css("color", "#EF5000");
        window.jQuery("#ut-utlinksfooteroscuro").css("color", "#999999");
    });
    if (utlinksfooter == "si" || utlinksfooter == undefined) {
        window.jQuery("#ut-linksfooter-no").css("color", "#999999");
        window.jQuery("#ut-utlinksfooteroscuro").css("color", "#222222");
    }
    if (utlinksfooter == "no") {
        window.jQuery("#ut-linksfooter-si").css("color", "#999999");
        window.jQuery("#ut-utlinksfooteroscuro").css("color", "#999999");
    }
    var utversionls = window.localStorage["utversionls"];
    var utpatchnotes = '<p style="font-size: 16px; font-weight: bold;">Actualización ' + utversion + '</p><br /><br />																- Actualización 100% centrada en corrección de errores.<br /><br />																- Filtros en favoritos y añadir foros favoritos vuelven a funcionar correctamente.<br /><br />																- La lista de mods vuelve a ser visible.<br /><br />																- Al cerrar un spoiler con el botón al final del mismo, el navegador te deja al comienzo del post del que proviene el spoiler.<br /><br />																- Atajos de teclado cambiados para mejor acceso. Los tenéis todos en la pestaña "Sobre MV-UT".<br /><br />																- Pequeñas mejoras y añadidos.<br /><br />																';
    window.jQuery('<div style="display: none" id="ut-mask"></div>').insertBefore("#background");
    window.jQuery('<div style="display: none" id="ut-dialog"><a href="http://mvusertools.com" target="_blank"><img style="margin: 0 150px;" src="http://www.mediavida.com/img/f/mediavida/2012/10/02632_mv_usertools_extension_para_firefox_chrome_safari_0_full.png"></a><div id="ut-window">' + utpatchnotes + "" + bottominfo + '<a style="float: right; margin-top: 10px; cursor: pointer;" id="ut-box-cerrar">Cerrar</a></div></div>').insertBefore("#content_head");
    window.jQuery(function() {
        if (utmensajeupdate == "si") {
            if (utversionls != utversion) {
                window.jQuery("div#ut-mask").show();
                window.jQuery("div#ut-dialog").show();
                window.localStorage["utversionls"] = utversion;
            }
        } else {
            window.localStorage["utversionls"] = utversion;
        }
        window.jQuery("#ut-menu-notasdeparche").click(function() {
            window.jQuery("#ut-dialog-menu").hide();
            window.jQuery("#ut-mask-menu").hide();
            window.jQuery("div#ut-mask").show();
            window.jQuery("div#ut-dialog").show();
        });
        window.jQuery("#ut-box-cerrar").click(function() {
            window.jQuery("div#ut-mask").hide();
            window.jQuery("div#ut-dialog").hide();
        });
        window.jQuery("#ut-mask").click(function() {
            window.jQuery("div#ut-mask").hide();
            window.jQuery("div#ut-dialog").hide();
        });
    });
    window.jQuery(function() {
        if (utcerrarspoilers == "si") {
            window.jQuery('div[id^="cuerpo_"] div[id^="sp_"]').append('<br /><br /><a class="ut-cerrarspoiler-boton" style="cursor: pointer;">Cerrar Spoiler</a>');
            window.jQuery(".ut-cerrarspoiler-boton").click(function() {
                var utSpoilerPostId = window.jQuery(this).closest("div.post").attr("id");
                var utSpoilerId = window.jQuery(this).closest('div[id^="sp_"]').attr("id");
                window.jQuery(this).closest('div[id^="sp_"]').siblings('a[rel="' + utSpoilerId + '"]').removeClass("less");
                window.jQuery(this).closest('div[id^="' + utSpoilerId + '"]').hide();
                window.jQuery("#" + utSpoilerPostId).ScrollTo({
                    duration: 0
                });
            });
        }
    });
    window.jQuery(function() {
        if (utantiguoslinksuserinfo == "si") {
            var utnotifylinkdesnudo = window.jQuery("#nav_bar a#notifylink").closest("li").clone();
            var utfavslinkdesnudo = window.jQuery("#nav_bar a#favslink").closest("li").clone();
            var utmplinkdesnudo = window.jQuery("#nav_bar a#mplink").closest("li").clone();
            window.jQuery("#nav_bar a#notifylink").closest("li").remove();
            window.jQuery("#nav_bar a#favslink").closest("li").remove();
            window.jQuery("#nav_bar a#mplink").closest("li").remove();
            var navbarAncla = window.jQuery('#nav_bar a[href^="/id/"]').closest("li");
            utnotifylinkdesnudo.add(utfavslinkdesnudo).add(utmplinkdesnudo).insertAfter(navbarAncla);
        }
    });
    window.jQuery(function() {
        if (utfiltrarfavs == "si" || utfiltrarfavs == undefined) {
            window.jQuery("#favoritos .tinycol").prepend('<div id="ut-filtros-fav">');
            window.jQuery('<h3 id="ut-fav-filto-titulo">').text("Filtros").insertBefore("#ut-filtros-fav");
            window.jQuery(document).on("mouseover", "body", function() {
                window.jQuery("#tfav a.foroicon").each(function() {
                    window.jQuery("#ut-filtros-fav").append(window.jQuery(this).clone());
                });
                var utforosUnicos = {};
                window.jQuery("#ut-filtros-fav a.foroicon").each(function() {
                    window.jQuery(this).attr("href", "#filtrados");
                    var interiorA = window.jQuery(this).html();
                    if (utforosUnicos[interiorA]) window.jQuery(this).remove(); else utforosUnicos[interiorA] = true;
                });
            });
            window.jQuery(document).on("click", "#ut-filtros-fav a.foroicon", function() {
                window.jQuery("#ut-filtros-fav a.foroicon").removeClass("ut-opacity");
                window.jQuery("#tfav tr").removeClass("utfiltrado");
                window.jQuery("#ut-filtros-tags").remove();
                window.jQuery("#tfav a.foroicon").closest("tr").attr("style", "display: table-row;");
                var foroImgSrc = window.jQuery(this).children("i").attr("class").match(/fid_(.*)/)[1];
                window.jQuery("#tfav a.foroicon i").not(".fid_" + foroImgSrc + "").closest("tr").addClass("utfiltrado").hide();
                window.jQuery("#ut-filtros-fav a.foroicon").not(this).addClass("ut-opacity");
                window.jQuery('<div id="ut-filtros-tags">').insertAfter("#ut-filtros-fav");
                window.jQuery("#tfav tr").not("tr.utfiltrado").children("td.dash").children("a.cat2").each(function() {
                    window.jQuery("#ut-filtros-tags").append(window.jQuery(this).clone().removeAttr("title"));
                });
                window.jQuery("#ut-filtros-tags a.cat2 img").removeAttr("alt", "style");
                var utCatsUnicos = {};
                window.jQuery("#ut-filtros-tags a.cat2").each(function() {
                    window.jQuery(this).attr("href", "#filtrados");
                    var interiorB = window.jQuery(this).html();
                    if (utCatsUnicos[interiorB]) window.jQuery(this).remove(); else utCatsUnicos[interiorB] = true;
                });
            });
            window.jQuery(document).on("click", "#ut-filtros-tags a.cat2", function() {
                window.jQuery("#ut-filtros-tags a.cat2").removeClass("ut-opacity");
                window.jQuery("#tfav a.foroicon").closest("tr").not("tr.utfiltrado").attr("style", "display: table-row;");
                var catImgSrc = window.jQuery(this).children("img").attr("src");
                window.jQuery("#tfav a.cat2 img").not('img[src="' + catImgSrc + '"]').closest("tr").hide();
                window.jQuery("#ut-filtros-tags a.cat2").not(this).addClass("ut-opacity");
            });
            window.jQuery('<p id="utFavQuitar">').text("Quitar filtro.").insertAfter("#ut-filtros-fav");
            window.jQuery(document).on("click", "#utFavQuitar", function() {
                window.jQuery("#ut-filtros-fav a.foroicon").removeClass("ut-opacity");
                window.jQuery("#tfav tr").removeClass("utfiltrado");
                window.jQuery("#ut-filtros-tags").remove();
                window.jQuery("#tfav a.foroicon").closest("tr").attr("style", "display: table-row;");
            });
            var utVerMasFav = window.jQuery("#favoritos .tfooter #moar").text();
            if (utVerMasFav === "Ver más") {
                window.jQuery('<p id="utFavAviso">').text("Tienes más de 30 favoritos +").insertAfter("#utFavQuitar");
                window.jQuery('<div id="utFavAvisoTxt">').html('Para que el filtro funcione con todos tus hilos guardados en favoritos, debes darle al botón de "Ver más" al final de la lista de hilos. Si no se muestran el filtro no tendrá efecto en ellos.').insertAfter("#utFavAviso");
                window.jQuery("#utFavAviso").click(function() {
                    window.jQuery("#utFavAvisoTxt").slideToggle();
                    if (window.jQuery("#utFavAviso").text() === "Tienes más de 30 favoritos +") {
                        window.jQuery("#utFavAviso").text("Tienes más de 30 favoritos -");
                    } else {
                        window.jQuery("#utFavAviso").text("Tienes más de 30 favoritos +");
                    }
                });
            }
        }
    });
    window.jQuery(function() {
        var $utfiltrar = window.jQuery("#nofids").siblings("h3");
        var $utfiltrarP = window.jQuery("#nofids").closest(".box").siblings("p");
        var utfiltrarOpcion = window.localStorage["utfiltrarOpcion"];
        $utfiltrar.addClass("ut-filtrar");
        window.jQuery($utfiltrar).click(function() {
            window.jQuery("#nofids").slideToggle();
            $utfiltrarP.toggle();
            if (window.localStorage["utfiltrarOpcion"] == "si" || window.localStorage["utfiltrarOpcion"] == undefined) {
                window.localStorage["utfiltrarOpcion"] = "no";
            } else {
                window.localStorage["utfiltrarOpcion"] = "si";
            }
        });
        if (window.localStorage["utfiltrarOpcion"] == "no") {
            window.jQuery("#nofids").toggle();
            $utfiltrarP.toggle();
        }
    });
    window.jQuery(function() {
        if (utforosfavs == "si" || utforosfavs == undefined) {
            if (window.localStorage["ut-forosFav"] == undefined) {
                var forosFav = [];
                window.localStorage["ut-forosFav"] = window.JSON.stringify(forosFav);
            }
            window.jQuery('<div id="sticky-anchor" style="position: absolute; top: 200px;">').insertBefore("#content_body, #content_head");
            window.jQuery('<div id="foros-fav-float">').append('<div><ul id="ut-foros-fav">').insertAfter("#sticky-anchor");
            var forosFavUpdate = function() {
                var forosFav = window.JSON.parse(window.localStorage["ut-forosFav"]);
                var forosFavDibujo = function() {
                    for (window.i = 0; window.i < forosFav.length; window.i++) {
                        var foroNombre = window.jQuery('div.fpanel div.info a.hb[href="/foro/' + forosFav[window.i] + '"]').html();
                        window.jQuery("#ut-foros-fav").append(window.jQuery("<li>").html('<a href="/foro/' + forosFav[window.i] + '"><i class="ifid fid_' + forosFav[window.i] + '"></i></a><div class="ut-foros-fav-borrar"><i class="sprite UT-trash"></i></div>'));
                    }
                };
                forosFavDibujo();
            };
            forosFavUpdate();
            window.jQuery("div.fpanel div.icon").append('<div class="ut-foro-fav-add">');
            window.jQuery("div.fpanel div.icon").hover(function() {
                window.jQuery(this).children(".ut-foro-fav-add").addClass("ut-foro-fav-add-moveup");
            }, function() {
                window.jQuery(this).children(".ut-foro-fav-add").removeClass("ut-foro-fav-add-moveup");
            });
            window.jQuery(".ut-foro-fav-add").click(function() {
                var forosFav = window.JSON.parse(window.localStorage["ut-forosFav"]);
                window.jQuery(this).closest("div.icon").find("i.ifid").each(function() {
                    var foroNumber = window.jQuery(this).attr("class").match(/fid_(.*)/)[1];
                    if (window.jQuery.inArray(foroNumber, forosFav) > -1) {
                        forosFav.splice(window.jQuery.inArray(foroNumber, forosFav), 1);
                        window.localStorage["ut-forosFav"] = window.JSON.stringify(forosFav);
                        window.jQuery('#foros-fav-float a[href="/foro/' + foroNumber + '"]').closest("li").remove();
                    } else {
                        forosFav.push(foroNumber);
                        window.localStorage["ut-forosFav"] = window.JSON.stringify(forosFav);
                        window.jQuery("#ut-foros-fav").append(window.jQuery("<li>").html('<a href="/foro/' + foroNumber + '"><i class="ifid fid_' + foroNumber + '"></i></a><div class="ut-foros-fav-borrar"><i class="sprite UT-trash"></i></div>'));
                    }
                });
                window.jQuery(this).toggleClass("ut-foro-fav-added");
            });
            window.jQuery(document).on("click", ".ut-foros-fav-borrar", function() {
                var forosFav = window.JSON.parse(window.localStorage["ut-forosFav"]);
                window.jQuery(this).siblings('a[href^="/foro"]').each(function() {
                    var enlace = this + "";
                    var split = enlace.split("/");
                    var path = split.splice(1, split.length - 1);
                    var pathIndexToGet = 3;
                    var foroNumber = path[pathIndexToGet];
                    forosFav.splice(window.jQuery.inArray(foroNumber, forosFav), 1);
                    window.localStorage["ut-forosFav"] = window.JSON.stringify(forosFav);
                    window.jQuery(this).closest("li").remove();
                    window.jQuery("div.fpanel").find('a[href="/foro/' + foroNumber + '"]').closest("div.info").siblings("div.icon").children("div.ut-foro-fav-add").toggleClass("ut-foro-fav-added");
                });
            });
            window.jQuery("div.fpanel div.icon").each(function() {
                var forosFav = window.JSON.parse(window.localStorage["ut-forosFav"]);
                window.jQuery(this).siblings("div.info").find("a.hb,strong a").each(function() {
                    var enlace = this + "";
                    var split = enlace.split("/");
                    var path = split.splice(1, split.length - 1);
                    var pathIndexToGet = 3;
                    var foroNumber = path[pathIndexToGet];
                    if (window.jQuery.inArray(foroNumber, forosFav) > -1) {
                        window.jQuery(this).closest("div.info").siblings("div.icon").children("div.ut-foro-fav-add").toggleClass("ut-foro-fav-added");
                    }
                });
            });
            function sticky_relocate() {
                var window_top = window.jQuery(window).scrollTop();
                var div_top = window.jQuery("#sticky-anchor").offset().top;
                if (window_top > div_top) window.jQuery("#foros-fav-float").addClass("foros-fav-float-sticky"); else window.jQuery("#foros-fav-float").removeClass("foros-fav-float-sticky");
            }
            window.jQuery(window).scroll(sticky_relocate);
            sticky_relocate();
            if (window.jQuery.browser.safari) {
                window.jQuery("#foros-fav-float").css("margin-left", "1145px");
            } else if (window.jQuery.browser.opera) {
                window.jQuery("#foros-fav-float").css("margin-left", "1145px");
            }
        }
    });
    window.jQuery(document).ready(function() {
        window.JSON.encode = window.JSON.encode || window.JSON.stringify;
        window.JSON.decode = window.JSON.decode || window.JSON.parse;
        var storeJSON = function(key, object) {
            window.localStorage.setItem(key, window.JSON.encode(object));
        };
        var macros = window.JSON.decode(window.localStorage.getItem("macros")) || {};
        var updateMacros = function(store, $container) {
            var macros = {};
            $container.children().each(function() {
                var $macro = window.jQuery(this);
                var title = $macro.data("macro");
                if (!(title in store)) {
                    $macro.slideUp("slow", function() {
                        $macro.remove();
                    });
                } else {
                    macros[title] = $macro;
                }
            });
            var title;
            for (title in store) {
                if (!(title in macros)) {
                    var $spantitle = window.jQuery('<span class="ut-titletxt">').text(title);
                    var $spanmacro = window.jQuery('<div class="ut-macrotxt"' + (is_dark ? " style='color: #EEEEEE !important;'" : "") + ">").text(store[title]);
                    var $title = window.jQuery("<a>").html(' <a style="cursor:pointer;" title="Borrar macro" class="ut-remove-macro"><i class="sprite UT-trash-orange"></i></a>').prepend($spantitle).append($spanmacro);
                    var $item = window.jQuery('<li class="ut-titleymacro">').data("macro", title).append($title).hide();
                    $container.append($item);
                    $item.slideDown("slow");
                }
            }
        };
        var updateMacrosButton = function(store, $container2) {
            var macros = {};
            $container2.children().each(function() {
                var $macro = window.jQuery(this);
                var title = $macro.data("macro");
                if (!(title in store)) {
                    $macro.slideUp("slow", function() {
                        $macro.remove();
                    });
                } else {
                    macros[title] = $macro;
                }
            });
            var title;
            for (title in store) {
                if (!(title in macros)) {
                    var $spantitle = window.jQuery('<span class="ut-titletxt-list">').text(title);
                    var $title = window.jQuery("<div>").html(" ").prepend($spantitle);
                    var $item = window.jQuery('<li class="ut-titleymacro-list">').data("macro", title).append($title).hide();
                    $container2.append($item);
                    $item.slideDown("slow");
                }
            }
        };
        window.jQuery(function() {
            var $macros = window.jQuery("#ut-macros");
            var $macrosbutton = window.jQuery("#ut-button-macros-list ul");
            updateMacros(macros, $macros);
            updateMacrosButton(macros, $macrosbutton);
            window.jQuery("#ut-macros-form").submit(function() {
                var $title = window.jQuery("#ut-title");
                var $macro = window.jQuery("#ut-macro");
                var title = $title.val();
                var macro = $macro.val();
                if (title !== "" && macro !== "") {
                    macros[title] = macro;
                    storeJSON("macros", macros);
                    $title.val("");
                    $macro.val("");
                    updateMacros(macros, $macros);
                    updateMacrosButton(macros, $macrosbutton);
                }
                return false;
            });
            $macros.on("click", "a.ut-remove-macro", function() {
                delete macros[window.jQuery(this).parent().parent().data("macro")];
                storeJSON("macros", macros);
                updateMacros(macros, $macros);
                updateMacros(macros, $macrosbutton);
                return false;
            });
            $macrosbutton.on("click", "li", function() {
                window.jQuery("textarea#cuerpo").insertAtCaretPos(macros[window.jQuery(this).data("macro")]);
                window.jQuery("#ut-button-macros-list").hide();
                return false;
            });
        });
    });
    window.jQuery(function() {
        if (window.jQuery("#goext").length > 0 || liveactivado == true) {
            window.jQuery("#ut-button-macros-list").addClass("ut-button-macros-list-barrendera");
        }
    });
    window.jQuery(function() {
        if (utfavicon == "si" || utfavicon == undefined) {
            if (utnoti === undefined) {
                var utnoti_int = window.parseInt(0, 10);
            } else {
                var utnoti_int = window.parseInt(window.jQuery('#userinfo a[href^="/foro/favoritos"] strong.bubble').html(), 10);
            }
            if (utavisos === undefined) {
                var utavisos_int = window.parseInt(0, 10);
            } else {
                var utavisos_int = window.parseInt(window.jQuery('#userinfo a[href^="/notificaciones"] strong.bubble').html(), 10);
            }
            if (utmsj === undefined) {
                var utmsj_int = window.parseInt(0, 10);
            } else {
                var utmsj_int = window.parseInt(window.jQuery('#userinfo a[href^="/mensajes"] strong.bubble').html(), 10);
            }
            var utavisostotal = utnoti_int + utmsj_int + utavisos_int;
            window.jQuery("body").addClass("" + utavisostotal + "");
            window.Tinycon.setBubble(utavisostotal);
            window.Tinycon.setOptions({
                fallback: true
            });
        }
    });
    window.jQuery(function() {
        if (utordenarposts == "si" || utordenarposts == undefined) {
            var $table = window.jQuery("div#main table.full");
            window.jQuery('<span style="font-size: 10px; margin-left: 20px;">Ordenar por: <span style="cursor: pointer; color: #EF5000;" id="ut-fav-fecha">Fecha</span> | <span style="cursor: pointer; color: #999999;" id="ut-fav-posts">Respuestas sin leer</span></span>').insertAfter("body#favoritos table#tfav th span.left");
            window.jQuery('<span style="font-size: 10px; margin-left: -110px;">Ordenar por: <span style="cursor: pointer; color: #EF5000;" id="ut-fav-fecha">Fecha</span> | <span style="cursor: pointer; color: #999999;" id="ut-fav-posts">Respuestas sin leer</span></span>').insertAfter("body#foros table.full th span.left");
            var originalRows = $table.find("tr").slice(1).get(), rows = originalRows.slice(0);
            window.jQuery("#ut-fav-posts").click(function() {
                rows.sort(function(a, b) {
                    var keyA = +window.$(a).find("a.unreadcount").text();
                    var keyB = +window.$(b).find("a.unreadcount").text();
                    if (keyA < keyB) return 1;
                    if (keyA > keyB) return -1;
                    return 0;
                });
                window.jQuery.each(rows, function(index, row) {
                    $table.children("tbody").append(row);
                });
                window.jQuery("#ut-fav-posts").css("color", "#EF5000");
                window.jQuery("#ut-fav-fecha").css("color", "#999999");
            });
            window.jQuery("#ut-fav-fecha").click(function() {
                window.jQuery.each(originalRows, function(index, row) {
                    $table.children("tbody").append(row);
                });
                window.jQuery("#ut-fav-posts").css("color", "#999999");
                window.jQuery("#ut-fav-fecha").css("color", "#EF5000");
            });
        }
    });
    window.jQuery(function() {
        if (utestilospoilers == "si" || utestilospoilers == undefined) {
            window.jQuery(function() {
                if (is_dark == 0) {
                    window.jQuery(".spoiler").each(function() {
                        window.spoiler_id = window.jQuery(this).attr("rel");
                        window.jQuery("#" + window.spoiler_id).addClass("spoiler-content");
                    });
                } else {
                    window.jQuery(".spoiler").each(function() {
                        window.spoiler_id = window.jQuery(this).attr("rel");
                        window.jQuery("#" + window.spoiler_id).addClass("spoiler-content-black");
                    });
                }
            });
        }
    });
    window.jQuery(function() {
        if (utbigscreen == "si" || utbigscreen == undefined) {
            if (postitlive != 0) {
                window.jQuery('<div id="bigscreen-mode" class="sprite"></div>').insertAfter("a#showform");
                window.jQuery('<div style="display: none;" id="bigscreen-mode-off" class="sprite"></div>').insertAfter("a#showform");
                window.jQuery("#bigscreen-mode").click(function() {
                    window.jQuery("div.tinycol").addClass("bigscreen");
                    window.jQuery("div.postit").addClass("bigscreen");
                    window.jQuery("div#pi_body").addClass("bigscreen");
                    window.jQuery("div#pi_body div.embedded").addClass("bigscreen");
                    window.jQuery("div#pi_body div.embedded object").attr({
                        width: "930",
                        height: "550"
                    });
                    window.jQuery("div#pi_body div.embedded object embed").attr({
                        width: "930",
                        height: "550"
                    });
                    window.jQuery("#bigscreen-mode").hide();
                    window.jQuery("#bigscreen-mode-off").show();
                });
                window.jQuery("#bigscreen-mode-off").click(function() {
                    window.jQuery("div.tinycol").removeClass("bigscreen");
                    window.jQuery("div.postit").removeClass("bigscreen");
                    window.jQuery("div#pi_body").removeClass("bigscreen");
                    window.jQuery("div#pi_body div.embedded").removeClass("bigscreen");
                    window.jQuery("div#pi_body div.embedded object").attr({
                        width: "560",
                        height: "315"
                    });
                    window.jQuery("div#pi_body div.embedded object embed").attr({
                        width: "560",
                        height: "315"
                    });
                    window.jQuery("#bigscreen-mode").show();
                    window.jQuery("#bigscreen-mode-off").hide();
                });
            }
        }
    });
    window.jQuery(function() {
        if (utuserinfo == "si" || utuserinfo == undefined) {
            window.jQuery(document).ready(function() {
                var pendingInfoBox = undefined;
                var infoBoxX = undefined;
                var infoBoxY = undefined;
                function checkUserInfoBox() {
                    if (pendingInfoBox != undefined) {
                        launchUserInfoBox(pendingInfoBox);
                    }
                }
                function launchUserInfoBox() {
                    window.jQuery.get("http://www.mediavida.com/id/" + pendingInfoBox, function(data) {
                        window.jQuery(".infoavatar", data).each(function() {
                            if (pendingInfoBox == undefined) return false;
                            window.jQuery("#ajax_usercard").remove();
                            window.jQuery("body").append('<div id="ajax_usercard">' + window.jQuery(this).html() + "</div>");
                            var box = window.jQuery("#ajax_usercard");
                            if (is_dark == 0) {
                                box.css("background-Color", "whitesmoke");
                            } else {
                                box.css("background-color", "#39444B");
                            }
                            box.css("borderRadius", "6px");
                            box.css("padding", "10px 5px 5px 5px");
                            box.css("position", "absolute");
                            box.css("left", infoBoxX);
                            box.css("top", infoBoxY);
                            box.css("overflow", "hidden");
                            box.css("boxShadow", "1px 1px 5px rgba(0, 0, 0, 0.25)");
                            box.css("zIndex", "9999");
                            var uavatar = window.jQuery(".useravatar", box);
                            uavatar.css("float", "left");
                            uavatar.css("padding", "5px");
                            uavatar.css("marginRight", "5px");
                            var uinfo = window.jQuery(".userinfo", box);
                            uinfo.css("borderRadius", "6px");
                            uinfo.css("width", "254px");
                            uinfo.css("height", "90px");
                            uinfo.css("backgroundColor", "#F4F6F1");
                            uinfo.css("float", "left");
                            uinfo.css("padding", "5px");
                            uinfo.css("position", "relative");
                            uinfo.css("zoom", "1");
                        });
                    });
                }
                window.jQuery(".post .autor dt a").hover(function(event) {
                    window.offset = window.jQuery(this).offset();
                    pendingInfoBox = window.jQuery(this).html();
                    infoBoxX = window.offset.left - 10;
                    infoBoxY = window.offset.top + 14;
                    window.setTimeout(checkUserInfoBox, 1e3);
                }, function() {
                    pendingInfoBox = undefined;
                    window.jQuery("#ajax_usercard").remove();
                });
            });
        }
    });
    window.jQuery(function() {
        if (uttablamods == "si" || uttablamods == undefined) {
            window.jQuery(function() {
                if (window.jQuery('div#topnav a[href="/foro/"]').length > 0 && window.jQuery("div.live_info").length == 0) {
                    window.jQuery("div.smallcol, div.tinycol").append('<div class="box"><div id="modlist"><h3>Moderadores</h3></div></div>');
                    var id = window.jQuery("input#fid").attr("value");
                    window.mods = [ [ "nulo" ], [ "bazoo", "jadgix", "J40", "RaymaN", "TazzMaTazz" ], [ "Eristoff", "kalinka-" ], [ "aLeX", "Josekron", "Loa", "MegalomaniaC", "mongui", "Prava" ], [ "" ], [ "" ], [ "Atoll", "Bloody", "Eristoff", "Kails", "JMBaDBoY", "Prava", "PruDeN", "sacnoth" ], [ "abichuela", "AG", "alejo", "Ch4iNeR", "cm07", "Korso", "lb_nacho", "Netzach", "VipeR_CS" ], [ "" ], [ "Kaos", "PiradoIV" ], [ "TNx7", "tutitin" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "Kaneas", "TNx7" ], [ "" ], [ "" ], [ "Cryoned", "Dream-MV", "esvarianzza" ], [ "darkavm", "ElKedao", "Privatovic", "ukuki" ], [ "" ], [ "" ], [ "Midgard", "StumKrav", "thunder_" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "Eristoff", "ReYzell" ], [ "Andy", "eisenfaust", "ISAILOVIC", "JMBaDBoY", "loko_man", "ruben132", "Sh1n0d4", "t0rrY" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "Hir0shz", "Ligia", "ManOwaR", "sPoiLeR" ], [ "" ], [ "ferk", "HaZuKi", "horvathzeros", "J40" ], [ "" ], [ "dangerous", "zashael" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "BigmAK", "MaSqUi", "tutitin", "XaViMeTaL" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "Cheester", "cuerpi", "darkavm", "sk_sk4t3r", "TNx7", "Txentx0" ], [ "dangerous", "spyro512" ], [ "" ], [ "" ], [ "" ], [ "GR33N" ], [ "" ], [ "" ], [ "Snorky", "spyro512" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "JMBaDBoY", "Sirius_spa", "suggus", "ZaGo" ], [ "granaino127", "SaBaNdIjA" ], [ "granaino127", "SaBaNdIjA" ], [ "darkavm", "GryF", "Kb", "lb_nacho", "-Power" ], [ "" ], [ "" ], [ "ElKedao", "darkavm", "dicon", "sk_sk4t3r" ], [ "" ], [ "" ], [ "" ], [ "Atoll", "ZaGo" ], [ "DeNz1L", "kaitoo", "NosFeR_" ], [ "Skelus" ], [ "darkavm", "Dolz", "Txentx0", "urrako" ], [ "babri", "dicon", "RoDRa", "Spank" ], [ "iosp", "Hogwarts", "lb_nacho" ], [ "zashael" ], [ "Charly-", "edvan", "frostttt", "Kazuya_", "zashael" ], [ "0buS", "RaymaN", "sPoiLeR" ], [ "CsNarsil", "CybeR" ], [ "eisenfaust" ], [ "bazoo", "StumKrav", "thunder_" ], [ "DarkHawX", "Korso", "Netzach", "StumKrav" ], [ "benitogb", "BigmAK" ], [ "" ], [ "Andy", "ISAILOVIC", "JMBaDBoY", "loko_man", "ruben132", "Sh1n0d4", "t0rrY" ], [ "" ], [ "allmy", "naete", "slakk", "StumKrav", "thunder_" ], [ "gonya707", "TRON" ], [ "babri", "RoninPiros" ], [ "Bidroid", "MagicAnnii" ], [ "ChaRliFuM", "menolikeyou", "undimmer" ], [ "locof", "Pedrosa7", "Syuk" ], [ "" ], [ "alexander", "ferk", "horvathzeros", "J40" ], [ "" ], [ "KinachO" ], [ "cm07", "RoninPiros" ], [ "" ], [ "Rundull" ], [ "dangerous" ], [ "HeXaN", "Prostyler", "thunder_" ], [ "" ], [ "" ], [ "" ] ];
                    window.jQuery.each(window.mods[id], function(i, v) {
                        if (window.mods[id] == "") {
                            window.jQuery("<p/>").html("<span>Este foro no tiene mods o no están listados.</span>").appendTo("#modlist");
                        } else {
                            window.jQuery("<a/>").html(v).attr("href", "/id/" + v + "").append("<br />").appendTo("#modlist");
                        }
                    });
                }
            });
            window.jQuery(function() {
                if (is_dark == 0) {
                    window.jQuery("#modlist").addClass("modlistblanco");
                } else {
                    window.jQuery("#modlist").addClass("modlistnegro");
                }
            });
        }
    });
    window.jQuery(function() {
        if (utlinksfooter == "si" || utlinksfooter == undefined) {
            if (window.jQuery('a.boton[href^="/foro/post.php?f"]').length > 0) {
                window.jQuery("#nav_bar #userinfo").clone().removeAttr("id").addClass("ut-linksfooter").insertAfter("div.tfooter").prepend('<li><a href="/foro/">Foros</a></li><li><a href="/foro/spy">Spy</a></li><li> |</li>');
                window.jQuery("#modpanel").css("margin-top", "55px");
                window.jQuery(".ut-linksfooter a").removeAttr("id");
            } else if (window.jQuery('.live_link a[href^="/foro/live.php?tid="]').length > 0) {
                window.jQuery("#nav_bar #userinfo").clone().removeAttr("id").addClass("ut-linksfooter").insertAfter('form#postform[action="/foro/post_action.php"]').prepend('<li><a href="/foro/spy">Spy</a></li><li> |</li>');
                window.jQuery(".tpanel.live_link:eq(1)").css("margin-top", "55px");
                window.jQuery(".ut-linksfooter a").removeAttr("id");
            } else {
                window.jQuery("#nav_bar #userinfo").clone().removeAttr("id").addClass("ut-linksfooter").insertAfter('form#postform[action="/foro/post_action.php"]').prepend('<li><a href="/foro/spy">Spy</a></li><li> |</li>');
                window.jQuery(".tpanel #mmform").closest("div").css("margin-top", "55px");
                window.jQuery(".ut-linksfooter a").removeAttr("id");
            }
            if (is_dark || utlinksfooteroscuro == "si") {
                window.jQuery(".ut-linksfooter").addClass("ut-linksfooter-negro");
            } else {
                window.jQuery(".ut-linksfooter").addClass("ut-linksfooter-blanco");
            }
        }
    });
    window.jQuery(function() {
        if (utmarcapaginas == "si" || utmarcapaginas == undefined) {
            window.jQuery("div.mark").attr("style", 'background-image: url("http://www.mvusertools.com/ext/img/marcapaginas2.png") !important; background-repeat: no-repeat !important; background-position: 100px top !important;');
        }
    });
    window.jQuery('button[accesskey="b"]').hide();
    window.jQuery('<button class="alt bleft bb" accesskey="b" type="button" onclick="bbstyle(0)">b</button>').insertAfter('button[accesskey="b"]');
    window.jQuery('button[accesskey="i"]').hide();
    window.jQuery('<button class="alt bcenter bi" accesskey="i" type="button" onclick="bbstyle(2)">i</button><button class="alt bcenter2 bu" accesskey="u" type="button" onclick="bbstyle(4)">u</button><button id="ut-boton-s" class="alt bright bs" accesskey="x" type="button">s</button><button class="alt bsolo" id="ut-boton-center" accesskey="c" type="button" title="[center]"><a class="sprite bcentericon"></a></button><button class="alt bsolo" id="ut-boton-list" type="button" title="[list] Usar * para cada elemento de la lista"><a class="blist sprite"></a></button>').insertAfter('button[accesskey="i"]');
    window.jQuery('button[accesskey="l"]').hide();
    window.jQuery('<button class="alt bsolo" accesskey="l" type="button" onclick="bbstyle(8)">[url=]</button>').insertAfter('button[accesskey="l"]');
    window.jQuery('button[accesskey="m"]').hide();
    window.jQuery('<button class="alt bleft" accesskey="m" type="button" onclick="bbstyle(10)" title="[img]"><a class="bimg sprite"></a></button>').insertAfter('button[accesskey="m"]');
    window.jQuery('button[accesskey="v"]').hide();
    window.jQuery('<button class="alt bcenter" accesskey="v" type="button" onclick="bbstyle(12)" title="[video]"><a class="bvideo sprite"></a></button><button title="[audio]" id="ut-boton-audio" class="alt bright" type="button"><a class="baudio sprite"></a></button>').insertAfter('button[accesskey="v"]');
    window.jQuery('button[accesskey="s"]').hide();
    window.jQuery('<button class="alt bleft" accesskey="s" type="button" onclick="bbstyle(14)">[spoiler]</button>').insertAfter('button[accesskey="s"]');
    window.jQuery('button[accesskey="d"]').hide();
    window.jQuery('<button class="alt bcenter" accesskey="d" type="button" onclick="bbstyle(16)">[spoiler=]</button>').insertAfter('button[accesskey="d"]');
    window.jQuery('button[accesskey="n"]').hide();
    window.jQuery('<button class="alt bright" accesskey="n" type="button" onclick="bbstyle(18)">NSFW</button><button title="Pulsa para ver más opciones" id="ut-boton-plus" class="alt bsolo" type="button"><a class="ut-arrow-down sprite"></a></button><script></script>').insertAfter('button[accesskey="n"]');
    window.jQuery("#ut-boton-s").click(function() {
        if (window.jQuery("textarea#cuerpo").getSelection().text.length > 0) {
            window.jQuery("textarea#cuerpo").replaceSelection("[s]" + window.jQuery("textarea#cuerpo").getSelection().text + "[/s]").setCaretPos();
        } else {
            window.jQuery("textarea#cuerpo").insertAtCaretPos("[s][/s]").setCaretPos(window.jQuery("textarea#cuerpo").getSelection().end - 3);
        }
    });
    window.jQuery("#ut-boton-center").click(function() {
        if (window.jQuery("textarea#cuerpo").getSelection().text.length > 0) {
            window.jQuery("textarea#cuerpo").replaceSelection("[center]" + window.jQuery("textarea#cuerpo").getSelection().text + "[/center]").setCaretPos();
        } else {
            window.jQuery("textarea#cuerpo").insertAtCaretPos("[center][/center]").setCaretPos(window.jQuery("textarea#cuerpo").getSelection().end - 8);
        }
    });
    window.jQuery("#ut-boton-list").click(function() {
        if (window.jQuery("textarea#cuerpo").getSelection().text.length > 0) {
            window.jQuery("textarea#cuerpo").replaceSelection("[list]" + window.jQuery("textarea#cuerpo").getSelection().text + "[/list]").setCaretPos();
        } else {
            window.jQuery("textarea#cuerpo").insertAtCaretPos("[list][/list]").setCaretPos(window.jQuery("textarea#cuerpo").getSelection().end - 6);
        }
    });
    window.jQuery("#ut-boton-audio").click(function() {
        if (window.jQuery("textarea#cuerpo").getSelection().text.length > 0) {
            window.jQuery("textarea#cuerpo").replaceSelection("[audio]" + window.jQuery("textarea#cuerpo").getSelection().text + "[/audio]").setCaretPos();
        } else {
            window.jQuery("textarea#cuerpo").insertAtCaretPos("[audio][/audio]").setCaretPos(window.jQuery("textarea#cuerpo").getSelection().end - 7);
        }
    });
    var utsegundabarra = '<button class="alt bsolo" id="ut-boton-bar" type="button">[bar]</button><button class="alt bleft" type="button" onclick="bbstyle(20)">[code]</button><button class="alt bright2" id="ut-boton-cmd" type="button">[cmd]</button><button id="ut-button-macros" class="alt bsolo" type="button">macros <i class="sprite icon-down-list"></i></button><div id="ut-button-macros-list" style="display: none;"><ul></ul><a href="#ut-dialog-menu" id="ut-button-macros-list-anadir">añadir macro</a></div>';
    window.jQuery('<div id="ut-botonera2" style="overflow: hidden;margin: 10px 0;clear: both; display: none;">' + utsegundabarra + "</div>").insertAfter('form#postear div[style="overflow: hidden;margin: 10px 0;clear: both"]');
    window.jQuery('<div id="ut-botonera2" style="overflow: hidden;margin: 10px 0;clear: both; display: none;">' + utsegundabarra + "</div>").insertAfter('form#postform div[style="overflow: hidden;margin-bottom: 10px;clear: both"]');
    window.jQuery("#ut-boton-plus").click(function() {
        if (window.jQuery("#ut-botonera2").is(":visible")) {
            window.jQuery("#ut-botonera2").slideUp();
            window.jQuery("#ut-boton-plus a").toggleClass("ut-arrow-down").toggleClass("ut-arrow-up");
            window.jQuery("#ut-boton-plus").attr("title", "Pulsa para ver más opciones");
        } else {
            window.jQuery("#ut-botonera2").slideDown();
            window.jQuery("#ut-boton-plus a").toggleClass("ut-arrow-down").toggleClass("ut-arrow-up");
            window.jQuery("#ut-boton-plus").attr("title", "Pulsa para ocultar la segunda linea de opciones");
        }
    });
    window.jQuery("#ut-boton-bar").click(function() {
        if (window.jQuery("textarea#cuerpo").getSelection().text.length > 0) {
            window.jQuery("textarea#cuerpo").replaceSelection("[bar]" + window.jQuery("textarea#cuerpo").getSelection().text + "[/bar]").setCaretPos();
        } else {
            window.jQuery("textarea#cuerpo").insertAtCaretPos("[bar][/bar]").setCaretPos(window.jQuery("textarea#cuerpo").getSelection().end - 5);
        }
    });
    window.jQuery("#ut-boton-cmd").click(function() {
        if (window.jQuery("textarea#cuerpo").getSelection().text.length > 0) {
            window.jQuery("textarea#cuerpo").replaceSelection("[cmd]" + window.jQuery("textarea#cuerpo").getSelection().text + "[/cmd]").setCaretPos();
        } else {
            window.jQuery("textarea#cuerpo").insertAtCaretPos("[cmd][/cmd]").setCaretPos(window.jQuery("textarea#cuerpo").getSelection().end - 5);
        }
    });
    window.jQuery("#ut-button-macros").click(function() {
        if (window.jQuery('#ut-button-macros-list[style="display: none;"]').length) {
            window.jQuery("#ut-button-macros-list").show();
        } else {
            window.jQuery("#ut-button-macros-list").hide();
        }
    });
    window.jQuery("#ut-button-macros-list").mouseup(function() {
        return false;
    });
    window.jQuery("#ut-button-macros").mouseup(function() {
        return false;
    });
    window.jQuery(document).mouseup(function() {
        window.jQuery("#ut-button-macros-list").hide();
    });
    window.jQuery("#ut-button-macros-list-anadir").click(function() {
        window.jQuery("#ut-mask-menu").show();
        window.jQuery("#ut-dialog-menu").show();
        window.jQuery("#ut-menu-tab1").removeClass("active");
        window.jQuery("#ut-menu-tab2").removeClass("active");
        window.jQuery("#ut-menu-tab3").removeClass("active");
        window.jQuery("#ut-menu-tab4").addClass("active");
        window.jQuery("#ut-menu-tabla1").hide();
        window.jQuery("#ut-menu-tabla2").hide();
        window.jQuery("#ut-menu-tabla3").hide();
        window.jQuery("#ut-menu-tabla4").show();
    });
    window.jQuery('<div style="overflow: hidden;margin: 0 0 5px 0;clear: both"><button type="button" accesskey="b" class="alt bleft bb" id="ut-boton-b-perfil">b</button><button type="button" accesskey="i" class="alt bcenter bi" id="ut-boton-i-perfil">i</button><button type="button" accesskey="u" class="alt bright bu" id="ut-boton-u-perfil">u</button><button type="button" accesskey="l" class="alt bsolo" id="ut-boton-url-perfil">[url=]</button><button type="button" accesskey="s" class="alt bleft" id="ut-boton-spoiler-perfil">[spoiler]</button><button type="button" accesskey="d" class="alt bcenter" id="ut-boton-spoiler2-perfil">[spoiler=]</button><button type="button" accesskey="n" class="alt bright" id="ut-boton-nsfw-perfil">NSFW</button></div>').insertBefore('body.usuarios textarea[name="info"]');
    window.jQuery("#ut-boton-b-perfil").click(function() {
        if (window.jQuery('textarea[name="info"]').getSelection().text.length > 0) {
            window.jQuery('textarea[name="info"]').replaceSelection("[b]" + window.jQuery('textarea[name="info"]').getSelection().text + "[/b]").setCaretPos();
        } else {
            window.jQuery('textarea[name="info"]').insertAtCaretPos("[b][/b]").setCaretPos(window.jQuery('textarea[name="info"]').getSelection().end - 3);
        }
    });
    window.jQuery("#ut-boton-i-perfil").click(function() {
        if (window.jQuery('textarea[name="info"]').getSelection().text.length > 0) {
            window.jQuery('textarea[name="info"]').replaceSelection("[i]" + window.jQuery('textarea[name="info"]').getSelection().text + "[/i]").setCaretPos();
        } else {
            window.jQuery('textarea[name="info"]').insertAtCaretPos("[i][/i]").setCaretPos(window.jQuery('textarea[name="info"]').getSelection().end - 3);
        }
    });
    window.jQuery("#ut-boton-u-perfil").click(function() {
        if (window.jQuery('textarea[name="info"]').getSelection().text.length > 0) {
            window.jQuery('textarea[name="info"]').replaceSelection("[u]" + window.jQuery('textarea[name="info"]').getSelection().text + "[/u]").setCaretPos();
        } else {
            window.jQuery('textarea[name="info"]').insertAtCaretPos("[u][/u]").setCaretPos(window.jQuery('textarea[name="info"]').getSelection().end - 3);
        }
    });
    window.jQuery("#ut-boton-url-perfil").click(function() {
        if (window.jQuery('textarea[name="info"]').getSelection().text.length > 0) {
            window.jQuery('textarea[name="info"]').replaceSelection("[url=]" + window.jQuery('textarea[name="info"]').getSelection().text + "[/url]").setCaretPos();
        } else {
            window.jQuery('textarea[name="info"]').insertAtCaretPos("[url=][/url]").setCaretPos(window.jQuery('textarea[name="info"]').getSelection().end - 5);
        }
    });
    window.jQuery("#ut-boton-spoiler-perfil").click(function() {
        if (window.jQuery('textarea[name="info"]').getSelection().text.length > 0) {
            window.jQuery('textarea[name="info"]').replaceSelection("[spoiler]" + window.jQuery('textarea[name="info"]').getSelection().text + "[/spoiler]").setCaretPos();
        } else {
            window.jQuery('textarea[name="info"]').insertAtCaretPos("[spoiler][/spoiler]").setCaretPos(window.jQuery('textarea[name="info"]').getSelection().end - 9);
        }
    });
    window.jQuery("#ut-boton-spoiler2-perfil").click(function() {
        if (window.jQuery('textarea[name="info"]').getSelection().text.length > 0) {
            window.jQuery('textarea[name="info"]').replaceSelection("[spoiler=]" + window.jQuery('textarea[name="info"]').getSelection().text + "[/spoiler]").setCaretPos();
        } else {
            window.jQuery('textarea[name="info"]').insertAtCaretPos("[spoiler=][/spoiler]").setCaretPos(window.jQuery('textarea[name="info"]').getSelection().end - 9);
        }
    });
    window.jQuery("#ut-boton-nsfw-perfil").click(function() {
        if (window.jQuery('textarea[name="info"]').getSelection().text.length > 0) {
            window.jQuery('textarea[name="info"]').replaceSelection("[spoiler=NSFW]" + window.jQuery('textarea[name="info"]').getSelection().text + "[/spoiler]").setCaretPos();
        } else {
            window.jQuery('textarea[name="info"]').insertAtCaretPos("[spoiler=NSFW][/spoiler]").setCaretPos(window.jQuery('textarea[name="info"]').getSelection().end - 9);
        }
    });
    if (liveactivado == 0) {
        function botonessolounavez() {
            window.jQuery(function() {
                window.jQuery(document).one("mouseenter", "div.msg div.body div textarea", function() {
                    fasteditbuttons();
                });
                function fasteditbuttons() {
                    window.jQuery('<div style="overflow: hidden;margin: 0 0px 10px -5px;clear: both"><button type="button" accesskey="b" class="alt bleft bb" id="ut-boton-b-fast">b</button><button type="button" accesskey="i" class="alt bcenter bi" id="ut-boton-i-fast">i</button><button type="button" accesskey="u" class="alt bcenter2 bu" id="ut-boton-u-fast">u</button><button type="button" accesskey="x" class="alt bright bs" id="ut-boton-s-fast">s</button><button title="[center]" type="button" accesskey="c" id="ut-boton-center-fast" class="alt bsolo"><a class="sprite bcentericon"></a></button><button title="[list] Usar * para cada elemento de la lista" type="button" id="ut-boton-list-fast" class="alt bsolo"><a class="blist sprite"></a></button><button type="button" accesskey="l" class="alt bsolo" id="ut-boton-url-fast">[url=]</button><button title="[img]" type="button" accesskey="m" class="alt bleft" id="ut-boton-img-fast"><a class="bimg sprite"></a></button><button title="[video]" type="button" accesskey="v" class="alt bcenter" id="ut-boton-video-fast"><a class="bvideo sprite"></a></button><button type="button" class="alt bright" title="[audio]" id="ut-boton-audio-fast"><a class="baudio sprite"></a></button><button type="button" accesskey="s" class="alt bleft" id="ut-boton-spoiler-fast">[spoiler]</button><button type="button" accesskey="d" class="alt bcenter" id="ut-boton-spoiler2-fast">[spoiler=]</button><button type="button" accesskey="n" class="alt bright" id="ut-boton-nsfw-fast">NSFW</button><button type="button" id="ut-boton-bar-fast" class="alt bsolo">[bar]</button><button type="button" class="alt bsolo" id="ut-boton-code-fast">[code]</button></div>').insertBefore('div.msg div.body div textarea:not("div.extraportada textarea")');
                }
            });
        }
        window.jQuery(document).ready(function() {
            botonessolounavez();
        });
        window.jQuery(document).on("click", "button.cancelButton", function() {
            botonessolounavez();
        });
        window.jQuery(document).on("click", "button.saveButton", function() {
            botonessolounavez();
        });
        window.jQuery(document).on("click", "#ut-boton-b-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[b]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/b]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[b][/b]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 3);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-i-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[i]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/i]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[i][/i]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 3);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-u-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[u]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/u]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[u][/u]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 3);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-s-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[s]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/s]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[s][/s]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 3);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-center-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[center]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/center]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[center][/center]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 8);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-list-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[list]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/list]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[list][/list]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 6);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-url-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[url=]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/url]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[url=][/url]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 5);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-img-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[img]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/img]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[img][/img]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 5);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-video-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[video]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/video]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[video][/video]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 7);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-audio-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[audio]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/audio]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[audio][/audio]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 7);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-spoiler-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[spoiler]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/spoiler]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[spoiler][/spoiler]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 9);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-spoiler2-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[spoiler=]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/spoiler]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[spoiler=][/spoiler]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 9);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-nsfw-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[spoiler=NSFW]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/spoiler]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[spoiler=NSFW][/spoiler]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 9);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-bar-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[bar]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/bar]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[bar][/bar]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 5);
            }
        });
        window.jQuery(document).on("click", "#ut-boton-code-fast", function() {
            if (window.jQuery("div.msg div.body div textarea").getSelection().text.length > 0) {
                window.jQuery("div.msg div.body div textarea").replaceSelection("[code]" + window.jQuery("div.msg div.body div textarea").getSelection().text + "[/code]").setCaretPos();
            } else {
                window.jQuery("div.msg div.body div textarea").insertAtCaretPos("[code][/code]").setCaretPos(window.jQuery("div.msg div.body div textarea").getSelection().end - 6);
            }
        });
    }
    window.jQuery(function() {
        var utavisopostguardado = '<div style="display: none;float: left; margin-top: 28px; opacity: 0.3;">Texto guardado...</div>';
        if (utsalvarposts == "si" && liveactivado == false) {
            window.jQuery("form#postear").sisyphus({
                customKeyPrefix: "utextendido",
                name: "postear",
                timeout: 15,
                autoRelease: true,
                onSave: function() {
                    window.jQuery(utavisopostguardado).insertAfter('form#postear div[style="width: 410px"]').fadeIn("slow", function() {
                        window.jQuery(this).delay(2e3).fadeOut("slow", function() {
                            window.jQuery(this).delay(1e3).remove();
                        });
                    });
                }
            });
        }
    });
    if (utlivesdestacados == "si" || utlivesdestacados == undefined) {
        window.jQuery(document).on("mouseover", "body", function() {
            window.jQuery('img[alt="live"]').closest("tr").addClass("ut-live");
        });
    }
    if (utCambiosNombre == "si" || utCambiosNombre == undefined) {
        window.jQuery('div[class="autor"]:contains("Alien_crrpt")').children().children("dt").replaceWith('<dt><a href="/id/Alien_crrpt">Alien_derp</a></dt>');
        window.jQuery('div[class="autor"]:contains("Achotiodeque")').children().children("dt").replaceWith('<dt><a href="/id/Achotiodeque">Achotoditeque</a></dt>');
        window.jQuery('div[class="autor"]:contains("Masme")').children().children("dt").replaceWith('<dt><a href="/id/Masme">Madme</a></dt>');
        window.jQuery('div[class="autor"]:contains("MavenBack")').children().children("dt").replaceWith('<dt><a href="/id/MavenBack">Madven</a></dt>');
        window.jQuery('div[class="autor"]:contains("Ekisu")').children().children("dt").replaceWith('<dt><a href="/id/Ekisu">X-Crim</a></dt>');
        window.jQuery('div[class="autor"]:contains("X-Crim")').each(function() {
            window.jQuery(this).children().children("dd:first").replaceWith('<dd style="font-size: 10px">Mod de Mario Kart</dd>');
        });
        window.jQuery('div.fpanels div.fpanel div.info span.sub a[href="/foro/136"]').text("Shitphones");
        window.jQuery('#topnav h1:contains("Juegos móviles")').text("Shitphones");
        window.jQuery('#topnav a[href="/foro/136"]').text("Shitphones");
        window.jQuery('#footnav a[href="/foro/136"]').text("Shitphones");
        window.jQuery('div.fpanels div.fpanel div.info strong a[href="/foro/136"]').text("Shitphones");
    }
    window.jQuery(function() {
        if (utversionls == undefined) {
            window.jQuery("div#footer div.f_info p").append('• <a href="http://mvusertools.com" target="_blank">MV-Usertools</a>');
        } else {
            window.jQuery("div#footer div.f_info p").append('• <a href="http://mvusertools.com" target="_blank">MV-Usertools</a> ' + utversionls + "");
        }
    });
    window.jQuery("#scrollpages").append(balcklistToggle);
    if (window.localStorage.getItem("blacklist") == "on") {
        window.jQuery("#toggle").addClass("toggle-on");
        window.jQuery("#toggle").removeClass("toggle-off");
    } else {
        window.jQuery("#toggle").addClass("toggle-off");
        window.jQuery("#toggle").removeClass("toggle-on");
    }
    window.jQuery("a[href^='/id/']").each(function() {
        var name = this.href.slice(this.href.lastIndexOf("/") + 1);
        window.jQuery(this).parent().parent().parent(".autor").data("name", name);
    });
    window.jQuery(".autor").each(function() {
        window.jQuery(this).append("<div class='usertools'>						<div class='online-pos'><a class='tooltip ut-offline sprite' href='http://www.mediavida.com/id/" + window.jQuery(this).data("name") + "' original-title='Perfil' ></a></div>						<div class='mensaje-pos'><a class='tooltip mensaje sprite' href='http://www.mediavida.com/mensajes/nuevo/" + window.jQuery(this).data("name") + "' original-title='Mensaje'></a></div>						<div class='firma-pos'><a class='tooltip ut-firma sprite' href='http://www.mediavida.com/id/" + window.jQuery(this).data("name") + "/firmas' original-title='Firma'></a></div>						<div class='blacklist-pos'><a class='tooltip blacklist blacklist-off sprite' href='javascript:void(0)' original-title='Blacklist'></a></div>				</div>");
    });
    window.jQuery("div.autor dd.online").hide();
    window.jQuery("div.autor dd.online").parent().parent().find(".ut-offline").toggleClass("ut-online ut-offline");
    window.jQuery("img[src^='/img/users/avatar']").parent().prepend("<div class=''><span></span></div>");
    window.jQuery(".autor").each(function() {
        var localvalue = "blacklist." + window.jQuery(this).data("name");
        if (window.localStorage.getItem(localvalue) == "true") {
            window.jQuery(this).find(".blacklist").addClass("blacklist-on");
            window.jQuery(this).find(".blacklist").removeClass("blacklist-off");
            window.jQuery(this).parent().find(".info").append(blacklistInfo);
        } else {
            window.jQuery(this).find(".blacklist").addClass("blacklist-off");
            window.jQuery(this).find(".blacklist").removeClass("blacklist-on");
            window.jQuery(this).parent().find(".info").append(blacklistInfo);
            window.jQuery(this).parent().find(".blacklisted-post").hide();
            window.jQuery(this).parent().find(".tapavatares").hide();
        }
        window.jQuery(this).parent().before(blacklistBarra);
        if (window.localStorage.getItem("blacklist") == "on") {
            if (window.localStorage.getItem(localvalue) == "true") {
                window.jQuery(this).parent().hide();
            } else {
                window.jQuery(this).parent().prev().hide();
            }
        } else window.jQuery(this).parent().prev().hide();
    });
    window.jQuery("#toggle").click(function() {
        if (window.localStorage.getItem("blacklist") == "on") {
            window.jQuery("#toggle").addClass("toggle-off");
            window.jQuery("#toggle").removeClass("toggle-on");
            window.localStorage.setItem("blacklist", "off");
        } else {
            window.jQuery("#toggle").addClass("toggle-on");
            window.jQuery("#toggle").removeClass("toggle-off");
            window.localStorage.setItem("blacklist", "on");
        }
        window.console.log(window.localStorage.getItem("blacklist"));
        window.jQuery(".autor").each(function() {
            var localvalue = "blacklist." + window.jQuery(this).data("name");
            if (window.localStorage.getItem("blacklist") == "on") {
                if (window.localStorage.getItem(localvalue) == "true") {
                    window.jQuery(this).parent().prev().show();
                    window.jQuery(this).parent().hide();
                }
            } else {
                if (window.localStorage.getItem(localvalue) == "true") {
                    window.jQuery(this).parent().prev().hide();
                    window.jQuery(this).parent().slideDown();
                    window.jQuery(".social").show();
                }
            }
        });
    });
    window.jQuery(".blacklist").click(function() {
        var localvalue = "blacklist." + window.jQuery(this).parent().parent().parent().data("name");
        if (window.localStorage.getItem(localvalue) == "true") window.localStorage.removeItem(localvalue); else window.localStorage.setItem(localvalue, "true");
        window.console.log("set " + localvalue + " = " + window.localStorage.getItem(localvalue));
        window.jQuery(".autor").each(function() {
            var localvalue = "blacklist." + window.jQuery(this).data("name");
            if (window.localStorage.getItem(localvalue) == "true") {
                window.jQuery(this).find(".blacklist").addClass("blacklist-on");
                window.jQuery(this).find(".blacklist").removeClass("blacklist-off");
                window.jQuery(this).parent().find(".blacklisted-post").show();
                window.jQuery(this).parent().find(".tapavatares").show();
            } else {
                window.jQuery(this).find(".blacklist").addClass("blacklist-off");
                window.jQuery(this).find(".blacklist").removeClass("blacklist-on");
                window.jQuery(this).parent().find(".blacklisted-post").hide();
                window.jQuery(this).parent().find(".tapavatares").hide();
            }
            if (window.localStorage.getItem("blacklist") == "on") {
                if (window.localStorage.getItem(localvalue) == "true") {
                    window.jQuery(this).parent().prev().show();
                    window.jQuery(this).parent().slideUp();
                } else {
                    window.jQuery(this).parent().slideDown();
                    window.jQuery(this).parent().prev().hide();
                }
            } else if (window.localStorage.getItem(localvalue) == "true") {} else {}
        });
    });
    window.jQuery("a.tooltip").tipsy();
}, false);