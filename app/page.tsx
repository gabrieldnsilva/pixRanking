"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import RankingList from "@/components/Dashboard/RankingList";
import StatisticsCard from "@/components/Dashboard/StatisticsCard";
import SalesChart from "@/components/Dashboard/SalesChart";
import DateRangeFilter from "@/components/Dashboard/DateRangeFilter";
import Card from "@/components/UI/Card";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
	filteredByDate?: boolean;
	period?: {
		startDate?: string;
		endDate?: string;
	};
}

export default function Home() {
	const [operators, setOperators] = useState<Operator[]>([]);
	const [summary, setSummary] = useState<SalesSummary>({
		totalSales: 0,
		totalAmount: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [isFilterApplied, setIsFilterApplied] = useState(false);
	const [activeChartType, setActiveChartType] = useState<"count" | "amount">(
		"count"
	);

	// Função para carregar dados do ranking
	const fetchData = async (withFilter = false) => {
		try {
			setIsLoading(true);
			setError(null);

			// Construir URL com parâmetros de filtro
			let url = "/api/sales?mode=statistics";

			if (withFilter && startDate && endDate) {
				const formattedStartDate = format(startDate, "yyyy-MM-dd");
				const formattedEndDate = format(endDate, "yyyy-MM-dd");
				url += `&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
			}

			const response = await fetch(url);

			if (!response.ok) {
				throw new Error("Erro ao carregar dados do ranking");
			}

			const data = await response.json();
			setOperators(data.statistics || []);
			setSummary(data.summary || { totalSales: 0, totalAmount: 0 });

			if (withFilter) {
				setIsFilterApplied(true);
				toast.success("Filtro aplicado com sucesso!");
			}
		} catch (error: any) {
			console.error("Erro ao carregar dados:", error);
			setError(error.message || "Ocorreu um erro ao carregar o ranking");
			toast.error("Erro ao carregar dados do ranking");
		} finally {
			setIsLoading(false);
		}
	};

	// Carregar dados iniciais
	useEffect(() => {
		fetchData();
	}, []);

	// Aplicar filtro de data
	const handleFilterApply = () => {
		if (startDate && endDate) {
			fetchData(true);
		}
	};

	// Resetar filtro
	const handleFilterReset = () => {
		setStartDate(null);
		setEndDate(null);

		if (isFilterApplied) {
			fetchData();
			setIsFilterApplied(false);
			toast.success("Filtro removido");
		}
	};

	// Calcular média de vendas por operador
	const avgSales = operators.length
		? Math.round((summary.totalSales / operators.length) * 10) / 10
		: 0;

	return (
		<MainLayout>
			<div className="mb-6 flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">
						Dashboard
					</h1>
					<p className="text-gray-600">
						Visualize o ranking de vendas PIX
					</p>
				</div>
				{isFilterApplied && summary.period && (
					<div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
						<span className="text-blue-700 font-medium">
							Período filtrado:{" "}
						</span>
						<span className="text-blue-600">
							{new Date(
								summary.period.startDate || ""
							).toLocaleDateString("pt-BR")}{" "}
							a{" "}
							{new Date(
								summary.period.endDate || ""
							).toLocaleDateString("pt-BR")}
						</span>
					</div>
				)}
			</div>

			{/* Filtro de Data */}
			<DateRangeFilter
				startDate={startDate}
				endDate={endDate}
				onStartDateChange={setStartDate}
				onEndDateChange={setEndDate}
				onFilterApply={handleFilterApply}
				onFilterReset={handleFilterReset}
			/>

			{/* Cards de Estatísticas */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<StatisticsCard
					title="Total de Vendas"
					value={summary.totalSales}
					description="Transações PIX"
				/>
				<StatisticsCard
					title="Valor Total (R$)"
					value={new Intl.NumberFormat("pt-BR", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}).format(summary.totalAmount)}
					description="Valor das vendas"
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

			{/* Gráficos */}
			{!isLoading && operators.length > 0 && (
				<div className="mb-8">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold text-gray-800">
							Visualização Gráfica
						</h2>
						<div className="flex space-x-2">
							<button
								className={`px-4 py-2 rounded-md text-sm font-medium ${
									activeChartType === "count"
										? "bg-indigo-600 text-white"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
								onClick={() => setActiveChartType("count")}
							>
								Quantidade
							</button>
							<button
								className={`px-4 py-2 rounded-md text-sm font-medium ${
									activeChartType === "amount"
										? "bg-indigo-600 text-white"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
								onClick={() => setActiveChartType("amount")}
							>
								Valor
							</button>
						</div>
					</div>
					<SalesChart
						operators={operators}
						dataType={activeChartType}
						title={
							activeChartType === "count"
								? "Quantidade de Vendas por Operadora"
								: "Valor Total de Vendas por Operadora"
						}
					/>
				</div>
			)}

			{/* Lista de Ranking */}
			<div className="mb-8">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					Ranking de Vendas
				</h2>
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
							Ainda não há registros de vendas PIX no sistema ou
							nenhum registro corresponde ao filtro aplicado.
						</p>
					</Card>
				)}
			</div>
		</MainLayout>
	);
}
