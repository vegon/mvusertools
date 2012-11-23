// ==UserScript==
// @name           MV-Usertools
// @namespace      MVusertools
// @version        1.7.3
// @description    Añade controles avanzados a los posts en MV
// @include        http://www.mediavida.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require        http://www.mvusertools.com/ext/libs/tinycon.min.js
// ==/UserScript==

window.opera.addEventListener("BeforeEvent.DOMContentLoaded", function() {
    var caretPositionAmp = [];
    function init() {
        if (window.navigator.appName == "Microsoft Internet Explorer") {
            window.obj = document.getElementsByTagName("TEXTAREA");
            var b, a = 0;
            for (a = 0; a < window.obj.length; a++) {
                b = window.obj[a];
                caretPositionAmp[a] = b.value.length;
                b.onmouseup = function() {
                    b = document.activeElement;
                    for (var c = 0; c < window.obj.length; c++) if (window.obj[c] == b) break;
                    b.focus();
                    var e = document.selection.createRange(), h = b.createTextRange(), d = h.duplicate();
                    h.moveToBookmark(e.getBookmark());
                    d.setEndPoint("EndToStart", h);
                    caretPositionAmp[c] = d.text.length;
                };
                b.onkeyup = function() {
                    b = document.activeElement;
                    for (var c = 0; c < window.obj.length; c++) if (window.obj[c] == b) break;
                    b.focus();
                    var e = document.selection.createRange(), h = b.createTextRange(), d = h.duplicate();
                    h.moveToBookmark(e.getBookmark());
                    d.setEndPoint("EndToStart", h);
                    caretPositionAmp[c] = d.text.length;
                };
            }
        }
    }
    window.onload = init;
    window.jQuery.fn.extend({
        getSelection: function() {
            var b = this.jquery ? this[0] : this, a, c, e, h = 0;
            b.onmousedown = function() {
                document.selection && typeof b.selectionStart != "number" ? document.selection.empty() : window.getSelection().removeAllRanges();
            };
            if (document.selection) {
                var d = document.selection.createRange(), f = 0, g = 0, i = 0;
                a = document.getElementsByTagName("TEXTAREA");
                for (c = 0; c < a.length; c++) if (a[c] == b) break;
                if (b.value.match(/\n/g) != null) h = b.value.match(/\n/g).length;
                if (d.text) {
                    e = d.text;
                    if (typeof b.selectionStart == "number") {
                        a = b.selectionStart;
                        c = b.selectionEnd;
                        if (a == c) return {
                            start: a,
                            end: c,
                            text: d.text,
                            length: c - a
                        };
                    } else {
                        a = b.createTextRange();
                        e = a.duplicate();
                        window.firstRe = a.text;
                        a.moveToBookmark(d.getBookmark());
                        window.secondRe = a.text;
                        e.setEndPoint("EndToStart", a);
                        if (window.firstRe == window.secondRe && window.firstRe != d.text || e.text.length > window.firstRe.length) return {
                            start: caretPositionAmp[c],
                            end: caretPositionAmp[c],
                            text: "",
                            length: 0
                        };
                        a = e.text.length;
                        c = e.text.length + d.text.length;
                    }
                    if (h > 0) for (e = 0; e <= h; e++) {
                        var k = b.value.indexOf("\n", g);
                        if (k != -1 && k < a) {
                            g = k + 1;
                            f++;
                            i = f;
                        } else if (k != -1 && k >= a && k <= c) if (k == a + 1) {
                            f--;
                            i--;
                            g = k + 1;
                        } else {
                            g = k + 1;
                            i++;
                        } else e = h;
                    }
                    if (d.text.indexOf("\n", 0) == 1) i += 2;
                    a -= f;
                    c -= i;
                    return {
                        start: a,
                        end: c,
                        text: d.text,
                        length: c - a
                    };
                }
                b.focus();
                if (typeof b.selectionStart == "number") a = b.selectionStart; else {
                    d = document.selection.createRange();
                    a = b.createTextRange();
                    e = a.duplicate();
                    a.moveToBookmark(d.getBookmark());
                    e.setEndPoint("EndToStart", a);
                    a = e.text.length;
                }
                if (h > 0) for (e = 0; e <= h; e++) {
                    k = b.value.indexOf("\n", g);
                    if (k != -1 && k < a) {
                        g = k + 1;
                        f++;
                    } else e = h;
                }
                a -= f;
                if (a == 0 && typeof b.selectionStart != "number") {
                    a = caretPositionAmp[c];
                    c = caretPositionAmp[c];
                }
                return {
                    start: a,
                    end: a,
                    text: d.text,
                    length: 0
                };
            } else if (typeof b.selectionStart == "number") {
                a = b.selectionStart;
                c = b.selectionEnd;
                e = b.value.substring(b.selectionStart, b.selectionEnd);
                return {
                    start: a,
                    end: c,
                    text: e,
                    length: c - a
                };
            } else return {
                start: undefined,
                end: undefined,
                text: undefined,
                length: undefined
            };
        },
        replaceSelection: function(b) {
            var a = this.jquery ? this[0] : this, c, e;
            e = 0;
            var h, d, f = 0, g = 0, i = a.scrollTop == undefined ? 0 : a.scrollTop;
            c = document.getElementsByTagName("TEXTAREA");
            for (var k = 0; k < c.length; k++) if (c[k] == a) break;
            if (document.selection && typeof a.selectionStart != "number") {
                i = document.selection.createRange();
                if (typeof a.selectionStart != "number") {
                    var j;
                    d = a.createTextRange();
                    h = d.duplicate();
                    c = d.text;
                    d.moveToBookmark(i.getBookmark());
                    j = d.text;
                    try {
                        h.setEndPoint("EndToStart", d);
                    } catch (m) {
                        return this;
                    }
                    if (c == j && c != i.text || h.text.length > c.length) return this;
                }
                if (i.text) {
                    window.part = i.text;
                    if (a.value.match(/\n/g) != null) f = a.value.match(/\n/g).length;
                    c = h.text.length;
                    if (f > 0) for (j = 0; j <= f; j++) {
                        var l = a.value.indexOf("\n", e);
                        if (l != -1 && l < c) {
                            e = l + 1;
                            g++;
                        } else j = f;
                    }
                    i.text = b;
                    caretPositionAmp[k] = h.text.length + b.length;
                    d.move("character", caretPositionAmp[k]);
                    document.selection.empty();
                    a.blur();
                }
                return this;
            } else if (typeof a.selectionStart == "number" && a.selectionStart != a.selectionEnd) {
                c = a.selectionStart;
                e = a.selectionEnd;
                a.value = a.value.substr(0, c) + b + a.value.substr(e);
                e = c + b.length;
                a.setSelectionRange(e, e);
                a.scrollTop = i;
                return this;
            }
            return this;
        },
        setSelection: function(b, a) {
            b = window.parseInt(b);
            a = window.parseInt(a);
            var c = this.jquery ? this[0] : this;
            c.focus();
            if (typeof c.selectionStart != "number") {
                window.re = c.createTextRange();
                if (window.re.text.length < a) a = window.re.text.length + 1;
            }
            if (a < b) return this;
            if (document.selection) {
                var e = 0, h = 0, d = 0, f = 0;
                if (typeof c.selectionStart != "number") {
                    window.re.collapse(true);
                    window.re.moveEnd("character", a);
                    window.re.moveStart("character", b);
                    window.re.select();
                } else {
                    if (typeof c.selectionStart == "number") {
                        if (c.value.match(/\n/g) != null) e = c.value.match(/\n/g).length;
                        if (e > 0) for (var g = 0; g <= e; g++) {
                            var i = c.value.indexOf("\n", d);
                            if (i != -1 && i < b) {
                                d = i + 1;
                                h++;
                                f = h;
                            } else if (i != -1 && i >= b && i <= a) if (i == b + 1) {
                                h--;
                                f--;
                                d = i + 1;
                            } else {
                                d = i + 1;
                                f++;
                            } else g = e;
                        }
                        b += h;
                        a += f;
                        c.selectionStart = b;
                        c.selectionEnd = a;
                    }
                    c.focus();
                }
                return this;
            } else if (c.selectionStart || c.selectionStart == 0) {
                c.focus();
                window.getSelection().removeAllRanges();
                c.selectionStart = b;
                c.selectionEnd = a;
                c.focus();
                return this;
            }
        },
        insertAtCaretPos: function(b) {
            var a = this.jquery ? this[0] : this, c, e, h, d, f, g, i;
            c = e = 0;
            var k = a.scrollTop == undefined ? 0 : a.scrollTop;
            i = document.getElementsByTagName("TEXTAREA");
            for (var j = 0; j < i.length; j++) if (i[j] == a) break;
            a.focus();
            if (document.selection && typeof a.selectionStart != "number") {
                if (a.value.match(/\n/g) != null) c = a.value.match(/\n/g).length;
                i = window.parseInt(caretPositionAmp[j]);
                if (c > 0) for (var m = 0; m <= c; m++) {
                    var l = a.value.indexOf("\n", h);
                    if (l != -1 && l <= i) {
                        h = l + 1;
                        i -= 1;
                        e++;
                    }
                }
            }
            caretPositionAmp[j] = window.parseInt(caretPositionAmp[j]);
            a.onkeyup = function() {
                if (document.selection && typeof a.selectionStart != "number") {
                    a.focus();
                    d = document.selection.createRange();
                    f = a.createTextRange();
                    g = f.duplicate();
                    f.moveToBookmark(d.getBookmark());
                    g.setEndPoint("EndToStart", f);
                    caretPositionAmp[j] = g.text.length;
                }
            };
            a.onmouseup = function() {
                if (document.selection && typeof a.selectionStart != "number") {
                    a.focus();
                    d = document.selection.createRange();
                    f = a.createTextRange();
                    g = f.duplicate();
                    f.moveToBookmark(d.getBookmark());
                    g.setEndPoint("EndToStart", f);
                    caretPositionAmp[j] = g.text.length;
                }
            };
            if (document.selection && typeof a.selectionStart != "number") {
                d = document.selection.createRange();
                if (d.text.length != 0) return this;
                f = a.createTextRange();
                window.textLength = f.text.length;
                g = f.duplicate();
                f.moveToBookmark(d.getBookmark());
                g.setEndPoint("EndToStart", f);
                c = g.text.length;
                if (caretPositionAmp[j] > 0 && c == 0) {
                    e = caretPositionAmp[j] - e;
                    f.move("character", e);
                    f.select();
                    d = document.selection.createRange();
                    caretPositionAmp[j] += b.length;
                } else if (!(caretPositionAmp[j] >= 0) && window.textLength == 0) {
                    d = document.selection.createRange();
                    caretPositionAmp[j] = b.length + window.textLength;
                } else if (!(caretPositionAmp[j] >= 0) && c == 0) {
                    f.move("character", window.textLength);
                    f.select();
                    d = document.selection.createRange();
                    caretPositionAmp[j] = b.length + window.textLength;
                } else if (!(caretPositionAmp[j] >= 0) && c > 0) {
                    f.move("character", 0);
                    document.selection.empty();
                    f.select();
                    d = document.selection.createRange();
                    caretPositionAmp[j] = c + b.length;
                } else if (caretPositionAmp[j] >= 0 && caretPositionAmp[j] == window.textLength) {
                    if (window.textLength != 0) {
                        f.move("character", window.textLength);
                        f.select();
                    } else f.move("character", 0);
                    d = document.selection.createRange();
                    caretPositionAmp[j] = b.length + window.textLength;
                } else {
                    if (caretPositionAmp[j] >= 0 && c != 0 && caretPositionAmp[j] >= c) {
                        e = caretPositionAmp[j] - c;
                        f.move("character", e);
                    } else caretPositionAmp[j] >= 0 && c != 0 && caretPositionAmp[j] < c && f.move("character", 0);
                    document.selection.empty();
                    f.select();
                    d = document.selection.createRange();
                    caretPositionAmp[j] += b.length;
                }
                d.text = b;
                a.focus();
                return this;
            } else if (typeof a.selectionStart == "number" && a.selectionStart == a.selectionEnd) {
                h = a.selectionStart + b.length;
                c = a.selectionStart;
                e = a.selectionEnd;
                a.value = a.value.substr(0, c) + b + a.value.substr(e);
                a.setSelectionRange(h, h);
                a.scrollTop = k;
                return this;
            }
            return this;
        },
        setCaretPos: function(b) {
            var a = this.jquery ? this[0] : this, c, e = 0, h = 0, d;
            d = document.getElementsByTagName("TEXTAREA");
            for (var f = 0; f < d.length; f++) if (d[f] == a) break;
            a.focus();
            if (window.parseInt(b) == 0) return this;
            if (window.parseInt(b) > 0) {
                b = window.parseInt(b) - 1;
                if (document.selection && typeof a.selectionStart == "number" && a.selectionStart == a.selectionEnd) {
                    if (a.value.match(/\n/g) != null) e = a.value.match(/\n/g).length;
                    if (e > 0) for (var g = 0; g <= e; g++) {
                        d = a.value.indexOf("\n", c);
                        if (d != -1 && d <= b) {
                            c = d + 1;
                            b = window.parseInt(b) + 1;
                        }
                    }
                }
            } else if (window.parseInt(b) < 0) {
                b = window.parseInt(b) + 1;
                if (document.selection && typeof a.selectionStart != "number") {
                    b = a.value.length + window.parseInt(b);
                    if (a.value.match(/\n/g) != null) e = a.value.match(/\n/g).length;
                    if (e > 0) {
                        for (g = 0; g <= e; g++) {
                            d = a.value.indexOf("\n", c);
                            if (d != -1 && d <= b) {
                                c = d + 1;
                                b = window.parseInt(b) - 1;
                                h += 1;
                            }
                        }
                        b = b + h - e;
                    }
                } else if (document.selection && typeof a.selectionStart == "number") {
                    b = a.value.length + window.parseInt(b);
                    if (a.value.match(/\n/g) != null) e = a.value.match(/\n/g).length;
                    if (e > 0) {
                        b = window.parseInt(b) - e;
                        for (g = 0; g <= e; g++) {
                            d = a.value.indexOf("\n", c);
                            if (d != -1 && d <= b) {
                                c = d + 1;
                                b = window.parseInt(b) + 1;
                                h += 1;
                            }
                        }
                    }
                } else b = a.value.length + window.parseInt(b);
            } else return this;
            if (document.selection && typeof a.selectionStart != "number") {
                c = document.selection.createRange();
                if (c.text != 0) return this;
                a = a.createTextRange();
                a.collapse(true);
                a.moveEnd("character", b);
                a.moveStart("character", b);
                a.select();
                caretPositionAmp[f] = b;
                return this;
            } else if (typeof a.selectionStart == "number" && a.selectionStart == a.selectionEnd) {
                a.setSelectionRange(b, b);
                return this;
            }
            return this;
        },
        countCharacters: function() {
            var b = this.jquery ? this[0] : this;
            if (b.value.match(/\r/g) != null) return b.value.length - b.value.match(/\r/g).length;
            return b.value.length;
        },
        setMaxLength: function(b, a) {
            this.each(function() {
                var c = this.jquery ? this[0] : this, e = c.type, h, d;
                if (window.parseInt(b) < 0) b = 1e8;
                if (e == "text") c.maxLength = b;
                if (e == "textarea" || e == "text") {
                    c.onkeypress = function(f) {
                        var g = c.value.match(/\r/g);
                        d = b;
                        if (g != null) d = window.parseInt(d) + g.length;
                        f = f || window.event;
                        g = f.keyCode;
                        h = document.selection ? document.selection.createRange().text.length > 0 : c.selectionStart != c.selectionEnd;
                        if (c.value.length >= d && (g > 47 || g == 32 || g == 0 || g == 13) && !f.ctrlKey && !f.altKey && !h) {
                            c.value = c.value.substring(0, d);
                            typeof a == "function" && a();
                            return false;
                        }
                    };
                    c.onkeyup = function() {
                        var f = c.value.match(/\r/g), g = 0, i = 0;
                        d = b;
                        if (f != null) {
                            for (var k = 0; k <= f.length; k++) if (c.value.indexOf("\n", i) <= window.parseInt(b)) {
                                g++;
                                i = c.value.indexOf("\n", i) + 1;
                            }
                            d = window.parseInt(b) + g;
                        }
                        if (c.value.length > d) {
                            c.value = c.value.substring(0, d);
                            typeof a == "function" && a();
                            return this;
                        }
                    };
                } else return this;
            });
            return this;
        }
    });
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
    var utnoti = window.jQuery('div#userinfo a[href^="/foro/favoritos"] strong.bubble').html();
    var utavisos = window.jQuery('div#userinfo a[href^="/notificaciones"] strong.bubble').html();
    var utmsj = window.jQuery('div#userinfo a[href^="/mensajes"] strong.bubble').html();
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
        var css = ".sprite {		background: url(http://www.mvusertools.com/ext/img/sprites172.png) no-repeat;	}	.usertools TABLE TD	{			padding: 3px;	}	.usertools A	{	}	.ut-firma	{			background-position: 0 -58px;			text-indent: -9999px;			width: 14px;			height: 11px;			display: block;			outline: 0;			margin-top: 1px;	}	.ut-firma:hover	{			background-position: 0 -69px;	}	.mensaje	{			background-position: -20px -58px;			text-indent: -9999px;			width: 14px;			height: 10px;			outline: 0;			display: block;			margin-top: 1px;	}	.mensaje:hover	{			background-position: -20px -68px;	}	.blacklist-off	{			background-position: -39px -57px;			text-indent: -9999px;			width: 12px;			height: 12px;			outline: 0;			display: block;			margin-top: 1px;	}	.blacklist-off:hover	{			background-position: -39px -69px;	}	.blacklist-on	{			background-position: -39px -69px;			text-indent: -9999px;			width: 12px;			height: 12px;			outline: 0;			display: block;			margin-top: 1px;	}	.blacklist-on:hover	{			background-position: -39px -57px;	}	.blacklist	{	}	.ut-online	{			background-position: -56px -72px;			text-indent: -99999px;			width: 8px;			height: 12px;			display: block;			outline: 0;	}		.ut-offline	{			background-position: -56px -58px;			text-indent: -99999px;			width: 8px;			height: 12px;			display: block;			outline: 0;	}	.online-pos	{			float: left;			width: 14px;			z-index: 999;	}	.mensaje-pos	{			float: left;			width: 19px;	}	.blacklist-pos	{			float: right;			margin-top: -1px;			width: 15px;	}	.firma-pos	{			float: left;			width: 19px;	}	.mensaje-ocultado	{			font-weight: bold;	}	.toggle-on	{			background-position: -37px -21px;			width: 34px;			height: 34px;			cursor: pointer;	}	.toggle-off	{			background-position: 0 -21px;			width: 34px;			height: 34px;			cursor: pointer;	}	.tapavatares	{			width: 0px; 			height: 0px; 			position:relative;	}	.tapavatares span {			position: abosolute; 			background: url(http://www.mvusertools.com/ext/img/blacklisted.png) no-repeat;			background-position: 0 4px;			width: 80px; 			height: 84px; 			top: 6px; 			left: 0px;			display: block;	}	.blacklisted-post	{			border-radius: 7px;			ms-border-radius: 7px;			-moz-border-radius: 7px;			-webkit-border-radius: 7px;			-khtml-border-radius: 7px;			padding: 3px 10px 2px 10px;			background: #ccc;			color: #626262 !important;	}	.usertools	{			position: relative;			width: 67px;			margin-top: 2px;	}	button::-moz-focus-inner {	border: 0;	padding: 0;	margin:0;	}	.mbuttons button[type], button.alt[type] {		padding:2px 4px !important;			}	.mbuttons a:hover,button.alt:hover {	background-color:#aaaaaa;	border:1px solid #c2e1ef;	color:#ffffff;	}	button.alt {		border-color: #aaa !important;		min-width: 20px;		border-radius: 5px !important;	}	button.bleft {		border-radius: 5px 0px 0px 5px !important;		margin-right: 0px !important;		border-right-width: 0px !important;		font-weight: normal !important;	}	button.bcenter {		margin-right: 0px !important;		border-left-width: 1px !important;		border-left-color: #aaa !important;		font-weight: normal !important;		border-radius: 0px !important;	}	button.bcenter2 {		margin-right: 0px !important;		border-left-width: 0px !important;		border-left-color: #aaa !important;		font-weight: normal !important;		border-radius: 0px !important;	}	button.bright {		border-radius: 0px 5px 5px 0px !important;		margin-left: 0px !important;		border-left-width: 0px !important;		font-weight: normal !important;	}	button.bright2 {		border-radius: 0px 5px 5px 0px !important;		font-weight: normal !important;	}	button.bsolo {		border-radius: 5px !important;		font-weight: normal !important;	}	button.bb {		font-weight: bold !important;	}	button.bi {		font-style: italic !important;	}	button.bu {		text-decoration: underline !important;	}	button.bs {		text-decoration: line-through !important;	}	.baudio {		background-position: -0px 3px;		width: 11px; 		height: 17px; 		display: block; 	}	.bimg {		background-position: -25px 3px;		width: 12px; 		height: 17px; 		display: block; 		margin-left: 1px; 	}	.bvideo {		background-position: -12px 3px;		width: 12px; 		height: 17px; 		display: block; 	}	.bcentericon {		background-position: -37px 3px;		width: 14px; 		height: 17px; 		display: block; 	}	.blist {		background-position: -51px 3px;		width: 14px; 		height: 17px; 		display: block; 	}	.ut-live td {		background-color: #FFEEEE;	}	.ut-live td.alt {		background-color: #EFE0E0;	}	.linksfooter A {		opacity: 0.5;	}	.linksfooter A:hover {		opacity: 1;	}	.linksfooter2 {		padding: 5px 6px !important;		border-radius: 6px;		line-height: 35px;	}	.linksfooter2 IMG {		vertical-align: sub;	}	.linksfooter2 A {		padding: 0px 3px !important;	}	.linksfooterblanco {		background: linear-gradient(to top, #E8EBE3, #D6D8D2) !important;		background: -webkit-gradient(linear, left top, left bottom, from(#D6D8D2), to(#E8EBE3)) !important;		color: #8e908a;		border: 1px solid #C7C9C3;		border-bottom: 1px solid #BABCB6;	}	.linksfooterblanco A {		color: #666666;	}	.linksfooterblanco A:hover {		color: #222222;	}	.linksfooternegro {		background: linear-gradient(to top, #1c252b, #010101) !important;		background: -webkit-gradient(linear, left top, left bottom, from(#010101), to(#1C252B)) !important;		color: #4A4D50;		border: 1px solid #555f66;		border-bottom: 1px solid #0e1113;	}	#modlist {		margin: 20px 0 0;		padding: 10px 10px;		border-radius: 6px 6px 6px 6px;	}	.modlistblanco {		border: 1px solid #D4D4D2;	}	.modlistnegro {		border: 1px solid #273037;		background-color: #39444B;	}	#modlist H3{		margin-top: 0px !important;	}	#modlist A{		padding: 3px 0 3px 3px;		display: block;	}	.modlistblanco A:nth-child(odd){		background: #E8EBE3;	}	.modlistblanco A:hover{		background: #D6D8D2;	}	.modlistblanco span{		color: #555555;	}	.modlistnegro A:nth-child(odd){		background: #435058;	}	.modlistnegro A:hover{		background: #273037;	}	.modlistnegro span{		color: #C5D1EC;	}	.config {	background-position: -78px -34px;	width: 14px;	height: 14px;	display: inline-block;	margin: 0 3px;	top: 3px;	position: relative;	}	#ut-mask {	background: #ffffff; width: 100%; height: 100%; position: fixed; opacity: 0.9; z-index: 9998;	}	#ut-mask-menu {	background: #000000; width: 100%; height: 100%; position: fixed; opacity: 0.9; z-index: 9998;	}	#ut-dialog {	width: 500px; top: 10px; left: 50%; margin-left: -250px; position: fixed; z-index: 9999;	}	#ut-dialog-menu {	width: 500px; top: 50px; left: 50%; margin-left: -250px; position: fixed; z-index: 9999;	}	#ut-dialog span, #ut-dialog-menu span, ut-dialog A, #ut-dialog-menu A{	cursor: pointer;	color: #EF5000;	}	#ut-window {	background: #ffffff; border-radius: 6px; padding: 10px 10px 30px 10px; border: 1px solid #cccccc;	}	#ut-menu-contenido {	background: #fff;	min-height: 270px;	}	#ut-menu-contenido TABLE{	border-top: 1px solid #ccc;	}	div.post .msg .newquote .cuerpo, div.post .msg .newquoteblack .cuerpo{	overflow: inherit !important;	}	.newquote a.toggled, .newquoteblack a.toggled{	border-style: solid !important;	border-width: 1px !important;	margin: 0 !important;	padding: 0 3px !important;	}	.newquote a.toggled {	border-color: #CCCCCC #CCCCCC #CCCCCC !important;	}	.newquoteblack a.toggled{	border-color: #CCCCCC #CCCCCC #CCCCCC !important;	}	.newquote div.quote, .newquoteblack div.quote{	border: 1px solid #CCCCCC !important;	margin: 0 0 8px !important;	border-radius: 0 6px 6px 6px !important;	}	.tinycol.bigscreen{	margin-top: 800px;	}	.postit.bigscreen{	width: 958px;	padding-left: 0px;	}	#pi_body.bigscreen{	width: 938px;	}	.embedded.bigscreen{	;	}	#bigscreen-mode{	background-position: -99px -28px;	width: 41px;	height: 23px;	float: right;	margin: 5px 0 5px 10px;	cursor: pointer;	}	#bigscreen-mode:hover{	background-position: -142px -28px;	}	#bigscreen-mode-off{	background-position: -99px 0;	width: 41px;	height: 23px;	float: right;	margin: 5px 0px 5px 10px;	cursor: pointer;	}	#bigscreen-mode-off:hover{	background-position: -141px 0;	}	.post .spoiler-content {		background-color: #F0F2ED;		padding: 5px;		border-bottom: 1px solid #d7d9d4;	}	.post.odd .spoiler-content {		background-color: #E7E9E4;	}	.post .spoiler-content-black {		background-color: #435058;		padding: 5px;		border-bottom: 1px solid #252C31;	}	.post.odd .spoiler-content-black {		background-color: #39444B;	}	#ut-menu-tabs div{		margin: 0 10px 0 0;		padding: 3px 4px;		background: #eee;		display: inline-block;		cursor: pointer;		border-top: 1px solid #CCCCCC;		border-right: 1px solid #CCCCCC;		border-left: 1px solid #CCCCCC;		color: #999;		font-size: 13px;	}	#ut-menu-tabs div.active{		background: #444;		color: #eee;		border-top: 1px solid #CCCCCC;		border-right: 1px solid #CCCCCC;		border-left: 1px solid #CCCCCC;	}	#ut-menu-tabs div.active:hover{		background: #444;		color: #eee;		border-top: 1px solid #CCCCCC;		border-right: 1px solid #CCCCCC;		border-left: 1px solid #CCCCCC;	}	#ut-menu-tabs div:hover{		background: #ddd;		color: #222;	}	#ut-menu-contenido .ut-opciones td:nth-child(2n+1){		width: 420px;	}	";
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
    window.jQuery('<div id="ut-config" class="last" style="margin-left: 10px;"><strong class="bar"><a id="ut-menu" style="cursor:pointer;"><span class="sprite config"></span><span class="uextra">Ut</span></a></strong></div>').insertAfter("div#userinfo");
    window.jQuery('<div style="display: none;" id="ut-mask-menu"></div>').insertBefore("#background");
    var utmenutabs = '<div id="ut-menu-tabs"><div id="ut-menu-tab1" class="active">Modulos</div><div id="ut-menu-tab2">Estilos</div><div id="ut-menu-tab3">Sobre MV-UT</div></div>';
    var utmenutabla1 = '<table id="ut-menu-tabla1" class="ut-opciones"><tbody><tr><td>Links importantes al final de la página</td><td><span id="ut-linksfooter-si">Si</span> <span id="ut-linksfooter-no">No</span></td></tr><tr style="background: none;"><td><p id="ut-utlinksfooteroscuro" style="color: #999999;">Links importantes estilo oscuro usando theme predeterminado</p></td><td><span id="ut-utlinksfooteroscuro-si">Si</span> <span id="ut-utlinksfooteroscuro-no">No</span></td></tr><tr><td>Tabla de mods</td><td><span id="ut-tablamods-si">Si</span> <span id="ut-tablamods-no">No</span></td></tr><tr><td>Iconos de las noticias en portada</td><td><span id="ut-uticonosportada-si">Si</span> <span id="ut-uticonosportada-no">No</span></td></tr><tr><td>Iconos de las noticias en destacados</td><td><span id="ut-uticonosdestacados-si">Si</span> <span id="ut-uticonosdestacados-no">No</span></td></tr><tr><td>Información del usuario al dejar el ratón sobre su nick</td><td><span id="ut-utuserinfo-si">Si</span> <span id="ut-utuserinfo-no">No</span></td></tr><tr><td>Botón para ensanchar streams en hilos con Live! y postit (Experimental)</td><td><span id="ut-utbigscreen-si">Si</span> <span id="ut-utbigscreen-no">No</span></td></tr><tr><td>Opción para ordenar hilos por respuestas sin leer</td><td><span id="ut-utordenarposts-si">Si</span> <span id="ut-utordenarposts-no">No</span></td></tr><tr><td>Avisos en el favicon</td><td><span id="ut-utfavicon-si">Si</span> <span id="ut-utfavicon-no">No</span></td></tr></tbody></table>';
    var utmenutabla2 = '<table id="ut-menu-tabla2" class="ut-opciones" style="display: none;"><tbody><tr><td>Marcapáginas</td><td><span id="ut-marcapaginas-si">Si</span> <span id="ut-marcapaginas-no">No</span></td></tr><tr><td>Hilos con Live! activado destacados (solo para theme predeterminado)</td><td><span id="ut-utlivesdestacados-si">Si</span> <span id="ut-utlivesdestacados-no">No</span></td></tr><tr><td>Nuevo estilo para los quotes</td><td><span id="ut-utnewquote-si">Si</span> <span id="ut-utnewquote-no">No</span></td></tr><td>Nuevo estilo para los spoilers</td><td><span id="ut-utestilospoilers-si">Si</span> <span id="ut-utestilospoilers-no">No</span></td></tr></tbody></table>';
    var utmenutabla3 = '<table id="ut-menu-tabla3" style="display: none;"><tbody><tr><td><a href="http://mvusertools.com" target="_blank"><img src="http://www.mediavida.com/img/f/mediavida/2012/11/55268_mv_usertools_extension_para_firefox_chrome_opera_safari_0_full.png" width="48" height="48"><p>MV-Usertools</a> desarrollado por <a href="/id/Vegon">Vegon</a> y <a href="/id/cm07">cm07</a></p><br /><br /><p>Para comunicar bugs usa el <a href="http://www.mediavida.com/foro/4/mv-usertools-extension-para-firefox-chrome-opera-safari-413818">hilo oficial</a>. Si tienes dudas de como funciona algun modulo u opción visita el <a href="http://mvusertools.com/caracteristicas">manual en la web oficial</a> que siempre está actualizado con las ultimas novedades.</p><br /><br /><p>Si las MV-Usertools te resultan utiles y quieres agradecernos las horas de trabajo detrás de ellas, tiranos algunas monedas.</p><br /><form action="https://www.paypal.com/cgi-bin/webscr" method="post"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="2TD967SQAC6HC"><input type="image" src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal. La forma rápida y segura de pagar en Internet."><img alt="" border="0" src="https://www.paypalobjects.com/es_ES/i/scr/pixel.gif" width="1" height="1"></form></td></tr></tbody></table>';
    window.jQuery('<div style="display: none;" id="ut-dialog-menu"><div id="ut-window"><div id="ut-menu-contenido">' + utmenutabs + "" + utmenutabla1 + "" + utmenutabla2 + "" + utmenutabla3 + "</div>" + bottominfo + '<a style="float: right; margin-top: 10px;" id="ut-menu-cerrar">Cerrar</a></div></div>').insertBefore("#content_head");
    window.jQuery("#ut-menu-tabla1 tr:odd, #ut-menu-tabla2 tr:odd, #ut-menu-tabla3 tr:odd").addClass("odd");
    window.jQuery("#ut-menu-tab1").click(function() {
        window.jQuery("#ut-menu-tab1").addClass("active");
        window.jQuery("#ut-menu-tab2").removeClass("active");
        window.jQuery("#ut-menu-tab3").removeClass("active");
        window.jQuery("#ut-menu-tabla1").show();
        window.jQuery("#ut-menu-tabla2").hide();
        window.jQuery("#ut-menu-tabla3").hide();
    });
    window.jQuery("#ut-menu-tab2").click(function() {
        window.jQuery("#ut-menu-tab1").removeClass("active");
        window.jQuery("#ut-menu-tab2").addClass("active");
        window.jQuery("#ut-menu-tab3").removeClass("active");
        window.jQuery("#ut-menu-tabla1").hide();
        window.jQuery("#ut-menu-tabla2").show();
        window.jQuery("#ut-menu-tabla3").hide();
    });
    window.jQuery("#ut-menu-tab3").click(function() {
        window.jQuery("#ut-menu-tab1").removeClass("active");
        window.jQuery("#ut-menu-tab2").removeClass("active");
        window.jQuery("#ut-menu-tab3").addClass("active");
        window.jQuery("#ut-menu-tabla1").hide();
        window.jQuery("#ut-menu-tabla2").hide();
        window.jQuery("#ut-menu-tabla3").show();
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
    var nicklenght = window.jQuery('div#userinfo a[href^="/id/"] span').text().length;
    window.jQuery(function() {
        if (nicklenght > 8) {
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
    window.jQuery("#ut-utlinksfooteroscuro-si").click(function() {
        window.localStorage["utlinksfooteroscuro"] = "si";
        window.jQuery("#ut-utlinksfooteroscuro-no").css("color", "#999999");
        window.jQuery("#ut-utlinksfooteroscuro-si").css("color", "#EF5000");
    });
    window.jQuery("#ut-utlinksfooteroscuro-no").click(function() {
        window.localStorage["utlinksfooteroscuro"] = "no";
        window.jQuery("#ut-utlinksfooteroscuro-si").css("color", "#999999");
        window.jQuery("#ut-utlinksfooteroscuro-no").css("color", "#EF5000");
    });
    if (utlinksfooteroscuro == "si") {
        window.jQuery("#ut-utlinksfooteroscuro-no").css("color", "#999999");
    }
    if (utlinksfooteroscuro == "no" || utlinksfooteroscuro == undefined) {
        window.jQuery("#ut-utlinksfooteroscuro-si").css("color", "#999999");
    }
    window.jQuery("#ut-tablamods-si").click(function() {
        window.localStorage["uttablamods"] = "si";
        window.jQuery("#ut-tablamods-no").css("color", "#999999");
        window.jQuery("#ut-tablamods-si").css("color", "#EF5000");
    });
    window.jQuery("#ut-tablamods-no").click(function() {
        window.localStorage["uttablamods"] = "no";
        window.jQuery("#ut-tablamods-si").css("color", "#999999");
        window.jQuery("#ut-tablamods-no").css("color", "#EF5000");
    });
    if (uttablamods == "si" || uttablamods == undefined) {
        window.jQuery("#ut-tablamods-no").css("color", "#999999");
    }
    if (uttablamods == "no") {
        window.jQuery("#ut-tablamods-si").css("color", "#999999");
    }
    window.jQuery("#ut-marcapaginas-si").click(function() {
        window.localStorage["utmarcapaginas"] = "si";
        window.jQuery("#ut-marcapaginas-no").css("color", "#999999");
        window.jQuery("#ut-marcapaginas-si").css("color", "#EF5000");
    });
    window.jQuery("#ut-marcapaginas-no").click(function() {
        window.localStorage["utmarcapaginas"] = "no";
        window.jQuery("#ut-marcapaginas-si").css("color", "#999999");
        window.jQuery("#ut-marcapaginas-no").css("color", "#EF5000");
    });
    if (utmarcapaginas == "si" || utmarcapaginas == undefined) {
        window.jQuery("#ut-marcapaginas-no").css("color", "#999999");
    }
    if (utmarcapaginas == "no") {
        window.jQuery("#ut-marcapaginas-si").css("color", "#999999");
    }
    window.jQuery("#ut-uticonosportada-si").click(function() {
        window.localStorage["uticonosportada"] = "si";
        window.jQuery("#ut-uticonosportada-no").css("color", "#999999");
        window.jQuery("#ut-uticonosportada-si").css("color", "#EF5000");
    });
    window.jQuery("#ut-uticonosportada-no").click(function() {
        window.localStorage["uticonosportada"] = "no";
        window.jQuery("#ut-uticonosportada-si").css("color", "#999999");
        window.jQuery("#ut-uticonosportada-no").css("color", "#EF5000");
    });
    if (uticonosportada == "si" || uticonosportada == undefined) {
        window.jQuery("#ut-uticonosportada-no").css("color", "#999999");
    }
    if (uticonosportada == "no") {
        window.jQuery("#ut-uticonosportada-si").css("color", "#999999");
    }
    window.jQuery("#ut-uticonosdestacados-si").click(function() {
        window.localStorage["uticonosdestacados"] = "si";
        window.jQuery("#ut-uticonosdestacados-no").css("color", "#999999");
        window.jQuery("#ut-uticonosdestacados-si").css("color", "#EF5000");
    });
    window.jQuery("#ut-uticonosdestacados-no").click(function() {
        window.localStorage["uticonosdestacados"] = "no";
        window.jQuery("#ut-uticonosdestacados-si").css("color", "#999999");
        window.jQuery("#ut-uticonosdestacados-no").css("color", "#EF5000");
    });
    if (uticonosdestacados == "si" || uticonosdestacados == undefined) {
        window.jQuery("#ut-uticonosdestacados-no").css("color", "#999999");
    }
    if (uticonosdestacados == "no") {
        window.jQuery("#ut-uticonosdestacados-si").css("color", "#999999");
    }
    window.jQuery("#ut-utlivesdestacados-si").click(function() {
        window.localStorage["utlivesdestacados"] = "si";
        window.jQuery("#ut-utlivesdestacados-no").css("color", "#999999");
        window.jQuery("#ut-utlivesdestacados-si").css("color", "#EF5000");
    });
    window.jQuery("#ut-utlivesdestacados-no").click(function() {
        window.localStorage["utlivesdestacados"] = "no";
        window.jQuery("#ut-utlivesdestacados-si").css("color", "#999999");
        window.jQuery("#ut-utlivesdestacados-no").css("color", "#EF5000");
    });
    if (utlivesdestacados == "si" || utlivesdestacados == undefined) {
        window.jQuery("#ut-utlivesdestacados-no").css("color", "#999999");
    }
    if (utlivesdestacados == "no") {
        window.jQuery("#ut-utlivesdestacados-si").css("color", "#999999");
    }
    window.jQuery("#ut-utnewquote-si").click(function() {
        window.localStorage["utnewquote"] = "si";
        window.jQuery("#ut-utnewquote-no").css("color", "#999999");
        window.jQuery("#ut-utnewquote-si").css("color", "#EF5000");
    });
    window.jQuery("#ut-utnewquote-no").click(function() {
        window.localStorage["utnewquote"] = "no";
        window.jQuery("#ut-utnewquote-si").css("color", "#999999");
        window.jQuery("#ut-utnewquote-no").css("color", "#EF5000");
    });
    if (utnewquote == "si" || utnewquote == undefined) {
        window.jQuery("#ut-utnewquote-no").css("color", "#999999");
    }
    if (utnewquote == "no") {
        window.jQuery("#ut-utnewquote-si").css("color", "#999999");
    }
    window.jQuery("#ut-utuserinfo-si").click(function() {
        window.localStorage["utuserinfo"] = "si";
        window.jQuery("#ut-utuserinfo-no").css("color", "#999999");
        window.jQuery("#ut-utuserinfo-si").css("color", "#EF5000");
    });
    window.jQuery("#ut-utuserinfo-no").click(function() {
        window.localStorage["utuserinfo"] = "no";
        window.jQuery("#ut-utuserinfo-si").css("color", "#999999");
        window.jQuery("#ut-utuserinfo-no").css("color", "#EF5000");
    });
    if (utuserinfo == "si" || utuserinfo == undefined) {
        window.jQuery("#ut-utuserinfo-no").css("color", "#999999");
    }
    if (utuserinfo == "no") {
        window.jQuery("#ut-utuserinfo-si").css("color", "#999999");
    }
    window.jQuery("#ut-utestilospoilers-si").click(function() {
        window.localStorage["utestilospoilers"] = "si";
        window.jQuery("#ut-utestilospoilers-no").css("color", "#999999");
        window.jQuery("#ut-utestilospoilers-si").css("color", "#EF5000");
    });
    window.jQuery("#ut-utestilospoilers-no").click(function() {
        window.localStorage["utestilospoilers"] = "no";
        window.jQuery("#ut-utestilospoilers-si").css("color", "#999999");
        window.jQuery("#ut-utestilospoilers-no").css("color", "#EF5000");
    });
    if (utestilospoilers == "si" || utestilospoilers == undefined) {
        window.jQuery("#ut-utestilospoilers-no").css("color", "#999999");
    }
    if (utestilospoilers == "no") {
        window.jQuery("#ut-utestilospoilers-si").css("color", "#999999");
    }
    window.jQuery("#ut-utbigscreen-si").click(function() {
        window.localStorage["utbigscreen"] = "si";
        window.jQuery("#ut-utbigscreen-no").css("color", "#999999");
        window.jQuery("#ut-utbigscreen-si").css("color", "#EF5000");
    });
    window.jQuery("#ut-utbigscreen-no").click(function() {
        window.localStorage["utbigscreen"] = "no";
        window.jQuery("#ut-utbigscreen-si").css("color", "#999999");
        window.jQuery("#ut-utbigscreen-no").css("color", "#EF5000");
    });
    if (utbigscreen == "si" || utbigscreen == undefined) {
        window.jQuery("#ut-utbigscreen-no").css("color", "#999999");
    }
    if (utbigscreen == "no") {
        window.jQuery("#ut-utbigscreen-si").css("color", "#999999");
    }
    window.jQuery("#ut-utordenarposts-si").click(function() {
        window.localStorage["utordenarposts"] = "si";
        window.jQuery("#ut-utordenarposts-no").css("color", "#999999");
        window.jQuery("#ut-utordenarposts-si").css("color", "#EF5000");
    });
    window.jQuery("#ut-utordenarposts-no").click(function() {
        window.localStorage["utordenarposts"] = "no";
        window.jQuery("#ut-utordenarposts-si").css("color", "#999999");
        window.jQuery("#ut-utordenarposts-no").css("color", "#EF5000");
    });
    if (utordenarposts == "si" || utordenarposts == undefined) {
        window.jQuery("#ut-utordenarposts-no").css("color", "#999999");
    }
    if (utordenarposts == "no") {
        window.jQuery("#ut-utordenarposts-si").css("color", "#999999");
    }
    window.jQuery("#ut-utfavicon-si").click(function() {
        window.localStorage["utfavicon"] = "si";
        window.jQuery("#ut-utfavicon-no").css("color", "#999999");
        window.jQuery("#ut-utfavicon-si").css("color", "#EF5000");
    });
    window.jQuery("#ut-utfavicon-no").click(function() {
        window.localStorage["utfavicon"] = "no";
        window.jQuery("#ut-utfavicon-si").css("color", "#999999");
        window.jQuery("#ut-utfavicon-no").css("color", "#EF5000");
    });
    if (utfavicon == "si" || utfavicon == undefined) {
        window.jQuery("#ut-utfavicon-no").css("color", "#999999");
    }
    if (utfavicon == "no") {
        window.jQuery("#ut-utfavicon-si").css("color", "#999999");
    }
    var utversion = window.localStorage["utversion"];
    var utpatchnotes = '<p style="font-size: 16px; font-weight: bold;">Actualización 1.7.3</p><br /><br />- Opción para ordenar hilos por respuestas sin leer (funciona en los foros y en favoritos).<br /><br />- Avisos en el favicon.<br /><br />- Por aclamación popular (y amenazas por MP e IRC), la botonera opcional al final de hilos y foros ahora es posible ponerla con los tonos oscuros aunque uses el theme predeterminado.<br /><br />- Nuevo menú con las opciones mejor ordenadas.<br /><br />- Las opciones ya no se resetearán con cada actualización.<br /><br />- Corregidos los botones que dejaron de ir en el formulario de respuesta. Se ha creado un sistema desde 0 así que se podrán crear botones nuevos en el futuro sin problemas.<br /><br />- Corrección de bugs.';
    window.jQuery('<div style="display: none" id="ut-mask"></div>').insertBefore("#background");
    window.jQuery('<div style="display: none" id="ut-dialog"><a href="http://mvusertools.com" target="_blank"><img style="margin: 0 150px;" src="http://www.mediavida.com/img/f/mediavida/2012/10/02632_mv_usertools_extension_para_firefox_chrome_safari_0_full.png"></a><div id="ut-window">' + utpatchnotes + "" + bottominfo + '<span style="float: right; margin-top: 10px;" id="ut-box-cerrar">Cerrar</span></div></div>').insertBefore("#content_head");
    window.jQuery(function() {
        if (utversion != "1.7.3") {
            window.jQuery("div#ut-mask").show();
            window.jQuery("div#ut-dialog").show();
            window.localStorage["utversion"] = "1.7.3";
        }
    });
    window.jQuery("#ut-box-cerrar").click(function() {
        window.jQuery("div#ut-mask").hide();
        window.jQuery("div#ut-dialog").hide();
    });
    window.jQuery("#ut-mask").click(function() {
        window.jQuery("div#ut-mask").hide();
        window.jQuery("div#ut-dialog").hide();
    });
    window.jQuery(function() {
        if (utfavicon == "si" || utfavicon == undefined) {
            if (utnoti === undefined) {
                var utnoti_int = window.parseInt(0, 10);
            } else {
                var utnoti_int = window.parseInt(window.jQuery('div#userinfo a[href^="/foro/favoritos"] strong.bubble').html(), 10);
            }
            if (utavisos === undefined) {
                var utavisos_int = window.parseInt(0, 10);
            } else {
                var utavisos_int = window.parseInt(window.jQuery('div#userinfo a[href^="/notificaciones"] strong.bubble').html(), 10);
            }
            if (utmsj === undefined) {
                var utmsj_int = window.parseInt(0, 10);
            } else {
                var utmsj_int = window.parseInt(window.jQuery('div#userinfo a[href^="/mensajes"] strong.bubble').html(), 10);
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
        if (utnewquote == "si" || utnewquote == undefined) {
            window.jQuery(function() {
                if (is_dark == 0) {
                    window.jQuery("div.msg div.body").addClass("newquote");
                } else {
                    window.jQuery("div.msg div.body").addClass("newquoteblack");
                }
            });
        }
    });
    window.jQuery(function() {
        if (uttablamods == "si" || uttablamods == undefined) {
            window.jQuery(function() {
                if (window.jQuery('div#topnav a[href="/foro/"]').length > 0 && window.jQuery("div.live_info").length == 0) {
                    window.jQuery("div.smallcol, div.tinycol").append('<div class="box"><div id="modlist"><h3>Moderadores</h3></div></div>');
                    var url = window.location.pathname;
                    var id = url.split("/")[2];
                    window.mods = [ [ "nulo" ], [ "bazoo", "jadgix", "J40", "RaymaN", "TazzMaTazz" ], [ "Eristoff", "kalinka-" ], [ "aLeX", "Josekron", "Loa", "MegalomaniaC", "mongui", "Prava" ], [ "" ], [ "" ], [ "Atoll", "Bloody", "Eristoff", "Kails", "JMBaDBoY", "Prava", "PruDeN", "sacnoth" ], [ "abichuela", "AG", "alejo", "Ch4iNeR", "cm07", "Korso", "lb_nacho", "Netzach", "VipeR_CS" ], [ "" ], [ "Kaos", "PiradoIV" ], [ "TNx7", "tutitin" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "Kaneas", "TNx7" ], [ "" ], [ "" ], [ "Cryoned", "DuPonT" ], [ "darkavm", "ElKedao", "Privatovic", "ukuki" ], [ "" ], [ "" ], [ "Midgard", "StumKrav", "thunder_" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "Eristoff", "ReYzell" ], [ "Andy", "eisenfaust", "ISAILOVIC", "JMBaDBoY", "loko_man", "ruben132", "Sh1n0d4", "t0rrY" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "Hir0shz", "Ligia", "ManOwaR", "sPoiLeR" ], [ "" ], [ "ferk", "HaZuKi", "horvathzeros", "J40" ], [ "" ], [ "dangerous", "zashael" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "BigmAK", "MaSqUi", "tutitin", "XaViMeTaL" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "Cheester", "cuerpi", "darkavm", "sk_sk4t3r", "TNx7", "Txentx0" ], [ "spyro512" ], [ "" ], [ "" ], [ "" ], [ "GR33N" ], [ "" ], [ "" ], [ "Snorky", "spyro512" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "JMBaDBoY", "Sirius_spa", "suggus", "ZaGo" ], [ "granaino127", "SaBaNdIjA" ], [ "granaino127", "SaBaNdIjA" ], [ "darkavm", "GryF", "Kb", "lb_nacho", "-Power" ], [ "" ], [ "" ], [ "ElKedao", "darkavm", "dicon", "sk_sk4t3r" ], [ "" ], [ "" ], [ "" ], [ "Atoll", "ZaGo" ], [ "DeNz1L", "kaitoo", "NosFeR_" ], [ "Skelus" ], [ "darkavm", "Dolz", "Txentx0", "urrako" ], [ "babri", "dicon", "RoDRa", "Spank" ], [ "iosp", "Hogwarts", "lb_nacho" ], [ "zashael" ], [ "Charly-", "edvan", "frostttt", "Kazuya_", "zashael" ], [ "RaymaN", "sPoiLeR" ], [ "CsNarsil", "CybeR" ], [ "eisenfaust" ], [ "bazoo", "StumKrav", "thunder_" ], [ "DarkHawX", "Korso", "Netzach", "StumKrav" ], [ "benitogb", "BigmAK" ], [ "" ], [ "Andy", "ISAILOVIC", "JMBaDBoY", "loko_man", "ruben132", "Sh1n0d4", "t0rrY" ], [ "" ], [ "allmy", "naete", "slakk", "StumKrav", "thunder_" ], [ "gonya707", "TRON" ], [ "babri", "RoninPiros" ], [ "Bidroid", "MagicAnnii" ], [ "ChaRliFuM", "menolikeyou", "undimmer" ], [ "locof", "Pedrosa7", "Syuk" ], [ "" ], [ "alexander", "ferk", "horvathzeros", "J40" ], [ "" ], [ "" ], [ "cm07", "RoninPiros" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ], [ "" ] ];
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
            window.jQuery(function() {
                if (window.jQuery('a.boton[href^="/foro/post.php?f"]').length > 0) {
                    window.jQuery("div#userinfo strong.bar").clone().addClass("linksfooter2").each(function() {
                        if (is_dark || utlinksfooteroscuro == "si") {
                            window.jQuery(this).addClass("linksfooternegro").removeClass("bar").insertAfter("div.tfooter").prepend('<a href="/foro/">Foros</a> <a href="/foro/spy">Spy</a> |');
                        } else {
                            window.jQuery(this).addClass("linksfooterblanco").removeClass("bar").insertAfter("div.tfooter").prepend('<a href="/foro/">Foros</a> <a href="/foro/spy">Spy</a> |');
                            window.jQuery('.linksfooter2 a[href^="/id/"] img').attr("src", "http://www.mvusertools.com/ext/img/keko_bar.png");
                            window.jQuery('.linksfooter2 a[href^="/notificaciones"] img').attr("src", "http://www.mvusertools.com/ext/img/avisos_bar.png");
                            window.jQuery('.linksfooter2 a[href^="/foro/favoritos"] img').attr("src", "http://www.mvusertools.com/ext/img/fav_bar.png");
                            window.jQuery('.linksfooter2 a[href^="/mensajes"] img').attr("src", "http://www.mvusertools.com/ext/img/mail_bar.png");
                        }
                    });
                    window.jQuery(".linksfooter2 .separator").remove();
                    window.jQuery(".linksfooter2 #ut-menu").remove();
                    window.jQuery('.linksfooter2 a[href^="/id/"]').children("span").text("Perfil");
                    window.jQuery(function() {
                        if (utnoti != undefined) {
                            window.jQuery('.linksfooter2 a[href^="/foro/favoritos"] span.uextra').append(" (" + utnoti + ")");
                        }
                    });
                    window.jQuery('.linksfooter2 a[href^="/foro/favoritos"] strong.bubble').remove();
                    window.jQuery(function() {
                        if (utavisos != undefined) {
                            window.jQuery('.linksfooter2 a[href^="/notificaciones"] span.uextra').append(" (" + utavisos + ")");
                        }
                    });
                    window.jQuery('.linksfooter2 a[href^="/notificaciones"] strong.bubble').remove();
                    window.jQuery(function() {
                        if (utmsj != undefined) {
                            window.jQuery('.linksfooter2 a[href^="/mensajes"] span.uextra').append(" (" + utmsj + ")");
                        }
                    });
                    window.jQuery('.linksfooter2 a[href^="/mensajes"] strong.bubble').remove();
                } else {
                    window.jQuery("div#userinfo strong.bar").clone().addClass("linksfooter2").each(function() {
                        if (is_dark || utlinksfooteroscuro == "si") {
                            window.jQuery(this).addClass("linksfooternegro").removeClass("bar").insertAfter('form#postform[action="/foro/post_action.php"]').prepend('<a href="/foro/spy">Spy</a> |');
                        } else {
                            window.jQuery(this).addClass("linksfooterblanco").removeClass("bar").insertAfter('form#postform[action="/foro/post_action.php"]').prepend('<a href="/foro/spy">Spy</a> |');
                            window.jQuery('.linksfooter2 a[href^="/id/"] img').attr("src", "http://www.mvusertools.com/ext/img/keko_bar.png");
                            window.jQuery('.linksfooter2 a[href^="/notificaciones"] img').attr("src", "http://www.mvusertools.com/ext/img/avisos_bar.png");
                            window.jQuery('.linksfooter2 a[href^="/foro/favoritos"] img').attr("src", "http://www.mvusertools.com/ext/img/fav_bar.png");
                            window.jQuery('.linksfooter2 a[href^="/mensajes"] img').attr("src", "http://www.mvusertools.com/ext/img/mail_bar.png");
                        }
                    });
                    window.jQuery(".linksfooter2 .separator").remove();
                    window.jQuery(".linksfooter2 #ut-menu").remove();
                    window.jQuery('.linksfooter2 a[href^="/id/"]').children("span").text("Perfil");
                    window.jQuery(function() {
                        if (utnoti != undefined) {
                            window.jQuery('.linksfooter2 a[href^="/foro/favoritos"] span.uextra').append(" (" + utnoti + ")");
                        }
                    });
                    window.jQuery('.linksfooter2 a[href^="/foro/favoritos"] strong.bubble').remove();
                    window.jQuery(function() {
                        if (utavisos != undefined) {
                            window.jQuery('.linksfooter2 a[href^="/notificaciones"] span.uextra').append(" (" + utavisos + ")");
                        }
                    });
                    window.jQuery('.linksfooter2 a[href^="/notificaciones"] strong.bubble').remove();
                    window.jQuery(function() {
                        if (utmsj != undefined) {
                            window.jQuery('.linksfooter2 a[href^="/mensajes"] span.uextra').append(" (" + utmsj + ")");
                        }
                    });
                    window.jQuery('.linksfooter2 a[href^="/mensajes"] strong.bubble').remove();
                }
            });
        }
    });
    window.jQuery(function() {
        if (utmarcapaginas == "si" || utmarcapaginas == undefined) {
            window.jQuery("div.mark").attr("style", 'background-image: url("http://www.mvusertools.com/ext/img/marcapaginas2.png") !important; background-repeat: no-repeat !important; background-position: 100px top !important;');
        }
    });
    window.jQuery(function() {
        if (uticonosportada == "si" || uticonosportada == undefined) {
            window.jQuery('.bbar a[href^="/foro"]').each(function(i) {
                var enlace = this + "";
                var split = enlace.split("/");
                var path = split.splice(1, split.length - 1);
                var pathIndexToGet = 3;
                var foro = path[pathIndexToGet];
                var foroicon = "http://www.mediavida.com/style/img/icon/foro/" + foro + ".png";
                window.jQuery(this).html('<img style="vertical-align: middle; padding: 0 5px 0 0;" src="' + foroicon + '">');
            });
            window.jQuery(".item h4").each(function(index) {
                window.jQuery(this).prepend(window.jQuery('.bbar a[href^="/foro"]').eq(0));
            });
            window.jQuery("div.item div.bbar div.left:first-child").contents().filter(function() {
                return this.nodeType === 3;
            }).remove();
            window.jQuery("div.item div.bbar div.left:first-child").prepend("En ");
        }
    });
    window.jQuery(function() {
        if (uticonosdestacados == "si" || uticonosdestacados == undefined) {
            window.jQuery('ul.mini a[href^="/foro"]').each(function(i) {
                var enlace = this + "";
                var split = enlace.split("/");
                var path = split.splice(1, split.length - 1);
                var pathIndexToGet = 3;
                var foro = path[pathIndexToGet];
                var foroicon = "http://www.mediavida.com/style/img/icon/foro/" + foro + ".png";
                window.jQuery(this).closest("li").attr("style", "background-image: url(" + foroicon + ") !important; background-repeat: no-repeat !important; background-position: 5px center !important; padding: 10px 8px 10px 35px !important;");
            });
        }
    });
    window.jQuery('button[accesskey="b"]').hide();
    window.jQuery('<button class="alt bleft bb" accesskey="b" type="button" onclick="bbstyle(0)">b</button>').insertAfter('button[accesskey="b"]');
    window.jQuery('button[accesskey="i"]').hide();
    window.jQuery('<button class="alt bcenter bi" accesskey="i" type="button" onclick="bbstyle(2)">i</button><button class="alt bcenter2 bu" accesskey="u" type="button" onclick="bbstyle(4)">u</button><button id="ut-boton-s" class="alt bright bs" id = "button_x" accesskey="x" type="button">s</button><button class="alt bsolo" id="ut-boton-center" accesskey="c" type="button" title="[center]"><a class="sprite bcentericon"></a></button><button class="alt bsolo" id="ut-boton-list" type="button" title="[list] Usar * para cada elemento de la lista"><a class="blist sprite"></a></button>').insertAfter('button[accesskey="i"]');
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
    window.jQuery('<button class="alt bright" accesskey="n" type="button" onclick="bbstyle(18)">NSFW</button><button class="alt bsolo" id="ut-boton-bar" type="button">[bar]</button><button class="alt bsolo" type="button" onclick="bbstyle(20)">[code]</button><script></script>').insertAfter('button[accesskey="n"]');
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
    window.jQuery("#ut-boton-bar").click(function() {
        if (window.jQuery("textarea#cuerpo").getSelection().text.length > 0) {
            window.jQuery("textarea#cuerpo").replaceSelection("[bar]" + window.jQuery("textarea#cuerpo").getSelection().text + "[/bar]").setCaretPos();
        } else {
            window.jQuery("textarea#cuerpo").insertAtCaretPos("[bar][/bar]").setCaretPos(window.jQuery("textarea#cuerpo").getSelection().end - 5);
        }
    });
    window.jQuery(function() {
        if (utlivesdestacados == "si" || utfavicon == undefined) {
            window.jQuery('img[alt="live"]').closest("tr").addClass("ut-live");
        }
    });
    window.jQuery('div[class="autor"]:contains("Alien_crrpt")').children().children("dt").replaceWith('<dt><a href="/id/Alien_crrpt">Alien_derp</a></dt>');
    window.jQuery('div[class="autor"]:contains("Masme")').children().children("dt").replaceWith('<dt><a href="/id/Masme">Madme</a></dt>');
    window.jQuery('div[class="autor"]:contains("Ekisu")').children().children("dt").replaceWith('<dt><a href="/id/Ekisu">X-Crim</a></dt>');
    window.jQuery('div[class="autor"]:contains("X-Crim")').children().children("dd:first").replaceWith('<dd style="font-size: 10px">Mod de Mario Kart</dd>');
    window.jQuery(function() {
        if (utversion == undefined) {
            window.jQuery("div#footer div.f_info p").append('• Estás usando <a href="http://mvusertools.com" target="_blank">MV-Usertools</a>');
        } else {
            window.jQuery("div#footer div.f_info p").append('• Estás usando <a href="http://mvusertools.com" target="_blank">MV-Usertools</a> versión ' + utversion + "");
        }
    });
    window.jQuery("#scrollpages").append(balcklistToggle);
    if (window.localStorage.getItem("blacklist") == "on") {
        window.jQuery("#toggle").addClass("toggle-on");
        window.jQuery("#toggle").removeClass("toggle-off");
        window.console.log("encendido");
    } else {
        window.jQuery("#toggle").addClass("toggle-off");
        window.jQuery("#toggle").removeClass("toggle-on");
        window.console.log("apagado");
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