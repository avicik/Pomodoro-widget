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
            document.querySelector('.container').classList.add('break-time');
        } else {
            // 进入短休息
            currentTime = settings.shortBreakTime * 60;
            document.querySelector('.status').textContent = '短休息';
            document.querySelector('.container').classList.add('break-time');
        }
    } else {
        // 休息结束，回到工作时间
        isWorkTime = true;
        currentTime = settings.workTime * 60;
        document.querySelector('.status').textContent = '工作时间';
        document.querySelector('.container').classList.remove('break-time');
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
    
    // 重置背景高度为 100%
    document.querySelector('.background-layer').style.height = '100%';
}

// 开始计时
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        // 显示动画效果
        document.querySelector('.background-layer').style.display = 'block';
        document.querySelector('.wave-container').style.display = 'block';
        timerInterval = setInterval(() => {
            if (currentTime > 0) {
                currentTime--;
                updateTimerDisplay();
            } else {
                switchToNextState();
            }
        }, 1000);
    }
}

// 暂停计时
function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    // 隐藏所有动画效果
    document.querySelector('.background-layer').style.display = 'none';
    document.querySelector('.wave-container').style.display = 'none';
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
    // 隐藏动画效果
    document.querySelector('.background-layer').style.display = 'none';
    document.querySelector('.wave-container').style.display = 'none';
}

// 更新计时器显示和背景动画
function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    document.querySelector('.timer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // 计算并更新背景高度
    const totalTime = isWorkTime ? settings.workTime * 60 : 
        (currentCycle % settings.longBreakInterval === 0 ? settings.longBreakTime * 60 : settings.shortBreakTime * 60);
    const percentage = (currentTime / totalTime) * 100;
    const height = `${percentage}%`;
    
    // 同时更新背景和波浪容器的位置
    const backgroundLayer = document.querySelector('.background-layer');
    const waveContainer = document.querySelector('.wave-container');
    
    backgroundLayer.style.height = height;
    waveContainer.style.bottom = height;  // 波浪容器跟随背景高度
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

