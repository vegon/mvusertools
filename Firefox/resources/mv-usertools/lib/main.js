var data = require("self").data;
var pageMod = require("page-mod");
pageMod.PageMod({
  include: "*.mediavida.com",
  contentScriptWhen: 'end',
  contentScriptFile: [data.url("jquery-1.8.2.min.js"),
                      data.url("tinycon.min.js"),
                      data.url("mvusertools.user.js")]
});