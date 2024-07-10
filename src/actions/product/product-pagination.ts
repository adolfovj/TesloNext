
import prisma from "@/lib/prisma";
import { Gender } from '@prisma/client';

interface PaginationOptions {
    page?: number;  
    take?: number; // Cuantos productos
    gender?: Gender 
  }

export const getPaginaterProductsWhitImages = async({
    page = 1,  // valor por defecto pueden que no sean numeros
    take = 12,
    gender,
  }: PaginationOptions) =>{

    // Validacion x si page no es un numero
    // Si isNaN Not number
    // Se trasforma a numero Number(page)
    // Page igual a 1
    if( isNaN( Number(page)) ) page = 1;
    // Si la pagina es < 1
    if( page < 1 ) page = 1;

    try {
        
        // 1. Obtener los productos
        const products = await prisma.product.findMany({
            include: {
                ProductImage: {
                  take: 2, // solo tomar 2 imagenes
                  select: {
                    url: true
                  },
                },
              },
              skip: ( page - 1 ) * take,
              take: take,
            
              //! Por género
              where: {
                gender: gender
              }           
        })

        // 2. Obtener el total de paginas
        // Conteo de todos los PRODUCTOS
        // TODO:
        const totalCount = await prisma.product.count({
            // Para que haga conteo de los articulos
            where: {
                gender: gender
              } 
        });
        const totalPages = Math.ceil( totalCount / take );

        // Se organiza el objeto para que haga match con el otro objeto
        return {
            currentPage: page,
            totalPages: totalPages,
            products: products.map( product => ({
                ...product,
                images: product.ProductImage.map( image => image.url )
            }))
        }

    } catch (error) {
      console.log( error );
        throw new Error("No se cargaron los objetos");
    }
}