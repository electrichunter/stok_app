"use client";
import React, { useEffect, useState } from "react";

interface Category {
    category_id: number;
    category_name: string;
    category_info: string;
}

const Categoriguncelle = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    useEffect(() => {
        fetch("/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Kategoriler çekilemedi:", err));
    }, []);

    const handleEditClick = (category: Category) => {
        setEditingCategory(category);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingCategory) return;
        const { name, value } = e.target;
        setEditingCategory({ ...editingCategory, [name]: value });
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        try {
            const res = await fetch(`/api/categories/${editingCategory.category_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingCategory),
            });

            let result;
            try {
                result = await res.json();
            } catch (err) {
                alert("Sunucudan geçersiz JSON geldi.");
                return;
            }

            if (res.ok) {
                alert("Kategori başarıyla güncellendi!");
                setEditingCategory(null);
                // Listeyi güncelle
                setCategories(prev =>
                    prev.map(cat =>
                        cat.category_id === editingCategory.category_id ? editingCategory : cat
                    )
                );
            } else {
                alert(result?.error || "Kategori güncellenemedi.");
            }
        } catch (err) {
            console.error("Güncelleme hatası:", err);
            alert("Beklenmeyen bir hata oluştu.");
        }
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-bold mb-4">Kategoriler</h1>
            <table className="w-full table-auto mb-6 border border-gray-600">
                <thead>
                    <tr className="bg-gray-800 text-blue-300">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Ad</th>
                        <th className="p-2 border">Bilgi</th>
                        <th className="p-2 border">Düzenle</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.category_id} className="bg-gray-900 hover:bg-gray-800">
                            <td className="p-2 border">{category.category_id}</td>
                            <td className="p-2 border">{category.category_name}</td>
                            <td className="p-2 border">{category.category_info}</td>
                            <td className="p-2 border text-center">
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded"
                                    onClick={() => handleEditClick(category)}
                                >
                                    Düzenle
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingCategory && (
                <form onSubmit={handleUpdateCategory} className="bg-gray-800 p-4 rounded-lg space-y-4">
                    <h2 className="text-xl font-bold text-blue-400">Kategori Güncelle</h2>
                    <input
                        type="text"
                        name="category_name"
                        value={editingCategory.category_name}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        placeholder="Kategori Adı"
                    />
                    <textarea
                        name="category_info"
                        value={editingCategory.category_info}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        placeholder="Kategori Bilgisi"
                    />
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Güncelle
                    </button>
                </form>
            )}
        </div>
    );
};

export default Categoriguncelle;
