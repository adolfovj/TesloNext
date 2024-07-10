'use client'

import { useCartStore } from '@/store';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { currencyFormat } from '../../../../../utils/currencyFormat';

const ProductsInCart = () => {

    // Zustand Se toma del gestor de estado | RETORNA UNA FUNCION
    const removeProduct = useCartStore( state => state.removeProduct );
    const updateProductQuantity = useCartStore( state => state.updateProductQuantity );
    const productsInCart = useCartStore( state => state.cart );

    // Para controlar el error del not match
    const [loaded, setLoaded] = useState(false);

    // Darle tiempo a Zustand para que haga match 
    useEffect(() => {
        setLoaded( true )
    }, [])    

    if( !loaded ) {
        return <p>Loading...</p>
    }

    return (
    <>
        {
        productsInCart.map( product => (
            
            <div key={ `${ product.slug }-${ product.size }` } className="flex mb-5">
            <Image 
                src={ `/products/${ product.image }`}
                width={ 120 }
                height={ 120 }
                style={{
                width: '100px',
                height: '100px',
                }}
                alt={ product.title }
                className="mr-5 rounded"
            />

            <div>
                <span>
                    <p>{ product.size } - { product.title } ({ product.quantity })</p>
                </span>
                <p className='font-bold'>{ currencyFormat(product.price * product.quantity ) }</p>

            </div>

            </div>
        ))
        }    
    </>
    )
}

export default ProductsInCart
