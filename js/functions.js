/* Proyecto Final - Sosa Pablo Hernan
Breve resumen del programa:
El programa es un carrito de compras de una pasteleria en el cual se van seleccionando
el/los productos que se desean adquirir. Una vez seleccionado en el carrito se puede modificar
la cantidad del mismo y se iran actualizando los precios tanto en pesos como en dolares.
En caso de arrepentirse de la adquisicion de algun producto uno puede disminuir la cantidad del
mismo o eliminarlo del carrito, lo cual tendra sus correspondientes actualizaciones en pedido y
valores.
En el momento que se confirma la compra tanto el carrito como los importes vuelve su estado a 
valores iniciales(0) 
*/

//Cargo DOM para inicializar página

$(() => {
  console.info(
    "El DOM ha sido cargado correctamente, puede empezar a utilizar la página."
  );
});

window.addEventListener("load", () => {
  console.info("Evento load cargado.");
  mostrarProductos();
  inicializarCarrito();
});

// Funciones del carrito

function mostrarProductos() {
  let divShopItem = "";
  for (const item of productos) {
    divShopItem += `<div class="shop-item">
                            <span class="shop-item-title">${item.titulo}</span>
                            <span class="shop-item-title--detail">${item.tituloDetalle}</span>
                            <img class="shop-item-image" src="${item.imagen}">
                            <div class="shop-item-details">
                                <span class="shop-item-price">\$${item.precio}</span>
                                <button class="btn btn-primary shop-item-button" type="button" onclick="clickComprar(${item.id})">COMPRAR</button>
                            </div>
                        </div>`;
  }
  $("#shop-items").prepend(divShopItem);
}

//Inicializo carrito con productos en local storage, sino hay nada inicio valores en 0
function inicializarCarrito() {
  const carritoLocalStorage = traerDeLocalStorage();
  if (!carritoLocalStorage) {
    console.warn("El carrito está vacío");
    miCarrito = [];
    return;
  }
  miCarrito = carritoLocalStorage;
  renderizarCarrito();
}

//Realiza busqueda segun Id de Producto
function buscarProductoPorId(id) {
  return productos.find((producto) => producto.id === id);
}

//Busca id del producto dentro del carrito
function indiceItemCarrito(id) {
  return miCarrito.findIndex((item) => item.id === id);
}

//Agrego productos al carrito, en caso que el producto haya sido seleccionado
//anteriormente se suma uno al mismo, en caso contrario se agrega con cantidad 1
function agregarProductoAlCarrito(id) {
  const itemSeleccionado = buscarProductoPorId(id);
  if (!itemSeleccionado) {
    // console.log("No se puede agregar el producto al carrito. Razón: no existe");
    return;
  }
  const indexItemSeleccionado = indiceItemCarrito(id);
  if (indexItemSeleccionado >= 0) {
    miCarrito[indexItemSeleccionado].cantidad++;
  } else {
    miCarrito.push({
      id,
      cantidad: 1,
    });
  }
  renderizarCarrito();
  guardarEnLocalStorage();
  $.notify("Producto agregado al carrito", "success"); // Notificación de que el item fue agregado al carrito
}

//Busco Id del producto y lo envio al carrito
function clickComprar(id) {
  const producto = buscarProductoPorId(id);
  agregarProductoAlCarrito(producto.id);
}

//Creo funcion para calcular precio final de compra tanto en $ como en u$s, utilizando Fetch
//a una API que tiene valores actualizados
function renderizarTotal(arrayTotales) {
  /* Operador ternario. Si mi array de valores no tiene nada, devuelvo 0 y sino, calculo el precio total de mis items acumulados. */
  const totalFinal =
    arrayTotales.length == 0
      ? 0
      : arrayTotales.reduce(
          (acumulador, precioActual) => acumulador + precioActual
        );

  precioEnDolares(totalFinal)
    .then((precioEnDolares) => {
      $(".cart-totalUS-price").text(`U$S ${precioEnDolares.toFixed(2)}`);
      // console.log(precioEnDolares);
    })
    .catch((error) => {
      // console.log(error);
    });
  $(".cart-total-price").text(`\$${totalFinal}`);
}

function renderizarCarrito() {
  const cartItems = $(".cart-items"); //contenedor de items
  cartItems.empty();
  const arrayTotales = [];

  miCarrito.forEach((item) => {
    const producto = buscarProductoPorId(item.id);
    const itemPrecioCantidad = producto.precio * item.cantidad;
    const filaItemSeleccionado = `
        <div class="cart-row">
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${producto.imagen}" width="100" height="100">
                <span class="cart-item-title">${producto.titulo}</span>
            </div>
            <span class="cart-price cart-column">${itemPrecioCantidad}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" onchange="cambiarCantidad(event, ${item.id})" value="${item.cantidad}">
                <button class="btn btn-danger" type="button" onclick="clickBorrar(${item.id})">QUITAR</button>
            </div>
        </div>`;

    arrayTotales.push(itemPrecioCantidad);
    cartItems.append(filaItemSeleccionado);
  });
  renderizarTotal(arrayTotales);
}

function precioEnDolares(precioEnPesos) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://mercados.ambito.com/dolar/%22+tipo+%22/variacion",
      success: (data) => {
        const precioDolares = precioEnPesos / parseFloat(data.venta);
        resolve(precioDolares);
      },
      error: (errorData) => {
        reject("Error al calcular el precio en dólares");
        // console.log(errorData);
      },
    });
  });
}

//Comportamiento de boton mostrar u ocultar carrito

$("#btn-ocultar").on("click", (event) => {
  $("#miCarrito-Section").slideToggle(800, () => {
    // console.log(event.target);
    $("#btn-ocultar").text(
      $("#btn-ocultar").text() == "Ocultar carrito"
        ? "Mostrar carrito"
        : "Ocultar carrito"
    );
  });
});

//Borra item seleccionado del carrito con su cantidad

function clickBorrar(id) {
  const itemEnCarritoSeleccionado = indiceItemCarrito(id);

  if (itemEnCarritoSeleccionado == -1) {
    // console.log("El item no se encuentra en el carrito");
    return;
  }

  if (!confirm("Desea borrar el item del carrito?")) {
    // console.log("El item no se ha borrado");
    return;
  }

  miCarrito.splice(itemEnCarritoSeleccionado, 1);
  // console.log(`el producto ${id}, ${productos[id - 1].titulo} ha sido borrado`);
  renderizarCarrito();
  guardarEnLocalStorage();
}

//Las siguientes 3 funciones manejan el comportamiento de Local Storage, Guardar productos,
//traer productos en caso que haya almacenados, borrar productos en caso de compra realizada
//o vaciado carrito

function guardarEnLocalStorage() {
  localStorage.setItem(KEY_CARRITO_STORAGE, JSON.stringify(miCarrito));
}

function traerDeLocalStorage() {
  return JSON.parse(localStorage.getItem(KEY_CARRITO_STORAGE));
}

function borrarDeLocalStorage() {
  localStorage.removeItem(KEY_CARRITO_STORAGE);
}

//funcion para vaciar carrito

function clickVaciarCarrito() {
  if (miCarrito.length === 0) {
    alert("El carrito ya está vacío");
    return;
  }

  if (!confirm("Desea borrar el contenido del carrito?")) {
    // console.log("El carrito no se ha vaciado");
    return;
  }
  vaciarCarrito();
}

function vaciarCarrito() {
  miCarrito = [];

  // console.log("el carrito ha sido borrado");
  renderizarCarrito();
  borrarDeLocalStorage();
}

//Funcion para cambiar cantidad de items ya dentro del carrito con el input de number

function cambiarCantidad(event, id) {
  let nuevaCantidad = event.target.value;
  const indiceItem = indiceItemCarrito(id);

  if (nuevaCantidad <= 0) {
    nuevaCantidad = 1;
  }

  miCarrito[indiceItem].cantidad = parseInt(nuevaCantidad);
  renderizarCarrito();
}

//funcion que maneja comportamiento de boton realizar compra

$(".btn-purchase").on("click", function () {
  if (miCarrito.length === 0) {
    alert("No existen items en el carrito");
    // console.log("Su carrito está vacio");
    return;
  } else {
    // console.log("Estás por realizar la compra");
  }

  if (!confirm("Desea realizar la compra?")) {
    // console.log("La compra no se ha concretado");
    return;
  } else {
    alert("Compra realizada!");
    // console.log("Compra realizada!");
  }

  vaciarCarrito();
  renderizarCarrito();
});
