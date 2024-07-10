'use client'

import { login, registerUser } from "@/actions"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

type FormnInputs = {
    name: string,
    email: string,
    password: string,
}

export const RegisterForm = () => {

    //const router = useRouter();

    const [errorMessage, setErrorMessage] = useState('')

    // hook useForm | Para manejar los campos del formulario
    // register | Registrar un campo
    // handleSubmit | Previene la propagacion del formulario, 
    //                evitar un refresh de la app etc
    const { register, handleSubmit, formState: { errors } } = useForm<FormnInputs>();

    const onSubmit: SubmitHandler<FormnInputs> = async(data) => {

        setErrorMessage('');

        const { name, email, password } = data;
        //console.log({ name, email, password });

        // Creandolo en nuestra BD | SERVER ACTION
        const res = await registerUser ( name, email, password );

        if ( !res.ok ) {
            setErrorMessage( res.message );
            return;
        }

        //console.log({ res });
        // Aca ya se creo el usuario | Se llama el actin
        await login(email.toLowerCase(), password);

        // Navegacion en el lado del cliente
        //router.replace('/');
        // MEJOR SE USA LA NAVEGACION TRADICIONAL
        //   PARA QUE RECARGE EL NAVEGADOR
        window.location.replace('/');
    }

    return (
        <form onSubmit={ handleSubmit( onSubmit ) } className="flex flex-col">

            <label htmlFor="name">Nombre completo</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500': errors.name
                        }
                    )
                }
                type="text" 
                autoFocus
                { ...register('name', { required: true} )} // se registra el campo
            />


            <label htmlFor="email">Correo electrónico</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500': errors.email
                        }
                    )
                }
                type="email" 
                { ...register('email', { required: true, pattern:  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ } )} // se registra el campo
            />


            <label htmlFor="password">Contraseña</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500': errors.password
                        }
                    )
                }
                type="password" 
                { ...register('password', { required: true, minLength: 6 })} // se registra el campo
            />

            <span className="text-red-500">{ errorMessage }</span>
            
            <button        
                className="btn-primary">
                Crear cuenta
            </button>


            {/* divisor l ine */ }
            <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-500"></div>
            <div className="px-2 text-gray-800">O</div>
            <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/login" 
                className="btn-secondary text-center">
                Ingresar
            </Link>
        </form>
    )
}

