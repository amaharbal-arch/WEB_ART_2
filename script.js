// CONFIGURACIÓN WEB_ART_2
const SUPABASE_URL = 'https://qsafrpvlxxaoaueiicev.supabase.co';
const SUPABASE_KEY = 'sb_publishable_U1CjbIRMNQMNk5ERK47onA_EhCOIQLd';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let obrasData = [];
let currentIndex = 0;

async function cargarGaleria(filtro = 'Todos') {
  const grid = document.getElementById('photoGrid');
  const footer = document.querySelector('.footer-minimal');

  // REINICIO DE INGENIERÍA: Resetea el reloj de los contactos
  if (footer) {
    footer.classList.remove('footer-activo');
    void footer.offsetWidth; // Reflujo: fuerza al navegador a reiniciar la animación
    footer.classList.add('footer-activo');
  }

  window.scrollTo(0, 0);
  if (grid) grid.style.opacity = '0';

  grid.innerHTML = "";
  let query = _supabase.from('obras').select('*');
  if (filtro !== 'Todos') query = query.eq('tecnica', filtro);

  const { data, error } = await query;
  if (data) {
    obrasData = data;
    renderGrid();
  }
}

function renderGrid() {
  const grid = document.getElementById('photoGrid');
  grid.innerHTML = ""; 
  obrasData.forEach((obra, index) => {
    const item = document.createElement('div');
    item.className = 'photo-item';
    // WEB_ART es la carpeta en Cloudinary
    const urlCloudinary = `https://res.cloudinary.com/deqk2tmer/image/upload/${obra.nombre_archivo}.jpg`;
    item.innerHTML = `<img src="${urlCloudinary}" alt="${obra.titulo}" loading="lazy">`;
    item.onclick = () => abrirLightbox(index);
    grid.appendChild(item);
  });
  grid.style.opacity = '0'; // Asegura que empiece invisible

  setTimeout(() => {
    grid.style.opacity = '1'; // Las fotos aparecen a los 0.6s
  }, 100);}

  
function abrirLightbox(index) {
  currentIndex = index;
  const obra = obrasData[currentIndex];
  const urlCloudinary = `https://res.cloudinary.com/deqk2tmer/image/upload/${obra.nombre_archivo}.jpg`;
  
  document.getElementById('lightboxImg').src = urlCloudinary;
  document.getElementById('artwork-title').innerText = obra.titulo.toUpperCase();
  document.getElementById('artwork-size').innerText = obra.dimensiones;
  document.getElementById('artwork-tech').innerText = obra.tecnica;
  document.getElementById('artwork-year').innerText = obra.anio;
  
  document.getElementById('lightbox').style.display = 'flex';
}

function cambiarImagen(direccion) {
  currentIndex += direccion;
  if (currentIndex < 0) currentIndex = obrasData.length - 1;
  if (currentIndex >= obrasData.length) currentIndex = 0;
  abrirLightbox(currentIndex);
}

document.getElementById('nextBtn').onclick = () => cambiarImagen(1);
document.getElementById('prevBtn').onclick = () => cambiarImagen(-1);
document.getElementById('closeLightbox').onclick = () => document.getElementById('lightbox').style.display = 'none';

const menuOverlay = document.getElementById('menuOverlay');
document.getElementById('openMenu').onclick = () => menuOverlay.classList.add('active');
document.getElementById('closeMenu').onclick = () => menuOverlay.classList.remove('active');

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.onclick = (e) => {
    const textoBoton = e.target.innerText.trim();
    if (textoBoton === 'CONTACTO' || textoBoton === 'TIENDA') {
      menuOverlay.classList.remove('active');
      return;
    }
    const filtroMapa = { 'ÓLEO': 'Óleo', 'ACUARELA': 'Acuarela', 'DIBUJO': 'Dibujo', 'INICIO': 'Todos' };
    cargarGaleria(filtroMapa[textoBoton] || 'Todos');
    menuOverlay.classList.remove('active');
  };
});

cargarGaleria();