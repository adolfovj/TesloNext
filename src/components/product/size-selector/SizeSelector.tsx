// Ponerle type a las interfaces
import type { Size } from "@/interfaces";
import clsx from "clsx";
import { Underdog } from "next/font/google";

interface Props {
    selectedSize?: Size;
    availableSizes: Size[]; // 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL'

    // FUNCION 
    // Para actualizar el estado en genreal de los size
    onSizeChanged: ( size: Size ) => void;
}

export const SizeSelector = ({ selectedSize, availableSizes, onSizeChanged }: Props) => {

  return (
    <div className="my-5">
        <h3 className="font-bold mb-4">Tallas disponibles</h3>
        <div className="flex">
            {
                availableSizes.map( size => (
                    <button 
                        key={ size }
                        onClick={ () => onSizeChanged( size ) }
                        className={
                            clsx(
                                "mx-2 hover:underline text-lg", // clases normales
                                {
                                    // expresion | underline va a estar de acuerdo a esta condicion
                                    'underline': size === selectedSize
                                }
                            )
                        }
                        >
                         { size }
                    </button>
                ))
            }
        </div>
    </div>
  )
}

