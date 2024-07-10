// No va a cambiar mucho el contenido
// 7 dias por que no cambia tanto
export const revalidate = 604800; 

import { titleFont } from "@/config/fonts";
import { notFound } from "next/navigation";
import { ProductMobileSlideShow, ProductSlideShow, QuantitySelector, SizeSelector } from '../../../../components';
import { getProductBySlug } from "@/actions";
import { StockLabel } from "@/components/product/stock-label/StockLabel";
import { Metadata, ResolvingMetadata } from "next";
import { AddToCart } from "./ui/AddToCart";

interface Props {
  params: {
    slug: string;
  }
}

// SEO METADATA
// https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata // ResolvingMetadata | Acceso a la info del padre
): Promise<Metadata> {
  // read route params
  const slug = params.slug;
 
  const product = await getProductBySlug(slug);

  // fetch data
  //const product = await fetch(`https://.../${id}`).then((res) => res.json())
 
  // optionally access and extend (rather than replace) parent metadata
  //const previousImages = (await parent).openGraph?.images || []
 
  return {
    // Si quiere tener | Teslo Shop en todas las pantallas se usa un comodin
    // Que se pone en el layout de la app y se usa el metadata
    title: product?.title ?? "Producto no encontrado",
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? "Producto no encontrado",
      description: product?.description ?? '',
      
      // Se aconseja todo el url | Se comparte una imagen   
      // images [], // https://misitioweb.com/products/imabge.png
      images: [ `/products/${ product?.images[1]}` ],
    },
  }
}
// SEO METADATA

export default async function ProductBySlugPage ({ params } : Props) {

  const { slug } = params;
  // Traigo los productos
  //const product = initialData.products.find( product => product.slug === slug );
  const product = await getProductBySlug( slug );

  if( !product ) {
    notFound();
  }
    
  return (
    // Si uno no pone nada es para pantalla pequena
    //  grid-cols-1 si es con md pantalla mediana md:grid-cols-3
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">

      {/* mobile SlideShow */}
      <ProductMobileSlideShow 
          title={ product.title }
          images={ product.images }   
          // Oculatar este slideShow pero en pantalla mediana
          // Mostrar el otro   
          className="block md:hidden" 
      />

      {/* SlideShow */}
      <div className="col-span-1 md:col-span-2">
        <ProductSlideShow 
          title={ product.title }
          images={ product.images }
          // Mostrar este slideShow pero en pantalla mediana
          // se oculta el otro   
          className="hidden md:block"
        />
      </div>


      {/* Detalles */}
      <div className="col-span-1 px-5">  

        {/* <Stock   /> */}
        <StockLabel slug={ product.slug }  />

        <h1 className={ `${ titleFont.className } antialiased font-bold text-xl` }>
          { product.title }
        </h1>
        <p className="text-lg mb-5">${ product.price }</p>

      {/* ------- Se genera hoja de el lado del cliente */}
      <AddToCart product={ product }/>
      {/* Selector de tallas */}
      {/* <SizeSelector 
        selectedSize={ product.sizes[1]}
        availableSizes={ product.sizes }
      /> */}

      {/* Selector de calidad */}
      {/* <QuantitySelector quantity={ 2 }/> */}

      {/* Button */}
      {/* <button className="btn-primary my-5">
        Agregar al carrito
      </button> */}
      {/* ------- Se genera hoja de el lado del cliente */}

      {/* Descripcion */}
      <h3 className="font-bold text-sm">Descripcion</h3>
      <p className="font-light">
        { product.description }
      </p> 

      </div>
    </div>
  );
}

