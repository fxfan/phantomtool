
var EF = {

  // targetはquerySelectorで取得した生DOMであること。
  // jQueryオブジェクトはNG。
  replaceValue: function(target, value) {

    $target = jQuery(target);

    // 既存値の削除
    // バックスペースを入力するプリミティブな方法が不明だが、
    // jQueryのsendkeysプラグインで実現できる
    var currentValueLength = $target.val().length;
    var bsSequence = '';
    for (var i = 0; i < currentValueLength; i++) {
      bsSequence += '{Backspace}';
    }
    $target.sendkeys(bsSequence);

    // sendkeysによる入力では、GWTのイベントが発火せず、「ドラフトを保存」ボタンが有効にならない。
    // 生DOMに生イベントを送ったのちフォーカス解除することで「ドラフトを保存」ボタンが有効になる。
    var e = document.createEvent("TextEvent");
    e.initTextEvent('textInput', true, false, window, value, 0x09);

    target.focus();
    target.dispatchEvent(e);
    target.blur();
  },

  // 「ストアの掲載情報」ページにおいて、「ドラフトを保存」ボタンを有効にする。
  enableSaveDraftButton: function() {

    // 生TextEventでスペースを入力し（ここで「ドラフトを保存」ボタンが有効になる）、
    // sendkeysを使ってそのスペースを削除する。

    var e = document.createEvent("TextEvent");
    e.initTextEvent('textInput', true, false, window, ' ', 0x09);

    var target = document.querySelector('.gwt-TextBox');
    if (!target) {
      throw '.gwt-TextBox is not found.';
    }
    
    target.focus();
    target.dispatchEvent(e);
    target.blur();

    jQuery(target).sendkeys('{Backspace}');
  }

};
