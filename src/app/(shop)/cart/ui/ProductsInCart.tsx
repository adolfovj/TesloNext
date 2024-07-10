'use client'

import { ProductImage, QuantitySelector } from '@/components';
import { useCartStore } from '@/store';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

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
            <ProductImage 
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
                <Link 
                    href={ `/product/${ product.slug }`}
                    className='hover: underline cursor-pointer'
                    >
                    <p>{ product.size } - { product.title }</p>
                </Link>
                <p>{ product.price }</p>
                <QuantitySelector 
                    quantity={ product.quantity } 
                    onQuantityChanged={ quantity => updateProductQuantity(product, quantity) }
                />

                <button 
                    className="underline mt-3"
                    onClick={ () => removeProduct( product ) }
                >
                    Remover
                </button>
            </div>

            </div>
        ))
        }    
    </>
    )
}

export default ProductsInCart
