// データ管理
let appData = {
    totalBalance: 0,
    initialValue: 0,
    lastMiningTime: null,
    history: []
};

// データを読み込み（メモリ内保存）
function loadData() {
    // 初回起動時の初期値設定
    if (appData.totalBalance === 0 && appData.history.length === 0) {
        showSettings();
    }
    updateDisplay();
}

// データを保存（メモリ内保存）
function saveData() {
    // メモリ内に保存済み（何もしない）
    console.log('データを保存しました（メモリ内）');
}

// 表示を更新
function updateDisplay() {
    document.getElementById('total-balance').textContent = `${appData.totalBalance.toFixed(5)} π`;
    // 初期値入力欄は空欄のまま（プレースホルダのみ表示）
    updateStatus();
    updateHistory();
}

// ステータスを更新
function updateStatus() {
    const button = document.getElementById('mining-button');
    const statusText = document.getElementById('status-text');
    
    // 常にマイニング可能
    button.disabled = false;
    statusText.textContent = 'マイニング可能';
}

// マイニング実行
function executeMining() {
    const amountInput = document.getElementById('mining-amount');
    const timeInput = document.getElementById('mining-time');
    
    const amount = parseFloat(amountInput.value);
    const time = timeInput.value;

    if (!amount || amount <= 0) {
        alert('有効なマイニング量を入力してください');
        return;
    }

    if (!time) {
        alert('マイニング開始時刻を入力してください');
        return;
    }

    // 24倍してπ単位で加算
    const earnedPi = amount * 24;
    appData.totalBalance += earnedPi;
    appData.lastMiningTime = time;

    // 履歴に追加
    appData.history.push({
        date: time,
        amount: amount,
        earned: earnedPi,
        total: appData.totalBalance
    });

    // 履歴を最大1000件に制限
    if (appData.history.length > 1000) {
        appData.history = appData.history.slice(-1000);
    }

    // データ保存
    saveData();

    // 表示更新
    updateDisplay();

    // 入力フィールドをクリア
    amountInput.value = '';
    timeInput.value = '';

    alert(`マイニング完了！\n獲得: ${earnedPi.toFixed(5)} π`);
}

// 履歴を更新
function updateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    if (appData.history.length === 0) {
        historyList.innerHTML = '<div class="status-text">履歴がありません</div>';
        return;
    }

    // 最新から表示
    const sortedHistory = [...appData.history].reverse();
    
    sortedHistory.forEach(record => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(record.date);
        const dateStr = date.toLocaleString('ja-JP');
        
        historyItem.innerHTML = `
            <div class="history-date">${dateStr}</div>
            <div class="history-value">獲得: ${record.earned.toFixed(5)} π</div>
            <div class="history-value">累計: ${record.total.toFixed(5)} π</div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// CSV出力
function exportCSV() {
    if (appData.history.length === 0) {
        alert('履歴がありません');
        return;
    }

    let csv = 'マイニング開始時刻,マイニング量(π)\n';
    
    appData.history.forEach(record => {
        const date = new Date(record.date);
        const dateStr = date.toLocaleString('ja-JP');
        csv += `"${dateStr}",${record.earned.toFixed(5)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pi_mining_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 初期値を保存
function saveInitialValue() {
    const initialValue = parseFloat(document.getElementById('initial-value').value) || 0;
    appData.initialValue = initialValue;
    
    // 総残高を初期値にリセット
    appData.totalBalance = initialValue;
    
    saveData();
    updateDisplay();
    alert('初期値を保存しました\n総残高がリセットされました');
}

// 画面切り替え
function showMain() {
    document.getElementById('main-screen').classList.remove('hidden');
    document.getElementById('history-screen').classList.add('hidden');
    document.getElementById('settings-screen').classList.add('hidden');
}

function showHistory() {
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('history-screen').classList.remove('hidden');
    document.getElementById('settings-screen').classList.add('hidden');
    updateHistory();
}

function showSettings() {
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('history-screen').classList.add('hidden');
    document.getElementById('settings-screen').classList.remove('hidden');
}

// イベントリスナー
document.getElementById('mining-button').addEventListener('click', executeMining);

// 現在時刻を設定
function setCurrentTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('mining-time').value = now.toISOString().slice(0, 16);
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setCurrentTime();
});
