// https://tailwindcomponents.com/component/hoverable-table

export const revalidate = 0;

import { getPaginaterProductsWhitImages } from '@/actions';
import { Pagination, ProductImage, Title } from '@/components';
import { currencyFormat } from '@/utils';
import Image from 'next/image';

import Link from 'next/link';

//import { revalidate } from '../gender/[gender]/page';

interface Props {
  // searchParams | Siempre son string
  searchParams: {
    page?: string;
  }
}

export default async function ProductsPage ({ searchParams }: Props) {

  // Si no viene el parametro va ser la pagina 1
  const page = searchParams.page ? parseInt( searchParams.page ) : 1;

  // {} los valores pueden ser nulos 
  const { products, currentPage, totalPages } = await getPaginaterProductsWhitImages({ page });

  return (
    <>
      <Title title="Matenimiento de productos" />

      {/* Slu del producto al cual quiero navegar */}
      <div className='flex justify-end mb-5'>
        <Link href="/admin/product/new" className='btn-primary'>
          Nuevo Producto
        </Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Imagen
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Titulo
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Precio
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Genero
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Inventario
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Tallas
              </th>
            </tr>
          </thead>
          <tbody>

            {
              products.map( product => (
                <tr key={ product.id }
                    className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {/* { product.im } */}

                    <Link href={ `/product/${ product.slug }` }>
                      <ProductImage 
                        src={ product.ProductImage[0]?.url  } // Puede que no este la imagen
                        width={ 80 }
                        height={ 80 }
                        alt={ product.title }  
                        className='w-10 h-20 object-cover rounded'                      
                      />
                    </Link>
                  </td>

                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/product/${product.slug}`}
                          className='hover:underline' >
                            { product.title }
                    </Link>
                  </td>

                  <td className="text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap">
                    { currencyFormat( product.price ) }
                  </td>

                  <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                    { product.gender }
                  </td>

                  <td className="text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap">
                    { product.inStock }
                  </td>

                  <td className="text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap">
                    { product.sizes.join(', ') }
                  </td>

                </tr>
              ))

              // PAGINACION PENDIENTE
            }
          </tbody>
        </table>
        <Pagination totalPages={ totalPages } />
      </div>
    </>
  );
}