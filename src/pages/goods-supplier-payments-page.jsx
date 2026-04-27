import { SupplierPaymentsPage } from "@/pages/supplier-payments-page";
import { createProjectGoodsSupplierPayment, getProjectGoodsSupplierPayments } from "@/shared/lib/project-goods-supplier-payment-api";
import { getProjectGoodsSuppliers } from "@/shared/lib/project-goods-supplier-api";

export function GoodsSupplierPaymentsPage() {
  return (
    <SupplierPaymentsPage
      createPayment={createProjectGoodsSupplierPayment}
      exportFileName="goods-supplier-payments.csv"
      pageDescription="Track project goods supplier payments with auto invoice generation and due management"
      pageTitle="Project Goods Supplier Payment"
      paymentsLoader={getProjectGoodsSupplierPayments}
      recordModalTitle="Record Project Goods Supplier Payment"
      showProjectColumn={false}
      showProjectDetails={false}
      showProjectField={false}
      supplierOptionsLoader={getProjectGoodsSuppliers}
    />
  );
}
