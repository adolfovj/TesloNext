'use server'

import { auth } from '@/auth.config';
import { Size, Address } from '@/interfaces';
import prisma from '@/lib/prisma';

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export const placeOrder = async ( productsIds: ProductToOrder[], address: Address) => {

    // 1. VERIFICAR SESION USUARIO Session obtener userId
    const session = await auth();
    const userId = session?.user.id;

    if( !userId ) {
        return {
            ok: false,
            message: 'No hay session de usuairo'
        }
    }

    //console.log({ productsIds, address, userId });
    //console.log( productsIds.map( p => p.productId)  );

    // 2. OBTENER INFORMACION DE LOS PRODUCTOS
    // NOTA: Recuerde podemos llevar 2 o mas productos con el mismo ID
    // --- Se busca todos los productos cuyo Id exista en el arreglo de productsIds
    // VERIFICAR QUE PERSONA TOMA PRIMERO EL PRODUCTO EN EL STOCK MAS ADELANTE
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productsIds.map( p => p.productId) 
            }
        }
    });

    // 3. CALCULAR EL TOTAL DE ELEMENTOS
    const itemInOrder = productsIds.reduce( (count, product) => count + product.quantity,0);

    // 4. Los totales de TAX, SUBTOTAL Y TOTAL
    const { subTotal, tax, total } = productsIds.reduce( (totals, item) => {
        
        const productQuantity = item.quantity;
        const product = products.find( product => product.id === item.productId )

        if (!product ) throw new Error (`${ item.productId } no existe - 500`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.19; // VARIABLE DE ENTORNO PARA EL IMPUESTO
        totals.total += (subTotal * 0.19) + subTotal;
        
        return totals;  
    }, { subTotal: 0, tax: 0, total: 0});

    console.log( subTotal, tax, total );

    //  5. CREAR LA TRANSACCION A LA BASE DE DATOS
    //  Se requiere grabar en varias tablas y todas deben quedar BIEN
    //  DISMINUIR EXISTENCIA DEL STOCK | PRECAUCION NUMERO NEGATIVO
    // TODO ESTA EN TX PILAS

    try {
        const prismaTx = await prisma.$transaction( async(tx) =>{

            // 1. Actualizar el stock de los productos
            // Se crea un arreglo de promesas | Se va actualizas los productos que allan
            // product: SE ACUMULA LOS PRODUCTOS EN LA ORDEN
            const updatedProductsPromises = products.map( (product) => {
    
                // Acumular los valores
                // se obtiene la cantidad del producto por el id
                const productQuantity = productsIds.filter(
                    p => p.productId === product.id
                ).reduce( (acc,item) => item.quantity + acc, 0);
    
                // Si alguien manipulo la cantidad a cero
                if ( productQuantity === 0) {
                    throw new Error (`${ product.id } no tiene cantidad definida`);
                }
    
                // Retorna un arreglo de promesas o de transaccion en este caso
                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        // Puede ser que en un punto en el tiempo 2 personas compran 
                        // al mimo tiempo esto no se debe hacer:
                        //inStock: product.inStock - productQuantity
    
                        // Se actualiza in Stock de acuerdo al valor actual de la transaccion
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                });
            });
    
            // SE OBTIENE LOS VALORES COMO VAN A QUEDAR DESPUES DE LA MODIFICACION
            const updatedProducts = await Promise.all( updatedProductsPromises );
    
            // SE VERIFICA SI ALGUN PRODUCTO TIENE UN VALOR NEGATIVO
            //  EN LA EXISTENCIA = NO HAY STOCK
            //  APENAS ENCUENTRE UNO SIN EXISTENCIAS SE SALE
            updatedProducts.forEach( product => {
                if ( product.inStock < 0 ) {
                    throw new Error(`${ product.title } No tiene inventario suficiente`);
                }
            })
        
    
            // 2. Crear la orden - Encabezado | Detalle
            const order = await tx.order.create({
                // La data necesita informacion
                // isPaid por defecto esta false | schmea de prisma
                data: {
                    userId: userId,             // se obtiene de arriba
                    itemsInOrder: itemInOrder,  // Se calucla en el reduce 
                    subTotal: subTotal,
                    tax: tax,
                    total: total,
    
                    // Items que quiere insertar  en detalle
                    OrderItem: {
                        createMany: {
                            data: productsIds.map( p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                // De este objeto me interesa el price
                                price: products.find( product => product.id === p.productId)?.price
                                // Si no se encuentra  el price | Pero no creo que llegue a pasar
                                    ?? 0
                            }))
                        }
                    }
                }
            });
    
            // SI EL PRICE ES CERO LANZAR UN ERROR | LA TRANSACCION SE REVIERTE SI SE LANZA UN ERROR
    
            // 3. Crear la direccion de la orden | Pais hay que insertar una relacion country Id 
            //console.log({ address })
            const { country, ...restAddress } = address; // Se separa el country del objeto address
            const orderAddress = await tx.orderAddress.create({
                // La data necesita informacion
                data: {
                    firstName: restAddress.firstName,             // se obtiene de arriba
                    lastName: restAddress.lastName, 
                    address: restAddress.address,
                    address2: restAddress.address2,
                    postalCode: restAddress.postalCode,
                    city: restAddress.city,
                    phone: restAddress.phone,
                    //...restAddress,     // Se desestrucutra de address
                    orderId: order.id,
                    countryId: country, // country
                }
            });
    
    
            // Si todo sale bien se retorna lo necesario
            return {
                updateProducts: updatedProducts,
                order: order,
                orderAddress: orderAddress,
            }
    
        });   
        
        return {
            ok: true,
            order: prismaTx.order,
            // Contiene la transaccion de todas las modificaciones hechas
            prismaTx: prismaTx, 
        }        

    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
        }
    }
    
}