// ==========================
// VARIABLES PRINCIPALES
// ==========================
const filtros = document.querySelectorAll('.filtro');
const btnOfertas = document.getElementById('btn-ofertas');
const btnVerTodo = document.getElementById('btn-ver-todo');
const inputBuscar = document.getElementById('buscar');
const productos = document.querySelectorAll('.catalogo .producto-ind');

const iconoCarrito = document.getElementById('icono-carrito');
const panelCarrito = document.getElementById('panel-carrito');
const productosCarrito = document.getElementById('productos-carrito');
const totalCarrito = document.getElementById('total-carrito');
const cantidadCarrito = document.getElementById('cantidad-carrito');
const notificacion = document.getElementById('notificacion');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

let carrito = [];

// ==========================
// FILTRO POR CATEGORÍA
// ==========================
filtros.forEach(boton => {
  boton.addEventListener('click', () => {
    const categoria = boton.dataset.categoria;
    productos.forEach(p => {
      p.style.display = (p.dataset.categoria === categoria) ? 'block' : 'none';
    });
  });
});

// ==========================
// VER SOLO OFERTAS
// ==========================
if(btnOfertas){
  btnOfertas.addEventListener('click', () => {
    productos.forEach(p => {
      p.style.display = p.classList.contains('oferta') ? 'block' : 'none';
    });
  });
}

// ==========================
// VER TODO
// ==========================
if(btnVerTodo){
  btnVerTodo.addEventListener('click', () => {
    productos.forEach(p => p.style.display = 'block');
  });
}

// ==========================
// BUSCADOR POR NOMBRE
// ==========================
if(inputBuscar){
  inputBuscar.addEventListener('input', () => {
    const texto = inputBuscar.value.toLowerCase().trim();
    productos.forEach(p => {
      const nombre = p.querySelector('h3')?.textContent.toLowerCase() || '';
      p.style.display = nombre.includes(texto) ? 'block' : 'none';
    });
  });
}

// ==========================
// CARRITO DINÁMICO
// ==========================

// Mostrar / ocultar panel carrito
if(iconoCarrito && panelCarrito){
  iconoCarrito.addEventListener('click', () => {
    panelCarrito.classList.toggle('mostrar');
  });
}

// Vaciar carrito
if(vaciarCarritoBtn){
  vaciarCarritoBtn.addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
  });
}

// Notificación al agregar producto
function mostrarNotificacion(){
  if(!notificacion) return;
  notificacion.classList.add('mostrar');
  setTimeout(() => notificacion.classList.remove('mostrar'), 1500);
}

// Actualizar carrito en el panel
function actualizarCarrito(){
  if(!productosCarrito || !totalCarrito || !cantidadCarrito) return;

  productosCarrito.innerHTML = '';
  let total = 0;

  carrito.forEach((item, index) => {
    total += item.precioActual;
    const div = document.createElement('div');
    div.className = 'producto-carrito';
    div.innerHTML = `
      <img src="${item.imgSrc}" alt="${item.nombre}">
      <div class="producto-info">
        <span>${item.nombre}</span>
        <span class="producto-precio">
          ${item.precioAnterior ? `<span class="precio-anterior">$${item.precioAnterior}</span>` : ''}
          $${item.precioActual}
        </span>
      </div>
      <button onclick="eliminarProducto(${index})">X</button>
    `;
    productosCarrito.appendChild(div);
  });

  totalCarrito.textContent = total;
  cantidadCarrito.textContent = carrito.length;
}

// Eliminar producto del carrito
function eliminarProducto(index){
  carrito.splice(index, 1);
  actualizarCarrito();
}

// ==========================
// BOTONES AGREGAR AL CARRITO
// ==========================
const botonesAgregar = document.querySelectorAll('.producto-ind:not(.sin-stock) button:not(.ver-ofertas)');

botonesAgregar.forEach(boton => {
  boton.addEventListener('click', () => {
    const producto = boton.closest('.producto-ind');
    if(!producto) return;

    const nombre = producto.querySelector('h3')?.textContent || '';
    const precioActual = parseInt(producto.querySelector('.precio-nuevo')?.textContent.replace(/[^0-9]/g,'') 
                        || producto.querySelector('p')?.textContent.replace(/[^0-9]/g,'') || 0);
    const precioAnteriorEl = producto.querySelector('.precio-anterior');
    const precioAnterior = precioAnteriorEl ? parseInt(precioAnteriorEl.textContent.replace(/[^0-9]/g,'')) : null;
    const imgSrc = producto.querySelector('img')?.src || '';

    carrito.push({nombre, precioActual, precioAnterior, imgSrc});
    actualizarCarrito();
    mostrarNotificacion();
  });
});


