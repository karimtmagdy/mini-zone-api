// import { Router } from "express";
// import { ctrlInventory } from "../project/controller/inventories.controller";

// const router = Router();

// GET /inventory?warehouseId=...
// GET /inventory?variantId=...
// GET /inventory?warehouseId=...&variantId=...
// GET /inventory?lowStock=true
// GET /inventory/low-stock?warehouseId=:warehouseId
// GET /inventory?warehouseId=:warehouseId
// router.route("/").get().post();
// router.route("/:inventoryId").get().post().patch().delete();
// router.post("/release");
// router.post("/reserve");
// router.post("/decrease");
// router.post("/increase");
// router.post("/adjust");
// router.get("/transfers");
// router.get("/transfers/:transferId");
// router.get("/warehouse/:warehouseId");
// router.get("/variant/:variantId");

// router.post("/add", ctrlInventory.add);
// router.post("/remove", ctrlInventory.remove);
// router.get("/products/:productId/inventory", ctrlInventory.getProduct);
// router.post("/transfer", ctrlInventory.transfer);
// router.get("/low-stock");

// export default {
//   router,
//   path: "/inventory",
// };
