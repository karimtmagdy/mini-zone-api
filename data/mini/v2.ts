/*
 

 

// ===== Product Routes =====
app.get('/products', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  
  const { products, totalCount } = await getProducts(page, limit);
  
  // Response: {
  //   status: 'success',
  //   data: [{ id: 1, name: 'Product 1', price: 100 }, ...],
  //   totalCount: 150,
  //   page: 1,
  //   limit: 20,
  //   totalPages: 8
  // }
  return ResponseHandler.paginated(res, products, totalCount, page, limit);
});

 

// ===== Order Routes =====
app.get('/orders/:id', async (req, res) => {
  const order = await getOrderById(req.params.id);
  
  // Response: { 
  //   status: 'success', 
  //   data: { 
  //     id: 1, 
  //     items: [...], 
  //     total: 500, 
  //     status: 'pending' 
  //   } 
  // }
  return ResponseHandler.success(res, order);
});

// ===== Statistics Route =====
app.get('/dashboard/stats', async (req, res) => {
  const stats = await getDashboardStats();
  
  // Response: {
  //   status: 'success',
  //   data: {
  //     totalUsers: 1000,
  //     totalProducts: 500,
  //     totalOrders: 2500,
  //     revenue: 150000
  //   },
  //   timestamp: '2024-...'
  // }
  return ResponseHandler.success(
    res, 
    stats, 
    'Stats retrieved',
    { timestamp: new Date().toISOString() }
  );
});
 */
