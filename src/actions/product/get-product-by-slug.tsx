import prisma from "@/lib/prisma";

export const getProductBySlug = async (slug: string) => {

    try {
        
        const product = await prisma.product.findFirst({
            include: {
                // Incluye la tabla ProductImage
                // Se selecciona todo el producto
                ProductImage: true
                // {
                //     select: {
                //         url: true,
                //         id: true // Obtener el id de la imagen
                //     }
                // }
            },
            where: {
                slug: slug,
            }
        });

        if( !product ) return null;

        return {
            ...product,
            images: product.ProductImage.map( img => img.url )
        }

    } catch (error) {
        
        console.log(error);
        throw new Error('Error al obtener producto por slug');
    }
}