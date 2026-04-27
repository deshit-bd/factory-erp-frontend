import { SupplierPaymentsPage } from "@/pages/supplier-payments-page";
import { getProjectGoodsSuppliers } from "@/shared/lib/project-goods-supplier-api";

export function GoodsSupplierPaymentsPage() {
  return (
    <SupplierPaymentsPage
      exportFileName="goods-supplier-payments.csv"
      pageDescription="Track goods supplier payments with auto invoice generation and due management"
      pageTitle="Goods Supplier Payment"
      recordModalTitle="Record Goods Supplier Payment"
      supplierOptionsLoader={getProjectGoodsSuppliers}
    />
  );
}
