(function() {
  const set=(d)=>document.documentElement.classList.toggle('dark',d);
  const get=()=>localStorage.theme==='dark'
    ||(!('theme'in localStorage)&&window.matchMedia('(prefers-color-scheme: dark)').matches);
  set(get());
  window.addEventListener('DOMContentLoaded',()=>{
    let btn=document.getElementById('theme-toggle');
    if(btn)btn.onclick=()=>{
      const n=!document.documentElement.classList.contains("dark");
      set(n),localStorage.theme=n?'dark':'light';
    };
    let y=document.getElementById('year');if(y)y.textContent=(new Date()).getFullYear();
  });
})();
document.addEventListener("DOMContentLoaded", function() {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("navbar-links");
  burger.addEventListener("click", function() {
    nav.classList.toggle("open");
    burger.classList.toggle("active");
    burger.setAttribute("aria-expanded", nav.classList.contains("open"));
  });
});