'use server'

import { auth } from "@/auth.config"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// id del usuario y nuevo role
export const changeUserRole = async ( userId: string, role: string) => {

    console.log('--- userId: ', userId)
    console.log('--- role: ', role)

    //------ Se puede crear una funcion para manejar este pedaczo
    const session = await auth();

    if( session?.user.role !== 'admin') {

        return {
            ok: false,
            message: 'Debe de estar autenticado como admin'
        }
    }
    //------    
    try {
        
        // NADA MAS CON 2 ROLES | NO SE NE ME GUSTA MUCHO
        const newRole = role === 'admin' ? 'admin' : 'user'

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            // Actualizacion
            data: {
                role: newRole
            }
        });

        // Actualizacio o revaliadcion para mirar el cambio en Pantalla
        revalidatePath('/admin/users');
        return {
            ok: true,
        };

    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se pudo actualzar el role, revisar logs'
        }
    } 

}