'use client'

import { generatePaginationNumbers } from '@/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import { IoChevronBack, IoChevronForwardOutline } from 'react-icons/io5';

interface Props {
  totalPages: number;
}


export const Pagination = ({ totalPages }: Props) => {

  // HOOK usePathname | next navigation
  const pathname = usePathname();
  // HOOK useSearchParams | Me sirve para obtener los paremtros de la URL
  const searchParams = useSearchParams();

  const pageString = searchParams.get('page') ?? 1;

  // Si el current page no viene en los params se pone 1
  // isNaN Es no numero
  let currentPage = isNaN( +pageString ) ? 1 : +pageString;

  if( currentPage < 1 || isNaN(+pageString)) {
    redirect( pathname )
  }

  // Generar parte inferior de la paginacion
  const allPages = generatePaginationNumbers( currentPage, totalPages );
  //console.log( allPages )


  // console.log( {pathname, searchParams, currentPage })

  // Crear url ?page=4 para navegacion | 
  // string ...  Por si hay mas paginas
  const createPageUrl = ( pageNumber: number | string ) => {

    // URLSearchParams ya viene con JS | Se utiliza para construir los parametros de la URL
    const params = new URLSearchParams( searchParams );

    if( pageNumber === '...') {
      // Retorna el mismo url
      return `${ pathname }?${ params.toString() }`;
    }

    // +pageNumber Para transformarlo en numero porque puede ser un string
    if( +pageNumber <= 0) {
      return `${ pathname }`; // href="/kid" 
    }

    //  Click en Next > | Para decirle que se quede en la ruta donde se encuentra
    if( +pageNumber > totalPages) { 
      return `${ pathname }?${ params.toString() }`; 
    }

    // Si no es ningua entonces se Establece la pagina
    params.set('page', pageNumber.toString());
    return `${ pathname }?${ params.toString() }`;
  }

  return (
    <div className="flex text-center justify-center mt-10 mb-32">
      <nav aria-label="Page navigation example">
        <ul className="flex list-style-none">

          <li className="page-item"><Link
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={ createPageUrl( currentPage - 1 ) }>
                <IoChevronBack size={ 30 }/>
              </Link></li>

          {
                allPages.map( (page, index) => (
                  <li key={ page + '-' + index } className="page-item">
                    <Link
                      className= {clsx(
                        "page-link relative block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none",
                        // Condicion para la seleccion del color                        
                        { 
                          'bg-blue-600 shadow-sm text-white hover:text-white hover:bg-blue-700' : page === currentPage }
                        )}
                      href={ createPageUrl ( page )}> 
                        { page }
                     </Link>
                  </li>                  
                ))
          }


          <li className="page-item"><Link
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={ createPageUrl( currentPage + 1 ) }>
                <IoChevronForwardOutline size={ 30 } />
              </Link></li>
        </ul>
      </nav>
    </div>
  )
}
