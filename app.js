// --- Data Soal Kuis ---
const quizData = [
  {
    question: "Manakah sintaks yang benar untuk memanggil file JavaScript eksternal?",
    options: ["<script href='app.js'>", "<script src='app.js'>", "<script name='app.js'>", "<script link='app.js'>"],
    answer: 1
  },
  {
    question: "Method mana yang digunakan untuk menambahkan elemen di akhir Array?",
    options: [".pop()", ".unshift()", ".push()", ".shift()"],
    answer: 2
  },
  {
    question: "Keyword mana yang digunakan untuk mendeklarasikan variabel bernilai konstan?",
    options: ["let", "var", "const", "static"],
    answer: 2
  },
  {
    question: "Properti CSS apa yang digunakan untuk membuat efek buram kaca (glassmorphism)?",
    options: ["backdrop-filter", "background-blur", "box-shadow", "filter-blur"],
    answer: 0
  },
  {
    question: "Fitur penyimpanan browser mana yang datanya tetap ada meskipun browser ditutup?",
    options: ["sessionStorage", "localStorage", "Cookies", "MemoryCache"],
    answer: 1
  }
];

// --- State Aplikasi ---
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
const TIME_LIMIT = 15;
let timeLeft = TIME_LIMIT;

// --- Selektor Elemen HTML ---
const screenStart = document.getElementById("screen-start");
const screenQuiz = document.getElementById("screen-quiz");
const screenResult = document.getElementById("screen-result");

const btnStart = document.getElementById("btn-start");
const btnNext = document.getElementById("btn-next");
const btnRestart = document.getElementById("btn-restart");

const flashcard = document.getElementById("flashcard");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const questionTracker = document.getElementById("question-tracker");
const progressBar = document.getElementById("progress-bar");
const timerDisplay = document.getElementById("timer");

const finalScoreDisplay = document.getElementById("final-score");
const scoreMessage = document.getElementById("score-message");
const startHighScoreDisplay = document.getElementById("start-high-score");
const resultHighScoreDisplay = document.getElementById("result-high-score");

// --- Switch Screen Helper dengan Fade ---
const switchScreen = (fromScreen, toScreen) => {
  fromScreen.classList.remove("active");
  setTimeout(() => {
    fromScreen.classList.add("hidden");
    toScreen.classList.remove("hidden");
    setTimeout(() => toScreen.classList.add("active"), 50);
  }, 300);
};

// --- High Score Handler ---
const updateHighScoreDisplay = () => {
  const savedHighScore = localStorage.getItem("quiz_high_score") || "0";
  startHighScoreDisplay.textContent = `${savedHighScore} Pts`;
  resultHighScoreDisplay.textContent = `${savedHighScore} Pts`;
};

// --- Timer Control ---
const startTimer = () => {
  timeLeft = TIME_LIMIT;
  timerDisplay.textContent = `${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
};

const stopTimer = () => clearInterval(timerInterval);

// --- Render Question & Flashcard Animation ---
const renderQuestion = () => {
  const currentQuiz = quizData[currentQuestionIndex];
  
  // Flashcard Pop Animation Effect
  flashcard.classList.add("pop");
  setTimeout(() => flashcard.classList.remove("pop"), 300);

  // Set Content
  questionText.textContent = currentQuiz.question;
  questionTracker.textContent = `Soal ${currentQuestionIndex + 1} / ${quizData.length}`;
  progressBar.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;
  
  btnNext.classList.add("hidden");
  optionsContainer.textContent = ""; 

  // Render options safely via DOM createElement
  currentQuiz.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.classList.add("option-btn");
    button.textContent = option;
    button.dataset.index = index;
    optionsContainer.appendChild(button);
  });

  startTimer();
};

// --- Event Delegation for Answer Click ---
optionsContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("option-btn")) return;

  stopTimer();
  const selectedBtn = e.target;
  const selectedAnswer = parseInt(selectedBtn.dataset.index);
  const correctAnswer = quizData[currentQuestionIndex].answer;

  if (selectedAnswer === correctAnswer) {
    selectedBtn.classList.add("correct");
    score += 20;
  } else {
    selectedBtn.classList.add("incorrect");
    optionsContainer.children[correctAnswer].classList.add("correct");
  }

  Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);
  btnNext.classList.remove("hidden");
});

// --- Timeout Handler ---
const handleTimeout = () => {
  const correctAnswer = quizData[currentQuestionIndex].answer;
  optionsContainer.children[correctAnswer].classList.add("correct");
  Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);
  btnNext.classList.remove("hidden");
};

// --- Next Question / Result Trigger ---
const handleNextQuestion = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    renderQuestion();
  } else {
    showResult();
  }
};

// --- Show Result Screen ---
const showResult = () => {
  finalScoreDisplay.textContent = score;

  if (score === 100) scoreMessage.textContent = "Sempurna! Kamu master Web Dev! 🌟";
  else if (score >= 60) scoreMessage.textContent = "Keren! Hasil yang sangat solid! 👍";
  else scoreMessage.textContent = "Tetap semangat, yuk latihan lagi! 💪";

  const currentHighScore = parseInt(localStorage.getItem("quiz_high_score") || "0");
  if (score > currentHighScore) {
    localStorage.setItem("quiz_high_score", score);
  }
  updateHighScoreDisplay();

  switchScreen(screenQuiz, screenResult);
};

// --- Start Quiz ---
const startQuiz = () => {
  currentQuestionIndex = 0;
  score = 0;
  
  if (!screenStart.classList.contains("hidden")) {
    switchScreen(screenStart, screenQuiz);
  } else {
    switchScreen(screenResult, screenQuiz);
  }
  
  renderQuestion();
};

// --- Event Listeners ---
btnStart.addEventListener("click", startQuiz);
btnNext.addEventListener("click", handleNextQuestion);
btnRestart.addEventListener("click", startQuiz);

// Initial High Score Load
updateHighScoreDisplay();