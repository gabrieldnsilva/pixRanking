import React, { useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Button from "../UI/Button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ExportData {
	operators?: Array<{
		name: string;
		registrationNumber: string;
		salesCount: number;
		totalAmount: number;
	}>;
	sales?: Array<any>;
	summary?: {
		totalSales: number;
		totalAmount: number;
		period?: {
			startDate?: string;
			endDate?: string;
		};
	};
	reportType: "ranking" | "sales";
	dateRange?: {
		startDate: Date | null;
		endDate: Date | null;
	};
}

interface ExportOptionsProps {
	data: ExportData;
	className?: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
	data,
	className = "",
}) => {
	const [isExporting, setIsExporting] = useState(false);
	const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">(
		"excel"
	);

	// Função auxiliar para formatar valores monetários
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	};

	// Função para gerar o título do relatório
	const getReportTitle = () => {
		const reportName =
			data.reportType === "ranking"
				? "Ranking de Vendas PIX"
				: "Relatório de Vendas";
		let dateInfo = "";

		if (
			data.dateRange &&
			data.dateRange.startDate &&
			data.dateRange.endDate
		) {
			dateInfo = ` - Período: ${format(
				data.dateRange.startDate,
				"dd/MM/yyyy",
				{ locale: ptBR }
			)} a ${format(data.dateRange.endDate, "dd/MM/yyyy", {
				locale: ptBR,
			})}`;
		} else if (
			data.summary?.period?.startDate &&
			data.summary?.period?.endDate
		) {
			dateInfo = ` - Período: ${new Date(
				data.summary.period.startDate
			).toLocaleDateString("pt-BR")} a ${new Date(
				data.summary.period.endDate
			).toLocaleDateString("pt-BR")}`;
		}

		return `${reportName}${dateInfo}`;
	};

	// Função para gerar o nome do arquivo
	const getFileName = () => {
		const baseFileName =
			data.reportType === "ranking"
				? "ranking_vendas"
				: "relatorio_vendas";
		const date = format(new Date(), "yyyy-MM-dd", { locale: ptBR });
		return `${baseFileName}_${date}`;
	};

	// Exportar para CSV
	const exportToCSV = () => {
		try {
			let csvContent = "";

			// Adicionar título do relatório
			csvContent += `${getReportTitle()}\n\n`;

			if (data.reportType === "ranking" && data.operators) {
				// Cabeçalho
				csvContent +=
					"Posição,Nome,Matrícula,Quantidade de Vendas,Valor Total\n";

				// Dados
				data.operators.forEach((op, index) => {
					csvContent += `${index + 1},${op.name},${
						op.registrationNumber
					},${op.salesCount},${op.totalAmount
						.toString()
						.replace(".", ",")}\n`;
				});

				// Totais
				if (data.summary) {
					csvContent += `\nTotal,,,${
						data.summary.totalSales
					},${data.summary.totalAmount
						.toString()
						.replace(".", ",")}\n`;
				}
			} else if (data.reportType === "sales" && data.sales) {
				// Cabeçalho
				csvContent += "Data,Operador,Matrícula,Produto,Valor\n";

				// Dados
				data.sales.forEach((sale) => {
					const date = new Date(sale.saleDate).toLocaleDateString(
						"pt-BR"
					);
					csvContent += `${date},${sale.operatorName},${
						sale.operatorRegistration
					},${sale.product},${sale.amount
						.toString()
						.replace(".", ",")}\n`;
				});

				// Totais
				if (data.summary) {
					csvContent += `\nTotal,,,${
						data.summary.totalSales
					},${data.summary.totalAmount
						.toString()
						.replace(".", ",")}\n`;
				}
			}

			// Criar e baixar o arquivo
			const blob = new Blob([csvContent], {
				type: "text/csv;charset=utf-8;",
			});
			saveAs(blob, `${getFileName()}.csv`);
		} catch (error) {
			console.error("Erro ao exportar para CSV:", error);
		}
	};

	// Exportar para Excel
	const exportToExcel = () => {
		try {
			let worksheetData = [];
			const title = getReportTitle();

			if (data.reportType === "ranking" && data.operators) {
				// Título
				worksheetData.push([title]);
				worksheetData.push([]);

				// Cabeçalho
				worksheetData.push([
					"Posição",
					"Nome",
					"Matrícula",
					"Quantidade de Vendas",
					"Valor Total (R$)",
				]);

				// Dados
				data.operators.forEach((op, index) => {
					worksheetData.push([
						index + 1,
						op.name,
						op.registrationNumber,
						op.salesCount,
						op.totalAmount,
					]);
				});

				// Totais
				if (data.summary) {
					worksheetData.push([]);
					worksheetData.push([
						"Total",
						"",
						"",
						data.summary.totalSales,
						data.summary.totalAmount,
					]);
				}
			} else if (data.reportType === "sales" && data.sales) {
				// Título
				worksheetData.push([title]);
				worksheetData.push([]);

				// Cabeçalho
				worksheetData.push([
					"Data",
					"Operador",
					"Matrícula",
					"Produto",
					"Valor (R$)",
				]);

				// Dados
				data.sales.forEach((sale) => {
					worksheetData.push([
						new Date(sale.saleDate), // Excel formatará corretamente
						sale.operatorName,
						sale.operatorRegistration,
						sale.product,
						sale.amount,
					]);
				});

				// Totais
				if (data.summary) {
					worksheetData.push([]);
					worksheetData.push([
						"Total",
						"",
						"",
						data.summary.totalSales,
						data.summary.totalAmount,
					]);
				}
			}

			// Criar workbook e worksheet
			const wb = XLSX.utils.book_new();
			const ws = XLSX.utils.aoa_to_sheet(worksheetData);

			// Adicionar worksheet ao workbook
			XLSX.utils.book_append_sheet(wb, ws, "Relatório");

			// Gerar arquivo Excel e baixar
			XLSX.writeFile(wb, `${getFileName()}.xlsx`);
		} catch (error) {
			console.error("Erro ao exportar para Excel:", error);
		}
	};

	// Exportar para PDF
	const exportToPDF = () => {
		try {
			const doc = new jsPDF();
			const title = getReportTitle();

			// Adicionar título
			doc.setFontSize(16);
			doc.text(title, 14, 22);

			if (data.reportType === "ranking" && data.operators) {
				// Preparar dados para a tabela
				const tableColumn = [
					"Posição",
					"Nome",
					"Matrícula",
					"Qtd. Vendas",
					"Valor Total (R$)",
				];
				const tableRows = data.operators.map((op, index) => [
					index + 1,
					op.name,
					op.registrationNumber,
					op.salesCount,
					formatCurrency(op.totalAmount),
				]);

				// Adicionar tabela
				(doc as any).autoTable({
					head: [tableColumn],
					body: tableRows,
					startY: 30,
					theme: "striped",
					styles: { fontSize: 10 },
					headStyles: { fillColor: [99, 102, 241] },
				});

				// Adicionar totais
				if (data.summary) {
					const finalY = (doc as any).lastAutoTable.finalY || 30;
					doc.setFontSize(12);
					doc.text(
						`Total de Vendas: ${data.summary.totalSales}`,
						14,
						finalY + 15
					);
					doc.text(
						`Valor Total: ${formatCurrency(
							data.summary.totalAmount
						)}`,
						14,
						finalY + 25
					);
				}
			} else if (data.reportType === "sales" && data.sales) {
				// Preparar dados para a tabela
				const tableColumn = [
					"Data",
					"Operador",
					"Matrícula",
					"Produto",
					"Valor (R$)",
				];
				const tableRows = data.sales.map((sale) => [
					new Date(sale.saleDate).toLocaleDateString("pt-BR"),
					sale.operatorName,
					sale.operatorRegistration,
					sale.product,
					formatCurrency(sale.amount),
				]);

				// Adicionar tabela
				(doc as any).autoTable({
					head: [tableColumn],
					body: tableRows,
					startY: 30,
					theme: "striped",
					styles: { fontSize: 10 },
					headStyles: { fillColor: [99, 102, 241] },
				});

				// Adicionar totais
				if (data.summary) {
					const finalY = (doc as any).lastAutoTable.finalY || 30;
					doc.setFontSize(12);
					doc.text(
						`Total de Vendas: ${data.summary.totalSales}`,
						14,
						finalY + 15
					);
					doc.text(
						`Valor Total: ${formatCurrency(
							data.summary.totalAmount
						)}`,
						14,
						finalY + 25
					);
				}
			}

			// Salvar o PDF
			doc.save(`${getFileName()}.pdf`);
		} catch (error) {
			console.error("Erro ao exportar para PDF:", error);
		}
	};

	// Função para lidar com a exportação
	const handleExport = async () => {
		try {
			setIsExporting(true);

			switch (exportFormat) {
				case "csv":
					exportToCSV();
					break;
				case "excel":
					exportToExcel();
					break;
				case "pdf":
					exportToPDF();
					break;
			}
		} catch (error) {
			console.error("Erro ao exportar relatório:", error);
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
			<h3 className="text-lg font-semibold text-gray-700 mb-4">
				Exportar Relatório
			</h3>

			<div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mb-4">
				<div className="flex items-center">
					<input
						type="radio"
						id="format-excel"
						name="export-format"
						value="excel"
						checked={exportFormat === "excel"}
						onChange={() => setExportFormat("excel")}
						className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
					/>
					<label
						htmlFor="format-excel"
						className="ml-2 block text-sm text-gray-700"
					>
						Excel
					</label>
				</div>

				<div className="flex items-center">
					<input
						type="radio"
						id="format-csv"
						name="export-format"
						value="csv"
						checked={exportFormat === "csv"}
						onChange={() => setExportFormat("csv")}
						className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
					/>
					<label
						htmlFor="format-csv"
						className="ml-2 block text-sm text-gray-700"
					>
						CSV
					</label>
				</div>

				<div className="flex items-center">
					<input
						type="radio"
						id="format-pdf"
						name="export-format"
						value="pdf"
						checked={exportFormat === "pdf"}
						onChange={() => setExportFormat("pdf")}
						className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
					/>
					<label
						htmlFor="format-pdf"
						className="ml-2 block text-sm text-gray-700"
					>
						PDF
					</label>
				</div>
			</div>

			<div className="flex justify-end">
				<Button
					onClick={handleExport}
					isLoading={isExporting}
					disabled={
						isExporting ||
						(data.reportType === "ranking" &&
							(!data.operators || data.operators.length === 0)) ||
						(data.reportType === "sales" &&
							(!data.sales || data.sales.length === 0))
					}
				>
					Exportar Relatório
				</Button>
			</div>
		</div>
	);
};

export default ExportOptions;
