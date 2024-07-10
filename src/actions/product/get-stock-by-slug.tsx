'use server'


import prisma from "@/lib/prisma";
// import { sleep } from "@/utils";

export const getStockBySlug = async (slug: string): Promise<number> => {

    try {
        //await sleep(3);

        const stock = await prisma.product.findFirst({
            where: { slug: slug },
            select: { inStock: true },
        });

        // if( !stock?.inStock ) return 0;
        // Retorna siempre un stock si no hay retorna cero
        return stock?.inStock ?? 0;

    } catch (error) {
        
        console.log(error);
        return 0;
    }
}