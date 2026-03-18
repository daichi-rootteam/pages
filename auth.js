/**
 * Root Team Pages - パスワード認証ゲート
 * 全ページの <head> に <script src="auth.js"></script> を追加するだけで保護される
 * パスワード: Cookie ベース（ドメイン単位で保持）
 * ※ ハッシュ値のみ保持。平文パスワードはコードに含まれない。
 */
(function() {
  'use strict';

  var COOKIE_NAME = 'rt_auth';
  // SHA-256 hash (事前計算済み)
  var EXPECTED_HASH = 'f665bc0f02f7650b45c517c4d4eb703a516af81587aeb83f4184502bf4f19999';

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function isAuthenticated() {
    return getCookie(COOKIE_NAME) === EXPECTED_HASH;
  }

  function isLoginPage() {
    return window.location.pathname.indexOf('login.html') !== -1;
  }

  // ログインページでは認証チェックしない
  if (isLoginPage()) return;

  // 認証済みならそのまま表示
  if (isAuthenticated()) return;

  // 未認証 → ログインページへリダイレクト
  var currentUrl = encodeURIComponent(window.location.href);
  var basePath = (function() {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.indexOf('auth.js') !== -1) {
        return scripts[i].src.replace('auth.js', '');
      }
    }
    return '/pages/';
  })();
  window.location.replace(basePath + 'login.html?redirect=' + currentUrl);
})();
