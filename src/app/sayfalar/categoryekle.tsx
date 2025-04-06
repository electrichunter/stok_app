"use client";
import React, { useState } from "react";

const CategoryEkle: React.FC = () => {
    const [formData, setFormData] = useState({
        category_name: "",
        category_info: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.category_name || !formData.category_info) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        try {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "Kategori başarıyla eklendi!");
                setFormData({ category_name: "", category_info: "" });
            } else {
                console.error("Kategori ekleme hatası:", result);
                alert("Kategori eklenirken bir hata oluştu.");
            }
        } catch (error) {
            console.error("Sunucu hatası:", error);
            alert("Sunucu hatası.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-neutral-900 mx-auto rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold mb-6 text-white">Kategori Ekle</h1>
            <form
                className="shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xs bg-neutral-800"
                onSubmit={handleSubmit}
            >
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="category_name">
                        Kategori Adı
                    </label>
                    <input
                        id="category_name"
                        type="text"
                        value={formData.category_name}
                        onChange={handleChange}
                        placeholder="Kategori adı"
                        className="shadow border rounded w-full py-2 px-3 bg-transparent text-white focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="category_info">
                        Kategori Bilgisi
                    </label>
                    <input
                        id="category_info"
                        type="text"
                        value={formData.category_info}
                        onChange={handleChange}
                        placeholder="Kategori bilgisi"
                        className="shadow border rounded w-full py-2 px-3 bg-transparent text-white focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Ekle
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryEkle;
