document.addEventListener('DOMContentLoaded', () => {
  // --- DOM要素の取得 ---
  const initialScreen = document.getElementById('initial-screen');
  const stageSelectScreen = document.getElementById('stage-select-screen');
  const gameContainer = document.getElementById('game-container');
  const stageButtons = document.getElementById('stage-buttons');
  const backToTitleButton = document.getElementById('back-to-title');
  const startButton = document.getElementById('start-button');
  const creditButton = document.getElementById('credit-button');
  const creditModal = document.getElementById('credit-modal');
  const closeButton = document.querySelector('.close-button');

  const teacherMessage = document.getElementById('teacher-message');
  const enemySprite = document.getElementById('enemy-sprite');
  const enemyInfo = document.getElementById('enemy-info');
  const codeEditor = document.getElementById('code-editor');
  const runButton = document.getElementById('run-button');
  const battleLog = document.getElementById('battle-log');
  const actionButtons = document.getElementById('action-buttons');
  const gameArea = gameContainer;

  // --- ゲームの状態管理 ---
  let currentStage = 1;
  window.stages = window.stages || {};

  // ★★★ 改善点: ゲームの状態(失敗回数など)を管理するオブジェクトを追加 ★★★
  const gameState = {
    failureCount: 0
  };

  // --- ユーティリティ関数のエイリアス ---
  const { typeWriter, logMessage, createButton } = window.gameUtils;

  // --- タイトル画面からステージ選択画面へ ---
  startButton.addEventListener('click', () => {
    initialScreen.classList.add('hidden');
    stageSelectScreen.classList.remove('hidden');
    populateStageButtons();
  });

  // --- ステージ選択画面からタイトル画面へ戻る ---
  backToTitleButton.addEventListener('click', () => {
    stageSelectScreen.classList.add('hidden');
    initialScreen.classList.remove('hidden');
  });

  // --- ステージ選択ボタンを生成 ---
  function populateStageButtons() {
    stageButtons.innerHTML = ''; // ステージボタンをクリア
    Object.keys(window.stages).forEach(stageNum => {
      const button = document.createElement('button');
      button.textContent = `ステージ ${stageNum}`;
      button.className = 'btn btn-primary';
      button.addEventListener('click', () => {
        currentStage = parseInt(stageNum, 10);
        stageSelectScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        initStage(currentStage);
      });
      stageButtons.appendChild(button);
    });
  }

  creditButton.addEventListener('click', () => {
    creditModal.style.display = 'block';
  });

  closeButton.addEventListener('click', () => {
    creditModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target == creditModal) {
      creditModal.style.display = 'none';
    }
  });


  // --- ゲームロジック ---
  function initStage(stageIndex) {
    const stage = window.stages[stageIndex];
    if (!stage) {
        typeWriter(teacherMessage, '全てのステージをクリアしました！おめでとうございます！');
        actionButtons.innerHTML = '';
        runButton.disabled = true;
        return;
    }

    // ステージ番号をログに表示
    logMessage(battleLog, `ステージ${stageIndex + 1}が始まった！`, 'log-system');

    // その他の初期化処理
    battleLog.innerHTML = '';
    actionButtons.innerHTML = '';
    runButton.disabled = false;
    enemySprite.style.opacity = '1';

    // ステージ固有の初期化処理を呼び出す
    stage.init({ teacherMessage, enemySprite, enemyInfo, codeEditor });
  }

  runButton.addEventListener('click', () => {
    const stage = window.stages[currentStage];
    if (!stage) return;

    gameArea.classList.add('shake');
    setTimeout(() => gameArea.classList.remove('shake'), 400);

    const code = codeEditor.value;
    
    // ★★★ 改善点: コード実行をtry...catchで囲み、構文エラーを捕捉する ★★★
    let result;
    let error = null;
    try {
      result = stage.validate(code);
    } catch (e) {
      error = e; // エラーオブジェクトを保持
      // エラーが発生した場合も、後続処理のためにresultオブジェクトを作成
      result = { isValid: false, isSuccess: false };
    }


    if (result && result.isValid) {
      logMessage(battleLog, `プレイヤーの攻撃！コードを実行しました...`, 'log-normal');
    }

    setTimeout(() => {
      // ★★★ 改善点: 成功/失敗の判定と、失敗回数の管理 ★★★
      if (result && result.isSuccess) {
        enemySprite.style.opacity = '0';
        runButton.disabled = true;
        stage.handleSuccess(result, { teacherMessage, battleLog });
        showNextStageButton();
      } else {
        gameState.failureCount++; // 失敗回数をインクリメント
        // handleFailureに失敗回数とエラー情報を渡す
        stage.handleFailure(result, { teacherMessage, battleLog, failureCount: gameState.failureCount, error });
        showActionButtons();
      }
    }, 500);
  });

  function showActionButtons() {
    actionButtons.innerHTML = '';
    const stage = window.stages[currentStage];
    const showAnswerButton = createButton('模範解答を見る', () => {
      stage.showAnswer({ teacherMessage, battleLog });
    });
    actionButtons.appendChild(showAnswerButton);
  }

  function showNextStageButton() {
    actionButtons.innerHTML = '';
    const nextButton = createButton('次のステージへ', () => {
      currentStage++;
      initStage(currentStage);
    });
    if (!window.stages[currentStage + 1]) {
      nextButton.textContent = '全クリ！';
      nextButton.onclick = () => {
        typeWriter(teacherMessage, '全てのステージをクリアしました！おめでとうございます！');
        actionButtons.innerHTML = '';
      };
    }
    actionButtons.appendChild(nextButton);
  }
});