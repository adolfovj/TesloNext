// https://tailwindcomponents.com/component/hoverable-table

export const revalidate = 0;

import { Pagination, Title } from '@/components';

import { redirect } from 'next/navigation';
//import { revalidate } from '../gender/[gender]/page';
import { UsersTable } from './ui/UsersTable';
import { getPaginatedUser } from '@/actions/user/get-paginated-users';

export default async function OrdersPage () {

  // llamar el Action Server
  const { ok, users = [] } = await getPaginatedUser();

  if( !ok ) {
    // Porque no se logro la autenticacion del usuario
    redirect('/auth/login'); 
  }

  return (
    <>
      <Title title="Mantenimiento de Usuarios" />

      <div className="mb-10">
        <UsersTable users={ users }/>

        <Pagination totalPages={ 1 } />
      </div>
    </>
  );
}