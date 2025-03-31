"use client";
import React, { useState, useEffect } from "react";

const StokListe = () => {
    interface Product {
        product_id: number;
        barcode: string;
        product_name: string;
        category_id: number;
        stock_quantity: number;
        price_in_dollars: number;
    }

    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Ürünleri çekerken hata oluştu:", err));
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
        <div className="p-6 bg-gray-950 text-white min-h-screen flex flex-col items-center">
            <h1 className="text-4xl font-extrabold mb-6 text-blue-400">Ürün Listesi</h1>
            <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-3/4 p-3 mb-6 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="w-full max-w-6xl overflow-x-auto">
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
                                <td className="border border-gray-700 p-3 text-center">{product.category_id}</td>
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
            {editingProduct && (
            <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-blue-400 text-center">Ürün Güncelle</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-3">
                <input type="text" name="product_name" value={editingProduct.product_name} onChange={handleInputChange} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ürün Adı" />
                <input type="text" name="barcode" value={editingProduct.barcode} onChange={handleInputChange} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Barkod" />
                <input type="number" name="category_id" value={editingProduct.category_id} onChange={handleInputChange} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Kategori ID" />
                <input type="number" name="stock_quantity" value={editingProduct.stock_quantity} onChange={handleInputChange} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Stok Miktarı" />
                <input type="number" name="price_in_dollars" value={editingProduct.price_in_dollars} onChange={handleInputChange} className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Fiyat ($)" />
                <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white py-3 px-4 rounded font-bold transition">Güncelle</button>
            </form>
        </div>
            )}
        </div>
    );
};

export default StokListe;