'use server'

import prisma from "@/lib/prisma"


// Para insertar la transactionId de paypal
export const setTransactionId= async( transactionId: string, orderId: string) => {

    // console.log({ transactionId });
    // console.log( orderId );

    try {
        // // Encuentre la orden | Puede ser que exista o no exista la direccion
        // La direccion ya existe tenemos que ACTUALIZAR
        const order = await prisma.order.update({
            // PILAS SI DE ERROR VERIFICAR CAMPOS | COUNTRY
            where: { id: orderId  },
            data: {
                transactionId: transactionId
            }
        });

        // Si no exist la orden
        if ( !order ) {
            return {
                ok: false,
                message: `No se encontro una orden con el id ${ orderId }`
            }             
        }

        return {
            ok: true,
        } 

    } catch (error) {
        console.log("-----------------", error);
        return {
            ok: false,
            message: 'No se pudo grabar el Id de la transaccion'
        }        
    }
}

