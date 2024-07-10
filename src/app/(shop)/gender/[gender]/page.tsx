export const revalidate = 60 // 60 Segundos

import { ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";
import { Pagination } from '../../../../components/ui/pagination/Pagination';
import { getPaginaterProductsWhitImages } from "@/actions";
import { Gender } from "@prisma/client";

interface Props {
  // Parametros
  params: {
    gender: string;
  },
  // Paginacion
  searchParams: {
    page?: string
  }
}

export default async function GenderByPage ( { params, searchParams }: Props) {

  const { gender } = params;

  // Si no viene el parametro va ser la pagina 1
  const page = searchParams.page ? parseInt( searchParams.page ) : 1;

  // {} los valores pueden ser nulos 
  const { products, currentPage, totalPages } = await getPaginaterProductsWhitImages({ 
    page, 
    gender: gender as Gender,
  });

  // console.log( products  );
  // Se revisa la compatibilidad
  //console.log( products );

  // Si no hay productos | Cuando se va a paginar y no hay mas productos
  if ( products.length === 0 ) {
    redirect(`/gender/${ gender }`);
  }


  // TIPOS A CONSTANTE EN TS labels: Record<ValidCategories, string>
  const labels: Record<string, string> = {
    'men': 'Hombres',
    'women': 'Mujeres',
    'kid': 'Ninos',
    'unisex': 'todos'
  }

  // if ( id === 'kids')
  // {
  //   notFound(); // regresa never | no tiene retorno 
  // }

  return (
    <div>
      <>
      <Title 
        title={ `Ariculos para ${ gender }` }
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid 
        products={ products }
      />

      <Pagination totalPages={ totalPages } />
    </>

    </div>
  );
}