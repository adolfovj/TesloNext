'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

  // Tener en cuenta puede que el id no exista
  // Puede que el id no sea del usuario. Solo lo puede ver el usuario y al admin

export const getOrderById = async( id: string ) => {

  const session = await auth();

  // Si no hay session del usuario se sale
  if ( !session?.user ) {
    return {
      ok: false,
      message: 'Debe de estar autenticado'
    }
  }

  try {
    
    // Obtener la orden por el id de la orden
    const order = await prisma.order.findUnique({
      where: { id },
      include: { // Para obtener la direccion | OrderItem | Product | ProductImage
        OrderAddress: true, // En true: Manda todo el objeto de address
        OrderItem: {        // Se obtiene tambien la tabla de 
          select: {
            price: true,    // Solo tenemos esa columna
            quantity: true,
            size: true,

            product: {      // Producto
              select: {
                title: true,
                slug: true, // Para hacer clic cuando se vea la imagen

                ProductImage: {
                  select: {
                    url: true
                  },
                  take: 1 // Toma una imagen
                }
              }
            }
          }
        }
      }
    });

    if( !order ) throw `${ id } no existe`;

    // Para verificar si la orden pertenece a ese usuario especifico!!
    if ( session.user.role === 'user' ) {
      if ( session.user.id !== order.userId ) {
        throw `${ id } no es de ese usuario`
      }
    }

    return {
      ok: true,
      order: order,
    }

  } catch (error) {

    console.log(error);

    return {
      ok: false,
      message: 'Orden no existe'
    }
  }
}