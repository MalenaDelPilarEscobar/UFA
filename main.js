/* ============================================================
   UFA — script general del sitio
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Menú hamburguesa ---------- */
  const menuBtn = document.getElementById("menu-btn");
  const megaMenu = document.getElementById("mega-menu");
  if (menuBtn && megaMenu) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      megaMenu.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!megaMenu.contains(e.target) && e.target !== menuBtn) {
        megaMenu.classList.remove("open");
      }
    });
  }

  /* ---------- Carrusel del hero (home) ---------- */
  const slides = document.querySelectorAll(".hero-slide");
  if (slides.length) {
    let current = 0;
    const dots = document.querySelectorAll(".hero-dots span");
    const show = (i) => {
      slides.forEach((s, idx) => s.style.display = idx === i ? "block" : "none");
      dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
      current = i;
    };
    document.querySelector(".hero-arrow.next")?.addEventListener("click", () => {
      show((current + 1) % slides.length);
    });
    document.querySelector(".hero-arrow.prev")?.addEventListener("click", () => {
      show((current - 1 + slides.length) % slides.length);
    });
    dots.forEach((d, idx) => d.addEventListener("click", () => show(idx)));
    setInterval(() => show((current + 1) % slides.length), 6000);
    show(0);
  }

  /* ============================================================
     Proceso 2.0 "Anotarse a carrera" — actualiza el panel de
     información según la carrera elegida (simula "Guarda" /
     "datos_incorrectos" del DFD)
     ============================================================ */
  const carreraInfo = {
    "": { titulo: "A definir", duracion: "A definir", modalidad: "A definir" },
    "abogacia": { titulo: "Abogado/a", duracion: "5 años", modalidad: "Presencial" },
    "medicina": { titulo: "Médico/a", duracion: "6 años", modalidad: "Presencial" },
    "sistemas": { titulo: "Ingeniero/a en Sistemas", duracion: "5 años", modalidad: "Mixta" },
    "audiovisual": { titulo: "Lic. en Cine y Audiovisual", duracion: "4 años", modalidad: "Presencial" },
  };
  const selCarreraInscripcion = document.getElementById("sel-carrera-inscripcion");
  if (selCarreraInscripcion) {
    const out = {
      titulo: document.getElementById("info-titulo"),
      duracion: document.getElementById("info-duracion"),
      modalidad: document.getElementById("info-modalidad"),
    };
    selCarreraInscripcion.addEventListener("change", () => {
      const d = carreraInfo[selCarreraInscripcion.value] || carreraInfo[""];
      if (out.titulo) out.titulo.textContent = "Título que otorga: " + d.titulo;
      if (out.duracion) out.duracion.textContent = "Duración: " + d.duracion;
      if (out.modalidad) out.modalidad.textContent = "Modalidad: " + d.modalidad;
    });
  }
  const formCarrera = document.getElementById("form-anotarse-carrera");
  if (formCarrera) {
    formCarrera.addEventListener("submit", (e) => {
      e.preventDefault();
      const modalidad = document.getElementById("sel-modalidad").value;
      const carrera = document.getElementById("sel-carrera-inscripcion").value;
      const turno = document.getElementById("sel-turno").value;
      const msg = document.getElementById("carrera-msg");
      if (!modalidad || !carrera || !turno) {
        msg.className = "status-msg err";
        msg.textContent = "datos_incorrectos: complete modalidad, carrera y turno antes de continuar.";
      } else {
        msg.className = "status-msg ok";
        msg.textContent = "Datos guardados en BD_alumnos y BD_carreras. ¡Inscripción iniciada!";
      }
    });
  }

  /* ============================================================
     Proceso 3.0 "Gestión académica" — Anotarse a materia y cátedra
     ============================================================ */
  const catedraRows = document.querySelectorAll(".catedra-table tbody tr");
  const confirmCatedra = document.getElementById("confirm-catedra");
  const confirmHorario = document.getElementById("confirm-horario");
  catedraRows.forEach(row => {
    row.addEventListener("click", () => {
      catedraRows.forEach(r => r.classList.remove("selected"));
      row.classList.add("selected");
      const radio = row.querySelector(".radio-dot");
      if (radio) radio.setAttribute("aria-checked", "true");
      if (confirmCatedra) confirmCatedra.textContent = "Cátedra: " + row.dataset.catedra;
      if (confirmHorario) confirmHorario.textContent = "Horario: " + row.dataset.horario;
    });
  });
  const formMateria = document.getElementById("form-anotarse-materia");
  if (formMateria) {
    formMateria.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("materia-msg");
      const materia = document.getElementById("sel-materia").value;
      const catedraSel = document.querySelector(".catedra-table tr.selected");
      if (!materia || !catedraSel) {
        msg.className = "status-msg err";
        msg.textContent = "Seleccione materia y cátedra para continuar.";
      } else {
        msg.className = "status-msg ok";
        msg.textContent = "catedra_curso / id_materia enviados a Gestión académica. ¡Inscripción confirmada!";
      }
    });
  }
  const selCarreraMateria = document.getElementById("sel-carrera-materia");
  const selMateria = document.getElementById("sel-materia");
  const materiasPorCarrera = {
    "": ["Selecciona una materia"],
    "abogacia": ["Derecho Civil I", "Derecho Penal I", "Introducción al Derecho"],
    "medicina": ["Anatomía I", "Bioquímica", "Fisiología"],
    "sistemas": ["Algoritmos y Estructuras de Datos", "Bases de Datos", "Redes"],
    "audiovisual": ["Guion I", "Producción Audiovisual", "Historia del Cine"],
  };
  if (selCarreraMateria && selMateria) {
    selCarreraMateria.addEventListener("change", () => {
      const opts = materiasPorCarrera[selCarreraMateria.value] || materiasPorCarrera[""];
      selMateria.innerHTML = "";
      opts.forEach((m, i) => {
        const o = document.createElement("option");
        o.value = i === 0 && selCarreraMateria.value === "" ? "" : m;
        o.textContent = m;
        selMateria.appendChild(o);
      });
    });
  }

  /* ============================================================
     Proceso 1.0 "Gestión de acceso" — login
     ============================================================ */
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("usuario_alumno").value.trim();
      const pass = document.getElementById("password_alumno").value.trim();
      const msg = document.getElementById("login-msg");
      /* Simulación de "Consulta de credenciales" contra BD_usuarios */
      if (user === "alumno" && pass === "ufa2026") {
        msg.className = "status-msg ok";
        msg.textContent = "datos_correctos: acceso concedido. Bienvenido/a al portal del alumno.";
      } else {
        msg.className = "status-msg err";
        msg.textContent = "datos_incorrectos: usuario o contraseña inválidos. (Prueba: alumno / ufa2026)";
      }
    });
  }

});
