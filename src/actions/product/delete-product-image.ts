'use server'

import prisma from '@/lib/prisma';
// Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config( process.env.CLOUDINARY_URL ?? '' );

export const deleteProductImage = async( imageId: number, imageUrl: string) => {

    // Cuando se marca la eliminacion hay que valicar los paths
    if( !imageUrl.startsWith('http') ) {

        // Para eliminar se requere el nombre de la imagen

        return {
            ok: false,
            message: 'No se puede eliminar las imagenes de cloudinary'
        }
    }
    
    const imageName = imageUrl
        .split('/')
        .pop() // pop() | Obtiene el ulitmo pedazo de la url
        ?.split('.')[0] ?? '';

    // console.log( {imageName} );

    // El procedimineto o insercion pueden fallar
    try {
        
        await cloudinary.uploader.destroy( imageName );
        const deletedImage = await prisma.productImage.delete({
            where: {
                id: imageId
            },
            // Se obtiene solamente el slug
            select: {
                product: {
                    select: {
                        slug: true
                    }
                }
            }
        });

        // REVALIDAR LOS PATHS | pilas | Actualizar desde el SERVER
        revalidatePath(`/admin/products`)
        revalidatePath(`/admin/products/${ deletedImage.product.slug }`)
        revalidatePath(`/products/${ deletedImage.product.slug }`)

    } catch (error) {
        console.log( error );
        return {
            ok: false,
            message: 'No se pudo eliminar la imagen'
        }
    }
}