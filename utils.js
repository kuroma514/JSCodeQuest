// グローバルな名前空間を汚染しないように即時関数で囲む
(function (window) {
  'use strict';

  // --- タイプライターエフェクト関数 ---
  let typeWriterTimeoutId = null;
  function typeWriter(element, text, onComplete) {
    if (typeWriterTimeoutId) {
      clearTimeout(typeWriterTimeoutId);
    }
    element.innerHTML = "";
    let i = 0;
    const speed = 40;

    function type() {
      if (i < text.length) {
        if (text.charAt(i) === '<') {
          const endIndex = text.indexOf('>', i);
          element.innerHTML += text.substring(i, endIndex + 1);
          i = endIndex + 1;
        } else {
          element.innerHTML += text.charAt(i);
          i++;
        }
        typeWriterTimeoutId = setTimeout(type, speed);
      } else {
        if (onComplete) onComplete();
      }
    }
    type();
  }

  // --- ログ表示用のヘルパー関数 ---
  function logMessage(logElement, message, className = 'log-normal') {
    const p = document.createElement('p');
    p.textContent = message;
    p.className = className;
    logElement.prepend(p); // 新しいログを上に追加
  }

  // --- ボタン生成ヘルパー ---
  function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'btn';
    button.onclick = onClick;
    return button;
  }

  // グローバルに公開する関数をwindowオブジェクトに登録
  window.gameUtils = {
    typeWriter,
    logMessage,
    createButton
  };

})(window);