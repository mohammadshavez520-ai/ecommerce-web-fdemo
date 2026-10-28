"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  X,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Check,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Percent,
  Layers,
  ListChecks,
  Users,
  Truck,
  BarChart3,
  Lock,
  Unlock,
  FileText,
  ChevronRight,
  Upload,
  Eye,
  Tag,
  Boxes,
  CreditCard,
  AlertTriangle,
  Loader2,
  Star,
  ArrowUpRight,
  User,
  EyeOff,
  LogOut,
  Key,
  Shield,
  Database,
} from "lucide-react";
import {
  Product,
  Order,
  Customer,
  Category,
  SalesStats,
  OrderStatus,
  PaymentStatus,
  ProductIngredient,
  ProductDescriptionSection,
} from "@/lib/types";
import { ShopifyRichEditor } from "@/components/admin/ShopifyRichEditor";
import { RichMarkdownView } from "@/components/admin/RichMarkdownView";
import { slugify } from "@/lib/utils";

type AdminTab = "analytics" | "products" | "categories" | "orders" | "customers";

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<{ username: string; name: string; role: string } | null>(null);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");

  // Core Data States
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  // Customer Drawer / Details State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Order Details / Tracking Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderTrackingForm, setOrderTrackingForm] = useState({
    status: "Pending" as OrderStatus,
    payment_status: "Pending" as PaymentStatus,
    courier_partner: "Delhivery Surface",
    tracking_number: "",
    estimated_delivery: "",
    notes: "",
  });

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
  });

  // Product Modal & Rich Builder State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<{
    name: string;
    slug: string;
    tagline: string;
    sku: string;
    category: string;
    category_id: string;
    price: string;
    original_price: string;
    discount_percent: string;
    stock_quantity: string;
    in_stock: boolean;
    badge: string;
    image_url: string;
    images: string[];
    description: string;
    description_sections: ProductDescriptionSection[];
    description_images: string[];
    highlights: string[];
    dosage: string;
    ingredients_list: ProductIngredient[];
  }>({
    name: "",
    slug: "",
    tagline: "",
    sku: "",
    category: "Full Kit",
    category_id: "",
    price: "",
    original_price: "",
    discount_percent: "0",
    stock_quantity: "100",
    in_stock: true,
    badge: "",
    image_url: "",
    images: [],
    description: "",
    description_sections: [],
    description_images: [],
    highlights: [],
    dosage: "",
    ingredients_list: [],
  });

  // Direct Cloudinary Upload & Drag-and-Drop State
  const [uploading, setUploading] = useState(false);
  const [isDragOverMedia, setIsDragOverMedia] = useState(false);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const categoryFileInputRef = useRef<HTMLInputElement>(null);

  // Supabase One-Click Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  // 1. Check Authentication on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("hv_admin_token");
        const res = await fetch("/api/admin/auth", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
          fetchData();
        } else {
          setIsAuthenticated(false);
          setAdminUser(null);
        }
      } catch {
        setIsAuthenticated(false);
        setAdminUser(null);
      } finally {
        setAuthChecking(false);
      }
    };
    checkAuth();
  }, []);

  const getAuthHeaders = (includeContentType = true): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("hv_admin_token") : null;
    const headers: Record<string, string> = {};
    if (includeContentType) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // 2. Fetch All Admin Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const authHeaders = getAuthHeaders(false);
      const [statsRes, productsRes, categoriesRes, ordersRes, customersRes] = await Promise.all([
        fetch("/api/analytics", { headers: authHeaders }),
        fetch("/api/products", { headers: authHeaders }),
        fetch("/api/categories", { headers: authHeaders }),
        fetch("/api/orders", { headers: authHeaders }),
        fetch("/api/customers", { headers: authHeaders }),
      ]);

      const [statsData, productsData, categoriesData, ordersData, customersData] = await Promise.all([
        statsRes.json(),
        productsRes.json(),
        categoriesRes.json(),
        ordersRes.json(),
        customersRes.json(),
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (productsData.success) setProducts(productsData.products);
      if (categoriesData.success) setCategories(categoriesData.categories);
      if (ordersData.success) setOrders(ordersData.orders);
      if (customersData.success) setCustomers(customersData.customers);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);

    }
  };

  // Handle Login with Username & Password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem("hv_admin_token", data.token);
        setIsAuthenticated(true);
        setAdminUser(data.user);
        setAdminPassword("");
        fetchData();
      } else {
        setAuthError(data.error || "Invalid administrator credentials. Access denied.");
      }
    } catch {
      setAuthError("Failed to authenticate with database. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("hv_admin_token");
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setAdminUser(null);
    setAdminPassword("");
  };

  // Sync Local Products & Categories to Supabase Live
  const handleSyncSupabase = async () => {
    setIsSyncing(true);
    setSyncMessage("");
    try {
      const token = localStorage.getItem("hv_admin_token");
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage(`✓ ${data.message || "Synced successfully!"}`);
        fetchData();
      } else {
        setSyncMessage(`✕ Sync Notice: ${data.error || data.message}`);
      }
    } catch (err: any) {
      setSyncMessage(`✕ Error: ${err?.message || "Sync failed"}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(""), 7000);
    }
  };

  // Image File Uploader to Cloudinary/Local
  const handleFileUpload = async (file: File, target: "primary" | "gallery" | "category") => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: getAuthHeaders(false),
        body: fd,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (target === "primary") {
          setProductForm((prev) => ({
            ...prev,
            image_url: data.url,
            images: prev.images.includes(data.url) ? prev.images : [data.url, ...prev.images],
          }));
        } else if (target === "gallery") {
          setProductForm((prev) => {
            const combined = [...prev.images, data.url];
            return {
              ...prev,
              images: combined,
              image_url: prev.image_url || data.url,
            };
          });
        } else if (target === "category") {
          setCategoryForm((prev) => ({ ...prev, image_url: data.url }));
        }
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  // Direct Batch Image Uploader to Cloudinary
  const handleBatchImageUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: getAuthHeaders(false),
          body: fd,
        });
        const data = await res.json();
        return data.success && data.url ? (data.url as string) : null;
      });


      const results = await Promise.all(uploadPromises);
      const validUrls = results.filter((url): url is string => Boolean(url));

      if (validUrls.length > 0) {
        setProductForm((prev) => {
          const combined = [...prev.images, ...validUrls];
          return {
            ...prev,
            images: combined,
            image_url: prev.image_url || combined[0] || "",
          };
        });
      } else {
        alert("Failed to upload image(s). Please check network or file format.");
      }
    } catch (err) {
      console.error("Batch image upload error:", err);
      alert("Error uploading image files");
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setProductForm((prev) => {
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        image_url: updated.length > 0 ? updated[0] : "",
      };
    });
  };

  const makePrimaryImage = (indexToMakePrimary: number) => {
    setProductForm((prev) => {
      if (indexToMakePrimary < 0 || indexToMakePrimary >= prev.images.length) return prev;
      const target = prev.images[indexToMakePrimary];
      const rest = prev.images.filter((_, idx) => idx !== indexToMakePrimary);
      const updated = [target, ...rest];
      return {
        ...prev,
        images: updated,
        image_url: target,
      };
    });
  };

  const moveImageOrder = (fromIdx: number, toIdx: number) => {
    setProductForm((prev) => {
      if (toIdx < 0 || toIdx >= prev.images.length) return prev;
      const copy = [...prev.images];
      const [item] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, item);
      return {
        ...prev,
        images: copy,
        image_url: copy[0] || "",
      };
    });
  };

  /* =========================================================
     CATEGORY ACTIONS
  ========================================================= */
  const openCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "",
        image_url: cat.image_url || "",
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        slug: "",
        description: "",
        image_url: "",
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("hv_admin_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(categoryForm),
        });
        const data = await res.json();
        if (data.success) {
          setIsCategoryModalOpen(false);
          fetchData();
        } else {
          alert(data.error || "Failed to update category");
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers,
          body: JSON.stringify(categoryForm),
        });
        const data = await res.json();
        if (data.success) {
          setIsCategoryModalOpen(false);
          fetchData();
        } else {
          alert(data.error || "Failed to create category");
        }
      }
    } catch (err) {
      console.error("Category save error:", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("hv_admin_token") : null;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Failed to delete category");
      }
    } catch (err) {
      console.error("Category delete error:", err);
    }
  };

  /* =========================================================
     PRODUCT ACTIONS & DISCOUNT CALCULATOR
  ========================================================= */
  const openProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      const saveAmt = Math.max(0, prod.original_price - prod.price);
      const discPct = prod.original_price > 0 ? Math.round((saveAmt / prod.original_price) * 100) : 0;

      // Extract existing description or format existing sections if any
      let combinedDesc = prod.description || "";
      if (prod.description_sections && prod.description_sections.length > 0) {
        const sectionsMd = prod.description_sections
          .map((s) => {
            if (s.type === "heading" && s.title) return `## ${s.title}\n`;
            if (s.type === "text" && s.content) return `${s.content}\n`;
            if (s.type === "callout") return `> **${s.title || "Note"}**: ${s.content || ""}\n`;
            if (s.type === "list" && s.items) return `${s.title ? `### ${s.title}\n` : ""}${s.items.map((it) => `- ${it}`).join("\n")}\n`;
            if (s.type === "image" && s.image_url) return `![${s.title || "Product Detail"}](${s.image_url})\n`;
            return "";
          })
          .filter(Boolean)
          .join("\n");

        if (!combinedDesc) {
          combinedDesc = sectionsMd;
        } else if (!combinedDesc.includes(prod.description_sections[0]?.title || "___never___")) {
          combinedDesc = `${combinedDesc}\n\n${sectionsMd}`.trim();
        }
      }

      const prodImages =
        prod.images && prod.images.length > 0 ? prod.images : prod.image_url ? [prod.image_url] : [];

      setProductForm({
        name: prod.name,
        slug: prod.slug || slugify(prod.name),
        tagline: prod.tagline || "",
        sku: prod.sku || `LEA-${prod.id.toUpperCase()}`,
        category: prod.category || "Men's Vitality & Stamina",
        category_id: prod.category_id || "",
        price: String(prod.price),
        original_price: String(prod.original_price),
        discount_percent: String(discPct),
        stock_quantity: String(prod.stock_quantity ?? 100),
        in_stock: prod.in_stock,
        badge: prod.badge || "",
        image_url: prodImages[0] || prod.image_url || "",
        images: prodImages,
        description: combinedDesc,
        description_sections: prod.description_sections || [],
        description_images: prod.description_images || [],
        highlights:
          prod.highlights && prod.highlights.length > 0
            ? prod.highlights
            : [
                "100% Pure Standardized Ayurvedic Extracts",
                "Non-Hormonal & Pure Herbal Formula",
                "Laboratory Quality Tested & Standardized",
                "Visible Enduring Results with Zero Steroids",
              ],
        dosage:
          prod.dosage ||
          "Take 1 capsule or 1 scoop powder twice daily with warm water or milk after meals. Consistent usage for 60-90 days recommended.",
        ingredients_list:
          prod.ingredients_list && prod.ingredients_list.length > 0
            ? prod.ingredients_list
            : [
                { name: "Shuddha Shilajit", amount: "150mg", purpose: "Stamina & cellular ATP energy" },
                { name: "Ashwagandha Extract", amount: "200mg", purpose: "Vitality & stress reduction" },
                { name: "Safed Musli Extract", amount: "100mg", purpose: "Deep tissue strength & nourishment" },
                { name: "Gurmar Extract", amount: "150mg", purpose: "Pancreatic support & sugar control" },
              ],
      });
    } else {
      setEditingProduct(null);
      const defaultDesc = `# Premium Ayurvedic Wellness Formulation

Leafora Herbal Private Limited produces authentic remedies formulated with 100% standardized botanicals. Independently tested for maximum biological potency with zero steroids or chemicals.

## Key Benefits
- **Pure Botanical Power**: Standardized Ayurvedic herbs tested for active phyto-nutrients.
- **Lab-Tested Quality**: 100% Herbal, strictly tested, zero steroids or synthetic hormones.
- **Deep Bioavailability**: Formulated with synergistic natural herbs for smooth digestion.
- **Zero Side Effects**: Safe for long-term daily consumption.

## Recommended Daily Routine
1. Take morning dose 30 minutes before or after breakfast with warm water or milk.
2. Take evening dose 30 minutes before or after dinner.
3. Continue consistently for 60-90 days for peak sustained results.
`;

      const initialImgs = [
        "/products/josh-1000.jpg",
        "/products/time-master-combo.jpg",
      ];

      setProductForm({
        name: "",
        slug: "",
        tagline: "100% Ayurvedic Formula · Lab-Tested Purity",
        sku: `LEA-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        category: categories.length > 0 ? categories[0].name : "Men's Vitality & Stamina",
        category_id: categories.length > 0 ? categories[0].id : "cat-vitality",
        price: "899",
        original_price: "2999",
        discount_percent: "70",
        stock_quantity: "200",
        in_stock: true,
        badge: "★ Best Seller",
        image_url: initialImgs[0],
        images: initialImgs,
        description: defaultDesc,
        description_sections: [],
        description_images: [],
        highlights: [
          "100% Pure Standardized Ayurvedic Extracts",
          "Non-Hormonal & Pure Herbal Formula",
          "Laboratory Quality Tested & Standardized",
          "Visible Enduring Results with Zero Steroids",
        ],
        dosage:
          "Take 1 capsule or 1 scoop powder twice daily with warm water or milk after meals. Consistent usage for 60-90 days recommended.",
        ingredients_list: [
          { name: "Shuddha Shilajit", amount: "150mg", purpose: "Stamina & cellular ATP energy" },
          { name: "Ashwagandha Extract", amount: "200mg", purpose: "Vitality & stress reduction" },
          { name: "Safed Musli Extract", amount: "100mg", purpose: "Deep tissue strength & nourishment" },
          { name: "Gurmar Extract", amount: "150mg", purpose: "Pancreatic support & sugar control" },
        ],
      });
    }
    setIsProductModalOpen(true);
  };



  // Pricing & Discount Synchronizer
  const handlePriceChange = (val: string) => {
    const p = Number(val);
    const orig = Number(productForm.original_price);
    let pct = "0";
    if (orig > 0 && p > 0 && orig >= p) {
      pct = String(Math.round(((orig - p) / orig) * 100));
    }
    setProductForm((prev) => ({
      ...prev,
      price: val,
      discount_percent: pct,
    }));
  };

  const handleOriginalPriceChange = (val: string) => {
    const orig = Number(val);
    const p = Number(productForm.price);
    let pct = productForm.discount_percent;
    if (orig > 0 && p > 0 && orig >= p) {
      pct = String(Math.round(((orig - p) / orig) * 100));
    }
    setProductForm((prev) => ({
      ...prev,
      original_price: val,
      discount_percent: pct,
    }));
  };

  const handleDiscountPercentChange = (val: string) => {
    const pct = Number(val);
    const orig = Number(productForm.original_price);
    let finalPrice = productForm.price;
    if (orig > 0) {
      finalPrice = String(Math.round(orig * (1 - pct / 100)));
    }
    setProductForm((prev) => ({
      ...prev,
      discount_percent: val,
      price: finalPrice,
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = Number(productForm.price);
    const origNum = Number(productForm.original_price || productForm.price);
    const saveAmt = Math.max(0, origNum - priceNum);
    const discPct = origNum > 0 ? Math.round((saveAmt / origNum) * 100) : 0;

    const finalSlug = productForm.slug.trim()
      ? slugify(productForm.slug)
      : slugify(productForm.name);

    const payload = {
      name: productForm.name.trim(),
      slug: finalSlug,
      tagline: productForm.tagline.trim(),
      sku: productForm.sku.trim(),
      category: productForm.category,
      category_id: productForm.category_id || undefined,
      price: priceNum,
      original_price: origNum,
      save_amount: saveAmt,
      discount_percent: discPct,
      stock_quantity: Number(productForm.stock_quantity || 100),
      in_stock: productForm.in_stock,
      badge: productForm.badge.trim(),
      image_url: productForm.images[0] || productForm.image_url,
      images: productForm.images.length > 0 ? productForm.images : [productForm.image_url],
      description: productForm.description,
      description_sections: productForm.description_sections,
      description_images: productForm.description_images,
      highlights: productForm.highlights.filter((h) => h.trim().length > 0),
      dosage: productForm.dosage.trim(),
      ingredients_list: productForm.ingredients_list.filter((ing) => ing.name.trim().length > 0),
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: getAuthHeaders(true),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsProductModalOpen(false);
          fetchData();
        } else {
          alert(data.error || "Failed to update product");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: getAuthHeaders(true),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsProductModalOpen(false);
          fetchData();
        } else {
          alert(data.error || "Failed to create product");
        }
      }
    } catch (err) {
      console.error("Product save error:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(false),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      console.error("Product delete error:", err);
    }
  };

  /* =========================================================
     ORDER & DELIVERY ACTIONS
  ========================================================= */
  const openOrderModal = (ord: Order) => {
    setSelectedOrder(ord);
    setOrderTrackingForm({
      status: ord.status,
      payment_status: ord.payment_status || (ord.payment_method === "Prepaid" ? "Paid" : "Pending"),
      courier_partner: ord.courier_partner || "Delhivery Surface",
      tracking_number: ord.tracking_number || "",
      estimated_delivery: ord.estimated_delivery || "",
      notes: ord.notes || "",
    });
    setIsOrderModalOpen(true);
  };

  const handleUpdateOrderTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(true),
        body: JSON.stringify(orderTrackingForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsOrderModalOpen(false);
        fetchData();
      } else {
        alert(data.error || "Failed to update order");

      }
    } catch (err) {
      console.error("Order update error:", err);
    }
  };

  /* =========================================================
     FILTERED LISTS
  ========================================================= */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));
      const matchCategory = categoryFilter === "All" || p.category === categoryFilter;
      const matchStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" && p.in_stock) ||
        (stockFilter === "Low Stock" && (p.stock_quantity ?? 100) <= 20) ||
        (stockFilter === "Out of Stock" && !p.in_stock);
      return matchSearch && matchCategory && matchStock;
    });
  }, [products, searchQuery, categoryFilter, stockFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.product_name.toLowerCase().includes(q);
      const matchStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, orderStatusFilter]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        c.city.toLowerCase().includes(q)
      );
    });
  }, [customers, searchQuery]);

  // 1. Session Checking State
  if (authChecking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-[#16341f] text-emerald-400 flex items-center justify-center shadow-lg animate-pulse mb-4 ring-4 ring-emerald-50">
          <Lock className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-2.5 text-sm font-bold text-gray-700">
          <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
          <span>Verifying administrator session from database...</span>
        </div>
      </div>
    );
  }

  // 2. Database Login Screen Gate (If unauthenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-700 via-[#16341f] to-emerald-600" />

          {/* Header */}
          <div className="text-center space-y-2 pt-2">
            <div className="h-16 w-52 mx-auto flex items-center justify-center mb-1">
              <img
                src="/logo.png"
                alt="Leafora Herbal Private Limited"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Shield className="w-3 h-3 text-emerald-600" />
              <span>Protected Merchant Portal</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Store Administrator Sign In
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              Direct database verification. Enter your administrator username and password to manage Leafora Herbal Private Limited.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Enter username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium text-gray-900 transition bg-gray-50/50 hover:bg-white"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter administrator password..."
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium text-gray-900 transition bg-gray-50/50 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 transition cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl bg-[#16341f] hover:bg-[#0f2415] active:scale-[0.99] text-white font-black text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>Verifying Credentials with Database...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-emerald-400" />
                  <span>Sign In to Management Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className="text-center pt-2 border-t border-gray-100">
            <span className="text-[11px] text-gray-400 flex items-center justify-center gap-1 font-medium">
              <Lock className="w-3 h-3 text-emerald-600" />
              Direct DB verification · HMAC-SHA256 signed session tokens
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Bar with Navigation Tabs and Quick Actions */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full xl:w-auto gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                Shopify-Grade Control Center
              </span>
              <span className="text-xs text-gray-400">· Next.js 15 + Supabase</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Store Administration &amp; Operations
            </h1>
          </div>

          {/* Logged in Admin User Badge & Sign Out Button */}
          <div className="flex items-center gap-2.5 bg-white px-3.5 py-1.5 rounded-2xl border border-gray-200 shadow-xs self-start sm:self-auto">
            <div className="w-8 h-8 rounded-xl bg-[#16341f] text-emerald-300 flex items-center justify-center font-black text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-900 leading-tight">
                {adminUser?.name || adminUser?.username || "Admin"}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                {adminUser?.role || "Administrator"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out of Admin Panel"
              className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition border border-red-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-gray-200/80 p-1 rounded-2xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "analytics"
                ? "bg-white text-emerald-950 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "products"
                ? "bg-white text-emerald-950 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Package className="w-4 h-4 text-emerald-700" />
            <span>Products ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "categories"
                ? "bg-white text-emerald-950 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Categories ({categories.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "orders"
                ? "bg-white text-emerald-950 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-700" />
            <span>Orders &amp; Delivery ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "customers"
                ? "bg-white text-emerald-950 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Customers ({customers.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          TAB 1: DASHBOARD & DEEP REALTIME ANALYTICS
      ========================================================= */}
      {activeTab === "analytics" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Top 6 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                Total Revenue
              </span>
              <h3 className="text-2xl font-black text-[#16341f] mt-1">
                ₹{stats ? stats.totalRevenue.toLocaleString("en-IN") : "0"}
              </h3>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> Real-time Sales
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                Total Orders
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">
                {stats ? stats.totalOrders : 0}
              </h3>
              <span className="text-[11px] text-blue-700 font-bold block mt-1">
                Lifetime Bookings
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                Unique Customers
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">
                {stats ? stats.totalCustomers : customers.length}
              </h3>
              <span className="text-[11px] text-purple-700 font-bold block mt-1">
                Verified Buyers
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                Avg. Order Value
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">
                ₹{stats ? stats.averageOrderValue.toLocaleString("en-IN") : "0"}
              </h3>
              <span className="text-[11px] text-gray-500 font-medium block mt-1">
                Per checkout
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider block">
                Pending Dispatch
              </span>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                {stats ? stats.pendingOrders : 0}
              </h3>
              <span className="text-[11px] text-amber-700 font-bold block mt-1">
                Needs attention
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider block">
                Low Stock Alerts
              </span>
              <h3 className="text-2xl font-black text-rose-600 mt-1">
                {stats ? stats.lowStockCount : 0}
              </h3>
              <span className="text-[11px] text-rose-700 font-bold block mt-1">
                ≤ 20 units remaining
              </span>
            </div>
          </div>

          {/* Interactive 14-Day Revenue Chart & Realtime Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SVG Daily Revenue Chart (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    Revenue &amp; Booking Timeline (Last 14 Days)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Live daily transaction volume and order metrics.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200">
                  Daily Sync Active
                </span>
              </div>

              {/* Responsive SVG Bar Chart */}
              <div className="h-60 w-full pt-4 flex items-end justify-between gap-1 sm:gap-2">
                {stats?.dailyRevenue.map((d, idx) => {
                  const maxRev = Math.max(...(stats.dailyRevenue.map((r) => r.revenue) || [10000]), 10000);
                  const heightPct = Math.max(8, Math.round((d.revenue / maxRev) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-20 shadow-lg">
                        {d.date}: ₹{d.revenue.toLocaleString("en-IN")} ({d.orders} orders)
                      </div>

                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full max-w-[28px] rounded-t-xl transition-all duration-300 group-hover:brightness-110 ${
                          d.revenue > 0
                            ? "bg-gradient-to-t from-[#16341f] to-emerald-500 shadow-xs"
                            : "bg-gray-100"
                        }`}
                      />
                      <span className="text-[9px] text-gray-400 font-bold truncate max-w-[36px]">
                        {d.date.split(" ")[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Categories Breakdown (4 cols) */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-base font-black text-gray-900">Category Share</h3>
              <p className="text-xs text-gray-500">Sales distribution across product lines.</p>

              <div className="space-y-3 pt-2">
                {stats?.categoryPerformance.map((c, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-extrabold text-gray-900">
                      <span>{c.category}</span>
                      <span className="text-emerald-800">₹{c.revenue.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{
                          width: `${Math.min(100, Math.round((c.revenue / (stats.totalRevenue || 1)) * 100))}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 font-semibold block">
                      {c.count} items sold
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Selling Products & Inventory Alert Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Selling Products (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-gray-900">Top Performing Products</h3>
                <button
                  onClick={() => setActiveTab("products")}
                  className="text-xs font-bold text-emerald-800 hover:underline"
                >
                  View Catalog &rarr;
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {stats?.topSellingProducts.map((p, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 p-1 flex items-center justify-center shrink-0">
                        <img src={p.image_url} alt={p.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gray-900">{p.name}</h4>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {p.salesCount} units ordered
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-[#16341f] block">
                        ₹{p.revenue.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Top Seller
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Low Stock Watchlist (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  <h3 className="text-base font-black text-gray-900">Inventory Alerts</h3>
                </div>
                <span className="text-xs text-gray-400">Restock Recommended</span>
              </div>

              <div className="space-y-2.5">
                {products
                  .filter((p) => (p.stock_quantity ?? 100) <= 250)
                  .slice(0, 4)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-black text-gray-900">{p.name}</h4>
                        <span className="text-[10px] text-gray-500 font-mono">SKU: {p.sku || "N/A"}</span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-full ${
                            (p.stock_quantity ?? 100) <= 20
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.stock_quantity ?? 100} in stock
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: PRODUCTS MANAGEMENT & RICH BUILDER
      ========================================================= */}
      {activeTab === "products" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Actions & Filters Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900">Product Catalog Management</h2>
              <p className="text-xs text-gray-500">
                Create products, configure multi-image galleries, automated discount pricing &amp; Shopify-like rich descriptions.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleSyncSupabase}
                disabled={isSyncing}
                title="Synchronize Leafora products and categories with Supabase database"
                className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSyncing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                ) : (
                  <Database className="w-3.5 h-3.5 text-emerald-700" />
                )}
                <span>{isSyncing ? "Syncing..." : "Sync to Supabase"}</span>
              </button>

              <button
                onClick={() => openProductModal()}
                className="px-4 py-2.5 rounded-xl bg-[#16341f] hover:bg-[#0f2415] text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Product</span>
              </button>
            </div>
          </div>

          {syncMessage && (
            <div
              className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
                syncMessage.startsWith("✓")
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                  : "bg-amber-50 border border-amber-300 text-amber-900"
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>{syncMessage}</span>
            </div>
          )}

          {/* Search, Category & Stock Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
              >
                <option value="All">All Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
              >
                <option value="All">All Stock Levels</option>
                <option value="In Stock">In Stock Only</option>
                <option value="Low Stock">Low Stock (≤ 20)</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const saveAmt = Math.max(0, p.original_price - p.price);
              const discPct =
                p.discount_percent ||
                (p.original_price > 0 ? Math.round((saveAmt / p.original_price) * 100) : 0);

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="relative h-44 rounded-2xl bg-gray-50 flex items-center justify-center p-2 mb-3">
                      {p.badge && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-700 text-white">
                          {p.badge}
                        </span>
                      )}
                      <span
                        className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.in_stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.in_stock ? `${p.stock_quantity ?? 100} in stock` : "Out of Stock"}
                      </span>
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-gray-400 font-semibold">{p.sku || "NO-SKU"}</span>
                      <span className="font-extrabold text-emerald-800 uppercase tracking-wide">
                        {p.category}
                      </span>
                    </div>

                    <h3 className="font-black text-base text-gray-900 mt-1">{p.name}</h3>
                    <p className="text-xs text-gray-500 font-medium truncate">{p.tagline}</p>

                    {/* Pricing Box */}
                    <div className="mt-3 p-3 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-[#16341f]">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                        <del className="text-xs text-gray-400">
                          ₹{p.original_price.toLocaleString("en-IN")}
                        </del>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                        Save ₹{saveAmt} ({discPct}% OFF)
                      </span>
                    </div>

                    {/* Photos & Description Indicators */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-gray-100 text-[10px] text-gray-500 font-bold">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        📷 {p.images?.length || 1} Photos
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                        ✍ Shopify Description
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-100">
                    <button
                      onClick={() => openProductModal(p)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#16341f] font-extrabold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Edit</span>
                    </button>
                    <Link
                      href={`/product/${p.slug || p.id}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                      title="View Live Store Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: CATEGORIES MANAGEMENT
      ========================================================= */}
      {activeTab === "categories" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900">Product Categories</h2>
              <p className="text-xs text-gray-500">
                Organize your catalog with structured collections, custom slugs, and banners.
              </p>
            </div>

            <button
              onClick={() => openCategoryModal()}
              className="px-4 py-2.5 rounded-xl bg-[#16341f] hover:bg-[#0f2415] text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 rounded-2xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center mb-3 overflow-hidden">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <Layers className="w-10 h-10 text-emerald-800/40" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-gray-400">/{cat.slug}</span>
                    <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {cat.product_count ?? 0} Products
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-gray-900 mt-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {cat.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-100">
                  <button
                    onClick={() => openCategoryModal(cat)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: ORDERS & DELIVERY FULFILLMENT
      ========================================================= */}
      {activeTab === "orders" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900">Orders &amp; Delivery Management</h2>
              <p className="text-xs text-gray-500">
                Track full booking info, update carrier tracking numbers, and manage delivery statuses.
              </p>
            </div>

            <button
              onClick={fetchData}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Orders</span>
            </button>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders by customer name, order #, phone, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Pending", "Processing", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    orderStatusFilter === st
                      ? "bg-[#16341f] text-white shadow-xs"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-black uppercase tracking-wider">
                    <th className="py-3.5 px-4">Order ID &amp; Date</th>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4">Delivery Address</th>
                    <th className="py-3.5 px-4">Product &amp; Qty</th>
                    <th className="py-3.5 px-4">Payment &amp; Amount</th>
                    <th className="py-3.5 px-4">Tracking &amp; Status</th>
                    <th className="py-3.5 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400 font-semibold">
                        No orders found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/60 transition">
                        <td className="py-4 px-4 align-top">
                          <span className="font-mono font-black text-gray-900 block text-sm">
                            {ord.order_number}
                          </span>
                          <span className="text-[11px] text-gray-400 block mt-0.5">
                            {new Date(ord.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="font-extrabold text-gray-900">{ord.customer_name}</div>
                          <div className="text-emerald-700 font-mono font-semibold flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{ord.customer_phone}</span>
                          </div>
                          {ord.customer_email && (
                            <div className="text-[11px] text-gray-400">{ord.customer_email}</div>
                          )}
                        </td>

                        <td className="py-4 px-4 align-top max-w-[200px]">
                          <div className="text-gray-800 font-medium leading-relaxed">
                            {ord.address}
                          </div>
                          <div className="text-[11px] text-gray-500 font-bold mt-0.5">
                            {ord.city}, {ord.state} - {ord.pincode}
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <span className="font-extrabold text-gray-900 block">
                            {ord.product_name}
                          </span>
                          <span className="text-[11px] text-gray-500 font-semibold">
                            Qty: {ord.quantity}
                          </span>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="font-black text-sm text-[#16341f]">
                            ₹{ord.total_amount.toLocaleString("en-IN")}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                ord.payment_method === "Prepaid"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {ord.payment_method}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                                ord.payment_status === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : ord.payment_status === "Refunded"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {ord.payment_status || "Pending"}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-black ${
                              ord.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : ord.status === "Shipped" || ord.status === "Out for Delivery"
                                ? "bg-blue-100 text-blue-800"
                                : ord.status === "Processing" || ord.status === "Confirmed"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.status}
                          </span>
                          {ord.tracking_number && (
                            <span className="text-[10px] text-gray-500 font-mono block mt-1">
                              {ord.courier_partner}: {ord.tracking_number}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 align-top">
                          <button
                            onClick={() => openOrderModal(ord)}
                            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-emerald-50 hover:text-emerald-900 font-extrabold text-xs transition cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 5: CUSTOMER DIRECTORY & LIFETIME VALUE
      ========================================================= */}
      {activeTab === "customers" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900">Customer Management</h2>
              <p className="text-xs text-gray-500">
                Complete directory of customers, contact info, total spend, and order history.
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customers by name, phone, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-black uppercase tracking-wider">
                    <th className="py-3.5 px-4">Customer Name</th>
                    <th className="py-3.5 px-4">Contact Phone</th>
                    <th className="py-3.5 px-4">Delivery Location</th>
                    <th className="py-3.5 px-4">Total Orders</th>
                    <th className="py-3.5 px-4">Total Spending</th>
                    <th className="py-3.5 px-4">Last Order Date</th>
                    <th className="py-3.5 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400 font-semibold">
                        No customer profiles found.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-gray-50/60 transition">
                        <td className="py-4 px-4 font-black text-gray-900 text-sm">
                          {cust.name}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-emerald-800">
                          {cust.phone}
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {cust.city}, {cust.state}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-800">
                            {cust.total_orders} Orders
                          </span>
                        </td>
                        <td className="py-4 px-4 font-black text-sm text-[#16341f]">
                          ₹{cust.total_spent.toLocaleString("en-IN")}
                        </td>
                        <td className="py-4 px-4 text-gray-500">
                          {cust.last_order_date
                            ? new Date(cust.last_order_date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-emerald-50 hover:text-emerald-900 font-extrabold text-xs transition cursor-pointer"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: SHOPIFY-STYLE PRODUCT CREATOR / EDITOR
      ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-6xl bg-[#f8faf9] rounded-3xl shadow-2xl border border-gray-200 my-6 max-h-[94vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  {editingProduct ? "Product Editor" : "New Catalog Item"}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {editingProduct ? `Edit: ${editingProduct.name}` : "Create New Product"}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  className="px-5 py-2.5 rounded-xl bg-[#16341f] hover:bg-[#0f2415] text-white text-xs font-black shadow-md hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{editingProduct ? "Save Changes" : "Save Product"}</span>
                </button>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Body: 2-Column Shopify Layout */}
            <form id="product-modal-form" onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* =========================================
                    LEFT COLUMN: Title, Long Description, Media (8 of 12 cols)
                ========================================= */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Card 1: Basic Information & Storefront URL */}
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h4 className="text-base font-black text-gray-900">
                          Basic Information &amp; Storefront URL
                        </h4>
                        <p className="text-xs text-gray-500">
                          Product title, custom URL slug, and subtitle shown on the storefront.
                        </p>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Essential
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1.5 tracking-wider">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Josh 1000 Capsule (30 Capsules)"
                        value={productForm.name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setProductForm((prev) => ({
                            ...prev,
                            name: newName,
                            slug: !prev.slug || prev.slug === slugify(prev.name) ? slugify(newName) : prev.slug,
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1.5 tracking-wider flex items-center justify-between">
                        <span>Product URL Handle (Slug) *</span>
                        <span className="text-[11px] font-semibold text-emerald-700">Canonical: /product/[product-name]</span>
                      </label>
                      <div className="flex items-center rounded-2xl border border-gray-300 bg-gray-50 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:bg-white transition overflow-hidden">
                        <span className="px-3.5 py-2.5 text-xs font-bold text-gray-500 bg-gray-100 border-r border-gray-300 select-none">
                          /product/
                        </span>
                        <input
                          type="text"
                          placeholder="height-veda-kit"
                          value={productForm.slug}
                          onChange={(e) => setProductForm({ ...productForm, slug: slugify(e.target.value) })}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold text-emerald-900 bg-transparent focus:outline-none font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Live address: <span className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md text-[10px]">/product/{productForm.slug || slugify(productForm.name) || "product-name"}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">
                          Tagline / Subtitle
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Powder + 60 Capsules + 60 Tablets"
                          value={productForm.tagline}
                          onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">
                          Ribbon Badge (e.g. ★ Best Seller)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ★ Featured Kit"
                          value={productForm.badge}
                          onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Section 1 — Growth Benefits & Rich Overview (PDP Tab 1) */}
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          PDP Tab 1
                        </span>
                        <h4 className="text-base font-black text-gray-900 mt-1">
                          Growth Benefits &amp; Product Description
                        </h4>
                        <p className="text-xs text-gray-500">
                          Main body text displayed in the Growth Benefits tab on the website product page.
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        Shopify Rich Editor
                      </span>
                    </div>

                    <ShopifyRichEditor
                      value={productForm.description}
                      onChange={(val) => setProductForm((prev) => ({ ...prev, description: val }))}
                      placeholder="Write product description here with headings, bullet points, benefits, routine instructions, and images..."
                      minHeight="380px"
                    />
                  </div>



                  {/* Card 3: Media & Showcase Photos */}
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          PDP Media
                        </span>
                        <h4 className="text-base font-black text-gray-900 mt-1">
                          Media &amp; Product Gallery
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Direct Cloudinary CDN upload. Drag &amp; drop photos or browse. The first image is the primary store thumbnail.
                        </p>
                      </div>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        {productForm.images.length} {productForm.images.length === 1 ? "Image" : "Images"}
                      </span>
                    </div>

                    {/* Direct Drag & Drop Dropzone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOverMedia(true);
                      }}
                      onDragLeave={() => setIsDragOverMedia(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOverMedia(false);
                        if (e.dataTransfer.files?.length) {
                          handleBatchImageUpload(e.dataTransfer.files);
                        }
                      }}
                      onClick={() => galleryFileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                        isDragOverMedia
                          ? "border-emerald-600 bg-emerald-50/80 scale-[1.01]"
                          : "border-gray-300 hover:border-emerald-600 hover:bg-gray-50/80 bg-gray-50/40"
                      }`}
                    >
                      <input
                        ref={galleryFileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.length) {
                            handleBatchImageUpload(e.target.files);
                          }
                        }}
                      />

                      {uploading ? (
                        <div className="flex flex-col items-center justify-center py-4 space-y-2">
                          <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
                          <p className="text-sm font-black text-emerald-900">
                            Uploading directly to Cloudinary CDN...
                          </p>
                          <p className="text-xs text-gray-500">Optimizing resolution for fast delivery</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">
                              Click to upload or drag &amp; drop product photos
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Cloudinary Direct Upload • PNG, JPG, WEBP, AVIF up to 10MB each
                            </p>
                          </div>
                          <div className="pt-1">
                            <span className="inline-block px-4 py-2 rounded-xl bg-[#16341f] text-white text-xs font-bold shadow-xs hover:bg-emerald-900 transition">
                              Browse Files
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Uploaded Gallery Grid */}
                    {productForm.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                        {productForm.images.map((img, idx) => (
                          <div
                            key={idx}
                            className={`relative rounded-2xl border p-2 bg-white flex flex-col items-center group transition shadow-xs ${
                              idx === 0 ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-gray-200"
                            }`}
                          >
                            {idx === 0 && (
                              <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#16341f] text-white text-[10px] font-black shadow-xs flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> Primary
                              </span>
                            )}
                            <div className="w-full h-28 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mb-2">
                              <img src={img} alt={`Product photo ${idx + 1}`} className="w-full h-full object-contain" />
                            </div>

                            {/* Action Bar below thumbnail */}
                            <div className="w-full flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                              {idx !== 0 ? (
                                <button
                                  type="button"
                                  onClick={() => makePrimaryImage(idx)}
                                  className="text-[11px] font-extrabold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                                >
                                  Make Primary
                                </button>
                              ) : (
                                <span className="text-[11px] text-gray-400 font-semibold">Cover</span>
                              )}

                              <div className="flex items-center gap-1">
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => moveImageOrder(idx, idx - 1)}
                                    className="p-1 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer font-bold"
                                    title="Move Left"
                                  >
                                    ‹
                                  </button>
                                )}
                                {idx < productForm.images.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => moveImageOrder(idx, idx + 1)}
                                    className="p-1 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer font-bold"
                                    title="Move Right"
                                  >
                                    ›
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeGalleryImage(idx)}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition cursor-pointer"
                                  title="Remove Photo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-gray-50 rounded-2xl border border-gray-200">
                        <p className="text-xs text-gray-500 font-medium">
                          No images uploaded yet. Drag &amp; drop product photos or click Browse above.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* =========================================
                    RIGHT COLUMN: Status, Category, Pricing, Inventory (4 of 12 cols)
                ========================================= */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Card 1: Status & Category */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-4">
                    <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider">
                      Product Status &amp; Visibility
                    </h4>

                    {/* In Stock Toggle Switch */}
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-gray-900 block">
                          {productForm.in_stock ? "In Stock & Active" : "Draft / Out of Stock"}
                        </span>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {productForm.in_stock ? "Visible for purchase on website" : "Hidden from checkout"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, in_stock: !productForm.in_stock })}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          productForm.in_stock ? "bg-[#16341f]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            productForm.in_stock ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Category
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => {
                          const matched = categories.find((c) => c.name === e.target.value);
                          setProductForm({
                            ...productForm,
                            category: e.target.value,
                            category_id: matched?.id || "",
                          });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-300 text-xs sm:text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Promotional Badge (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ★ Best Seller"
                        value={productForm.badge}
                        onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-300 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Card 2: Pricing & Automated Discount Calculator */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-4">
                    <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider">
                      Pricing &amp; Discounts
                    </h4>

                    {/* Live Calculation Banner */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-black uppercase text-emerald-900 block tracking-wider">
                        Live Price Calculation:
                      </span>
                      <p className="text-xs font-bold text-emerald-800 mt-1">
                        Customer Saves: ₹
                        {(
                          Math.max(0, Number(productForm.original_price || 0) - Number(productForm.price || 0))
                        ).toLocaleString("en-IN")}{" "}
                        ({productForm.discount_percent}% OFF)
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Original Price / MRP (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="6896"
                          value={productForm.original_price}
                          onChange={(e) => handleOriginalPriceChange(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Discount Percentage (%)
                        </label>
                        <input
                          type="number"
                          placeholder="64"
                          value={productForm.discount_percent}
                          onChange={(e) => handleDiscountPercentChange(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-300 text-sm font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Selling / Discounted Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="2499"
                          value={productForm.price}
                          onChange={(e) => handlePriceChange(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-300 text-sm font-black text-[#16341f] focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Quick Discount Shortcuts */}
                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-gray-400 block mb-1.5">Quick Discounts:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[20, 35, 50, 60, 64, 70].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => handleDiscountPercentChange(String(pct))}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-100 text-gray-800 text-xs font-bold transition cursor-pointer"
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Inventory & SKU */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-4">
                    <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider">
                      Inventory &amp; SKU
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Stock Keeping Unit (SKU)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. LEA-JOSH-1000"
                        value={productForm.sku}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-300 text-xs sm:text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Inventory Available Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="100"
                        value={productForm.stock_quantity}
                        onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-300 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Stock automatically decrements upon confirmed orders.</span>
                    </div>
                  </div>
                </div>
              </div>

            </form>

            {/* Modal Bottom Docked Footer */}
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between shrink-0 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition cursor-pointer"
              >
                Discard Changes
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  form="product-modal-form"
                  className="px-6 py-2.5 rounded-xl bg-[#16341f] hover:bg-[#0f2415] text-white font-black text-xs transition shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{editingProduct ? "Save Product Changes" : "Create Product"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: CATEGORY CREATOR / EDITOR
      ========================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-gray-900 mb-1">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Define collection name, URL slug, and optional banner image.
            </p>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Kit"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. full-kit"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Category Showcase Image
                </label>
                {categoryForm.image_url ? (
                  <div className="relative rounded-2xl border border-gray-200 p-2 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={categoryForm.image_url}
                        alt="Category preview"
                        className="w-14 h-14 object-cover rounded-xl bg-white border border-gray-200"
                      />
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">Uploaded Category Photo</span>
                        <span className="text-[11px] text-emerald-700 font-semibold">Active on Storefront</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-xs font-bold text-gray-700 cursor-pointer transition">
                        <span>Change</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "category");
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, image_url: "" })}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 hover:border-emerald-600 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50/60 hover:bg-emerald-50/40 transition">
                    <Upload className="w-6 h-6 text-emerald-800 mb-1" />
                    <span className="text-xs font-bold text-gray-900">Click to upload category banner image</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">Direct Cloudinary upload • PNG, JPG, WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "category");
                      }}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Category purpose and overview..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#16341f] text-white font-black text-sm"
                >
                  {editingCategory ? "Save Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: ORDER DETAILS & DELIVERY STATUS MANAGER
      ========================================================= */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-4 mb-5">
              <span className="text-xs font-mono font-bold text-gray-400">Order ID: {selectedOrder.order_number}</span>
              <h3 className="text-xl font-black text-gray-900 mt-1">Delivery &amp; Tracking Management</h3>
            </div>

            <form onSubmit={handleUpdateOrderTracking} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Delivery Fulfillment Status *
                  </label>
                  <select
                    value={orderTrackingForm.status}
                    onChange={(e) =>
                      setOrderTrackingForm({ ...orderTrackingForm, status: e.target.value as OrderStatus })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-extrabold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={orderTrackingForm.payment_status}
                    onChange={(e) =>
                      setOrderTrackingForm({
                        ...orderTrackingForm,
                        payment_status: e.target.value as PaymentStatus,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-extrabold"
                  >
                    <option value="Pending">Pending (Unpaid)</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BlueDart Express, Delhivery"
                    value={orderTrackingForm.courier_partner}
                    onChange={(e) =>
                      setOrderTrackingForm({ ...orderTrackingForm, courier_partner: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    AWB / Tracking Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BD-8921034"
                    value={orderTrackingForm.tracking_number}
                    onChange={(e) =>
                      setOrderTrackingForm({ ...orderTrackingForm, tracking_number: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Estimated Delivery Date Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Expected delivery by Friday, 24 Oct"
                  value={orderTrackingForm.estimated_delivery}
                  onChange={(e) =>
                    setOrderTrackingForm({ ...orderTrackingForm, estimated_delivery: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Dispatch Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions for delivery associate..."
                  value={orderTrackingForm.notes}
                  onChange={(e) => setOrderTrackingForm({ ...orderTrackingForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#16341f] text-white font-black text-xs"
                >
                  Update Order Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          DRAWER / MODAL: CUSTOMER PROFILE & ORDER HISTORY
      ========================================================= */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-4 mb-4">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                Verified Customer Profile
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-2">{selectedCustomer.name}</h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedCustomer.phone}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Total Orders</span>
                <span className="text-xl font-black text-gray-900 block mt-0.5">
                  {selectedCustomer.total_orders}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Total Spent</span>
                <span className="text-xl font-black text-[#16341f] block mt-0.5">
                  ₹{selectedCustomer.total_spent.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mb-5 space-y-1 text-xs">
              <span className="font-bold text-gray-400 uppercase text-[10px]">Primary Delivery Address:</span>
              <p className="font-semibold text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
                {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} - {selectedCustomer.pincode}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase text-gray-500 mb-2">Order History Timeline</h4>
              <div className="space-y-2">
                {selectedCustomer.recent_orders?.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-gray-900">{ord.order_number}</span>
                      <span className="text-gray-500 block text-[11px]">{ord.product_name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-[#16341f] block">
                        ₹{ord.total_amount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
