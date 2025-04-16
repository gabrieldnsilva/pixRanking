import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Card from "../UI/Card";

// Registrar componentes do Chart.js
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface Operator {
	operatorId: string;
	name: string;
	registrationNumber: string;
	salesCount: number;
	totalAmount: number;
}

interface SalesChartProps {
	operators: Operator[];
	dataType?: "count" | "amount";
	title?: string;
}

const SalesChart: React.FC<SalesChartProps> = ({
	operators,
	dataType = "count",
	title = "Vendas por Operadora",
}) => {
	// Limitar para no máximo 10 operadoras para melhor visualização
	const displayOperators = operators.slice(0, 10);

	// Configurações do gráfico
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: title,
				font: {
					size: 16,
				},
			},
			tooltip: {
				callbacks: {
					label: (context: any) => {
						if (dataType === "amount") {
							return `R$ ${context.raw.toFixed(2)}`;
						}
						return `${context.raw} vendas`;
					},
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					callback: (value: any) => {
						if (dataType === "amount") {
							return `R$ ${value}`;
						}
						return value;
					},
				},
			},
		},
	};

	// Preparar dados para o gráfico
	const data = {
		labels: displayOperators.map((op) => op.name),
		datasets: [
			{
				label:
					dataType === "count"
						? "Quantidade de Vendas"
						: "Valor Total (R$)",
				data: displayOperators.map((op) =>
					dataType === "count" ? op.salesCount : op.totalAmount
				),
				backgroundColor: "rgba(99, 102, 241, 0.6)",
				borderColor: "rgba(99, 102, 241, 1)",
				borderWidth: 1,
			},
		],
	};

	return (
		<Card className="p-4">
			<div className="h-80">
				<Bar options={options} data={data} />
			</div>
		</Card>
	);
};

export default SalesChart;
