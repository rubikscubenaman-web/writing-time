const TARGET_CPM = 68;
const READING_WPM = 200;

const STORAGE_TEXT = "writingTime_text_v3";
const STORAGE_HISTORY = "writingTime_history_v3";
const STORAGE_THEME = "writingTime_theme_v3";


/* ELEMENT HELPER */

const $ = id => document.getElementById(id);


/* VARIABLES */

const textInput = $("textInput");

let elapsedSeconds = 0;

let timerInterval = null;

let timerRunning = false;

let sessionStartedAt = null;

let history = JSON.parse(
  localStorage.getItem(STORAGE_HISTORY) || "[]"
);


/* SPEECH VARIABLES */

let speechWords = [];

let speechIndex = 0;

let speechTimer = null;

let speechPaused = false;

let speechStopped = true;

let voices = [];


/* TIME FORMAT */

function formatTime(seconds) {

  seconds = Math.max(
    0,
    Math.round(seconds)
  );

  return `${Math.floor(seconds / 60)}:${String(
    seconds % 60
  ).padStart(2, "0")}`;

}


/* HTML ESCAPE */

function escapeHTML(str) {

  return str.replace(
    /[&<>"']/g,

    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[c])
  );

}


/* WORDS */

function getWords(text) {

  return text.trim()
    ? text
        .trim()
        .split(/\s+/)
        .filter(Boolean)
    : [];

}


/* STATISTICS */

function getStats(text) {

  const words = getWords(text);

  const letters =
    (
      text.match(
        /[A-Za-zÀ-ÖØ-öø-ÿ]/g
      ) || []
    ).length;


  const numbers =
    (
      text.match(/[0-9]/g) || []
    ).length;


  const sentences =
    (
      text.match(
        /[.!?]+(?=\s|$)/g
      ) || []
    ).length;


  const paragraphs =
    text.trim()
      ? text
          .split(/\n\s*\n/)
          .filter(p => p.trim()).length
      : 0;


  return {

    words,

    letters,

    numbers,

    characters: [...text].length,

    sentences,

    paragraphs:
      paragraphs ||
      (text.trim() ? 1 : 0)

  };

}


/* MAIN UPDATE */

function update() {

  const text = textInput.value;

  const s = getStats(text);


  $("words").textContent =
    s.words.length;

  $("letters").textContent =
    s.letters;

  $("numbers").textContent =
    s.numbers;

  $("characters").textContent =
    s.characters;

  $("sentences").textContent =
    s.sentences;

  $("paragraphs").textContent =
    s.paragraphs;


  $("charHint").textContent =
    `${s.characters.toLocaleString()} characters`;


  /* ESTIMATED TIME */

  const estimatedSeconds =
    s.letters /
    TARGET_CPM *
    60;


  $("estimatedTime").textContent =
    formatTime(estimatedSeconds);


  $("actualTime").textContent =
    formatTime(elapsedSeconds);


  $("timeDifference").textContent =
    formatTime(
      Math.abs(
        elapsedSeconds -
        estimatedSeconds
      )
    );


  /* SPEED */

  const minutes =
    elapsedSeconds / 60;


  const speed =
    minutes > 0
      ? s.letters / minutes
      : 0;


  const wpm =
    minutes > 0
      ? s.words.length / minutes
      : 0;


  const cps =
    elapsedSeconds > 0
      ? s.letters / elapsedSeconds
      : 0;


  $("speed").innerHTML =
    `${Math.round(speed)}
    <small>chars/min</small>`;


  $("wpm").textContent =
    wpm.toFixed(1);


  $("cps").textContent =
    cps.toFixed(2);


  /* READING TIME */

  const readingSeconds =
    s.words.length /
    READING_WPM *
    60;


  $("readingTime").textContent =
    formatTime(readingSeconds);


  /* PROGRESS */

  const target =
    estimatedSeconds || 1;


  const progress =
    Math.min(
      100,
      elapsedSeconds /
      target *
      100
    );


  $("progressBar").style.width =
    `${progress}%`;


  $("progressText").textContent =
    `${Math.round(progress)}%`;


  /* OTHER FEATURES */

  renderAnalysis(
    text,
    s,
    speed
  );


  renderFrequency(text);


  updateScore(
    text,
    s,
    speed
  );


  /* SAVE TEXT */

  localStorage.setItem(
    STORAGE_TEXT,
    text
  );


  $("autosaveStatus").textContent =
    text
      ? "Saved locally • " +
        new Date().toLocaleTimeString()
      : "Saved locally";

}


/* TEXT ANALYSIS */

function renderAnalysis(
  text,
  s,
  speed
) {

  const avgWord =
    s.words.length
      ? s.characters /
        s.words.length
      : 0;


  const avgSentence =
    s.sentences
      ? s.words.length /
        s.sentences
      : 0;


  const longWords =
    getWords(text)
      .filter(
        w =>
          w
            .replace(
              /[^A-Za-z]/g,
              ""
            ).length >= 8
      ).length;


  const punctuation =
    (
      text.match(
        /[.,!?;:]/g
      ) || []
    ).length;


  const density =
    s.characters
      ? punctuation /
        s.characters *
        100
      : 0;


  const items = [

    [
      "Average word length",
      `${avgWord.toFixed(1)} characters`
    ],

    [
      "Average sentence",
      `${avgSentence.toFixed(1)} words`
    ],

    [
      "Long words",
      longWords
    ],

    [
      "Punctuation",
      punctuation
    ],

    [
      "Punctuation density",
      `${density.toFixed(2)}%`
    ],

    [
      "Current speed",
      `${Math.round(speed)} chars/min`
    ]

  ];


  $("analysisList").innerHTML =
    items.map(
      ([name, value]) => `

        <div class="analysis-item">

          <span>
            ${name}
          </span>

          <strong>
            ${value}
          </strong>

        </div>

      `
    ).join("");

}


/* WORD FREQUENCY 2.0 */

function renderFrequency(text) {

  const counts = {};


  getWords(text).forEach(raw => {

    const word =
      raw
        .toLowerCase()
        .replace(
          /^[^a-z0-9]+|[^a-z0-9]+$/gi,
          ""
        );


    if (!word) {
      return;
    }


    counts[word] =
      (counts[word] || 0) + 1;

  });


  const sorted =
    Object.entries(counts)

      .sort(
        (a, b) =>
          b[1] - a[1] ||
          a[0].localeCompare(b[0])
      )

      .slice(0, 10);


  if (!sorted.length) {

    $("frequencyList").innerHTML = `
      <p class="empty">
        Start writing to see word frequency.
      </p>
    `;

    return;

  }


  const max =
    sorted[0][1];


  $("frequencyList").innerHTML =
    sorted.map(
      ([word, count], index) => `

        <div class="frequency-row">

          <span>
            ${index + 1}
          </span>


          <span class="frequency-word">

            ${escapeHTML(word)}

            <span class="frequency-bar">

              <div
                style="width:${count / max * 100}%"
              ></div>

            </span>

          </span>


          <span class="frequency-count">

            ${count}
            time${count === 1 ? "" : "s"}

          </span>

        </div>

      `
    ).join("");

}


/* SESSION SCORE 2.0 */

function updateScore(
  text,
  s,
  speed
) {

  if (!s.characters) {

    [
      "score",
      "scoreCompletion",
      "scoreSpeed",
      "scoreConsistency",
      "scoreQuality"
    ].forEach(
      id =>
        $(id).textContent = "0"
    );


    $("scoreGrade").textContent =
      "Not started";


    return;

  }


  const estimated =
    s.letters /
    TARGET_CPM *
    60;


  const completion =
    Math.min(
      100,
      s.characters /
      500 *
      100
    );


  const speedScore =
    Math.min(
      100,
      speed /
      TARGET_CPM *
      100
    );


  const consistency =
    elapsedSeconds === 0

      ? 0

      : Math.max(
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
        );


  const quality =
    Math.min(
      100,

      (s.sentences > 0
        ? 25
        : 0)

      +

      (s.words.length >= 20
        ? 25
        : s.words.length /
          20 *
          25)

      +

      (s.characters >= 100
        ? 30
        : s.characters /
          100 *
          30)

      +

      (
        s.characters > 0 &&
        s.sentences > 0
          ? 20
          : 0
      )
    );


  const total =
    Math.round(

      completion *
      0.20

      +

      speedScore *
      0.30

      +

      consistency *
      0.25

      +

      quality *
      0.25

    );


  $("score").textContent =
    total;


  $("scoreCompletion").textContent =
    Math.round(completion);


  $("scoreSpeed").textContent =
    Math.round(speedScore);


  $("scoreConsistency").textContent =
    Math.round(consistency);


  $("scoreQuality").textContent =
    Math.round(quality);


  const grade =
    total >= 90
      ? "Excellent"

      : total >= 75
        ? "Great"

        : total >= 60
          ? "Good"

          : total >= 40
            ? "Developing"

            : "Keep practicing";


  $("scoreGrade").textContent =
    grade;

}


/* START TIMER */

function startTimer() {

  if (timerRunning) {
    return;
  }


  timerRunning = true;


  if (!sessionStartedAt) {

    sessionStartedAt =
      Date.now() -
      elapsedSeconds * 1000;

  }


  timerInterval =
    setInterval(() => {

      elapsedSeconds =
        Math.floor(
          (
            Date.now() -
            sessionStartedAt
          ) / 1000
        );


      $("timerDisplay").textContent =
        formatTime(
          elapsedSeconds
        );


      update();

    }, 250);


  $("startBtn").disabled =
    true;


  $("pauseBtn").disabled =
    false;

}


/* PAUSE TIMER */

function pauseTimer() {

  if (!timerRunning) {
    return;
  }


  elapsedSeconds =
    Math.floor(
      (
        Date.now() -
        sessionStartedAt
      ) / 1000
    );


  clearInterval(
    timerInterval
  );


  timerRunning = false;


  $("startBtn").disabled =
    false;


  $("pauseBtn").disabled =
    true;


  update();

}


/* RESET TIMER */

function resetTimer(save = true) {

  if (
    save &&
    textInput.value.trim() &&
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

  sessionStartedAt = null;


  $("timerDisplay").textContent =
    "0:00";


  $("startBtn").disabled =
    false;


  $("pauseBtn").disabled =
    true;


  update();

}


/* SAVE SESSION */

function saveSession() {

  const s =
    getStats(
      textInput.value
    );


  const estimated =
    s.letters /
    TARGET_CPM *
    60;


  const session = {

    date:
      new Date().toLocaleString(),

    words:
      s.words.length,

    letters:
      s.letters,

    actual:
      elapsedSeconds,

    estimated:
      Math.round(estimated),

    score:
      Number(
        $("score").textContent
      ) || 0

  };


  history.unshift(
    session
  );


  history =
    history.slice(0, 10);


  localStorage.setItem(
    STORAGE_HISTORY,
    JSON.stringify(history)
  );


  renderHistory();

}


/* HISTORY */

function renderHistory() {

  if (!history.length) {

    $("historyList").innerHTML = `

      <p class="empty">

        No saved sessions yet.
        A session is saved when you reset
        or clear the timer.

      </p>

    `;

    return;

  }


  $("historyList").innerHTML =
    history.map(
      h => `

        <div class="history-item">

          <div>

            <strong>
              ${h.words}
              words •
              ${h.letters}
              letters
            </strong>

            <br>

            <small>
              ${escapeHTML(h.date)}
            </small>

          </div>


          <div>

            <strong>
              ${formatTime(h.actual)}
            </strong>

            <br>

            <small>
              actual
            </small>

          </div>


          <div>

            <strong>
              ${h.score}/100
            </strong>

            <br>

            <small>
              score
            </small>

          </div>

        </div>

      `
    ).join("");

}


/* CLEAR */

function clearAll() {

  if (
    textInput.value.trim() &&
    elapsedSeconds > 0
  ) {

    saveSession();

  }


  stopSpeech();


  textInput.value = "";


  resetTimer(false);


  localStorage.removeItem(
    STORAGE_TEXT
  );


  update();

}


/* DOWNLOAD */

function downloadText() {

  const blob =
    new Blob(
      [textInput.value],
      {
        type:
          "text/plain;charset=utf-8"
      }
    );


  const a =
    document.createElement("a");


  a.href =
    URL.createObjectURL(blob);


  a.download =
    "writing-paragraph.txt";


  a.click();


  URL.revokeObjectURL(
    a.href
  );

}


/* SAMPLE */

function loadSample() {

  textInput.value =
    "Writing every day improves speed, accuracy, concentration, and confidence. The more carefully you practice, the easier it becomes to organize your ideas and complete paragraphs efficiently.";


  update();

}


/* VOICES */

function populateVoices() {

  if (
    !("speechSynthesis" in window)
  ) {

    $("speechStatus").textContent =
      "Speech synthesis is not supported by this browser.";

    return;

  }


  voices =
    speechSynthesis.getVoices();


  const current =
    $("voiceSelect").value;


  $("voiceSelect").innerHTML =
    voices.map(
      (voice, index) => `

        <option value="${index}">

          ${escapeHTML(
            voice.name
          )}

          —

          ${escapeHTML(
            voice.lang
          )}

        </option>

      `
    ).join("");


  if (current) {

    $("voiceSelect").value =
      current;

  }

}


/* SPEECH NEXT WORD */

function speakNextWord() {

  if (
    speechStopped ||
    speechPaused
  ) {

    return;

  }


  if (
    speechIndex >=
    speechWords.length
  ) {

    $("speechStatus").textContent =
      "Finished reading all words.";

    return;

  }


  const word =
    speechWords[speechIndex];


  $("speechStatus").textContent =
    `Word ${
      speechIndex + 1
    }/${speechWords.length}: "${word}"`;


  const utterance =
    new SpeechSynthesisUtterance(
      word
    );


  const voiceIndex =
    Number(
      $("voiceSelect").value
    );


  if (
    voices[voiceIndex]
  ) {

    utterance.voice =
      voices[voiceIndex];

  }


  utterance.rate =
    Number(
      $("voiceRate").value
    );


  utterance.onend = () => {

    if (
      speechStopped ||
      speechPaused
    ) {

      return;

    }


    const chars =
      [...word].length;


    /*
      68 characters per minute
    */

    const waitMs =
      chars /
      TARGET_CPM *
      60 *
      1000;


    $("speechStatus").textContent =
      `Writing time for "${word}": ${
        formatTime(
          waitMs / 1000
        )
      }.`;


    speechTimer =
      setTimeout(() => {

        speechIndex++;

        speakNextWord();

      }, waitMs);

  };


  utterance.onerror = () => {

    $("speechStatus").textContent =
      "Speech error. Try another browser voice.";

  };


  speechSynthesis.speak(
    utterance
  );

}


/* START SPEECH */

function startSpeech() {

  if (
    !("speechSynthesis" in window)
  ) {

    return;

  }


  speechSynthesis.cancel();

  clearTimeout(
    speechTimer
  );


  speechWords =
    getWords(
      textInput.value
    );


  if (!speechWords.length) {

    $("speechStatus").textContent =
      "Enter a paragraph first.";

    return;

  }


  speechIndex = 0;

  speechPaused = false;

  speechStopped = false;


  $("speechStart").disabled =
    true;


  $("speechPause").disabled =
    false;


  speakNextWord();

}


/* PAUSE SPEECH */

function pauseSpeech() {

  if (speechStopped) {
    return;
  }


  speechPaused = true;


  speechSynthesis.cancel();


  clearTimeout(
    speechTimer
  );


  $("speechStart").disabled =
    false;


  $("speechPause").disabled =
    true;


  $("speechStatus").textContent =
    "Speech mode paused.";

}


/* STOP SPEECH */

function stopSpeech() {

  speechStopped = true;

  speechPaused = false;


  speechSynthesis.cancel();


  clearTimeout(
    speechTimer
  );


  $("speechStart").disabled =
    false;


  $("speechPause").disabled =
    true;


  $("speechStatus").textContent =
    "Ready.";

}


/* TEXT INPUT */

textInput.addEventListener(
  "input",
  () => {

    if (
      !timerRunning &&
      textInput.value.length > 0
    ) {

      startTimer();

    }


    update();

  }
);


/* BUTTON EVENTS */

$("startBtn").addEventListener(
  "click",
  startTimer
);


$("pauseBtn").addEventListener(
  "click",
  pauseTimer
);


$("resetBtn").addEventListener(
  "click",
  () => resetTimer(true)
);


$("clearBtn").addEventListener(
  "click",
  clearAll
);


$("sampleBtn").addEventListener(
  "click",
  loadSample
);


/* COPY */

$("copyBtn").addEventListener(
  "click",
  async () => {

    try {

      await navigator.clipboard
        .writeText(
          textInput.value
        );


      $("copyBtn").textContent =
        "Copied!";


      setTimeout(
        () =>
          $("copyBtn").textContent =
            "Copy",
        1200
      );

    } catch {

      $("copyBtn").textContent =
        "Copy failed";


      setTimeout(
        () =>
          $("copyBtn").textContent =
            "Copy",
        1200
      );

    }

  }
);


/* DOWNLOAD */

$("downloadBtn").addEventListener(
  "click",
  downloadText
);


/* DARK MODE */

$("themeBtn").addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "dark"
    );


    const dark =
      document.body.classList.contains(
        "dark"
      );


    localStorage.setItem(
      STORAGE_THEME,
      dark
        ? "dark"
        : "light"
    );


    $("themeBtn").textContent =
      dark
        ? "☀️"
        : "🌙";

  }
);


/* CLEAR HISTORY */

$("clearHistoryBtn")
  .addEventListener(
    "click",
    () => {

      history = [];


      localStorage.removeItem(
        STORAGE_HISTORY
      );


      renderHistory();

    }
  );


/* SPEECH */

$("speechStart")
  .addEventListener(
    "click",
    startSpeech
  );


$("speechPause")
  .addEventListener(
    "click",
    pauseSpeech
  );


$("speechStop")
  .addEventListener(
    "click",
    stopSpeech
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


/* VOICE LOADING */

if (
  "speechSynthesis" in window
) {

  speechSynthesis.addEventListener(
    "voiceschanged",
    populateVoices
  );

}


/* LOAD THEME */

const savedTheme =
  localStorage.getItem(
    STORAGE_THEME
  );


if (
  savedTheme === "dark"
) {

  document.body.classList.add(
    "dark"
  );


  $("themeBtn").textContent =
    "☀️";

}


/* LOAD SAVED TEXT */

const savedText =
  localStorage.getItem(
    STORAGE_TEXT
  );


if (savedText) {

  textInput.value =
    savedText;

}


/* INITIALIZE */

renderHistory();

populateVoices();

update();

$("timerDisplay").textContent =
  "0:00";