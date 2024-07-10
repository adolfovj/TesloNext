

import Link from 'next/link';
import { Title } from '@/components';
import { AddressForm } from './ui/AddressForm';
import { getCountries, getUserAddres } from '@/actions';
import { countries } from '../../../../seed/seed-countries';
import { auth } from '@/auth.config';

export default async function AddressPage () {

  // Se llama la accion
  const countries = await getCountries(); 

  // Obtener la sesion del usuario
  const session = await auth();

  if( !session?.user ) {
    return (
      <h3 className='text-5xl'>500 - No hay sesión de usuario</h3>
    )
  }

  const userAddress = await getUserAddres(session.user.id) ?? undefined;

  //console.log(userAddress);

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full xl:w-[1000px] flex flex-col justify-center text-left">
        
        <Title title="Dirección" subtitle="Dirección de entrega" />
        <AddressForm countries={ countries } userStoreAddress={ userAddress } />
      </div>
    </div>
  );
}