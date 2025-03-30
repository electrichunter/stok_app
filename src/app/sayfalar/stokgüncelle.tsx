"use client";
import React, { useState, useEffect } from "react";

const StokListe = () => {
    interface Product {
        product_id: number;
        product_name: string;
        category_id: number;
        stock_quantity: number;
        price_in_dollars: number;
    }

    const [latestProducts, setLatestProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetch("/api/products/GETLatest")
            .then(res => res.json())
            .then(data => setLatestProducts(data))
            .catch(err => console.error("Son ürünleri çekerken hata oluştu:", err));
    }, []);

    const fetchAllProducts = () => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => {
                setAllProducts(data);
                setShowAll(true);
            })
            .catch(err => console.error("Tüm ürünleri çekerken hata oluştu:", err));
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
    };

    const handleUpdateProduct = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingProduct) {
            fetch(`/api/products/${editingProduct.product_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editingProduct)
            })
            .then(res => res.json())
            .then(data => {
                console.log("Ürün başarıyla güncellendi", data);
                setEditingProduct(null);
                // Güncellediğiniz ürünü listeye yansıtın
                setAllProducts(prevProducts => 
                    prevProducts.map(product => 
                        product.product_id === editingProduct.product_id ? editingProduct : product
                    )
                );
            })
            .catch(err => console.error("Ürün güncellenirken hata oluştu:", err));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingProduct) {
            const { name, value } = e.target;
            setEditingProduct({
                ...editingProduct,
                [name]: value
            });
        }
    };

    return (
        <div className="p-6 bg-gray-800 text-white">
            <h1 className="text-3xl font-bold mb-4">Ürün Listesi</h1>
            <table className="w-full border-collapse border border-gray-700">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="border border-gray-600 p-2">ID</th>
                        <th className="border border-gray-600 p-2">Ürün Adı</th>
                        <th className="border border-gray-600 p-2">Kategori</th>
                        <th className="border border-gray-600 p-2">Stok</th>
                        <th className="border border-gray-600 p-2">Fiyat</th>
                        <th className="border border-gray-600 p-2">Güncelle</th>
                    </tr>
                </thead>
                <tbody>
                    {(showAll ? allProducts : latestProducts).map(product => (
                        <tr key={product.product_id} className="bg-gray-600">
                            <td className="border border-gray-500 p-2">{product.product_id}</td>
                            <td className="border border-gray-500 p-2">{product.product_name}</td>
                            <td className="border border-gray-500 p-2">{product.category_id}</td>
                            <td className="border border-gray-500 p-2">{product.stock_quantity}</td>
                            <td className="border border-gray-500 p-2">${product.price_in_dollars}</td>
                            <td className="border border-gray-500 p-2">
                                <button 
                                    onClick={() => handleEditClick(product)}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-4 rounded"
                                >
                                    Güncelle
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {!showAll && (
                <button
                    onClick={fetchAllProducts}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Tüm Ürünleri Göster
                </button>
            )}

            {editingProduct && (
                <div className="mt-6 bg-gray-700 p-4 rounded">
                    <h2 className="text-xl font-bold mb-4">Ürün Güncelle</h2>
                    <form onSubmit={handleUpdateProduct}>
                        <div className="mb-4">
                            <label className="block text-gray-200">Ürün Adı</label>
                            <input
                                type="text"
                                name="product_name"
                                value={editingProduct.product_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-500 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-200">Kategori</label>
                            <input
                                type="number"
                                name="category_id"
                                value={editingProduct.category_id}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-500 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-200">Stok Miktarı</label>
                            <input
                                type="number"
                                name="stock_quantity"
                                value={editingProduct.stock_quantity}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-500 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-200">Fiyat</label>
                            <input
                                type="number"
                                name="price_in_dollars"
                                value={editingProduct.price_in_dollars}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-500 rounded"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Güncelle
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StokListe;
