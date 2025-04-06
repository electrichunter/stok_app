import React from 'react';
import Menu from '../../companents/menu/menu';
import Categoriguncelle from '../../sayfalar/categoriguncelle';
const StokGuncellePage: React.FC = () => {
    return (
        
             <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
              <Menu /><br />
       
                <div className="w-full ">
                <Categoriguncelle />
            </div>  
        </div>
    );
};

export default StokGuncellePage;