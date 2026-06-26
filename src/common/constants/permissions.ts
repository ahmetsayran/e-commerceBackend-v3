export const PERMISSIONS = {
  PRODUCTS: {
    READ: 'products:read',
    CREATE: 'products:create',
    UPDATE: 'products:update',
    DELETE: 'products:delete',
  },
  CATEGORIES: {
    READ: 'categories:read',
    CREATE: 'categories:create',
    UPDATE: 'categories:update',
    DELETE: 'categories:delete',
  },
  ORDERS: {
    CREATE: 'orders:create',
    READ_OWN: 'orders:read:own',
    READ_ANY: 'orders:read:any',
    UPDATE_OWN: 'orders:update:own',
    UPDATE_ANY: 'orders:update:any',
  },
  CARTS: {
    READ_OWN: 'carts:read:own',
    UPDATE_OWN: 'carts:update:own',
  },
  COMMENTS: {
    READ: 'comments:read',
    CREATE: 'comments:create',
    UPDATE_OWN: 'comments:update:own',
    DELETE_OWN: 'comments:delete:own',
    DELETE_ANY: 'comments:delete:any',
  },
  PRODUCT_PHOTOS: {
    READ: 'product_photos:read',
    CREATE: 'product_photos:create',
    UPDATE: 'product_photos:update',
    DELETE: 'product_photos:delete',
  },
  USERS: {
    READ_OWN: 'users:read:own',
    READ_ANY: 'users:read:any',
    UPDATE_OWN: 'users:update:own',
    UPDATE_ANY: 'users:update:any',
    DELETE_ANY: 'users:delete:any',
  },
  ROLES: {
    READ: 'roles:read',
    CREATE: 'roles:create',
    UPDATE: 'roles:update',
    DELETE: 'roles:delete',
  },
};
