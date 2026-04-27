import { createBrowserRouter } from "react-router-dom";

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
import { NotFoundPage } from "@/pages/not-found-page";
import { ProjectsPage } from "@/pages/projects-page";
import { RawMaterialSupplierPage } from "@/pages/raw-material-supplier-page";
import { RawMaterialStockPage } from "@/pages/raw-material-stock-page";
import { SalesOrdersPage } from "@/pages/sales-orders-page";
import { SettingsPage } from "@/pages/settings-page";
import { SupplierAssignmentPage } from "@/pages/supplier-assignment-page";
import { SupplierPaymentsPage } from "@/pages/supplier-payments-page";
import { SupplierProductsTrackingPage } from "@/pages/supplier-products-tracking-page";
import { SuppliersPage } from "@/pages/suppliers-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "buyer-management",
        element: <BuyerManagementPage />,
      },
      {
        path: "sales-orders",
        element: <SalesOrdersPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "raw-material-stock",
        element: <RawMaterialStockPage />,
      },
      {
        path: "material-purchase",
        element: <MaterialPurchasePage />,
      },
      {
        path: "material-allocation",
        element: <MaterialAllocationPage />,
      },
      {
        path: "factory-product-tracking",
        element: <FactoryProductTrackingPage />,
      },
      {
        path: "raw-material-supplier",
        element: <RawMaterialSupplierPage />,
      },
      {
        path: "suppliers",
        element: <SuppliersPage />,
      },
      {
        path: "supplier-assignment",
        element: <SupplierAssignmentPage />,
      },
      {
        path: "supplier-products-tracking",
        element: <SupplierProductsTrackingPage />,
      },
      {
        path: "finished-goods",
        element: <FinishedGoodsPage />,
      },
      {
        path: "delivery-shipment",
        element: <DeliveryShipmentPage />,
      },
      {
        path: "delivery-history",
        element: <DeliveryHistoryPage />,
      },
      {
        path: "supplier-payments",
        element: <SupplierPaymentsPage />,
      },
      {
        path: "goods-supplier-payments",
        element: <GoodsSupplierPaymentsPage />,
      },
      {
        path: "invoices",
        element: <InvoicesPage />,
      },
      {
        path: "accounts",
        element: <AccountsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
