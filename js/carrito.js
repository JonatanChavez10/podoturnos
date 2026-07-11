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
        for (let i = 0; i < carrito.length; i++) {
            let producto = carrito[i];

            let item = document.createElement("li");
            item.className = "carrito-item";

            item.innerHTML =
                "<span class='nombre-producto'>" + producto.title + "</span>" +
                "<span class='carrito-precio'>$" + producto.price + "</span>" +
                "<button class='btn-quitar' data-indice='" + i + "'>✕</button>";

            listaCarrito.appendChild(item);
        }

        // Evento para los botones de quitar.
        let botonesQuitar = document.querySelectorAll(".btn-quitar");

        for (let boton of botonesQuitar) {
            boton.addEventListener("click", function () {
                let indice = boton.getAttribute("data-indice");
                quitarProducto(indice);
            });
        }
    }

    totalTexto.textContent = "$" + totalCarrito();
    cantidadTexto.textContent = carrito.length;

}
function totalCarrito() {
    let total = 0;
    carrito.forEach(producto => {
        total += producto.price;
    });
    return total;
}

function quitarProducto(indice) {
    let producto = carrito[indice];
    carrito.splice(indice, 1);
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    console.log("Producto eliminado del carrito:", producto);

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

function borrarBD(){
    localStorage.removeItem(CLAVE_CARRITO);
}


document.addEventListener("DOMContentLoaded", function () {
        console.log("¡El evento DOMContentLoaded se disparó!"); 
        carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
        actualizarCarrito();
    });
