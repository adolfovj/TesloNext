'use client'

import Link from "next/link"
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"

import { useUIStore } from "@/store"
import { clsx } from "clsx"
import { logout } from "@/actions"
import { useSession } from "next-auth/react"

export const Sidebar = () => {

    // llama al store
    // Del state tome el isSideMenuOpen
    // No hay que envolver esto en un wrap, context, ni utilizar provider
    // No hay que hacer nada
    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
    const closeMenu = useUIStore(state => state.closeSideMenu);
    
    // useSession HOOK de react
    // se obtiene la data y se le da el nombre de sesion    
    // use Session utiliza este fetch
    // ClientFetchError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
    // at fetchData y hay que crearlo para poder VERIFICARLO 
    // SE CREA EN src/app/api/auth/[...nextauth]/route.ts
    const { data: session } = useSession();

    // Se verifica | Si hay usuario tiene valor true si no false
    const isAuthenticated = !!session?.user;
    const isAdmin = (session?.user.role === "admin");
    //console.log( {isAdmin });

    // LA SESION HAY QUE ENVOLVERLA EN UN SESION PROVIDER
    // SE ENVUELVE EN EL LAYOUT VER LAYOUT DEl ROOT
     //console.log({ session });

    // actualizacion sidebar
    const onLogout = async () => {
        await logout();
        window.location.replace('/')
      }

    return (
        <div>
        {/* background black   */}
        {   // Si el menu esta abierto
            isSideMenuOpen && (                
                <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
            )
        }

        {/* blue */}
        {/* backdrop-filter backdrop-blur Para verse COMO BORROSO*/}
        {   // Si el menu esta abierto	
            isSideMenuOpen && (
                <div 
                    onClick={ closeMenu } 
                    className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"/>                
            )            
        }

        {/* Sidemenu */}
        <nav className={
            clsx(
                "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                {
                    // si el menu no esta abierto se adiciona la clase
                    "translate-x-full": !isSideMenuOpen 
                }
            )
         }>
            {/* Click de el lado del ciente por eso es un use client */}
            <IoCloseOutline 
                size={ 50 }
                className="absolute top-5 right-5 cursor-pointer"
                onClick={ closeMenu }
            />

            {/* Input search*/}
            <div className="relative mt-14">
                <IoSearchOutline size={ 20 } className="absolute top-2 left-2" />
                <input 
                    type="text" 
                    placeholder="Buscar"
                    className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Opciones del menu */}
            {
                isAuthenticated && (
                    <>
                        <Link 
                            href="/profile"
                            onClick={ () => closeMenu() } 
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
                            <IoPersonOutline size={ 30 }/>
                            <span className="ml-3 text-xl">Perfil</span>              
                        </Link>
            
                        <Link 
                            href="/orders"
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
                            <IoTicketOutline size={ 30 }/>
                            <span className="ml-3 text-xl">Ordenes</span>
                        </Link>                    
                    </>
                )
            }

            {/* Mostrar menu */}
            {
                isAuthenticated && (
                    <button 
                        className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        onClick={ () => { onLogout(), closeMenu()} }
                        >
                        <IoLogOutOutline size={ 30 }/>
                        <span className="ml-3 text-xl">Salir</span>
                    </button>
                )
            }

            {
                !isAuthenticated && (
                    <Link 
                        href="/auth/login"
                        onClick={ () => closeMenu() } 
                        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                    >
                        <IoLogInOutline size={ 30 }/>
                        <span className="ml-3 text-xl">Ingresar</span>
                    </Link>
                )
            }

            {/* Line Separator | ADMIN */}
            {
                isAdmin && (
                    <>
                    <div className="w-full h-px bg-gray-200 my-10">
                        <Link 
                            href="/admin/products"
                            onClick={ () => closeMenu() }
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoShirtOutline size={ 30 }/>
                            <span className="ml-3 text-xl">Productos</span>
                        </Link>

                        <Link 
                            href="/admin/orders"
                            onClick={ () => closeMenu() }
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoTicketOutline size={ 30 }/>
                            <span className="ml-3 text-xl">Ordenes</span>
                        </Link>

                        <Link 
                            href="/admin/users"
                            onClick={ () => closeMenu() }
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoPeopleOutline size={ 30 }/>
                            <span className="ml-3 text-xl">Usuarios</span>
                        </Link>
                    </div>                    
                    </>
                )
            }
        </nav>      
        </div>
    )
}


