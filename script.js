let timerInterval;
let currentTime;
let isRunning = false;
let currentCycle = 0;  // 当前循环次数
let isWorkTime = true; // 是否在工作时间

// 初始化设置
let settings = {
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    repeatCount: 4,
    longBreakInterval: 4
};

// 切换到下一个状态
function switchToNextState() {
    clearInterval(timerInterval);  // 清除当前计时器
    
    if (isWorkTime) {
        // 工作时间结束，判断是否需要长休息
        isWorkTime = false;
        currentCycle++;
        
        if (currentCycle % settings.longBreakInterval === 0) {
            // 进入长休息
            currentTime = settings.longBreakTime * 60;
            document.querySelector('.status').textContent = '长休息';
        } else {
            // 进入短休息
            currentTime = settings.shortBreakTime * 60;
            document.querySelector('.status').textContent = '短休息';
        }
    } else {
        // 休息结束，回到工作时间
        isWorkTime = true;
        currentTime = settings.workTime * 60;
        document.querySelector('.status').textContent = '工作时间';
    }
    
    // 更新显示并直接开始新的计时
    updateTimerDisplay();
    
    // 直接开始新的计时，不需要等待按钮点击
    timerInterval = setInterval(() => {
        if (currentTime > 0) {
            currentTime--;
            updateTimerDisplay();
        } else {
            switchToNextState();
        }
    }, 1000);
}

// 开始计时
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (currentTime > 0) {
                currentTime--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                switchToNextState();
            }
        }, 1000);
    }
}

// 暂停计时
function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

// 重置计时器
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isWorkTime = true;
    currentCycle = 0;
    currentTime = settings.workTime * 60;
    document.querySelector('.status').textContent = '工作时间';
    updateTimerDisplay();
    document.getElementById('toggleButton').checked = false;
}

// 更新计时器显示
function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    document.querySelector('.timer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 切换按钮事件
document.getElementById('toggleButton').addEventListener('change', function() {
    if (this.checked) {
        startTimer();
    } else {
        pauseTimer();
    }
});

// 应用设置按钮点击事件
document.getElementById('applySettings').addEventListener('click', function() {
    const newSettings = {
        workTime: parseInt(document.getElementById('workTime').value) || 25,
        shortBreakTime: parseInt(document.getElementById('shortBreakTime').value) || 5,
        longBreakTime: parseInt(document.getElementById('longBreakTime').value) || 15,
        repeatCount: parseInt(document.getElementById('repeatCount').value) || 4,
        longBreakInterval: parseInt(document.getElementById('longBreakInterval').value) || 4
    };
    
    settings = newSettings;
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    resetTimer();
    document.getElementById('checkbox').checked = false;
});

// 页面加载时读取设置
window.addEventListener('load', function() {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
        document.getElementById('workTime').value = settings.workTime;
        document.getElementById('shortBreakTime').value = settings.shortBreakTime;
        document.getElementById('longBreakTime').value = settings.longBreakTime;
        document.getElementById('repeatCount').value = settings.repeatCount;
        document.getElementById('longBreakInterval').value = settings.longBreakInterval;
    }
    resetTimer();
});

