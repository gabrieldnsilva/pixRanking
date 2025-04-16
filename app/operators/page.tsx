"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import Button from "@/components/UI/Button";
import OperatorList from "@/components/Operators/OperatorList";
import Card from "@/components/UI/Card";

// Dados iniciais para demonstração
const initialOperators = [
	{
		id: "1",
		name: "João Silva",
		registrationNumber: "100",
		createdAt: "2023-01-15T10:30:00Z",
	},
	{
		id: "2",
		name: "Maria Souza",
		registrationNumber: "101",
		profileImage: "/images/avatars/maria.jpg",
		createdAt: "2023-02-20T14:15:00Z",
	},
	{
		id: "3",
		name: "Pedro Santos",
		registrationNumber: "102",
		createdAt: "2023-03-10T09:45:00Z",
	},
];

export default function OperatorsPage() {
	const [operators, setOperators] = useState(initialOperators);
	const [isLoading, setIsLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);

	// Simulação de carregamento de dados
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	// Função para simular a exclusão de operadoras
	const handleDeleteOperator = async (id: string) => {
		try {
			setIsDeleting(true);

			// Simulando uma chamada à API
			await new Promise((resolve) => setTimeout(resolve, 800));

			// Removendo a operadora da lista local
			setOperators(operators.filter((op) => op.id !== id));

			// Em uma implementação real, você chamaria a API:
			// await fetch(`/api/operators/${id}`, { method: 'DELETE' });
		} catch (error) {
			console.error("Erro ao excluir operadora:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<MainLayout>
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">
						Operadoras
					</h1>
					<p className="text-gray-600">
						Gerencie as operadoras do sistema
					</p>
				</div>
				<Link href="/operators/new">
					<Button>Nova Operadora</Button>
				</Link>
			</div>

			<Card>
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
						<span>Carregando operadoras...</span>
					</div>
				) : (
					<OperatorList
						operators={operators}
						onDelete={handleDeleteOperator}
						isLoading={isDeleting}
					/>
				)}
			</Card>
		</MainLayout>
	);
}
