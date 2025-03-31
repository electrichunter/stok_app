"use client";
import React from "react";
import Menu from "../companents/menu/menu";
import StokEkle from "../sayfalar/stokekle";

const Page = () => {
    return (
        <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
              <Menu /><br />
       
            <div className="w-full max-w-2xl">
                <StokEkle />
            </div>  
        </div>
    );
};

export default Page;
