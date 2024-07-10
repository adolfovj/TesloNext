
export * from './address/delete-user-address';
export * from './address/get-user-address';
export * from './address/set-user-address';

export * from './auth/login';
export * from './auth/logout';
export * from './auth/registerUser';

export * from './category/get-categories';

export * from './country/get-countries';

export * from './order/get-order-by-user';
export * from './order/get-order-by-id';
export * from './order/get-paginated-orders';
export * from './order/place-order';

export * from './payments/set-transaction-id';
export * from './payments/paypal-check-payment';

export * from './product/create-update-product';
export * from './product/delete-product-image';
export * from './product/get-product-by-slug';
export * from './product/get-stock-by-slug';
export * from './product/product-pagination';

export * from './user/change-user-role';
export * from './user/get-paginated-users';


// 'use server';
 
// import { getPaginaterProductsWhitImages } from './product/product-pagination';
// // import { getProductCategories } from './get-product-categories';
// import { getStockBySlug } from './product/get-stock-by-slug';
// import { getProductBySlug } from './product/get-product-by-slug';
 
// export {
//     getPaginaterProductsWhitImages,  
//     getStockBySlug,
//     getProductBySlug,
// };