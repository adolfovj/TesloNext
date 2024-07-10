'use server'

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async( paypalTransactionId: string ) => {

    // console.log({ paypalTransactionId });
    const authToken = await getPayPalBearerToken();

    // console.log('==============', {authToken} );
    if( !authToken ) {
        return {
            ok: false,
            message: 'No se pudo obtener el token de verificacion'
        }
    }

    const resp = await verifyPayPalPayment( paypalTransactionId, authToken );
    if( !resp ) {
        return {
            ok: false,
            message: 'Error de verificar el pago'
        }
    }

    const { status, purchase_units } = resp;

    // YA PODEMOS OBTENER EL ORDERID = invoice_id
    const { invoice_id: orderId } = purchase_units[0]; // invoide Id

    if( status !== 'COMPLETED') {
        return {
            ok: false,
            message: 'Aún no se ha pagado en Paypal'
        }
    }

    // TODO Realizar la actualizacion en nuestra base de datos
    try {
        console.log({ status, purchase_units });

        await prisma.order.update({
            where: { id: orderId }, // Se envia la orden
            data: {
                isPaid: true,
                paidAt: new Date()
            }
        })

        // TODO revalidar un path | Asegurarnos de que next refresa todo
        revalidatePath(`/orders/${ orderId }`);

        return {
            ok: true,
        }

        // lo respectivo para que este componente se vuelva a construir
        // Y verifidar en la base de datos si esta pagado o no
        
    } catch (error) {
        return {
            ok: false,
            message: '500 - El pago no se pudo realizar'
        }
    }

}

// OBTENER TOKEN DE ACCESO
const getPayPalBearerToken = async (): Promise<string | null> => {

    // Obteniedo las llaves de paypal
    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAY_SECRET;
    const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? '';

    // CONVIRTIENDO TRANSFORMANDO A BASE 64
    const base64Token = Buffer.from(
        `${ PAYPAL_CLIENT_ID }:${ PAYPAL_SECRET }`,
        'utf-8'
    ).toString('base64');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append(
        "Authorization", 
        // Hay que generar el string en base 64 para enviarlo a paypal
        //"Basic QVZLcnZoSzRSMmI0UmhXdmkwbDkxdGRZZGhIQU1RM3pLQ1p6R1d3SG9jZFI4VzU4NXBUSUViLVVqbTZ3QnU1VjZiT01qd0xtVzd4eTFKSno6RU8yWS03OVIzdXgyR3NjZzVnTUI5a3M3Vy01V0QxVkF0X0hzWFJxZVl6NEZwRFRaXzdRRjFmNldvS2FHY3JGVHlLa0RKQ2VxLXVEaDZ6S3Y="
        `Basic ${ base64Token }`,
    );
    
    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded, 
      // Quitamo el redirect
    };
    
    // Hacemos el endpoint
    try {
        const result = await fetch(
            oauth2Url, 
            // PARA BORRAR EN CACHE | cache: 'no-store'
            { ...requestOptions, cache: 'no-store'}).then(r => r.json());
        return result.access_token;

    } catch (error) {
        console.log( error );
        return null;
    }

    // fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", requestOptions)
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.error(error));    
}


// VERIFICAR EL PAGO
// Se necesita el orderId y el token de acceso
const verifyPayPalPayment = async ( paypalTransactionId: string, bearerToken: string )
    : Promise<PayPalOrderStatusResponse|null> => {

    // Se arma la URL PARA VERIFICAR EL PAGO
    const paypalOrderUrl = `${ process.env.PAYPAL_ORDERS_URL }/${ paypalTransactionId }`

    const myHeaders = new Headers();
    myHeaders.append(
        "Authorization", 
        // "Bearer A21AALQQs-DknirkNIHVWPH9SJ-jbtnBGqDJbq0p8QlA3967Sa4uscrpf3YRllBMkZKxGAPDHpUKoWXtist7QDZBdAM7ha_Ww"
        `Bearer ${ bearerToken }`
    );
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    //   redirect: "follow"
    };
    
    try {
        
       const resp = await  fetch(
             paypalOrderUrl,
             // PARA BORRAR EN CACHE | cache: 'no-store'
             { ...requestOptions, cache: 'no-store'}).then(r => r.json());
       return resp;
    } catch (error) {
        console.log(error)
        return null;
    }

    // fetch( paypalTransactionId, requestOptions)
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.error(error));    
}