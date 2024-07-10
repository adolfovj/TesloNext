'use server'

import { signIn } from '@/auth.config';
import { sleep } from '@/utils';
import { AuthError } from 'next-auth';
import type { CartProduct } from '@/interfaces';
import { redirect } from 'next/navigation';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {

    // Esperar 2 segundos RELENTIZAR APP PARA PRUEBAS
    //await sleep(2);

    // aca se ponde Google, Github o lo aque sea
    //console.log( Object.fromEntries(formData))
    // Carga el navegador con las credenciales

    await signIn('credentials', 
      {
        ...Object.fromEntries(formData),
        redirect: false,
      },
    );

    return 'Success';

  } catch (error) {

    // if (( error as any ).type === 'CredentialsSignin') {
    //   return 'CredentialSingIn'
    // };
    
    console.log(error);
    return 'CredentialsSignin'
    //return "UnknownError" 

    // if (error instanceof AuthError) {
      
    //   switch (error.type) {
    //     case 'CredentialsSignin':
    //       return 'Invalid credentials.';
    //     default:
    //       return 'Something went wrong.';
    //   }
    // }
    //throw error;
  }
}

// Otro server Action
export const login = async (email: string, password: string) => {

  try {
    
    await signIn('credentials', { email, password })
    return { ok: true };

  } catch (error) {
    
    console.log( error );
    return {
      ok: false,
      message: 'No se pudo iniciar session'
    }
  }
}