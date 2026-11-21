const API_BASE = "http://127.0.0.1:8000";

let currentProblem = null;
let analysisData = null;
let currentHintLevel = 0;

document.addEventListener("DOMContentLoaded", async () => {
  const { access_token } = await chrome.storage.local.get(["access_token"]);

  if (access_token) {
    showAppView();
    scanActiveTab();
  } else {
    showLoginView();
  }

  document.getElementById("login-btn").addEventListener("click", handleLogin);
  document.getElementById("logout-btn").addEventListener("click", handleLogout);
  document
    .getElementById("analyze-btn")
    .addEventListener("click", handleAnalyzePattern);
  document.getElementById("hint-btn").addEventListener("click", handleGetHint);
  document
    .getElementById("save-session-btn")
    .addEventListener("click", handleSaveSession);
});

function showLoginView() {
  document.getElementById("login-section").classList.remove("hidden");
  document.getElementById("app-section").classList.add("hidden");
  document.getElementById("logout-btn").classList.add("hidden");
}

function showAppView() {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("app-section").classList.remove("hidden");
  document.getElementById("logout-btn").classList.remove("hidden");
}

async function handleLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("login-error");
  const btn = document.getElementById("login-btn");

  errorEl.textContent = "";

  if (!email || !password) {
    errorEl.textContent = "Please enter both email and password.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Logging in...";

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");

    await chrome.storage.local.set({ access_token: data.access_token });
    showAppView();
    scanActiveTab();
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = "Login";
  }
}

async function handleLogout() {
  await chrome.storage.local.remove(["access_token"]);

  currentProblem = null;
  analysisData = null;
  currentHintLevel = 0;

  document.getElementById("hints-container").innerHTML = "";
  document.getElementById("analysis-result").classList.add("hidden");
  document.getElementById("session-card").classList.add("hidden");

  showLoginView();
}

async function scanActiveTab() {
  const statusEl = document.getElementById("status");
  const titleEl = document.getElementById("problem-title");
  const analyzeBtn = document.getElementById("analyze-btn");

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab || !tab.url || !tab.url.includes("leetcode.com/problems/")) {
    statusEl.textContent = "Open a LeetCode problem page to begin.";
    titleEl.textContent = "—";
    analyzeBtn.disabled = true;
    return;
  }

  chrome.tabs.sendMessage(tab.id, { action: "GET_PROBLEM" }, (response) => {
    if (chrome.runtime.lastError || !response || !response.problem_text) {
      statusEl.textContent = "Please refresh the LeetCode tab and try again.";
      return;
    }

    currentProblem = response;
    statusEl.textContent = "Problem detected!";
    titleEl.textContent = response.title || "Untitled Problem";
    analyzeBtn.disabled = false;
  });
}

async function handleAnalyzePattern() {
  const btn = document.getElementById("analyze-btn");
  const hintBtn = document.getElementById("hint-btn");
  const errorEl = document.getElementById("app-error");

  errorEl.textContent = "";
  btn.disabled = true;
  btn.textContent = "Analyzing with Gemini...";

  try {
    const { access_token } = await chrome.storage.local.get(["access_token"]);

    const res = await fetch(`${API_BASE}/api/analysis/pattern`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        problem_text: currentProblem.problem_text,
      }),
    });

    if (res.status === 401) {
      await handleLogout();
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Pattern analysis failed");

    analysisData = data;
    currentHintLevel = 0;

    document.getElementById("hints-container").innerHTML = "";
    document.getElementById("hints-display").value = 0;
    document.getElementById("session-card").classList.remove("hidden");

    // Render results
    document.getElementById("primary-pattern").textContent =
      data.primary_pattern;

    document.getElementById("secondary-patterns").textContent =
      (data.secondary_patterns || []).join(", ") || "None";

    const signalsList = document.getElementById("signals-list");
    signalsList.innerHTML = "";

    (data.recognition_signals || []).forEach((sig) => {
      const li = document.createElement("li");
      li.textContent = sig;
      signalsList.appendChild(li);
    });

    document.getElementById("why-pattern").textContent = data.why_this_pattern;

    document.getElementById("analysis-result").classList.remove("hidden");

    // Unlock progressive hints
    hintBtn.disabled = false;
    hintBtn.textContent = "Get Hint (Level 1)";
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = "Re-analyze Pattern";
  }
}

async function handleGetHint() {
  if (!analysisData || currentHintLevel >= 3) return;

  const hintBtn = document.getElementById("hint-btn");
  const errorEl = document.getElementById("app-error");
  const nextLevel = currentHintLevel + 1;

  errorEl.textContent = "";
  hintBtn.disabled = true;
  hintBtn.textContent = `Generating Hint ${nextLevel}...`;

  try {
    const { access_token } = await chrome.storage.local.get(["access_token"]);

    const res = await fetch(`${API_BASE}/api/analysis/hint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        problem_text: currentProblem.problem_text,
        pattern: analysisData.primary_pattern,
        hint_level: nextLevel,
      }),
    });

    if (res.status === 401) {
      await handleLogout();
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Hint generation failed");

    currentHintLevel = nextLevel;
    document.getElementById("hints-display").value = currentHintLevel;

    const hintBox = document.createElement("div");
    hintBox.className = "hint-box";
    hintBox.innerHTML = `<strong>Hint ${nextLevel}:</strong> ${data.hint}`;

    document.getElementById("hints-container").appendChild(hintBox);

    if (currentHintLevel < 3) {
      hintBtn.disabled = false;
      hintBtn.textContent = `Get Hint (Level ${currentHintLevel + 1})`;
    } else {
      hintBtn.textContent = "All 3 Hints Shown";
    }
  } catch (err) {
    errorEl.textContent = err.message;
    hintBtn.disabled = false;
    hintBtn.textContent = `Get Hint (Level ${nextLevel})`;
  }
}

async function handleSaveSession() {
  if (!currentProblem || !analysisData) return;

  const btn = document.getElementById("save-session-btn");
  const msgEl = document.getElementById("session-msg");
  const errEl = document.getElementById("session-error");

  msgEl.textContent = "";
  errEl.textContent = "";

  btn.disabled = true;
  btn.textContent = "Saving...";

  const status = document.getElementById("session-status").value;

  const timeTaken =
    parseInt(document.getElementById("time-mins").value, 10) || 15;

  const confidence =
    parseInt(document.getElementById("confidence").value, 10) || 3;

  const notes = document.getElementById("struggle-notes").value.trim();

  const isIndependent = status === "Solved" && currentHintLevel === 0;

  const payload = {
    time_taken_mins: timeTaken,
    hints_used: currentHintLevel,
    approach_requested: false,
    code_requested: false,
    hints_used_after_solve: 0,
    approach_requested_after_solve: false,
    code_requested_after_solve: false,
    status: status,
    solved_independently: isIndependent ? "Yes" : "No",
    confidence: confidence,
    struggle_notes: notes,

    problem_details: {
      leetcode_id:
        currentProblem.leetcode_id ||
        currentProblem.title.toLowerCase().replace(/\s+/g, "-"),
      title: currentProblem.title || "Untitled Problem",
      url: currentProblem.url || "",
      difficulty: currentProblem.difficulty || "Medium",
      primary_pattern: analysisData.primary_pattern,
      secondary_patterns: analysisData.secondary_patterns || [],
      recognition_signals: analysisData.recognition_signals || [],
      why_this_pattern: analysisData.why_this_pattern || "",
    },
  };

  try {
    const { access_token } = await chrome.storage.local.get(["access_token"]);

    const res = await fetch(`${API_BASE}/api/sessions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      await handleLogout();
      return;
    }

    const data = await res.json();

    // Improved FastAPI 422 validation error handling
    if (!res.ok) {
      const errorMsg = Array.isArray(data.detail)
        ? data.detail.map((e) => `${e.loc.slice(-1)[0]}: ${e.msg}`).join(" | ")
        : data.detail || "Failed to save session";

      throw new Error(errorMsg);
    }

    msgEl.textContent = `Saved! (Session #${data.session_id})`;
  } catch (err) {
    errEl.textContent = err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = "Save Session";
  }
}
