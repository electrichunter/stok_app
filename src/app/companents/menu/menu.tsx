"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const stokEklePath = '/stokekle';
const stokGuncellePath = '/stokguncelle';

const Menu: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="bg-neutral-700 p-4 flex items-center justify-between w-full text-2xl border-b border rounded-3xl z-50">
            <ul className="flex space-x-4 relative">
                <li>
                    <Link href="/" className="text-white hover:text-gray-400">
                        Home
                    </Link>
                </li>
                <li className="relative border-l border-neutral-600 pl-4">
                    <button
                        className="text-white hover:text-gray-400"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        Stok İşlemleri
                    </button>
                    {isDropdownOpen && (
                        <ul className="absolute left-0 mt-2 w-48 bg-neutral-800 shadow-lg rounded-lg">
                            <li>
                                <Link href={stokEklePath} className="block px-4 py-2 text-white hover:bg-neutral-600">
                                    Stok Ekle
                                </Link>
                            </li>
                            <li>
                                <Link href={stokGuncellePath} className="block px-4 py-2 text-white hover:bg-neutral-600">
                                    Stok Güncelle
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Menu;