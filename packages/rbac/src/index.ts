// ============================================================
// MODULE:     rbac/index
// PURPOSE:    Sistema de Control de Acceso Basado en Roles
//             Centraliza todos los permisos del ecosistema.
// ============================================================

// ------------------------------------------------------------
// ROLES - Los 10 tipos de usuario definidos en el sistema
// ------------------------------------------------------------
export enum Role {
  /** Usuario básico sin membresía. Compra sin descuento, sin wallet ni puntos */
  CLIENT = 'CLIENT',

  /** Membresía $29/año. Descuentos 10%, puntos, wallet básico. NO refiere */
  PREFERENTE = 'PREFERENTE',

  /** Membresía $97/año. MLM completo, referir ilimitados, dashboard red */
  PIONERO = 'PIONERO',

  /** Vendedor de productos físicos/digitales. CRUD productos, inventario, ventas */
  PROVIDER_PRODUCTS = 'PROVIDER_PRODUCTS',

  /** Vendedor de servicios profesionales. CRUD servicios, calendario, citas con QR */
  PROVIDER_SERVICES = 'PROVIDER_SERVICES',

  /** Administrador de plataforma. Moderar usuarios/productos, aprobar proveedores */
  ADMIN = 'ADMIN',

  /** Super administrador. Control total, config MLM, activaciones manuales */
  SUPER_ADMIN = 'SUPER_ADMIN',

  /** Contador/Finanzas. Ver reportes financieros, métricas, NO modificar usuarios */
  ACCOUNTANT = 'ACCOUNTANT',

  /** Solo lectura. Ver transacciones, reportes, logs. NO modificar */
  AUDITOR = 'AUDITOR',

  /** Soporte técnico. Ayudar usuarios, ver tickets */
  SUPPORT = 'SUPPORT',
}

// ------------------------------------------------------------
// PERMISOS - Todas las acciones posibles en el sistema
// ------------------------------------------------------------
export enum Permission {
  // ===== LECTURA =====
  VIEW_CATALOG = 'VIEW_CATALOG',
  VIEW_PRODUCTS = 'VIEW_PRODUCTS',
  VIEW_SERVICES = 'VIEW_SERVICES',
  VIEW_OWN_ORDERS = 'VIEW_OWN_ORDERS',
  VIEW_OWN_WALLET = 'VIEW_OWN_WALLET',
  VIEW_OWN_NETWORK = 'VIEW_OWN_NETWORK',
  VIEW_ALL_TRANSACTIONS = 'VIEW_ALL_TRANSACTIONS',
  VIEW_ALL_USERS = 'VIEW_ALL_USERS',
  VIEW_REPORTS = 'VIEW_REPORTS',
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',

  // ===== COMPRAS =====
  BUY_PRODUCTS = 'BUY_PRODUCTS',
  BUY_SERVICES = 'BUY_SERVICES',
  USE_POINTS = 'USE_POINTS',
  RECEIVE_DISCOUNTS = 'RECEIVE_DISCOUNTS',

  // ===== RED MLM =====
  REFER_USERS = 'REFER_USERS',
  VIEW_MLM_TREE = 'VIEW_MLM_TREE',
  VIEW_MLM_RANK = 'VIEW_MLM_RANK',
  RECEIVE_COMMISSIONS = 'RECEIVE_COMMISSIONS',

  // ===== PROVEEDOR PRODUCTOS =====
  CREATE_PRODUCTS = 'CREATE_PRODUCTS',
  EDIT_PRODUCTS = 'EDIT_PRODUCTS',
  DELETE_PRODUCTS = 'DELETE_PRODUCTS',
  MANAGE_INVENTORY = 'MANAGE_INVENTORY',
  VIEW_PROVIDER_SALES = 'VIEW_PROVIDER_SALES',

  // ===== PROVEEDOR SERVICIOS =====
  CREATE_SERVICES = 'CREATE_SERVICES',
  EDIT_SERVICES = 'EDIT_SERVICES',
  DELETE_SERVICES = 'DELETE_SERVICES',
  MANAGE_APPOINTMENTS = 'MANAGE_APPOINTMENTS',
  SCAN_QR = 'SCAN_QR',

  // ===== WALLET =====
  WITHDRAW_FUNDS = 'WITHDRAW_FUNDS',
  TRANSFER_FUNDS = 'TRANSFER_FUNDS',
  VIEW_WALLET_OPERATIONS = 'VIEW_WALLET_OPERATIONS',
  APPROVE_WITHDRAWALS = 'APPROVE_WITHDRAWALS',

  // ===== ADMIN =====
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_ROLES = 'MANAGE_ROLES',
  ACTIVATE_USERS = 'ACTIVATE_USERS',
  SUSPEND_USERS = 'SUSPEND_USERS',
  MODERATE_PRODUCTS = 'MODERATE_PRODUCTS',
  MODERATE_SERVICES = 'MODERATE_SERVICES',
  APPROVE_PROVIDERS = 'APPROVE_PROVIDERS',
  MANAGE_KYC = 'MANAGE_KYC',
  HANDLE_SUPPORT = 'HANDLE_SUPPORT',
  MANAGE_CONTENT = 'MANAGE_CONTENT',

  // ===== SUPER ADMIN =====
  MANAGE_MLM_CONFIG = 'MANAGE_MLM_CONFIG',
  MANAGE_SYSTEM_CONFIG = 'MANAGE_SYSTEM_CONFIG',
  MANUAL_ACTIVATION = 'MANUAL_ACTIVATION',
  VIEW_FINANCIAL_CONTROL = 'VIEW_FINANCIAL_CONTROL',
  EXPORT_DATA = 'EXPORT_DATA',

  // ===== AUDITOR =====
  VIEW_ALL = 'VIEW_ALL', // Solo lectura total
}

// ------------------------------------------------------------
// MATRIZ DE PERMISOS POR ROL
// Cada rol hereda los permisos del rol inferior
// ------------------------------------------------------------
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  // CLIENT: Solo puede ver catálogo y comprar (sin descuentos ni wallet)
  [Role.CLIENT]: [
    Permission.VIEW_CATALOG,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_SERVICES,
    Permission.BUY_PRODUCTS,
    Permission.BUY_SERVICES,
    Permission.VIEW_OWN_ORDERS,
  ],

  // PREFERENTE: CLIENT + descuentos y puntos
  [Role.PREFERENTE]: [
    Permission.VIEW_CATALOG,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_SERVICES,
    Permission.BUY_PRODUCTS,
    Permission.BUY_SERVICES,
    Permission.VIEW_OWN_ORDERS,
    Permission.RECEIVE_DISCOUNTS,
    Permission.USE_POINTS,
    Permission.VIEW_OWN_WALLET,
  ],

  // PIONERO: PREFERENTE + MLM completo
  [Role.PIONERO]: [
    Permission.VIEW_CATALOG,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_SERVICES,
    Permission.BUY_PRODUCTS,
    Permission.BUY_SERVICES,
    Permission.VIEW_OWN_ORDERS,
    Permission.RECEIVE_DISCOUNTS,
    Permission.USE_POINTS,
    Permission.VIEW_OWN_WALLET,
    Permission.REFER_USERS,
    Permission.VIEW_MLM_TREE,
    Permission.VIEW_MLM_RANK,
    Permission.RECEIVE_COMMISSIONS,
    Permission.VIEW_OWN_NETWORK,
    Permission.TRANSFER_FUNDS,
  ],

  // PROVIDER_PRODUCTS: CLIENT + gestión de productos
  [Role.PROVIDER_PRODUCTS]: [
    Permission.VIEW_CATALOG,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_SERVICES,
    Permission.BUY_PRODUCTS,
    Permission.BUY_SERVICES,
    Permission.VIEW_OWN_ORDERS,
    Permission.CREATE_PRODUCTS,
    Permission.EDIT_PRODUCTS,
    Permission.DELETE_PRODUCTS,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_PROVIDER_SALES,
    Permission.VIEW_OWN_WALLET,
    Permission.WITHDRAW_FUNDS,
  ],

  // PROVIDER_SERVICES: CLIENT + gestión de servicios con QR
  [Role.PROVIDER_SERVICES]: [
    Permission.VIEW_CATALOG,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_SERVICES,
    Permission.BUY_PRODUCTS,
    Permission.BUY_SERVICES,
    Permission.VIEW_OWN_ORDERS,
    Permission.CREATE_SERVICES,
    Permission.EDIT_SERVICES,
    Permission.DELETE_SERVICES,
    Permission.MANAGE_APPOINTMENTS,
    Permission.SCAN_QR,
    Permission.VIEW_PROVIDER_SALES,
    Permission.VIEW_OWN_WALLET,
    Permission.WITHDRAW_FUNDS,
  ],

  // SUPPORT: CLIENT + soporte técnico
  [Role.SUPPORT]: [
    Permission.VIEW_CATALOG,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_SERVICES,
    Permission.BUY_PRODUCTS,
    Permission.BUY_SERVICES,
    Permission.VIEW_OWN_ORDERS,
    Permission.VIEW_OWN_WALLET,
    Permission.HANDLE_SUPPORT,
    Permission.VIEW_ALL_USERS,
  ],

  // ADMIN: SUPPORT + gestión administrativa completa
  [Role.ADMIN]: [
    Permission.VIEW_CATALOG,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_SERVICES,
    Permission.BUY_PRODUCTS,
    Permission.BUY_SERVICES,
    Permission.VIEW_OWN_ORDERS,
    Permission.VIEW_OWN_WALLET,
    Permission.HANDLE_SUPPORT,
    Permission.VIEW_ALL_USERS,
    Permission.VIEW_ALL_TRANSACTIONS,
    Permission.MANAGE_USERS,
    Permission.ACTIVATE_USERS,
    Permission.SUSPEND_USERS,
    Permission.MODERATE_PRODUCTS,
    Permission.MODERATE_SERVICES,
    Permission.APPROVE_PROVIDERS,
    Permission.MANAGE_KYC,
    Permission.APPROVE_WITHDRAWALS,
    Permission.VIEW_REPORTS,
    Permission.MANAGE_CONTENT,
  ],

  // AUDITOR: Solo lectura total (no puede modificar nada)
  [Role.AUDITOR]: [
    Permission.VIEW_CATALOG,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_SERVICES,
    Permission.VIEW_ALL_TRANSACTIONS,
    Permission.VIEW_ALL_USERS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_FINANCIAL_CONTROL,
    Permission.EXPORT_DATA,
  ],

  // ACCOUNTANT: Solo finanzas y reportes. NO modificar usuarios ni configuraciones
  [Role.ACCOUNTANT]: [
    Permission.VIEW_CATALOG,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_SERVICES,
    Permission.VIEW_OWN_ORDERS,
    Permission.VIEW_OWN_WALLET,
    Permission.VIEW_ALL_TRANSACTIONS,
    Permission.VIEW_ALL_USERS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_FINANCIAL_CONTROL,
    Permission.APPROVE_WITHDRAWALS,
    Permission.EXPORT_DATA,
  ],

  // SUPER_ADMIN: Tiene todos los permisos
  [Role.SUPER_ADMIN]: Object.values(Permission) as Permission[],
};

// ------------------------------------------------------------
// HELPERS - Funciones utilitarias para verificar permisos
// ------------------------------------------------------------

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Verifica si un rol tiene AL MENOS UNO de los permisos especificados
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Verifica si un rol tiene TODOS los permisos especificados
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Verifica si un rol puede acceder a una ruta específica
 */
export function canAccessRoute(role: Role, route: string): boolean {
  const routePermissions: Record<string, Permission[]> = {
    // Rutas administrativas
    '/admin': [Permission.MANAGE_USERS],
    '/admin/users': [Permission.VIEW_ALL_USERS, Permission.MANAGE_USERS],
    '/admin/products': [Permission.MODERATE_PRODUCTS],
    '/admin/services': [Permission.MODERATE_SERVICES],
    '/admin/kyc': [Permission.MANAGE_KYC],
    '/admin/withdrawals': [Permission.APPROVE_WITHDRAWALS],
    '/admin/config': [Permission.MANAGE_SYSTEM_CONFIG],
    '/admin/audit': [Permission.VIEW_AUDIT_LOGS],
    '/admin/providers': [Permission.APPROVE_PROVIDERS],

    // Rutas de dashboard (red MLM)
    '/dashboard': [Permission.VIEW_OWN_WALLET, Permission.VIEW_OWN_ORDERS],
    '/dashboard/network': [Permission.VIEW_MLM_TREE],
    '/dashboard/ventas': [Permission.VIEW_PROVIDER_SALES],
    '/dashboard/pedidos': [Permission.VIEW_OWN_ORDERS],
    '/dashboard/transfer': [Permission.TRANSFER_FUNDS],
    '/dashboard/withdraw': [Permission.WITHDRAW_FUNDS],

    // Rutas de proveedor
    '/provider': [Permission.CREATE_PRODUCTS, Permission.CREATE_SERVICES],
    '/provider/products': [Permission.CREATE_PRODUCTS, Permission.EDIT_PRODUCTS],
    '/provider/services': [Permission.CREATE_SERVICES, Permission.EDIT_SERVICES],
    '/provider/appointments': [Permission.MANAGE_APPOINTMENTS],
    '/provider/qr': [Permission.SCAN_QR],

    // Rutas de cliente
    '/servicios/citas': [Permission.BUY_SERVICES],

    // Rutas de auditor
    '/auditor': [Permission.VIEW_ALL_TRANSACTIONS],
    '/auditor/transactions': [Permission.VIEW_ALL_TRANSACTIONS],
    '/auditor/reports': [Permission.VIEW_REPORTS],
    '/auditor/audit': [Permission.VIEW_AUDIT_LOGS],
  };

  // Buscar la ruta exacta o un prefijo
  const required = routePermissions[route];
  if (required) {
    return hasAnyPermission(role, required);
  }

  // Verificar prefijos
  for (const [prefix, perms] of Object.entries(routePermissions)) {
    if (route.startsWith(prefix)) {
      return hasAnyPermission(role, perms);
    }
  }

  // Si no hay configuración de permisos para la ruta, permitir acceso
  return true;
}

/**
 * Obtiene todos los permisos de un rol
 */
export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Verifica si un rol es administrativo (ADMIN o superior)
 */
export function isAdminRole(role: Role): boolean {
  return [
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.AUDITOR,
    Role.SUPPORT,
    Role.ACCOUNTANT,
  ].includes(role);
}

/**
 * Verifica si un rol es proveedor (PRODUCTS o SERVICES)
 */
export function isProviderRole(role: Role): boolean {
  return [Role.PROVIDER_PRODUCTS, Role.PROVIDER_SERVICES].includes(role);
}

/**
 * Verifica si un rol es miembro (PREFERENTE o PIONERO)
 */
export function isMemberRole(role: Role): boolean {
  return [Role.PREFERENTE, Role.PIONERO].includes(role);
}

/**
 * Verifica si un rol puede referirse usuarios (solo PIONERO)
 */
export function canRefer(role: Role): boolean {
  return role === Role.PIONERO;
}

/**
 * Verifica si un rol tiene acceso MLM
 */
export function hasMLMAccess(role: Role): boolean {
  return role === Role.PIONERO;
}

/**
 * Obtiene el nivel de usuario (para compatibilidad con código antiguo)
 */
export function getUserLevel(role: Role): number {
  switch (role) {
    case Role.CLIENT:
      return 0;
    case Role.PREFERENTE:
      return 1;
    case Role.PIONERO:
      return 2;
    case Role.PROVIDER_PRODUCTS:
    case Role.PROVIDER_SERVICES:
      return 3;
    case Role.SUPPORT:
      return 4;
    case Role.ADMIN:
      return 5;
    case Role.ACCOUNTANT:
      return 5.5;
    case Role.AUDITOR:
      return 6;
    case Role.SUPER_ADMIN:
      return 7;
    default:
      return 0;
  }
}
