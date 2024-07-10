import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import Link from "next/link";
import ProductsInCart from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/PlaceOrder";

// const productsInCart = [
//   initialData.products[0],
//   initialData.products[1],
//   initialData.products[2],
// ]

export default function CheckoutPage () {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">

          <Title title="Verificar Orden" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

            {/* Carrito */}
            <div className="flex flex-col mt-5">
              <span>Ajustar elementos</span>
              <Link href="/cart" className="underline mb-5">
                Editar
              </Link>
           

              {/* items */}
              <ProductsInCart />
            </div>
          
            {/* Checkout | Resumen de la compra*/}
            <PlaceOrder />
          </div>
        </div>
    </div>
  );
}