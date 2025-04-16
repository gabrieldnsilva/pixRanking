"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import RankingList from "@/components/Dashboard/RankingList";
import StatisticsCard from "@/components/Dashboard/StatisticsCard";
import Card from "@/components/UI/Card";

// Dados de exemplo para visualização inicial
const sampleOperators = [
	{ id: "1", name: "João Silva", registrationNumber: "100", salesCount: 42 },
	{ id: "2", name: "Maria Souza", registrationNumber: "101", salesCount: 38 },
	{
		id: "3",
		name: "Pedro Santos",
		registrationNumber: "102",
		salesCount: 27,
	},
	{ id: "4", name: "Ana Lima", registrationNumber: "103", salesCount: 24 },
	{
		id: "5",
		name: "Carlos Oliveira",
		registrationNumber: "104",
		salesCount: 19,
	},
];

export default function Home() {
	const [operators, setOperators] = useState(sampleOperators);
	const [isLoading, setIsLoading] = useState(true);

	// Simula carregamento de dados
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	const totalSales = operators.reduce((sum, op) => sum + op.salesCount, 0);
	const avgSales = operators.length
		? Math.round((totalSales / operators.length) * 10) / 10
		: 0;

	return (
		<MainLayout>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
				<p className="text-gray-600">
					Visualize o ranking de vendas PIX
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<StatisticsCard
					title="Total de Vendas"
					value={totalSales}
					description="Todas as transações PIX"
				/>
				<StatisticsCard
					title="Média por Operador"
					value={avgSales}
					description="Vendas médias por operador"
				/>
				<StatisticsCard
					title="Operadores Ativos"
					value={operators.length}
					description="Operadores com vendas registradas"
				/>
			</div>

			<div className="mb-8">
				{isLoading ? (
					<Card className="p-12 flex justify-center">
						<div className="flex flex-col items-center">
							<svg
								className="animate-spin h-10 w-10 text-indigo-600 mb-4"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							<p className="text-gray-600">Carregando dados...</p>
						</div>
					</Card>
				) : (
					<RankingList operators={operators} />
				)}
			</div>
		</MainLayout>
	);
}
