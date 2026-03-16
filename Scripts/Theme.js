const toggle = document.getElementById("themeToggle");
const dropdown = document.getElementById("themeDropdown");

const accentPicker = document.getElementById("accentPicker");
const bgPicker = document.getElementById("bgPicker");

const lightBtn = document.getElementById("lightMode");
const darkBtn = document.getElementById("darkMode");

toggle.onclick = () => {
  dropdown.style.display =
    dropdown.style.display === "flex" ? "none" : "flex";
};

function hexToRgb(hex){
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return {r,g,b};
}

function darkenColor(hex, percent){
  const {r,g,b} = hexToRgb(hex);
  const f = (c)=>Math.floor(c*(1-percent));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

function applyAccent(color){

  const {r,g,b} = hexToRgb(color);

  document.documentElement.style.setProperty("--accent1",color);
  document.documentElement.style.setProperty("--accent2",darkenColor(color,0.2));
  document.documentElement.style.setProperty("--accentGlow",`rgba(${r}, ${g}, ${b}, 0.6)`);

  localStorage.setItem("theme-accent",color);
}

function applyBackground(color){

  const root = document.documentElement;
  root.style.setProperty("--bg",color);

  const {r,g,b} = hexToRgb(color);
  const brightness = (r*299 + g*587 + b*114) / 1000;

  const darker = darkenColor(color, 0.15);
  const darkest = darkenColor(color, 0.17);
  const hover = darkenColor(color, 0.08);

  root.style.setProperty("--taskbar-bg", darker);
  root.style.setProperty("--taskbar-buttons", darkest);
  root.style.setProperty("--taskbar-hover", hover);

  if(brightness > 150){
    root.style.setProperty("--text","#000000");
    root.style.setProperty("--card","rgba(255,255,255,0.85)");
  } else {
    root.style.setProperty("--text","#ffffff");
    root.style.setProperty("--card","rgba(255,255,255,0.05)");
  }

  localStorage.setItem("theme-bg",color);
}

accentPicker.addEventListener("input",(e)=>{
  applyAccent(e.target.value);
});

bgPicker.addEventListener("input",(e)=>{
  applyBackground(e.target.value);
});

lightBtn.onclick = ()=>{

  document.documentElement.classList.add("light");

  localStorage.removeItem("theme-accent");
  localStorage.removeItem("theme-bg");
  localStorage.setItem("theme-mode","light");

  location.reload();
};

darkBtn.onclick = ()=>{

  document.documentElement.classList.remove("light");

  localStorage.removeItem("theme-accent");
  localStorage.removeItem("theme-bg");
  localStorage.setItem("theme-mode","dark");

  location.reload();
};

function loadTheme(){

  const savedAccent = localStorage.getItem("theme-accent");
  const savedBg = localStorage.getItem("theme-bg");
  const savedMode = localStorage.getItem("theme-mode");

  if(savedMode==="light"){
    document.documentElement.classList.add("light");
  }

  if(savedAccent){
    applyAccent(savedAccent);
    accentPicker.value = savedAccent;
  } else {
    accentPicker.value = savedMode==="light" ? "#4169e1" : "#6366f1";
  }

  if(savedBg){
    applyBackground(savedBg);
    bgPicker.value = savedBg;
  } else {
    bgPicker.value = savedMode==="light" ? "#f5f7ff" : "#12121d";
  }
}

loadTheme();

document.addEventListener("click",(e)=>{
  if(!e.target.closest(".theme-control")){
    dropdown.style.display="none";
  }
});