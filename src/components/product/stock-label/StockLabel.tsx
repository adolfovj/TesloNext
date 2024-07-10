"use client"

import { getStockBySlug } from "@/actions/product/get-stock-by-slug";
import { titleFont } from "@/config/fonts"
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props ) => {

  // Manejo del stock
  const [stock, setStock] = useState(0);
  // LOADING
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStock = async() => {
      // todo: llamar al serverAction
      // Server Side donde esta la funcion getStockBySlug
      const inStock = await getStockBySlug( slug );
      //console.log( inStock );
      setStock( inStock );
      setIsLoading(false);
    }

    getStock();
  }, [slug]);

  // const getStock = async() => {
  //   // todo: llamar al serverAction
  //   // Server Side donde esta la funcion getStockBySlug
  //   const inStock = await getStockBySlug( slug );
  //   //console.log( inStock );
  //   setStock( inStock );
  //   setIsLoading(false);
  // }

  return (
    <>
    {
      isLoading
        ? (
            <h1 className={ `${ titleFont.className } antialiased font-bold text-lg bg-gray-200 animate-pulse` }>
                &nbsp;
            </h1>
         )
        : (
            <h1 className={ `${ titleFont.className } antialiased font-bold text-lg` }>
                Stock: { stock }
            </h1>
        )
    }
    </>

  )
}


