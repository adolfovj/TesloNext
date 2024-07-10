import { Footer, Sidebar, TopMenu } from "@/components";
// import { Footer, Provider, Sidebar, TopMenu } from "@/components";


export default function ShopLayout({children}: {
 children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
        {/* Nuestras paginas */}
        <TopMenu />

        {/* Enviar informacion como property para saber la sesion 
            La sesion tambien hay que manejarla en el lado del cliente
        */}
        <Sidebar />
        <div className="px-0 sm:px-7">
            { children }
        </div>
        <Footer />
    </main>
  );
}