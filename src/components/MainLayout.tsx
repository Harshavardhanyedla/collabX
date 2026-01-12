import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="main-content">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar - hidden on mobile, 3 cols on large */}
                <div className="hidden lg:block lg:col-span-3">
                    <LeftSidebar />
                </div>

                {/* Main Content (Feed) - full width on mobile, 6 cols on large */}
                <div className="col-span-1 lg:col-span-6">
                    {children}
                </div>

                {/* Right Sidebar - hidden on mobile, 3 cols on large */}
                <div className="hidden lg:block lg:col-span-3">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
