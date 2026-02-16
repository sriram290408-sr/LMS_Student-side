document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("coursesGrid");
  const search = document.getElementById("searchInput");

  const openAddBtn = document.getElementById("openAddCourse");
  const courseModal = document.getElementById("courseModal");
  const studentModal = document.getElementById("studentModal");

  const closeCourse = document.getElementById("closeCourse");
  const closeStudent = document.getElementById("closeStudent");

  const addForm = document.getElementById("addForm");
  const studentForm = document.getElementById("studentForm");

  const addFull = document.getElementById("addFull");
  const addShort = document.getElementById("addShort");
  const addCategory = document.getElementById("addCategory");
  const addVisibility = document.getElementById("addVisibility");
  const addStart = document.getElementById("addStart");
  const addEnd = document.getElementById("addEnd");
  const addId = document.getElementById("addId");
  const addSummary = document.getElementById("addSummary");

  const studentBatch = document.getElementById("studentBatch");

  let courses = JSON.parse(localStorage.getItem("admin_courses")) || [];
  let editingIndex = null;
  let activeStudentIndex = null;

  render();

  openAddBtn.onclick = () => openCourse();
  closeCourse.onclick = () => (courseModal.style.display = "none");
  closeStudent.onclick = () => (studentModal.style.display = "none");

  function openCourse(i = null) {
    editingIndex = i;
    addForm.reset();

    courseModal.querySelector("h2").innerText =
      i === null ? "Add Course" : "Edit Course";

    if (i !== null) {
      const c = courses[i];
      addFull.value = c.full;
      addShort.value = c.short;
      addCategory.value = c.category;
      addVisibility.value = c.hidden ? "Hide" : "Show";
      addStart.value = c.start;
      addEnd.value = c.end;
      addId.value = c.id;
      addSummary.value = c.summary;
    }

    courseModal.style.display = "grid";
  }

  addForm.onsubmit = (e) => {
    e.preventDefault();

    const course = {
      full: addFull.value,
      short: addShort.value,
      category: addCategory.value,
      start: addStart.value,
      end: addEnd.value,
      id: addId.value,
      summary: addSummary.value,
      hidden: addVisibility.value === "Hide",
      batches:
        editingIndex !== null ? courses[editingIndex].batches : [],
    };

    if (editingIndex !== null) courses[editingIndex] = course;
    else courses.push(course);

    localStorage.setItem("admin_courses", JSON.stringify(courses));

    render();
    courseModal.style.display = "none";
  };

  function render() {
    grid.innerHTML = "";

    courses.forEach((c, i) => {
      const card = document.createElement("div");
      card.className = "course-card";
      if (c.hidden) card.classList.add("hidden");

      const batchBadges =
        c.batches && c.batches.length
          ? c.batches
              .map(
                (b) =>
                  `<span class="badge" style="background:#10b981;">Batch ${b}</span>`
              )
              .join(" ")
          : "None";

      card.innerHTML = `
        <div class="course-header">
          <h3>${c.full}</h3>
          <span class="badge">${c.category}</span>
        </div>

        <p>${c.summary || ""}</p>

        <div class="meta">
          <span>ID: ${c.id}</span>
          <span>${batchBadges}</span>
        </div>

        <div class="course-actions">
          <label class="switch">
            <input type="checkbox" ${!c.hidden ? "checked" : ""}>
            <span class="slider"></span>
          </label>

          <button class="btn-enroll">Add Batch</button>
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      `;

      // CARD CLICK → course-name.html
      card.onclick = () => {
        const slug = c.full
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");

        window.location.href = `course-${slug}.html`;
      };

      // TOGGLE VISIBILITY
      card.querySelector("input").onchange = (e) => {
        e.stopPropagation();
        c.hidden = !e.target.checked;
        localStorage.setItem("admin_courses", JSON.stringify(courses));
        render();
      };

      // DELETE
      card.querySelector(".delete").onclick = (e) => {
        e.stopPropagation();
        if (confirm("Delete this course?")) {
          courses.splice(i, 1);
          localStorage.setItem("admin_courses", JSON.stringify(courses));
          render();
        }
      };

      // EDIT
      card.querySelector(".edit").onclick = (e) => {
        e.stopPropagation();
        openCourse(i);
      };

      // ADD BATCH
      card.querySelector(".btn-enroll").onclick = (e) => {
        e.stopPropagation();
        activeStudentIndex = i;
        studentForm.reset();
        studentModal.style.display = "grid";
      };

      grid.appendChild(card);
    });
  }

  search.oninput = () => {
    const q = search.value.toLowerCase();
    document.querySelectorAll(".course-card").forEach((card) => {
      card.style.display = card.innerText.toLowerCase().includes(q)
        ? "flex"
        : "none";
    });
  };

  studentForm.onsubmit = (e) => {
    e.preventDefault();

    const idx = activeStudentIndex;

    if (!courses[idx].batches) courses[idx].batches = [];

    if (!courses[idx].batches.includes(studentBatch.value)) {
      courses[idx].batches.push(studentBatch.value);
    }

    localStorage.setItem("admin_courses", JSON.stringify(courses));

    render();
    studentModal.style.display = "none";
  };
});
