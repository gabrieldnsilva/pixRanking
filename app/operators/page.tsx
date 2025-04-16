"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import Button from "@/components/UI/Button";
import OperatorList from "@/components/Operators/OperatorList";
import Card from "@/components/UI/Card";
import { toast } from "react-hot-toast";

interface Operator {
	_id: string;
	id: string;
	name: string;
	registrationNumber: string;
	profileImage?: string;
	createdAt: string;
}

export default function OperatorsPage() {
	const [operators, setOperators] = useState<Operator[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Carregar operadoras da API
	useEffect(() => {
		async function fetchOperators() {
			try {
				setIsLoading(true);

				const response = await fetch("/api/operators");
				const data = await response.json();

				if (!response.ok) {
					throw new Error(
						data.error || "Erro ao carregar operadoras"
					);
				}

				// Garantir compatibilidade com o componente existente
				const formattedOperators = data.operators.map((op: any) => ({
					...op,
					id: op._id, // Adicionar id como alias para _id
				}));

				setOperators(formattedOperators);
			} catch (error: any) {
				console.error("Erro ao carregar operadoras:", error);
				setError(error.message);
				toast.error("Erro ao carregar a lista de operadoras");
			} finally {
				setIsLoading(false);
			}
		}

		fetchOperators();
	}, []);

	// Função para excluir operadoras
	const handleDeleteOperator = async (id: string) => {
		try {
			setIsDeleting(true);

			// Confirmar exclusão
			if (!confirm("Tem certeza que deseja excluir esta operadora?")) {
				setIsDeleting(false);
				return;
			}

			const response = await fetch(`/api/operators/${id}`, {
				method: "DELETE",
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Erro ao excluir operadora");
			}

			// Atualizar a lista local
			setOperators(operators.filter((op) => op.id !== id));
			toast.success("Operadora excluída com sucesso");
		} catch (error: any) {
			console.error("Erro ao excluir operadora:", error);
			toast.error(error.message || "Erro ao excluir operadora");
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

			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
					{error}
				</div>
			)}

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
