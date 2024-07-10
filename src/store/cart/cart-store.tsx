import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { Product } from '../../interfaces/product.interface';
import { persist } from "zustand/middleware";

interface State {
    
    cart: CartProduct[];
    
    // Actualizar carrito de compras
    getTotalItems: () => number;

    getSummaryInformation: () => {
        subTotal: number;
        tax: number;
        total: number;
        itesmInCart: number;
    };

    // Metodos para modificar el carrito de compras
    addProductsToCart: ( product: CartProduct ) => void;

    updateProductQuantity: ( product: CartProduct, quantity: number ) => void;
    
    // id producto | talla PARA ELIMINAR
    removeProduct: ( product: CartProduct) => void;

    // Limpiar el carrito
    clearCart: () => void;

}

// Store de Zustand | Mirar Documentacion
// El store se crea asi
// create de tipo State
// la funcion
export const useCartStore = create<State>()(

    // Funcion de Zustand persist
    // Se encargar de guardarlo y recuperarlo en el local storage
    //persist

    // persist genera un inconveniente
    // next intenta crar la pantalla pero en el momento que usamos el store
    // para mostar el carrito de compras se crean dos renderezaciones 
    // 1 next lado del servidor 2 Zustand al lado del cliente
    // El servidor no tiene la informacion de el localStorage del cliente
    // por eso tambien es conveniente mandarlo por cookies, siempre va a 
    // mantener la informacion del cliente.
    // Se va a resolver el problema

    persist(
        // 1er argumetno la definicion de nuestro store

        // get Permite OBTENER EL ESTADO State actual del Zustand
        (set, get) => ({

            cart: [],
            
            // Actualizar carrito de compras
            getTotalItems: () => {
                
                const { cart } = get();
                // Recorrer el arreglo y contar la cantidad FUNCION REDUCE
                // el callback es algo similar a cart.filter(item => item.price > 100)
                // 1er Argumento Callback
                // 2do Argumento el valor inicial que tiene el contador
                //      total: Valor inicial  
                //      item: Iteracion carrito
                return cart.reduce( (total , item ) => total + item.quantity, 0 );
            },

            getSummaryInformation: () => {

                const { cart } = get();

                // 1er argumento callback
                    // subtotal valor initial, producto | item de iteracion
                // 2do valor inicial  0
                const subTotal = cart.reduce( 
                    (subtotal, product) => (product.quantity * product.price) + subtotal
                    , 0);
                
                // impuesto
                const tax = subTotal * 0.19;
                const total = subTotal + tax;

                const itesmInCart =  cart.reduce( (total , item ) => total + item.quantity, 0 );

                return {
                    subTotal,
                    tax,
                    total,
                    itesmInCart,
                }
            },

            // Metodos
            addProductsToCart: ( product: CartProduct ) => {

                // get Permite obtener el estado actual del Zustand get.cart
                // se desestructura | Obtener el carrito
                const { cart } = get(); 
                console.log(cart);

                // 1.REVISAR SI EXISTE EN EL CARRITO en el carrito con la talla seleccionada 
                // cart.some Es igual al filter, determina si existe un elemento con la condicion
                // so hay uno se sale
                // product Es el producto que entra en el carriyo
                const productInCart = cart.some(
                    ( item ) => (item.id === product.id && item.size === product.size )
                );

                // Si no existe el producto en el carrito se inserta y listo
                if( !productInCart ) {
                    // set NOTIFICA A TODAS LAS PANTALLAS SI SE HACE LA MODIFICACION
                    // INSERTANDO EL NUEVO PRODUCTO EN EL CARRITO
                    set({ cart: [ ...cart, product ] })
                    return;
                }

                // 2. SE QUE EL PRODUCTO EXISTE POR TALLA | SE INCREMENTA LA CANTIDAD
                // Se crea un arreglo
                const updateCartProducts = cart.map( (item) => {

                    if( item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: item.quantity + product.quantity }
                    }

                    return item; 
                })

                set({ cart: updateCartProducts });
            },

            updateProductQuantity: ( product: CartProduct, quantity: number ) => {

                const { cart } = get(); 

                // Se recorre y se actualiza la cantidad
                const updatedCartProducts = cart.map( item => {
                    if( item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: quantity }
                    }                    
                    return item;
                })

                // Se actualiza el state | Estableciendo en el state
                set({ cart: updatedCartProducts });

            },  

            removeProduct: ( product: CartProduct ) => {

                const { cart } = get(); 

                // Se recorre y se actualiza la cantidad
                // Lista sin el producto removido
                const updatedCartProducts = cart.filter( 
                    (item) => item.id !== product.id || item.size !== product.size                                                                               
                );

                set({ cart: updatedCartProducts });

            },

            clearCart: () => {
                set({ cart: [] })
            }
        }),        
        
        // 2do argumento Nombre de nuestro store
        {
            name: "shopping-cart",
            // skipHydration: true, 
            // Evita el problema anterior pero se debe controlar de manera manual
            // al cargar el localStorage SE VA A RESOLVER DE DISTINTA MANERA
        }
    )
)