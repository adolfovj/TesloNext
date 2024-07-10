
'use client' // Hook

import { deleteUserAddress, setUserAddress } from '@/actions';
import type { Address, Country } from '@/interfaces';
import { useAddressStore } from '@/store';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form'; // Para formularios

type FormInputs = {  // Formulario de direccion
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    rememberAddress: boolean;
}

interface Props {
    countries: Country[];
    // Partial: Todas las propiedades que tiene el Address ahora son opcionales
    userStoreAddress?: Partial<Address> // Puede que venga o no
}

export const AddressForm = ({ countries, userStoreAddress = {} }: Props) => {

    // console.log( {...useAddressStore})
    const router = useRouter();

    // Hook | handleSubmit: Disparador 
    //      | register: registrar campos | ormState: { isValid }: Validar
    //      | reset: Establece el formulario a un objeto que uno se lo mando
    const { handleSubmit, register, formState: { isValid }, reset } = useForm<FormInputs>({
        defaultValues: {
            // todo: leer de la base de datos
            ...(userStoreAddress as any),
            rememberAddress: false, // Valores por defecto | 
        }
    });

    
    // OBTENER EL USER ID DE LA SESSION
    const { data: session } = useSession({
        // required: true: Si la persona no esta autenticada lo manda al
        // login personalizado que esta en el auth.config PILAS  
        required: true, 
    })
    
    // leyendo del store
    const setAddress = useAddressStore( state => state.setAddress );
    
    
    // Recargar los datos desde el LOCALSTORE
    const address = useAddressStore( state => state.address );
    
    useEffect(() => {

         if( address.firstName ) {
            reset( address );
         }
    }, [address, reset])
    
    const onSubmit = async ( data: FormInputs ) => {
        //console.log({ data });
        // Direccion que se guarda en el LOCALSTORAGE

        // remover datos de un objeto | se queita el rememberAddress
        const { rememberAddress, ...restAddress } = data;

        setAddress( restAddress );

        if ( data.rememberAddress ) {
            // Todo Server Action
            // OBTENIEIDO USERID DE LA SESSION
            await setUserAddress(restAddress, session!.user.id)
        } else {
            // Todo Server Action
            await deleteUserAddress(session!.user.id)
        }

        router.push('/checkout');
    }

    return (
        // Se convierte en un form | Sellama el evento
        <form onSubmit={ handleSubmit( onSubmit )} className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">

            <div className="flex flex-col mb-2">
                <span>Nombres</span>
                <input 
                    type="text" 
                    // Se registra los campos | se esparce el register
                    className="p-2 border rounded-md bg-gray-200" { ...register('firstName', { required: true }) }
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Apellidos</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200" { ...register('lastName', { required: true }) }
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Dirección</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200" { ...register('address', { required: true }) }
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Dirección 2 (opcional)</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200" { ...register('address2', ) }
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Código postal</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200" { ...register('postalCode', { required: true }) }
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Ciudad</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200" { ...register('city', { required: true }) }
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>País</span>
                <select 
                    className="p-2 border rounded-md bg-gray-200" { ...register('country', { required: true }) }
                >
                    <option value="">[ Seleccione ]</option>
                    {/* <option value="CRI">Colombia</option> */}
                    {
                        countries.map( country => (
                            <option key={ country.id } value={ country.id }>{ country.name }</option>
                        ))
                    }
                </select>
            </div>

            <div className="flex flex-col mb-2">
                <span>Teléfono</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200" { ...register('phone', { required: true }) }
                />
            </div>

            <div className="flex flex-col mb-2 sm:mt-1">

                <div className="inline-flex items-center mb-10">
                    <label
                        className="relative flex cursor-pointer items-center rounded-full p-3"
                        htmlFor="checkbox"
                    >
                        <input
                            type="checkbox"
                            className="border-gray-500 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                            id="checkbox"
                            { ...register('rememberAddress', ) }
                            // checked
                        />
                        <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                        >
                            <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                            ></path>
                        </svg>
                        </div>
                    </label>
                    <span>Recordar dirección ?</span>
                </div>

                <button 
                    disabled={ !isValid } // Si el formulario no es valido | se deshabilita
                    type='submit'
                    // className="btn-primary flex w-full sm:w-1/2 justify-center "
                    className={
                        clsx({
                            'btn-primary': isValid,
                            'btn-disabled': !isValid,
                        })
                    }
                    >
                    Siguiente
                </button>
            </div>
        </form>
    )
}



