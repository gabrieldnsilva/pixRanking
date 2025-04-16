"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import Card from "@/components/UI/Card";
import Button from "@/components/UI/Button";
import DateRangeFilter from "@/components/Dashboard/DateRangeFilter";
import ExportOptions from "@/components/Reports/ExportOptions";
import FallbackExportTable from "@/components/Reports/FallbackExportTable";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface Sale {
	_id: string;
	saleDate: string;
	amount: number;
	product: string;
	operatorName: string;
	operatorRegistration: string;
}

interface ReportData {
	sales: Sale[];
	summary: {
		totalSales: number;
		totalAmount: number;
		period?: {
			startDate?: string;
			endDate?: string;
		};
	};
}

export default function ReportsPage() {
	const [reportType, setReportType] = useState<"sales" | "ranking">("sales");
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [reportData, setReportData] = useState<ReportData | null>(null);
	const [rankingData, setRankingData] = useState<any | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [pdfExportError, setPdfExportError] = useState(false);

	// Carregar dados do ranking inicialmente
	useEffect(() => {
		async function fetchRankingData() {
			try {
				const response = await fetch("/api/sales?mode=statistics");

				if (!response.ok) {
					throw new Error("Erro ao carregar dados do ranking");
				}

				const data = await response.json();
				setRankingData({
					operators: data.statistics || [],
					summary: data.summary || { totalSales: 0, totalAmount: 0 },
				});
			} catch (error: any) {
				console.error("Erro ao carregar ranking:", error);
				toast.error("Erro ao carregar dados do ranking");
			}
		}

		fetchRankingData();
	}, []);

	// Gerar relatório
	const handleGenerateReport = async () => {
		try {
			setIsLoading(true);
			setError(null);

			if (reportType === "sales") {
				// Construir URL com parâmetros de filtro
				let url = "/api/reports/sales";

				if (startDate && endDate) {
					const formattedStartDate = format(startDate, "yyyy-MM-dd");
					const formattedEndDate = format(endDate, "yyyy-MM-dd");
					url += `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
				}

				const response = await fetch(url);

				if (!response.ok) {
					throw new Error("Erro ao gerar relatório de vendas");
				}

				const data = await response.json();
				setReportData(data);
				toast.success("Relatório de vendas gerado com sucesso!");
			} else {
				// Relatório de ranking já está carregado, apenas exibir mensagem
				toast.success("Relatório de ranking gerado com sucesso!");
			}
		} catch (error: any) {
			console.error("Erro ao gerar relatório:", error);
			setError(error.message || "Ocorreu um erro ao gerar o relatório");
			toast.error("Erro ao gerar relatório");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<MainLayout>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
				<p className="text-gray-600">
					Gere e exporte relatórios do sistema
				</p>
			</div>

			<Card className="mb-6">
				<h2 className="text-lg font-semibold text-gray-700 mb-4">
					Tipo de Relatório
				</h2>

				<div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6 mb-4">
					<div className="flex items-center">
						<input
							type="radio"
							id="report-sales"
							name="report-type"
							value="sales"
							checked={reportType === "sales"}
							onChange={() => setReportType("sales")}
							className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
						/>
						<label
							htmlFor="report-sales"
							className="ml-2 block text-sm font-medium text-gray-700"
						>
							Relatório de Vendas
						</label>
					</div>

					<div className="flex items-center">
						<input
							type="radio"
							id="report-ranking"
							name="report-type"
							value="ranking"
							checked={reportType === "ranking"}
							onChange={() => setReportType("ranking")}
							className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
						/>
						<label
							htmlFor="report-ranking"
							className="ml-2 block text-sm font-medium text-gray-700"
						>
							Ranking de Operadoras
						</label>
					</div>
				</div>

				{reportType === "sales" && (
					<div className="mt-4">
						<h3 className="text-md font-medium text-gray-700 mb-2">
							Período de Vendas
						</h3>
						<DateRangeFilter
							startDate={startDate}
							endDate={endDate}
							onStartDateChange={setStartDate}
							onEndDateChange={setEndDate}
							onFilterApply={handleGenerateReport}
							onFilterReset={() => {
								setStartDate(null);
								setEndDate(null);
								setReportData(null);
							}}
						/>
					</div>
				)}

				{reportType === "ranking" && (
					<div className="mt-6 flex justify-end">
						<Button
							onClick={handleGenerateReport}
							isLoading={isLoading}
						>
							Gerar Relatório de Ranking
						</Button>
					</div>
				)}
			</Card>

			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
					{error}
				</div>
			)}

			{/* Exibir opções de exportação quando houver dados */}
			{reportType === "sales" && reportData && (
				<div>
					<ExportOptions
						data={{
							sales: reportData.sales,
							summary: reportData.summary,
							reportType: "sales",
							dateRange: { startDate, endDate },
						}}
						className="mb-6"
						onExportError={setPdfExportError}
					/>

					{/* Mostrar o fallback APENAS quando houver erro na exportação PDF */}
					{pdfExportError && (
						<FallbackExportTable
							data={reportData.sales}
							title="Relatório de Vendas"
							filename="relatorio_vendas"
						/>
					)}

					<Card className="mb-6">
						<h2 className="text-lg font-semibold text-gray-700 mb-4">
							Prévia do Relatório
						</h2>

						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Data
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Operador
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Matrícula
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Produto
										</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Valor
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{reportData.sales
										.slice(0, 10)
										.map((sale) => (
											<tr key={sale._id}>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{new Date(
														sale.saleDate
													).toLocaleDateString(
														"pt-BR"
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{sale.operatorName}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{sale.operatorRegistration}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{sale.product}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
													{new Intl.NumberFormat(
														"pt-BR",
														{
															style: "currency",
															currency: "BRL",
														}
													).format(sale.amount)}
												</td>
											</tr>
										))}
								</tbody>
								<tfoot className="bg-gray-50">
									<tr>
										<td
											colSpan={4}
											className="px-6 py-3 text-right text-sm font-medium text-gray-500"
										>
											Total:
										</td>
										<td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
											{new Intl.NumberFormat("pt-BR", {
												style: "currency",
												currency: "BRL",
											}).format(
												reportData.summary.totalAmount
											)}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>

						{reportData.sales.length > 10 && (
							<p className="text-center text-sm text-gray-500 mt-4">
								Mostrando 10 de {reportData.sales.length}{" "}
								registros. Exporte o relatório para ver todos os
								dados.
							</p>
						)}
					</Card>
				</div>
			)}

			{reportType === "ranking" && rankingData && (
				<div>
					<ExportOptions
						data={{
							operators: rankingData.operators,
							summary: rankingData.summary,
							reportType: "ranking",
						}}
						className="mb-6"
						onExportError={setPdfExportError}
					/>

					{/* Mostrar o fallback APENAS quando houver erro na exportação PDF */}
					{pdfExportError && (
						<FallbackExportTable
							data={rankingData.operators}
							title="Ranking de Operadoras"
							filename="ranking_operadoras"
						/>
					)}

					<Card className="mb-6">
						<h2 className="text-lg font-semibold text-gray-700 mb-4">
							Prévia do Relatório
						</h2>

						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Posição
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Nome
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Matrícula
										</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Qtd. Vendas
										</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Valor Total
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{rankingData.operators
										.slice(0, 10)
										.map((op: any, index: number) => (
											<tr key={op.operatorId}>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{index + 1}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{op.name}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{op.registrationNumber}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
													{op.salesCount}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
													{new Intl.NumberFormat(
														"pt-BR",
														{
															style: "currency",
															currency: "BRL",
														}
													).format(op.totalAmount)}
												</td>
											</tr>
										))}
								</tbody>
								<tfoot className="bg-gray-50">
									<tr>
										<td
											colSpan={3}
											className="px-6 py-3 text-right text-sm font-medium text-gray-500"
										>
											Total:
										</td>
										<td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
											{rankingData.summary.totalSales}
										</td>
										<td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
											{new Intl.NumberFormat("pt-BR", {
												style: "currency",
												currency: "BRL",
											}).format(
												rankingData.summary.totalAmount
											)}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>

						{rankingData.operators.length > 10 && (
							<p className="text-center text-sm text-gray-500 mt-4">
								Mostrando 10 de {rankingData.operators.length}{" "}
								operadoras. Exporte o relatório para ver todos
								os dados.
							</p>
						)}
					</Card>
				</div>
			)}
		</MainLayout>
	);
}
