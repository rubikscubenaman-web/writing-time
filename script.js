/* =========================================================
   WRITING TIME
   COMPLETE JAVASCRIPT
   ========================================================= */

   "use strict";


   /* =========================================================
      STORAGE
      ========================================================= */
   
   const STORAGE_KEY =
       "writingTimeAppData_v4";
   
   
   const defaultData = {
   
       paragraph: "",
   
       theme: "light",
   
       settings: {
   
           targetSpeed: 68,
   
           readingSpeed: 200,
   
           autoSave: true,
   
           autoTimer: false,
   
           speechRate: 1,
   
           extraDelay: 0
   
       },
   
       goal: {
   
           type: "words",
   
           target: 500
   
       },
   
       history: [],
   
       currentSession: {
   
           elapsed: 0,
   
           started: false,
   
           completed: false
   
       }
   
   };
   
   
   function deepClone(object) {
   
       return JSON.parse(
           JSON.stringify(object)
       );
   }
   
   
   function loadData() {
   
       try {
   
           const saved =
               localStorage.getItem(
                   STORAGE_KEY
               );
   
   
           if (!saved) {
   
               return deepClone(
                   defaultData
               );
           }
   
   
           const parsed =
               JSON.parse(saved);
   
   
           return {
   
               ...deepClone(
                   defaultData
               ),
   
               ...parsed,
   
               settings: {
   
                   ...defaultData.settings,
   
                   ...(parsed.settings || {})
   
               },
   
               goal: {
   
                   ...defaultData.goal,
   
                   ...(parsed.goal || {})
   
               },
   
               currentSession: {
   
                   ...defaultData.currentSession,
   
                   ...(parsed.currentSession || {})
   
               },
   
               history:
                   Array.isArray(
                       parsed.history
                   )
                       ? parsed.history
                       : []
   
           };
   
       } catch (error) {
   
           console.error(
               "Storage loading failed:",
               error
           );
   
           return deepClone(
               defaultData
           );
       }
   }
   
   
   let appData =
       loadData();
   
   
   function saveData() {
   
       try {
   
           localStorage.setItem(
               STORAGE_KEY,
               JSON.stringify(
                   appData
               )
           );
   
       } catch (error) {
   
           console.error(
               "Storage saving failed:",
               error
           );
       }
   }
   
   
   /* =========================================================
      ELEMENTS
      ========================================================= */
   
   const $ = id =>
       document.getElementById(id);
   
   
   const paragraph =
       $("paragraph");
   
   
   const calculateBtn =
       $("calculateBtn");
   
   const clearBtn =
       $("clearBtn");
   
   
   const liveStatus =
       $("liveStatus");
   
   
   /* Statistics */
   
   const wordsEl =
       $("words");
   
   const lettersEl =
       $("letters");
   
   const numbersEl =
       $("numbers");
   
   const charactersEl =
       $("characters");
   
   const spacesEl =
       $("spaces");
   
   const punctuationEl =
       $("punctuation");
   
   const sentencesEl =
       $("sentences");
   
   const paragraphsEl =
       $("paragraphs");
   
   
   /* Speed */
   
   const cpmEl =
       $("cpm");
   
   const wpmEl =
       $("wpm");
   
   const speedDifferenceEl =
       $("speedDifference");
   
   const targetSpeedEl =
       $("targetSpeed");
   
   const targetSpeedCardEl =
       $("targetSpeedCard");
   
   const chartCurrentSpeedEl =
       $("chartCurrentSpeed");
   
   
   /* Time */
   
   const estimatedTimeEl =
       $("estimatedTime");
   
   const actualTimeEl =
       $("actualTime");
   
   const timeDifferenceEl =
       $("timeDifference");
   
   const differenceLabelEl =
       $("differenceLabel");
   
   
   /* Timer */
   
   const stopwatchEl =
       $("stopwatch");
   
   const startTimerBtn =
       $("startTimer");
   
   const pauseTimerBtn =
       $("pauseTimer");
   
   const resetTimerBtn =
       $("resetTimer");
   
   
   /* Reading */
   
   const readingTimeEl =
       $("readingTime");
   
   
   /* Analysis */
   
   const averageWordLengthEl =
       $("averageWordLength");
   
   const averageSentenceLengthEl =
       $("averageSentenceLength");
   
   const longestWordEl =
       $("longestWord");
   
   const uniqueWordsEl =
       $("uniqueWords");
   
   const longestSentenceEl =
       $("longestSentence");
   
   const shortestSentenceEl =
       $("shortestSentence");
   
   const readabilityEl =
       $("readability");
   
   const repeatedWordsEl =
       $("repeatedWords");
   
   
   /* Word frequency */
   
   const wordFrequencyEl =
       $("wordFrequency");
   
   const topWordsBtn =
       $("topWordsBtn");
   
   const allWordsBtn =
       $("allWordsBtn");
   
   
   let frequencyMode =
       "top";
   
   
   /* Goal */
   
   const goalTypeEl =
       $("goalType");
   
   const goalTargetEl =
       $("goalTarget");
   
   const setGoalBtn =
       $("setGoalBtn");
   
   const goalProgressTextEl =
       $("goalProgressText");
   
   const goalPercentageEl =
       $("goalPercentage");
   
   const goalProgressBarEl =
       $("goalProgressBar");
   
   const goalStatusEl =
       $("goalStatus");
   
   
   /* Score */
   
   const sessionScoreEl =
       $("sessionScore");
   
   const scoreMessageEl =
       $("scoreMessage");
   
   const speedScoreEl =
       $("speedScore");
   
   const goalScoreEl =
       $("goalScore");
   
   const accuracyScoreEl =
       $("accuracyScore");
   
   const consistencyScoreEl =
       $("consistencyScore");
   
   const completionScoreEl =
       $("completionScore");
   
   
   /* Personal best */
   
   const bestCPMEl =
       $("bestCPM");
   
   const bestWPMEl =
       $("bestWPM");
   
   const bestScoreEl =
       $("bestScore");
   
   const mostWordsEl =
       $("mostWords");
   
   const longestSessionEl =
       $("longestSession");
   
   
   /* Comparison */
   
   const comparisonWordsEl =
       $("comparisonWords");
   
   const comparisonCPMEl =
       $("comparisonCPM");
   
   const comparisonScoreEl =
       $("comparisonScore");
   
   const comparisonTimeEl =
       $("comparisonTime");
   
   const comparisonMessageEl =
       $("comparisonMessage");
   
   
   /* Share */
   
   const shareBtn =
       $("shareBtn");
   
   const shareScoreEl =
       $("shareScore");
   
   const shareTitleEl =
       $("shareTitle");
   
   const shareSummaryEl =
       $("shareSummary");
   
   
   /* Dictation */
   
   const dictationStatusEl =
       $("dictationStatus");
   
   const dictationCurrentWordEl =
       $("dictationCurrentWord");
   
   const dictationCountdownEl =
       $("dictationCountdown");
   
   const dictationWordNumberEl =
       $("dictationWordNumber");
   
   const dictationTotalWordsEl =
       $("dictationTotalWords");
   
   const dictationCharacterCountEl =
       $("dictationCharacterCount");
   
   const dictationWritingTimeEl =
       $("dictationWritingTime");
   
   const dictationSpeedEl =
       $("dictationSpeed");
   
   const dictationProgressTextEl =
       $("dictationProgressText");
   
   const dictationProgressBarEl =
       $("dictationProgressBar");
   
   const startDictationBtn =
       $("startDictation");
   
   const pauseDictationBtn =
       $("pauseDictation");
   
   const stopDictationBtn =
       $("stopDictation");
   
   const resetDictationBtn =
       $("resetDictation");
   
   const dictationSpeechRateEl =
       $("dictationSpeechRate");
   
   const dictationSpeechRateValueEl =
       $("dictationSpeechRateValue");
   
   const dictationExtraDelayEl =
       $("dictationExtraDelay");
   
   
   /* Settings */
   
   const themeToggle =
       $("themeToggle");
   
   const speedInput =
       $("speedInput");
   
   const readingSpeedInput =
       $("readingSpeedInput");
   
   const autoSaveToggle =
       $("autoSaveToggle");
   
   const autoTimerToggle =
       $("autoTimerToggle");
   
   const clearSavedDataBtn =
       $("clearSavedDataBtn");
   
   
   /* History */
   
   const historyListEl =
       $("historyList");
   
   const historyEmptyEl =
       $("historyEmpty");
   
   const clearHistoryBtn =
       $("clearHistoryBtn");
   
   
   /* =========================================================
      TIMER STATE
      ========================================================= */
   
   let timerRunning =
       false;
   
   let timerStartTimestamp =
       0;
   
   let elapsedMilliseconds =
       Number(
           appData.currentSession.elapsed
       ) || 0;
   
   let timerInterval =
       null;
   
   
   /* =========================================================
      ACTIVE WRITING DATA
      ========================================================= */
   
   let sessionSamples = [];
   
   let lastCharacterCount =
       getCharacterCount(
           paragraph.value
       );
   
   let lastSampleTimestamp =
       0;
   
   
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
      BASIC HELPERS
      ========================================================= */
   
   function escapeHTML(value) {
   
       return String(value)
   
           .replaceAll(
               "&",
               "&amp;"
           )
   
           .replaceAll(
               "<",
               "&lt;"
           )
   
           .replaceAll(
               ">",
               "&gt;"
           )
   
           .replaceAll(
               '"',
               "&quot;"
           )
   
           .replaceAll(
               "'",
               "&#039;"
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
           text.match(
               /\p{L}/gu
           ) || []
       ).length;
   }
   
   
   function getNumberCount(text) {
   
       return (
           text.match(
               /\p{N}/gu
           ) || []
       ).length;
   }
   
   
   function getSpaceCount(text) {
   
       return (
           text.match(
               /\s/g
           ) || []
       ).length;
   }
   
   
   function getPunctuationCount(text) {
   
       return (
           text.match(
               /[\p{P}\p{S}]/gu
           ) || []
       ).length;
   }
   
   
   function getCharacterCount(text) {
   
       /*
          Characters used for writing-time
          calculation:
   
          Letters + numbers
   
          Spaces and punctuation are
          displayed separately.
       */
   
       return (
           getLetterCount(text) +
           getNumberCount(text)
       );
   }
   
   
   function getSentenceArray(text) {
   
       return text
           .split(/[.!?]+/)
           .map(
               sentence =>
                   sentence.trim()
           )
           .filter(Boolean);
   }
   
   
   function formatTime(seconds) {
   
       seconds =
           Math.max(
               0,
               Math.floor(
                   Number(seconds) || 0
               )
           );
   
   
       const minutes =
           Math.floor(
               seconds / 60
           );
   
   
       const remaining =
           seconds % 60;
   
   
       return (
           minutes +
           ":" +
           String(
               remaining
           ).padStart(
               2,
               "0"
           )
       );
   }
   
   
   function formatDecimalTime(seconds) {
   
       return (
           Math.max(
               0,
               Number(seconds) || 0
           ).toFixed(2) +
           "s"
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
   
   
       const frequency = {};
   
   
       wordList.forEach(word => {
   
           const cleaned =
               word
   
                   .toLocaleLowerCase()
   
                   .replace(
                       /[^\p{L}\p{N}']/gu,
                       ""
                   );
   
   
           if (!cleaned) {
               return;
           }
   
   
           frequency[cleaned] =
               (
                   frequency[cleaned] ||
                   0
               ) + 1;
       });
   
   
       const uniqueWords =
           Object.keys(
               frequency
           ).length;
   
   
       const repeatedWords =
           Object.values(
               frequency
           ).filter(
               count =>
                   count > 1
           ).length;
   
   
       let longestWord =
           "—";
   
   
       wordList.forEach(word => {
   
           const cleaned =
               word.replace(
                   /[^\p{L}\p{N}]/gu,
                   ""
               );
   
   
           if (
               longestWord === "—" ||
               cleaned.length >
               longestWord.length
           ) {
   
               longestWord =
                   cleaned;
           }
       });
   
   
       const averageWordLength =
           wordList.length > 0
   
               ? characters /
                 wordList.length
   
               : 0;
   
   
       const sentenceWordCounts =
           sentences.map(
               sentence =>
                   getWords(
                       sentence
                   ).length
           );
   
   
       const averageSentenceLength =
           sentences.length > 0
   
               ? wordList.length /
                 sentences.length
   
               : 0;
   
   
       const longestSentence =
           sentenceWordCounts.length > 0
   
               ? Math.max(
                   ...sentenceWordCounts
               )
   
               : 0;
   
   
       const shortestSentence =
           sentenceWordCounts.length > 0
   
               ? Math.min(
                   ...sentenceWordCounts
               )
   
               : 0;
   
   
       let readability =
           "—";
   
   
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
                   (
                       averageWordChars /
                       100
                   )
               );
   
   
           if (score >= 90) {
   
               readability =
                   "Very Easy";
   
           } else if (score >= 80) {
   
               readability =
                   "Easy";
   
           } else if (score >= 70) {
   
               readability =
                   "Fairly Easy";
   
           } else if (score >= 60) {
   
               readability =
                   "Standard";
   
           } else if (score >= 50) {
   
               readability =
                   "Fairly Difficult";
   
           } else if (score >= 30) {
   
               readability =
                   "Difficult";
   
           } else {
   
               readability =
                   "Very Difficult";
           }
       }
   
   
       return {
   
           words:
               wordList.length,
   
           letters,
   
           numbers,
   
           characters,
   
           spaces,
   
           punctuation,
   
           sentences:
               sentences.length,
   
           paragraphs:
               text.trim()
                   ? text
                       .split(
                           /\n\s*\n/
                       )
                       .filter(Boolean)
                       .length
   
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
      ESTIMATED TIME
      ========================================================= */
   
   function calculateEstimatedSeconds(
       characters
   ) {
   
       const speed =
           Number(
               appData.settings.targetSpeed
           ) || 68;
   
   
       if (
           characters <= 0
       ) {
           return 0;
       }
   
   
       return (
           characters /
           speed
       ) * 60;
   }
   
   
   /* =========================================================
      UPDATE STATISTICS
      ========================================================= */
   
   function updateStatistics() {
   
       const text =
           paragraph.value;
   
   
       const data =
           analyzeText(
               text
           );
   
   
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
   
   
       $("charPreview").textContent =
           `${data.characters} letters + numbers`;
   
   
       updateTimeAnalysis(
           data
       );
   
   
       updateReadingTime(
           data
       );
   
   
       updateTextAnalysis(
           data
       );
   
   
       updateWordFrequency(
           data
       );
   
   
       updateGoal(
           data
       );
   
   
       updateSpeed();
   
   
       updateSessionScore(
           data
       );
   
   
       updatePersonalBestsPreview();
   
   
       updateSharePreview();
   
   
       if (
           appData.settings.autoSave
       ) {
   
           appData.paragraph =
               text;
   
           saveData();
       }
   }
   
   
   /* =========================================================
      TIME ANALYSIS
      ========================================================= */
   
   function updateTimeAnalysis(data) {
   
       const estimated =
           calculateEstimatedSeconds(
               data.characters
           );
   
   
       const actual =
           elapsedMilliseconds /
           1000;
   
   
       estimatedTimeEl.textContent =
           formatTime(
               estimated
           );
   
   
       actualTimeEl.textContent =
           formatTime(
               actual
           );
   
   
       const difference =
           Math.abs(
               actual -
               estimated
           );
   
   
       timeDifferenceEl.textContent =
           formatTime(
               difference
           );
   
   
       if (
           data.characters === 0
       ) {
   
           differenceLabelEl.textContent =
               "No paragraph yet";
   
       } else if (
           actual === 0
       ) {
   
           differenceLabelEl.textContent =
               "Start the timer to compare";
   
       } else if (
           actual > estimated
       ) {
   
           differenceLabelEl.textContent =
               "Slower than estimated";
   
       } else if (
           actual < estimated
       ) {
   
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
   
   function updateReadingTime(data) {
   
       const speed =
           Number(
               appData.settings.readingSpeed
           ) || 200;
   
   
       const seconds =
           data.words > 0
   
               ? (
                   data.words /
                   speed
               ) * 60
   
               : 0;
   
   
       readingTimeEl.textContent =
           formatTime(
               seconds
           );
   }
   
   
   /* =========================================================
      TEXT ANALYSIS UI
      ========================================================= */
   
   function updateTextAnalysis(data) {
   
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
   }
   
   
   /* =========================================================
      WORD FREQUENCY 2.0
      ========================================================= */
   
   function updateWordFrequency(data) {
   
       const entries =
           Object.entries(
               data.frequency
           );
   
   
       if (
           entries.length === 0
       ) {
   
           wordFrequencyEl.innerHTML =
               `
                   <div class="empty-state">
                       Start writing to see word frequency.
                   </div>
               `;
   
           return;
       }
   
   
       entries.sort(
           (a, b) =>
               b[1] - a[1] ||
               a[0].localeCompare(
                   b[0]
               )
       );
   
   
       const selected =
           frequencyMode === "top"
   
               ? entries.slice(
                   0,
                   10
               )
   
               : entries;
   
   
       const totalWords =
           data.words || 1;
   
   
       wordFrequencyEl.innerHTML =
           `
               <table class="frequency-table">
   
                   <thead>
   
                       <tr>
   
                           <th>Rank</th>
   
                           <th>Word</th>
   
                           <th>Count</th>
   
                           <th>Usage</th>
   
                       </tr>
   
                   </thead>
   
                   <tbody>
   
                       ${selected
                           .map(
                               (
                                   [word, count],
                                   index
                               ) => {
   
                                   const percentage =
                                       (
                                           count /
                                           totalWords
                                       ) *
                                       100;
   
   
                                   return `
   
                                       <tr>
   
                                           <td
                                               class="frequency-rank"
                                           >
                                               ${index + 1}
                                           </td>
   
                                           <td
                                               class="frequency-word"
                                           >
                                               ${escapeHTML(
                                                   word
                                               )}
                                           </td>
   
                                           <td
                                               class="frequency-count"
                                           >
                                               ${count}
                                           </td>
   
                                           <td
                                               class="frequency-percentage"
                                           >
                                               ${percentage.toFixed(1)}%
                                           </td>
   
                                       </tr>
   
                                   `;
                               }
                           )
                           .join("")}
   
                   </tbody>
   
               </table>
           `;
   }
   
   
   /* =========================================================
      WRITING SPEED
      ========================================================= */
   
   function getCurrentCPM() {
   
       const seconds =
           elapsedMilliseconds /
           1000;
   
   
       const characters =
           getCharacterCount(
               paragraph.value
           );
   
   
       if (
           seconds <= 0
       ) {
           return 0;
       }
   
   
       return (
           characters /
           seconds
       ) * 60;
   }
   
   
   function getCurrentWPM() {
   
       const seconds =
           elapsedMilliseconds /
           1000;
   
   
       const words =
           getWords(
               paragraph.value
           ).length;
   
   
       if (
           seconds <= 0
       ) {
           return 0;
       }
   
   
       return (
           words /
           seconds
       ) * 60;
   }
   
   
   function updateSpeed() {
   
       const cpm =
           getCurrentCPM();
   
   
       const wpm =
           getCurrentWPM();
   
   
       const target =
           Number(
               appData.settings.targetSpeed
           ) || 68;
   
   
       cpmEl.textContent =
           Math.round(
               cpm
           );
   
   
       wpmEl.textContent =
           Math.round(
               wpm
           );
   
   
       speedDifferenceEl.textContent =
           Math.round(
               cpm -
               target
           );
   
   
       targetSpeedEl.textContent =
           target;
   
   
       targetSpeedCardEl.textContent =
           target;
   
   
       chartCurrentSpeedEl.textContent =
           `${Math.round(cpm)} CPM`;
   }
   
   
   /* =========================================================
      TIMER
      ========================================================= */
   
   function startTimer() {
   
       if (
           timerRunning
       ) {
           return;
       }
   
   
       if (
           !appData.currentSession.started
       ) {
   
           appData.currentSession.started =
               true;
   
           appData.currentSession.completed =
               false;
   
           sessionSamples = [];
   
           lastCharacterCount =
               getCharacterCount(
                   paragraph.value
               );
   
           lastSampleTimestamp =
               Date.now();
       }
   
   
       timerRunning =
           true;
   
   
       timerStartTimestamp =
           Date.now() -
           elapsedMilliseconds;
   
   
       liveStatus.textContent =
           "Writing";
   
   
       timerInterval =
           setInterval(
               timerTick,
               100
           );
   
   
       updateTimerButtons();
   }
   
   
   function timerTick() {
   
       elapsedMilliseconds =
           Date.now() -
           timerStartTimestamp;
   
   
       appData.currentSession.elapsed =
           elapsedMilliseconds;
   
   
       updateTimerDisplay();
   
   
       updateTimeAnalysis(
           analyzeText(
               paragraph.value
           )
       );
   
   
       updateSpeed();
   
   
       updateSessionScore(
           analyzeText(
               paragraph.value
           )
       );
   
   
       captureSpeedSample();
   
   
       if (
           appData.settings.autoSave
       ) {
   
           saveData();
       }
   }
   
   
   function pauseTimer() {
   
       if (
           !timerRunning
       ) {
           return;
       }
   
   
       elapsedMilliseconds =
           Date.now() -
           timerStartTimestamp;
   
   
       timerRunning =
           false;
   
   
       clearInterval(
           timerInterval
       );
   
   
       timerInterval =
           null;
   
   
       appData.currentSession.elapsed =
           elapsedMilliseconds;
   
   
       liveStatus.textContent =
           "Paused";
   
   
       saveData();
   
   
       updateTimerButtons();
   
   
       updateTimerDisplay();
   
       updateSpeed();
   
       updateSessionScore(
           analyzeText(
               paragraph.value
           )
       );
   }
   
   
   function resetTimer() {
   
       /*
          Finish and save the session.
       */
   
       if (
           paragraph.value.trim() &&
           elapsedMilliseconds > 0
       ) {
   
           saveSession();
       }
   
   
       timerRunning =
           false;
   
   
       clearInterval(
           timerInterval
       );
   
   
       timerInterval =
           null;
   
   
       elapsedMilliseconds =
           0;
   
   
       sessionSamples = [];
   
   
       appData.currentSession = {
   
           elapsed: 0,
   
           started: false,
   
           completed: false
   
       };
   
   
       updateTimerDisplay();
   
   
       updateSpeed();
   
   
       updateTimeAnalysis(
           analyzeText(
               paragraph.value
           )
       );
   
   
       updateSessionScore(
           analyzeText(
               paragraph.value
           )
       );
   
   
       liveStatus.textContent =
           "Ready";
   
   
       updateTimerButtons();
   
   
       saveData();
   }
   
   
   function updateTimerDisplay() {
   
       stopwatchEl.textContent =
           formatTime(
               elapsedMilliseconds /
               1000
           );
   }
   
   
   function updateTimerButtons() {
   
       startTimerBtn.disabled =
           timerRunning;
   
   
       pauseTimerBtn.disabled =
           !timerRunning;
   }
   
   
   /* =========================================================
      REAL-TIME CPM SAMPLING
      ========================================================= */
   
   function captureSpeedSample() {
   
       const now =
           Date.now();
   
   
       if (
           lastSampleTimestamp === 0
       ) {
   
           lastSampleTimestamp =
               now;
   
           return;
       }
   
   
       const deltaTime =
           now -
           lastSampleTimestamp;
   
   
       if (
           deltaTime < 900
       ) {
           return;
       }
   
   
       const currentCharacters =
           getCharacterCount(
               paragraph.value
           );
   
   
       const added =
           Math.max(
               0,
               currentCharacters -
               lastCharacterCount
           );
   
   
       const cpm =
           (
               added /
               (
                   deltaTime /
                   1000
               )
           ) * 60;
   
   
       /*
          Only record reasonable samples.
   
          This prevents a huge CPM spike when
          a user pastes an entire paragraph.
       */
   
       if (
           cpm >= 0 &&
           cpm <= 1000
       ) {
   
           sessionSamples.push({
   
               time:
                   elapsedMilliseconds /
                   1000,
   
               cpm
   
           });
       }
   
   
       lastCharacterCount =
           currentCharacters;
   
   
       lastSampleTimestamp =
           now;
   
   
       drawPerformanceChart();
   }
   
   
   /* =========================================================
      CPM GRAPH
      ========================================================= */
   
   function drawPerformanceChart() {
   
       const canvas =
           $("performanceCanvas");
   
   
       if (!canvas) {
           return;
       }
   
   
       const rect =
           canvas.getBoundingClientRect();
   
   
       const width =
           Math.max(
               250,
               rect.width
           );
   
   
       const height =
           250;
   
   
       const dpr =
           window.devicePixelRatio ||
           1;
   
   
       canvas.width =
           width * dpr;
   
   
       canvas.height =
           height * dpr;
   
   
       const ctx =
           canvas.getContext(
               "2d"
           );
   
   
       ctx.setTransform(
           dpr,
           0,
           0,
           dpr,
           0,
           0
       );
   
   
       ctx.clearRect(
           0,
           0,
           width,
           height
       );
   
   
       const styles =
           getComputedStyle(
               document.body
           );
   
   
       const border =
           styles
               .getPropertyValue(
                   "--border"
               )
               .trim();
   
   
       const muted =
           styles
               .getPropertyValue(
                   "--muted"
               )
               .trim();
   
   
       const primary =
           styles
               .getPropertyValue(
                   "--primary"
               )
               .trim();
   
   
       const padding =
           35;
   
   
       const chartWidth =
           width -
           padding * 2;
   
   
       const chartHeight =
           height -
           padding * 2;
   
   
       /* Grid */
   
       ctx.strokeStyle =
           border;
   
   
       ctx.lineWidth =
           1;
   
   
       for (
           let i = 0;
           i <= 4;
           i++
       ) {
   
           const y =
               padding +
               (
                   chartHeight *
                   i /
                   4
               );
   
   
           ctx.beginPath();
   
           ctx.moveTo(
               padding,
               y
           );
   
           ctx.lineTo(
               width -
               padding,
               y
           );
   
           ctx.stroke();
       }
   
   
       const samples =
           sessionSamples;
   
   
       if (
           samples.length === 0
       ) {
   
           ctx.fillStyle =
               muted;
   
           ctx.font =
               "12px system-ui";
   
           ctx.textAlign =
               "center";
   
           ctx.fillText(
               "Start writing to see your CPM graph.",
               width / 2,
               height / 2
           );
   
           return;
       }
   
   
       const maxCPM =
           Math.max(
               100,
               Number(
                   appData.settings.targetSpeed
               ) || 68,
               ...samples.map(
                   sample =>
                       sample.cpm
               )
           );
   
   
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
               maxCPM
           );
   
   
       ctx.setLineDash(
           [
               5,
               5
           ]
       );
   
   
       ctx.strokeStyle =
           muted;
   
   
       ctx.beginPath();
   
       ctx.moveTo(
           padding,
           targetY
       );
   
       ctx.lineTo(
           width -
           padding,
           targetY
       );
   
       ctx.stroke();
   
   
       ctx.setLineDash([]);
   
   
       /* Main line */
   
       const maxTime =
           Math.max(
               1,
               ...samples.map(
                   sample =>
                       sample.time
               )
           );
   
   
       ctx.strokeStyle =
           primary;
   
   
       ctx.lineWidth =
           3;
   
   
       ctx.beginPath();
   
   
       samples.forEach(
           (
               sample,
               index
           ) => {
   
               const x =
                   padding +
                   (
                       sample.time /
                       maxTime
                   ) *
                   chartWidth;
   
   
               const y =
                   padding +
                   chartHeight *
                   (
                       1 -
                       sample.cpm /
                       maxCPM
                   );
   
   
               if (
                   index === 0
               ) {
   
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
   
       ctx.fillStyle =
           primary;
   
   
       samples.forEach(
           sample => {
   
               const x =
                   padding +
                   (
                       sample.time /
                       maxTime
                   ) *
                   chartWidth;
   
   
               const y =
                   padding +
                   chartHeight *
                   (
                       1 -
                       sample.cpm /
                       maxCPM
                   );
   
   
               ctx.beginPath();
   
               ctx.arc(
                   x,
                   y,
                   3,
                   0,
                   Math.PI * 2
               );
   
               ctx.fill();
           }
       );
   
   
       /* Y labels */
   
       ctx.fillStyle =
           muted;
   
       ctx.font =
           "10px system-ui";
   
       ctx.textAlign =
           "right";
   
   
       for (
           let i = 0;
           i <= 4;
           i++
       ) {
   
           const value =
               Math.round(
                   maxCPM *
                   (
                       1 -
                       i / 4
                   )
               );
   
   
           const y =
               padding +
               (
                   chartHeight *
                   i /
                   4
               );
   
   
           ctx.fillText(
               value,
               padding - 7,
               y + 3
           );
       }
   }
   
   
   /* =========================================================
      GOAL
      ========================================================= */
   
   function updateGoal(data) {
   
       const target =
           Math.max(
               1,
               Number(
                   appData.goal.target
               ) || 1
           );
   
   
       let current =
           0;
   
   
       let unit =
           "words";
   
   
       if (
           appData.goal.type ===
           "letters"
       ) {
   
           current =
               data.letters;
   
           unit =
               "letters";
   
       } else if (
           appData.goal.type ===
           "characters"
       ) {
   
           current =
               data.characters;
   
           unit =
               "characters";
   
       } else {
   
           current =
               data.words;
   
           unit =
               "words";
       }
   
   
       const percentage =
           Math.min(
               100,
               (
                   current /
                   target
               ) * 100
           );
   
   
       goalProgressTextEl.textContent =
           `${current} / ${target} ${unit}`;
   
   
       goalPercentageEl.textContent =
           `${Math.round(
               percentage
           )}%`;
   
   
       goalProgressBarEl.style.width =
           `${percentage}%`;
   
   
       if (
           current >= target
       ) {
   
           goalStatusEl.textContent =
               "🎉 Goal completed!";
   
       } else {
   
           goalStatusEl.textContent =
               `${target - current} ${unit} remaining to reach your goal.`;
       }
   }
   
   
   function setGoal() {
   
       const type =
           goalTypeEl.value;
   
   
       let target =
           Number(
               goalTargetEl.value
           );
   
   
       if (
           !Number.isFinite(
               target
           ) ||
           target < 1
       ) {
   
           target =
               1;
   
           goalTargetEl.value =
               1;
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
   
   
       updateSessionScore(
           analyzeText(
               paragraph.value
           )
       );
   }
   
   
   /* =========================================================
      SESSION SCORE 2.0
      ========================================================= */
   
   function calculateScore(data) {
   
       /*
          TOTAL = 100
   
          Speed        30
          Goal         25
          Accuracy     20
          Consistency  15
          Completion   10
       */
   
   
       const actualSeconds =
           elapsedMilliseconds /
           1000;
   
   
       const targetCPM =
           Number(
               appData.settings.targetSpeed
           ) || 68;
   
   
       const actualCPM =
           getCurrentCPM();
   
   
       /* -----------------------------------------
          1. SPEED — 30
          ----------------------------------------- */
   
       let speedScore =
           0;
   
   
       if (
           actualCPM > 0
       ) {
   
           speedScore =
               Math.min(
                   30,
                   Math.round(
                       (
                           actualCPM /
                           targetCPM
                       ) * 30
                   )
               );
       }
   
   
       /* -----------------------------------------
          2. GOAL — 25
          ----------------------------------------- */
   
       const goalTarget =
           Math.max(
               1,
               Number(
                   appData.goal.target
               ) || 1
           );
   
   
       let goalCurrent =
           0;
   
   
       if (
           appData.goal.type ===
           "letters"
       ) {
   
           goalCurrent =
               data.letters;
   
       } else if (
           appData.goal.type ===
           "characters"
       ) {
   
           goalCurrent =
               data.characters;
   
       } else {
   
           goalCurrent =
               data.words;
       }
   
   
       const goalPercentage =
           Math.min(
               1,
               goalCurrent /
               goalTarget
           );
   
   
       const goalScore =
           Math.round(
               goalPercentage *
               25
           );
   
   
       /* -----------------------------------------
          3. TIME ACCURACY — 20
          ----------------------------------------- */
   
       let accuracyScore =
           0;
   
   
       const estimatedSeconds =
           calculateEstimatedSeconds(
               data.characters
           );
   
   
       if (
           actualSeconds > 0 &&
           estimatedSeconds > 0
       ) {
   
           const difference =
               Math.abs(
                   actualSeconds -
                   estimatedSeconds
               );
   
   
           const differenceRatio =
               difference /
               estimatedSeconds;
   
   
           if (
               differenceRatio <= 0.05
           ) {
   
               accuracyScore =
                   20;
   
           } else if (
               differenceRatio <= 0.10
           ) {
   
               accuracyScore =
                   18;
   
           } else if (
               differenceRatio <= 0.15
           ) {
   
               accuracyScore =
                   16;
   
           } else if (
               differenceRatio <= 0.20
           ) {
   
               accuracyScore =
                   14;
   
           } else if (
               differenceRatio <= 0.30
           ) {
   
               accuracyScore =
                   10;
   
           } else if (
               differenceRatio <= 0.50
           ) {
   
               accuracyScore =
                   6;
   
           } else {
   
               accuracyScore =
                   2;
           }
       }
   
   
       /* -----------------------------------------
          4. CONSISTENCY — 15
          ----------------------------------------- */
   
       let consistencyScore =
           0;
   
   
       if (
           sessionSamples.length >= 2
       ) {
   
           const values =
               sessionSamples.map(
                   sample =>
                       sample.cpm
               );
   
   
           const average =
               values.reduce(
                   (
                       total,
                       value
                   ) =>
                       total + value,
                   0
               ) /
               values.length;
   
   
           if (
               average > 0
           ) {
   
               const variance =
                   values.reduce(
                       (
                           total,
                           value
                       ) =>
                           total +
                           Math.pow(
                               value -
                               average,
                               2
                           ),
                       0
                   ) /
                   values.length;
   
   
               const standardDeviation =
                   Math.sqrt(
                       variance
                   );
   
   
               const coefficient =
                   standardDeviation /
                   average;
   
   
               if (
                   coefficient <= 0.05
               ) {
   
                   consistencyScore =
                       15;
   
               } else if (
                   coefficient <= 0.10
               ) {
   
                   consistencyScore =
                       13;
   
               } else if (
                   coefficient <= 0.15
               ) {
   
                   consistencyScore =
                       11;
   
               } else if (
                   coefficient <= 0.20
               ) {
   
                   consistencyScore =
                       9;
   
               } else if (
                   coefficient <= 0.30
               ) {
   
                   consistencyScore =
                       6;
   
               } else {
   
                   consistencyScore =
                       3;
               }
           }
       }
   
   
       /* -----------------------------------------
          5. COMPLETION — 10
          ----------------------------------------- */
   
       let completionScore =
           0;
   
   
       if (
           data.characters > 0
       ) {
   
           completionScore =
               5;
       }
   
   
       if (
           appData.currentSession.completed
       ) {
   
           completionScore =
               10;
       }
   
   
       const total =
           Math.min(
               100,
               speedScore +
               goalScore +
               accuracyScore +
               consistencyScore +
               completionScore
           );
   
   
       return {
   
           total,
   
           speedScore,
   
           goalScore,
   
           accuracyScore,
   
           consistencyScore,
   
           completionScore
       };
   }
   
   
   function updateSessionScore(data) {
   
       const score =
           calculateScore(
               data
           );
   
   
       sessionScoreEl.textContent =
           score.total;
   
   
       speedScoreEl.textContent =
           `${score.speedScore}/30`;
   
   
       goalScoreEl.textContent =
           `${score.goalScore}/25`;
   
   
       accuracyScoreEl.textContent =
           `${score.accuracyScore}/20`;
   
   
       consistencyScoreEl.textContent =
           `${score.consistencyScore}/15`;
   
   
       completionScoreEl.textContent =
           `${score.completionScore}/10`;
   
   
       let message =
           "Start writing to calculate your score.";
   
   
       if (
           score.total >= 90
       ) {
   
           message =
               "🔥 Exceptional performance!";
   
       } else if (
           score.total >= 80
       ) {
   
           message =
               "⭐ Excellent performance!";
   
       } else if (
           score.total >= 70
       ) {
   
           message =
               "👍 Good performance!";
   
       } else if (
           score.total >= 60
       ) {
   
           message =
               "Keep going — you're improving.";
   
       } else if (
           score.total >= 40
       ) {
   
           message =
               "A solid start. Keep practicing.";
   
       } else if (
           data.characters > 0
       ) {
   
           message =
               "Keep practicing to improve your score.";
       }
   
   
       scoreMessageEl.textContent =
           message;
   }
   
   
   /* =========================================================
      SESSION SAVE
      ========================================================= */
   
   function saveSession() {
   
       const data =
           analyzeText(
               paragraph.value
           );
   
   
       if (
           data.characters <= 0
       ) {
           return;
       }
   
   
       const seconds =
           elapsedMilliseconds /
           1000;
   
   
       if (
           seconds <= 0
       ) {
           return;
       }
   
   
       /*
          Mark session complete BEFORE
          calculating the final score.
       */
   
       appData.currentSession.completed =
           true;
   
   
       const finalScore =
           calculateScore(
               data
           );
   
   
       const session = {
   
           id:
               Date.now(),
   
           date:
               new Date().toISOString(),
   
           preview:
               paragraph.value
                   .replace(
                       /\s+/g,
                       " "
                   )
                   .trim()
                   .slice(
                       0,
                       100
                   ),
   
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
   
           cpm:
               getCurrentCPM(),
   
           wpm:
               getCurrentWPM(),
   
           score:
               finalScore.total,
   
           speedScore:
               finalScore.speedScore,
   
           goalScore:
               finalScore.goalScore,
   
           accuracyScore:
               finalScore.accuracyScore,
   
           consistencyScore:
               finalScore.consistencyScore,
   
           completionScore:
               finalScore.completionScore
       };
   
   
       appData.history.unshift(
           session
       );
   
   
       appData.history =
           appData.history.slice(
               0,
               50
           );
   
   
       updateSessionScore(
           data
       );
   
   
       renderHistory();
   
       updatePersonalBests();
   
       updateComparison();
   
       updateSharePreview();
   
       drawPerformanceChart();
   
   
       saveData();
   }
   
   
   /* =========================================================
      PERSONAL BESTS
      ========================================================= */
   
   function updatePersonalBests() {
   
       const history =
           appData.history;
   
   
       if (
           history.length === 0
       ) {
   
           bestCPMEl.textContent =
               "0";
   
           bestWPMEl.textContent =
               "0";
   
           bestScoreEl.textContent =
               "0";
   
           mostWordsEl.textContent =
               "0";
   
           longestSessionEl.textContent =
               "0:00";
   
           return;
       }
   
   
       const bestCPM =
           Math.max(
               ...history.map(
                   session =>
                       Number(
                           session.cpm
                       ) || 0
               )
           );
   
   
       const bestWPM =
           Math.max(
               ...history.map(
                   session =>
                       Number(
                           session.wpm
                       ) || 0
               )
           );
   
   
       const bestScore =
           Math.max(
               ...history.map(
                   session =>
                       Number(
                           session.score
                       ) || 0
               )
           );
   
   
       const mostWords =
           Math.max(
               ...history.map(
                   session =>
                       Number(
                           session.words
                       ) || 0
               )
           );
   
   
       const longestSession =
           Math.max(
               ...history.map(
                   session =>
                       Number(
                           session.time
                       ) || 0
               )
           );
   
   
       bestCPMEl.textContent =
           Math.round(
               bestCPM
           );
   
   
       bestWPMEl.textContent =
           Math.round(
               bestWPM
           );
   
   
       bestScoreEl.textContent =
           Math.round(
               bestScore
           );
   
   
       mostWordsEl.textContent =
           mostWords;
   
   
       longestSessionEl.textContent =
           formatTime(
               longestSession
           );
   }
   
   
   function updatePersonalBestsPreview() {
   
       updatePersonalBests();
   }
   
   
   /* =========================================================
      SESSION COMPARISON
      ========================================================= */
   
   function updateComparison() {
   
       if (
           appData.history.length < 2
       ) {
   
           comparisonWordsEl.textContent =
               "—";
   
           comparisonCPMEl.textContent =
               "—";
   
           comparisonScoreEl.textContent =
               "—";
   
           comparisonTimeEl.textContent =
               "—";
   
           comparisonMessageEl.textContent =
               "Complete at least two sessions to compare your performance.";
   
           return;
       }
   
   
       const current =
           appData.history[0];
   
   
       const previous =
           appData.history[1];
   
   
       const wordDifference =
           current.words -
           previous.words;
   
   
       const cpmDifference =
           current.cpm -
           previous.cpm;
   
   
       const scoreDifference =
           current.score -
           previous.score;
   
   
       const timeDifference =
           current.time -
           previous.time;
   
   
       comparisonWordsEl.textContent =
           formatSigned(
               wordDifference
           );
   
   
       comparisonCPMEl.textContent =
           formatSigned(
               Math.round(
                   cpmDifference
               )
           );
   
   
       comparisonScoreEl.textContent =
           formatSigned(
               Math.round(
                   scoreDifference
               )
           );
   
   
       comparisonTimeEl.textContent =
           formatSignedTime(
               timeDifference
           );
   
   
       let improvements =
           0;
   
   
       if (
           wordDifference > 0
       ) {
           improvements++;
       }
   
   
       if (
           cpmDifference > 0
       ) {
           improvements++;
       }
   
   
       if (
           scoreDifference > 0
       ) {
           improvements++;
       }
   
   
       /*
          For time, lower can be better,
          but only when the user maintained
          or increased output.
       */
   
       if (
           timeDifference < 0 &&
           wordDifference >= 0
       ) {
   
           improvements++;
       }
   
   
       if (
           improvements >= 3
       ) {
   
           comparisonMessageEl.textContent =
               "🔥 Strong improvement compared with your previous session.";
   
       } else if (
           improvements === 2
       ) {
   
           comparisonMessageEl.textContent =
               "📈 You're improving in several areas.";
   
       } else if (
           improvements === 1
       ) {
   
           comparisonMessageEl.textContent =
               "👍 You improved in one major area.";
   
       } else {
   
           comparisonMessageEl.textContent =
               "Keep practicing — consistency will improve your results.";
       }
   }
   
   
   function formatSigned(value) {
   
       value =
           Number(value) || 0;
   
   
       if (
           value > 0
       ) {
   
           return `+${value}`;
   
       }
   
   
       return String(
           value
       );
   }
   
   
   function formatSignedTime(seconds) {
   
       seconds =
           Number(seconds) || 0;
   
   
       if (
           seconds === 0
       ) {
           return "0:00";
       }
   
   
       const prefix =
           seconds > 0
               ? "+"
               : "−";
   
   
       return (
           prefix +
           formatTime(
               Math.abs(
                   seconds
               )
           )
       );
   }
   
   
   /* =========================================================
      SHARE
      ========================================================= */
   
   function updateSharePreview() {
   
       if (
           appData.history.length === 0
       ) {
   
           shareScoreEl.textContent =
               "0";
   
           shareTitleEl.textContent =
               "Writing Time Session";
   
           shareSummaryEl.textContent =
               "Complete a session to generate your result.";
   
           return;
       }
   
   
       const session =
           appData.history[0];
   
   
       shareScoreEl.textContent =
           session.score;
   
   
       shareTitleEl.textContent =
           "Writing Time Session";
   
   
       shareSummaryEl.textContent =
           `${session.words} words • ` +
           `${Math.round(
               session.cpm
           )} CPM • ` +
           `${formatTime(
               session.time
           )} • ` +
           `${session.score}/100`;
   }
   
   
   function getShareText() {
   
       if (
           appData.history.length === 0
       ) {
   
           return "I haven't completed a Writing Time session yet.";
       }
   
   
       const session =
           appData.history[0];
   
   
       return `
   Writing Time — Session Result
   
   Score: ${session.score}/100
   Words: ${session.words}
   Characters: ${session.characters}
   Speed: ${Math.round(session.cpm)} CPM
   WPM: ${Math.round(session.wpm)}
   Time: ${formatTime(session.time)}
   
   Try Writing Time!
   `.trim();
   }
   
   
   async function shareResult() {
   
       const text =
           getShareText();
   
   
       if (
           navigator.share
       ) {
   
           try {
   
               await navigator.share({
   
                   title:
                       "Writing Time Result",
   
                   text
   
               });
   
   
               liveStatus.textContent =
                   "Result shared";
   
   
               return;
   
           } catch (error) {
   
               /*
                  User may have cancelled
                  the native share dialog.
               */
   
               if (
                   error.name ===
                   "AbortError"
               ) {
   
                   return;
               }
           }
       }
   
   
       try {
   
           await navigator.clipboard.writeText(
               text
           );
   
   
           liveStatus.textContent =
               "Result copied";
   
   
           alert(
               "Your result has been copied to the clipboard."
           );
   
       } catch (error) {
   
           alert(
               text
           );
       }
   }
   
   
   /* =========================================================
      HISTORY UI
      ========================================================= */
   
   function renderHistory() {
   
       if (
           appData.history.length === 0
       ) {
   
           historyListEl.innerHTML =
               "";
   
           historyEmptyEl.style.display =
               "block";
   
           return;
       }
   
   
       historyEmptyEl.style.display =
           "none";
   
   
       historyListEl.innerHTML =
           appData.history
               .map(
                   session => {
   
                       const date =
                           new Date(
                               session.date
                           );
   
   
                       return `
   
                           <div
                               class="history-item"
                           >
   
                               <div
                                   class="history-item-title"
                               >
                                   ${escapeHTML(
                                       session.preview ||
                                       "Writing session"
                                   )}
                               </div>
   
   
                               <div
                                   class="history-item-data"
                               >
   
                                   <span>
                                       Words
                                   </span>
   
                                   <strong>
                                       ${session.words}
                                   </strong>
   
                               </div>
   
   
                               <div
                                   class="history-item-data"
                               >
   
                                   <span>
                                       Speed
                                   </span>
   
                                   <strong>
                                       ${Math.round(
                                           session.cpm
                                       )} CPM
                                   </strong>
   
                               </div>
   
   
                               <div
                                   class="history-item-data"
                               >
   
                                   <span>
                                       Score
                                   </span>
   
                                   <strong>
                                       ${session.score}/100
                                   </strong>
   
                               </div>
   
   
                               <div
                                   class="history-item-data"
                               >
   
                                   <span>
                                       Time
                                   </span>
   
                                   <strong>
                                       ${formatTime(
                                           session.time
                                       )}
                                   </strong>
   
                               </div>
   
   
                               <div
                                   class="history-item-data"
                               >
   
                                   <span>
                                       Date
                                   </span>
   
                                   <strong>
                                       ${date.toLocaleDateString()}
                                   </strong>
   
                               </div>
   
   
                               <button
                                   class="history-delete"
                                   type="button"
                                   data-id="${session.id}"
                                   title="Delete session"
                               >
                                   ×
                               </button>
   
                           </div>
   
                       `;
                   }
               )
               .join("");
   }
   
   
   function deleteHistoryItem(id) {
   
       appData.history =
           appData.history.filter(
               session =>
                   String(
                       session.id
                   ) !==
                   String(id)
           );
   
   
       saveData();
   
   
       renderHistory();
   
       updatePersonalBests();
   
       updateComparison();
   
       updateSharePreview();
   }
   
   
   /* =========================================================
      DICTATION
      ========================================================= */
   
   function prepareDictation() {
   
       dictationWords =
           getWords(
               paragraph.value
           );
   
   
       dictationIndex =
           0;
   
   
       updateDictationUI();
   }
   
   
   function calculateWordWritingTime(word) {
   
       const characters =
           getCharacterCount(
               word
           );
   
   
       const speed =
           Number(
               appData.settings.targetSpeed
           ) || 68;
   
   
       const extraDelay =
           Number(
               appData.settings.extraDelay
           ) || 0;
   
   
       if (
           characters <= 0
       ) {
   
           return extraDelay;
       }
   
   
       return (
           characters /
           speed
       ) * 60 +
       extraDelay;
   }
   
   
   function updateDictationUI() {
   
       const total =
           dictationWords.length;
   
   
       dictationTotalWordsEl.textContent =
           total;
   
   
       if (
           total === 0
       ) {
   
           dictationCurrentWordEl.textContent =
               "—";
   
           dictationWordNumberEl.textContent =
               "0";
   
           dictationCharacterCountEl.textContent =
               "0";
   
           dictationWritingTimeEl.textContent =
               "0.00s";
   
           dictationProgressTextEl.textContent =
               "0%";
   
           dictationProgressBarEl.style.width =
               "0%";
   
           return;
       }
   
   
       if (
           dictationIndex >= total
       ) {
   
           dictationCurrentWordEl.textContent =
               "Complete 🎉";
   
           dictationWordNumberEl.textContent =
               total;
   
           dictationCharacterCountEl.textContent =
               "0";
   
           dictationWritingTimeEl.textContent =
               "0.00s";
   
           dictationProgressTextEl.textContent =
               "100%";
   
           dictationProgressBarEl.style.width =
               "100%";
   
           return;
       }
   
   
       const word =
           dictationWords[
               dictationIndex
           ];
   
   
       const characters =
           getCharacterCount(
               word
           );
   
   
       const writingTime =
           calculateWordWritingTime(
               word
           );
   
   
       const progress =
           (
               dictationIndex /
               total
           ) * 100;
   
   
       dictationCurrentWordEl.textContent =
           word;
   
   
       dictationWordNumberEl.textContent =
           dictationIndex + 1;
   
   
       dictationCharacterCountEl.textContent =
           characters;
   
   
       dictationWritingTimeEl.textContent =
           formatDecimalTime(
               writingTime
           );
   
   
       dictationSpeedEl.textContent =
           appData.settings.targetSpeed;
   
   
       dictationProgressTextEl.textContent =
           `${Math.round(
               progress
           )}%`;
   
   
       dictationProgressBarEl.style.width =
           `${progress}%`;
   }
   
   
   function speakWord(word) {
   
       if (
           !("speechSynthesis" in window)
       ) {
   
           alert(
               "Speech synthesis is not supported by this browser."
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
   
   
       utterance.pitch =
           1;
   
   
       utterance.volume =
           1;
   
   
       window.speechSynthesis.speak(
           utterance
       );
   }
   
   
   function startDictation() {
   
       if (
           dictationRunning
       ) {
   
           if (
               dictationPaused
           ) {
   
               dictationPaused =
                   false;
   
               processCurrentDictationWord();
           }
   
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
   
           dictationIndex =
               0;
       }
   
   
       dictationRunning =
           true;
   
   
       dictationPaused =
           false;
   
   
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
           writingSeconds *
           1000;
   
   
       updateDictationUI();
   
   
       dictationStatusEl.textContent =
           "Speaking";
   
   
       speakWord(
           word
       );
   
   
       const speechDelay =
           Math.max(
               450,
               (
                   word.length *
                   70
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
   
   
       const start =
           Date.now();
   
   
       const duration =
           dictationRemainingMilliseconds;
   
   
       clearInterval(
           dictationCountdownInterval
       );
   
   
       dictationCountdownInterval =
           setInterval(
               () => {
   
                   const elapsed =
                       Date.now() -
                       start;
   
   
                   dictationRemainingMilliseconds =
                       Math.max(
                           0,
                           duration -
                           elapsed
                       );
   
   
                   dictationCountdownEl.textContent =
                       `${(
                           dictationRemainingMilliseconds /
                           1000
                       ).toFixed(2)}s`;
   
   
                   if (
                       dictationRemainingMilliseconds <=
                       0
                   ) {
   
                       clearInterval(
                           dictationCountdownInterval
                       );
   
   
                       dictationIndex++;
   
   
                       dictationCountdownEl.textContent =
                           "0.00s";
   
   
                       updateDictationUI();
   
   
                       setTimeout(
                           processCurrentDictationWord,
                           150
                       );
                   }
   
               },
               30
           );
   }
   
   
   function pauseDictation() {
   
       if (
           !dictationRunning
       ) {
           return;
       }
   
   
       dictationPaused =
           true;
   
   
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
   
       dictationRunning =
           false;
   
   
       dictationPaused =
           false;
   
   
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
   
   
       dictationWords =
           [];
   
   
       dictationIndex =
           0;
   
   
       dictationRemainingMilliseconds =
           0;
   
   
       dictationStatusEl.textContent =
           "Ready";
   
   
       prepareDictation();
   }
   
   
   function finishDictation() {
   
       dictationRunning =
           false;
   
   
       dictationPaused =
           false;
   
   
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
   
   
       dictationIndex =
           dictationWords.length;
   
   
       updateDictationUI();
   }
   
   
   /* =========================================================
      SETTINGS
      ========================================================= */
   
   function loadSettings() {
   
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
   }
   
   
   function saveSettings() {
   
       const targetSpeed =
           Number(
               speedInput.value
           );
   
   
       const readingSpeed =
           Number(
               readingSpeedInput.value
           );
   
   
       if (
           Number.isFinite(
               targetSpeed
           ) &&
           targetSpeed > 0
       ) {
   
           appData.settings.targetSpeed =
               targetSpeed;
       }
   
   
       if (
           Number.isFinite(
               readingSpeed
           ) &&
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
   
   
       drawPerformanceChart();
   }
   
   
   /* =========================================================
      THEME
      ========================================================= */
   
   function applyTheme() {
   
       document.body.classList.toggle(
           "dark",
           appData.theme === "dark"
       );
   
   
       themeToggle.textContent =
           appData.theme === "dark"
               ? "☀️"
               : "🌙";
   
   
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
      CLEAR PARAGRAPH
      ========================================================= */
   
   function clearParagraph() {
   
       paragraph.value =
           "";
   
   
       appData.paragraph =
           "";
   
   
       resetTimer();
   
   
       stopDictation();
   
   
       dictationWords =
           [];
   
   
       dictationIndex =
           0;
   
   
       sessionSamples =
           [];
   
   
       updateStatistics();
   
   
       prepareDictation();
   
   
       liveStatus.textContent =
           "Ready";
   
   
       saveData();
   }
   
   
   /* =========================================================
      CLEAR ALL DATA
      ========================================================= */
   
   function clearAllSavedData() {
   
       const confirmed =
           confirm(
               "Delete all Writing Time data, including your paragraph, history, settings and goals?"
           );
   
   
       if (
           !confirmed
       ) {
           return;
       }
   
   
       localStorage.removeItem(
           STORAGE_KEY
       );
   
   
       appData =
           deepClone(
               defaultData
           );
   
   
       elapsedMilliseconds =
           0;
   
   
       timerRunning =
           false;
   
   
       clearInterval(
           timerInterval
       );
   
   
       timerInterval =
           null;
   
   
       paragraph.value =
           "";
   
   
       sessionSamples =
           [];
   
   
       loadSettings();
   
       applyTheme();
   
       updateTimerDisplay();
   
       updateStatistics();
   
       renderHistory();
   
       updateComparison();
   
       updatePersonalBests();
   
       prepareDictation();
   
   
       liveStatus.textContent =
           "Data cleared";
   }
   
   
   /* =========================================================
      EVENT LISTENERS
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
   
   
           if (
               !timerRunning
           ) {
   
               drawPerformanceChart();
           }
   
   
           saveData();
       }
   );
   
   
   calculateBtn.addEventListener(
       "click",
       () => {
   
           updateStatistics();
   
           prepareDictation();
   
           liveStatus.textContent =
               "Calculated";
       }
   );
   
   
   clearBtn.addEventListener(
       "click",
       clearParagraph
   );
   
   
   /* Timer */
   
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
       resetTimer
   );
   
   
   /* Frequency */
   
   topWordsBtn.addEventListener(
       "click",
       () => {
   
           frequencyMode =
               "top";
   
   
           topWordsBtn.classList.add(
               "active"
           );
   
   
           allWordsBtn.classList.remove(
               "active"
           );
   
   
           updateWordFrequency(
               analyzeText(
                   paragraph.value
               )
           );
       }
   );
   
   
   allWordsBtn.addEventListener(
       "click",
       () => {
   
           frequencyMode =
               "all";
   
   
           allWordsBtn.classList.add(
               "active"
           );
   
   
           topWordsBtn.classList.remove(
               "active"
           );
   
   
           updateWordFrequency(
               analyzeText(
                   paragraph.value
               )
           );
       }
   );
   
   
   /* Goal */
   
   setGoalBtn.addEventListener(
       "click",
       setGoal
   );
   
   
   /* Theme */
   
   themeToggle.addEventListener(
       "click",
       toggleTheme
   );
   
   
   /* Dictation */
   
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
   
   
   /* Speech rate */
   
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
   
   
   /* Settings */
   
   speedInput.addEventListener(
       "change",
       saveSettings
   );
   
   
   readingSpeedInput.addEventListener(
       "change",
       saveSettings
   );
   
   
   autoSaveToggle.addEventListener(
       "change",
       saveSettings
   );
   
   
   autoTimerToggle.addEventListener(
       "change",
       saveSettings
   );
   
   
   dictationExtraDelayEl.addEventListener(
       "change",
       saveSettings
   );
   
   
   /* Share */
   
   shareBtn.addEventListener(
       "click",
       shareResult
   );
   
   
   /* History */
   
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
                   "Delete all writing session history?"
               );
   
   
           if (
               !confirmed
           ) {
               return;
           }
   
   
           appData.history =
               [];
   
   
           saveData();
   
   
           renderHistory();
   
           updatePersonalBests();
   
           updateComparison();
   
           updateSharePreview();
       }
   );
   
   
   historyListEl.addEventListener(
       "click",
       event => {
   
           const button =
               event.target.closest(
                   ".history-delete"
               );
   
   
           if (
               !button
           ) {
               return;
           }
   
   
           deleteHistoryItem(
               button.dataset.id
           );
       }
   );
   
   
   /* Delete all data */
   
   clearSavedDataBtn.addEventListener(
       "click",
       clearAllSavedData
   );
   
   
   /* =========================================================
      WINDOW EVENTS
      ========================================================= */
   
   window.addEventListener(
       "resize",
       drawPerformanceChart
   );
   
   
   window.addEventListener(
       "beforeunload",
       () => {
   
           appData.paragraph =
               paragraph.value;
   
   
           appData.currentSession.elapsed =
               elapsedMilliseconds;
   
   
           saveData();
       }
   );
   
   
   /* =========================================================
      INITIALIZATION
      ========================================================= */
   
   function initializeApp() {
   
       paragraph.value =
           appData.paragraph ||
           "";
   
   
       loadSettings();
   
   
       elapsedMilliseconds =
           Number(
               appData.currentSession.elapsed
           ) || 0;
   
   
       updateTimerDisplay();
   
   
       applyTheme();
   
   
       updateStatistics();
   
   
       renderHistory();
   
   
       updatePersonalBests();
   
   
       updateComparison();
   
   
       updateSharePreview();
   
   
       prepareDictation();
   
   
       updateTimerButtons();
   
   
       drawPerformanceChart();
   
   
       liveStatus.textContent =
           paragraph.value.trim()
               ? "Restored"
               : "Ready";
   }
   
   
   initializeApp();