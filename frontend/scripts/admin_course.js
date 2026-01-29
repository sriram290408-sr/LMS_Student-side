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

  const studentCourse = document.getElementById("studentCourse");

  let courses = JSON.parse(localStorage.getItem("admin_courses")) || [];
  let editingIndex = null;

  function save() {
    localStorage.setItem("admin_courses", JSON.stringify(courses));
  }

  render();

  /* OPEN ADD */

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
      addVisibility.value = c.visibility;
      addStart.value = c.start;
      addEnd.value = c.end;
      addId.value = c.id;
      addSummary.value = c.summary;
    }

    courseModal.style.display = "grid";
  }

  /* ADD / EDIT */

  addForm.onsubmit = (e) => {
    e.preventDefault();

    const course = {
      full: addFull.value,
      short: addShort.value,
      category: addCategory.value,
      visibility: addVisibility.value,
      start: addStart.value,
      end: addEnd.value,
      id: addId.value,
      summary: addSummary.value,
      hidden: addVisibility.value === "Hide",
      students: editingIndex !== null ? courses[editingIndex].students : [],
    };

    if (editingIndex !== null) {
      courses[editingIndex] = course;
    } else {
      courses.push(course);
    }

    save();
    render();

    courseModal.style.display = "none";
  };

  /* RENDER */

  function render() {
    grid.innerHTML = "";

    courses.forEach((c, i) => {
      const card = document.createElement("div");
      card.className = "course-card";
      if (c.hidden) card.classList.add("hidden");

      card.innerHTML = `
        <div class="course-header">
          <h3>${c.full}</h3>
          <span class="badge">${c.category}</span>
        </div>

        <p>${c.summary || ""}</p>

        <div class="meta">
          <span>${c.id}</span>
          <span>${c.students.length} students</span>
        </div>

        <div class="course-actions">

          <label class="switch">
            <input type="checkbox" ${!c.hidden ? "checked" : ""}>
            <span class="slider"></span>
          </label>

          <button class="btn-enroll">Add Student</button>
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>

        </div>
      `;

      /* hide */

      card.querySelector("input").onchange = (e) => {
        c.hidden = !e.target.checked;
        save();
        render();
      };

      card.querySelector(".delete").onclick = () => {
        courses.splice(i, 1);
        save();
        render();
      };

      card.querySelector(".edit").onclick = () => openCourse(i);

      card.querySelector(".btn-enroll").onclick = () => openStudent(i);

      grid.appendChild(card);
    });
  }

  /* SEARCH */

  search.oninput = () => {
    const q = search.value.toLowerCase();

    document.querySelectorAll(".course-card").forEach((card) => {
      card.style.display = card.innerText.toLowerCase().includes(q)
        ? "flex"
        : "none";
    });
  };

  /* STUDENT */

  function openStudent(i) {
    studentForm.reset();
    studentCourse.innerHTML = "";

    courses.forEach((c, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = c.full;

      if (idx === i) opt.selected = true;

      studentCourse.appendChild(opt);
    });

    studentModal.style.display = "grid";
  }

  studentForm.onsubmit = (e) => {
    e.preventDefault();

    const idx = studentCourse.value;

    courses[idx].students.push({
      name: studentName.value,
      email: studentEmail.value,
      id: studentId.value,
    });

    save();
    render();

    studentModal.style.display = "none";
  };
});
