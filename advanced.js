document.addEventListener("DOMContentLoaded", () => {
  // ============================================================
  // GLOBALS
  // ============================================================
  const publicView = document.getElementById("public-view");
  const dashboardView = document.getElementById("dashboard-view");
  const mainNavbar = document.getElementById("main-navbar");
  const dashNavbar = document.getElementById("dash-navbar");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const logoutBtn = document.getElementById("logout-btn");
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const dashboardViews = document.querySelectorAll(".dashboard-view");

  let currentUser = { name: "Test Student", id: "2200320100123", hostel: "Vivekanand Bhawan", room: "101" };
  let selectedRating = 0;
  let ratingCount = 0;
  let ratingTotal = 0;
  let isDark = true;

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  function applyTheme(dark) {
    isDark = dark;
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    document.body.setAttribute("data-bs-theme", dark ? "dark" : "light");
    const icon = dark ? "fa-moon" : "fa-sun";
    document.querySelectorAll(".theme-toggle-btn i, .fab-item i.fa-moon, .fab-item i.fa-sun").forEach(el => {
      if (el.closest('#fab-theme') || el.closest('.theme-toggle-btn')) {
        el.className = `fas ${icon}`;
      }
    });
    localStorage.setItem("abes-theme", dark ? "dark" : "light");
  }

  // Restore theme
  const savedTheme = localStorage.getItem("abes-theme");
  if (savedTheme === "light") applyTheme(false);

  document.querySelectorAll("#theme-toggle-nav, #theme-toggle-dash, #fab-theme").forEach(btn => {
    btn.addEventListener("click", () => applyTheme(!isDark));
  });

  // ============================================================
  // FAB GROUP
  // ============================================================
  const fabMain = document.getElementById("fab-main-btn");
  const fabMenu = document.getElementById("fab-menu");
  fabMain.addEventListener("click", () => {
    fabMain.classList.toggle("open");
    fabMenu.classList.toggle("open");
  });

  document.getElementById("fab-chat").addEventListener("click", () => {
    chatPanel.classList.toggle("open");
    fabMain.classList.remove("open"); fabMenu.classList.remove("open");
  });
  document.getElementById("fab-emergency").addEventListener("click", () => {
    new bootstrap.Modal(document.getElementById("emergencyModal")).show();
    fabMain.classList.remove("open"); fabMenu.classList.remove("open");
  });

  // ============================================================
  // AI CHATBOT
  // ============================================================
  const chatPanel = document.getElementById("chat-panel");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");

  document.getElementById("chat-close").addEventListener("click", () => chatPanel.classList.remove("open"));

  const qaMap = [
    { q: ["fee", "fees", "cost", "charge", "price"], a: "Hostel fees range from ₹1,30,000 to ₹1,69,000 per year depending on room type and AC preference. A refundable ₹5,000 security deposit is also required. Use the Fee Calculator on the main page for your exact estimate!" },
    { q: ["leave", "go home", "out pass", "outpass", "application"], a: "To apply for leave: Login to your dashboard → Click 'Apply for Leave' in the sidebar → Fill the form with dates, reason, and guardian details → Submit. Your warden will approve within 24 hours." },
    { q: ["complaint", "issue", "problem", "broken", "repair", "maintenance"], a: "To lodge a complaint: Go to Dashboard → 'Lodge Complaint' → Select category & sub-category → Set priority → Describe your issue → Submit. You can track status under 'Complaint History'." },
    { q: ["mess", "food", "meal", "menu", "canteen"], a: "The hostel mess serves 4 veg meals daily: Breakfast (7–9 AM), Lunch (12–2 PM), Snacks (5–6 PM), and Dinner (7–9 PM). Check the 'Mess Menu' tab in your dashboard for the weekly schedule!" },
    { q: ["wifi", "internet", "network", "connection"], a: "The campus has 1 Gbps high-speed WiFi available 24/7 in all hostel blocks. If you face connectivity issues, lodge a complaint under 'Common Area → Wi-Fi Not Working'." },
    { q: ["gym", "sports", "swimming", "pool", "basketball", "badminton"], a: "We have an equipped gym, swimming pool, volleyball, basketball, badminton courts, and spacious playgrounds available to all hostel residents!" },
    { q: ["security", "safe", "cctv", "guard"], a: "The hostels have 24/7 multi-layered security with CCTV surveillance, biometric access, and round-the-clock security personnel. All entry/exit is monitored." },
    { q: ["login", "account", "password", "signup", "register", "activate"], a: "Click 'Activate Account' on the navbar to register with your student ID. Then use 'Student Login' with your ID and password. For demo, use any ID and password 'password'." },
    { q: ["contact", "warden", "phone", "email", "office"], a: "Hostel Office: +91 9310322194 | General: info@abes.ac.in | Admin: 0120-7135112 | Address: 19th KM Stone, NH-09, Ghaziabad, UP." },
    { q: ["room", "hostel block", "bhawan", "vivekanand", "vidushi", "chanakya"], a: "Boys: Vivekanand (1st yr), Dayananda & Chanakya (2nd yr), Ramakrishna & Aurbindo (Sr. yr). Girls: Vidushi Bhavan Blocks A, B, C (all years, all AC)." },
    { q: ["notice", "notification", "announcement", "meeting"], a: "Check the 'Notices' section in your dashboard for all official announcements, urgent alerts, and upcoming events!" },
    { q: ["hello", "hi", "hey", "namaste", "good morning", "good evening"], a: "Hello! 👋 How can I assist you today? Ask me about hostel fees, facilities, leave applications, complaints, or anything else!" },
  ];

  function getBotReply(msg) {
    const lower = msg.toLowerCase();
    for (const entry of qaMap) {
      if (entry.q.some(kw => lower.includes(kw))) return entry.a;
    }
    return "I'm not sure about that specific query. For detailed help, please contact the Hostel Office at +91 9310322194 or email info@abes.ac.in. You can also explore the portal using the navigation menu!";
  }

  function appendMessage(text, sender) {
    const div = document.createElement("div");
    div.className = `chat-msg ${sender}`;
    div.innerHTML = `<div class="msg-bubble">${text}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "chat-msg bot typing-indicator";
    div.innerHTML = `<div class="msg-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
    div.id = "typing-indicator";
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function sendChat() {
    const msg = chatInput.value.trim();
    if (!msg) return;
    appendMessage(msg, "user");
    chatInput.value = "";
    showTyping();
    setTimeout(() => {
      const typing = document.getElementById("typing-indicator");
      if (typing) typing.remove();
      appendMessage(getBotReply(msg), "bot");
    }, 1200 + Math.random() * 600);
  }

  chatSend.addEventListener("click", sendChat);
  chatInput.addEventListener("keydown", e => { if (e.key === "Enter") sendChat(); });

  // ============================================================
  // COUNTER ANIMATION
  // ============================================================
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"));
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target >= 1000 ? target.toLocaleString() + "+" : target + "+"; clearInterval(timer); }
      else el.textContent = Math.floor(current) + (target >= 1000 ? "+" : "");
    }, 16);
  }
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll(".counter").forEach(el => counterObserver.observe(el));

  // ============================================================
  // HERO PARTICLES
  // ============================================================
  const particlesContainer = document.getElementById("hero-particles");
  if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.cssText = `left:${Math.random()*100}%;width:${2+Math.random()*4}px;height:${2+Math.random()*4}px;animation-duration:${8+Math.random()*12}s;animation-delay:${Math.random()*10}s;opacity:${0.3+Math.random()*0.5}`;
      particlesContainer.appendChild(p);
    }
  }

  // ============================================================
  // FEE CALCULATOR
  // ============================================================
  const feeTable = {
    boys: { 4: { "non-ac": 130000, ac: 141000 }, 3: { "non-ac": 136000, ac: 153000 }, 2: { "non-ac": 147000, ac: 169000 } },
    girls: { 4: { ac: 141000 }, 3: { ac: 153000 }, 2: { ac: 169000 } }
  };
  let calcState = { gender: "boys", room: "4", ac: "non-ac" };

  function updateCalc() {
    const gender = calcState.gender;
    const room = calcState.room;
    let ac = calcState.ac;
    if (gender === "girls") ac = "ac";
    document.querySelectorAll("#calc-ac .calc-toggle").forEach(btn => {
      if (gender === "girls") { btn.disabled = btn.dataset.val !== "ac"; if (btn.dataset.val === "ac") { btn.classList.add("active"); } else { btn.classList.remove("active"); } }
      else btn.disabled = false;
    });
    const fee = feeTable[gender][room][ac] || feeTable[gender][room]["ac"];
    const amount = document.getElementById("calc-amount");
    amount.style.opacity = "0";
    setTimeout(() => {
      amount.textContent = `~ ₹${(fee).toLocaleString("en-IN")}`;
      amount.style.opacity = "1";
    }, 200);
  }

  ["calc-gender", "calc-room", "calc-ac"].forEach(groupId => {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll(".calc-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        group.querySelectorAll(".calc-toggle").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        if (groupId === "calc-gender") calcState.gender = btn.dataset.val;
        else if (groupId === "calc-room") calcState.room = btn.dataset.val;
        else if (groupId === "calc-ac") calcState.ac = btn.dataset.val;
        updateCalc();
      });
    });
  });

  // ============================================================
  // GALLERY FILTER
  // ============================================================
  document.querySelectorAll(".gallery-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".gallery-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.dataset.filter;
      document.querySelectorAll(".gallery-card-wrap").forEach(card => {
        if (filter === "all" || card.dataset.category === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // ============================================================
  // NOTIFICATION BELL + PANEL
  // ============================================================
  const notifBell = document.getElementById("notification-bell");
  const notifPanel = document.getElementById("notifications-panel");
  const closeNotif = document.getElementById("close-notifications");
  if (notifBell) notifBell.addEventListener("click", (e) => { e.stopPropagation(); notifPanel.classList.toggle("open"); });
  if (closeNotif) closeNotif.addEventListener("click", () => notifPanel.classList.remove("open"));
  document.addEventListener("click", (e) => { if (!notifPanel.contains(e.target) && !notifBell.contains(e.target)) notifPanel.classList.remove("open"); });

  // ============================================================
  // SIDEBAR TOGGLE (mobile)
  // ============================================================
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const dashSidebar = document.getElementById("dash-sidebar");
  if (sidebarToggle) sidebarToggle.addEventListener("click", () => dashSidebar.classList.toggle("open"));

  // ============================================================
  // MESS MENU DATA
  // ============================================================
  const messMenu = [
    { day: "Monday", meals: { Breakfast: "Aloo Paratha, Curd, Tea", Lunch: "Dal Makhani, Rice, Roti, Salad", Snacks: "Bread Pakora, Chutney", Dinner: "Paneer Butter Masala, Roti, Dal Tadka" } },
    { day: "Tuesday", meals: { Breakfast: "Upma, Coconut Chutney, Coffee", Lunch: "Rajma, Rice, Roti, Raita", Snacks: "Samosa, Tea", Dinner: "Chole, Puri, Kheer" } },
    { day: "Wednesday", meals: { Breakfast: "Poha, Jalebi, Tea", Lunch: "Matar Paneer, Rice, Roti, Pickle", Snacks: "Dhokla, Green Chutney", Dinner: "Mix Veg Sabzi, Roti, Dal, Rice" } },
    { day: "Thursday", meals: { Breakfast: "Idli, Sambhar, Chutney, Coffee", Lunch: "Dal Fry, Rice, Roti, Salad", Snacks: "Biscuits, Tea", Dinner: "Palak Paneer, Jeera Rice, Roti" } },
    { day: "Friday", meals: { Breakfast: "Besan Chilla, Chutney, Tea", Lunch: "Kadhi Pakora, Rice, Roti, Papad", Snacks: "Vada Pav, Chutney", Dinner: "Shahi Paneer, Roti, Dal, Salad" } },
    { day: "Saturday", meals: { Breakfast: "Puri Bhaji, Halwa, Tea", Lunch: "Chana Masala, Rice, Roti, Raita", Snacks: "Gulab Jamun, Tea", Dinner: "Veg Biryani, Raita, Papad" } },
    { day: "Sunday", meals: { Breakfast: "Chole Bhature, Lassi", Lunch: "Special Thali (Dal, 2 Sabzi, Rice, Roti, Dessert)", Snacks: "Ice Cream / Fruit", Dinner: "Paneer Tikka Masala, Garlic Roti, Khichdi" } },
  ];

  function renderMessMenu(dayIndex) {
    const content = document.getElementById("mess-day-content");
    if (!content) return;
    const menu = messMenu[dayIndex];
    content.innerHTML = `<h5 class="mb-3" style="color:#4f9cf9">${menu.day}'s Menu</h5>` +
      Object.entries(menu.meals).map(([meal, items]) =>
        `<div class="mess-meal-row"><div class="mess-meal-label"><i class="fas fa-circle-dot me-1"></i>${meal}</div><div class="mess-meal-items">${items}</div></div>`
      ).join("");
  }

  const today = new Date().getDay();
  const startDay = today === 0 ? 6 : today - 1;
  renderMessMenu(startDay);

  document.querySelectorAll(".mess-tab").forEach((tab, idx) => {
    if (idx === startDay) tab.classList.add("active");
    tab.addEventListener("click", () => {
      document.querySelectorAll(".mess-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderMessMenu(parseInt(tab.dataset.day));
    });
  });

  // ============================================================
  // MESS RATING
  // ============================================================
  const stars = document.querySelectorAll("#star-rating i");
  stars.forEach((star, idx) => {
    star.addEventListener("mouseenter", () => {
      stars.forEach((s, i) => s.classList.toggle("active", i <= idx));
    });
    star.addEventListener("mouseleave", () => {
      stars.forEach((s, i) => s.classList.toggle("active", i < selectedRating));
    });
    star.addEventListener("click", () => { selectedRating = idx + 1; });
  });
  document.getElementById("submit-rating")?.addEventListener("click", () => {
    if (!selectedRating) { showToast("Please select a star rating first!", "info"); return; }
    ratingCount++; ratingTotal += selectedRating;
    const avg = (ratingTotal / ratingCount).toFixed(1);
    document.getElementById("rating-feedback").textContent = `Thank you! Your rating of ${selectedRating}/5 has been submitted. Avg: ${avg}/5`;
    document.getElementById("stat-rating").textContent = avg;
    showToast(`Mess rated ${selectedRating}/5 ⭐`, "success");
    selectedRating = 0;
    stars.forEach(s => s.classList.remove("active"));
  });

  // ============================================================
  // COMPLAINT LOGIC
  // ============================================================
  const complaintCategories = {
    "Room Maintenance": ["Fan Not Working", "Light Not Working", "AC Not Working", "Socket Not Working", "Door/Window Lock", "Furniture Damaged"],
    "Common Area": ["Wi-Fi Not Working", "Corridor Light", "Common Washroom Issue", "RO/Water Cooler Issue", "Elevator Issue"],
    "Mess": ["Food Quality", "Food Hygiene", "Mess Cleanliness", "Menu Suggestion"],
    "Sports": ["Volleyball Court/Net", "Basketball Court", "Badminton Court", "Gym Equipment"],
    "Laundry": ["Clothes Lost", "Clothes Damaged", "Delayed Delivery"],
    "Other": ["Other Issue"],
  };

  const complaintCategory = document.getElementById("complaint-category");
  const complaintSubCategory = document.getElementById("complaint-subcategory");
  if (complaintCategory) {
    complaintCategory.addEventListener("change", () => {
      const subs = complaintCategories[complaintCategory.value] || [];
      complaintSubCategory.innerHTML = '<option value="" selected disabled>-- Select Sub-Category --</option>';
      subs.forEach(sub => { const o = document.createElement("option"); o.value = o.textContent = sub; complaintSubCategory.appendChild(o); });
    });
  }

  // Priority buttons
  document.querySelectorAll(".priority-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".priority-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("complaint-priority").value = btn.dataset.priority;
    });
  });

  // Character counter
  const descArea = document.getElementById("complaint-description");
  const descCount = document.getElementById("desc-count");
  if (descArea && descCount) {
    descArea.addEventListener("input", () => { descCount.textContent = descArea.value.length; });
  }

  // File upload zone
  const fileZone = document.getElementById("complaint-file-zone");
  const fileInput = document.getElementById("complaint-file");
  if (fileZone && fileInput) {
    fileZone.addEventListener("click", () => fileInput.click());
    fileZone.addEventListener("dragover", e => { e.preventDefault(); fileZone.style.borderColor = "#4f9cf9"; });
    fileZone.addEventListener("dragleave", () => { fileZone.style.borderColor = ""; });
    fileZone.addEventListener("drop", e => { e.preventDefault(); fileZone.style.borderColor = ""; if (e.dataTransfer.files.length) { fileZone.querySelector("p").textContent = e.dataTransfer.files[0].name; } });
    fileInput.addEventListener("change", () => { if (fileInput.files.length) fileZone.querySelector("p").textContent = fileInput.files[0].name; });
  }

  // Complaint filter
  const complaintFilter = document.getElementById("complaint-filter");
  if (complaintFilter) {
    complaintFilter.addEventListener("change", () => {
      const val = complaintFilter.value;
      document.querySelectorAll("#complaint-history-table tr").forEach(row => {
        const status = row.querySelector(".badge")?.textContent || "";
        row.style.display = (val === "all" || status === val) ? "" : "none";
      });
    });
  }

  const complaintForm = document.getElementById("complaint-form");
  if (complaintForm) {
    complaintForm.addEventListener("submit", e => {
      e.preventDefault();
      const category = complaintCategory.options[complaintCategory.selectedIndex]?.text || "";
      const subcategory = complaintSubCategory.options[complaintSubCategory.selectedIndex]?.text || "";
      const description = document.getElementById("complaint-description").value;
      const priority = document.getElementById("complaint-priority").value;
      const ticketId = `#C${Math.floor(1000 + Math.random() * 9000)}`;
      const date = new Date().toISOString().split("T")[0];
      const priorityColors = { low: "success", medium: "warning", high: "danger", urgent: "danger" };
      const pColor = priorityColors[priority] || "secondary";

      const bRow = document.getElementById("bento-complaints-table").insertRow(0);
      bRow.innerHTML = `<td>${ticketId}</td><td>${category}</td><td><span class="badge bg-warning">Pending</span></td>`;

      const hRow = document.getElementById("complaint-history-table").insertRow(0);
      hRow.innerHTML = `<td>${ticketId}</td><td>${date}</td><td>${category} / ${subcategory}</td><td><span class="badge bg-${pColor}">${priority.charAt(0).toUpperCase()+priority.slice(1)}</span></td><td>${description}</td><td><span class="badge bg-warning">Pending</span></td>`;

      const statEl = document.getElementById("stat-complaints");
      if (statEl) statEl.textContent = parseInt(statEl.textContent) + 1;

      complaintForm.reset();
      complaintSubCategory.innerHTML = '<option value="" selected disabled>-- Select Category First --</option>';
      document.getElementById("complaint-hostel").value = currentUser.hostel;
      document.getElementById("complaint-priority").value = "low";
      document.querySelectorAll(".priority-btn").forEach((b,i) => b.classList.toggle("active", i===0));
      if (descCount) descCount.textContent = "0";
      switchDashboardView("view-complaint-history");
      showToast("Complaint submitted successfully! Ticket: " + ticketId, "success");
    });
  }

  // ============================================================
  // LEAVE LOGIC
  // ============================================================
  const leaveFrom = document.getElementById("leave-from-date");
  const leaveTo = document.getElementById("leave-to-date");
  const leaveDays = document.getElementById("leave-days");

  function calcDays() {
    if (leaveFrom?.value && leaveTo?.value) {
      const d1 = new Date(leaveFrom.value), d2 = new Date(leaveTo.value);
      if (d2 < d1) { leaveDays.value = "Invalid dates"; return; }
      const diff = Math.ceil(Math.abs(d2 - d1) / (1000*60*60*24)) + 1;
      leaveDays.value = `${diff} Day(s)`;
    }
  }
  leaveFrom?.addEventListener("change", calcDays);
  leaveTo?.addEventListener("change", calcDays);

  const leaveForm = document.getElementById("leave-form");
  if (leaveForm) {
    leaveForm.addEventListener("submit", e => {
      e.preventDefault();
      const leaveId = `#L${Math.floor(1000 + Math.random() * 9000)}`;
      const from = leaveFrom.value, to = leaveTo.value, days = leaveDays.value;
      const reason = document.getElementById("leave-subject").value;
      const hRow = document.getElementById("leave-history-table").insertRow(0);
      hRow.innerHTML = `<td>${leaveId}</td><td>${from}</td><td>${to}</td><td>${days.split(" ")[0]}</td><td>${reason}</td><td><span class="badge bg-warning">Pending</span></td>`;
      const statEl = document.getElementById("stat-leaves");
      if (statEl) statEl.textContent = parseInt(statEl.textContent) + 1;
      leaveForm.reset();
      if (leaveDays) leaveDays.value = "";
      switchDashboardView("view-leave-history");
      showToast("Leave application submitted! ID: " + leaveId, "success");
    });
  }

  // ============================================================
  // PASSWORD TOGGLE
  // ============================================================
  document.getElementById("toggle-login-pass")?.addEventListener("click", function() {
    const inp = document.getElementById("login-pass");
    inp.type = inp.type === "password" ? "text" : "password";
    this.querySelector("i").className = inp.type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
  });

  // ============================================================
  // PROFILE SAVE
  // ============================================================
  document.getElementById("save-profile-btn")?.addEventListener("click", () => {
    const name = document.getElementById("profile-name-input").value;
    if (name) {
      currentUser.name = name;
      document.getElementById("bento-name").textContent = name;
      document.getElementById("dash-profile-name").textContent = name;
      document.getElementById("dash-welcome-msg").textContent = `Welcome, ${name}!`;
    }
    showToast("Profile saved successfully!", "success");
  });

  // ============================================================
  // DASHBOARD NAVIGATION
  // ============================================================
  function switchDashboardView(viewId) {
    dashboardViews.forEach(v => v.classList.remove("active"));
    sidebarLinks.forEach(l => l.classList.remove("active"));
    const target = document.getElementById(viewId);
    if (target) target.classList.add("active");
    document.querySelectorAll(`.sidebar-link[data-view="${viewId}"]`).forEach(l => l.classList.add("active"));
    // Animate bar chart when analytics view opens
    if (viewId === "view-analytics") {
      setTimeout(() => {
        document.querySelectorAll(".bar-fill").forEach(bar => { const w = bar.style.width; bar.style.width = "0"; setTimeout(() => bar.style.width = w, 100); });
      }, 100);
    }
  }

  sidebarLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const viewId = link.getAttribute("data-view");
      if (viewId) { switchDashboardView(viewId); if (window.innerWidth < 768) dashSidebar?.classList.remove("open"); }
    });
  });

  // ============================================================
  // AUTH
  // ============================================================
  function showView(viewName, userInfo = null) {
    if (viewName === "dashboard") {
      if (userInfo) currentUser = { ...currentUser, ...userInfo };
      mainNavbar.style.display = "none";
      dashNavbar.style.display = "flex";
      document.getElementById("dash-welcome-msg").innerText = `Welcome, ${currentUser.name}`;
      document.getElementById("dash-profile-name").innerText = currentUser.name;
      document.getElementById("dash-profile-details").innerText = `${currentUser.id} | ${currentUser.hostel}`;
      document.getElementById("bento-name").innerText = currentUser.name;
      document.getElementById("bento-id").innerText = currentUser.id;
      document.getElementById("bento-hostel").innerText = currentUser.hostel;
      document.getElementById("bento-room").innerText = currentUser.room;
      if (document.getElementById("complaint-hostel")) document.getElementById("complaint-hostel").value = currentUser.hostel;
      if (document.getElementById("profile-name-input")) document.getElementById("profile-name-input").value = currentUser.name;
      if (document.getElementById("profile-id-input")) document.getElementById("profile-id-input").value = currentUser.id;
      if (document.getElementById("profile-hostel-input")) document.getElementById("profile-hostel-input").value = currentUser.hostel;
      publicView.style.display = "none";
      dashboardView.style.display = "block";
      switchDashboardView("view-home");
      showToast(`Welcome back, ${currentUser.name}! 👋`, "success");
    } else {
      mainNavbar.style.display = "flex";
      dashNavbar.style.display = "none";
      publicView.style.display = "block";
      dashboardView.style.display = "none";
    }
  }

  loginForm?.addEventListener("submit", e => {
    e.preventDefault();
    const id = document.getElementById("login-id").value;
    bootstrap.Modal.getInstance(document.getElementById("loginModal"))?.hide();
    showView("dashboard", { id, name: `Student (${id.slice(-4)})`, hostel: "Vivekanand Bhawan" });
  });

  signupForm?.addEventListener("submit", e => {
    e.preventDefault();
    const userInfo = { name: document.getElementById("signup-name").value, id: document.getElementById("signup-id").value, hostel: document.getElementById("signup-hostel").value };
    bootstrap.Modal.getInstance(document.getElementById("signupModal"))?.hide();
    showView("dashboard", userInfo);
  });

  logoutBtn?.addEventListener("click", () => { showView("public"); showToast("Logged out successfully.", "info"); });

  // ============================================================
  // SCROLL REVEAL
  // ============================================================
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    const nav = document.getElementById("main-navbar");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
  });

  // Mobile nav close
  const mainNav = document.getElementById("main-navbar");
  if (mainNav) {
    const navLinks = mainNav.querySelectorAll(".nav-link");
    const collapseEl = mainNav.querySelector(".navbar-collapse");
    if (collapseEl) {
      const collapse = new bootstrap.Collapse(collapseEl, { toggle: false });
      navLinks.forEach(link => { link.addEventListener("click", () => { if (window.innerWidth < 992) collapse.hide(); }); });
    }
  }

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================
  function showToast(message, type = "success") {
    const container = document.getElementById("notification-container") || document.body;
    const toast = document.createElement("div");
    const icons = { success: "fa-check-circle", error: "fa-times-circle", info: "fa-info-circle" };
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.success}" style="color:${type==="success"?"#19c864":type==="error"?"#dc3545":"#4f9cf9"}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3400);
  }

  // Expose globally
  window.showToast = showToast;

  // ============================================================
  // Close FAB menu on outside click
  // ============================================================
  document.addEventListener("click", e => {
    const fabGroup = document.getElementById("fab-group");
    if (!fabGroup?.contains(e.target)) { fabMain.classList.remove("open"); fabMenu.classList.remove("open"); }
  });
});
