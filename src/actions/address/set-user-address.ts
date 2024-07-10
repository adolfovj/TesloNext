'use server'

import { Address } from "@/interfaces"
import prisma from "@/lib/prisma"


// Para insertar Addres y userId
export const setUserAddress = async( address: Address, userId: string) => {

    try {
        // CREAR
        const newAddress = await createOrReplaceAddress( address, userId );
        return {
            ok: false,
            address: newAddress,
        }

    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo grabar la dirección'
        }
    }
}

const createOrReplaceAddress = async( address: Address, userId: string) => {

    try {
        // Encuentre la direccion | Puede ser que exista o no exista la direccion
        const storeAddress = await prisma.userAddress.findUnique({
            where: { userId }
        });

        const addressToSave = { 
            userId: userId,
            address: address.address,
            address2: address.address2,
            countryId: address.country,
            city:   address.city,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            postalCode: address.postalCode,
        }
        
        // La direccion NO existe tenemos que CREAR
        if ( !storeAddress ) {
            const newAddress = await prisma.userAddress.create({
                // PILAS SI DE ERROR VERIFICAR CAMPOS | COUNTRY
                data: addressToSave,
            });

            return newAddress;
        }

        // La direccion ya existe tenemos que ACTUALIZAR
        const updateAddress = await prisma.userAddress.update({
            // PILAS SI DE ERROR VERIFICAR CAMPOS | COUNTRY
            where: { userId },
            data: addressToSave
        });

        return updateAddress;

    } catch (error) {
        console.log("-----------------", error);
        return {
            ok: false,
            message: 'No se pudo grabar la dirección'
        }        
    }
}