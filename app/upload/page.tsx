"use client";

import React, { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import CSVUploader from "@/components/Upload/CSVUploader";
import Card from "@/components/UI/Card";

// Interface para os dados processados
interface ProcessedSale {
	id: string;
	date: string;
	operator: string;
	operatorName?: string;
	product: string;
	amount: number;
}

export default function UploadPage() {
	const [isUploading, setIsUploading] = useState(false);
	const [processedData, setProcessedData] = useState<ProcessedSale[]>([]);
	const [showResults, setShowResults] = useState(false);

	// Função para simular o upload e processamento do arquivo CSV
	const handleUpload = async (file: File) => {
		try {
			setIsUploading(true);
			setShowResults(false);

			// Simulando o processamento do arquivo
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Em uma implementação real, você enviaria o arquivo para a API:
			// const formData = new FormData();
			// formData.append('csvFile', file);
			//
			// const response = await fetch('/api/upload', {
			//   method: 'POST',
			//   body: formData,
			// });
			//
			// if (!response.ok) throw new Error('Erro ao processar o arquivo');
			// const data = await response.json();

			// Simula dados processados para visualização
			const mockProcessedData: ProcessedSale[] = [
				{
					id: "1",
					date: "10-01-2023",
					operator: "100",
					operatorName: "João Silva",
					product: "Pix",
					amount: 125.5,
				},
				{
					id: "2",
					date: "10-01-2023",
					operator: "102",
					operatorName: "Pedro Santos",
					product: "Pix",
					amount: 78.9,
				},
				{
					id: "3",
					date: "11-01-2023",
					operator: "100",
					operatorName: "João Silva",
					product: "Pix",
					amount: 233.45,
				},
				{
					id: "4",
					date: "11-01-2023",
					operator: "101",
					operatorName: "Maria Souza",
					product: "Pix",
					amount: 65.3,
				},
				{
					id: "5",
					date: "12-01-2023",
					operator: "101",
					operatorName: "Maria Souza",
					product: "Pix",
					amount: 142.75,
				},
			];

			setProcessedData(mockProcessedData);
			setShowResults(true);
		} catch (error) {
			console.error("Erro ao processar o arquivo:", error);
			// Aqui você poderia implementar um feedback visual ao usuário
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<MainLayout>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					Upload de Arquivo CSV
				</h1>
				<p className="text-gray-600">
					Faça o upload do arquivo de vendas para processamento
				</p>
			</div>

			<div className="mb-8">
				<CSVUploader onUpload={handleUpload} isLoading={isUploading} />
			</div>

			{showResults && (
				<Card
					title="Resultados do Processamento"
					className="overflow-hidden"
				>
					<div className="mt-2 mb-4">
						<p className="text-green-600 font-semibold">
							Arquivo processado com sucesso!{" "}
							{processedData.length} registros encontrados.
						</p>
					</div>

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
										Produto
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Valor
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{processedData.map((sale) => (
									<tr key={sale.id}>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{sale.date}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-900">
												{sale.operatorName}
											</div>
											<div className="text-sm text-gray-500">
												Matrícula: {sale.operator}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{sale.product}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
											{new Intl.NumberFormat("pt-BR", {
												style: "currency",
												currency: "BRL",
											}).format(sale.amount)}
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
										{new Intl.NumberFormat("pt-BR", {
											style: "currency",
											currency: "BRL",
										}).format(
											processedData.reduce(
												(sum, sale) =>
													sum + sale.amount,
												0
											)
										)}
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</Card>
			)}
		</MainLayout>
	);
}
