import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
	children: ReactNode;
	showSidebar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
	children,
	showSidebar = true,
}) => {
	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="flex">
				{showSidebar && <Sidebar />}
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
};

export default MainLayout;
