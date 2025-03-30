"use client";
import React, { useState, useEffect } from "react";

const StokEkle: React.FC = () => {
    const [formData, setFormData] = useState({
        stokAdi: "",
        categoryId: "",
        stokMiktari: "",
        stokFiyati: "",
        stokBarkodu: "",
        bilgi: ""
    });

    const [categories, setCategories] = useState<{ category_id: number; category_name: string }[]>([]);

    useEffect(() => {
        // Kategorileri backend'den çek
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Kategori çekme hatası:", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.stokAdi || !formData.categoryId || !formData.stokMiktari || !formData.stokFiyati || !formData.stokBarkodu) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_name: formData.stokAdi,
                    category_id: Number(formData.categoryId),
                    barcode: formData.stokBarkodu,
                    stock_quantity: Number(formData.stokMiktari),
                    price_in_dollars: Number(formData.stokFiyati),
                    info: formData.bilgi || null,
                    user_id: 1,
                    updated_by_user_id: 1
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                setFormData({ stokAdi: "", categoryId: "", stokMiktari: "", stokFiyati: "", stokBarkodu: "", bilgi: "" });
            } else {
                console.error("Ürün ekleme hatası:", result);
                alert("Ürün eklenirken bir hata oluştu.");
            }
        } catch (error) {
            console.error("İstek hatası:", error);
            alert("Sunucu hatası.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-600 w-3xl mx-auto rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold mb-6 text-white">Stok Ekle</h1>
            <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xs" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="stokAdi">Stok Adı</label>
                    <input type="text" id="stokAdi" value={formData.stokAdi} onChange={handleChange} placeholder="Stok Adı"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="categoryId">Stok Kategori</label>
                    <select id="categoryId" value={formData.categoryId} onChange={handleChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-900 focus:outline-none focus:shadow-outline">
                        <option value="">Kategori Seç</option>
                        {categories.map((cat) => (
                            <option key={String(cat.category_id)} value={String(cat.category_id)}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="stokMiktari">Stok Miktarı</label>
                    <input type="number" id="stokMiktari" value={formData.stokMiktari} onChange={handleChange} placeholder="Stok Miktarı"
                        className="shadow border rounded w-full py-2 px-3 text-gray-900 focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="stokFiyati">Stok Fiyatı</label>
                    <input type="number" id="stokFiyati" value={formData.stokFiyati} onChange={handleChange} placeholder="Stok Fiyatı"
                        className="shadow border rounded w-full py-2 px-3 text-gray-900 focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="stokBarkodu">Stok Barkodu</label>
                    <input type="number" id="stokBarkodu" value={formData.stokBarkodu} onChange={handleChange} placeholder="Stok Barkodu"
                        className="shadow border rounded w-full py-2 px-3 text-gray-900 focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="bilgi">Bilgi</label>
                    <input type="text" id="bilgi" value={formData.bilgi} onChange={handleChange} placeholder="Bilgi"
                        className="shadow border rounded w-full py-2 px-3 text-gray-900 focus:outline-none focus:shadow-outline" />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Ekle
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StokEkle;
