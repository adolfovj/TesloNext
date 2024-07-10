'use client'

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { CreateOrderData, CreateOrderActions,OnApproveData, OnApproveActions } from "@paypal/paypal-js"
import { setTransactionId } from "@/actions/payments/set-transaction-id";
import { paypalCheckPayment } from "@/actions";

interface Props {
    orderId: string;
    amount: number;
}

export const PayPalButton = ({ amount, orderId }: Props) => {

    const [{ isPending }] = usePayPalScriptReducer();

    // Se obtiene el numero con 2 decimales
    const rountedAmount = Math.round(amount * 100 / 100); 

    if( isPending ) {

        return (
            <div  className="animate=pulse mb-16">
                <div className="h11 bg-gray-300 rounded"/>
                <div className="h11 bg-gray-300 rounded mt-2"/>
            </div>
        )
    }

    // Creacion orden en Paypal
    // El objetivo es generar ese identificador de PAYPAL
    // Esta transaccion que se genera se guarda en Base de datos
    // Paypal pide que la cantidad sea un string
    const createOrder = async(data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {

        const transactionId = await actions.order.create({
            intent: 'CAPTURE',

            purchase_units: [
                {
                    // SE PONE EL ORDER ID A PAYPAL | SE PONE AL FINAL 
                    // DE LA CODIFICACION PARA NO TENER PROBLEMAS AL INICIO CUANDO SE CREA
                    invoice_id: orderId,
                    amount: {
                        value: rountedAmount.toString(),
                        currency_code: 'USD',
                    }
                }
            ]
        });

        // console.log({ transactionId })
        // Todo: Guardar el Id en la orden de la base de datos
        const { ok } = await setTransactionId( transactionId, orderId)
        if ( !ok ) {
            throw new Error('No se actualizo la orden');
        }

        // Si todo sale bien llamamos a paypal
        return transactionId;
    }

    const onApprove = async(data: OnApproveData, actions: OnApproveActions) => {

        console.log('onApprove');

        // Se puede hacer varias cosas una ellas es la captura de la orden
        const details = await actions.order?.capture();
        if ( !details ) return;

        // Server Action para verificar el campo | se verifica el transacction Id = details.id
        // Se verifica el pago desde el servidor | ydespues se verifica en paypal
        await paypalCheckPayment( details.id! );
    }

    return (
        // para que el boton quede atras className="relative z-0"
        <div className="relative z-0"> 
            {/* // Click en cualquier boton genera una orden de paypal 
            // Los botones de paypal llaman a un callback
            //          create | onApprove */}
            <PayPalButtons 
                // Antes de generar la orden en paypal se crea
                // Anadimos nuestro identificador unico en la cracion 
                // El string es el orderId
                createOrder={ createOrder }    
                // Cuando se realiza el proceso en el lado de paypal
                // Cuando termina el flujo exitosamente
                onApprove={ onApprove }         
            />
        </div>
    )
}

