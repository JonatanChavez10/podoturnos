let carrito = [];
const CLAVE_CARRITO = "carrito";
let listaCarrito = document.getElementById("items-carrito");
let totalTexto = document.getElementById("total-carrito");
let cantidadTexto = document.getElementById("cantidad-carrito");
function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<li class='carrito-vacio'>Tu carrito está vacío.</li>";
    } else {

        carrito.forEach((producto, indice) => {
            let item = document.createElement("li");
            item.className = "carrito-item";


            item.innerHTML = `
                <span class='nombre-producto'>${producto.title}</span>
                ${producto.cantidad > 1 ? `<span class='carrito-cantidad'> x${producto.cantidad}</span>` : ""}
                <span class='carrito-precio'>$${producto.price}</span>
                <button class='btn-agregar' data-indice='${indice}'>+</button>
                <button class='btn-quitar' data-indice='${indice}'>-</button>
            `;

            listaCarrito.appendChild(item);
        });


        let botonesQuitar = document.querySelectorAll(".btn-quitar");
        botonesQuitar.forEach(boton => {
            boton.addEventListener("click", function () {
                let indice = this.getAttribute("data-indice");
                quitarProducto(indice);
            });
        });

        let botonesAgregar = document.querySelectorAll(".btn-agregar");
        botonesAgregar.forEach(boton => {
            boton.addEventListener("click", function () {
                let indice = this.getAttribute("data-indice");
                sumarProducto(indice);
            });
        });
    }

    totalTexto.textContent = "$" + totalCarrito().toFixed(2);


    let cantidadTotalArticulos = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    cantidadTexto.textContent = cantidadTotalArticulos;
}

function totalCarrito() {
    let total = 0;
    carrito.forEach(producto => {

        total += (producto.price * producto.cantidad);
    });
    return total;
}

function quitarProducto(indice) {
    let producto = carrito[indice];
    if (producto.cantidad == 1) {

        carrito.splice(indice, 1);

    } else {
        producto.cantidad--;
    }

    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarCarrito();
}

function sumarProducto(indice) {
    let producto = carrito[indice];
    producto.cantidad++;
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarCarrito();
}   

function terminarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: "info",
            title: "Tu carrito está vacío",
            text: "Agregá productos antes de pagar.",
            confirmButtonColor: "#57d4e5"
        });
        return;
    }


    Swal.fire({
        icon: "success",
        title: "¡Gracias por tu compra!",
        html:
            "Total a pagar: <strong>$" + totalCarrito() + "</strong><br><br>" +
            "<small>El pago es solo una demostración, no se procesa ningún cobro.</small>",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#57d4e5"

    });
    localStorage.removeItem(CLAVE_CARRITO);
    vaciarCarrito();
    actualizarCarrito();

}

document.getElementById("btn-pagar").addEventListener("click", terminarCompra);
document.getElementById("btn-vaciar").addEventListener("click", function () {
    vaciarCarrito();
    actualizarCarrito();
});
function vaciarCarrito() {
    carrito = [];
    borrarBD();
    console.log("Carrito vaciado");
}

function borrarBD() {
    localStorage.removeItem(CLAVE_CARRITO);
}


document.addEventListener("DOMContentLoaded", function () {
    carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
    actualizarCarrito();
});
