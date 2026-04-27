import { AppLayout } from "@/widgets/app-layout";
import { AccountsPage } from "@/pages/accounts-page";
import { BuyerManagementPage } from "@/pages/buyer-management-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { DeliveryHistoryPage } from "@/pages/delivery-history-page";
import { DeliveryShipmentPage } from "@/pages/delivery-shipment-page";
import { FactoryProductTrackingPage } from "@/pages/factory-product-tracking-page";
import { FinishedGoodsPage } from "@/pages/finished-goods-page";
import { GoodsSupplierPaymentsPage } from "@/pages/goods-supplier-payments-page";
import { InvoicesPage } from "@/pages/invoices-page";
import { MaterialAllocationPage } from "@/pages/material-allocation-page";
import { MaterialPurchasePage } from "@/pages/material-purchase-page";
import { ProjectsPage } from "@/pages/projects-page";
import { RawMaterialSupplierPage } from "@/pages/raw-material-supplier-page";
import { RawMaterialStockPage } from "@/pages/raw-material-stock-page";
import { SalesOrdersPage } from "@/pages/sales-orders-page";
import { SettingsPage } from "@/pages/settings-page";
import { SupplierAssignmentPage } from "@/pages/supplier-assignment-page";
import { SupplierPaymentsPage } from "@/pages/supplier-payments-page";
import { SupplierProductsTrackingPage } from "@/pages/supplier-products-tracking-page";
import { SuppliersPage } from "@/pages/suppliers-page";

export function HomePage() {
  return (
    <AppLayout>
      {({ selectedItem }) => {
        if (selectedItem === "Buyer Management") {
          return <BuyerManagementPage />;
        }

        if (selectedItem === "Sales Orders") {
          return <SalesOrdersPage />;
        }

        if (selectedItem === "Projects") {
          return <ProjectsPage />;
        }

        if (selectedItem === "Raw Material Stock") {
          return <RawMaterialStockPage />;
        }

        if (selectedItem === "Material Purchase") {
          return <MaterialPurchasePage />;
        }

        if (selectedItem === "Material Allocation") {
          return <MaterialAllocationPage />;
        }

        if (selectedItem === "Factory Product Tracking" || selectedItem === "Factory Product Tracki") {
          return <FactoryProductTrackingPage />;
        }

        if (selectedItem === "Raw Material Supplier") {
          return <RawMaterialSupplierPage />;
        }

        if (selectedItem === "Project Goods Supplier") {
          return <SuppliersPage />;
        }

        if (selectedItem === "Supplier Assignment") {
          return <SupplierAssignmentPage />;
        }

        if (selectedItem === "Supplier Products Tracking" || selectedItem === "Supplier Products Traci") {
          return <SupplierProductsTrackingPage />;
        }

        if (selectedItem === "Finished Goods") {
          return <FinishedGoodsPage />;
        }

        if (selectedItem === "Delivery/Shipment") {
          return <DeliveryShipmentPage />;
        }

        if (selectedItem === "Delivery History" || selectedItem === "Deliver History") {
          return <DeliveryHistoryPage />;
        }

        if (selectedItem === "Supplier Payments" || selectedItem === "Raw Material Supplier Payment" || selectedItem === "Material Supplier Payment") {
          return <SupplierPaymentsPage />;
        }

        if (selectedItem === "Goods Supplier Payment") {
          return <GoodsSupplierPaymentsPage />;
        }

        if (selectedItem === "Invoices") {
          return <InvoicesPage />;
        }

        if (selectedItem === "Settings") {
          return <SettingsPage />;
        }

        if (selectedItem === "Accounts") {
          return <AccountsPage />;
        }

        return <DashboardPage />;
      }}
    </AppLayout>
  );
}
