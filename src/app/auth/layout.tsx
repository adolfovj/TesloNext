import { auth } from "@/auth.config";
import { redirect } from "next/navigation";


export default async function ShopLayout({children}: {
 children: React.ReactNode;
}) {

  // Deternminar la SESION DEL USUARIO  
  // @/auth.config Info en el lado del srvidor 
  // | Nos sirve como un middleware
  const session = await auth();

  // DATOS de la session | fechas expiracion
  //console.log({ session });

  if( session?.user ) {
    redirect('/');
  }

  return (
    <div className="flex justify-center">
      <div className="w-full sm:w-[350px] px-10">
        {/* Nuestras paginas */}
        { children }
      </div>
    </div>
  );
}