// Guía de Git y GitHub con IA: el contenido se construye manipulando el DOM

const PASOS = [
  { id: "cuenta", titulo: "Crea tu cuenta de GitHub", texto: "Entra a github.com, pulsa Sign up y confirma tu correo. Anota tu nombre de usuario." },
  { id: "carpeta", titulo: "Crea el proyecto en el escritorio", texto: "Haz una carpeta con tus archivos (index.html, style.css, script.js). Abre la terminal dentro de ella.", cmds: ["cd Desktop", "mkdir mi-proyecto", "cd mi-proyecto"] },
  { id: "config", titulo: "Presenta tu identidad a Git", texto: "Solo se hace una vez por computadora. Git usa estos datos en cada commit.", cmds: ['git config --global user.name "Tu Nombre"', 'git config --global user.email "tu-correo@ejemplo.com"'] },
  { id: "init", titulo: "Inicializa Git", texto: "Esto crea el repositorio local oculto (.git) dentro de tu carpeta.", cmds: ["git init"] },
  { id: "commits", titulo: "Haz 3 commits con descripción", texto: "Agrega archivos de a poco y guarda cada avance con un mensaje claro. Toma captura de cada uno.", cmds: ["git add index.html", 'git commit -m "Agrega estructura HTML"', "git add style.css", 'git commit -m "Agrega estilos"', "git add script.js", 'git commit -m "Agrega logica del DOM"', "git log --oneline"] },
  { id: "repo", titulo: "Crea un repositorio público en GitHub", texto: "Pulsa New repository, ponle nombre, elige Public y no marques ningún archivo inicial. Luego pulsa Create repository." },
  { id: "push", titulo: "Conecta y sube el proyecto (push)", texto: "Cambia TU-USUARIO y el nombre del repositorio. Después recarga la página de GitHub y toma una captura del contenido.", cmds: ["git branch -M main", "git remote add origin https://github.com/TU-USUARIO/mi-proyecto.git", "git push -u origin main"] }
];

const COMANDOS = [
  { cat: "Empezar", cmd: "git init", desc: "Crea un repositorio nuevo en la carpeta actual." },
  { cat: "Empezar", cmd: "git clone URL", desc: "Descarga una copia de un repositorio de GitHub." },
  { cat: "Empezar", cmd: 'git config --global user.name "Nombre"', desc: "Define el nombre que aparecerá en tus commits." },
  { cat: "Guardar", cmd: "git status", desc: "Muestra qué archivos cambiaron y cuáles están listos para commit." },
  { cat: "Guardar", cmd: "git add archivo", desc: "Prepara un archivo para el siguiente commit." },
  { cat: "Guardar", cmd: "git add .", desc: "Prepara todos los cambios de la carpeta." },
  { cat: "Guardar", cmd: 'git commit -m "mensaje"', desc: "Guarda una foto del proyecto con una descripción." },
  { cat: "Historial", cmd: "git log --oneline", desc: "Lista los commits en una línea cada uno." },
  { cat: "Historial", cmd: "git diff", desc: "Muestra las líneas que cambiaste y aún no preparaste." },
  { cat: "Historial", cmd: "git restore archivo", desc: "Descarta los cambios no guardados de un archivo." },
  { cat: "GitHub", cmd: "git remote add origin URL", desc: "Conecta tu carpeta con un repositorio de GitHub." },
  { cat: "GitHub", cmd: "git push -u origin main", desc: "Sube tus commits a GitHub. El -u recuerda el destino." },
  { cat: "GitHub", cmd: "git pull", desc: "Trae a tu computadora los cambios nuevos de GitHub." },
  { cat: "Ramas", cmd: "git branch", desc: "Lista tus ramas y marca en cuál estás." },
  { cat: "Ramas", cmd: "git switch -c nueva-rama", desc: "Crea una rama y cambia a ella para probar ideas sin riesgo." },
  { cat: "Ramas", cmd: "git merge nueva-rama", desc: "Une los cambios de otra rama con la rama actual." }
];

const PROMPTS = [
  { titulo: "Entender un concepto", texto: "Explícame qué es un commit en Git como si nunca hubiera programado. Usa una analogía y un ejemplo corto." },
  { titulo: "Entender un error", texto: "Ejecuté git push y me salió este error: [pega aquí el error completo]. Explícame qué significa y dame los pasos para solucionarlo." },
  { titulo: "Mejorar tus mensajes", texto: "Estos son mis mensajes de commit: [pégalos]. Dime si son claros y proponme versiones mejores en español, en menos de 60 caracteres." },
  { titulo: "Revisar antes de subir", texto: "Voy a ejecutar estos comandos para subir mi proyecto a GitHub: [pégalos]. Dime si el orden es correcto y qué podría salir mal." }
];

const FAQ = [
  { p: "Me sale: fatal: not a git repository", r: "Estás en una carpeta donde no hiciste git init, o abriste la terminal en otra ruta. Entra a la carpeta del proyecto con cd y ejecuta:", cmd: "git init" },
  { p: "Me sale: nothing to commit", r: "No hay cambios preparados. Revisa qué cambió con git status y agrega el archivo con git add antes de hacer el commit.", cmd: "git status" },
  { p: "Me sale: remote origin already exists", r: "Ya conectaste un destino antes. Cámbialo por la URL correcta con este comando:", cmd: "git remote set-url origin https://github.com/TU-USUARIO/mi-proyecto.git" },
  { p: "Me pide usuario y contraseña al hacer push", r: "GitHub ya no acepta la contraseña de tu cuenta en la terminal. Inicia sesión desde la ventana del navegador que se abre, o crea un Personal Access Token en Settings > Developer settings y úsalo como contraseña." },
  { p: "Me sale: failed to push some refs", r: "El repositorio de GitHub tiene archivos que tú no tienes, por ejemplo un README creado al hacer el repositorio. Trae esos cambios y vuelve a subir:", cmd: "git pull origin main --allow-unrelated-histories" }
];

const $ = id => document.getElementById(id);
const hechos = new Set();
try { JSON.parse(localStorage.getItem("pasos-hechos") || "[]").forEach(i => hechos.add(i)); } catch {}

function aviso(msg) {
  const el = $("aviso");
  el.textContent = msg;
  el.classList.add("visible");
  clearTimeout(aviso.t);
  aviso.t = setTimeout(() => el.classList.remove("visible"), 1600);
}

// Bloque de código con botón de copiar
function bloqueCodigo(texto) {
  const caja = document.createElement("div");
  caja.className = "codigo";
  const code = document.createElement("code");
  code.textContent = texto;
  const btn = document.createElement("button");
  btn.className = "copiar";
  btn.textContent = "Copiar";
  btn.setAttribute("aria-label", "Copiar al portapapeles");
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const t = document.createElement("textarea");
      t.value = texto; document.body.appendChild(t); t.select();
      document.execCommand("copy"); t.remove();
    }
    btn.textContent = "Copiado";
    btn.classList.add("listo");
    aviso("Copiado al portapapeles");
    setTimeout(() => { btn.textContent = "Copiar"; btn.classList.remove("listo"); }, 1500);
  });
  caja.append(code, btn);
  return caja;
}

// Pasos con checklist
function actualizarAvance() {
  const total = PASOS.length;
  $("relleno").style.width = (hechos.size / total) * 100 + "%";
  $("avance-texto").textContent = hechos.size === total
    ? "Listo, completaste los " + total + " pasos"
    : `${hechos.size} de ${total} pasos completados`;
  try { localStorage.setItem("pasos-hechos", JSON.stringify([...hechos])); } catch {}
}

function renderPasos() {
  const ol = $("pasos-lista");
  PASOS.forEach(p => {
    const li = document.createElement("li");
    li.className = "paso" + (hechos.has(p.id) ? " hecho" : "");

    const label = document.createElement("label");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = hechos.has(p.id);
    const div = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.textContent = p.titulo;
    const par = document.createElement("p");
    par.textContent = p.texto;
    div.append(h3, par);
    label.append(check, div);
    li.appendChild(label);

    if (p.cmds) {
      const bloques = document.createElement("div");
      bloques.className = "bloques";
      p.cmds.forEach(c => bloques.appendChild(bloqueCodigo(c)));
      li.appendChild(bloques);
    }

    check.addEventListener("change", () => {
      check.checked ? hechos.add(p.id) : hechos.delete(p.id);
      li.classList.toggle("hecho", check.checked);
      actualizarAvance();
    });
    ol.appendChild(li);
  });
  actualizarAvance();
}

// Comandos con búsqueda y filtro por categoría
let categoria = "Todos";
function renderComandos() {
  const q = $("buscar").value.trim().toLowerCase();
  const cont = $("comandos-lista");
  cont.replaceChildren();
  const res = COMANDOS.filter(c =>
    (categoria === "Todos" || c.cat === categoria) &&
    (c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)));

  if (!res.length) {
    const p = document.createElement("p");
    p.className = "vacio";
    p.textContent = "No encontramos ese comando. Prueba con otra palabra o cambia la categoría.";
    cont.appendChild(p);
    return;
  }
  res.forEach(c => {
    const d = document.createElement("div");
    d.className = "comando";
    const desc = document.createElement("p");
    desc.textContent = c.desc;
    d.append(bloqueCodigo(c.cmd), desc);
    cont.appendChild(d);
  });
}

function renderCategorias() {
  const cont = $("categorias");
  ["Todos", ...new Set(COMANDOS.map(c => c.cat))].forEach(nombre => {
    const b = document.createElement("button");
    b.textContent = nombre;
    if (nombre === categoria) b.classList.add("activo");
    b.addEventListener("click", () => {
      categoria = nombre;
      cont.querySelectorAll("button").forEach(x => x.classList.toggle("activo", x === b));
      renderComandos();
    });
    cont.appendChild(b);
  });
}

function renderPrompts() {
  PROMPTS.forEach(p => {
    const d = document.createElement("article");
    d.className = "prompt";
    const h3 = document.createElement("h3");
    h3.textContent = p.titulo;
    d.append(h3, bloqueCodigo(p.texto));
    $("prompts").appendChild(d);
  });
}

function renderFaq() {
  FAQ.forEach(f => {
    const item = document.createElement("div");
    item.className = "faq-item";
    const btn = document.createElement("button");
    btn.textContent = f.p;
    btn.setAttribute("aria-expanded", "false");
    const cuerpo = document.createElement("div");
    cuerpo.className = "faq-cuerpo";
    const par = document.createElement("p");
    par.textContent = f.r;
    cuerpo.appendChild(par);
    if (f.cmd) cuerpo.appendChild(bloqueCodigo(f.cmd));
    btn.addEventListener("click", () => {
      const abierto = item.classList.toggle("abierto");
      btn.setAttribute("aria-expanded", abierto);
    });
    item.append(btn, cuerpo);
    $("faq-lista").appendChild(item);
  });
}

// Resalta en el menú la sección visible
function observarSecciones() {
  const enlaces = document.querySelectorAll(".top nav a");
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (e.isIntersecting) {
        enlaces.forEach(a => a.classList.toggle("actual", a.getAttribute("href") === "#" + e.target.id));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section").forEach(s => obs.observe(s));
}

$("buscar").addEventListener("input", renderComandos);
renderPasos();
renderCategorias();
renderComandos();
renderPrompts();
renderFaq();
observarSecciones();
