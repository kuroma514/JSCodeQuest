(function (window) {
  'use strict';

  // --- ユーティリティ関数のエイリアス ---
  const { typeWriter, logMessage } = window.gameUtils;

  const stage2 = {
    enemy: {
      name: "ゴーレム",
      weakPoint: "炎",
      hp: 20,
      sprite: "images/golem.png"
    },
    init: function ({ teacherMessage, enemySprite, enemyInfo, codeEditor }) {
      enemySprite.src = this.enemy.sprite;
      enemyInfo.textContent = `const enemy = {\n  name: "${this.enemy.name}",\n  weakPoint: "${this.enemy.weakPoint}",\n  hp: ${this.enemy.hp}\n};`;
      const initialMessage = `今度の敵は「${this.enemy.name}」です。物理攻撃は効きません！<br>
        <code class="answer-code">const</code> を使って、好きな名前で「定数」を宣言し、弱点属性である「${this.enemy.weakPoint}」という文字列を代入してください。<br>
        文字列は <code class="answer-code">' '</code> または <code class="answer-code">" "</code> で囲むのを忘れずに。例: <code class="answer-code">const zokusei = 'water';</code>`;
      typeWriter(teacherMessage, initialMessage);
      codeEditor.value = ``;
    },
    validate: function (code) {
      // letまたはconstで始まる、単一の変数宣言行を探す
      const declarations = code.match(/^(?:let|const)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*(.*?);$/m);

      if (!declarations) {
        return { isValid: false, message: 'コードの形が正しくないようです。`const type = \'炎\';` のように入力してください。' };
      }
      
      const variableName = declarations[1];
      const valueString = declarations[2];

      // 値が文字列リテラル（''または""で囲まれているか）をチェック
      const stringMatch = valueString.match(/^['"](.*?)['"]$/);
      if(!stringMatch){
        return { isValid: true, isSuccess: false, message: `ゴーレムの弱点は「文字列」です。値を ' や " で囲んでください。` };
      }

      const attribute = stringMatch[1];
      const attack = 10; // 基本攻撃力
      const isWeak = attribute === this.enemy.weakPoint;
      // 弱点属性ならダメージ2倍、そうでなければ通常ダメージ
      const damage = isWeak ? attack * 2 : attack;
      // ダメージが敵のHP以上なら成功
      const isSuccess = damage >= this.enemy.hp;

      return {
        isValid: true,
        isSuccess,
        value: { attack, attribute, damage, variableName },
        type: 'attribute'
      };
    },
    handleSuccess: function (result, { teacherMessage, battleLog }) {
      logMessage(battleLog, `定数'${result.value.variableName}'に設定した「${result.value.attribute}」属性で攻撃した！`, 'log-normal');
      logMessage(battleLog, `ダメージは ${result.value.damage}！効果は抜群だ！${this.enemy.name}を倒した！`, 'log-success');
      const successMessage = `やりましたね！<br>
        <code class="answer-code">const</code> で宣言した定数は、後から変更できないという特徴があります。変わらない値を入れるのに便利です。`;
      typeWriter(teacherMessage, successMessage);
    },
handleFailure: function (result, { teacherMessage, battleLog, failureCount, error }) {
    if (error) {
        logMessage(battleLog, `コード実行エラー！`, 'log-error');
        typeWriter(teacherMessage, `コードの形に間違いがあるようです。<br><strong>エラー: ${error.message}</strong>`);
        return;
    }
    
    if (result.message) {
        logMessage(battleLog, `攻撃に失敗した...`, 'log-error');
        typeWriter(teacherMessage, result.message);
        return;
    }
    
    if (result.isValid && !result.isSuccess) {
        logMessage(battleLog, `「${result.value.attribute}」属性では効果が薄い！`, 'log-error');
        let failureMessage = `残念！${this.enemy.name}の弱点は「${this.enemy.weakPoint}」です。<br>弱点属性で攻撃すると大ダメージを与えられます。`;

        if(failureCount >= 2) {
            failureMessage += `<br><br>【ヒント💡】: 弱点属性は文字列の <code class="answer-code">'${this.enemy.weakPoint}'</code> です。`;
        }
        if(failureCount >= 4) {
            failureMessage += `<br>【さらにヒント💡】: 文字列は一字一句正確に、<code class="answer-code">' '</code> で囲んでくださいね。`;
        }
        typeWriter(teacherMessage, failureMessage);
    } else {
        logMessage(battleLog, '攻撃に失敗した...', 'log-error');
        typeWriter(teacherMessage, result.message || '何かがおかしいようです。もう一度試してください。');
    }
},
    showAnswer: function ({ teacherMessage, battleLog }) {
      typeWriter(teacherMessage, `模範解答はこちらです。なぜこのコードでうまくいくのか、考えてみましょう！`);
      const answerHTML = `
        <div class="answer">
          <p><strong>【模範解答】</strong></p>
          <p>コード: <code class="answer-code">const playerAttribute = '炎';</code></p>
          <p><strong>【解説】</strong></p>
          <p>ゴーレムの弱点は文字列の「${this.enemy.weakPoint}」です。<code class="answer-code">const</code>で定数を宣言し、弱点属性を代入することで倒せます。定数名('playerAttribute'の部分)は好きな名前で構いません。</p>
        </div>`;
      battleLog.insertAdjacentHTML('afterbegin', answerHTML);
    }
  };

  window.stages[2] = stage2;

})(window);