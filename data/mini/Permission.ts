import { model, Schema } from "mongoose";

import { IPermission } from "@/types/permissions.types";


export const Permissions = {
  users: {
    create: "users:create",
    read: "users:read",
    update: "users:update",
    delete: "users:delete",
  },
  categories: {
    create: "categories:create",
    read: "categories:read",
    update: "categories:update",
    delete: "categories:delete",
  },
  subcategories: {
    create: "subcategories:create",
    read: "subcategories:read",
    update: "subcategories:update",
    delete: "subcategories:delete",
  },
  products: {
    create: "product:create",
    read: "product:read",
    update: "product:update",
    delete: "product:delete",
  },
  orders: {
    approve: "orders:approve",
    cancel: "orders:cancel",
    refund: "orders:refund",
  },
  finance: {
    managePayments: "payments:manage",
    generateInvoices: "invoices:generate",
  },
  dashboard: {
    access: "dashboard:access",
    viewReports: "reports:view",
  },
  settings: {
    access: "settings:access",
    update: "settings:update",
  },
  roles: {
    assign: "roles:assign",
    update: "roles:update",
    delete: "roles:delete",
  },
  system: {
    maintenance: "system:maintenance",
    security: "security:manage",
  },
  general: {
    create: "create",
    read: "read",
    update: "update",
    delete: "delete",
    all: "all",
  },
};
const RESOURCE_TYPES = [
  "users",
  "categories",
  "subcategories",
  "products",
  "orders",
  "payments",
  "invoices",
  "dashboard",
  "settings",
  "reports",
  "roles",
  "system",
  "general",
];

const ACTION_TYPES = [
  "create",
  "read",
  "update",
  "delete",
  "approve",
  "cancel",
  "refund",
  "manage",
  "generate",
  "access",
  "view",
  "assign",
  "maintenance",
  "all",
];

const permissionSchema = new Schema(
  {
    resource: {
      type: String,
      required: true,
      enum: RESOURCE_TYPES,
    },
    action: {
      type: String,
      required: true,
      enum: ACTION_TYPES,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Permission = model<IPermission>("Permission", permissionSchema);
