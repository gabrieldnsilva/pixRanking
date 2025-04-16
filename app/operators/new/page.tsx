"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/Layout/MainLayout";
import Card from "@/components/UI/Card";
import OperatorForm from "@/components/Operators/OperatorForm";
import { toast } from "react-hot-toast";

export default function NewOperatorPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Função para cadastrar uma nova operadora
	const handleSubmit = async (formData: FormData) => {
		try {
			setIsSubmitting(true);
			setError(null);

			const response = await fetch("/api/operators", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Erro ao cadastrar operadora");
			}

			// Mostrar mensagem de sucesso
			toast.success("Operadora cadastrada com sucesso!");

			// Redirecionar para a lista de operadoras após o cadastro
			router.push("/operators");
		} catch (error: any) {
			console.error("Erro ao cadastrar operadora:", error);
			setError(
				error.message || "Ocorreu um erro ao cadastrar a operadora"
			);
			toast.error(
				error.message || "Ocorreu um erro ao cadastrar a operadora"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<MainLayout>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					Nova Operadora
				</h1>
				<p className="text-gray-600">
					Cadastre uma nova operadora no sistema
				</p>
			</div>

			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
					{error}
				</div>
			)}

			<Card className="max-w-2xl mx-auto">
				<OperatorForm
					onSubmit={handleSubmit}
					isLoading={isSubmitting}
					mode="create"
				/>
			</Card>
		</MainLayout>
	);
}
