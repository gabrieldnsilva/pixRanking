"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import RankingList from "@/components/Dashboard/RankingList";
import StatisticsCard from "@/components/Dashboard/StatisticsCard";
import Card from "@/components/UI/Card";
import { toast } from "react-hot-toast";

interface Operator {
	id: string;
	operatorId: string;
	name: string;
	registrationNumber: string;
	profileImage?: string;
	salesCount: number;
	totalAmount: number;
}

interface SalesSummary {
	totalSales: number;
	totalAmount: number;
}

export default function Home() {
	const [operators, setOperators] = useState<Operator[]>([]);
	const [summary, setSummary] = useState<SalesSummary>({
		totalSales: 0,
		totalAmount: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Carregar dados do ranking
	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);

				const response = await fetch("/api/sales?mode=statistics");

				if (!response.ok) {
					throw new Error("Erro ao carregar dados do ranking");
				}

				const data = await response.json();
				setOperators(data.statistics || []);
				setSummary(data.summary || { totalSales: 0, totalAmount: 0 });
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				console.error("Erro ao carregar dados:", error);
				setError(
					error.message || "Ocorreu um erro ao carregar o ranking"
				);
				toast.error("Erro ao carregar dados do ranking");
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, []);

	// Calcular média de vendas por operador
	const avgSales = operators.length
		? Math.round((summary.totalSales / operators.length) * 10) / 10
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
					value={summary.totalSales}
					description="Todas as transações PIX"
				/>
				<StatisticsCard
					title="Valor Total (R$)"
					value={new Intl.NumberFormat("pt-BR", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}).format(summary.totalAmount)}
					description="Valor total das vendas"
				/>
				<StatisticsCard
					title="Operadores Ativos"
					value={operators.length}
					description={`Média de ${avgSales} vendas por operador`}
				/>
			</div>

			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
					{error}
				</div>
			)}

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
				) : operators.length > 0 ? (
					<RankingList operators={operators} />
				) : (
					<Card className="p-8 text-center">
						<h3 className="text-xl font-semibold text-gray-700 mb-2">
							Nenhum dado de venda encontrado
						</h3>
						<p className="text-gray-500 mb-4">
							Ainda não há registros de vendas PIX no sistema.
							Faça o upload de um arquivo CSV para começar.
						</p>
					</Card>
				)}
			</div>
		</MainLayout>
	);
}
