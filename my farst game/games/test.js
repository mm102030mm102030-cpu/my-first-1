
    // Confirmation before exit
    function confirmExit() {
      if(confirm('هل أنت متأكد من خروجك من اللعبة؟ سيتم فقدان التقدم الحالي.')) {
        window.location.href = '../index.html';
      }
    }

    // ============================
    // DATABASE
    // ============================
    const DB = {
      "أفلام": [
        "الأسد الملك", "تيتانيك", "أفاتار", "الجوكر", "سبايدرمان", "باتمان", "عمر المختار", "الماتريكس", "فيلم الرسالة", "المنتقمون",
        "هاري بوتر", "قراصنة الكاريبي", "فروزن", "الحديقة الجوراسية", "سيد الخواتم", "حرب النجوم", "شريك", "نيمو", "شركة المرعبين المحدودة",
        "ابن حميدو", "عريس من جهة أمنية", "الناظر", "همام في أمستردام", "صعيدي في الجامعة الأمريكية", "الجزيرة", "ولاد رزق"
      ],
      "مسلسلات": [
        "صراع العروش", "مرايا", "باب الحارة", "طاش ما طاش", "شباب البومب", "ضيعة ضايعة", "لعبة الحبار", "البروفيسور", "بريزون بريك",
        "فريندز", "عمر بن الخطاب", "الهيبة", "العاصوف", "سيلفي", "طريق", "خمسة ونص", "للموت", "وينزداي", "سترينجر ثينغز", "فايكنجز"
      ],
      "أمثال شعبية": [
        "عصفور في اليد خير من عشرة على الشجرة", "اللي ما يعرف الصقر يشويه", "الطول طول نخلة والعقل عقل سخلة", "الباب اللي يجيك منه الريح سده واستريح",
        "ضربني وبكى سبقني واشتكى", "يا جبل ما يهزك ريح", "على قد لحافك مد رجليك", "القرد في عين أمه غزال", "الطيور على أشكالها تقع",
        "من حفر حفرة لأخيه وقع فيها", "الصديق وقت الضيق", "الوقت كالسيف إن لم تقطعه قطعك", "أعط الخباز خبزه ولو أكل نصفه", "كل فتاة بأبيها معجبة"
      ],
      "أغاني": [
        "الأماكن", "يا طيب القلب", "يا مسهرني", "أنت عمري", "مقادير", "يا حبيبي لا تروح", "أنا الشاكي", "بنت أكابر", "تملي معاك", "يا هلالي",
        "بشرة خير", "ديسباسيتو", "شكل للبيع", "أهواك", "حبيبي يا نور العين", "يا غايب", "يا بتاع النعناع", "ساعات ساعات", "ألف ليلة وليلة"
      ],
      "مدن ودول": [
        "الرياض", "القاهرة", "دبي", "باريس", "لندن", "نيويورك", "طوكيو", "بغداد", "دمشق", "عمان", "القدس", "مدريد", "برلين",
        "روما", "مكة المكرمة", "المدينة المنورة", "جدة", "الإسكندرية", "الكويت", "الدوحة", "المنامة", "مسقط", "بيروت", "الجزائر", "الرباط"
      ],
      "أشياء وأدوات": [
        "مكنسة", "تلفزيون", "ميكروويف", "غسالة", "ثلاجة", "مكواة", "كمبيوتر", "ساعة يد", "نظارة شمسية", "قلم رصاص", "دفتر",
        "فرشاة أسنان", "مشط", "مقص", "مطرقة", "مفك", "سيارة", "طائرة", "دراجة", "كرسي", "طاولة", "سرير", "وسادة", "سجادة"
      ],
      "شخصيات عامة": [
        "كريستيانو رونالدو", "ليونيل ميسي", "مايكل جاكسون", "ألبرت أينشتاين", "ستيف جوبز", "بيل غيتس", "محمد صلاح",
        "مايك تايسون", "محمد علي كلاي", "أحمد الشقيري", "نجيب محفوظ", "ويليام شكسبير", "نيوتن", "شارلي شابلن", "مارلين مونرو"
      ],
      "مهن": [
        "طبيب", "مهندس", "معلم", "محامي", "طيار", "نجار", "حداد", "سباك", "طباخ", "حلاق", "شرطي", "إطفائي",
        "مزارع", "خباز", "خياط", "جزار", "صياد", "رسام", "مغني", "ممثل", "رائد فضاء", "مراسل صحفي", "قاضي", "محاسب"
      ],
      "حيوانات": [
        "أسد", "فيل", "زرافة", "نمر", "قرد", "دب", "تمساح", "ثعبان", "حصان", "كلب", "قطة", "فأر", "عصفور", "حمامة",
        "نسر", "صقر", "نعامة", "بطريق", "قرش", "حوت", "دولفين", "سلحفاة", "ضفدع", "نحلة", "فراشة", "عنكبوت", "عقرب"
      ]
    };

    let categories = Object.keys(DB);
    let selectedCategories = new Set(categories); // default all
    let activeWords = [];
    
    // Setup UI
    const catGrid = document.getElementById('category-grid');
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'cat-btn selected';
      btn.textContent = cat;
      btn.onclick = () => {
        if(selectedCategories.has(cat)) {
          selectedCategories.delete(cat);
          btn.classList.remove('selected');
        } else {
          selectedCategories.add(cat);
          btn.classList.add('selected');
        }
      };
      catGrid.appendChild(btn);
    });

    // ============================
    // GAME LOGIC
    // ============================
    let team1 = { name: "", score: 0 };
    let team2 = { name: "", score: 0 };
    let currentTeam = 1; // 1 or 2
    
    let currentWord = "";
    let currentCat = "";
    
    let mainTimer;
    let stealTimer;
    let mainTimeLeft = 120;
    let stealTimeLeft = 30;

    const sfxDing = document.getElementById('sfx-ding');
    const sfxTick = document.getElementById('sfx-tick');
    const sfxBuzzer = document.getElementById('sfx-buzzer');
    const sfxSiren = document.getElementById('sfx-siren');

    function updateScoreBoards() {
      const html = \`
        <div class="team-score" \${currentTeam===1 ? 'style="border-color:#6366f1;"':''}>
          <div class="team-name">\${team1.name}</div>
          <div class="team-pts">\${team1.score}</div>
        </div>
        <div class="team-score" \${currentTeam===2 ? 'style="border-color:#6366f1;"':''}>
          <div class="team-name">\${team2.name}</div>
          <div class="team-pts">\${team2.score}</div>
        </div>
      \`;
      document.getElementById('sb-turn').innerHTML = html;
      document.getElementById('sb-play').innerHTML = html;
    }

    function showScreen(id) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById('screen-' + id).classList.add('active');
    }

    function startGame() {
      team1.name = document.getElementById('team1-name').value || "فريق أ";
      team2.name = document.getElementById('team2-name').value || "فريق ب";
      
      if(selectedCategories.size === 0) {
        alert("يجب اختيار فئة واحدة على الأقل!");
        return;
      }
      
      // Build word list
      activeWords = [];
      selectedCategories.forEach(cat => {
        DB[cat].forEach(word => activeWords.push({word, cat}));
      });
      
      // Add custom words
      const customTxt = document.getElementById('custom-words').value;
      if(customTxt.trim()) {
        const words = customTxt.split(',').map(s => s.trim()).filter(s => s);
        words.forEach(w => activeWords.push({word: w, cat: "كلمة مخصصة"}));
      }
      
      // Shuffle
      activeWords.sort(() => Math.random() - 0.5);
      
      nextTurn();
    }

    function nextTurn() {
      // Check win condition
      if(team1.score >= 5 || team2.score >= 5) {
        document.getElementById('winner-name').textContent = team1.score >= 5 ? team1.name : team2.name;
        showScreen('winner');
        return;
      }
    
      if(activeWords.length === 0) {
        alert("انتهت الكلمات! تعادل!");
        return;
      }
      
      const item = activeWords.pop();
      currentWord = item.word;
      currentCat = item.cat;
      
      document.getElementById('turn-title').textContent = \`دور \${currentTeam === 1 ? team1.name : team2.name}\`;
      document.getElementById('secret-word').textContent = currentWord;
      document.getElementById('secret-cat').textContent = "الفئة: " + currentCat;
      
      hideWord(); // ensure hidden
      updateScoreBoards();
      showScreen('turn');
    }

    // Reveal Logic
    function revealWord() {
      document.getElementById('reveal-inst').style.display = 'none';
      document.getElementById('secret-word').style.display = 'block';
      document.getElementById('secret-cat').style.display = 'block';
    }
    function hideWord() {
      document.getElementById('reveal-inst').style.display = 'block';
      document.getElementById('secret-word').style.display = 'none';
      document.getElementById('secret-cat').style.display = 'none';
    }

    function startPlayPhase() {
      document.getElementById('play-team-name').textContent = \`\${currentTeam === 1 ? team1.name : team2.name} يمثل الآن!\`;
      mainTimeLeft = 120;
      updateMainTimerUI();
      
      document.getElementById('main-timer').classList.remove('danger');
      sfxTick.pause();
      sfxTick.currentTime = 0;
      
      showScreen('play');
      
      clearInterval(mainTimer);
      mainTimer = setInterval(() => {
        mainTimeLeft--;
        updateMainTimerUI();
        
        if(mainTimeLeft === 10) {
          document.getElementById('main-timer').classList.add('danger');
          sfxTick.play().catch(e=>console.log(e));
        }
        
        if(mainTimeLeft <= 0) {
          clearInterval(mainTimer);
          sfxTick.pause();
          sfxBuzzer.play().catch(e=>console.log(e));
          startStealPhase();
        }
      }, 1000);
    }

    function updateMainTimerUI() {
      const m = Math.floor(mainTimeLeft / 60).toString().padStart(2, '0');
      const s = (mainTimeLeft % 60).toString().padStart(2, '0');
      document.getElementById('main-timer').textContent = \`\${m}:\${s}\`;
    }

    function surrender() {
      clearInterval(mainTimer);
      sfxTick.pause();
      startStealPhase();
    }

    function startStealPhase() {
      sfxSiren.play().catch(e=>console.log(e));
      const oppTeam = currentTeam === 1 ? team2.name : team1.name;
      document.getElementById('steal-team-name').textContent = \`لـ \${oppTeam}\`;
      
      stealTimeLeft = 30;
      document.getElementById('steal-timer').textContent = stealTimeLeft;
      
      showScreen('steal');
      
      clearInterval(stealTimer);
      stealTimer = setInterval(() => {
        stealTimeLeft--;
        document.getElementById('steal-timer').textContent = stealTimeLeft;
        if(stealTimeLeft <= 0) {
          clearInterval(stealTimer);
          sfxBuzzer.play().catch(e=>console.log(e));
          wrongSteal();
        }
      }, 1000);
    }

    function correctAnswer(isSteal = false) {
      clearInterval(mainTimer);
      clearInterval(stealTimer);
      sfxTick.pause();
      sfxSiren.pause();
      sfxDing.play().catch(e=>console.log(e));
      
      if(isSteal) {
        // opposite team gets point
        if(currentTeam === 1) team2.score++; else team1.score++;
      } else {
        // current team gets point
        if(currentTeam === 1) team1.score++; else team2.score++;
      }
      
      // switch turn
      currentTeam = currentTeam === 1 ? 2 : 1;
      nextTurn();
    }

    function wrongSteal() {
      clearInterval(stealTimer);
      sfxSiren.pause();
      
      // nobody gets points, switch turn
      currentTeam = currentTeam === 1 ? 2 : 1;
      nextTurn();
    }

  