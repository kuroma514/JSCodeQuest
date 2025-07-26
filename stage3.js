(function (window) {
    'use strict';
  
    const { typeWriter, logMessage } = window.gameUtils;
  
    const stage3 = {
      enemy: {
        name: "魔法使い",
        shield: 25,
        power: 5,
        sprite: "images/wizard.png",
      },
      init: function ({ teacherMessage, enemySprite, enemyInfo, codeEditor }) {
        enemySprite.src = this.enemy.sprite;
        enemyInfo.textContent = `const enemy = {\n  name: "${this.enemy.name}",\n  shield: ${this.enemy.shield},\n  power: ${this.enemy.power}\n};`;
        const initialMessage = `今度の敵は「${this.enemy.name}」です！<br>
          強力な魔法の盾を持っており、その耐久力は <code class="answer-code">${this.enemy.shield} * ${this.enemy.power}</code> という計算で求められます。<br>
          コード入力欄でこの計算を行い、変数 <code class="answer-code">attack</code> に計算結果を代入して、盾を破壊してください！`;
        typeWriter(teacherMessage, initialMessage);
        codeEditor.value = `let attack = `;
      },
      validate: function (code) {
        const match = code.match(/let\s+attack\s*=\s*(.*?);/);
        if (!match) {
          return { isValid: false, message: 'コードの形が正しくないようです。`let attack = ...;` のように入力してください。' };
        }
        
        let attackValue;
        try {
          // 安全な方法でJavaScriptコードを評価
          attackValue = new Function(`return ${match[1]}`)();
        } catch (e) {
          return { isValid: false, message: '計算式が正しくないようです。もう一度確認してください。' };
        }
  
        const correctValue = this.enemy.shield * this.enemy.power;
        
        return {
          isValid: true,
          isSuccess: attackValue === correctValue,
          value: attackValue
        };
      },
      handleSuccess: function (result, { teacherMessage, battleLog }) {
        const stageIndex = Object.keys(window.stages).findIndex(
            key => window.stages[key] === this
        ) + 1; // ステージ番号を動的に取得

        logMessage(battleLog, `ステージ${stageIndex}: 魔法の盾に ${result.value} のダメージ！盾を破壊した！`, 'log-success');
        logMessage(battleLog, `${this.enemy.name}を倒した！`, 'log-success');
        const successMessage = `素晴らしい！算術演算子 <code class="answer-code">*</code> (乗算) を使って、見事に答えを導き出せましたね。<br>
          他にも <code class="answer-code">+</code> (加算)、<code class="answer-code">-</code> (減算)、<code class="answer-code">/</code> (除算) などがあります。色々試してみてくださいね！`;
        typeWriter(teacherMessage, successMessage);
      },
      handleFailure: function (result, { teacherMessage, battleLog }) {
        if (!result.isValid) {
          logMessage(battleLog, result.message, 'log-error');
          typeWriter(teacherMessage, result.message);
          return;
        }
        logMessage(battleLog, `攻撃力が ${result.value} では足りない！盾に防がれてしまった！`, 'log-error');
        typeWriter(teacherMessage, `残念！計算が間違っているようです。もう一度、敵の情報をよく見て計算してみましょう。`);
      },
      showAnswer: function ({ teacherMessage, battleLog }) {
        typeWriter(teacherMessage, `模範解答はこちらです。`);
        const answerHTML = `
          <div class="answer">
            <p><strong>【模範解答】</strong></p>
            <p>コード: <code class="answer-code">let attack = ${this.enemy.shield} * ${this.enemy.power};</code></p>
            <p><strong>【解説】</strong></p>
            <p>敵の盾の耐久力は ${this.enemy.shield} × ${this.enemy.power} で ${this.enemy.shield * this.enemy.power} です。<br>アスタリスク(<code class="answer-code">*</code>)は掛け算を意味する算術演算子です。</p>
          </div>`;
        battleLog.insertAdjacentHTML('afterbegin', answerHTML);
      }
    };
  
    window.stages[3] = stage3;
  
  })(window);
