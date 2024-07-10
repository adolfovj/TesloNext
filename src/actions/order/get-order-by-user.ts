'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderByUser = async() => {

    // Aca se obitene el id del usuario
    const session = await auth();

    if( !session?.user) {
        return {
            ok: false,
            message: 'Debe estar autentifcado'
        }
    }

    // Obteniendo las ordenes
    const orders = await prisma.order.findMany({
        where: {
            userId: session.user.id
        },
        include : {
            // true para todo o Select para traer lo necesario
            OrderAddress: { 
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    })

    return {
        ok: true,
        orders: orders
    }
}