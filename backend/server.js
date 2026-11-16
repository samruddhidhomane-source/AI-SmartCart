require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const {
  authenticateToken,
  requireAdmin,
} = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Backend status
app.get("/", (req, res) => {
  res.send("AI SmartCart Backend is running 🚀");
});

// GET ALL PRODUCTS - public
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (error, results) => {
    if (error) {
      console.error("Fetch products error:", error);
      return res.status(500).json({
        message: "Error fetching products",
      });
    }

    res.json(results);
  });
});

// GET ONE PRODUCT FROM MYSQL - public
app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  db.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error("Fetch product error:", error);
        return res.status(500).json({
          message: "Error fetching product",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json(results[0]);
    }
  );
});

// ADMIN ONLY - ADD PRODUCT
app.post(
  "/api/products",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const {
      name,
      category,
      brand,
      price,
      old_price,
      rating,
      reviews,
      stock,
      description,
      image,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        message: "A product name and valid price are required.",
      });
    }

    const sql = `
      INSERT INTO products
      (name, category, brand, price, old_price, rating,
       reviews, stock, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name.trim(),
      category || null,
      brand || null,
      Number(price),
      old_price === "" || old_price == null ? null : Number(old_price),
      rating === "" || rating == null ? null : Number(rating),
      reviews === "" || reviews == null ? 0 : Number(reviews),
      stock === "" || stock == null ? 0 : Number(stock),
      description || null,
      image || null,
    ];

    db.query(sql, values, (error, result) => {
      if (error) {
        console.error("Add product error:", error);
        return res.status(500).json({
          message: "Could not add product.",
        });
      }

      res.status(201).json({
        message: "Product added successfully.",
        id: result.insertId,
      });
    });
  }
);

// ADMIN ONLY - UPDATE PRODUCT
const updateProduct = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  const allowedFields = [
    "name",
    "category",
    "brand",
    "price",
    "old_price",
    "rating",
    "reviews",
    "stock",
    "description",
    "image",
  ];

  const fields = [];
  const values = [];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      fields.push(`${field} = ?`);
      values.push(req.body[field] === "" ? null : req.body[field]);
    }
  }

  if (fields.length === 0) {
    return res.status(400).json({
      message: "No product fields provided to update.",
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(req.body, "name") &&
    (typeof req.body.name !== "string" || !req.body.name.trim())
  ) {
    return res.status(400).json({
      message: "Product name cannot be empty.",
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(req.body, "price") &&
    (
      req.body.price === "" ||
      req.body.price === null ||
      !Number.isFinite(Number(req.body.price)) ||
      Number(req.body.price) < 0
    )
  ) {
    return res.status(400).json({
      message: "Please provide a valid price.",
    });
  }

  values.push(id);

  db.query(
    `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
    values,
    (error, result) => {
      if (error) {
        console.error("Update product error:", error);
        return res.status(500).json({
          message: "Could not update product.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found.",
        });
      }

      res.json({
        message: "Product updated successfully.",
      });
    }
  );
};

app.put(
  "/api/products/:id",
  authenticateToken,
  requireAdmin,
  updateProduct
);

app.patch(
  "/api/products/:id",
  authenticateToken,
  requireAdmin,
  updateProduct
);

// ADMIN ONLY - DELETE PRODUCT
app.delete(
  "/api/products/:id",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    db.query(
      "DELETE FROM products WHERE id = ?",
      [id],
      (error, result) => {
        if (error) {
          console.error("Delete product error:", error);
          return res.status(500).json({
            message: "Could not delete product.",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Product not found.",
          });
        }

        res.json({
          message: "Product deleted successfully.",
        });
      }
    );
  }
);

// Get all registered users (admin only)
app.get(
  "/api/users",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const sql = `
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
    `;

    db.query(sql, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          message: "Failed to fetch users",
        });
      }

      res.json(results);
    });
  }
);


// Orders must be created only after verified payment.
app.post("/api/orders", authenticateToken, (req, res) => {
  res.status(410).json({
    message: "Please use the payment checkout process.",
  });
});

// GET all orders for the admin
app.get(
  "/api/orders",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const connection = db.promise();

      // Fetch orders with customer details
      const [orders] = await connection.query(`
        SELECT
          o.id,
          o.user_id,
          o.total_amount,
          o.status,
          o.shipping_name,
          o.shipping_phone,
          o.shipping_address,
          o.created_at,
          u.name AS customer_name,
          u.email AS customer_email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `);

      // Fetch products belonging to each order
      for (const order of orders) {
        const [items] = await connection.query(
          `SELECT
             id,
             product_id,
             product_name,
             quantity,
             price
           FROM order_items
           WHERE order_id = ?`,
          [order.id]
        );

        order.items = items;
      }

      res.json(orders);
    } catch (error) {
      console.error("Fetch orders error:", error);
      res.status(500).json({
        message: "Failed to fetch orders.",
      });
    }
  }
);

// UPDATE order status (admin only)
app.patch(
  "/api/orders/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (!Number.isInteger(orderId) || orderId <= 0) {
        return res.status(400).json({
          message: "Invalid order ID.",
        });
      }

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status.",
        });
      }

      const connection = db.promise();

      const [result] = await connection.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, orderId]
      );

      if (result.affectedRows === 0) {
        const [existing] = await connection.query(
          "SELECT id FROM orders WHERE id = ?",
          [orderId]
        );

        if (existing.length === 0) {
          return res.status(404).json({
            message: "Order not found.",
          });
        }
      }

      res.json({
        message: "Order status updated successfully!",
        status,
      });
    } catch (error) {
      console.error("Update order status error:", error);

      res.status(500).json({
        message: "Failed to update order status.",
      });
    }
  }
);

// ADMIN DASHBOARD STATISTICS
app.get(
  "/api/admin/stats",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const connection = db.promise();

      // Count total products
      const [productResult] = await connection.query(
        "SELECT COUNT(*) AS totalProducts FROM products"
      );

      // Count total orders
      const [orderResult] = await connection.query(
        "SELECT COUNT(*) AS totalOrders FROM orders"
      );

      // Count registered users
      const [userResult] = await connection.query(
        "SELECT COUNT(*) AS totalUsers FROM users WHERE role = 'user'"
      );

      // Calculate sales, excluding cancelled orders
      const [salesResult] = await connection.query(
        `SELECT COALESCE(SUM(total_amount), 0) AS totalSales
         FROM orders
         WHERE status != 'Cancelled'`
      );

      res.json({
        totalProducts: Number(productResult[0].totalProducts),
        totalOrders: Number(orderResult[0].totalOrders),
        totalUsers: Number(userResult[0].totalUsers),
        totalSales: Number(salesResult[0].totalSales),
      });
    } catch (error) {
      console.error("Dashboard statistics error:", error);

      res.status(500).json({
        message: "Failed to fetch dashboard statistics.",
      });
    }
  }
);

// CREATE RAZORPAY PAYMENT ORDER
app.post(
  "/api/payment/create-order",
  authenticateToken,
  async (req, res) => {
    try {
      const { items, shipping } = req.body;

      if (
        !Array.isArray(items) ||
        items.length === 0 ||
        !shipping?.name?.trim() ||
        !shipping?.phone?.trim() ||
        !shipping?.address?.trim() ||
        !shipping?.city?.trim() ||
        !shipping?.pincode?.trim()
      ) {
        return res.status(400).json({
          message: "Please provide cart items and all shipping details.",
        });
      }

      const quantities = new Map();

      for (const item of items) {
        const productId = Number(item.product_id);
        const quantity = Number(item.quantity);

        if (
          !Number.isInteger(productId) ||
          productId <= 0 ||
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          return res.status(400).json({
            message: "Invalid cart items.",
          });
        }

        quantities.set(
          productId,
          (quantities.get(productId) || 0) + quantity
        );
      }

      const productIds = [...quantities.keys()];
      const connection = db.promise();

      const [products] = await connection.query(
        "SELECT id, name, price, stock FROM products WHERE id IN (?)",
        [productIds]
      );

      if (products.length !== productIds.length) {
        return res.status(400).json({
          message: "Some products were not found.",
        });
      }

      let total = 0;

      for (const product of products) {
        const quantity = quantities.get(product.id);

        if (quantity > Number(product.stock)) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}.`,
          });
        }

        total += Number(product.price) * quantity;
      }

      const amountInPaise = Math.round(total * 100);

      if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
        return res.status(400).json({
          message: "Invalid payment amount.",
        });
      }

      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `smartcart_${Date.now()}`,
      });

      const shippingData = {
        name: shipping.name.trim(),
        phone: shipping.phone.trim(),
        address: shipping.address.trim(),
        city: shipping.city.trim(),
        pincode: shipping.pincode.trim(),
      };

      const orderItems = products.map((product) => ({
        product_id: product.id,
        quantity: quantities.get(product.id),
      }));

      await connection.query(
        `INSERT INTO payment_attempts
         (user_id, razorpay_order_id, amount, items, shipping)
         VALUES (?, ?, ?, ?, ?)`,
        [
          req.user.id,
          razorpayOrder.id,
          (amountInPaise / 100).toFixed(2),
          JSON.stringify(orderItems),
          JSON.stringify(shippingData),
        ]
      );

      res.json({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      console.error("Create payment order error:", error);

      res.status(500).json({
        message: "Unable to create payment order.",
      });
    }
  }
);

// VERIFY PAYMENT AND CREATE CUSTOMER ORDER
app.post(
  "/api/payment/verify",
  authenticateToken,
  async (req, res) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification details are missing.",
      });
    }

    const connection = db.promise();

    try {
      const [attempts] = await connection.query(
        `SELECT * FROM payment_attempts
         WHERE razorpay_order_id = ? AND user_id = ?`,
        [razorpay_order_id, req.user.id]
      );

      if (attempts.length === 0) {
        return res.status(404).json({
          message: "Payment attempt not found.",
        });
      }

      const attempt = attempts[0];

      // Return the existing order if this payment was already processed.
      if (attempt.status === "Paid" && attempt.order_id) {
        return res.json({
          message: "Payment was already verified.",
          orderId: attempt.order_id,
        });
      }

      if (attempt.status !== "Created") {
        return res.status(400).json({
          message: "This payment attempt cannot be processed.",
        });
      }

      // Verify Razorpay's payment signature.
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const received = Buffer.from(razorpay_signature, "hex");
      const expected = Buffer.from(expectedSignature, "hex");

      if (
        received.length !== expected.length ||
        !crypto.timingSafeEqual(received, expected)
      ) {
        return res.status(400).json({
          message: "Payment signature verification failed.",
        });
      }

      // Confirm the payment belongs to this order and is captured.
      const payment = await razorpay.payments.fetch(razorpay_payment_id);

      if (
        payment.order_id !== razorpay_order_id ||
        payment.status !== "captured" ||
        Number(payment.amount) !==
          Math.round(Number(attempt.amount) * 100) ||
        payment.currency !== "INR"
      ) {
        return res.status(400).json({
          message: "Payment has not been successfully captured.",
        });
      }

      let items =
        typeof attempt.items === "string"
          ? JSON.parse(attempt.items)
          : attempt.items;

      let shipping =
        typeof attempt.shipping === "string"
          ? JSON.parse(attempt.shipping)
          : attempt.shipping;

      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Stored payment items are invalid.");
      }

      await connection.beginTransaction();

      // Lock the payment attempt to prevent duplicate processing.
      const [lockedAttempts] = await connection.query(
        `SELECT * FROM payment_attempts
         WHERE id = ? AND status = 'Created'
         FOR UPDATE`,
        [attempt.id]
      );

      if (lockedAttempts.length === 0) {
        await connection.rollback();

        const [existing] = await connection.query(
          "SELECT order_id, status FROM payment_attempts WHERE id = ?",
          [attempt.id]
        );

        if (existing[0]?.status === "Paid") {
          return res.json({
            message: "Payment was already verified.",
            orderId: existing[0].order_id,
          });
        }

        return res.status(409).json({
          message: "Payment attempt is already being processed.",
        });
      }

      const quantities = new Map();

      for (const item of items) {
        const productId = Number(item.product_id);
        const quantity = Number(item.quantity);

        if (
          !Number.isInteger(productId) ||
          productId <= 0 ||
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          throw new Error("Stored cart items are invalid.");
        }

        quantities.set(
          productId,
          (quantities.get(productId) || 0) + quantity
        );
      }

      const productIds = [...quantities.keys()];

      const [products] = await connection.query(
        `SELECT id, name, price, stock
         FROM products
         WHERE id IN (?)
         FOR UPDATE`,
        [productIds]
      );

      if (products.length !== productIds.length) {
        throw new Error("One or more products are no longer available.");
      }

      let total = 0;

      for (const product of products) {
        const quantity = quantities.get(product.id);

        if (Number(product.stock) < quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}. Please contact support for your payment.`
          );
        }

        total += Number(product.price) * quantity;
      }

      if (Math.round(total * 100) !== Math.round(Number(attempt.amount) * 100)) {
        throw new Error("The cart amount has changed. Please contact support.");
      }

      const fullAddress = [
        shipping.address,
        shipping.city,
        shipping.pincode,
      ]
        .filter(Boolean)
        .join(", ");

      const [orderResult] = await connection.query(
        `INSERT INTO orders
         (user_id, total_amount, shipping_name,
          shipping_phone, shipping_address)
         VALUES (?, ?, ?, ?, ?)`,
        [
          req.user.id,
          total.toFixed(2),
          shipping.name,
          shipping.phone,
          fullAddress,
        ]
      );

      const newOrderId = orderResult.insertId;

      for (const product of products) {
        const quantity = quantities.get(product.id);

        const [stockResult] = await connection.query(
          `UPDATE products
           SET stock = stock - ?
           WHERE id = ? AND stock >= ?`,
          [quantity, product.id, quantity]
        );

        if (stockResult.affectedRows !== 1) {
          throw new Error(`Stock update failed for ${product.name}.`);
        }

        await connection.query(
          `INSERT INTO order_items
           (order_id, product_id, product_name, quantity, price)
           VALUES (?, ?, ?, ?, ?)`,
          [
            newOrderId,
            product.id,
            product.name,
            quantity,
            product.price,
          ]
        );
      }

      await connection.query(
        `UPDATE payment_attempts
         SET status = 'Paid',
             order_id = ?,
             payment_id = ?
         WHERE id = ?`,
        [newOrderId, razorpay_payment_id, attempt.id]
      );

      await connection.commit();

      res.status(201).json({
        message: "Payment verified and order placed successfully!",
        orderId: newOrderId,
        total: Number(total.toFixed(2)),
      });
    } catch (error) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Payment rollback error:", rollbackError);
      }

      console.error("Payment verification error:", error);

      res.status(500).json({
        message: error.message || "Payment verification failed.",
        paymentReceived: true,
        contactSupport: true,
      });
    }
  }
);
 
// AI PRODUCT RECOMMENDATIONS
app.get("/api/recommendations", (req, res) => {
  const sql = `
    SELECT *
    FROM products
    WHERE rating IS NOT NULL
    ORDER BY rating DESC, reviews DESC
    LIMIT 6
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Recommendation error:", error);

      return res.status(500).json({
        message: "Unable to fetch recommendations.",
      });
    }

    res.json(results);
  });
});


// PERSONALIZED PRODUCT RECOMMENDATIONS
app.get(
  "/api/recommendations/personalized",
  authenticateToken,
  async (req, res) => {
    try {
      const connection = db.promise();
      const userId = req.user.id;

      // Step 1: Find the customer's favourite categories
      const [categories] = await connection.query(
        `SELECT p.category, COUNT(*) AS purchase_count
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         JOIN products p ON oi.product_id = p.id
         WHERE o.user_id = ?
           AND o.status != 'Cancelled'
           AND p.category IS NOT NULL
         GROUP BY p.category
         ORDER BY purchase_count DESC
         LIMIT 3`,
        [userId]
      );

      let recommendations = [];

      // Step 2: Recommend products from purchased categories
      if (categories.length > 0) {
        const preferredCategories = categories.map(
          (item) => item.category
        );

        const [products] = await connection.query(
          `SELECT *
           FROM products
           WHERE category IN (?)
             AND rating IS NOT NULL
             AND id NOT IN (
               SELECT oi.product_id
               FROM orders o
               JOIN order_items oi ON o.id = oi.order_id
               WHERE o.user_id = ?
                 AND o.status != 'Cancelled'
             )
           ORDER BY rating DESC, reviews DESC
           LIMIT 6`,
          [preferredCategories, userId]
        );

        recommendations = products;
      }

      // Step 3: If no suitable products exist, show top-rated products
      if (recommendations.length === 0) {
        const [products] = await connection.query(
          `SELECT *
           FROM products
           WHERE rating IS NOT NULL
           ORDER BY rating DESC, reviews DESC
           LIMIT 6`
        );

        recommendations = products;
      }

      res.json(recommendations);
    } catch (error) {
      console.error("Personalized recommendation error:", error);

      res.status(500).json({
        message: "Unable to fetch personalized recommendations.",
      });
    }
  }
);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
