
// PRODUCTO INDIVIDUAL

import { getCategories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";

interface Props {
    params: {
        slug: string;
    }
}

export default async function ProductPage( { params }: Props ) {

    const { slug } = params;

    // Ninguna depende de la otra ENTONCES SE HACE SIMULTANEMANETE PILAS
    // const product = await getProductBySlug( slug );
    // const categories = await getCategories();

    const [ product, categories ] = await Promise.all([
        getProductBySlug( slug ),
        getCategories()
    ]);

    // TODO: new
    if ( !product && slug !== 'new') {
        redirect('admin/products')
    }

    const title = slug === 'new' ? 'Nuevo Producto' : 'Editar productos'

    return (
        <>
            <Title title={ title ?? '' } />

             {/* Si no viene el producto se envia un objeto vacio */}
            <ProductForm product={ product ?? {} } categories={ categories }/>
        </>
    );
}

// id - name