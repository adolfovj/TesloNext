"use client";

import { authenticate } from "@/actions";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IoInformationOutline } from "react-icons/io5";

export const LoginForm = () => {

  const [ state, dispatch] = useFormState(authenticate, undefined);

  const router = useRouter();

  //console.log( "state: ", state );

  // Para disparar el ruteo a la pagina central cuando se hace login
  useEffect(() => {
    
    if ( state === 'Success' ) {
      // redireccionar 
      // router.replace('/');
      window.location.replace('/');  // Para refrescar del navegador WEB
    }
  }, [state]) // Cada vez que el state cambia se evalua
  

  return (
    <form action={ dispatch } className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        name="email"
      />

      <label htmlFor="email">Contraseña</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
        name="password"
      />

      {/* div mejora de aplicacion espera 2 segundo PRUEBAS */}
      <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          { state === "CredentialsSignin" && (
            <div className="flex flex-row mb-2">
              <IoInformationOutline className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">
                Las credenciales no son correctas
              </p>
            </div>
          )}
        </div>

      {/* <button type="submit"  className="btn-primary">Ingresar</button> */}
      <LoginButton />

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  );
};

// Server component para deshabilitar el boton de ingresar cuando se da clic una vez
function LoginButton() {
  const { pending } = useFormStatus();
 
  return (
    <button 
      type="submit"  
      className={ clsx({
        "btn-primary": !pending,
        "btn-disabled": pending
      })}
      disabled={ pending }
      >
        Ingresar
    </button>
  );
}
