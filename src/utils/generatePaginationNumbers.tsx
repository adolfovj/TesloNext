
// [ 1, 2, 3, 4, 5 ... 6 ]
export const generatePaginationNumbers = ( currentPage: number, totalPages: number) =>{

    // Si el numero total de paginas es 7 o menos vamos 
    // a mostrar todas las paginas sin ... suspensivos

    // condicion de 7 paginas [1, 2, 3, 4, 5, 6, 7]
    if( totalPages <= 7) {
        // retorna un nuevo arreglo
        // length | { length: totalPages }
        //  (_, i) | Valor _ "No nos interesa" y el i es el indice
        // Regresar el i + 1
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Sean mas de 7 paginas
    // si la pagina actual esta entre las primeras 3 paginas
    // mostrar las primeras 3, puntos suspesivos y las ultimas 2
    if ( currentPage <= 3) {
        // [1,2,3, '...'. 11, 12]
        return [1,2,3,'...', totalPages - 1, totalPages ];
    }

    // Si la pagina actual esta entre las ultimas 3 paginas
    // Mostrar las primeras dos , puntos suspensivos y las ultimas 3
    if ( currentPage >= totalPages -2 ) {
        // [1,2, '...'. 11, 12]
        return [1,2,3,'...', totalPages - 1, totalPages ];
    }    

    // Si la pagina actual esta en otro lugar medio
    // mostrar la primera pagina, puntos suspensivos, la pagina acutal y mas puntos
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
    ];
}