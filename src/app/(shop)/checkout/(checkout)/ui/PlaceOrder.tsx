"use client";

import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { placeOrder } from '@/actions';
import { useAddressStore, useCartStore } from '@/store';
import { currencyFormat, sleep } from '@/utils';
import { useRouter } from 'next/navigation';

export const PlaceOrder = () => {

    const router = useRouter();

    // TODA LA INFORMACION ESTA EN EL STORE
    // Cargar del servidor en un punto en el tiempo no va a estar 
    // Igual al servidor
    const [loaded, setLoaded] = useState(false);

    // VARIABLE PARA CONTROLAR EL ERROR
    const [errorMessage, setErrorMessage] = useState('');

    // Para bloquear el boton
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const address = useAddressStore( state => state.address );

    const { itesmInCart, subTotal, total, tax, } = 
        useCartStore( state => state.getSummaryInformation() );
    
    // Obtener el carrito de compras de los productos    
    const cart = useCartStore( state => state.cart );
    const clearCart = useCartStore( state => state.clearCart );

    useEffect(() => {
        setLoaded(true);
    }, [])
    
    // Bloquear el boton |
    const onPlaceOrder = async() => {

        setIsPlacingOrder(true);

        const productsToOrder = cart.map( product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }))

        // Enviar datos para la transaccion de la estructura de la orden
        //console.log( {address, productsToOrder} );
        //  await sleep(2) //Para saber que el boton se bloquea al momento del llamado
        // Todo: Server Action

        const resp = await placeOrder( productsToOrder, address )

        if( !resp.ok ) {
            setIsPlacingOrder(false);
            setErrorMessage(resp.message);
            return;
        }

        // Si llegamos a este punto todo salio bien!
        //console.log({resp});
        // Limpiar el carrito y redireccionar la persona
        clearCart();

        // Navegar a la persona
        router.replace('/orders/' + resp.order?.id )
    }

    if( !loaded ) {
        return <p>Cargando...</p>
    }


    return (
        <div className="bg-white rounded-xl shadow-xl p-7">
        <h2 className="text-2xl mb-2">Direccion de entrega</h2>
        <div className="mb-10">
            <p className="text-xl">{ address.firstName }</p>
            <p>{ address.lastName }</p>
            <p>{ address.address }</p>
            <p>{ address.address2 }</p>
            <p>{ address.city }, { address.country }</p>
            <p>{ address.phone }</p>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 rounded mb-10 bg-gray-200"></div>

        <h2 className="text-2xl mb-2">Resumen de la orden</h2>

        <div className="grid grid-cols-2">
            <span>No. Productos</span>
            <span className="text-right">
                {
                    itesmInCart === 1 
                        ? "1 Artículo"
                        : `${ itesmInCart } Artículos`
                }
            </span>

            <span>Subtotal</span>
            <span className="text-right">{ currencyFormat( subTotal )}</span>

            <span>Impuestos (19%)</span>
            <span className="text-right">{ currencyFormat( tax )}</span>

            <span className="mt-5 text-2xl">Total:</span>
            <span className="mt-5 text-2xl text-right">{ currencyFormat( total )}</span>
        </div>

        <div className="mt-5 mb-2 w-full">
            <p className="mb-5">
            {/* Disclaimer */}
            <span className="text-xs">
                Al hacer clic en &ldquo;Colocar orden&ldquo;, aceptas nuestros{" "}
                <a href="#" className="underline">
                términos y condiciones
                </a>{" "}
                y{" "}
                <a href="#" className="underline">
                política de privacidad
                </a>
            </span>
            </p>

            {/* por si se agoto existencias u otro error */}
            <p className='text-red-500'>{ errorMessage }</p>

            <button
                //href="/orders/123"
                onClick={ onPlaceOrder }
                className={
                    clsx({
                        'btn-primary': !isPlacingOrder,
                        'btn-disabled': isPlacingOrder,
                    })
                }
                
                >
                Colocar orden
            </button>
        </div>
        </div>
    );
};
