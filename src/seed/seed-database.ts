
import prisma from '../lib/prisma';
import { initialData } from './seed';
// import { Category } from '../interfaces/product.interface';
import { countries } from './seed-countries';

async function main () {

    //await Promise.all([
        
    // --- 1. Borrando registros previos
    await prisma.orderAddress.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany(); 

    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany(); 
    //]);

    // --- 2. Insertando categorias
    // Crear una categoria
    // await prisma.category.create({
    //     data: {
    //         name: 'Shirts',
    //     }
    // })
    // Crear todas las categorias | Se quiere convertir a este objeto
    // {
    //     name: 'Shirt'
    // }
    const { categories, products, users } = initialData;

    await prisma.user.createMany({
        data: users
    })

    const categoriesData = categories.map( category => ({
        name: category
    }));

    await prisma.category.createMany({
        data: categoriesData // Arreglo de elementos
    });

    // --- 3. Insertar Relacion | Prodcutos - Categoria 
    // Obteniendo la categoria de la BD
    const categoriesDB = await prisma.category.findMany();

    // retornando el id
    // reduce similar a un foreach pero va acumulando los cambios | Callback
    // Devuelve un mapa
    const categoriesMap = categoriesDB.reduce( (map, category) => {
        map[ category.name.toLowerCase() ] = category.id;
        return map;
    }, {} as Record<string, string>); // <label del product, categoria Id del prodycto></label>
    // console.log(categoriesMap);

    // --- 4. Prodcutos | Insertar productos 
    // | Se desestructura evitar problemas con images, type
    const { images, type, ...product1 } = products[0];

    // Para un producto
    // await prisma.product.create({
    //     data: { 
    //         ...product1, 
    //         categoryId: categoriesMap['shirts'] }
    // })

    // Para varios productos
    products.forEach( async(product)=> {

        const { type, images, ...rest } = product;

        const dbProduct = await prisma.product.create({
            data: {
                ...rest, 
                categoryId: categoriesMap[type]
            }
        })

        // --- 5. Insertando el Product Image
        // A que producto corresponde a la imagen
        const imagesData = images.map( image => ({
            url: image,
            productId: dbProduct.id
        }))

        await prisma.productImage.createMany({
            data: imagesData
        })

    })

    // --- 6. Insertando paises
    await prisma.country.createMany({
        data: countries // Arreglo de elementos
    });    

    console.log("Seed ejecutado correctamente");
}




// funcion auto-invocada
(() => {

    // Para evitar que se ejecute en produccion
    if( process.env.NODE_ENV === 'production') return;

    main()
})();