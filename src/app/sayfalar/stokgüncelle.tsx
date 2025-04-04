"use client";
import React, { useState, useEffect } from "react";
    


{/* Çok istiyor iseniz kategori yi başka şekilde ayarlayabilirsiniz ben id ye göre yaptım çünkü üşendim :) :) :) */}



const StokListe = () => {
    interface Product {
        product_id: number;
        barcode: string;
        product_name: string;
        category_id: number;
        stock_quantity: number;
        price_in_dollars: number;
        category_name?: string; // Kategori adı isteğe bağlı
    }

    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<{ category_id: number; category_name: string }[]>([]);

    useEffect(() => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Ürünleri çekerken hata oluştu:", err));
    }, []);

    useEffect(() => {
        fetch("/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Kategori verileri çekilemedi:", err));
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (key: keyof Product) => {
        const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
        setSortKey(key);
        setSortOrder(order);
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
    };

    const handleUpdateProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            fetch(`/api/upgrade/${editingProduct.product_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingProduct),
            })
                .then(res => res.json())
                .then(() => {
                    setProducts(prevProducts =>
                        prevProducts.map(product =>
                            product.product_id === editingProduct.product_id ? editingProduct : product
                        )
                    );
                    setEditingProduct(null);
                })
                .catch(err => console.error("Ürün güncellenirken hata oluştu:", err));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingProduct) {
            const { name, value } = e.target;
            setEditingProduct({
                ...editingProduct,
                [name]: value,
            });
        }
    };

    const filteredProducts = products.filter(product =>
        Object.values(product).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedProducts = sortKey ? [...filteredProducts].sort((a, b) => {
        const valueA = a[sortKey as keyof Product];
        const valueB = b[sortKey as keyof Product];
        if (typeof valueA === "number" && typeof valueB === "number") {
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
        } else {
            return sortOrder === "asc" ? String(valueA).localeCompare(String(valueB)) : String(valueB).localeCompare(String(valueA));
        }
    }) : filteredProducts;

    return (
        <div className="p-6 bg-transparent text-white min-h-screen flex justify-center">
            <div className="w-4/5 flex gap-6">
                {/* Product Table Section */}
                <div className="w-2/3 overflow-x-auto">
                    <h1 className="text-4xl font-extrabold mb-6">Ürün Listesi</h1>
                    <input
                        type="text"
                        placeholder="Ürün ara..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-3 mb-6 rounded-lg bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <table className="w-full border-collapse border border-gray-700 shadow-lg rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-800 text-blue-300">
                                {[
                                    { key: "product_id", label: "ID" },
                                    { key: "barcode", label: "Barkod" },
                                    { key: "product_name", label: "Ürün Adı" },
                                    { key: "category_id", label: "Kategori" },
                                    { key: "stock_quantity", label: "Stok" },
                                    { key: "price_in_dollars", label: "Fiyat" },
                                    { key: "edit", label: "Düzenle" },
                                ].map(({ key, label }) => (
                                    <th
                                        key={key}
                                        className="border border-gray-600 p-3 cursor-pointer hover:bg-gray-700 transition"
                                        onClick={() => key !== "edit" && handleSort(key as keyof Product)}
                                    >
                                        {label} {sortKey === key && (sortOrder === "asc" ? "▲" : "▼")}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProducts.map(product => (
                                <tr key={product.product_id} className="bg-gray-900 hover:bg-gray-800 transition">
                                    <td className="border border-gray-700 p-3 text-center">{product.product_id}</td>
                                    <td className="border border-gray-700 p-3 text-center">{product.barcode}</td>
                                    <td className="border border-gray-700 p-3 text-center">{product.product_name}</td>
                                    <td className="border border-gray-700 p-3 text-center">{product.category_name || "Bilinmeyen Kategori"}</td>
                                    <td className="border border-gray-700 p-3 text-center">{product.stock_quantity}</td>
                                    <td className="border border-gray-700 p-3 text-center">${product.price_in_dollars}</td>
                                    <td className="border border-gray-700 p-3 text-center">
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-4 rounded"
                                        >
                                            Düzenle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Edit Form & Category Table Section */}
                {editingProduct && (
                    <div className="w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-blue-400 text-center">Ürün Güncelle</h2>
                        <form onSubmit={handleUpdateProduct} className="space-y-3">
                            <input
                                type="text"
                                name="product_name"
                                value={editingProduct.product_name}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ürün Adı"
                            />
                            <input
                                type="text"
                                name="barcode"
                                value={editingProduct.barcode}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Barkod"
                            />
                            <input
                                type="number"
                                name="category_id"
                                value={editingProduct.category_id}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Kategori ID"
                            />
                            <input
                                type="number"
                                name="stock_quantity"
                                value={editingProduct.stock_quantity}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Stok Miktarı"
                            />
                            <input
                                type="number"
                                name="price_in_dollars"
                                value={editingProduct.price_in_dollars}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Fiyat ($)"
                            />
                            <button
                                type="submit"
                                className="w-full bg-green-500 hover:bg-green-700 text-white py-3 px-4 rounded font-bold transition"
                            >
                                Güncelle
                            </button>
                        </form>

                        {/* Category Table Section */}
                        <div className="mt-6 w-full bg-transparent p-4 rounded-lg shadow-lg">
                            <table className="min-w-full table-auto border-collapse text-left">
                                <thead className="bg-gray-800 text-blue-300">
                                    <tr>
                                        <th className="p-2">Kategori ID</th>
                                        <th className="p-2">Kategori Adı</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-900 text-white">
                                    {categories.map((category) => (
                                        <tr key={category.category_id}>
                                            <td className="p-2">{category.category_id}</td>
                                            <td className="p-2">{category.category_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StokListe;
