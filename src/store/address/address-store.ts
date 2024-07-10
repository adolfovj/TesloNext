
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {

    address: {

        firstName: string;
        lastName: string;
        address: string;
        address2?: string;
        postalCode: string;
        city: string;
        country: string;
        phone: string;        
    };

    // Metodos | addresss de tipo state y vaser un address
    // En general esa direccion va ser el address que tenemos aca
    setAddress: ( address: State["address"]) => void;

}

export const useAddressStore = create<State>() (

    // MIDDLEWARE PARA GRABAR LOCALMENTE EN EL LOCALSTORAGE
    persist(

        (set, get) => ({
            // Tenemos el Estado de la variable 
            address: {
                firstName: "",
                lastName: "",
                address: "",
                address2: "",
                postalCode: "",
                city: "",
                country: "",
                phone: "",
            },
            setAddress: (address) => {
                set({ address });
            }
        }),
        {
            name: "address-storage"
        }
    )
);

