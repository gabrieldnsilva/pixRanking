import Link from "next/link";
import React from "react";

const Navbar: React.FC = () => {
	return (
		<nav className="bg-white shadow-md p-4">
			<div className="container mx-auto flex justify-between items-center">
				<Link href="/" className="text-xl font-bold text-indigo-600">
					PIX Ranking
				</Link>

				<div className="flex items-center space-x-4">
					<Link
						href="/upload"
						className="text-gray-600 hover:text-indigo-600"
					>
						Upload CSV
					</Link>
					<Link
						href="/operators"
						className="text-gray-600 hover:text-indigo-600"
					>
						Operadoras
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
