# Mini Zone API — Frontend Integration Guide

> **Base URL:** `http://localhost:8000/api/v1`  
> **Content-Type:** `application/json`

---

## Table of Contents

- [Overview](#overview)
- [Response Format](#response-format)
- [Query Parameters (Pagination & Filtering)](#query-parameters)
- [Brands](#brands)
- [Categories](#categories)
- [Status Transitions](#status-transitions)
- [Error Handling](#error-handling)

---

## Overview

All routes are prefixed with `/api/v1`. The API is built with Express + TypeScript and uses Zod for request validation.

| Resource   | Base Path          |
|------------|--------------------|
| Brands     | `/api/v1/brands`   |
| Categories | `/api/v1/categories` |

---

## Response Format

### Success — List
```json
{
  "status": "success",
  "meta": {
    "total": 20,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  },
  "data": [ ]
}
```

### Success — Single / Mutation
```json
{
  "code": 200,
  "status": "success",
  "message": "...",
  "data": { }
}
```

### Brand / Category Object Shape
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "status": "active | inactive | archive",
  "products": 0,
  "isArchived": false,
  "archivedAt": null,
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

---

## Query Parameters

Applies to all `GET /` (list) endpoints.

| Parameter | Type     | Description                        | Example         |
|-----------|----------|------------------------------------|-----------------|
| `page`    | `number` | Page number (default: `1`)         | `?page=2`       |
| `limit`   | `number` | Items per page (default: `10`)     | `?limit=20`     |
| `search`  | `string` | Search by name                     | `?search=nike`  |
| `status`  | `string` | Filter by status                   | `?status=active`|
| `sort`    | `string` | Sort field                         | `?sort=name`    |
| `order`   | `string` | Sort direction `asc` / `desc`      | `?order=asc`    |

---

## Brands

### `GET /api/v1/brands`
Retrieve a paginated list of brands.

**Request**
```http
GET /api/v1/brands?page=1&limit=10&status=active
```

**Response `200`**
```json
{
  "status": "success",
  "meta": { "total": 5, "page": 1, "limit": 10, "totalPages": 1 },
  "data": [
    {
      "id": "brand_id",
      "name": "Nike",
      "slug": "nike",
      "status": "active",
      "products": 12,
      "isArchived": false,
      "archivedAt": null
    }
  ]
}
```

---

### `POST /api/v1/brands`
Create a new brand.

**Request Body**

| Field    | Type     | Required | Description                                        |
|----------|----------|----------|----------------------------------------------------|
| `name`   | `string` | Yes      | 2–30 characters                                    |
| `status` | `string` | No       | `"active"` or `"inactive"` (default: `"inactive"`) |

```json
{
  "name": "Nike",
  "status": "active"
}
```

**Response `201`**
```json
{
  "code": 201,
  "status": "success",
  "message": "brand has been created",
  "data": { }
}
```

---

### `GET /api/v1/brands/:brandId`
Get a single brand by ID.

**Response `200`**
```json
{
  "code": 200,
  "status": "success",
  "data": { }
}
```

---

### `PATCH /api/v1/brands/:brandId`
Update brand name and/or status. All fields are optional.

**Request Body**
```json
{
  "name": "Adidas",
  "status": "inactive"
}
```

**Response `200`**
```json
{
  "code": 200,
  "status": "success",
  "message": "brand has been updated",
  "data": { }
}
```

---

### `DELETE /api/v1/brands/:brandId`
Permanently delete a brand.

**Response `200`**
```json
{
  "code": 200,
  "status": "success",
  "message": "brand has been deleted permanently",
  "data": { }
}
```

---

### `PATCH /api/v1/brands/archive/:brandId`
Move a brand to the archive.

**Response `200`**
```json
{
  "code": 200,
  "status": "success",
  "message": "brand has been moved to archived",
  "data": { }
}
```

---

### `PATCH /api/v1/brands/restore/:brandId`
Restore a brand from the archive.

**Response `200`**
```json
{
  "code": 200,
  "status": "success",
  "message": "brand has been restored (unarchived)",
  "data": { }
}
```

---

### `PATCH /api/v1/brands/status/:brandId`
Update only the status of a brand.

**Request Body**

| Field    | Type     | Required | Description                                           |
|----------|----------|----------|-------------------------------------------------------|
| `status` | `string` | Yes      | `"active"` or `"inactive"` or `"archive"` |

```json
{
  "status": "active"
}
```

**Response `200`**
```json
{
  "code": 200,
  "status": "success",
  "message": "brand status has been updated to active",
  "data": { }
}
```

---

## Categories

### `GET /api/v1/categories`
Retrieve a paginated list of categories.

**Request**
```http
GET /api/v1/categories?page=1&limit=10
```

**Response `200`**
```json
{
  "status": "success",
  "meta": { "total": 8, "page": 1, "limit": 10, "totalPages": 1 },
  "data": [
    {
      "id": "category_id",
      "name": "Electronics",
      "slug": "electronics",
      "status": "active",
      "products": 30,
      "isArchived": false,
      "archivedAt": null
    }
  ]
}
```

---

### `POST /api/v1/categories`
Create a new category.

**Request Body**

| Field    | Type     | Required | Description                                        |
|----------|----------|----------|----------------------------------------------------|
| `name`   | `string` | Yes      | 3–30 characters                                    |
| `status` | `string` | No       | `"active"` or `"inactive"` (default: `"inactive"`) |

```json
{
  "name": "Electronics",
  "status": "active"
}
```

**Response `201`**
```json
{
  "code": 201,
  "status": "success",
  "message": "category has been created",
  "data": { }
}
```

---

### `GET /api/v1/categories/:categoryId`
Get a single category by ID.

**Response `200`**
```json
{
  "code": 200,
  "status": "success",
  "data": { }
}
```

---

### `PATCH /api/v1/categories/:categoryId`
Update category name and/or status. All fields are optional.

**Request Body**
```json
{
  "name": "Clothing",
  "status": "inactive"
}
```

**Response `200`**
```json
{
  "code": 200,
  "status": "success",
  "message": "category has been updated",
  "data": { }
}
```

---

### `DELETE /api/v1/categories/:categoryId`
Permanently delete a category.

**Response `200`**
```json
{
  "code": 200,
  "status": "success",
  "message": "category has been deleted permanently",
  "data": { }
}
```

---

### `PATCH /api/v1/categories/archive/:categoryId`
Move a category to the archive.

**Response `200`**
```json
{
  "code": 200,
  "status": "success",
  "message": "category has been moved to archived",
  "data": { }
}
```

---

### `PATCH /api/v1/categories/restore/:categoryId`
Restore a category from the archive.

**Response `200`**
```json
{
  "code": 200,
  "status": "success",
  "message": "category has been restored (unarchived)",
  "data": { }
}
```

---

### `PATCH /api/v1/categories/status/:categoryId`
Update only the status of a category.

**Request Body**

| Field    | Type     | Required | Description                                              |
|----------|----------|----------|----------------------------------------------------------|
| `status` | `string` | Yes      | `"active"` or `"inactive"` or `"archive"` |

```json
{
  "status": "inactive"
}
```

**Response `200`**
```json
{
  "code": 200,
  "status": "success",
  "message": "category status has been updated to inactive",
  "data": { }
}
```

---

## Status Transitions

Both Brands and Categories follow the same state machine:

```
inactive ──► active
inactive ──► archive
active   ──► inactive
active   ──► archive
archive  ──► active  (only exit from archive)
```

| Current Status | Allowed Next Status   |
|----------------|-----------------------|
| `active`       | `inactive`, `archive` |
| `inactive`     | `active`, `archive`   |
| `archive`      | `active`              |

> Sending an invalid status transition will return a `400` error.

---

## Error Handling

### Common Error Response Shape
```json
{
  "code": 400,
  "status": "error",
  "message": "Validation failed",
  "errors": [ ]
}
```

### HTTP Status Codes

| Code  | Meaning                           |
|-------|-----------------------------------|
| `200` | OK — request succeeded            |
| `201` | Created — resource created        |
| `400` | Bad Request — validation failed   |
| `404` | Not Found — resource not found    |
| `500` | Internal Server Error             |

---

## Quick Code Examples (fetch)

### List all brands
```js
const res = await fetch('http://localhost:8000/api/v1/brands?page=1&limit=10');
const data = await res.json();
console.log(data.data); // array of brands
```

### Create a category
```js
const res = await fetch('http://localhost:8000/api/v1/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Electronics', status: 'active' }),
});
const data = await res.json();
console.log(data.data); // newly created category
```

### Update brand status
```js
const brandId = 'your-brand-id';
const res = await fetch(`http://localhost:8000/api/v1/brands/status/${brandId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'active' }),
});
const data = await res.json();
```

### Archive a category
```js
const categoryId = 'your-category-id';
const res = await fetch(`http://localhost:8000/api/v1/categories/archive/${categoryId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
});
const data = await res.json();
```
