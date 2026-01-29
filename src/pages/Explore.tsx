import React from 'react';
import RightSidebar from '../components/RightSidebar';

const Explore: React.FC = () => {
    return (
        <div className="pb-20 pt-4 px-4 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Explore</h1>
            <div className="max-w-xl mx-auto">
                <RightSidebar />
            </div>
        </div>
    );
};

export default Explore;
