"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/Layout/MainLayout";
import Card from "@/components/UI/Card";
import OperatorForm from "@/components/Operators/OperatorForm";

export default function NewOperatorPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Função para simular o cadastro de uma nova operadora
	const handleSubmit = async (formData: FormData) => {
		try {
			setIsSubmitting(true);

			// Simulando um atraso na resposta da API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Dados que seriam enviados para a API
			const name = formData.get("name");
			const registrationNumber = formData.get("registrationNumber");
			const profileImage = formData.get("profileImage");

			console.log("Dados para cadastro:", {
				name,
				registrationNumber,
				profileImage,
			});

			// Em uma implementação real, você enviaria os dados para a API:
			// const response = await fetch('/api/operators', {
			//   method: 'POST',
			//   body: formData,
			// });
			//
			// if (!response.ok) throw new Error('Erro ao cadastrar operadora');

			// Redireciona para a lista de operadoras após o cadastro
			router.push("/operators");
		} catch (error) {
			console.error("Erro ao cadastrar operadora:", error);
			// Aqui você poderia implementar um feedback visual ao usuário
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

			<Card className="max-w-2xl mx-auto">
				<OperatorForm
					onSubmit={handleSubmit}
					isLoading={isSubmitting}
				/>
			</Card>
		</MainLayout>
	);
}
