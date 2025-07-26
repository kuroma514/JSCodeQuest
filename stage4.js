(function (window) {
    'use strict';
  
    const { typeWriter, logMessage } = window.gameUtils;

    const stage4 = {
      enemy: {
        name: "ミミック",
        isTrap: true,
        hp: 80,
        sprite: "images/mimic.png"
      },
      init: function ({ teacherMessage, enemySprite, enemyInfo, codeEditor }) {
        enemySprite.src = this.enemy.sprite;
        enemyInfo.textContent = `const box = {\n  isTrap: ${this.enemy.isTrap}\n};`;
        const initialMessage = `目の前に宝箱がある！ しかし、なんだか怪しい気配が...<br>
          箱の正体は <code class="answer-code">box.isTrap</code> を見ればわかります。これが <code class="answer-code">true</code> なら罠（ミミック）です。<br>
          <code class="answer-code">if</code>文を使って、もしミミックだったら変数 <code class="answer-code">action</code> に <code class="answer-code">'attack'</code> という文字列を代入して攻撃準備をしてください！`;
        typeWriter(teacherMessage, initialMessage);
        codeEditor.value = `let action = '';\nif (___) {\n  action = '___';\n}`;
      },
      validate: function (code) {
        // ユーザーのコードを実行してaction変数の値を取得
        let action = '';
        const box = { isTrap: this.enemy.isTrap };
        try {
          // 安全な実行コンテキストでコードを評価
          action = new Function('box', `${code}; return action;`)(box);
        } catch (e) {
          return { isValid: false, message: 'コードの構文にエラーがあるようです。' };
        }
  
        if (this.enemy.isTrap && action === 'attack') {
          return { isValid: true, isSuccess: true, value: action };
        } else {
          return { isValid: true, isSuccess: false, message: 'ミミックを見抜いて、actionに"attack"を代入してください。' };
        }
      },
      handleSuccess: function (result, { teacherMessage, battleLog }) {
        logMessage(battleLog, `罠だと見破り、攻撃を仕掛けた！`, 'log-normal');
        logMessage(battleLog, `${this.enemy.name}を倒した！`, 'log-success');
        const successMessage = `お見事です！<code class="answer-code">if</code>文による条件分岐をマスターしましたね。<br>
          <code class="answer-code">if (条件) { ... }</code> は、( )の中の条件が真(true)の時にだけ、{ }の中の処理を実行する、プログラミングの基本中の基本です。`;
        typeWriter(teacherMessage, successMessage);
      },
      handleFailure: function (result, { teacherMessage, battleLog }) {
         logMessage(battleLog, `ミミックの不意打ち！`, 'log-error');
         typeWriter(teacherMessage, result.message || `残念！<code class="answer-code">if</code>文の条件式や、中の処理が間違っているようです。`);
      },
      showAnswer: function ({ teacherMessage, battleLog }) {
        typeWriter(teacherMessage, `模範解答はこちらです。`);
        const answerHTML = `
          <div class="answer">
            <p><strong>【模範解答】</strong></p>
            <p>コード:</p>
            <pre><code>let action = '';\nif (box.isTrap) {\n  action = 'attack';\n}</code></pre>
            <p><strong>【解説】</strong></p>
            <p><code class="answer-code">box.isTrap</code> は <code class="answer-code">true</code> なので、if文の条件が満たされます。そのため、<code class="answer-code">{ }</code> の中の処理が実行され、変数 <code class="answer-code">action</code> に文字列 <code class="answer-code">'attack'</code> が代入されます。</p>
          </div>`;
        battleLog.insertAdjacentHTML('afterbegin', answerHTML);
      }
    };

    window.stages[4] = stage4;
  
  })(window);