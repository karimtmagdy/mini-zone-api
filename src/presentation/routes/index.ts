import { Express } from "express";
// import brandRouter from "./brand.routes";
// import categoryRouter from "./category.routes";
// import customerRouter from "./customer.routes";
// import subcategoryRouter from "./subcategory.routes";
// import productRouter from "./product.routes";
// import variantRouter from "./variants.routes";
// import inventoryRouter from "./inventory.routes";
// import warehouseRouter from "./warehouse.routes";
// import employeeRouter from "./employee.routes";
// import dashboardRouter from "./dashboard.routes";
// import authRouter from "./auth.routes";
// import profileRouter from "./profile.routes";
// import couponRouter from "./coupon.routes";
// import userRouter from "./user.routes";
// import cartRouter from "./cart.routes";
// import purchaseOrderRouter from "./purchase-order.routes";
// import suppliersRouter from "./suppliers.routes";
// import salesOrderRouter from "./sales-order.routes";

const publicRoutes: Route[] = [
  // salesOrderRouter,
  // brandRouter,
  // categoryRouter,
  // customerRouter,
  // subcategoryRouter,
  // productRouter,
  // variantRouter,
  // inventoryRouter,
  // warehouseRouter,
  // userRouter,
  // cartRouter,
  // employeeRouter,
  // dashboardRouter,
  // authRouter,
  // profileRouter,
  // couponRouter,
];

// router.use("/", reviewPublicRouter);
// router.use("/cart", cartPublicRouter);
// router.use("/wishlist", wishlistPublicRouter);
// router.use("/uploads", uploadPublicRouter);
// router.use("/payment", paymentPublicRouter);
// router.use("/webhooks", webhookRouter);
const RV1 = "/api/v1";
export const setupRoutes = (app: Express) => {
  publicRoutes.forEach((route: Route) => {
    app.use(RV1 + route.path, route.router);
  });
};

// ├── /warehouses
// │   ├── POST   /
// │   ├── GET    /
// │   ├── GET    /:warehouseId
// │   ├── PATCH  /:warehouseId
// │   ├── DELETE /:warehouseId
// │   ├── PATCH  /:warehouseId/activate
// │   └── PATCH  /:warehouseId/deactivate
// │
// ├── /inventory
// │   ├── POST   /
// │   ├── GET    /
// │   ├── GET    /:inventoryId
// │   ├── PATCH  /:inventoryId
// │   ├── DELETE /:inventoryId
// │   │
// │   ├── POST   /increase
// │   ├── POST   /decrease
// │   ├── POST   /adjust
// │   ├── POST   /reserve
// │   ├── POST   /release
// │   │
// │   └── GET    /low-stock
// │
// ├── /inventory-transfers
// │   ├── POST   /
// │   ├── GET    /
// │   ├── GET    /:transferId
// │   └── GET    /:transferId/movements
// │
// └── /inventory-movements
//     ├── GET    /
//     └── GET    /:movementId

// {
//     "productId": 1,
//     "warehouseId": 1,
//     "quantity": 20
// }
// {
//   "variantId": "v1",
//   "warehouseId": "w1",
//   "quantity": 20
// }

// {
//   "variantId": "v1",
//   "warehouseId": "w1",
//   "quantity": 5
// }

// [
//   {
//     "warehouseId": "w1",
//     "quantity": 20
//   },
//   {
//     "warehouseId": "w2",
//     "quantity": 10
//   }
// ]

// {
//   "id": "p1",
//   "name": "T-Shirt",

//   "variants": [
//     {
//       "id": "v1",
//       "sku": "TSHIRT-RED-XL",
//       "color": "Red",
//       "size": "XL",

//       "price": 1000,
//       "discount": 10,
//       "finalPrice": 900,

//       "inventory": [
//         {
//           "warehouseId": "w1",
//           "quantity": 20
//         },
//         {
//           "warehouseId": "w2",
//           "quantity": 10
//         }
//       ]
//     }
//   ]
// }

// {
//   "price": 1000,
//   "discount": 10,
//   "finalPrice": 500
// }

// {
//   "supplierId": "s1",
//   "warehouseId": "w1",
//   "items": [
//     {
//       "variantId": "v1",
//       "quantity": 100,
//       "unitCost": 500
//     },
//     {
//       "variantId": "v2",
//       "quantity": 50,
//       "unitCost": 700
//     }
//   ]
// }

// {
//   "variantId": "variantId",
//   "warehouseId": "warehouseId",
//   "quantity": 100,
//   "referenceType": "PURCHASE_ORDER",
//   "referenceId": "purchaseOrderId"
// }

// {
//   "variantId": "variantId",
//   "warehouseId": "warehouseId",
//   "quantity": 5,
//   "referenceType": "SALES_ORDER",
//   "referenceId": "salesOrderId"
// }

// {
//   "variantId": "variantId",
//   "warehouseId": "warehouseId",
//   "quantity": 5,
//   "salesOrderId": "salesOrderId"
// }
