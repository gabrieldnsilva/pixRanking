import Link from "next/link";
import React from "react";

const Sidebar: React.FC = () => {
	return (
		<aside className="bg-indigo-800 text-white w-64 min-h-screen p-4">
			<div className="mb-8">
				<h2 className="text-2xl font-bold">PIX Ranking</h2>
			</div>

			<nav>
				<ul className="space-y-2">
					<li>
						<Link
							href="/"
							className="block py-2 px-4 rounded hover:bg-indigo-700"
						>
							Dashboard
						</Link>
					</li>
					<li>
						<Link
							href="/operators"
							className="block py-2 px-4 rounded hover:bg-indigo-700"
						>
							Operadoras
						</Link>
					</li>
					<li>
						<Link
							href="/operators/new"
							className="block py-2 px-4 rounded hover:bg-indigo-700"
						>
							Nova Operadora
						</Link>
					</li>
					<li>
						<Link
							href="/upload"
							className="block py-2 px-4 rounded hover:bg-indigo-700"
						>
							Upload CSV
						</Link>
					</li>
					<li>
						<Link
							href="/reports"
							className="block py-2 px-4 rounded hover:bg-indigo-700"
						>
							Relatórios
						</Link>
					</li>
				</ul>
			</nav>
		</aside>
	);
};

export default Sidebar;
