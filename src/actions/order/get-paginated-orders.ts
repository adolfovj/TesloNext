'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedOrders = async() => {

    // Aca se obitene el id del usuario
    const session = await auth();

    if( session?.user.role !== 'admin') {
        return {
            ok: false,
            message: 'Debe estar autentifcado'
        }
    }

    // Obteniendo las ordenes
    const orders = await prisma.order.findMany({
        orderBy: {
            createdAt: 'desc'
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