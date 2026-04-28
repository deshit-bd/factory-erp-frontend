export const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "production_manager", label: "Production Manager" },
  { value: "salesman", label: "Salesman" },
];

export const permissionLabelToKey = {
  Dashboard: "dashboard",
  "Buyer Management": "buyer_management",
  "Raw Material Supplier": "raw_material_supplier",
  "Project Goods Supplier": "project_goods_supplier",
  "Supplier Assignment": "supplier_assignment",
  "Sales Orders": "sales_orders",
  Projects: "projects",
  Invoices: "invoices",
  "Raw Material Stock": "raw_material_stock",
  "Material Purchase": "material_purchase",
  "Material Allocation": "material_allocation",
  "Finished Goods": "finished_goods",
  "Factory Product Tracking": "factory_product_tracking",
  "Supplier Products Tracking": "supplier_products_tracking",
  "Delivery/Shipment": "delivery_shipment",
  "Delivery History": "delivery_history",
  "Material Supplier Payment": "material_supplier_payment",
  "Goods Supplier Payment": "goods_supplier_payment",
  Accounts: "accounts",
  Settings: "settings",
};

export const permissionKeyToLabel = Object.fromEntries(Object.entries(permissionLabelToKey).map(([label, key]) => [key, label]));

export function mapPermissionKeysToLabels(permissionKeys = []) {
  return permissionKeys.map((key) => permissionKeyToLabel[key]).filter(Boolean);
}

export function mapPermissionLabelsToKeys(permissionLabels = []) {
  return permissionLabels.map((label) => permissionLabelToKey[label]).filter(Boolean);
}
