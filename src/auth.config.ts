
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';
 
const authenticatedRoutes = [
    '/checkout/address'
]

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account',
    },

    // Se define callback para tener mas info en la sesion o jwt
    callbacks: {

        // Se puso para cuando se usa MIDDLEWARE
        // auth | info autenticacion
        authorized({ auth, request: { nextUrl } }) {

            
            const isLoggedIn = !!auth?.user;
            //console.log({ auth });

            // Si estamos en la ruta x
            //const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnDashboard = authenticatedRoutes.includes(nextUrl.pathname)

            if (isOnDashboard) {
                 if (isLoggedIn) return true;
                    return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                    Response.redirect(new URL('/', nextUrl));
                    return true; //Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },

        jwt ({ token, user }) {

            //console.log({ token, user });
            if ( user ) {
                token.data = user;
            }
             return token
        },

        session({ session, token, user }) {

            // user | Es el objeto rest este se va a pasar al token
            // En el token va aparecer como data
            session.user = token.data as any;
            
            //console.log({ session, token, user });
            return session
        }
    },

    providers: [
        credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                // Se aseguro el EMAIL Y EL PASS DE 6 LETRAS
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);
                
                if( !parsedCredentials.success ) return null;

                
                const { email, password } = parsedCredentials.data;
                                
                //---- buscar el correo 
                const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() }});

                if( !user ) return null;

                //----  comparar contresena
                // pass que se recibe y pass BD | Si no hay match
                if ( !bcryptjs.compareSync( password, user.password ) ) return null;                            

                //---- Si todo es correcto Regresa el usuario
                // imagen | Roles
                // Obejto authorize debe de regresar algo | Para no mandar el PASSWORD
                // PARA QUE NO VIAJE POR EL HTTP EL PASSWORD PILAS
                //      password sea reconocido como un guion bajo
                const { password: _, ...rest } = user;

                //console.log( " ---- Autenticado: ", { rest });

                return rest; 
            },
          }),

    ]
};

// Se exporta lo SIGUIENTE PILAS
// signIn, signOutn, middleware
// handlers | Tiene los metodos GET Y POST Para realizar las 
//    peticiones del http que el SESSION PROVIDER esta buscando
export const  { auth, signIn, signOut, handlers } = NextAuth( authConfig )