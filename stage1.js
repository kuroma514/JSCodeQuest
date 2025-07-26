(function (window) {
  'use strict';

  // --- ユーティリティ関数のエイリアス ---
  const { typeWriter, logMessage } = window.gameUtils;

  const stage1 = {
    enemy: {
      name: "スライム",
      hp: 10,
      sprite: "images/slime.png"
    },
    init: function ({ teacherMessage, enemySprite, enemyInfo, codeEditor }) {
      enemySprite.src = this.enemy.sprite;
      enemyInfo.textContent = `const enemy = {\n  name: "${this.enemy.name}",\n  hp: ${this.enemy.hp}\n};`;
      const initialMessage = `プログラミングの基本、『変数宣言』に挑戦です！<br>
        <code class="answer-code">let</code> というキーワードを使い、好きな名前で「変数」を宣言してみましょう。<br>
        今回のステージでは、あなたが定義した変数は勇者の攻撃力として認識されます。<br>
        そして、その変数にスライムのHP(${this.enemy.hp})以上の攻撃力（数値）を代入すれば、クリアです！<br>
        例えば <code class="answer-code">let attack = 1;</code> のように書きます。'attack'の部分は好きな名前でOKですよ。<br>
        また、最後の行には必ずセミコロン <code class="answer-code">;</code> を忘れずに！`;
      typeWriter(teacherMessage, initialMessage);
      codeEditor.value = ``;
    },
    validate: function (code) {
      // letまたはconstで始まる、単一の変数宣言行を探す
      const declarations = code.match(/^(?:let|const)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*(.*?);$/m);

      if (!declarations) {
        return { isValid: false, message: 'コードの形が正しくないようです。`let a = 10;` のように入力してください。' };
      }
      
      const variableName = declarations[1];
      const valueString = declarations[2];
      const playerAttack = Number(valueString);

      if (isNaN(playerAttack)) {
        return { isValid: true, isSuccess: false, message: `「${valueString}」は数値ではありませんね。スライムを倒すには数値の攻撃力が必要です。` };
      }
      
      return {
        isValid: true,
        isSuccess: playerAttack >= this.enemy.hp,
        value: playerAttack,
        variableName: variableName
      };
    },
    handleSuccess: function (result, { teacherMessage, battleLog }) {
      logMessage(battleLog, `変数'${result.variableName}'に設定した攻撃力 ${result.value} で攻撃！`, 'log-normal');
      logMessage(battleLog, `${this.enemy.name}を倒した！`, 'log-success');
      const successMessage = `お見事です！<br>
        <code class="answer-code">let ${result.variableName} = ${result.value};</code> という形で、変数宣言ができましたね！<br>
        このように、<code class="answer-code">let</code>で宣言した変数には、後から別の値を入れることもできます。`;
      typeWriter(teacherMessage, successMessage);
    },
    handleFailure: function (result, { teacherMessage, battleLog, failureCount, error }) {
  // ★★★ 改善点: 構文エラーを最優先で表示 ★★★
  if (error) {
    logMessage(battleLog, `コードの実行でエラーが発生しました！`, 'log-error');
    typeWriter(teacherMessage, `おっと、コードに間違いがあるようです。<br><strong>エラー内容: ${error.message}</strong><br>もう一度確認してみてください。`);
    return;
  }

  if (!result.isValid) {
    logMessage(battleLog, 'コードの形が正しくないようです。', 'log-error');
    typeWriter(teacherMessage, result.message || `うーん、<code class="answer-code">let myPower = 10;</code> のような形で入力する必要がありそうです。`);
    return;
  }

  if(result.message){
    logMessage(battleLog, `攻撃に失敗した...`, 'log-error');
    typeWriter(teacherMessage, result.message);
    return;
  }

  logMessage(battleLog, `攻撃力が足りない！ ${this.enemy.name}はまだ元気だ。`, 'log-error');
  
  // ★★★ 改善点: 失敗回数に応じた段階的なヒントを表示 ★★★
  let failureMessage = `残念！ 敵を倒すには、HP(${this.enemy.hp})以上の攻撃力が必要なようです。<br>もう一度挑戦してみましょう。`;
  
  if (failureCount >= 2) {
    failureMessage += `<br><br>【ヒント💡】: 敵のHPは <code class="answer-code">${this.enemy.hp}</code> です。変数に代入する数値を変更してみましょう。`;
  }
  if (failureCount >= 4) {
      failureMessage += `<br>【さらにヒント💡】: 変数に代入する数値は <code class="answer-code">${this.enemy.hp}</code> 以上である必要があります。`;
  }
  
  typeWriter(teacherMessage, failureMessage);
},
    showAnswer: function ({ teacherMessage, battleLog }) {
      typeWriter(teacherMessage, `模範解答はこちらです。なぜこのコードでうまくいくのか、考えてみましょう！`);
      const answerHTML = `
        <div class="answer">
          <p><strong>【模範解答】</strong></p>
          <p>コード: <code class="answer-code">let playerAttack = 10;</code></p>
          <p><strong>【解説】</strong></p>
          <p>敵のHPは ${this.enemy.hp} です。そのため、<code class="answer-code">let</code>を使って変数を宣言し、${this.enemy.hp} 以上の数値を代入すると、敵を倒すことができます。変数名('playerAttack'の部分)は好きな名前で構いません。</p>
        </div>`;
      battleLog.insertAdjacentHTML('afterbegin', answerHTML);
    }
  };

  window.stages[1] = stage1;

})(window);