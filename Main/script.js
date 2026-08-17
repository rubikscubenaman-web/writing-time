/* =========================================
   WRITING TIME ANALYZER
   COMPLETE VERSION
   ========================================= */


   let TARGET_CPM = 68;
   let READING_WPM = 200;
   
   let GOAL_WORDS = 500;
   let GOAL_CHARS = 3000;
   
   const TEXT_KEY = "writing_time_text";
   const HISTORY_KEY = "writing_time_history";
   const SETTINGS_KEY = "writing_time_settings";
   const THEME_KEY = "writing_time_theme";
   const BEST_KEY = "writing_time_best";
   
   
   let elapsedSeconds = 0;
   let timerInterval = null;
   let timerRunning = false;
   let sessionStarted = false;
   
   let cpmHistory = [];
   let history = JSON.parse(
     localStorage.getItem(HISTORY_KEY) || "[]"
   );
   
   let best =
     JSON.parse(
       localStorage.getItem(BEST_KEY) || "{}"
     );
   
   
   /* =========================================
      HELPERS
      ========================================= */
   
   const $ = id =>
     document.getElementById(id);
   
   
   function formatTime(seconds) {
   
     seconds = Math.max(
       0,
       Math.round(seconds)
     );
   
     const minutes =
       Math.floor(seconds / 60);
   
     const secondsPart =
       String(seconds % 60)
         .padStart(2, "0");
   
     return `${minutes}:${secondsPart}`;
   }
   
   
   function escapeHTML(text) {
   
     return String(text)
       .replace(
         /[&<>"']/g,
         char => ({
           "&": "&amp;",
           "<": "&lt;",
           ">": "&gt;",
           '"': "&quot;",
           "'": "&#039;"
         })[char]
       );
   
   }
   
   
   function getWords(text) {
   
     return text
       .trim()
       ? text
           .trim()
           .split(/\s+/)
           .filter(Boolean)
       : [];
   
   }
   
   
   function getCleanWord(word) {
   
     return word
       .toLowerCase()
       .replace(
         /^[^a-z0-9]+|[^a-z0-9]+$/gi,
         ""
       );
   
   }
   
   
   /* =========================================
      STATISTICS
      ========================================= */
   
   function getStats(text) {
   
     const words =
       getWords(text);
   
     const letters =
       (
         text.match(
           /[A-Za-zÀ-ÖØ-öø-ÿ]/g
         ) || []
       ).length;
   
     const numbers =
       (
         text.match(
           /[0-9]/g
         ) || []
       ).length;
   
     const spaces =
       (
         text.match(
           /\s/g
         ) || []
       ).length;
   
     const punctuation =
       (
         text.match(
           /[.,!?;:'"()[\]{}\-–—/@#$%&*+=<>^_|~`\\]/g
         ) || []
       ).length;
   
     const characters =
       [...text].length;
   
     const sentences =
       text
         .match(
           /[^.!?]+[.!?]+/g
         ) || [];
   
     const paragraphs =
       text.trim()
         ? text
             .split(/\n\s*\n/)
             .filter(
               p => p.trim()
             ).length
         : 0;
   
     return {
       words,
       letters,
       numbers,
       spaces,
       punctuation,
       characters,
       sentences,
       paragraphs:
         paragraphs ||
         (text.trim() ? 1 : 0)
     };
   
   }
   
   
   /* =========================================
      TEXT ANALYSIS
      ========================================= */
   
   function analyzeText(text, stats) {
   
     const cleanWords =
       stats.words
         .map(getCleanWord)
         .filter(Boolean);
   
   
     const unique =
       new Set(cleanWords);
   
   
     const frequency = {};
   
   
     cleanWords.forEach(word => {
   
       frequency[word] =
         (frequency[word] || 0) + 1;
   
     });
   
   
     const repeated =
       Object.entries(frequency)
         .filter(
           ([, count]) =>
             count > 1
         )
         .sort(
           (a, b) =>
             b[1] - a[1]
         );
   
   
     const longestWord =
       cleanWords.length
         ? cleanWords.reduce(
             (a, b) =>
               b.length > a.length
                 ? b
                 : a
           )
         : "—";
   
   
     const sentences =
       stats.sentences
         .map(
           sentence =>
             sentence.trim()
         )
         .filter(Boolean);
   
   
     let longestSentence =
       "—";
   
     let shortestSentence =
       "—";
   
   
     if (sentences.length) {
   
       longestSentence =
         sentences.reduce(
           (a, b) =>
             getWords(b).length >
             getWords(a).length
               ? b
               : a
         );
   
       shortestSentence =
         sentences.reduce(
           (a, b) =>
             getWords(b).length <
             getWords(a).length
               ? b
               : a
         );
   
     }
   
   
     const avgWordLength =
       cleanWords.length
         ? stats.letters /
           cleanWords.length
         : 0;
   
   
     const avgSentenceLength =
       sentences.length
         ? stats.words.length /
           sentences.length
         : 0;
   
   
     /*
       Simple Flesch-style readability.
       This is an estimate rather than a
       formal language-grade certification.
     */
   
     const syllables =
       estimateSyllables(text);
   
   
     const readability =
       stats.words.length &&
       sentences.length
         ? 206.835
           -
           1.015 *
           (
             stats.words.length /
             sentences.length
           )
           -
           84.6 *
           (
             syllables /
             stats.words.length
           )
         : 0;
   
   
     return {
       unique,
       frequency,
       repeated,
       longestWord,
       longestSentence,
       shortestSentence,
       avgWordLength,
       avgSentenceLength,
       readability
     };
   
   }
   
   
   /* =========================================
      SYLLABLE ESTIMATION
      ========================================= */
   
   function estimateSyllables(text) {
   
     const words =
       getWords(text);
   
     let total = 0;
   
   
     words.forEach(word => {
   
       word =
         word
           .toLowerCase()
           .replace(
             /[^a-z]/g,
             ""
           );
   
   
       if (!word) {
         return;
       }
   
   
       const groups =
         word.match(
           /[aeiouy]+/g
         );
   
   
       let count =
         groups
           ? groups.length
           : 1;
   
   
       if (
         word.endsWith("e") &&
         count > 1
       ) {
         count--;
       }
   
   
       total +=
         Math.max(
           1,
           count
         );
   
     });
   
   
     return total;
   
   }
   
   
   /* =========================================
      MAIN UPDATE
      ========================================= */
   
   function updateAll() {
   
     const text =
       $("textInput").value;
   
     const stats =
       getStats(text);
   
     const analysis =
       analyzeText(
         text,
         stats
       );
   
   
     /* LIVE STATS */
   
     $("words").textContent =
       stats.words.length;
   
     $("letters").textContent =
       stats.letters;
   
     $("numbers").textContent =
       stats.numbers;
   
     $("characters").textContent =
       stats.characters;
   
     $("spaces").textContent =
       stats.spaces;
   
     $("punctuation").textContent =
       stats.punctuation;
   
     $("sentences").textContent =
       stats.sentences.length;
   
     $("paragraphs").textContent =
       stats.paragraphs;
   
   
     $("characterHint").textContent =
       `${stats.characters.toLocaleString()} characters`;
   
   
     /* SPEED */
   
     const minutes =
       elapsedSeconds / 60;
   
     const cpm =
       minutes > 0
         ? stats.letters / minutes
         : 0;
   
     const wpm =
       minutes > 0
         ? stats.words.length / minutes
         : 0;
   
     const cps =
       elapsedSeconds > 0
         ? stats.letters /
           elapsedSeconds
         : 0;
   
   
     $("speed").textContent =
       Math.round(cpm);
   
     $("wpm").textContent =
       wpm.toFixed(1);
   
     $("cps").textContent =
       cps.toFixed(2);
   
     $("currentCpm").textContent =
       `${Math.round(cpm)} CPM`;
   
   
     /* TIME */
   
     const estimatedSeconds =
       stats.letters /
       TARGET_CPM *
       60;
   
   
     $("estimatedTime").textContent =
       formatTime(
         estimatedSeconds
       );
   
     $("actualTime").textContent =
       formatTime(
         elapsedSeconds
       );
   
     $("timeDifference").textContent =
       formatTime(
         Math.abs(
           elapsedSeconds -
           estimatedSeconds
         )
       );
   
   
     $("readingTime").textContent =
       formatTime(
         stats.words.length /
         READING_WPM *
         60
       );
   
   
     /* PROGRESS */
   
     const progress =
       estimatedSeconds > 0
         ? Math.min(
             100,
             elapsedSeconds /
             estimatedSeconds *
             100
           )
         : 0;
   
   
     $("progressBar").style.width =
       `${progress}%`;
   
     $("progressText").textContent =
       `${Math.round(progress)}%`;
   
   
     /* GOALS */
   
     updateGoals(
       stats,
       cpm
     );
   
   
     /* ANALYSIS */
   
     renderAnalysis(
       stats,
       analysis,
       cpm
     );
   
   
     /* FREQUENCY */
   
     renderFrequency(
       analysis
     );
   
   
     /* SCORE */
   
     updateScore(
       stats,
       analysis,
       cpm,
       estimatedSeconds
     );
   
   
     /* SHARE */
   
     updateShare(
       stats,
       analysis,
       cpm
     );
   
   
     /* GRAPH */
   
     drawCPMGraph();
   
   
     /* LOCAL SAVE */
   
     localStorage.setItem(
       TEXT_KEY,
       text
     );
   
   
     $("saveStatus").textContent =
       text
         ? "Saved locally • " +
           new Date()
             .toLocaleTimeString()
         : "Saved locally";
   
   }
   
   
   /* =========================================
      GOALS
      ========================================= */
   
   function updateGoals(
     stats,
     cpm
   ) {
   
     const wordProgress =
       Math.min(
         100,
         stats.words.length /
         GOAL_WORDS *
         100
       );
   
     const charProgress =
       Math.min(
         100,
         stats.characters /
         GOAL_CHARS *
         100
       );
   
     const cpmProgress =
       Math.min(
         100,
         cpm /
         TARGET_CPM *
         100
       );
   
   
     $("goalWords").textContent =
       GOAL_WORDS;
   
     $("goalChars").textContent =
       GOAL_CHARS;
   
     $("goalCpm").textContent =
       TARGET_CPM;
   
   
     $("goalWordsBar").style.width =
       `${wordProgress}%`;
   
     $("goalCharsBar").style.width =
       `${charProgress}%`;
   
     $("goalCpmBar").style.width =
       `${cpmProgress}%`;
   
   
     $("goalWordsText").textContent =
       `${stats.words.length} / ${GOAL_WORDS}`;
   
     $("goalCharsText").textContent =
       `${stats.characters} / ${GOAL_CHARS}`;
   
     $("goalCpmText").textContent =
       `${Math.round(cpm)} / ${TARGET_CPM} CPM`;
   
   }
   
   
   /* =========================================
      ANALYSIS RENDER
      ========================================= */
   
   function renderAnalysis(
     stats,
     analysis,
     cpm
   ) {
   
     const readability =
       analysis.readability;
   
   
     let readabilityLabel;
   
     if (readability >= 90)
       readabilityLabel = "Very Easy";
     else if (readability >= 80)
       readabilityLabel = "Easy";
     else if (readability >= 70)
       readabilityLabel = "Fairly Easy";
     else if (readability >= 60)
       readabilityLabel = "Standard";
     else if (readability >= 50)
       readabilityLabel = "Fairly Difficult";
     else if (readability >= 30)
       readabilityLabel = "Difficult";
     else
       readabilityLabel = "Very Difficult";
   
   
     const repeated =
       analysis.repeated.length
         ? analysis.repeated
             .slice(0, 3)
             .map(
               x =>
                 `${escapeHTML(x[0])} (${x[1]})`
             )
             .join(", ")
         : "None";
   
   
     const items = [
   
       [
         "Unique Words",
         analysis.unique.size
       ],
   
       [
         "Longest Word",
         escapeHTML(
           analysis.longestWord
         )
       ],
   
       [
         "Longest Sentence",
         `${getWords(
           analysis.longestSentence
         ).length} words`
       ],
   
       [
         "Shortest Sentence",
         `${getWords(
           analysis.shortestSentence
         ).length} words`
       ],
   
       [
         "Readability",
         `${Math.max(
           0,
           readability
         ).toFixed(1)} — ${readabilityLabel}`
       ],
   
       [
         "Repeated Words",
         repeated
       ],
   
       [
         "Average Word",
         `${analysis.avgWordLength.toFixed(1)} chars`
       ],
   
       [
         "Average Sentence",
         `${analysis.avgSentenceLength.toFixed(1)} words`
       ],
   
       [
         "Punctuation Density",
         stats.characters
           ? `${(
               stats.punctuation /
               stats.characters *
               100
             ).toFixed(2)}%`
           : "0%"
       ],
   
       [
         "Current CPM",
         `${Math.round(cpm)} CPM`
       ]
   
     ];
   
   
     $("analysisGrid").innerHTML =
       items
         .map(
           ([label, value]) => `
   
             <div class="analysis-item">
   
               <span>
                 ${label}
               </span>
   
               <strong>
                 ${value}
               </strong>
   
             </div>
   
           `
         )
         .join("");
   
   }
   
   
   /* =========================================
      FREQUENCY
      ========================================= */
   
   function renderFrequency(
     analysis
   ) {
   
     const sorted =
       Object.entries(
         analysis.frequency
       )
         .sort(
           (a, b) =>
             b[1] - a[1] ||
             a[0].localeCompare(b[0])
         )
         .slice(0, 10);
   
   
     $("uniqueWordsBadge").textContent =
       `${analysis.unique.size} unique words`;
   
   
     if (!sorted.length) {
   
       $("frequencyList").innerHTML =
         `<p class="empty">
           Start writing to see word frequency.
         </p>`;
   
       return;
   
     }
   
   
     const max =
       sorted[0][1];
   
   
     $("frequencyList").innerHTML =
       sorted
         .map(
           ([word, count], index) => `
   
             <div class="frequency-row">
   
               <span>
                 ${index + 1}
               </span>
   
               <div>
   
                 <span class="frequency-word">
                   ${escapeHTML(word)}
                 </span>
   
                 <span class="frequency-bar">
   
                   <div
                     style="
                       width:${count / max * 100}%
                     "
                   ></div>
   
                 </span>
   
               </div>
   
               <span class="frequency-count">
                 ${count}×
               </span>
   
             </div>
   
           `
         )
         .join("");
   
   }
   
   
   /* =========================================
      SESSION SCORE
      ========================================= */
   
   function updateScore(
     stats,
     analysis,
     cpm,
     estimated
   ) {
   
     if (!stats.characters) {
   
       $("score").textContent = "0";
   
       $("scoreCompletion").textContent = "0";
   
       $("scoreSpeed").textContent = "0";
   
       $("scoreConsistency").textContent = "0";
   
       $("scoreQuality").textContent = "0";
   
       $("scoreGrade").textContent =
         "Not started";
   
       return;
   
     }
   
   
     const completion =
       Math.min(
         100,
         stats.characters /
         GOAL_CHARS *
         100
       );
   
   
     const speedScore =
       Math.min(
         100,
         cpm /
         TARGET_CPM *
         100
       );
   
   
     const consistency =
       elapsedSeconds > 0
         ? Math.max(
             0,
             100 -
             Math.abs(
               elapsedSeconds -
               estimated
             ) /
             Math.max(
               estimated,
               1
             ) *
             100
           )
         : 0;
   
   
     const quality =
       Math.min(
         100,
   
         (
           stats.sentences.length
             ? 20
             : 0
         )
   
         +
   
         (
           stats.words.length >= 20
             ? 20
             : stats.words.length
               / 20 * 20
         )
   
         +
   
         (
           analysis.unique.size >= 10
             ? 20
             : analysis.unique.size
               / 10 * 20
         )
   
         +
   
         (
           stats.characters >= 100
             ? 20
             : stats.characters
               / 100 * 20
         )
   
         +
   
         (
           analysis.readability > 0
             ? 20
             : 0
         )
       );
   
   
     const score =
       Math.round(
         completion * 0.20 +
         speedScore * 0.30 +
         consistency * 0.20 +
         quality * 0.30
       );
   
   
     $("score").textContent =
       score;
   
     $("scoreCompletion").textContent =
       Math.round(completion);
   
     $("scoreSpeed").textContent =
       Math.round(speedScore);
   
     $("scoreConsistency").textContent =
       Math.round(consistency);
   
     $("scoreQuality").textContent =
       Math.round(quality);
   
   
     $("scoreGrade").textContent =
       score >= 90
         ? "Excellent"
         : score >= 75
           ? "Great"
           : score >= 60
             ? "Good"
             : score >= 40
               ? "Developing"
               : "Keep Practicing";
   
   }
   
   
   /* =========================================
      CPM GRAPH
      ========================================= */
   
   function recordCPM() {
   
     const stats =
       getStats(
         $("textInput").value
       );
   
   
     if (
       elapsedSeconds <= 0
     ) {
       return;
     }
   
   
     const cpm =
       stats.letters /
       (elapsedSeconds / 60);
   
   
     cpmHistory.push({
       time: elapsedSeconds,
       cpm
     });
   
   
     if (
       cpmHistory.length > 60
     ) {
   
       cpmHistory.shift();
   
     }
   
   
     drawCPMGraph();
   
   }
   
   
   function drawCPMGraph() {
   
     const canvas =
       $("cpmChart");
   
   
     const rect =
       canvas.getBoundingClientRect();
   
   
     if (
       rect.width === 0
     ) {
       return;
     }
   
   
     const ratio =
       window.devicePixelRatio || 1;
   
   
     canvas.width =
       rect.width * ratio;
   
     canvas.height =
       260 * ratio;
   
   
     const ctx =
       canvas.getContext("2d");
   
   
     ctx.scale(
       ratio,
       ratio
     );
   
   
     const width =
       rect.width;
   
     const height =
       260;
   
   
     ctx.clearRect(
       0,
       0,
       width,
       height
     );
   
   
     /* GRID */
   
     ctx.strokeStyle =
       getComputedStyle(
         document.body
       ).getPropertyValue(
         "--border"
       );
   
   
     ctx.lineWidth = 1;
   
   
     for (
       let y = 35;
       y < height;
       y += 45
     ) {
   
       ctx.beginPath();
   
       ctx.moveTo(
         0,
         y
       );
   
       ctx.lineTo(
         width,
         y
       );
   
       ctx.stroke();
   
     }
   
   
     if (
       cpmHistory.length < 2
     ) {
   
       ctx.fillStyle =
         getComputedStyle(
           document.body
         ).getPropertyValue(
           "--muted"
         );
   
       ctx.font =
         "13px Segoe UI";
   
       ctx.fillText(
         "Start writing to see your CPM graph.",
         20,
         40
       );
   
       return;
   
     }
   
   
     const maxCpm =
       Math.max(
         TARGET_CPM,
         ...cpmHistory.map(
           p => p.cpm
         )
       );
   
   
     const minCpm = 0;
   
   
     const primary =
       getComputedStyle(
         document.body
       ).getPropertyValue(
         "--primary"
       );
   
   
     ctx.strokeStyle =
       primary;
   
     ctx.lineWidth = 3;
   
     ctx.lineJoin =
       "round";
   
     ctx.beginPath();
   
   
     cpmHistory.forEach(
       (point, index) => {
   
         const x =
           index /
           Math.max(
             1,
             cpmHistory.length - 1
           ) *
           (width - 20)
           + 10;
   
   
         const y =
           height -
           25 -
           (
             (point.cpm - minCpm) /
             (maxCpm - minCpm)
           ) *
           (height - 55);
   
   
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
   
   
     /* TARGET LINE */
   
     if (
       TARGET_CPM <= maxCpm
     ) {
   
       const targetY =
         height -
         25 -
         (
           TARGET_CPM /
           maxCpm
         ) *
         (height - 55);
   
   
       ctx.setLineDash(
         [6, 6]
       );
   
   
       ctx.strokeStyle =
         getComputedStyle(
           document.body
         ).getPropertyValue(
           "--muted"
         );
   
   
       ctx.beginPath();
   
       ctx.moveTo(
         0,
         targetY
       );
   
       ctx.lineTo(
         width,
         targetY
       );
   
       ctx.stroke();
   
       ctx.setLineDash([]);
   
     }
   
   }
   
   
   /* =========================================
      TIMER
      ========================================= */
   
   function startTimer() {
   
     if (
       timerRunning
     ) {
       return;
     }
   
   
     timerRunning = true;
   
     sessionStarted = true;
   
   
     const start =
       Date.now() -
       elapsedSeconds * 1000;
   
   
     timerInterval =
       setInterval(
         () => {
   
           elapsedSeconds =
             Math.floor(
               (
                 Date.now() -
                 start
               ) / 1000
             );
   
   
           $("timerDisplay")
             .textContent =
             formatTime(
               elapsedSeconds
             );
   
   
           recordCPM();
   
           updateAll();
   
         },
         500
       );
   
   
     $("startBtn").disabled =
       true;
   
     $("pauseBtn").disabled =
       false;
   
   }
   
   
   function pauseTimer() {
   
     if (
       !timerRunning
     ) {
       return;
     }
   
   
     clearInterval(
       timerInterval
     );
   
   
     timerRunning = false;
   
   
     $("startBtn").disabled =
       false;
   
     $("pauseBtn").disabled =
       true;
   
   
     updateAll();
   
   }
   
   
   function resetTimer(
     save = true
   ) {
   
     if (
       save &&
       $("textInput").value.trim() &&
       elapsedSeconds > 0
     ) {
   
       saveSession();
   
     }
   
   
     clearInterval(
       timerInterval
     );
   
   
     timerInterval = null;
   
     timerRunning = false;
   
     elapsedSeconds = 0;
   
     sessionStarted = false;
   
     cpmHistory = [];
   
   
     $("timerDisplay").textContent =
       "0:00";
   
   
     $("startBtn").disabled =
       false;
   
     $("pauseBtn").disabled =
       true;
   
   
     updateAll();
   
   }
   
   
   /* =========================================
      SESSION SAVE
      ========================================= */
   
   function saveSession() {
   
     const text =
       $("textInput").value;
   
     const stats =
       getStats(text);
   
     const analysis =
       analyzeText(
         text,
         stats
       );
   
   
     const minutes =
       elapsedSeconds / 60;
   
   
     const cpm =
       minutes > 0
         ? stats.letters / minutes
         : 0;
   
   
     const wpm =
       minutes > 0
         ? stats.words.length / minutes
         : 0;
   
   
     const estimated =
       stats.letters /
       TARGET_CPM *
       60;
   
   
     const score =
       Number(
         $("score").textContent
       ) || 0;
   
   
     const session = {
   
       id: Date.now(),
   
       date:
         new Date()
           .toLocaleString(),
   
       words:
         stats.words.length,
   
       letters:
         stats.letters,
   
       characters:
         stats.characters,
   
       cpm:
   
         Math.round(cpm),
   
       wpm:
   
         Number(
           wpm.toFixed(1)
         ),
   
       actual:
         elapsedSeconds,
   
       estimated:
         Math.round(
           estimated
         ),
   
       score
   
     };
   
   
     history.unshift(
       session
     );
   
   
     history =
       history.slice(
         0,
         20
       );
   
   
     localStorage.setItem(
       HISTORY_KEY,
       JSON.stringify(history)
     );
   
   
     updatePersonalBest(
       session
     );
   
   
     renderHistory();
   
     renderSessionComparison(
       session
     );
   
   }
   
   
   /* =========================================
      PERSONAL BEST
      ========================================= */
   
   function updatePersonalBest(
     session
   ) {
   
     best.bestCpm =
       Math.max(
         best.bestCpm || 0,
         session.cpm
       );
   
   
     best.bestWpm =
       Math.max(
         best.bestWpm || 0,
         session.wpm
       );
   
   
     best.bestScore =
       Math.max(
         best.bestScore || 0,
         session.score
       );
   
   
     best.bestWords =
       Math.max(
         best.bestWords || 0,
         session.words
       );
   
   
     localStorage.setItem(
       BEST_KEY,
       JSON.stringify(best)
     );
   
   
     renderPersonalBest();
   
   }
   
   
   function renderPersonalBest() {
   
     $("bestCpm").textContent =
       best.bestCpm || 0;
   
     $("bestWpm").textContent =
       best.bestWpm || 0;
   
     $("bestScore").textContent =
       best.bestScore || 0;
   
     $("bestWords").textContent =
       `${best.bestWords || 0} words`;
   
   }
   
   
   /* =========================================
      SESSION COMPARISON
      ========================================= */
   
   function renderSessionComparison(
     current
   ) {
   
     const previous =
       history.find(
         session =>
           session.id !== current.id
       );
   
   
     if (!previous) {
   
       $("sessionComparison").innerHTML =
         `<p class="empty">
           Complete another session to compare performance.
         </p>`;
   
       return;
   
     }
   
   
     const difference =
       (currentValue, previousValue) =>
         currentValue - previousValue;
   
   
     $("sessionComparison").innerHTML = `
   
       <table>
   
         <thead>
   
           <tr>
             <th>Metric</th>
             <th>Previous</th>
             <th>Current</th>
             <th>Change</th>
           </tr>
   
         </thead>
   
         <tbody>
   
           ${comparisonRow(
             "Words",
             previous.words,
             current.words
           )}
   
           ${comparisonRow(
             "Letters",
             previous.letters,
             current.letters
           )}
   
           ${comparisonRow(
             "CPM",
             previous.cpm,
             current.cpm
           )}
   
           ${comparisonRow(
             "WPM",
             previous.wpm,
             current.wpm
           )}
   
           ${comparisonRow(
             "Score",
             previous.score,
             current.score
           )}
   
         </tbody>
   
       </table>
   
     `;
   
   }
   
   
   function comparisonRow(
     name,
     previous,
     current
   ) {
   
     const difference =
       current - previous;
   
   
     const symbol =
       difference > 0
         ? "+"
         : "";
   
   
     return `
   
       <tr>
   
         <td>${name}</td>
   
         <td>${previous}</td>
   
         <td>${current}</td>
   
         <td>
           ${symbol}${difference}
         </td>
   
       </tr>
   
     `;
   
   }
   
   
   /* =========================================
      HISTORY
      ========================================= */
   
   function renderHistory() {
   
     if (!history.length) {
   
       $("historyList").innerHTML =
         `<p class="empty">
           No sessions saved yet.
         </p>`;
   
       return;
   
     }
   
   
     $("historyList").innerHTML =
       history
         .map(
           session => `
   
             <div class="history-item">
   
               <div>
   
                 <strong>
                   ${session.words} words
                 </strong>
   
                 <br>
   
                 <small>
                   ${escapeHTML(
                     session.date
                   )}
                 </small>
   
               </div>
   
               <div>
                 <strong>
                   ${session.cpm} CPM
                 </strong>
   
                 <br>
   
                 <small>
                   speed
                 </small>
               </div>
   
               <div>
                 <strong>
                   ${session.wpm} WPM
                 </strong>
   
                 <br>
   
                 <small>
                   writing
                 </small>
               </div>
   
               <div>
                 <strong>
                   ${session.score}/100
                 </strong>
   
                 <br>
   
                 <small>
                   score
                 </small>
               </div>
   
             </div>
   
           `
         )
         .join("");
   
   }
   
   
   /* =========================================
      SHARE
      ========================================= */
   
   function updateShare(
     stats,
     analysis,
     cpm
   ) {
   
     if (!stats.characters) {
   
       $("sharePreview").textContent =
         "Write something to generate your result.";
   
       return;
   
     }
   
   
     const score =
       $("score").textContent;
   
   
     $("sharePreview").textContent =
   
   `✍️ My Writing Result
   
   Words: ${stats.words.length}
   Letters: ${stats.letters}
   Characters: ${stats.characters}
   CPM: ${Math.round(cpm)}
   WPM: ${
     elapsedSeconds
       ? (
           stats.words.length /
           (elapsedSeconds / 60)
         ).toFixed(1)
       : 0
   }
   Reading Time: ${
     formatTime(
       stats.words.length /
       READING_WPM *
       60
     )
   }
   Unique Words: ${analysis.unique.size}
   Score: ${score}/100
   
   Created with Writing Time Analyzer`;
   
   }
   
   
   function getShareText() {
   
     return $("sharePreview")
       .textContent;
   
   }
   
   
   /* =========================================
      NOTEBOOK MODE
      ========================================= */
   
   let voices = [];
   
   let notebookItems = [];
   let notebookIndex = 0;
   
   let notebookTimer = null;
   
   let notebookPaused = false;
   let notebookStopped = true;
   
   
   /* Symbol names */
   
   const symbolNames = {
   
     ".": "full stop",
     ",": "comma",
     "!": "exclamation mark",
     "?": "question mark",
     ":": "colon",
     ";": "semicolon",
   
     "'": "apostrophe",
     '"': "quotation mark",
   
     "-": "hyphen",
     "–": "en dash",
     "—": "em dash",
   
     "(": "open parenthesis",
     ")": "close parenthesis",
   
     "[": "open square bracket",
     "]": "close square bracket",
   
     "{": "open curly bracket",
     "}": "close curly bracket",
   
     "/": "slash",
     "\\": "backslash",
   
     "@": "at symbol",
     "#": "hash",
   
     "$": "dollar sign",
     "%": "percent sign",
   
     "&": "ampersand",
     "*": "asterisk",
   
     "+": "plus sign",
     "=": "equals sign",
   
     "<": "less than sign",
     ">": "greater than sign",
   
     "^": "caret",
     "_": "underscore",
   
     "|": "vertical bar",
     "~": "tilde",
   
     "`": "backtick"
   
   };
   
   
   /* Convert paragraph to items */
   
   function tokenizeNotebook(
     text
   ) {
   
     const result = [];
   
     const matches =
       text.match(
         /[A-Za-zÀ-ÖØ-öø-ÿ0-9]+|[^\sA-Za-zÀ-ÖØ-öø-ÿ0-9]/gu
       );
   
   
     if (!matches) {
       return [];
     }
   
   
     matches.forEach(
       item => {
   
         if (
           !/\s/.test(item)
         ) {
   
           result.push(item);
   
         }
   
       }
     );
   
   
     return result;
   
   }
   
   
   /* Speech text */
   
   function notebookSpeechText(
     item
   ) {
   
     if (
       $("speakPunctuation").checked &&
       symbolNames[item]
     ) {
   
       return symbolNames[item];
   
     }
   
   
     return item;
   
   }
   
   
   /* Writing delay */
   
   function notebookDelay(
     item
   ) {
   
     let seconds =
       [...item].length /
       TARGET_CPM *
       60;
   
   
     if (
       symbolNames[item]
     ) {
   
       seconds += 0.35;
   
     }
   
   
     return Math.max(
       0.55,
       seconds
     );
   
   }
   
   
   /* Populate voices */
   
   function populateVoices() {
   
     if (
       !("speechSynthesis" in window)
     ) {
       return;
     }
   
   
     voices =
       speechSynthesis
         .getVoices();
   
   
     const select =
       $("voiceSelect");
   
   
     const previous =
       select.value;
   
   
     select.innerHTML =
       "";
   
   
     voices.forEach(
       (voice, index) => {
   
         const option =
           document.createElement(
             "option"
           );
   
   
         option.value =
           index;
   
         option.textContent =
           `${voice.name} (${voice.lang})`;
   
   
         select.appendChild(
           option
         );
   
       }
     );
   
   
     if (
       previous &&
       voices[Number(previous)]
     ) {
   
       select.value =
         previous;
   
     }
   
   }
   
   
   /* Speak next */
   
   function notebookSpeakNext() {
   
     if (
       notebookStopped ||
       notebookPaused
     ) {
       return;
     }
   
   
     if (
       notebookIndex >=
       notebookItems.length
     ) {
   
       $("speechStatus").textContent =
         "✅ Notebook Mode finished.";
   
       $("notebookCurrent")
         .textContent = "Finished";
   
       $("notebookWait")
         .textContent = "0:00";
   
       $("speechStart").disabled =
         false;
   
       $("speechPause").disabled =
         true;
   
       return;
   
     }
   
   
     const item =
       notebookItems[
         notebookIndex
       ];
   
   
     const spoken =
       notebookSpeechText(
         item
       );
   
   
     const wait =
       notebookDelay(
         item
       );
   
   
     $("notebookCurrent")
       .textContent =
       symbolNames[item]
         ? `"${spoken}"`
         : item;
   
   
     $("notebookProgress")
       .textContent =
       `${notebookIndex + 1} / ${notebookItems.length}`;
   
   
     $("notebookWait")
       .textContent =
       formatTime(wait);
   
   
     $("speechStatus")
       .textContent =
       `🔊 Speaking: "${spoken}"`;
   
   
     const utterance =
       new SpeechSynthesisUtterance(
         spoken
       );
   
   
     const voice =
       voices[
         Number(
           $("voiceSelect").value
         )
       ];
   
   
     if (voice) {
   
       utterance.voice =
         voice;
   
       utterance.lang =
         voice.lang;
   
     }
   
   
     utterance.rate =
       Number(
         $("voiceRate").value
       );
   
   
     utterance.pitch =
       1;
   
   
     utterance.volume =
       1;
   
   
     utterance.onend =
       () => {
   
         if (
           notebookStopped ||
           notebookPaused
         ) {
           return;
         }
   
   
         $("speechStatus")
           .textContent =
           `✍️ Write "${spoken}" — waiting ${formatTime(wait)}.`;
   
   
         notebookTimer =
           setTimeout(
             () => {
   
               notebookIndex++;
   
               notebookSpeakNext();
   
             },
             wait * 1000
           );
   
       };
   
   
     utterance.onerror =
       () => {
   
         $("speechStatus")
           .textContent =
           "Speech error. Try another voice.";
   
       };
   
   
     speechSynthesis.speak(
       utterance
     );
   
   }
   
   
   /* Start notebook */
   
   function startNotebook() {
   
     if (
       !("speechSynthesis" in window)
     ) {
   
       $("speechStatus")
         .textContent =
         "Speech synthesis is not supported.";
   
       return;
   
     }
   
   
     speechSynthesis.cancel();
   
     clearTimeout(
       notebookTimer
     );
   
   
     notebookItems =
       tokenizeNotebook(
         $("textInput").value
       );
   
   
     if (!notebookItems.length) {
   
       $("speechStatus")
         .textContent =
         "Enter a paragraph first.";
   
       return;
   
     }
   
   
     notebookIndex = 0;
   
     notebookPaused = false;
   
     notebookStopped = false;
   
   
     $("speechStart")
       .disabled = true;
   
     $("speechPause")
       .disabled = false;
   
   
     notebookSpeakNext();
   
   }
   
   
   /* Pause */
   
   function pauseNotebook() {
   
     notebookPaused = true;
   
   
     speechSynthesis.cancel();
   
     clearTimeout(
       notebookTimer
     );
   
   
     $("speechStart")
       .disabled = false;
   
     $("speechPause")
       .disabled = true;
   
   
     $("speechStatus")
       .textContent =
       "⏸ Notebook Mode paused.";
   
   }
   
   
   /* Stop */
   
   function stopNotebook() {
   
     notebookStopped = true;
   
     notebookPaused = false;
   
   
     speechSynthesis.cancel();
   
     clearTimeout(
       notebookTimer
     );
   
   
     notebookIndex = 0;
   
     notebookItems = [];
   
   
     $("speechStart")
       .disabled = false;
   
     $("speechPause")
       .disabled = true;
   
   
     $("notebookCurrent")
       .textContent = "—";
   
     $("notebookProgress")
       .textContent = "0 / 0";
   
     $("notebookWait")
       .textContent = "0:00";
   
   
     $("speechStatus")
       .textContent =
       "Ready.";
   
   }
   
   
   /* =========================================
      SAMPLE
      ========================================= */
   
   function loadSample() {
   
     $("textInput").value =
   `Writing regularly is one of the best ways to improve your speed, accuracy, vocabulary, and concentration.
   
   A good writing session should not only focus on speed. It should also focus on clear sentences, correct punctuation, varied vocabulary, and consistent handwriting.
   
   The goal is simple: write better, write faster, and understand your progress.`;
   
     updateAll();
   
   }
   
   
   /* =========================================
      CLEAR
      ========================================= */
   
   function clearAll() {
   
     if (
       $("textInput").value.trim() &&
       elapsedSeconds > 0
     ) {
   
       saveSession();
   
     }
   
   
     stopNotebook();
   
   
     $("textInput").value = "";
   
   
     resetTimer(false);
   
   }
   
   
   /* =========================================
      COPY
      ========================================= */
   
   $("copyBtn")
     .addEventListener(
       "click",
       async () => {
   
         await navigator.clipboard
           .writeText(
             $("textInput").value
           );
   
   
         $("copyBtn")
           .textContent =
           "Copied!";
   
   
         setTimeout(
           () => {
   
             $("copyBtn")
               .textContent =
               "Copy";
   
           },
           1200
         );
   
       }
     );
   
   
   /* =========================================
      DOWNLOAD
      ========================================= */
   
   $("downloadBtn")
     .addEventListener(
       "click",
       () => {
   
         const blob =
           new Blob(
             [
               $("textInput").value
             ],
             {
               type:
                 "text/plain"
             }
           );
   
   
         const url =
           URL.createObjectURL(
             blob
           );
   
   
         const a =
           document.createElement(
             "a"
           );
   
   
         a.href = url;
   
         a.download =
           "writing-paragraph.txt";
   
   
         a.click();
   
   
         URL.revokeObjectURL(
           url
         );
   
       }
     );
   
   
   /* =========================================
      TIMER EVENTS
      ========================================= */
   
   $("startBtn")
     .addEventListener(
       "click",
       startTimer
     );
   
   
   $("pauseBtn")
     .addEventListener(
       "click",
       pauseTimer
     );
   
   
   $("resetBtn")
     .addEventListener(
       "click",
       () => resetTimer(true)
     );
   
   
   /* =========================================
      TEXT INPUT
      ========================================= */
   
   $("textInput")
     .addEventListener(
       "input",
       () => {
   
         updateAll();
   
       }
     );
   
   
   /* =========================================
      SAMPLE / CLEAR
      ========================================= */
   
   $("sampleBtn")
     .addEventListener(
       "click",
       loadSample
     );
   
   
   $("clearBtn")
     .addEventListener(
       "click",
       clearAll
     );
   
   
   /* =========================================
      DARK MODE
      ========================================= */
   
   $("themeBtn")
     .addEventListener(
       "click",
       () => {
   
         document.body
           .classList
           .toggle("dark");
   
   
         const dark =
           document.body
             .classList
             .contains("dark");
   
   
         localStorage.setItem(
           THEME_KEY,
           dark
             ? "dark"
             : "light"
         );
   
   
         $("themeBtn")
           .textContent =
           dark
             ? "☀️"
             : "🌙";
   
   
         drawCPMGraph();
   
       }
     );
   
   
   /* =========================================
      SETTINGS
      ========================================= */
   
   $("settingsBtn")
     .addEventListener(
       "click",
       () => {
   
         $("settingsPanel")
           .classList
           .toggle("hidden");
   
       }
     );
   
   
   $("saveSettingsBtn")
     .addEventListener(
       "click",
       () => {
   
         TARGET_CPM =
           Math.max(
             1,
             Number(
               $("settingCpm").value
             )
           );
   
   
         READING_WPM =
           Math.max(
             1,
             Number(
               $("settingReading").value
             )
           );
   
   
         GOAL_WORDS =
           Math.max(
             1,
             Number(
               $("settingWordGoal").value
             )
           );
   
   
         GOAL_CHARS =
           Math.max(
             1,
             Number(
               $("settingCharGoal").value
             )
           );
   
   
         saveSettings();
   
         updateAll();
   
       }
     );
   
   
   function saveSettings() {
   
     localStorage.setItem(
       SETTINGS_KEY,
   
       JSON.stringify({
   
         cpm:
           TARGET_CPM,
   
         reading:
           READING_WPM,
   
         wordGoal:
           GOAL_WORDS,
   
         charGoal:
           GOAL_CHARS
   
       })
     );
   
   }
   
   
   /* =========================================
      GOAL MODAL
      ========================================= */
   
   $("editGoalsBtn")
     .addEventListener(
       "click",
       () => {
   
         $("modalWordGoal").value =
           GOAL_WORDS;
   
         $("modalCharGoal").value =
           GOAL_CHARS;
   
         $("modalCpmGoal").value =
           TARGET_CPM;
   
   
         $("goalModal")
           .classList
           .remove("hidden");
   
       }
     );
   
   
   $("closeGoalModal")
     .addEventListener(
       "click",
       () => {
   
         $("goalModal")
           .classList
           .add("hidden");
   
       }
     );
   
   
   $("saveGoalModal")
     .addEventListener(
       "click",
       () => {
   
         GOAL_WORDS =
           Math.max(
             1,
             Number(
               $("modalWordGoal").value
             )
           );
   
   
         GOAL_CHARS =
           Math.max(
             1,
             Number(
               $("modalCharGoal").value
             )
           );
   
   
         TARGET_CPM =
           Math.max(
             1,
             Number(
               $("modalCpmGoal").value
             )
           );
   
   
         $("settingCpm").value =
           TARGET_CPM;
   
         $("settingWordGoal").value =
           GOAL_WORDS;
   
         $("settingCharGoal").value =
           GOAL_CHARS;
   
   
         saveSettings();
   
         updateAll();
   
   
         $("goalModal")
           .classList
           .add("hidden");
   
       }
     );
   
   
   /* =========================================
      BEST RESET
      ========================================= */
   
   $("resetBestBtn")
     .addEventListener(
       "click",
       () => {
   
         best = {};
   
         localStorage.removeItem(
           BEST_KEY
         );
   
         renderPersonalBest();
   
       }
     );
   
   
   /* =========================================
      HISTORY CLEAR
      ========================================= */
   
   $("clearHistoryBtn")
     .addEventListener(
       "click",
       () => {
   
         history = [];
   
         localStorage.removeItem(
           HISTORY_KEY
         );
   
   
         $("historyList").innerHTML =
           `<p class="empty">
             No sessions saved yet.
           </p>`;
   
       }
     );
   
   
   /* =========================================
      SHARE
      ========================================= */
   
   $("copyResultBtn")
     .addEventListener(
       "click",
       async () => {
   
         await navigator.clipboard
           .writeText(
             getShareText()
           );
   
   
         $("copyResultBtn")
           .textContent =
           "Copied!";
   
   
         setTimeout(
           () => {
   
             $("copyResultBtn")
               .textContent =
               "Copy Result";
   
           },
           1200
         );
   
       }
     );
   
   
   $("shareBtn")
     .addEventListener(
       "click",
       async () => {
   
         const text =
           getShareText();
   
   
         if (
           navigator.share
         ) {
   
           try {
   
             await navigator.share({
   
               title:
                 "My Writing Result",
   
               text
   
             });
   
           } catch {
   
             /* User cancelled share. */
   
           }
   
         } else {
   
           await navigator.clipboard
             .writeText(
               text
             );
   
   
           $("shareBtn")
             .textContent =
             "Result Copied!";
   
   
           setTimeout(
             () => {
   
               $("shareBtn")
                 .textContent =
                 "Share Result";
   
             },
             1500
           );
   
         }
   
       }
     );
   
   
   /* =========================================
      NOTEBOOK EVENTS
      ========================================= */
   
   $("speechStart")
     .addEventListener(
       "click",
       startNotebook
     );
   
   
   $("speechPause")
     .addEventListener(
       "click",
       pauseNotebook
     );
   
   
   $("speechStop")
     .addEventListener(
       "click",
       stopNotebook
     );
   
   
   $("voiceRate")
     .addEventListener(
       "input",
       () => {
   
         $("voiceRateValue")
           .textContent =
           `${Number(
             $("voiceRate").value
           ).toFixed(2)}×`;
   
       }
     );
   
   
   /* =========================================
      VOICES
      ========================================= */
   
   if (
     "speechSynthesis" in window
   ) {
   
     speechSynthesis
       .addEventListener(
         "voiceschanged",
         populateVoices
       );
   
   }
   
   
   /* =========================================
      LOAD SETTINGS
      ========================================= */
   
   const savedSettings =
     JSON.parse(
       localStorage.getItem(
         SETTINGS_KEY
       ) || "null"
     );
   
   
   if (savedSettings) {
   
     TARGET_CPM =
       savedSettings.cpm ||
       68;
   
     READING_WPM =
       savedSettings.reading ||
       200;
   
     GOAL_WORDS =
       savedSettings.wordGoal ||
       500;
   
     GOAL_CHARS =
       savedSettings.charGoal ||
       3000;
   
   }
   
   
   /* =========================================
      LOAD THEME
      ========================================= */
   
   if (
     localStorage.getItem(
       THEME_KEY
     ) === "dark"
   ) {
   
     document.body
       .classList
       .add("dark");
   
   
     $("themeBtn")
       .textContent =
       "☀️";
   
   }
   
   
   /* =========================================
      LOAD SAVED TEXT
      ========================================= */
   
   const savedText =
     localStorage.getItem(
       TEXT_KEY
     );
   
   
   if (savedText) {
   
     $("textInput").value =
       savedText;
   
   }
   
   
   /* =========================================
      LOAD SETTINGS UI
      ========================================= */
   
   $("settingCpm").value =
     TARGET_CPM;
   
   $("settingReading").value =
     READING_WPM;
   
   $("settingWordGoal").value =
     GOAL_WORDS;
   
   $("settingCharGoal").value =
     GOAL_CHARS;
   
   
   /* =========================================
      INITIALIZE
      ========================================= */
   
   renderPersonalBest();
   
   renderHistory();
   
   populateVoices();
   
   updateAll();
   
   $("timerDisplay")
     .textContent =
     "0:00";
   
   
   /* Resize graph */
   
   window.addEventListener(
     "resize",
     drawCPMGraph
   );   