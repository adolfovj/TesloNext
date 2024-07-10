"use client";

import { createUpdateProduct, deleteProductImage } from "@/actions";
import { ProductImage } from "@/components";
import { Category, Product, ProductImage as ProductWithImage } from "@/interfaces";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  // Se adiciona el produc un campo llamado ProductImage
  // Puede que venga puede que no | es tomado de prisma
  // pero se puede crear tambien un interace para ProductImage

  // Partial<Product> | Se acepta un producto donde todas sus propiedades pueden ser nulas
  product: Partial<Product> & { ProductImage?: ProductWithImage[] };
  categories: Category[]
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

// Objeto del formulario
interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string; // TAGS | ES UN SET DE DATOS ASI: AAA, BBB, CCC, 
  gender: 'men' | 'women' | 'kid' | 'unisex';
  categoryId: string;

  //TODO: Images
  images?: FileList; // listado de imagenes
}



export const ProductForm = ({ product, categories }: Props) => {

  // REDIRECCIONANDO | import { useRouter } from "next/navigation";
  const router = useRouter();

  // NOSOTROS LE DECIMOS EN QUE MOMENTO SE RENDERIZA EL FORMULARIO

  const {
    handleSubmit,
    register,
    formState : { isValid},
    getValues, // Estado del formulario en el momento
    setValue,  // Poner nuevo valor
    // WATCH Le dice al formulario cuando volver a renderizarlo 
    // | de acuerdo a los cambios en el formulario
    watch,     
  } = useForm<FormInputs>({
    // Valors por defecto de cada una de nuestras piezas
    defaultValues: {
      // title: 'Este es mi titulo'
      ...product,
      // tags es un string pero en otra parte tambien es un arreglo
      tags: product.tags?.join(','), // UNIR TOOS LOS TAGS como aaa, bbb, ccc
      sizes: product.sizes ?? [], // Por si los productos vienen vacios PILAS
      
      //TODO: images
      images: undefined, // necesita un valor por defecto
    },
  })

  // Se este redibujando si los sizes cambiarn
  watch( 'sizes' );

  const onSizeChanged = ( size: string ) => {

    // new Set | ES UN SET DE DATOS basados en ese arreglo
    // solo que no acepta duplicados
    // Si hay duplicados el SET los descarta
    const sizes = new Set(getValues('sizes'));

    // Si los sizes TIENE  el size actual
    // si lo tiene lo elimna SI NO lo adiciona
    sizes.has( size ) ? sizes.delete(size) : sizes.add(size);

    // Inserta un arrelo al setValue del Hook en el formulario
    setValue('sizes', Array.from( sizes ))
    console.log(sizes);
  }
  
  const onSubmit = async( data: FormInputs ) => {
  
    //console.log({ data });

    // formData: Es un objeto de JS y nos sirve para escribir
    // el objeto que queremos enviar a la Base de datos
    const formData = new FormData();

    const { images, ...productToSave } = data;

    // Si no esta el id se envia un string vacio | Se trata de comparar 
    // un objeto vacio con un uudi sale error se hace condicion 
    // si existe se adiciona si no no se adiciona
    if ( product.id ) {
      formData.append("id", product.id ?? "")
    }
    formData.append('title', productToSave.title);
    formData.append('slug', productToSave.slug);
    formData.append('description', productToSave.description);
    // Para el formState se envian solo String entonces price.toString
    formData.append('price', productToSave.price.toString() );
    formData.append('inStock', productToSave.inStock.toString() );
    formData.append('sizes', productToSave.sizes.toString() );
    formData.append('tags', productToSave.tags );
    formData.append('categoryId', productToSave.categoryId );
    formData.append('gender', productToSave.gender );


    // images 
    // console.log( images ); // se regresa son files
    if ( images ) { //Si es diferente a undefined
      for( let i = 0;  i < images.length; i++) {
        formData.append('images', images[i])
      }
    }

    const { ok, product:updateProduct } = await createUpdateProduct( formData );

    if( !ok ) {
      alert("Producto no se puedo actualizar");
      return;
    }

    // Para que no regresse a la pagina anterior
    router.replace(`/admin/product/${ updateProduct?.slug }`)

     //console.log( {ok} );
  }

  return (
    <form 
      onSubmit={ handleSubmit( onSubmit ) }
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('title', { required: true }) }/>
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('slug', { required: true }) }/>
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200" { ...register('description', { required: true }) }
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200" { ...register('price', { required: true, min: 0 }) }/>
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('tags', { required: true }) }/>
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select className="p-2 border rounded-md bg-gray-200" { ...register('gender', { required: true }) }>
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select className="p-2 border rounded-md bg-gray-200" { ...register('categoryId', { required: true }) }>
            <option value="">[Seleccione]</option>
            {
                categories.map( category => (
                    <option key={ category.id } value={ category.id }>{ category.name }</option>
                ))
            }            
          </select>
        </div>
        
        <button className="btn-primary w-full">
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200" 
          { ...register('inStock', { required: true, min: 0 }) }/>
        </div>        
        {/* As checkboxes */}
        <div className="flex flex-col">

          <span>Tallas</span>
          <div className="flex flex-wrap">
            
            {
              sizes.map( size => (
                // bg-blue-500 text-white <--- si está seleccionado
                <div 
                  key={ size } 
                  // "flex  items-center justify-center w-10 h-10 mr-2 border rounded-md"
                  onClick={ () => onSizeChanged(size) }
                  className={
                    clsx(
                      "p-2 border cursor-pointer rounded-md mr-2 mb-2 w-14 transition-all text-center",
                      {
                        // PREGUNTAR SI LA CONDICION ESTA SELECCIONADA O NO
                        // getValues: Obtiene el estado del formulario
                        // Tomamos lo sizes y preguntamos si tiene el size actual
                        'bg-blue-500 text-white': getValues('sizes').includes(size)
                      }
                    )
                  }>
                  <span>{ size }</span>
                </div>
              ))
            }

          </div>


          <div className="flex flex-col mb-2">

            <span>Fotos</span>
            <input 
              type="file"
              { ...register('images') }
              multiple 
              className="p-2 border rounded-md bg-gray-200" 
              accept="image/png, image/jpeg, image/avif" // formatos
            />

          </div>

            {/* PRODUCTO IMG */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {
              product.ProductImage?.map( img => (

                <div key={ img.id }>
                  <ProductImage
                    alt={ product.title ?? '' }
                    // src={ `/products/${ img.url }`}
                    src={ img.url }
                    width={ 300 }
                    height={ 300 }
                    className="rounded-top shadow-md"
                  />

                  <button 
                    type="button"
                    onClick={ () => deleteProductImage( img.id, img.url ) }
                    // onClick={ () => console.log( img.id, img.url )}
                    className="btn-danger  w-full rounded-b-xl">
                      Eliminar
                  </button>
                </div>
              ))
            }
          </div>

        </div>
      </div>
    </form>
  );
};