'use client'

import { QuantitySelector, SizeSelector } from "@/components"
import type { CartProduct, Product, Size } from "@/interfaces"
import { useCartStore } from "@/store"
import { useState } from "react"


interface Props {
    product: Product // Interfaces 
}

export const AddToCart = ({ product }: Props) => {

    // Tomando del store de ZUSTAND | Referencia a la funcion
    const addProductToCart = useCartStore( state => state.addProductsToCart );

    // Valor de los TIPOS por dedecto puede ser un Size o undefined
    const [size, setSize] = useState<Size | undefined>();
    const [quantity, setQuantity] = useState<number>(1);

    // Valiadcion de seleccionar talla
    const [posted, setPosted] = useState(false);


    const addToCart = () => {

      setPosted(true);
      // validaciones
      if ( !size ) return;
      //console.log({ size, quantity });
     
      // llamando la funcion de Zustand cartStore
      const cartProduct: CartProduct =  {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        quantity: quantity,
        size: size,
        image: product.images[0]
      }

      addProductToCart( cartProduct );
      setPosted(false);
      setQuantity(1);
      setSize(undefined);
    }

  return (
    <>
    {
      posted && !size && (
    
      <span className="mt-2 text-red-500 fade-in"> 
        Debe de seleccionar una talla
      </span>
      )
    }
      <SizeSelector 
        selectedSize={ size }
        availableSizes={ product.sizes }

        onSizeChanged={ setSize }
        //onSizeChanged={ size => console.log(size) }
      />

      {/* Selector de calidad */}
      <QuantitySelector 
        quantity={ quantity }
        onQuantityChanged={ setQuantity }
      />

      {/* Button */}
      <button 
        className="btn-primary my-5"
        onClick={ addToCart }
        >
        Agregar al carrito
      </button>    
    </>
  )
}


