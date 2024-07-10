import type { Metadata } from "next";

import "./globals.css";
import { inter } from "@/config/fonts";
import { Providers } from "@/components";

// SEO - METADATA
export const metadata: Metadata = {
  title: {
    //%s para lo que esta en el titulo de las otras paginas se ponga aca
    // Todas las paginas tendran el Teslo | shop
    template: "%s - Teslo | shop",
    default: 'Home Teslo | shop"'
  },
  description: "Tienda virtual",
};
// SEO - METADATA

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          {/* SE ENVUELVE EL CHILDREN EN EL PROVIDER PARA EL MANEJO DE LA SESION 
              haciendl el provider de esta manera se le dice al contexto que ya tiene 
              el provider.
              CON EL COMPONENTE DEL PROVIDER SE PUEDE PONER EL CONTEXT PROVIDER
               SI SE TRABAJA EN CONTEXT API ETC. PILAS!!! ESO ES SI SE QUIERE
          */}
        <Providers>
          { children }
        </Providers>
      </body>
    </html>
  );
}
