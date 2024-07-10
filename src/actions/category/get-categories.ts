'use server'

import prisma from '@/lib/prisma';

export const getCategories = async() => {
     
    try {
        
        return await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            }
        })

    } catch (error) {
        
        console.log(error);
        return [];
    }
}