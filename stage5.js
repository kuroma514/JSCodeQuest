(function (window) {
    'use strict';
  
    const { typeWriter, logMessage } = window.gameUtils;

    const stage5 = {
      enemy: {
        name: "巨大ドラゴン",
        hp: 9999,
        magicKey: "draco",
        sprite: "images/dragon.png"
      },
      init: function ({ teacherMessage, enemySprite, enemyInfo, codeEditor }) {
        enemySprite.src = this.enemy.sprite;
        enemyInfo.textContent = `const dragon = {\n  name: "${this.enemy.name}",\n  hp: ${this.enemy.hp}\n};`;
        const initialMessage = `ついに最終ステージ！「${this.enemy.name}」が立ちはだかる！<br>
          この敵を倒すには、伝説の呪文(関数) <code class="answer-code">megaFlare</code> を使うしかありません。<br>
          この関数は、正しい<code class="answer-code">詠唱キー</code>を引数として渡さないと発動しません。<br>
          コードエディタに定義済みの <code class="answer-code">megaFlare</code> 関数を、詠唱キー <code class="answer-code">'${this.enemy.magicKey}'</code> を使って呼び出し、戻り値を変数 <code class="answer-code">damage</code> に代入してください。`;
        typeWriter(teacherMessage, initialMessage);
        codeEditor.value = `// 伝説の呪文（この関数は編集しないでください）\nfunction megaFlare(key) {\n  if (key === '${this.enemy.magicKey}') {\n    return ${this.enemy.hp};\n  }\n  return 0;\n}\n\n// ↓↓↓ ここに呪文を呼び出すコードを書こう！ ↓↓↓\nlet damage = ;`;
      },
      validate: function (code) {
        let damage = 0;
        try {
          // ユーザーコードと事前定義関数を合わせて評価
          damage = new Function(`${code}; return damage;`)();
        } catch(e) {
          return { isValid: false, message: 'コードの構文にエラーがあるようです。' };
        }
  
        if (damage === this.enemy.hp) {
          return { isValid: true, isSuccess: true, value: damage };
        } else {
          return { isValid: true, isSuccess: false, message: `呪文が発動しなかった...。詠唱キーが違うか、関数の呼び出し方が間違っているようです。` };
        }
      },
      handleSuccess: function (result, { teacherMessage, battleLog }) {
        logMessage(battleLog, `メガフレア！！ ${result.value} の超絶ダメージ！`, 'log-success');
        logMessage(battleLog, `${this.enemy.name}を倒した！`, 'log-success');
        const successMessage = `おめでとうございます！全てのステージをクリアしました！<br>
          関数を正しく呼び出し、その結果(戻り値)を変数に代入することができましたね。<br>
          これであなたもJavaScriptマスターへの第一歩を踏み出しました！`;
        typeWriter(teacherMessage, successMessage);
      },
      handleFailure: function (result, { teacherMessage, battleLog }) {
         logMessage(battleLog, `呪文は不発に終わった...`, 'log-error');
         typeWriter(teacherMessage, result.message || `残念！もう一度挑戦しましょう。`);
      },
      showAnswer: function ({ teacherMessage, battleLog }) {
        typeWriter(teacherMessage, `模範解答はこちらです。`);
        const answerHTML = `
          <div class="answer">
            <p><strong>【模範解答】</strong></p>
            <p>コード:</p>
            <pre><code>let damage = megaFlare('${this.enemy.magicKey}');</code></pre>
            <p><strong>【解説】</strong></p>
            <p><code class="answer-code">megaFlare('${this.enemy.magicKey}')</code> と記述することで、<code class="answer-code">megaFlare</code>関数を文字列<code class="answer-code">'${this.enemy.magicKey}'</code>を引数として呼び出します。関数は<code class="answer-code">${this.enemy.hp}</code>を返し、それが変数<code class="answer-code">damage</code>に代入されます。</p>
          </div>`;
        battleLog.insertAdjacentHTML('afterbegin', answerHTML);
      }
    };

    window.stages[5] = stage5;
  
  })(window);