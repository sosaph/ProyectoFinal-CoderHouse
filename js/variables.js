const productos = [
    { id: 1, titulo: "Chocotorta", tituloDetalle: "con chocolates", precio: 1590, imagen: "assets/images/Chocotorta.jpeg"},
    { id: 2, titulo: "Cheesecake", tituloDetalle: "con frutos rojos", precio: 1350, imagen: "assets/images/Cheesecake.jpeg"},
    { id: 3, titulo: "Box degustación", tituloDetalle: "brownies, cheesecakes, lemonies", precio: 1290, imagen: "assets/images/Box degustacion.jpeg"},
    { id: 4, titulo: "Pavlova", tituloDetalle: "torta de merengue con frutillas", precio: 2390, imagen: "assets/images/Pavlova.jpeg"},
    { id: 5, titulo: "Butter Cream", tituloDetalle: "torta de manteca con oreo decoradas", precio: 4000, imagen: "assets/images/Buttercream.jpeg"},
    { id: 6, titulo: "Letter Cake", tituloDetalle: "brownie, crema bariloche, dulce de leche", precio: 3800, imagen: "assets/images/Bizcochuelo con ddl.jpeg"},
    { id: 7, titulo: "Cake Pops", tituloDetalle: "torta chupetin decorada", precio: 2500, imagen: "assets/images/Cakepops.jpeg"},
    { id: 8, titulo: "Cupcakes", tituloDetalle: "cupcakes decorados", precio: 4200, imagen: "assets/images/Cupcakes.jpeg"},
    { id: 9, titulo: "Key Lime Pie", tituloDetalle: "pastel de lima con crema", precio: 7800, imagen: "assets/images/Key lime pie.jpeg"},
    { id: 10, titulo: "Brownie", tituloDetalle: "brownie con chocolates", precio: 2900, imagen: "assets/images/Brownie.jpeg"},
    { id: 11, titulo: "Torta 3 Mousses", tituloDetalle: "mousse chocolates semi amargo, con leche y blanco", precio: 2900, imagen: "assets/images/TresMousses.jpeg"},
    { id: 12, titulo: "Chaja", tituloDetalle: "chaja de frutilla o durazno", precio: 2900, imagen: "assets/images/Chaja.jpeg"},
];

let miCarrito = [];
const KEY_CARRITO_STORAGE = "miCarrito";