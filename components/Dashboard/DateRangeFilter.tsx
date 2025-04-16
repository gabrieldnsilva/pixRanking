import React from "react";
import DatePicker from "react-datepicker";
import { format, subDays, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../UI/Button";

interface DateRangeFilterProps {
	startDate: Date | null;
	endDate: Date | null;
	onStartDateChange: (date: Date | null) => void;
	onEndDateChange: (date: Date | null) => void;
	onFilterApply: () => void;
	onFilterReset: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	onFilterApply,
	onFilterReset,
}) => {
	// Validação para não permitir data final menor que inicial
	const handleEndDateChange = (date: Date | null) => {
		if (date && startDate && isAfter(startDate, date)) {
			// Se a data final for anterior à inicial, não atualiza
			return;
		}
		onEndDateChange(date);
	};

	// Opções de período pré-definidas
	const presetOptions = [
		{
			label: "Últimos 7 dias",
			action: () => {
				const end = new Date();
				const start = subDays(end, 7);
				onStartDateChange(start);
				onEndDateChange(end);
			},
		},
		{
			label: "Últimos 30 dias",
			action: () => {
				const end = new Date();
				const start = subDays(end, 30);
				onStartDateChange(start);
				onEndDateChange(end);
			},
		},
		{
			label: "Este mês",
			action: () => {
				const now = new Date();
				const start = new Date(now.getFullYear(), now.getMonth(), 1);
				const end = new Date();
				onStartDateChange(start);
				onEndDateChange(end);
			},
		},
	];

	return (
		<div className="bg-white p-4 rounded-lg shadow-md mb-6">
			<h3 className="text-lg font-semibold text-gray-700 mb-4">
				Filtrar por Período
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Data Inicial
					</label>
					<DatePicker
						selected={startDate}
						onChange={onStartDateChange}
						selectsStart
						startDate={startDate}
						endDate={endDate}
						dateFormat="dd/MM/yyyy"
						locale={ptBR}
						className="w-full p-2 border border-gray-300 rounded-md"
						placeholderText="Selecione a data inicial"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Data Final
					</label>
					<DatePicker
						selected={endDate}
						onChange={handleEndDateChange}
						selectsEnd
						startDate={startDate}
						endDate={endDate}
						minDate={startDate}
						dateFormat="dd/MM/yyyy"
						locale={ptBR}
						className="w-full p-2 border border-gray-300 rounded-md"
						placeholderText="Selecione a data final"
					/>
				</div>
			</div>

			<div className="flex flex-wrap gap-2 mb-4">
				{presetOptions.map((option, index) => (
					<button
						key={index}
						onClick={option.action}
						className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
					>
						{option.label}
					</button>
				))}
			</div>

			<div className="flex justify-end space-x-2">
				<Button variant="secondary" onClick={onFilterReset}>
					Limpar
				</Button>
				<Button
					onClick={onFilterApply}
					disabled={!startDate || !endDate}
				>
					Aplicar Filtro
				</Button>
			</div>
		</div>
	);
};

export default DateRangeFilter;
