let intervalId = null;
let totalDuration = 0;
let elapsedSeconds = 0;
const sessionHistory = JSON.parse(localStorage.getItem("sessionHistory")) || [];

document.getElementById("startButton").addEventListener("click", function () {
  const studyDuration = parseInt(document.getElementById("studyDuration").value, 10);
  const breakDuration = parseInt(document.getElementById("breakDuration").value, 10);

  // Save settings to localStorage
  localStorage.setItem("studyDuration", studyDuration);
  localStorage.setItem("breakDuration", breakDuration);

  totalDuration = (studyDuration + breakDuration) * 60; // Convert to seconds
  elapsedSeconds = 0;

  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(updateProgress, 10);

  // Add session to history
  addSessionToHistory(studyDuration, breakDuration);
});

function updateProgress() {
  elapsedSeconds++;
  const progressPercentage = (elapsedSeconds / totalDuration) * 100;
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = `${progressPercentage}%`;

  if (elapsedSeconds >= totalDuration) {
    clearInterval(intervalId);
    alert("Session complete!");
    displaySessionHistory();
  }
}

function addSessionToHistory(studyDuration, breakDuration) {
  const now = new Date();
  const session = {
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    studyDuration,
    breakDuration,
  };

  sessionHistory.push(session);
  localStorage.setItem("sessionHistory", JSON.stringify(sessionHistory));
}

function displaySessionHistory() {
  const historyContainer = document.getElementById("sessionHistory") || createHistoryContainer();
  historyContainer.innerHTML = "<h4>Session History</h4>";

  for (let i = 0; i < sessionHistory.length; i++) {
    const session = sessionHistory[i];
    const sessionDiv = document.createElement("div");
    sessionDiv.textContent = `Date: ${session.date}, Time: ${session.time}, Study: ${session.studyDuration} minutes, Break: ${session.breakDuration} minutes`;
    historyContainer.appendChild(sessionDiv);
  }
}

function createHistoryContainer() {
  const container = document.createElement("div");
  container.id = "sessionHistory";
  document.body.appendChild(container);
  return container;
}

// Load settings from localStorage
window.onload = () => {
  const savedStudyDuration = localStorage.getItem("studyDuration");
  const savedBreakDuration = localStorage.getItem("breakDuration");

  if (savedStudyDuration) {
    document.getElementById("studyDuration").value = savedStudyDuration;
  }

  if (savedBreakDuration) {
    document.getElementById("breakDuration").value = savedBreakDuration;
  }
  displaySessionHistory();
};
