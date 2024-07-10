import { auth } from "@/auth.config";
import { redirect } from "next/navigation";


export default async function CheckoutLayout({
 children }: { children: React.ReactNode;})
{

    // Obteniendo sesion del usuario
    // const session = await auth();

    // if( !session?.user ) {
    //     // RETORNA A LA PAGINA DEL PERFIL
    //     // redirect('/auth/login?returnTo=/perfil');
    //     redirect('/auth/login?reditectTo=/checkout/address'); // Regresa never
    // }

    return (
        <>
        { children }
        </>
    );
}