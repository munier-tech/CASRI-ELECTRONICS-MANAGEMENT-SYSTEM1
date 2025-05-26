import dayjs from "dayjs";
import History from "../models/historyModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";


// added to the frontend


export const addProductToDailySales = async (req, res) => {
  try {
    const { name, price, description, category, quantity } = req.body;
    const userId = req.user._id;

    if (!name || !price || !description || !quantity) {
      return res.status(400).json({ message: "fadlan buuxi dhamaan meelaha baanan." });
    }

    const NoOfQuantity = parseInt(quantity, 10);
    if (isNaN(NoOfQuantity) || NoOfQuantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number." });
    }

    const pricedNumber = parseFloat(price , 10);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number." });
    }

    const total = price * NoOfQuantity; // 👈 total calculation

    const newProduct = new Product({
      name,
      price : pricedNumber,
      description,
      category,
      quantity: NoOfQuantity,
      user: userId,
      date: dayjs().startOf('day').toDate()
    });

    await newProduct.save();

    await History.findOneAndUpdate(
      { user: userId, date: dayjs().startOf('day').toDate() },
      {
        $push: {
          products: {
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            productId: newProduct._id,
            category: newProduct.category,
            quantity: newProduct.quantity,
            total: total // 👈 store total in history
          },
        },
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Product successfully added to daily sales.",
      product: {
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        quantity: newProduct.quantity,
        total: total,
        user: newProduct.user,
        _id: newProduct._id,
        createdAt: newProduct.createdAt,
        updatedAt: newProduct.updatedAt
      }
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: error.message });
  }
};



// added

export const getAllDailyProducts = async (req, res) => {
  try {
    // Get the start and end of today
    const startOfDay = dayjs().startOf('day').toDate();
    const endOfDay = dayjs().endOf('day').toDate();

    // Fetch products sold today
    const products = await Product.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products were sold today" });
    }

    const total = products.reduce((sum , product) => {
      return sum + (product.price * product.quantity);
    }, 0)

    res.status(200).json({ message: "Today's products fetched successfully", products , total });
  } catch (error) {
    console.error("Error in getAllDailyProducts:", error);
    res.status(500).json({ message: error.message });
  }
};





export const getUsersDailyProducts = async (req, res) => {
  try {
    // Get today's date (00:00:00 to 23:59:59)
    const today = dayjs().startOf("day").toDate();
    const tomorrow = dayjs().endOf("day").toDate();

    // Fetch all users with role 'employee' or 'admin'
    const users = await User.find({ role: { $in: ["employee", "admin"] } });

    // Map through the users and fetch their products for today
    const results = await Promise.all(
      users.map(async (user) => {
        const products = await Product.find({
          user: user._id,
          createdAt: { $gte: today, $lt: tomorrow },
        });

        return {
          username: user.username,
          role: user.role,
          products,
        };
      })
    );

    // Filter out empty product lists
    const filteredResults = results.filter((result) => result.products.length > 0);

    // If no products found
    if (filteredResults.length === 0) {
      return res.status(404).json({ message: "No products found for any user today" });
    }

    res.status(200).json({
      message: "Daily products fetched successfully",
      data: filteredResults,
    });
  } catch (error) {
    console.error("Error in getUsersDailyProducts:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// added

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    if (!name && !description && !price) {
      return res.status(400).json({ message: "At least one product field is required." });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.updatedAt = Date.now();

    await product.save();

    res.status(201).json({ message: "Product successfully updated.", product });
  } catch (error) {
    console.error("Error in updating product:", error);
    res.status(500).json({ message: error.message });
  }
};

// added

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    console.error("Error in deleting product:", error);
    res.status(500).json({ message: error.message });
  }
};

// added to the frontend 

export const getMyDailyProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get the start and end of today
    const startOfDay = dayjs().startOf("day").toDate();
    const endOfDay = dayjs().endOf("day").toDate();

    // Query for products added today
    const products = await Product.find({
      user: userId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for today" });
    }

    const total = products.reduce((sum , product) => {
      return sum + (product.price * product.quantity);
    }, 0)

    res.status(200).json({ message: "Today's products fetched successfully", products , total });
  } catch (error) {
    console.error("Error in fetching daily products:", error.message);
    res.status(500).json({ message: error.message });
  }
};