export const revalidate = 60 // 60 Segundos

import { getPaginaterProductsWhitImages } from "@/actions";
import { ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";
//import { initialData } from "@/seed/seed";
import { Pagination } from '../../components';

//const products = initialData.products; 

interface Props {
  // searchParams | Siempre son string
  searchParams: {
    page?: string;
  }
}

export default async function Home({ searchParams }: Props) {

// se obtiene el parametro ?page=12
  //console.log( searchParams ); 

  // Si no viene el parametro va ser la pagina 1
  const page = searchParams.page ? parseInt( searchParams.page ) : 1;

  // {} los valores pueden ser nulos 
  const { products, currentPage, totalPages } = await getPaginaterProductsWhitImages({ page });


  
  // console.log( products  );
  // Se revisa la compatibilidad
  //console.log( products );

  // Si no hay productos | Cuando se va a paginar y no hay mas productos
  if ( products.length === 0 ) {
    redirect('/');
  }


  return (
    <>
      <Title 
        title="Tienda"
        subtitle="Todos los productos"
        className="mb-2"
      />

      {/* No existe el type exite la categoria */}
      <ProductGrid 
        products={ products }
      />

      <Pagination totalPages={ totalPages }/>
    </>
  );
}
