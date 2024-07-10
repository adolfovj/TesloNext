'use client'

import { useCartStore } from '@/store';
import { useState, useEffect } from 'react';
import { currencyFormat } from '@/utils';

export const OrderSummary = () => {

     // --- hidratacion start
    // Solucionando el error de la hidratacion
    const [loaded, setLoaded] = useState(false);

    // Llamando al store | No pertenece a la hidratacion
    const { itesmInCart, subTotal, total, tax, } = useCartStore( state => state.getSummaryInformation() );

    useEffect(() => {

        setLoaded(true);
    }, []) 
    // En la dependencia | Se pone dependencia error Maximum update depth exceded

    
    if( !loaded) return <p>Loading...</p>
    // --- hidratacion end

    return (
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
    )
}


