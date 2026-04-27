import { SupplierPaymentsPage } from "@/pages/supplier-payments-page";
import { createRawMaterialSupplierPayment, getRawMaterialSupplierPayments } from "@/shared/lib/raw-material-supplier-payment-api";
import { getRawMaterialSuppliers } from "@/shared/lib/raw-material-supplier-api";

export function RawMaterialSupplierPaymentsPage() {
  return (
    <SupplierPaymentsPage
      createPayment={createRawMaterialSupplierPayment}
      pageDescription="Track raw material supplier payments with auto invoice generation and due management"
      pageTitle="Raw Material Supplier Payment"
      paymentsLoader={getRawMaterialSupplierPayments}
      recordModalTitle="Record Raw Material Supplier Payment"
      showProjectColumn={false}
      showProjectDetails={false}
      showProjectField={false}
      supplierOptionsLoader={getRawMaterialSuppliers}
    />
  );
}
