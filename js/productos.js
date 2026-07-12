const contenedorProductos = document.getElementById("productos");
const finalizarCompra = document.getElementById("finalizarCompra");
const CLAVE_CARRITO = "carrito";
let carrito = [];
let listadoProductos = [];
let stockProductos = [];

function obtenerProductos() {
    fetch('https://fakestoreapi.com/products')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error! status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(producto => {
                listadoProductos.push(producto);
                stockProductos.push(10); // Asignamos un stock inicial de 10 unidades para cada producto
            });
            dibujarProductos();
        })
        .catch(error => {
            console.error("Error al obtener los productos:", error);
        })
};

function dibujarProductos() {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = "";//Limpio el contenedor antes de dibujar los productos
    listadoProductos.forEach((producto, indice) => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("producto");
        tarjeta.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}">
            <h3>${producto.title}</h3>
            <p>${producto.category}</p>
            <p>Stock: ${stockProductos[indice]}</p>
            <h2>$${producto.price}</h2>
            <button class="btn-agregar-carrito" data-id="${indice}">Agregar al carrito</button>
        `;
        contenedorProductos.appendChild(tarjeta);
    });
    let botones = document.querySelectorAll(".btn-agregar-carrito");
    botones.forEach(boton => {
        boton.addEventListener("click", function () {
            let indice = this.getAttribute("data-id");
            agregarProducto(indice);
        });
    });
}

function vaciarCarrito() {
    carrito = [];
    console.log("Carrito vaciado");
}

function agregarProducto(indice) {
    if (stockProductos[indice] > 0) {
        let productoSeleccionado = listadoProductos[indice];
        stockProductos[indice]--;


        let productoEnCarrito = carrito.find(producto => producto.id === productoSeleccionado.id);

        if (productoEnCarrito) {

            productoEnCarrito.cantidad++;
        } else {

            let nuevoProducto = { ...productoSeleccionado, cantidad: 1 };
            carrito.push(nuevoProducto);
        }

        console.log("Carrito actual:", carrito);

        guardarCarrito();
        renderizarProductos();
    } else {
        alert("No hay stock disponible para este producto.");
    }
}
function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function renderizarProductos() {

    dibujarProductos();
    finalizarCompra.innerHTML = "";
    carrito = localStorage.getItem(CLAVE_CARRITO) ? JSON.parse(localStorage.getItem(CLAVE_CARRITO)) : [];
    if (carrito.length > 0) {
        let subTotal = document.createElement("p");
        subTotal.textContent = `Subtotal: $${totalCarrito()}`;
        finalizarCompra.appendChild(subTotal);
        let botonFinalizar = document.createElement("button");
        botonFinalizar.textContent = "Finalizar Compra";
        botonFinalizar.addEventListener("click", function () {
            terminarCompra();
        });
        finalizarCompra.appendChild(botonFinalizar);
    }
}

function totalCarrito() {
    let total = 0;
    carrito.forEach(producto => {

        total += (producto.price * producto.cantidad);
        console.log("Toal acumulado:", total);
    });
    return total;
}
function terminarCompra() {
    //guardarCarrito();
    vaciarCarrito();
    window.location.href = "../Paginas/carrito.html";
}


document.addEventListener("DOMContentLoaded", function () {
    obtenerProductos();
    renderizarProductos();
});

