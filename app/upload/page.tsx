"use client";

import React, { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import CSVUploader from "@/components/Upload/CSVUploader";
import Card from "@/components/UI/Card";
import Button from "@/components/UI/Button";
import Link from "next/link";
import { toast } from "react-hot-toast";

// Interface para os resultados do processamento
interface ProcessingResult {
	success: boolean;
	totalProcessed: number;
	validRecords: number;
	ignoredRecords: number;
	unknownOperators: string[];
	processingDate: string;
}

export default function UploadPage() {
	const [isUploading, setIsUploading] = useState(false);
	const [result, setResult] = useState<ProcessingResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Função para upload e processamento do arquivo CSV
	const handleUpload = async (file: File) => {
		try {
			setIsUploading(true);
			setResult(null);
			setError(null);

			// Preparar FormData para envio
			const formData = new FormData();
			formData.append("csvFile", file);

			// Enviar para a API
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Erro ao processar o arquivo");
			}

			// Armazenar resultado
			setResult(data);

			// Notificar sucesso
			toast.success("Arquivo processado com sucesso!");
		} catch (error: any) {
			console.error("Erro ao processar o arquivo:", error);
			setError(error.message || "Ocorreu um erro ao processar o arquivo");
			toast.error(
				error.message || "Ocorreu um erro ao processar o arquivo"
			);
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

			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
					{error}
				</div>
			)}

			<div className="mb-8">
				<CSVUploader onUpload={handleUpload} isLoading={isUploading} />
			</div>

			{result && (
				<Card
					title="Resultados do Processamento"
					className="overflow-hidden"
				>
					<div className="mt-2 mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
						<h3 className="text-green-700 font-semibold text-lg mb-2">
							Arquivo processado com sucesso!
						</h3>

						{/* Adicionar mensagem de substituição de dados */}
						<p className="text-green-600 mb-3">
							Os dados anteriores foram substituídos pelos novos
							registros.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
							<div>
								<p className="text-gray-500">
									Total de registros:
								</p>
								<p className="font-semibold">
									{result.totalProcessed}
								</p>
							</div>
							<div>
								<p className="text-gray-500">
									Registros importados:
								</p>
								<p className="font-semibold text-green-600">
									{result.validRecords}
								</p>
							</div>
							<div>
								<p className="text-gray-500">
									Registros ignorados:
								</p>
								<p className="font-semibold text-amber-600">
									{result.ignoredRecords}
								</p>
							</div>
						</div>
					</div>

					{result.unknownOperators.length > 0 && (
						<div className="mb-6">
							<h3 className="text-amber-700 font-semibold mb-2">
								Operadoras não encontradas
							</h3>
							<p className="text-gray-600 text-sm mb-2">
								Os seguintes números de matrícula não
								correspondem a nenhuma operadora cadastrada:
							</p>
							<div className="flex flex-wrap gap-2">
								{result.unknownOperators.map((registration) => (
									<span
										key={registration}
										className="px-2 py-1 bg-amber-50 border border-amber-200 rounded-md text-sm"
									>
										{registration}
									</span>
								))}
							</div>
						</div>
					)}

					<div className="flex justify-between mt-6">
						<Link href="/operators/new">
							<Button variant="secondary">
								Cadastrar Nova Operadora
							</Button>
						</Link>
						<Link href="/">
							<Button>Ver Ranking Atualizado</Button>
						</Link>
					</div>
				</Card>
			)}
		</MainLayout>
	);
}
