/* global WeixinApi */
var T = (function() {

  var T = {};
  var HOST = [location.protocol, "//", location.host].join("");

  T.showMsg = function(msg, share, ok) {
    var tmpl = '' +
      '<div id="msg"><div class="box">' +
      '<div class="hd">提示</div>' +
      '<div class="bd"></div>' +
      '<div class="ft">' +
      '<a class="btn-ok" href="javascript:;">确定</a>' +
      '<a class="btn-share" href="javascript:;">分享</a>' +
      '</div></div></div>';
    var $msg = $("#msg");
    if (!$msg.length) {
      $(document.body).append(tmpl);
      $msg = $("#msg");
    }
    var $box = $msg.find(".box");
    $box.find(".bd").html(msg);
    $msg.show();
    $box.css({
      marginLeft: $box.width() / -2,
      marginTop: $box.height() / -2
    });
    // callback
    $msg.off("click", ".btn-share").one("click", ".btn-share", function() {
      $msg.hide();
      share && share();
    }).off("click", ".btn-ok").one("click", ".btn-ok", function() {
      $msg.hide();
      ok && ok();
    });
  };

  T.showTips = function(tips, timeout) {
    var tmpl = '<div id="tips"><i class="icon-arrow"></i><p></p><a class="btn-close">×</a></div>';
    var $tips = $("#tips");
    if (!$tips.length) {
      $(document.body).append(tmpl);
      $tips = $("#tips");
    }
    $tips.find("p").html(tips);
    if (!$tips.data("inited")) {
      $tips.data("inited", !0).on("click", ".btn-close", function() {
        $tips.hide();
      });
    }
    timeout && setTimeout(function() {
      $tips.hide();
    }, timeout);
    $tips.show();
  };

  T.showTipsMsg = function(msg, timeout) {
    var tmpl = '<div id="tip_message"></div>';
    var $msg = $("#tip_message");
    if (!$msg.length) {
      $(document.body).append(tmpl);
      $msg = $("#tip_message");
    }
    $msg = $msg[0];
    $msg.innerText = msg;
    $msg.style.visibility = 'visible';
    timeout && setTimeout(function() {
      $msg.style.visibility = 'hidden';
    }, timeout);
  };

  T.shareData = {
    "imgUrl": HOST + $("img.share").eq(0).attr("src"),
    "title": document.title,
    "link": location.href,
    "desc": ""
  };

  T.share = function() {

    var shareTo = ["shareToFriend", "shareToTimeline", "shareToWeibo", "generalShare"];

    WeixinApi.ready(function(Api) {
      shareTo.forEach(function(method) {
        Api[method] && Api[method](T.shareData, {
          confirm: function(resp) { }
        });
      });
    });
  };

  return T;

})();
