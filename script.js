const moodButtons = document.querySelectorAll("#mood .emoji");
const saveMoodButton = document.getElementById("savemoodbutton");
const addHabitBox = document.getElementById("addhabitbox");
const addHabitButton = document.getElementById("addhabitbutton");
const habitList = document.getElementById("ullist");
const checkboxes = document.querySelectorAll("#habits input[type='checkbox']");
const progressBar = document.getElementById("progressbar");



// ------------------ MOOD TRACKER ------------------ //

let selectedMood = null;
moodButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    moodButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMood = btn.textContent;
  });
});

// save mood to localStorage
saveMoodButton.addEventListener("click", () => {
  if (selectedMood) {
    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    moods.push({ mood: selectedMood, date: new Date().toLocaleDateString() });
    localStorage.setItem("moods", JSON.stringify(moods));
    alert("Mood Saved: " + selectedMood);
    updateChart();
  } else {
    alert("Please select a mood first!");
  }
});

// ------------------ HABITS TRACKER ------------------ //
// add new habit
addHabitButton.addEventListener("click", () => {
  const habitName = addHabitBox.value.trim();
  if (habitName) {
    const li = document.createElement("li");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.classList.add("checkbox");

    const label = document.createElement("label");
    label.textContent = habitName;

    li.appendChild(cb);
    li.appendChild(label);
    habitList.appendChild(li);
    addHabitBox.value = "";

    cb.addEventListener("change", updateProgress);
  }
});

// update progress bar when checkboxes change
document.querySelectorAll("#habits input[type='checkbox']").forEach(cb => {
  cb.addEventListener("change", updateProgress);
});

function updateProgress() {
  const all = document.querySelectorAll("#habits input[type='checkbox']").length;
  const checked = document.querySelectorAll("#habits input[type='checkbox']:checked").length;
  const percent = all ? (checked / all) * 100 : 0;
  progressBar.value = percent;
}

// ------------------ MOOD CHART ------------------ //
const ctx = document.getElementById("myChart").getContext("2d");
let chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["😀", "🙂", "😐", "😞", "😡"],
    datasets: [{
      label: "Mood Count",
      data: [0, 0, 0, 0, 0],
      backgroundColor: ["#4caf50", "#2196f3", "#ffeb3b", "#ff9800", "#f44336"]
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

function updateChart() {
  let moods = JSON.parse(localStorage.getItem("moods")) || [];
  let counts = { "😀": 0, "🙂": 0, "😐": 0, "😞": 0, "😡": 0 };
  moods.forEach(m => counts[m.mood]++);
  chart.data.datasets[0].data = Object.values(counts);
  chart.update();
}

// load saved data when page opens
updateChart();
