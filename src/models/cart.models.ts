import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  totalItems: number;
  status: "active" | "checked_out" | "abandoned";
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  calculateTotal(): number;
  addItem(
    productId: mongoose.Types.ObjectId,
    quantity: number,
    price: number
  ): Promise<ICart>;
  removeItem(productId: mongoose.Types.ObjectId): Promise<ICart>;
  updateQuantity(
    productId: mongoose.Types.ObjectId,
    quantity: number
  ): Promise<ICart>;
  clearCart(): Promise<ICart>;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

// Calculate subtotal before saving cart item
cartItemSchema.pre<ICartItem>("save", function (next: any) {
  this.subtotal = this.price * this.quantity;
  next();
});

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      validate: {
        validator: function (items: ICartItem[]) {
          const productIds = items.map((item) => item.product.toString());
          return productIds.length === new Set(productIds).size;
        },
        message: "Duplicate products are not allowed in cart",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Total price cannot be negative"],
    },
    totalItems: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Total items cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "checked_out", "abandoned"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
      index: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hrs
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for finding active carts
cartSchema.index({ user: 1, status: 1 });

// Calculate total before saving
cartSchema.pre<ICart>("save", function (next: any) {
  if (this.isModified("items")) {
    this.totalPrice = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
  next();
});

// Method: Calculate total price
cartSchema.methods.calculateTotal = function (this: ICart): number {
  return this.items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );
};

// Method: Add item to cart
cartSchema.methods.addItem = async function (
  this: ICart,
  productId: mongoose.Types.ObjectId,
  quantity: number,
  price: number
): Promise<ICart> {
  const existingItemIndex = this.items.findIndex(
    (item: ICartItem) => item.product.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    // Update quantity if item already exists
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].subtotal =
      this.items[existingItemIndex].price *
      this.items[existingItemIndex].quantity;
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity,
      price,
      subtotal: price * quantity,
    });
  }

  return await this.save();
};

// Method: Remove item from cart
cartSchema.methods.removeItem = async function (
  this: ICart,
  productId: mongoose.Types.ObjectId
): Promise<ICart> {
  this.items = this.items.filter(
    (item: ICartItem) => item.product.toString() !== productId.toString()
  );
  return await this.save();
};

// Method: Update item quantity
cartSchema.methods.updateQuantity = async function (
  this: ICart,
  productId: mongoose.Types.ObjectId,
  quantity: number
): Promise<ICart> {
  const item = this.items.find(
    (item: ICartItem) => item.product.toString() === productId.toString()
  );

  if (!item) {
    throw new Error("Item not found in cart");
  }

  if (quantity <= 0) {
    return await this.removeItem(productId);
  }

  item.quantity = quantity;
  item.subtotal = item.price * quantity;

  return await this.save();
};

// Method: Clear all items from cart
cartSchema.methods.clearCart = async function (this: ICart): Promise<ICart> {
  this.items = [];
  this.totalPrice = 0;
  this.totalItems = 0;
  return await this.save();
};

// Static method: Find active cart for user
cartSchema.statics.findActiveCart = function (userId: mongoose.Types.ObjectId) {
  return this.findOne({ user: userId, status: "active" });
};

// Static method: Find or create cart
cartSchema.statics.findOrCreateCart = async function (
  userId: mongoose.Types.ObjectId
) {
  let cart = await this.findOne({ user: userId, status: "active" });

  if (!cart) {
    cart = await this.create({ user: userId, items: [] });
  }

  return cart;
};

// Virtual: Check if cart is empty
cartSchema.virtual("isEmpty").get(function () {
  return this.items.length === 0;
});

export default mongoose.model<ICart>("Cart", cartSchema);
