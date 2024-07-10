'use client';

import Link from 'next/link';
import { IoSearchOutline, IoCartOutline } from 'react-icons/io5';

import { titleFont } from '@/config/fonts';
import { useCartStore, useUIStore } from '@/store';
import { useEffect, useState } from 'react';

export const TopMenu = () => {

  const openSideMenu = useUIStore(state => state.openSideMenu);

  // Actualizacion numero  carrito 
  const totalItemsInCart = useCartStore( state => state.getTotalItems() );

  // Miticando el error que se genera con persist
  // loaded va a renderizar el pedazo de html de abajo con la condicion
  // LO QUE HACE QUE EL SERVIDOR VA A TENER LO MISMO QUE TIENE EL CIENTE
  const [loaded, setLoaded] = useState(false);

  // Next se dispara el client component y ya sabe que todo viene de el lado del cliente
  useEffect(() => {
    setLoaded(true);
  }, [])
  

  return (
    <nav className="flex px-5 justify-between items-center w-full">

      {/* Logo */ }
      <div>
        <Link
          href="/">
          <span className={ `${ titleFont.className } antialiased font-bold` } >Teslo</span>
          <span> | Shop</span>
        </Link>
      </div>

      {/* Center Menu */ }
      <div className="hidden sm:block">

        <Link className="m-2 p-2 rounded-md transition-all hover:bg-gray-100" href="/gender/men">Hombres</Link>
        <Link className="m-2 p-2 rounded-md transition-all hover:bg-gray-100" href="/gender/women">Mujeres</Link>
        <Link className="m-2 p-2 rounded-md transition-all hover:bg-gray-100" href="/gender/kid">Niños</Link>

      </div>


      {/* Search, Cart, Menu */ }
      <div className="flex items-center">

        <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>

         {/* Se navega al carrito de compras si hay mas de un elemento en el carritop */}
        <Link href={

          // loaded | hidratacion
          ( ( totalItemsInCart === 0 ) && loaded ) 
            ? '/empty'
            : "/cart"
          } className="mx-2">
          <div className="relative">
            {
              // Si es mayor a cero muestra el totalItemsInCart
              ( loaded && totalItemsInCart > 0) && (
              <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white">
                { totalItemsInCart }
              </span>
            )}
            <IoCartOutline className="w-5 h-5" />
          </div>
        </Link>

        <button
          onClick={ openSideMenu }
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">
          Menú
        </button>

      </div>
    </nav>
  );
};