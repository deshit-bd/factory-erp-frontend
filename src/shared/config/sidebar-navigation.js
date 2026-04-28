import { stripRolePrefix } from "@/shared/config/auth-routing";

export const sidebarItems = [
  { label: "Dashboard", icon: "grid", path: "/", permissionKey: "dashboard" },
  { label: "Buyer Management", icon: "users", path: "/buyer-management", permissionKey: "buyer_management" },
  { label: "Sales Orders", icon: "cart", path: "/sales-orders", permissionKey: "sales_orders" },
  { label: "Projects", icon: "folder", path: "/projects", permissionKey: "projects" },
  { label: "Raw Material Stock", icon: "cube", path: "/raw-material-stock", permissionKey: "raw_material_stock" },
  { label: "Material Purchase", icon: "box", path: "/material-purchase", permissionKey: "material_purchase" },
  { label: "Material Allocation", icon: "branch", path: "/material-allocation", permissionKey: "material_allocation" },
  { label: "Factory Product Tracking", icon: "spark", path: "/factory-product-tracking", permissionKey: "factory_product_tracking" },
  { label: "Raw Material Supplier", icon: "briefcase", path: "/raw-material-supplier", permissionKey: "raw_material_supplier" },
  { label: "Project Goods Supplier", icon: "briefcase", path: "/suppliers", permissionKey: "project_goods_supplier" },
  { label: "Supplier Assignment", icon: "link", path: "/supplier-assignment", permissionKey: "supplier_assignment" },
  { label: "Supplier Products Tracking", icon: "package", path: "/supplier-products-tracking", permissionKey: "supplier_products_tracking" },
  { label: "Finished Goods", icon: "gift", path: "/finished-goods", permissionKey: "finished_goods" },
  { label: "Delivery/Shipment", icon: "truck", path: "/delivery-shipment", permissionKey: "delivery_shipment" },
  { label: "Delivery History", icon: "history", path: "/delivery-history", permissionKey: "delivery_history" },
  { label: "Material Supplier Payment", icon: "wallet", path: "/supplier-payments", permissionKey: "material_supplier_payment" },
  { label: "Goods Supplier Payment", icon: "wallet", path: "/goods-supplier-payments", permissionKey: "goods_supplier_payment" },
  { label: "Invoices", icon: "file", path: "/invoices", permissionKey: "invoices" },
  { label: "Accounts", icon: "ledger", path: "/accounts", permissionKey: "accounts" },
  { label: "Settings", icon: "gear", path: "/settings", permissionKey: "settings" },
];

export function getSidebarItemByPath(pathname) {
  const normalizedPath = stripRolePrefix(pathname);
  return sidebarItems.find((item) => item.path === normalizedPath) ?? sidebarItems[0];
}
