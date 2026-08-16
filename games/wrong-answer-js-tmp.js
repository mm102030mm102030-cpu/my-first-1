      let questionsPool = [];
      let players = [];
      let targetScore = 10;
      let currentPlayerIndex = 0;
      
      // Turn variables
      let questionsThisTurn = 3;
      let currentQIndex = 0;
      let trapIndex = 0;
      
      let timerInterval = null;
      let audioCtx = null;

      // Tie Breaker variables
      let isTieBreaker = false;
      let tiedPlayers = [];
  
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
  
      function playBeep(freq, type, duration) {
        if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type; osc.frequency.value = freq;
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
        osc.stop(audioCtx.currentTime + duration);
      }
      
      function soundTick() { playBeep(800, 'sine', 0.1); }
      function soundUrgent() { playBeep(1200, 'square', 0.15); }
      function soundWin() { playBeep(600, 'sine', 0.1); setTimeout(()=>playBeep(800, 'sine', 0.3), 100); }
      function soundLose() { playBeep(200, 'sawtooth', 0.4); }
  
      function renderPlayerInputs() {
        const count = Math.max(2, parseInt(document.getElementById('players-count').value));
        const container = document.getElementById('players-names-container');
        container.innerHTML = '';
        for(let i=0; i<count; i++) {
          container.innerHTML += `<div class="input-group"><input type="text" class="input-field player-inp" placeholder="اسم اللاعب ${i+1}" required></div>`;
        }
      }
      renderPlayerInputs();
  
      function showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screen-'+id).classList.add('active');
        document.body.classList.remove('trap-mode');
      }
  
      function startGame() {
        const inputs = document.querySelectorAll('.player-inp');
        players = Array.from(inputs).map((inp, i) => ({ name: inp.value.trim() || `اللاعب ${i+1}`, score: 0, originalIndex: i }));
        targetScore = Math.max(1, parseInt(document.getElementById('target-score').value));
        
        questionsPool = [...ALL_QUESTIONS];
        shuffleArray(questionsPool);
        
        currentPlayerIndex = 0;
        isTieBreaker = false;
        tiedPlayers = [];
        preparePassScreen();
      }
  
      function preparePassScreen() {
        if (isTieBreaker) {
           document.getElementById('pass-msg').textContent = "مرحلة كسر التعادل!";
           document.getElementById('current-player-name').textContent = tiedPlayers.map(p => p.name).join(' و ');
        } else {
           document.getElementById('pass-msg').textContent = (currentPlayerIndex === 0 && Math.max(...players.map(p=>p.score)) === 0) ? "لنبدأ اللعب!" : "استعد!";
           document.getElementById('current-player-name').textContent = players[currentPlayerIndex].name;
        }
        showScreen('pass');
      }
  
      function nextPlayer() {
        if (!isTieBreaker) {
          currentPlayerIndex++;
          if (currentPlayerIndex >= players.length) {
            currentPlayerIndex = 0;
            // End of round: check for winners
            let maxScore = Math.max(...players.map(p => p.score));
            let topPlayers = players.filter(p => p.score === maxScore);
            
            if (maxScore >= targetScore) {
              if (topPlayers.length === 1) {
                document.getElementById('winner-name').textContent = topPlayers[0].name;
                showScreen('winner');
                return;
              } else {
                // Tie Breaker
                isTieBreaker = true;
                tiedPlayers = topPlayers;
                preparePassScreen();
                return;
              }
            }
          }
          preparePassScreen();
        } else {
          // End of a tie-breaker round
          let maxScore = Math.max(...tiedPlayers.map(p => p.score));
          let topPlayers = tiedPlayers.filter(p => p.score === maxScore);
          
          if (topPlayers.length === 1) {
             document.getElementById('winner-name').textContent = topPlayers[0].name;
             showScreen('winner');
             return;
          } else {
             tiedPlayers = topPlayers;
             preparePassScreen();
             return;
          }
        }
      }
  
      function startPlayerTurn() {
        currentQIndex = 0;
        trapIndex = Math.floor(Math.random() * questionsThisTurn);
        loadNextQuestion();
      }
  
      function loadNextQuestion() {
        if (currentQIndex >= questionsThisTurn) {
          showLeaderboard();
          return;
        }
        
        if (questionsPool.length === 0) {
          questionsPool = [...ALL_QUESTIONS];
          shuffleArray(questionsPool);
        }
        
        const q = questionsPool.pop();
        document.getElementById('question-text').textContent = q;
        
        const isTrap = (currentQIndex === trapIndex);
        if (isTrap) {
          document.body.classList.add('trap-mode');
          document.getElementById('instruction-text').textContent = "⚠️ تنبيه! جاوب صح ⚠️";
        } else {
          document.body.classList.remove('trap-mode');
          document.getElementById('instruction-text').textContent = "جاوب غلط!";
        }
        
        setupJudgingUI();
        
        showScreen('play');
        if(isTrap) document.body.classList.add('trap-mode'); // re-apply
        
        startTimer();
      }

      function setupJudgingUI() {
        const container = document.getElementById('judging-container');
        container.innerHTML = '';
        
        if (!isTieBreaker) {
           container.innerHTML = `
             <button class="btn success" style="flex:1; font-size:20px; padding:24px 10px;" onclick="judgeAnswer(true)">✅ نجح<br><span style="font-size:14px;font-weight:normal;">(جاوب المطلوب)</span></button>
             <button class="btn danger" style="flex:1; font-size:20px; padding:24px 10px;" onclick="judgeAnswer(false)">❌ فشل<br><span style="font-size:14px;font-weight:normal;">(تردد/أخطأ)</span></button>
           `;
        } else {
           let html = '<div style="display:flex; flex-wrap:wrap; gap:10px; width:100%; justify-content:center;">';
           tiedPlayers.forEach(p => {
             html += `<button class="btn success" style="flex:1 1 45%; font-size:18px; padding:15px 5px;" onclick="judgeTieBreaker(${p.originalIndex})">✅ ${p.name}</button>`;
           });
           html += `<button class="btn danger" style="flex:1 1 100%; font-size:18px; padding:15px 5px; margin-top:5px;" onclick="judgeTieBreaker(-1)">❌ لا أحد</button>`;
           html += '</div>';
           container.innerHTML = html;
        }
      }
  
      function startTimer() {
        clearInterval(timerInterval);
        let timeLeft = 5;
        const timerEl = document.getElementById('timer-text');
        timerEl.textContent = timeLeft;
        timerEl.classList.remove('urgent');
        timerEl.style.fontSize = "70px";
        
        if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if(audioCtx.state === 'suspended') audioCtx.resume();
        
        timerInterval = setInterval(() => {
          timeLeft--;
          timerEl.textContent = timeLeft;
          
          if (timeLeft <= 3 && timeLeft > 0) {
            timerEl.classList.add('urgent');
            soundUrgent();
          } else if (timeLeft > 3) {
            soundTick();
          }
          
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerEl.textContent = "انتهى الوقت!";
            timerEl.style.fontSize = "40px";
          }
        }, 1000);
      }
  
      function judgeAnswer(isSuccess) {
        clearInterval(timerInterval);
        if (isSuccess) {
          players[currentPlayerIndex].score++;
          soundWin();
        } else {
          soundLose();
        }
        
        currentQIndex++;
        setTimeout(loadNextQuestion, 500);
      }

      function judgeTieBreaker(playerIdx) {
        clearInterval(timerInterval);
        if (playerIdx !== -1) {
           let p = players.find(x => x.originalIndex === playerIdx);
           if (p) p.score++;
           soundWin();
        } else {
           soundLose();
        }
        
        currentQIndex++;
        setTimeout(loadNextQuestion, 500);
      }
  
      function showLeaderboard() {
        const sorted = [...players].sort((a,b) => b.score - a.score);
        const container = document.getElementById('lb-container');
        container.innerHTML = '';
        
        sorted.forEach((p, idx) => {
          let tieHighlight = '';
          if (isTieBreaker && tiedPlayers.find(x => x.originalIndex === p.originalIndex)) {
            tieHighlight = 'border: 2px solid var(--accent); background: rgba(239, 68, 68, 0.1);';
          }
          container.innerHTML += `
            <div class="lb-item ${idx === 0 && !isTieBreaker ? 'first' : ''}" style="${tieHighlight}">
              <div style="font-weight: 900; font-size: 20px; color: var(--primary); width: 30px;">#${idx+1}</div>
              <div class="lb-name">${p.name}</div>
              <div class="lb-score">${p.score}</div>
            </div>
          `;
        });
        showScreen('leaderboard');
      }
