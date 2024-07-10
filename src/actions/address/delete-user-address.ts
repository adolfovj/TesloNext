'use server'

import prisma from "@/lib/prisma";

export const deleteUserAddress = async(userId: string) => {

    try {
        // ELIMINAR
        const deleted = await prisma.userAddress.delete({
            where: { userId }
        });

        return { ok: true }

    } catch (error) {

        return {
            ok: false,
            message: 'No se pudo eliminar la dirección'
        }
    }    
}