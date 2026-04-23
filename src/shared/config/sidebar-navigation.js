export const sidebarItems = [
  { label: "Dashboard", icon: "grid", path: "/" },
  { label: "Buyer Management", icon: "users", path: "/buyer-management" },
  { label: "Sales Orders", icon: "cart", path: "/sales-orders" },
  { label: "Projects", icon: "folder", path: "/projects" },
  { label: "Raw Material Stock", icon: "cube", path: "/raw-material-stock" },
  { label: "Material Purchase", icon: "box", path: "/material-purchase" },
  { label: "Material Allocation", icon: "branch", path: "/material-allocation" },
  { label: "Factory Product Tracking", icon: "spark", path: "/factory-product-tracking" },
  { label: "Suppliers", icon: "briefcase", path: "/suppliers" },
  { label: "Supplier Assignment", icon: "link", path: "/supplier-assignment" },
  { label: "Supplier Products Tracking", icon: "package", path: "/supplier-products-tracking" },
  { label: "Finished Goods", icon: "gift", path: "/finished-goods" },
  { label: "Delivery/Shipment", icon: "truck", path: "/delivery-shipment" },
  { label: "Delivery History", icon: "history", path: "/delivery-history" },
  { label: "Supplier Payments", icon: "wallet", path: "/supplier-payments" },
  { label: "Invoices", icon: "file", path: "/invoices" },
  { label: "Accounts", icon: "ledger", path: "/accounts" },
  { label: "Settings", icon: "gear", path: "/settings" },
];

export function getSidebarItemByPath(pathname) {
  return sidebarItems.find((item) => item.path === pathname) ?? sidebarItems[0];
}
