/* =========================================================
   WRITING TIME — COMPLETE JAVASCRIPT
   ========================================================= */

   "use strict";


   /* =========================================================
      STORAGE
      ========================================================= */
   
   const STORAGE_KEY = "writingTimeAppData_v2";
   
   
   const defaultData = {
       paragraph: "",
   
       settings: {
           targetSpeed: 68,
           readingSpeed: 200,
           autoSave: true,
           autoTimer: false,
           speechRate: 1,
           extraDelay: 0
       },
   
       theme: "light",
   
       goal: {
           type: "words",
           target: 500
       },
   
       history: [],
   
       timer: {
           elapsed: 0
       }
   };
   
   
   let appData = loadData();
   
   
   function loadData() {
   
       try {
   
           const saved = localStorage.getItem(STORAGE_KEY);
   
           if (!saved) {
               return structuredClone(defaultData);
           }
   
           const parsed = JSON.parse(saved);
   
           return {
               ...structuredClone(defaultData),
               ...parsed,
   
               settings: {
                   ...defaultData.settings,
                   ...(parsed.settings || {})
               },
   
               goal: {
                   ...defaultData.goal,
                   ...(parsed.goal || {})
               },
   
               timer: {
                   ...defaultData.timer,
                   ...(parsed.timer || {})
               },
   
               history: Array.isArray(parsed.history)
                   ? parsed.history
                   : []
   
           };
   
       } catch (error) {
   
           console.error(
               "Could not load saved data:",
               error
           );
   
           return structuredClone(defaultData);
       }
   }
   
   
   function saveData() {
   
       try {
   
           localStorage.setItem(
               STORAGE_KEY,
               JSON.stringify(appData)
           );
   
       } catch (error) {
   
           console.error(
               "Could not save data:",
               error
           );
       }
   }
   
   
   /* =========================================================
      ELEMENTS
      ========================================================= */
   
   const paragraph =
       document.getElementById("paragraph");
   
   const calculateBtn =
       document.getElementById("calculateBtn");
   
   const clearBtn =
       document.getElementById("clearBtn");
   
   const charPreview =
       document.getElementById("charPreview");
   
   const liveStatus =
       document.getElementById("liveStatus");
   
   
   /* Statistics */
   
   const wordsEl =
       document.getElementById("words");
   
   const lettersEl =
       document.getElementById("letters");
   
   const numbersEl =
       document.getElementById("numbers");
   
   const charactersEl =
       document.getElementById("characters");
   
   const spacesEl =
       document.getElementById("spaces");
   
   const punctuationEl =
       document.getElementById("punctuation");
   
   const sentencesEl =
       document.getElementById("sentences");
   
   const paragraphsEl =
       document.getElementById("paragraphs");
   
   
   /* Speed */
   
   const cpmEl =
       document.getElementById("cpm");
   
   const wpmEl =
       document.getElementById("wpm");
   
   const speedDifferenceEl =
       document.getElementById("speedDifference");
   
   const targetSpeedEl =
       document.getElementById("targetSpeed");
   
   
   /* Time */
   
   const estimatedTimeEl =
       document.getElementById("estimatedTime");
   
   const actualTimeEl =
       document.getElementById("actualTime");
   
   const timeDifferenceEl =
       document.getElementById("timeDifference");
   
   const differenceLabelEl =
       document.getElementById("differenceLabel");
   
   
   /* Timer */
   
   const stopwatchEl =
       document.getElementById("stopwatch");
   
   const startTimerBtn =
       document.getElementById("startTimer");
   
   const pauseTimerBtn =
       document.getElementById("pauseTimer");
   
   const resetTimerBtn =
       document.getElementById("resetTimer");
   
   
   /* Reading */
   
   const readingTimeEl =
       document.getElementById("readingTime");
   
   
   /* Analysis */
   
   const averageWordLengthEl =
       document.getElementById("averageWordLength");
   
   const averageSentenceLengthEl =
       document.getElementById("averageSentenceLength");
   
   const longestWordEl =
       document.getElementById("longestWord");
   
   const uniqueWordsEl =
       document.getElementById("uniqueWords");
   
   const longestSentenceEl =
       document.getElementById("longestSentence");
   
   const shortestSentenceEl =
       document.getElementById("shortestSentence");
   
   const readabilityEl =
       document.getElementById("readability");
   
   const repeatedWordsEl =
       document.getElementById("repeatedWords");
   
   const wordFrequencyEl =
       document.getElementById("wordFrequency");
   
   
   /* Goal */
   
   const goalTypeEl =
       document.getElementById("goalType");
   
   const goalTargetEl =
       document.getElementById("goalTarget");
   
   const setGoalBtn =
       document.getElementById("setGoalBtn");
   
   const goalProgressTextEl =
       document.getElementById("goalProgressText");
   
   const goalPercentageEl =
       document.getElementById("goalPercentage");
   
   const goalProgressBarEl =
       document.getElementById("goalProgressBar");
   
   const goalStatusEl =
       document.getElementById("goalStatus");
   
   
   /* Score */
   
   const sessionScoreEl =
       document.getElementById("sessionScore");
   
   const speedScoreEl =
       document.getElementById("speedScore");
   
   const goalScoreEl =
       document.getElementById("goalScore");
   
   const consistencyScoreEl =
       document.getElementById("consistencyScore");
   
   const scoreMessageEl =
       document.getElementById("scoreMessage");
   
   
   /* Dictation */
   
   const dictationStatusEl =
       document.getElementById("dictationStatus");
   
   const dictationCurrentWordEl =
       document.getElementById("dictationCurrentWord");
   
   const dictationCountdownEl =
       document.getElementById("dictationCountdown");
   
   const dictationWordNumberEl =
       document.getElementById("dictationWordNumber");
   
   const dictationTotalWordsEl =
       document.getElementById("dictationTotalWords");
   
   const dictationCharacterCountEl =
       document.getElementById("dictationCharacterCount");
   
   const dictationWritingTimeEl =
       document.getElementById("dictationWritingTime");
   
   const dictationSpeedEl =
       document.getElementById("dictationSpeed");
   
   const dictationProgressTextEl =
       document.getElementById("dictationProgressText");
   
   const dictationProgressBarEl =
       document.getElementById("dictationProgressBar");
   
   const startDictationBtn =
       document.getElementById("startDictation");
   
   const pauseDictationBtn =
       document.getElementById("pauseDictation");
   
   const stopDictationBtn =
       document.getElementById("stopDictation");
   
   const resetDictationBtn =
       document.getElementById("resetDictation");
   
   const dictationSpeechRateEl =
       document.getElementById("dictationSpeechRate");
   
   const dictationSpeechRateValueEl =
       document.getElementById("dictationSpeechRateValue");
   
   const dictationExtraDelayEl =
       document.getElementById("dictationExtraDelay");
   
   
   /* Performance */
   
   const performanceChart =
       document.getElementById("performanceChart");
   
   
   /* History */
   
   const historyListEl =
       document.getElementById("historyList");
   
   const historyEmptyEl =
       document.getElementById("historyEmpty");
   
   const clearHistoryBtn =
       document.getElementById("clearHistoryBtn");
   
   
   /* Settings */
   
   const themeToggle =
       document.getElementById("themeToggle");
   
   const speedInput =
       document.getElementById("speedInput");
   
   const readingSpeedInput =
       document.getElementById("readingSpeedInput");
   
   const autoSaveToggle =
       document.getElementById("autoSaveToggle");
   
   const autoTimerToggle =
       document.getElementById("autoTimerToggle");
   
   const clearSavedDataBtn =
       document.getElementById("clearSavedDataBtn");
   
   
   /* =========================================================
      TIMER STATE
      ========================================================= */
   
   let timerRunning = false;
   let timerStartTime = 0;
   let timerInterval = null;
   
   let elapsedMilliseconds =
       Number(appData.timer.elapsed || 0);
   
   
   /* =========================================================
      DICTATION STATE
      ========================================================= */
   
   let dictationWords = [];
   
   let dictationIndex = 0;
   
   let dictationRunning = false;
   
   let dictationPaused = false;
   
   let dictationTimeout = null;
   
   let dictationCountdownInterval = null;
   
   let dictationRemainingMilliseconds = 0;
   
   
   /* =========================================================
      HELPERS
      ========================================================= */
   
   function cloneDefaultData() {
   
       return JSON.parse(
           JSON.stringify(defaultData)
       );
   }
   
   
   function formatTime(totalSeconds) {
   
       totalSeconds =
           Math.max(0, Math.floor(totalSeconds));
   
       const minutes =
           Math.floor(totalSeconds / 60);
   
       const seconds =
           totalSeconds % 60;
   
       return (
           minutes +
           ":" +
           String(seconds).padStart(2, "0")
       );
   }
   
   
   function formatMilliseconds(milliseconds) {
   
       const seconds =
           Math.max(0, milliseconds) / 1000;
   
       return (
           Math.floor(seconds) +
           "." +
           String(
               Math.floor(
                   milliseconds % 1000
               )
           ).padStart(3, "0").slice(0, 2) +
           "s"
       );
   }
   
   
   function getWords(text) {
   
       return text
           .trim()
           .split(/\s+/)
           .filter(Boolean);
   }
   
   
   function getLetterCount(text) {
   
       return (
           text.match(/[A-Za-zÀ-ÖØ-öø-ÿ]/g) || []
       ).length;
   }
   
   
   function getNumberCount(text) {
   
       return (
           text.match(/[0-9]/g) || []
       ).length;
   }
   
   
   function getSpaceCount(text) {
   
       return (
           text.match(/\s/g) || []
       ).length;
   }
   
   
   function getPunctuationCount(text) {
   
       return (
           text.match(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g) ||
           []
       ).length;
   }
   
   
   function getCharacterCount(text) {
   
       /*
          Characters here include:
          letters + numbers
   
          This is the number used for the
          writing-time calculation.
       */
   
       return (
           getLetterCount(text) +
           getNumberCount(text)
       );
   }
   
   
   function getSentenceArray(text) {
   
       return text
           .split(/[.!?]+/)
           .map(sentence => sentence.trim())
           .filter(Boolean);
   }
   
   
   function calculateEstimatedSeconds(
       characterCount
   ) {
   
       const speed =
           Number(appData.settings.targetSpeed) || 68;
   
       if (characterCount <= 0) {
           return 0;
       }
   
       return (
           characterCount /
           speed *
           60
       );
   }
   
   
   /* =========================================================
      TEXT ANALYSIS
      ========================================================= */
   
   function analyzeText(text) {
   
       const wordList =
           getWords(text);
   
       const sentences =
           getSentenceArray(text);
   
       const letters =
           getLetterCount(text);
   
       const numbers =
           getNumberCount(text);
   
       const characters =
           getCharacterCount(text);
   
       const spaces =
           getSpaceCount(text);
   
       const punctuation =
           getPunctuationCount(text);
   
   
       /* Word frequency */
   
       const frequency = {};
   
       wordList.forEach(word => {
   
           const cleaned =
               word
                   .toLowerCase()
                   .replace(
                       /[^a-z0-9À-ÖØ-öø-ÿ]/gi,
                       ""
                   );
   
           if (!cleaned) {
               return;
           }
   
           frequency[cleaned] =
               (frequency[cleaned] || 0) + 1;
       });
   
   
       const uniqueWords =
           Object.keys(frequency).length;
   
   
       const repeatedWords =
           Object.values(frequency)
               .filter(count => count > 1)
               .length;
   
   
       /* Longest word */
   
       let longestWord = "—";
   
       wordList.forEach(word => {
   
           const cleaned =
               word.replace(
                   /[^a-zA-Z0-9À-ÖØ-öø-ÿ]/g,
                   ""
               );
   
           if (
               cleaned.length >
               longestWord.replace(
                   /[^a-zA-Z0-9À-ÖØ-öø-ÿ]/g,
                   ""
               ).length
           ) {
   
               longestWord = cleaned;
           }
       });
   
   
       /* Average word length */
   
       const averageWordLength =
           wordList.length > 0
               ? characters / wordList.length
               : 0;
   
   
       /* Sentence lengths */
   
       const sentenceWordCounts =
           sentences.map(sentence =>
               getWords(sentence).length
           );
   
   
       const averageSentenceLength =
           sentences.length > 0
               ? wordList.length / sentences.length
               : 0;
   
   
       const longestSentence =
           sentenceWordCounts.length > 0
               ? Math.max(...sentenceWordCounts)
               : 0;
   
   
       const shortestSentence =
           sentenceWordCounts.length > 0
               ? Math.min(...sentenceWordCounts)
               : 0;
   
   
       /* Simple readability */
   
       let readability = "—";
   
       if (
           wordList.length > 0 &&
           sentences.length > 0
       ) {
   
           const averageSentenceWords =
               wordList.length /
               sentences.length;
   
           const averageWordChars =
               characters /
               wordList.length;
   
           const score =
               206.835 -
               (
                   1.015 *
                   averageSentenceWords
               ) -
               (
                   84.6 *
                   (averageWordChars / 100)
               );
   
           if (score >= 90) {
               readability = "Very Easy";
           } else if (score >= 80) {
               readability = "Easy";
           } else if (score >= 70) {
               readability = "Fairly Easy";
           } else if (score >= 60) {
               readability = "Standard";
           } else if (score >= 50) {
               readability = "Fairly Difficult";
           } else if (score >= 30) {
               readability = "Difficult";
           } else {
               readability = "Very Difficult";
           }
       }
   
   
       return {
           words: wordList.length,
           letters,
           numbers,
           characters,
           spaces,
           punctuation,
           sentences: sentences.length,
           paragraphs:
               text.trim()
                   ? text.split(/\n\s*\n/).filter(Boolean).length
                   : 0,
   
           frequency,
   
           uniqueWords,
           repeatedWords,
   
           longestWord,
   
           averageWordLength,
           averageSentenceLength,
   
           longestSentence,
           shortestSentence,
   
           readability
       };
   }
   
   
   /* =========================================================
      UPDATE ALL STATISTICS
      ========================================================= */
   
   function updateStatistics() {
   
       const text =
           paragraph.value;
   
       const data =
           analyzeText(text);
   
   
       wordsEl.textContent =
           data.words;
   
       lettersEl.textContent =
           data.letters;
   
       numbersEl.textContent =
           data.numbers;
   
       charactersEl.textContent =
           data.characters;
   
       spacesEl.textContent =
           data.spaces;
   
       punctuationEl.textContent =
           data.punctuation;
   
       sentencesEl.textContent =
           data.sentences;
   
       paragraphsEl.textContent =
           data.paragraphs;
   
   
       charPreview.textContent =
           `${data.characters} letters + numbers`;
   
   
       updateTime();
   
       updateReadingTime();
   
       updateAnalysis(data);
   
       updateGoal(data);
   
       updateScore(data);
   
       updateDictationPreview();
   
       if (
           appData.settings.autoSave
       ) {
   
           appData.paragraph =
               text;
   
           appData.timer.elapsed =
               elapsedMilliseconds;
   
           saveData();
       }
   }
   
   
   /* =========================================================
      TIME CALCULATIONS
      ========================================================= */
   
   function updateTime() {
   
       const characterCount =
           getCharacterCount(
               paragraph.value
           );
   
   
       const estimatedSeconds =
           calculateEstimatedSeconds(
               characterCount
           );
   
   
       estimatedTimeEl.textContent =
           formatTime(
               estimatedSeconds
           );
   
   
       const actualSeconds =
           elapsedMilliseconds / 1000;
   
   
       actualTimeEl.textContent =
           formatTime(
               actualSeconds
           );
   
   
       const difference =
           actualSeconds -
           estimatedSeconds;
   
   
       timeDifferenceEl.textContent =
           formatTime(
               Math.abs(difference)
           );
   
   
       if (characterCount === 0) {
   
           differenceLabelEl.textContent =
               "No paragraph yet";
   
       } else if (actualSeconds === 0) {
   
           differenceLabelEl.textContent =
               "Start the timer to compare";
   
       } else if (difference > 0) {
   
           differenceLabelEl.textContent =
               "Slower than estimated";
   
       } else if (difference < 0) {
   
           differenceLabelEl.textContent =
               "Faster than estimated";
   
       } else {
   
           differenceLabelEl.textContent =
               "Exactly on target";
       }
   }
   
   
   /* =========================================================
      READING TIME
      ========================================================= */
   
   function updateReadingTime() {
   
       const words =
           getWords(
               paragraph.value
           ).length;
   
   
       const speed =
           Number(
               appData.settings.readingSpeed
           ) || 200;
   
   
       const seconds =
           words > 0
               ? words / speed * 60
               : 0;
   
   
       readingTimeEl.textContent =
           formatTime(seconds);
   }
   
   
   /* =========================================================
      TEXT ANALYSIS UI
      ========================================================= */
   
   function updateAnalysis(data) {
   
       averageWordLengthEl.textContent =
           data.averageWordLength.toFixed(2);
   
       averageSentenceLengthEl.textContent =
           data.averageSentenceLength.toFixed(2);
   
       longestWordEl.textContent =
           data.longestWord;
   
       uniqueWordsEl.textContent =
           data.uniqueWords;
   
       longestSentenceEl.textContent =
           data.longestSentence;
   
       shortestSentenceEl.textContent =
           data.shortestSentence;
   
       readabilityEl.textContent =
           data.readability;
   
       repeatedWordsEl.textContent =
           data.repeatedWords;
   
   
       const repeated =
           Object.entries(data.frequency)
               .filter(
                   ([, count]) => count > 1
               )
               .sort(
                   (a, b) => b[1] - a[1]
               );
   
   
       if (repeated.length === 0) {
   
           wordFrequencyEl.textContent =
               "No repeated words yet.";
   
           return;
       }
   
   
       wordFrequencyEl.innerHTML =
           repeated
               .slice(0, 20)
               .map(
                   ([word, count]) => `
                       <span class="frequency-tag">
                           ${escapeHTML(word)}
                           ×${count}
                       </span>
                   `
               )
               .join(" ");
   }
   
   
   function escapeHTML(text) {
   
       return String(text)
           .replaceAll("&", "&amp;")
           .replaceAll("<", "&lt;")
           .replaceAll(">", "&gt;")
           .replaceAll('"', "&quot;")
           .replaceAll("'", "&#039;");
   }
   
   
   /* =========================================================
      WRITING SPEED
      ========================================================= */
   
   function updateSpeed() {
   
       const seconds =
           elapsedMilliseconds / 1000;
   
       const text =
           paragraph.value;
   
       const words =
           getWords(text).length;
   
       const characters =
           getCharacterCount(text);
   
   
       if (seconds <= 0) {
   
           cpmEl.textContent = "0";
   
           wpmEl.textContent = "0";
   
           speedDifferenceEl.textContent =
               "0";
   
           return;
       }
   
   
       const cpm =
           characters /
           seconds *
           60;
   
   
       const wpm =
           words /
           seconds *
           60;
   
   
       const target =
           Number(
               appData.settings.targetSpeed
           ) || 68;
   
   
       cpmEl.textContent =
           Math.round(cpm);
   
       wpmEl.textContent =
           Math.round(wpm);
   
       speedDifferenceEl.textContent =
           `${Math.round(cpm - target)}`;
   
       targetSpeedEl.textContent =
           target;
   }
   
   
   /* =========================================================
      TIMER
      ========================================================= */
   
   function startTimer() {
   
       if (timerRunning) {
           return;
       }
   
   
       timerRunning = true;
   
       timerStartTime =
           Date.now() -
           elapsedMilliseconds;
   
   
       liveStatus.textContent =
           "Writing";
   
   
       timerInterval =
           setInterval(() => {
   
               elapsedMilliseconds =
                   Date.now() -
                   timerStartTime;
   
               updateTimerDisplay();
   
               updateTime();
   
               updateSpeed();
   
               updateScore(
                   analyzeText(
                       paragraph.value
                   )
               );
   
           }, 100);
   
   
       updateTimerButtons();
   }
   
   
   function pauseTimer() {
   
       if (!timerRunning) {
           return;
       }
   
   
       elapsedMilliseconds =
           Date.now() -
           timerStartTime;
   
   
       timerRunning = false;
   
   
       clearInterval(
           timerInterval
       );
   
   
       timerInterval = null;
   
   
       appData.timer.elapsed =
           elapsedMilliseconds;
   
   
       saveData();
   
   
       liveStatus.textContent =
           "Paused";
   
   
       updateTimerButtons();
   
       updateTime();
   
       updateSpeed();
   }
   
   
   function resetTimer() {
   
       timerRunning = false;
   
       clearInterval(
           timerInterval
       );
   
       timerInterval = null;
   
       elapsedMilliseconds = 0;
   
       appData.timer.elapsed = 0;
   
       saveData();
   
       updateTimerDisplay();
   
       updateTime();
   
       updateSpeed();
   
       updateScore(
           analyzeText(
               paragraph.value
           )
       );
   
       liveStatus.textContent =
           "Ready";
   
       updateTimerButtons();
   }
   
   
   function updateTimerDisplay() {
   
       stopwatchEl.textContent =
           formatTime(
               elapsedMilliseconds / 1000
           );
   }
   
   
   function updateTimerButtons() {
   
       startTimerBtn.disabled =
           timerRunning;
   
       pauseTimerBtn.disabled =
           !timerRunning;
   }
   
   
   /* =========================================================
      GOAL
      ========================================================= */
   
   function updateGoal(data) {
   
       const type =
           appData.goal.type;
   
       const target =
           Number(
               appData.goal.target
           ) || 1;
   
   
       let current = 0;
   
       let unit = "";
   
   
       if (type === "letters") {
   
           current = data.letters;
           unit = "letters";
   
       } else if (type === "characters") {
   
           current = data.characters;
           unit = "characters";
   
       } else {
   
           current = data.words;
           unit = "words";
       }
   
   
       const percentage =
           Math.min(
               100,
               current / target * 100
           );
   
   
       goalProgressTextEl.textContent =
           `${current} / ${target} ${unit}`;
   
   
       goalPercentageEl.textContent =
           `${Math.round(percentage)}%`;
   
   
       goalProgressBarEl.style.width =
           `${percentage}%`;
   
   
       if (current >= target) {
   
           goalStatusEl.textContent =
               "🎉 Goal completed!";
   
       } else {
   
           const remaining =
               target - current;
   
           goalStatusEl.textContent =
               `${remaining} ${unit} remaining to reach your goal.`;
       }
   }
   
   
   function setGoal() {
   
       const type =
           goalTypeEl.value;
   
       let target =
           Number(
               goalTargetEl.value
           );
   
   
       if (!Number.isFinite(target) || target < 1) {
   
           target = 1;
   
           goalTargetEl.value =
               target;
       }
   
   
       appData.goal = {
           type,
           target
       };
   
   
       saveData();
   
   
       updateGoal(
           analyzeText(
               paragraph.value
           )
       );
   }
   
   
   /* =========================================================
      SCORE
      ========================================================= */
   
   function updateScore(data) {
   
       const target =
           Number(
               appData.settings.targetSpeed
           ) || 68;
   
   
       const seconds =
           elapsedMilliseconds / 1000;
   
   
       let currentCPM = 0;
   
   
       if (seconds > 0) {
   
           currentCPM =
               data.characters /
               seconds *
               60;
       }
   
   
       let speedScore = 0;
   
   
       if (currentCPM > 0) {
   
           speedScore =
               Math.min(
                   40,
                   Math.round(
                       currentCPM /
                       target *
                       40
                   )
               );
       }
   
   
       const goalTarget =
           Number(
               appData.goal.target
           ) || 1;
   
   
       let goalCurrent = 0;
   
   
       if (appData.goal.type === "letters") {
   
           goalCurrent =
               data.letters;
   
       } else if (
           appData.goal.type === "characters"
       ) {
   
           goalCurrent =
               data.characters;
   
       } else {
   
           goalCurrent =
               data.words;
       }
   
   
       const goalScore =
           Math.min(
               30,
               Math.round(
                   goalCurrent /
                   goalTarget *
                   30
               )
           );
   
   
       let consistencyScore = 0;
   
   
       if (
           elapsedMilliseconds > 0 &&
           data.characters > 0
       ) {
   
           consistencyScore = 30;
   
       } else if (
           data.characters > 0
       ) {
   
           consistencyScore = 10;
       }
   
   
       const total =
           speedScore +
           goalScore +
           consistencyScore;
   
   
       sessionScoreEl.textContent =
           total;
   
       speedScoreEl.textContent =
           `${speedScore}/40`;
   
       goalScoreEl.textContent =
           `${goalScore}/30`;
   
       consistencyScoreEl.textContent =
           `${consistencyScore}/30`;
   
   
       if (total >= 90) {
   
           scoreMessageEl.textContent =
               "🔥 Excellent performance!";
   
       } else if (total >= 70) {
   
           scoreMessageEl.textContent =
               "⭐ Great work. Keep improving.";
   
       } else if (total >= 40) {
   
           scoreMessageEl.textContent =
               "👍 Good start. Keep practicing.";
   
       } else {
   
           scoreMessageEl.textContent =
               "Start writing to improve your score.";
       }
   }
   
   
   /* =========================================================
      DICTATION
      ========================================================= */
   
   function prepareDictation() {
   
       dictationWords =
           getWords(
               paragraph.value
           );
   
       dictationIndex = 0;
   
       updateDictationUI();
   }
   
   
   function calculateWordWritingTime(word) {
   
       const characterCount =
           getCharacterCount(word);
   
       const speed =
           Number(
               appData.settings.targetSpeed
           ) || 68;
   
       const extra =
           Number(
               appData.settings.extraDelay
           ) || 0;
   
   
       if (characterCount <= 0) {
           return extra;
       }
   
   
       return (
           characterCount /
           speed *
           60
       ) + extra;
   }
   
   
   function updateDictationUI() {
   
       const total =
           dictationWords.length;
   
   
       dictationTotalWordsEl.textContent =
           total;
   
   
       if (
           total === 0 ||
           dictationIndex >= total
       ) {
   
           dictationCurrentWordEl.textContent =
               "—";
   
           dictationWordNumberEl.textContent =
               total === 0
                   ? "0"
                   : total;
   
           dictationCharacterCountEl.textContent =
               "0";
   
           dictationWritingTimeEl.textContent =
               "0.00s";
   
           dictationProgressTextEl.textContent =
               total === 0
                   ? "0%"
                   : "100%";
   
           dictationProgressBarEl.style.width =
               total === 0
                   ? "0%"
                   : "100%";
   
           return;
       }
   
   
       const word =
           dictationWords[
               dictationIndex
           ];
   
   
       const characters =
           getCharacterCount(word);
   
   
       const writingSeconds =
           calculateWordWritingTime(word);
   
   
       const percentage =
           (
               dictationIndex /
               total *
               100
           );
   
   
       dictationCurrentWordEl.textContent =
           word;
   
       dictationWordNumberEl.textContent =
           dictationIndex + 1;
   
       dictationCharacterCountEl.textContent =
           characters;
   
       dictationWritingTimeEl.textContent =
           `${writingSeconds.toFixed(2)}s`;
   
       dictationSpeedEl.textContent =
           appData.settings.targetSpeed;
   
       dictationProgressTextEl.textContent =
           `${Math.round(percentage)}%`;
   
       dictationProgressBarEl.style.width =
           `${percentage}%`;
   }
   
   
   function speakWord(word) {
   
       if (
           !("speechSynthesis" in window)
       ) {
   
           console.warn(
               "Speech synthesis is not supported."
           );
   
           return;
       }
   
   
       window.speechSynthesis.cancel();
   
   
       const utterance =
           new SpeechSynthesisUtterance(
               word
           );
   
   
       utterance.rate =
           Number(
               appData.settings.speechRate
           ) || 1;
   
   
       utterance.pitch = 1;
   
       utterance.volume = 1;
   
   
       window.speechSynthesis.speak(
           utterance
       );
   }
   
   
   function startDictation() {
   
       if (
           dictationRunning
       ) {
           return;
       }
   
   
       if (
           dictationWords.length === 0
       ) {
   
           prepareDictation();
       }
   
   
       if (
           dictationWords.length === 0
       ) {
   
           dictationStatusEl.textContent =
               "No words";
   
           return;
       }
   
   
       if (
           dictationIndex >=
           dictationWords.length
       ) {
   
           dictationIndex = 0;
       }
   
   
       dictationRunning = true;
   
       dictationPaused = false;
   
   
       dictationStatusEl.textContent =
           "Speaking";
   
   
       processCurrentDictationWord();
   }
   
   
   function processCurrentDictationWord() {
   
       if (
           !dictationRunning ||
           dictationPaused
       ) {
           return;
       }
   
   
       if (
           dictationIndex >=
           dictationWords.length
       ) {
   
           finishDictation();
   
           return;
       }
   
   
       const word =
           dictationWords[
               dictationIndex
           ];
   
   
       const writingSeconds =
           calculateWordWritingTime(
               word
           );
   
   
       dictationRemainingMilliseconds =
           writingSeconds * 1000;
   
   
       updateDictationUI();
   
   
       dictationStatusEl.textContent =
           "Speaking";
   
   
       speakWord(word);
   
   
       /*
          Give speech a short amount of time to finish.
          Then start the writing countdown.
       */
   
       const speechDelay =
           Math.max(
               350,
               (
                   word.length *
                   65
               ) /
               (
                   Number(
                       appData.settings.speechRate
                   ) || 1
               )
           );
   
   
       dictationTimeout =
           setTimeout(
               startWordCountdown,
               speechDelay
           );
   }
   
   
   function startWordCountdown() {
   
       if (
           !dictationRunning ||
           dictationPaused
       ) {
           return;
       }
   
   
       dictationStatusEl.textContent =
           "Write now";
   
   
       const countdownStart =
           Date.now();
   
   
       const duration =
           dictationRemainingMilliseconds;
   
   
       clearInterval(
           dictationCountdownInterval
       );
   
   
       dictationCountdownInterval =
           setInterval(() => {
   
               const elapsed =
                   Date.now() -
                   countdownStart;
   
   
               dictationRemainingMilliseconds =
                   Math.max(
                       0,
                       duration - elapsed
                   );
   
   
               dictationCountdownEl.textContent =
                   `${(
                       dictationRemainingMilliseconds /
                       1000
                   ).toFixed(2)}s`;
   
   
               if (
                   dictationRemainingMilliseconds <= 0
               ) {
   
                   clearInterval(
                       dictationCountdownInterval
                   );
   
   
                   dictationIndex++;
   
   
                   updateDictationUI();
   
   
                   setTimeout(
                       processCurrentDictationWord,
                       200
                   );
               }
   
           }, 30);
   }
   
   
   function pauseDictation() {
   
       if (
           !dictationRunning
       ) {
           return;
       }
   
   
       dictationPaused = true;
   
   
       clearTimeout(
           dictationTimeout
       );
   
       clearInterval(
           dictationCountdownInterval
       );
   
   
       window.speechSynthesis.cancel();
   
   
       dictationStatusEl.textContent =
           "Paused";
   }
   
   
   function stopDictation() {
   
       dictationRunning = false;
   
       dictationPaused = false;
   
   
       clearTimeout(
           dictationTimeout
       );
   
       clearInterval(
           dictationCountdownInterval
       );
   
   
       window.speechSynthesis.cancel();
   
   
       dictationStatusEl.textContent =
           "Stopped";
   
       dictationCountdownEl.textContent =
           "0.00s";
   }
   
   
   function resetDictation() {
   
       stopDictation();
   
       dictationWords = [];
   
       dictationIndex = 0;
   
       dictationRemainingMilliseconds = 0;
   
   
       dictationStatusEl.textContent =
           "Ready";
   
   
       dictationCountdownEl.textContent =
           "0.00s";
   
   
       prepareDictation();
   }
   
   
   function finishDictation() {
   
       dictationRunning = false;
   
       dictationPaused = false;
   
   
       clearTimeout(
           dictationTimeout
       );
   
       clearInterval(
           dictationCountdownInterval
       );
   
   
       window.speechSynthesis.cancel();
   
   
       dictationStatusEl.textContent =
           "Complete 🎉";
   
   
       dictationCountdownEl.textContent =
           "0.00s";
   
   
       dictationProgressTextEl.textContent =
           "100%";
   
       dictationProgressBarEl.style.width =
           "100%";
   }
   
   
   function updateDictationPreview() {
   
       if (
           !dictationRunning
       ) {
   
           prepareDictation();
       }
   }
   
   
   /* =========================================================
      HISTORY
      ========================================================= */
   
   function saveSession() {
   
       const data =
           analyzeText(
               paragraph.value
           );
   
   
       if (
           data.characters === 0
       ) {
           return;
       }
   
   
       const seconds =
           elapsedMilliseconds /
           1000;
   
   
       const cpm =
           seconds > 0
               ? data.characters /
                 seconds *
                 60
               : 0;
   
   
       const session = {
   
           id:
               Date.now(),
   
           date:
               new Date().toISOString(),
   
           preview:
               paragraph.value
                   .replace(/\s+/g, " ")
                   .trim()
                   .slice(0, 100),
   
           words:
               data.words,
   
           letters:
               data.letters,
   
           characters:
               data.characters,
   
           time:
               seconds,
   
           estimatedTime:
               calculateEstimatedSeconds(
                   data.characters
               ),
   
           cpm,
   
           wpm:
               seconds > 0
                   ? data.words /
                     seconds *
                     60
                   : 0
       };
   
   
       appData.history.unshift(
           session
       );
   
   
       /*
          Keep the last 50 sessions.
       */
   
       appData.history =
           appData.history.slice(
               0,
               50
           );
   
   
       saveData();
   
       renderHistory();
   
       drawPerformanceChart();
   }
   
   
   function renderHistory() {
   
       if (
           !historyListEl ||
           !historyEmptyEl
       ) {
           return;
       }
   
   
       if (
           appData.history.length === 0
       ) {
   
           historyListEl.innerHTML = "";
   
           historyEmptyEl.style.display =
               "block";
   
           return;
       }
   
   
       historyEmptyEl.style.display =
           "none";
   
   
       historyListEl.innerHTML =
           appData.history
               .map(session => {
   
                   const date =
                       new Date(
                           session.date
                       );
   
   
                   return `
                       <div
                           class="history-item"
                           data-id="${session.id}"
                       >
   
                           <div class="history-item-title">
                               ${escapeHTML(
                                   session.preview ||
                                   "Untitled session"
                               )}
                           </div>
   
                           <div class="history-item-data">
                               <span>Words</span>
                               <strong>
                                   ${session.words}
                               </strong>
                           </div>
   
                           <div class="history-item-data">
                               <span>Characters</span>
                               <strong>
                                   ${session.characters}
                               </strong>
                           </div>
   
                           <div class="history-item-data">
                               <span>Time</span>
                               <strong>
                                   ${formatTime(
                                       session.time
                                   )}
                               </strong>
                           </div>
   
                           <div class="history-item-data">
                               <span>Speed</span>
                               <strong>
                                   ${Math.round(
                                       session.cpm
                                   )} CPM
                               </strong>
                           </div>
   
                           <div class="history-item-data">
                               <span>Date</span>
                               <strong>
                                   ${date.toLocaleDateString()}
                               </strong>
                           </div>
   
                           <button
                               class="history-delete"
                               type="button"
                               data-delete-id="${session.id}"
                               title="Delete session"
                           >
                               ×
                           </button>
   
                       </div>
                   `;
   
               })
               .join("");
   }
   
   
   function deleteHistoryItem(id) {
   
       appData.history =
           appData.history.filter(
               item =>
                   String(item.id) !==
                   String(id)
           );
   
   
       saveData();
   
       renderHistory();
   
       drawPerformanceChart();
   }
   
   
   /* =========================================================
      PERFORMANCE CHART
      ========================================================= */
   
   function drawPerformanceChart() {
   
       if (
           !performanceChart
       ) {
           return;
       }
   
   
       const canvas =
           performanceChart;
   
   
       const ctx =
           canvas.getContext("2d");
   
   
       const rect =
           canvas.getBoundingClientRect();
   
   
       const dpr =
           window.devicePixelRatio || 1;
   
   
       canvas.width =
           rect.width * dpr;
   
       canvas.height =
           rect.height * dpr;
   
   
       ctx.scale(
           dpr,
           dpr
       );
   
   
       const width =
           rect.width;
   
       const height =
           rect.height;
   
   
       ctx.clearRect(
           0,
           0,
           width,
           height
       );
   
   
       const sessions =
           [...appData.history]
               .reverse()
               .slice(-20);
   
   
       if (
           sessions.length === 0
       ) {
   
           ctx.fillStyle =
               getCSSVariable("--muted");
   
           ctx.font =
               "14px Segoe UI";
   
           ctx.textAlign =
               "center";
   
           ctx.fillText(
               "Complete a session to see your performance.",
               width / 2,
               height / 2
           );
   
           return;
       }
   
   
       const values =
           sessions.map(
               session =>
                   Number(session.cpm) || 0
           );
   
   
       const maxValue =
           Math.max(
               ...values,
               Number(
                   appData.settings.targetSpeed
               )
           );
   
   
       const padding = 40;
   
       const chartWidth =
           width - padding * 2;
   
       const chartHeight =
           height - padding * 2;
   
   
       /* Grid */
   
       ctx.strokeStyle =
           getCSSVariable("--border");
   
       ctx.lineWidth = 1;
   
   
       for (
           let i = 0;
           i <= 4;
           i++
       ) {
   
           const y =
               padding +
               chartHeight *
               i /
               4;
   
   
           ctx.beginPath();
   
           ctx.moveTo(
               padding,
               y
           );
   
           ctx.lineTo(
               width - padding,
               y
           );
   
           ctx.stroke();
       }
   
   
       /* Target line */
   
       const target =
           Number(
               appData.settings.targetSpeed
           ) || 68;
   
   
       const targetY =
           padding +
           chartHeight *
           (
               1 -
               target /
               maxValue
           );
   
   
       ctx.setLineDash([
           6,
           5
       ]);
   
   
       ctx.strokeStyle =
           getCSSVariable("--muted");
   
   
       ctx.beginPath();
   
       ctx.moveTo(
           padding,
           targetY
       );
   
       ctx.lineTo(
           width - padding,
           targetY
       );
   
       ctx.stroke();
   
   
       ctx.setLineDash([]);
   
   
       /* Chart line */
   
       ctx.strokeStyle =
           getCSSVariable("--primary");
   
       ctx.lineWidth = 3;
   
       ctx.beginPath();
   
   
       sessions.forEach(
           (session, index) => {
   
               const value =
                   Number(
                       session.cpm
                   ) || 0;
   
   
               const x =
                   padding +
                   (
                       sessions.length === 1
                           ? chartWidth / 2
                           : chartWidth *
                             index /
                             (
                                 sessions.length - 1
                             )
                   );
   
   
               const y =
                   padding +
                   chartHeight *
                   (
                       1 -
                       value /
                       maxValue
                   );
   
   
               if (index === 0) {
   
                   ctx.moveTo(
                       x,
                       y
                   );
   
               } else {
   
                   ctx.lineTo(
                       x,
                       y
                   );
               }
           }
       );
   
   
       ctx.stroke();
   
   
       /* Points */
   
       sessions.forEach(
           (session, index) => {
   
               const value =
                   Number(
                       session.cpm
                   ) || 0;
   
   
               const x =
                   padding +
                   (
                       sessions.length === 1
                           ? chartWidth / 2
                           : chartWidth *
                             index /
                             (
                                 sessions.length - 1
                             )
                   );
   
   
               const y =
                   padding +
                   chartHeight *
                   (
                       1 -
                       value /
                       maxValue
                   );
   
   
               ctx.fillStyle =
                   getCSSVariable("--primary");
   
   
               ctx.beginPath();
   
               ctx.arc(
                   x,
                   y,
                   4,
                   0,
                   Math.PI * 2
               );
   
               ctx.fill();
           }
       );
   
   
       /* Y-axis labels */
   
       ctx.fillStyle =
           getCSSVariable("--muted");
   
       ctx.font =
           "11px Segoe UI";
   
       ctx.textAlign =
           "right";
   
   
       for (
           let i = 0;
           i <= 4;
           i++
       ) {
   
           const value =
               Math.round(
                   maxValue *
                   (
                       1 -
                       i / 4
                   )
               );
   
   
           const y =
               padding +
               chartHeight *
               i /
               4;
   
   
           ctx.fillText(
               value,
               padding - 7,
               y + 4
           );
       }
   }
   
   
   function getCSSVariable(name) {
   
       return getComputedStyle(
           document.body
       )
           .getPropertyValue(name)
           .trim() || "#64748b";
   }
   
   
   /* =========================================================
      THEME
      ========================================================= */
   
   function applyTheme() {
   
       const dark =
           appData.theme === "dark";
   
   
       document.body.classList.toggle(
           "dark",
           dark
       );
   
   
       themeToggle.textContent =
           dark
               ? "☀️ Light"
               : "🌙 Dark";
   
   
       drawPerformanceChart();
   }
   
   
   function toggleTheme() {
   
       appData.theme =
           appData.theme === "dark"
               ? "light"
               : "dark";
   
   
       saveData();
   
       applyTheme();
   }
   
   
   /* =========================================================
      SETTINGS
      ========================================================= */
   
   function loadSettingsIntoUI() {
   
       speedInput.value =
           appData.settings.targetSpeed;
   
       readingSpeedInput.value =
           appData.settings.readingSpeed;
   
       autoSaveToggle.checked =
           appData.settings.autoSave;
   
       autoTimerToggle.checked =
           appData.settings.autoTimer;
   
       dictationSpeechRateEl.value =
           appData.settings.speechRate;
   
       dictationExtraDelayEl.value =
           appData.settings.extraDelay;
   
   
       dictationSpeechRateValueEl.textContent =
           `${Number(
               appData.settings.speechRate
           ).toFixed(1)}×`;
   
   
       goalTypeEl.value =
           appData.goal.type;
   
       goalTargetEl.value =
           appData.goal.target;
   
   
       targetSpeedEl.textContent =
           appData.settings.targetSpeed;
   
   
       dictationSpeedEl.textContent =
           appData.settings.targetSpeed;
   }
   
   
   function saveSettingsFromUI() {
   
       const speed =
           Number(
               speedInput.value
           );
   
   
       const readingSpeed =
           Number(
               readingSpeedInput.value
           );
   
   
       if (
           Number.isFinite(speed) &&
           speed > 0
       ) {
   
           appData.settings.targetSpeed =
               speed;
       }
   
   
       if (
           Number.isFinite(readingSpeed) &&
           readingSpeed > 0
       ) {
   
           appData.settings.readingSpeed =
               readingSpeed;
       }
   
   
       appData.settings.autoSave =
           autoSaveToggle.checked;
   
   
       appData.settings.autoTimer =
           autoTimerToggle.checked;
   
   
       appData.settings.speechRate =
           Number(
               dictationSpeechRateEl.value
           );
   
   
       appData.settings.extraDelay =
           Math.max(
               0,
               Number(
                   dictationExtraDelayEl.value
               ) || 0
           );
   
   
       saveData();
   
   
       updateStatistics();
   }
   
   
   /* =========================================================
      CLEAR PARAGRAPH
      ========================================================= */
   
   function clearParagraph() {
   
       paragraph.value = "";
   
       appData.paragraph = "";
   
       saveData();
   
   
       if (timerRunning) {
           resetTimer();
       } else {
   
           elapsedMilliseconds = 0;
   
           updateTimerDisplay();
       }
   
   
       dictationWords = [];
   
       dictationIndex = 0;
   
       stopDictation();
   
   
       updateStatistics();
   
       prepareDictation();
   
   
       liveStatus.textContent =
           "Ready";
   }
   
   
   /* =========================================================
      CLEAR ALL SAVED DATA
      ========================================================= */
   
   function clearAllSavedData() {
   
       const confirmed =
           confirm(
               "Are you sure you want to delete ALL saved data? This includes your paragraph, settings, goals and writing history."
           );
   
   
       if (!confirmed) {
           return;
       }
   
   
       localStorage.removeItem(
           STORAGE_KEY
       );
   
   
       appData =
           cloneDefaultData();
   
   
       elapsedMilliseconds = 0;
   
   
       timerRunning = false;
   
   
       clearInterval(
           timerInterval
       );
   
   
       timerInterval = null;
   
   
       paragraph.value =
           "";
   
   
       loadSettingsIntoUI();
   
       applyTheme();
   
       updateTimerDisplay();
   
       updateStatistics();
   
       renderHistory();
   
       prepareDictation();
   
   
       liveStatus.textContent =
           "Data cleared";
   }
   
   
   /* =========================================================
      EVENT LISTENERS — TEXT
      ========================================================= */
   
   paragraph.addEventListener(
       "input",
       () => {
   
           appData.paragraph =
               paragraph.value;
   
   
           if (
               appData.settings.autoTimer &&
               paragraph.value.length > 0 &&
               !timerRunning
           ) {
   
               startTimer();
           }
   
   
           updateStatistics();
   
           saveData();
       }
   );
   
   
   calculateBtn.addEventListener(
       "click",
       () => {
   
           updateStatistics();
   
           liveStatus.textContent =
               "Calculated";
   
           if (
               appData.settings.autoSave &&
               paragraph.value.trim()
           ) {
   
               /*
                  Calculation itself does not create
                  a history item.
   
                  Use the timer reset or explicit
                  session completion flow for history.
               */
           }
       }
   );
   
   
   clearBtn.addEventListener(
       "click",
       clearParagraph
   );
   
   
   /* =========================================================
      EVENT LISTENERS — TIMER
      ========================================================= */
   
   startTimerBtn.addEventListener(
       "click",
       startTimer
   );
   
   
   pauseTimerBtn.addEventListener(
       "click",
       pauseTimer
   );
   
   
   resetTimerBtn.addEventListener(
       "click",
       () => {
   
           /*
              Save the session before resetting if
              there is actual writing data.
           */
   
           if (
               paragraph.value.trim() &&
               elapsedMilliseconds > 0
           ) {
   
               saveSession();
           }
   
   
           resetTimer();
       }
   );
   
   
   /* =========================================================
      EVENT LISTENERS — GOAL
      ========================================================= */
   
   setGoalBtn.addEventListener(
       "click",
       setGoal
   );
   
   
   /* =========================================================
      EVENT LISTENERS — SETTINGS
      ========================================================= */
   
   speedInput.addEventListener(
       "change",
       saveSettingsFromUI
   );
   
   
   readingSpeedInput.addEventListener(
       "change",
       saveSettingsFromUI
   );
   
   
   autoSaveToggle.addEventListener(
       "change",
       saveSettingsFromUI
   );
   
   
   autoTimerToggle.addEventListener(
       "change",
       saveSettingsFromUI
   );
   
   
   dictationSpeechRateEl.addEventListener(
       "input",
       () => {
   
           const value =
               Number(
                   dictationSpeechRateEl.value
               );
   
   
           dictationSpeechRateValueEl.textContent =
               `${value.toFixed(1)}×`;
   
   
           appData.settings.speechRate =
               value;
   
   
           saveData();
       }
   );
   
   
   dictationExtraDelayEl.addEventListener(
       "change",
       saveSettingsFromUI
   );
   
   
   /* =========================================================
      EVENT LISTENERS — THEME
      ========================================================= */
   
   themeToggle.addEventListener(
       "click",
       toggleTheme
   );
   
   
   /* =========================================================
      EVENT LISTENERS — DICTATION
      ========================================================= */
   
   startDictationBtn.addEventListener(
       "click",
       startDictation
   );
   
   
   pauseDictationBtn.addEventListener(
       "click",
       pauseDictation
   );
   
   
   stopDictationBtn.addEventListener(
       "click",
       stopDictation
   );
   
   
   resetDictationBtn.addEventListener(
       "click",
       resetDictation
   );
   
   
   /* =========================================================
      EVENT LISTENERS — HISTORY
      ========================================================= */
   
   clearHistoryBtn.addEventListener(
       "click",
       () => {
   
           if (
               appData.history.length === 0
           ) {
               return;
           }
   
   
           const confirmed =
               confirm(
                   "Delete your entire writing history?"
               );
   
   
           if (!confirmed) {
               return;
           }
   
   
           appData.history = [];
   
           saveData();
   
           renderHistory();
   
           drawPerformanceChart();
       }
   );
   
   
   historyListEl.addEventListener(
       "click",
       event => {
   
           const button =
               event.target.closest(
                   "[data-delete-id]"
               );
   
   
           if (!button) {
               return;
           }
   
   
           deleteHistoryItem(
               button.dataset.deleteId
           );
       }
   );
   
   
   /* =========================================================
      EVENT LISTENER — CLEAR DATA
      ========================================================= */
   
   clearSavedDataBtn.addEventListener(
       "click",
       clearAllSavedData
   );
   
   
   /* =========================================================
      WINDOW EVENTS
      ========================================================= */
   
   window.addEventListener(
       "resize",
       () => {
   
           drawPerformanceChart();
       }
   );
   
   
   window.addEventListener(
       "beforeunload",
       () => {
   
           appData.paragraph =
               paragraph.value;
   
           appData.timer.elapsed =
               elapsedMilliseconds;
   
           saveData();
       }
   );
   
   
   /* =========================================================
      INITIALIZATION
      ========================================================= */
   
   function initializeApp() {
   
       /*
          Restore paragraph.
       */
   
       paragraph.value =
           appData.paragraph || "";
   
   
       /*
          Restore settings.
       */
   
       loadSettingsIntoUI();
   
   
       /*
          Restore timer.
       */
   
       elapsedMilliseconds =
           Number(
               appData.timer.elapsed || 0
           );
   
   
       updateTimerDisplay();
   
   
       /*
          Restore theme.
       */
   
       applyTheme();
   
   
       /*
          Restore goal.
       */
   
       goalTypeEl.value =
           appData.goal.type;
   
       goalTargetEl.value =
           appData.goal.target;
   
   
       /*
          Update everything.
       */
   
       updateStatistics();
   
   
       /*
          Restore history.
       */
   
       renderHistory();
   
   
       /*
          Prepare dictation.
       */
   
       prepareDictation();
   
   
       /*
          Draw chart.
       */
   
       drawPerformanceChart();
   
   
       /*
          Timer buttons.
       */
   
       updateTimerButtons();
   
   
       /*
          Initial status.
       */
   
       liveStatus.textContent =
           paragraph.value.trim()
               ? "Restored"
               : "Ready";
   }
   
   
   /* =========================================================
      START APP
      ========================================================= */
   
   initializeApp();