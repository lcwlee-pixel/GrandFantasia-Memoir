const video = document.getElementById('intro-video');
const introScreen = document.getElementById('intro-screen');
const mainContent = document.getElementById('main-content');
const bgm = document.getElementById('bgm');
const bgmSource = document.getElementById('bgm-source');
const clickSfx = document.getElementById('click-sfx');
const settingsPanel = document.getElementById('settings-panel');
const volumeSlider = document.getElementById('volume-slider');

let introFinished = false;

if (bgm) bgm.volume = 0.3;
if (clickSfx) clickSfx.volume = 0.6;

// 統一播放點擊音效
function playClickSound() {
    if (clickSfx) {
        clickSfx.currentTime = 0;
        clickSfx.play().catch(err => console.log("SFX 播放攔截:", err));
    }
}

// 世代主題映射
const themeData = {
    '1': { bg: 'bg.png', music: 'bgm.mp3' },
    '2': { bg: 'bg1.png', music: 'bgm2.mp3' },
    '3': { bg: 'bg2.png', music: 'bgm3.mp3' }
};

function changeTheme(ver) {
    playClickSound();
    const currentData = themeData[ver];
    if (!currentData || !mainContent || !bgm || !bgmSource) return;

    mainContent.style.backgroundImage = `url('${currentData.bg}')`;

    const isPlaying = !bgm.paused;
    bgmSource.src = currentData.music;
    bgm.load();
    
    if (isPlaying || introFinished) {
        bgm.play().catch(err => console.log("BGM 播放攔截:", err));
    }
}

function toggleSettings(event) {
    if (event) event.stopPropagation();
    playClickSound();
    if (settingsPanel) {
        settingsPanel.style.display = (settingsPanel.style.display === 'flex') ? 'none' : 'flex';
    }
}

if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        if (bgm) bgm.volume = e.target.value;
    });
}

// 全局點擊監聽音效與面板收起
document.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON' || 
        event.target.tagName === 'INPUT' || 
        event.target.tagName === 'SELECT' || 
        event.target.classList.contains('checkbox-label') ||
        event.target.classList.contains('menu-card') ||
        event.target.classList.contains('tree-item')) {
        playClickSound();
    }

    if (introFinished && bgm && bgm.paused) {
        bgm.play().catch(err => console.log("等待交互播放音樂: ", err));
    }
    
    if (settingsPanel && settingsPanel.style.display === 'flex' && 
        !settingsPanel.contains(event.target) && 
        !event.target.classList.contains('settings-btn')) {
        settingsPanel.style.display = 'none';
    }
});

// 跳過動畫核心邏輯
function finishIntro(event) {
    if (event) event.stopPropagation();
    if (introFinished) return;
    introFinished = true;
    playClickSound();

    if (introScreen) {
        introScreen.style.opacity = '0';
    }
    
    if (bgm && bgm.paused) {
        bgm.play().catch(err => console.log("自動播放被攔截: ", err));
    }

    setTimeout(() => {
        if (introScreen) introScreen.style.display = 'none';
        if (mainContent) mainContent.style.opacity = '1';
    }, 1000);
}

// 绑定视频结束和点击全屏跳过
if (video) {
    video.addEventListener('ended', finishIntro);
}

if (introScreen) {
    introScreen.addEventListener('click', finishIntro);
}

// 界面切換邏輯
function handleLogin() {
    playClickSound();
    const loginSec = document.getElementById('login-section');
    const mainPage = document.getElementById('main-page');

    if (loginSec && mainPage) {
        loginSec.style.opacity = '0';
        setTimeout(() => {
            loginSec.style.display = 'none';
            mainPage.style.display = 'flex';
            setTimeout(() => { mainPage.style.opacity = '1'; }, 50);
        }, 500);
    }
}

function handleLogout() {
    playClickSound();
    const loginSec = document.getElementById('login-section');
    const mainPage = document.getElementById('main-page');

    if (loginSec && mainPage) {
        mainPage.style.opacity = '0';
        setTimeout(() => {
            mainPage.style.display = 'none';
            loginSec.style.display = 'flex';
            setTimeout(() => { loginSec.style.opacity = '1'; }, 50);
        }, 500);
    }
}

function openWeaponPage() {
    playClickSound();
    const mainPage = document.getElementById('main-page');
    const weaponPage = document.getElementById('weapon-page');
    if (mainPage && weaponPage) {
        mainPage.style.display = 'none';
        weaponPage.style.display = 'flex';
    }
}

function closeWeaponPage() {
    playClickSound();
    const mainPage = document.getElementById('main-page');
    const weaponPage = document.getElementById('weapon-page');
    if (mainPage && weaponPage) {
        weaponPage.style.display = 'none';
        mainPage.style.display = 'flex';
    }
}

function toggleTree(id) {
    playClickSound();
    const tree = document.getElementById(id);
    if (!tree) return;
    const icon = tree.previousElementSibling.querySelector('.tree-icon');
    if (tree.style.display === 'none') {
        tree.style.display = 'block';
        if (icon) icon.textContent = '-';
    } else {
        tree.style.display = 'none';
        if (icon) icon.textContent = '+';
    }
}

// 原汁原味《精靈樂章》武器數據庫（已綁定圖片檔名）
const weaponDB = {
    'sword_evil': {
        name: '邪殺劍',
        nameColor: '#ff8000',
        type: '單手劍',
        atk: 315,
        speed: '1.5',
        stats: [
            { label: '體質', val: '+3' },
            { label: '敏捷', val: '+6' }
        ],
        blueEffects: ['+2點命中機率', '+1.5 %爆擊機率'],
        greenEffects: [],
        durability: '116 / 116 (116)',
        level: 18,
        classes: '射手/忍衛/刺客/秘謀/御庭/影者/獨行/夜叉/暗殺/皇家/修羅/闇影/潛影/羅剎',
        skill: '武器重擊',
        successRate: '100%',
        mats: [
            { name: '精靈的精鑄鐵劍', amount: '0/1' },
            { name: '靈化結晶', amount: '0/2' },
            { name: '秘銀果實的殼', amount: '0/2' }
        ],
        gold: 0, silver: 6, copper: 75, time: '10秒',
        img: 'weapon/邪殺劍.png',
        thumb: 'weapon/source/邪殺劍.png' // 👈 新增縮圖路徑
    },

    'sword_eye': {
        name: '巨劍·信念之眼',
        nameColor: '#ff8000',
        type: '雙手劍',
        atk: 717,
        speed: '2.1',
        stats: [
            { label: '力量', val: '+7' },
            { label: '敏捷', val: '+11' }
        ],
        blueEffects: [],
        greenEffects: ['攻擊時有30%機率發動武器能力', '能力：提升20%命中機率持續10秒'],
        durability: '136 / 136 (136)',
        level: 20,
        classes: '戰士/忍衛/狂戰/聖騎/遊俠/秘謀/御庭/魔門/天騎/秘獵/獨行/夜叉/烈門/聖殿/狙擊/皇家/修羅/狂炎/榮耀/幻影/潛影/羅剎',
        skill: '武器重擊',
        successRate: '100%',
        mats: [
            { name: '精靈的沉重巨劍', amount: '0/1' },
            { name: '靈化結晶', amount: '0/2' },
            { name: '秘銀果實的殼', amount: '0/2' }
        ],
        gold: 0, silver: 8, copper: 50, time: '10秒',
        img: 'weapon/巨劍·信念之眼.png',
        thumb: 'weapon/source/巨劍·信念之眼.png' // 👈 新增縮圖路徑
    },

    'sword_dawn': {
        name: '晨曦之劍',
        nameColor: '#ff8000',
        type: '單手劍',
        atk: 305,
        speed: '1.5',
        stats: [
            { label: '力量', val: '+3' },
            { label: '體質', val: '+3' },
            { label: '敏捷', val: '+3' }
        ],
        blueEffects: [],
        greenEffects: ['攻擊時有15%機率產生第2次傷害'],
        durability: '116 / 116 (116)',
        level: 18,
        classes: '戰士/射手/忍衛/狂戰/聖騎/遊俠/刺客/秘謀/御庭/魔門/天騎/秘獵/影者/獨行/夜叉/烈門/聖殿/狙擊/暗殺/皇家/修羅/狂炎/榮耀/幻影/闇影/潛影/羅剎',
        skill: '武器重擊',
        successRate: '100%',
        mats: [
            { name: '精靈的精鑄鐵劍', amount: '0/1' },
            { name: '靈化結晶', amount: '0/2' },
            { name: '秘銀果實的殼', amount: '0/2' }
        ],
        gold: 0, silver: 6, copper: 75, time: '10秒',
        img: 'weapon/晨曦之劍.png',
        thumb: 'weapon/source/晨曦之劍.png' // 👈 新增縮圖路徑
    }
};

function selectWeapon(key) {
    playClickSound();
    const item = weaponDB[key];
    if (!item) return;

    const statsBox = document.getElementById('weapon-stats-box');
    const matsBox = document.getElementById('weapon-mats-box');

    if (statsBox) {
        const statsHtml = item.stats.map(s => `<div style="color: #ffffff;">${s.label} ${s.val}</div>`).join('');
        const blueHtml = item.blueEffects.map(b => `<div style="color: #00ffff;">${b}</div>`).join('');
        const greenHtml = item.greenEffects.map(g => `<div style="color: #80ff00;">${g}</div>`).join('');
const thumbHtml = item.thumb 
            ? `<div class="gf-item-thumb-box"><img src="${item.thumb}" alt="${item.name}"></div>` 
            : '';

        statsBox.innerHTML = `
            <div class="gf-tooltip-content">
                ${thumbHtml}
                <div style="color: ${item.nameColor}; font-weight: bold; font-size: 13px;">${item.name}</div>
                <div style="color: #ffffff;">裝備綁定</div>
                <div style="color: #ffffff;">${item.type}</div>
                <div style="color: #ffffff;">攻擊 +${item.atk}</div>
                <div style="color: #ffffff;">速度 ${item.speed}</div>
                ${statsHtml}
                ${blueHtml}
                ${greenHtml}
                <div style="color: #ffffff;">耐久度 ${item.durability}</div>
                <div style="color: #ffffff;">等級需求 ${item.level}</div>
                <div style="color: #ffffff; font-size: 11px; line-height: 1.35; margin: 4px 0;">${item.classes}</div>
                <div style="color: #ffffff;">裝備唯一</div>
                <div style="color: #80ff00;">附帶精靈技能:${item.skill}</div>
                <div style="color: #ffffff; margin-top: 6px;">當製作成功後，將隨機附加額外屬性或能力</div>
                <div style="color: #ffffff;">此物品可以收藏</div>
            </div>
        `;
    }

    if (matsBox) {
        matsBox.innerHTML = `
            <div style="color: #ffff00; text-align: right; margin-bottom: 6px; font-weight: bold;">成功機率 : ${item.successRate}</div>
            ${item.mats.map(m => `
                <div style="display: flex; justify-content: space-between; color: #ffffff; margin-bottom: 4px;">
                    <span>• ${m.name}</span>
                    <span style="font-weight: bold;">${m.amount}</span>
                </div>
            `).join('')}
        `;
    }

    const cGold = document.getElementById('c-gold');
    const cSilver = document.getElementById('c-silver');
    const cCopper = document.getElementById('c-copper');
    const cTime = document.getElementById('c-time');

    if (cGold) cGold.textContent = item.gold;
    if (cSilver) cSilver.textContent = item.silver;
    if (cCopper) cCopper.textContent = item.copper;
    if (cTime) cTime.textContent = item.time;

    // 切換右欄武器圖片與隱藏預設提示文字
    const imgEl = document.getElementById('weapon-preview-img');
    const placeholderEl = document.getElementById('image-placeholder');
    if (imgEl && item.img) {
        imgEl.src = item.img;
        imgEl.style.display = 'block';
        if (placeholderEl) placeholderEl.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (video) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => console.log("Video autoplay caught."));
        }
    }
});
// ==========================================
// 14 大武器分類目錄結構（圖示路徑已指向 weapon/ 資料夾）
// ==========================================
const categoryDB = {
    'sword': {
        title: '劍類製造',
        icon: 'weapon/sword.png',
        groups: [
            {
                id: 'onehand-sword',
                name: '單手劍',
                items: [
                    { key: 'sword_evil', name: '邪殺劍', color: '#ff8000' },
                    { key: 'sword_dawn', name: '晨曦之劍', color: '#ff8000' }
                ]
            },
            {
                id: 'twohand-sword',
                name: '雙手劍',
                items: [
                    { key: 'sword_eye', name: '巨劍·信念之眼', color: '#ff8000' }
                ]
            }
        ]
    },
    'mac': {
        title: '巨劍製造',
        icon: 'weapon/mac.png',
        groups: [
            { id: 'heavy-sword', name: '雙手巨劍', items: [] }
        ]
    },
    'axe': {
        title: '斧類製造',
        icon: 'weapon/axe.png',
        groups: [
            { id: 'onehand-axe', name: '單手斧', items: [] },
            { id: 'twohand-axe', name: '雙手斧', items: [] }
        ]
    },
    'hammer': {
        title: '槌類製造',
        icon: 'weapon/hammer.png',
        groups: [
            { id: 'onehand-hammer', name: '單手槌', items: [] },
            { id: 'twohand-hammer', name: '雙手槌', items: [] }
        ]
    },
    'bow': {
        title: '弓箭製造',
        icon: 'weapon/bow.png',
        groups: [
            { id: 'longbow', name: '長弓 / 戰弓', items: [] }
        ]
    },
    'firearm': {
        title: '火槍製造',
        icon: 'weapon/firearm.png',
        groups: [
            { id: 'gun', name: '火槍 / 狙擊槍', items: [] }
        ]
    },
    'staff': {
        title: '法杖製造',
        icon: 'weapon/staff.png',
        groups: [
            { id: 'onehand-staff', name: '單手法杖', items: [] },
            { id: 'twohand-staff', name: '雙手法杖', items: [] }
        ]
    },
    'sheild': {
        title: '盾牌製造',
        icon: 'weapon/sheild.png',
        groups: [
            { id: 'shield-list', name: '守護盾牌', items: [] }
        ]
    },
    'scythe': {
        title: '鐮刀製造',
        icon: 'weapon/scythe.png',
        groups: [
            { id: 'scythe-list', name: '死神鐮刀', items: [] }
        ]
    },
    'katana': {
        title: '太刀製造',
        icon: 'weapon/katana.png',
        groups: [
            { id: 'katana-list', name: '太刀 / 武士刀', items: [] }
        ]
    },
    'handblade': {
        title: '拳刃製造',
        icon: 'weapon/handblade.png',
        groups: [
            { id: 'handblade-list', name: '拳刃 / 指虎', items: [] }
        ]
    },
    'ninja': {
        title: '忍具製造',
        icon: 'weapon/ninja.png',
        groups: [
            { id: 'ninja-list', name: '手裡劍 / 忍具', items: [] }
        ]
    },
    'maccanon': {
        title: '魔導砲製造',
        icon: 'weapon/maccanon.png',
        groups: [
            { id: 'cannon-list', name: '重型魔導砲', items: [] }
        ]
    },
    'key': {
        title: '魔鑰製造',
        icon: 'weapon/key.png',
        groups: [
            { id: 'key-list', name: '星靈魔鑰', items: [] }
        ]
    }
};

// 切換武器分類按鈕
function switchCategory(catKey, btnElement) {
    playClickSound();
    const catData = categoryDB[catKey];
    if (!catData) return;

    if (btnElement) {
        document.querySelectorAll('.cat-tab-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }

    const iconEl = document.getElementById('current-cat-icon');
    const titleEl = document.getElementById('current-cat-title');
    if (iconEl) iconEl.src = catData.icon;
    if (titleEl) titleEl.textContent = catData.title;

    const container = document.getElementById('weapon-tree-container');
    if (!container) return;

    container.innerHTML = catData.groups.map((group, index) => {
        const itemsHtml = group.items.length > 0
            ? group.items.map(item => `
                <div class="tree-item" onclick="selectWeapon('${item.key}')" style="color: ${item.color}; font-weight: bold;">
                    └ ${item.name}
                </div>
            `).join('')
            : `<div style="color: #9e917e; font-size: 12px; padding: 3px 0;">└ (尚未收錄武器資料)</div>`;

        return `
            <div class="tree-node" onclick="toggleTree('${group.id}')" style="${index > 0 ? 'margin-top: 6px;' : ''}">
                <span class="tree-icon">-</span> ${group.name}
            </div>
            <div id="${group.id}" class="tree-sub">
                ${itemsHtml}
            </div>
        `;
    }).join('');
}

// 頁面載入完成後預設顯示劍類清單
switchCategory('sword', null);