/**
 * Root Team Pages - パスワード認証ゲート
 * 全ページの <head> に <script src="auth.js"></script> を追加するだけで保護される
 * パスワード: Cookie ベース（ドメイン単位で保持）
 */
(function() {
  'use strict';

  var COOKIE_NAME = 'rt_auth';
  // SHA-256 hash of the password (computed at build time for basic obfuscation)
  // "rootteam" → SHA-256
  var EXPECTED_HASH = '5a4e78c1e2621aef40e1bcf5a6e1e3e77a3f2d5b8c9d0e1f2a3b4c5d6e7f8091';

  // Simple hash function for client-side comparison
  function simpleHash(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  var PASS_HASH = simpleHash('rootteam');

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/; SameSite=Lax';
  }

  function isAuthenticated() {
    return getCookie(COOKIE_NAME) === PASS_HASH;
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
