document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productos')) {
        cargarProductos();
    }
    if (document.getElementById('lista-carrito')) {
        mostrarCarrito();
        actualizarTotalCarrito();
        document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);
        document.getElementById('comprar').addEventListener('click', comprarCarrito);
    }
});

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

async function cargarProductos() {
    try {
        const response = await axios.get('/data/productos.json');
        const productos = response.data;
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById('productos');
    productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <button onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">Agregar al Carrito</button>
        `;
        contenedor.appendChild(div);
    });
}

function agregarAlCarrito(id, nombre, precio) {
    const producto = { id, nombre, precio, cantidad: 1 };
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        carrito[index].cantidad++;
    } else {
        carrito.push(producto);
    }
    guardarCarrito();
    mostrarCarrito();
    actualizarTotalCarrito();
}

function mostrarCarrito() {
    const lista = document.getElementById('lista-carrito');
    lista.innerHTML = '';
    carrito.forEach(producto => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${producto.nombre} (x${producto.cantidad}) - $${producto.precio * producto.cantidad}
            <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
        `;
        lista.appendChild(li);
    });
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== id);
    guardarCarrito();
    mostrarCarrito();
    actualizarTotalCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    actualizarTotalCarrito();
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarTotalCarrito() {
    const totalCarrito = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    const totalCarritoElement = document.getElementById('total-carrito');
    totalCarritoElement.textContent = `$${totalCarrito.toFixed(2)}`;
}

function comprarCarrito() {
    if (carrito.length === 0) {
        mostrarMensaje('No hay productos en el carrito');
        return;
    }

    mostrarMensaje('Compra realizada correctamente');
    vaciarCarrito();
}

function mostrarMensaje(mensaje) {
    const mensajeElement = document.createElement('div');
    mensajeElement.classList.add('mensaje');
    mensajeElement.textContent = mensaje;

    document.body.appendChild(mensajeElement);

    setTimeout(() => {
        mensajeElement.remove();
    }, 3000); // Remover el mensaje después de 3 segundos
}