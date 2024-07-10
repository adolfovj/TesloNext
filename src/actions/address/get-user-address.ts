'use server'

import prisma from "@/lib/prisma"

export const getUserAddres = async ( userId: string ) => {

    try {
        
        const address = await prisma.userAddress.findUnique({
            where: { userId }
        })

        // Si no hay direccion regresamos un null
        if( !address ) return null;

        // correccion
        const { countryId, address2, ...rest } = address;

        return {
            ...rest,
            country: countryId, // correcion
            address2: address2 ? address2 : '', // correcion
            city: 'hola' // correccion
        }

    } catch (error) {
        console.log('----', error);
        return null
    }
}