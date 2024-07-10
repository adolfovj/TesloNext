'use server'

import prisma from '@/lib/prisma';
import { Gender, Product, Size } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod'; 

// Cloudinary
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL ?? '' )


// Esquema de validacion se usa ZOD
// Tambien nos sirve para evitar hacer expresiones regulares
const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    // coerce | PARA LA CONVERSION STRING A NUMBER
    price: z.coerce
        .number()
        .min(0)
        .transform( val => Number(val.toFixed(2))),
    // LO MISMO PER SIN DECIMALES
    inStock : z.coerce
        .number()
        .min(0)
        .transform( val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    // Se corta por coma
    sizes: z.coerce.string().transform( val => val.split(',')),
    tags: z.string(),
    // Es una enumeracion | nativeEnum: Valida que sea uno de la lista de gener
    // Se toma de prisma PERO tambien se puede crear la enumeracion
    gender: z.nativeEnum(Gender) 
})

export const createUpdateProduct = async( formData: FormData ) => {

    // console.log( formData ); // Toda la info del formulario

    // Se obtiene la data del FORMDATA
    const data = Object.fromEntries( formData );
    
    // Llamando al esquema de validacion
    const productParsed = productSchema.safeParse( data );

    // Si no es correcto
    if( !productParsed.success ) {
        console.log( productParsed.error );
        return { ok: false }
    } 

    // | Inicio === TRANSACCTION 
    // Obtener la data
    const product = productParsed.data;

    // Obtener el id
    const { id, ...rest } = product
    
    // Reemplazar espacios en blaco | Si hay se convierte en un guion
    product.slug = product.slug.toLocaleLowerCase().replace(/ /g, '-').trim();

    try {
        
        const primaTx = await prisma.$transaction( async (tx) => {
    
            let productT: Product;
            // Garantizar que no halla espacios
            const tagsArray = rest.tags.split(',').map( 
                tag => tag.trim().toLocaleLowerCase()
            );
    
            if( id ) {
                // Actualizar Si hay Id
                productT = await prisma.product.update({
                    where: {
                        id: id
                    },
                    // Informacion que quiero actualizar
                    data: {
                        ...rest, 
                        // sizes TIENEN que ser un SET DE DATOS
                        sizes: {
                            set: rest.sizes as Size[],
                        },
                        // Tambien es un set de datos
                        tags: {
                            set: tagsArray
                        },
                    }
                });
    
                //console.log({ updateProduct: productT })
    
            } else {
                // Crear 
                productT = await prisma.product.create({
                    data: {
                        ...rest, // se excluye el id
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
            }
    
            // IMAGENES Proceso de carga y guardado de imagenes
            // Recorrer las imagenes y guardarlas         
            if( formData.getAll('images'))  { // Obtiene todas las imagenes
                // console.log( formData.getAll('images') );

                // https://url.jpg
                // Se manda las imagenes
                const images = await uploadImages(formData.getAll('images') as File[]);
                // console.log({ images });

                // En caso de NO CARGAR LAS IMAGENES
                // SI SE LANZA UN ERROR EN LA TRANSACCION TODO SE HACE UN ROLLBACK
                if( !images ) {
                    throw new Error('No se pudo cargar las imágenes, rollingback')
                }

                // SI HAY IMAGENES HAY QUE ACTUALIZAR
                await prisma.productImage.createMany({
                    data: images.map( img => ({
                        url: img!,
                        // productT.id | Siempre se obtiene un id
                        productId: productT.id,
                    }))
                })
            }

            //console.log({ productT })
            return {
                productT
            }
        });

        // TODO: Si todo sale bien | Revalidar PATHs
        // Hay que revalidar varios path para que esten las pantallas actualizadas
        revalidatePath('/admin/products');
        revalidatePath(`/admin/products/${ product.slug }`);
        revalidatePath(`/products/${ product.slug }`);

        return {
            ok: true,
            product: primaTx.productT
        }

    } catch (error) {
        
        return {
            ok: false,
            message: 'Revisar los logs, no se pudo actualizar/crear'
        }
    }

    // | Fin === TRANSACCTION 
}

// --- Images
const uploadImages = async(images: File[]) => {

    try {
        
        const uploadPromises = images.map( async( image ) => {

            try {
                
                // Leer imagen
                const buffer = await image.arrayBuffer();
                // Convierte la imagen en un string para subirla a Cloudinary
                const base64Image = Buffer.from(buffer).toString('base64');
    
                // secure_url | url de la imagen
                return cloudinary.uploader.upload(`data:image/png;base64,${ base64Image }`)
                    .then( r => r.secure_url ); 

            } catch (error) {                
                console.log(error);
                return null;                        
            }
        });

        const uploadedImages = await Promise.all( uploadPromises );
        return uploadedImages;

    } catch (error) {
        
        console.log(error);
        return null;
    }
}
