"use client"

// Se Crea el provider para envolver el objeto de sesion

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SessionProvider } from "next-auth/react"

interface Props {
    children: React.ReactNode;
}

// en el Sideber
export const Providers = ({ children }: Props )  => {

  console.log( process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '' );

  return (
    //
    <PayPalScriptProvider options={{ 
      // ClientId esta en el archivo .env
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '', 
      intent: 'capture',
      currency: 'USD',
      }}>    
      <SessionProvider>
          { children }
      </SessionProvider>
    </PayPalScriptProvider>
  )
}
