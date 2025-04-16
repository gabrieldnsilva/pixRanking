"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import MainLayout from "@/components/Layout/MainLayout";
import Card from "@/components/UI/Card";
import OperatorForm from "@/components/Operators/OperatorForm";
import Button from "@/components/UI/Button";
import { toast } from "react-hot-toast";

interface Operator {
	_id: string;
	name: string;
	registrationNumber: string;
	profileImage?: string;
	createdAt: string;
	updatedAt: string;
}

export default function EditOperatorPage() {
	const router = useRouter();
	const params = useParams();
	const { id } = params;

	const [operator, setOperator] = useState<Operator | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Carregar dados da operadora
	useEffect(() => {
		async function fetchOperator() {
			try {
				setIsLoading(true);
				const response = await fetch(`/api/operators/${id}`);

				if (!response.ok) {
					throw new Error("Operadora não encontrada");
				}

				const data = await response.json();
				setOperator(data);
			} catch (error: any) {
				console.error("Erro ao carregar operadora:", error);
				setError(
					error.message || "Erro ao carregar dados da operadora"
				);
				toast.error("Erro ao carregar dados da operadora");
			} finally {
				setIsLoading(false);
			}
		}

		if (id) {
			fetchOperator();
		}
	}, [id]);

	// Função para atualizar a operadora
	const handleSubmit = async (formData: FormData) => {
		try {
			setIsSubmitting(true);
			setError(null);

			const response = await fetch(`/api/operators/${id}`, {
				method: "PUT",
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Erro ao atualizar operadora");
			}

			// Mostrar mensagem de sucesso
			toast.success("Operadora atualizada com sucesso!");

			// Redirecionar para a lista de operadoras
			router.push("/operators");
		} catch (error: any) {
			console.error("Erro ao atualizar operadora:", error);
			setError(
				error.message || "Ocorreu um erro ao atualizar a operadora"
			);
			toast.error(
				error.message || "Ocorreu um erro ao atualizar a operadora"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<MainLayout>
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">
						Editar Operadora
					</h1>
					<p className="text-gray-600">
						Atualize os dados da operadora
					</p>
				</div>
				<Button
					variant="secondary"
					onClick={() => router.push("/operators")}
				>
					Voltar
				</Button>
			</div>

			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
					{error}
				</div>
			)}

			<Card className="max-w-2xl mx-auto">
				{isLoading ? (
					<div className="flex justify-center items-center p-12">
						<svg
							className="animate-spin h-8 w-8 text-indigo-600 mr-2"
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
						<span>Carregando dados da operadora...</span>
					</div>
				) : operator ? (
					<OperatorForm
						onSubmit={handleSubmit}
						isLoading={isSubmitting}
						initialData={operator}
						mode="edit"
					/>
				) : (
					<p className="text-center py-8 text-gray-500">
						Operadora não encontrada
					</p>
				)}
			</Card>
		</MainLayout>
	);
}
