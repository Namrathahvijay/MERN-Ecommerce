import { createContext, useEffect, useMemo, useState } from "react";
import { products as staticProducts } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const currency = "₹";
  const delivery_fee = 10;

  useEffect(() => {
    // INFO: Load cart items from localStorage when the component mounts
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, []);

  useEffect(() => {
    // Load products from backend; fall back to static if request fails
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4001'
    const load = async () => {
      const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(String(id))
      const withFakeIds = (arr) => arr.map((p, idx) => ({
        ...p,
        _id: isValidObjectId(p._id) ? p._id : (idx + 1).toString(16).padStart(24, '0')
      }))
      try {
        const res = await fetch(`${baseUrl}/api/product/list`)
        const data = await res.json()
        if (data?.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products)
        } else {
          setProducts(withFakeIds(staticProducts))
        }
      } catch (_e) {
        const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(String(id))
        setProducts(withFakeIds(staticProducts))
      }
    }
    load()
  }, [])

  useEffect(() => {
    // Reconcile existing cart against loaded products; remove invalid product IDs
    if (!products || products.length === 0) return
    const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(String(id))
    const validIds = new Set(products.map(p => String(p._id)).filter(isValidObjectId))
    let changed = false
    const next = {}
    for (const pid in cartItems) {
      if (isValidObjectId(pid) && validIds.has(String(pid))) {
        next[pid] = cartItems[pid]
      } else {
        changed = true
      }
    }
    if (changed) {
      setCartItems(next)
    }
  }, [products])

  useEffect(() => {
    // INFO: Save cart items to localStorage whenever cartItems changes
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (itemId, size) => {
    const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(String(id))
    if (!isValidObjectId(itemId)) {
      toast.error("This product can't be ordered yet. Please try items from the store catalog.")
      return
    }
    if (!size) {
      toast.error("Please Select a Size");
      return;
    } else {
      toast.success("Item Added To The Cart");
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          // INFO: Error Handling
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    if (quantity === 0) {
      const productData = products.find((product) => product._id === itemId);
      toast.success("Item Removed From The Cart");
    }

    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => String(product._id) === String(items));
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0 && itemInfo) {
            totalAmount += Number(itemInfo.price || 0) * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    clearCart,
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
