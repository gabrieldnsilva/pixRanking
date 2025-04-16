import React, { useRef } from "react";
import Button from "../UI/Button";

interface FallbackExportTableProps {
	data: any[];
	title: string;
	filename?: string;
}

const FallbackExportTable: React.FC<FallbackExportTableProps> = ({
	data,
	title,
	filename = "exported-data",
}) => {
	const tableRef = useRef<HTMLDivElement>(null);

	// Function to print the table
	const handlePrint = () => {
		if (!tableRef.current) return;

		const printContents = tableRef.current.innerHTML;
		const originalContents = document.body.innerHTML;

		document.body.innerHTML = `
      <div style="padding: 20px;">
        <h1 style="margin-bottom: 20px;">${title}</h1>
        <div>${printContents}</div>
      </div>
    `;

		window.print();
		document.body.innerHTML = originalContents;
		window.location.reload();
	};

	// Get the column headers from the first data item
	const headers = data.length > 0 ? Object.keys(data[0]) : [];

	return (
		<div className="mt-6 border p-4 bg-gray-50 rounded-lg">
			<h3 className="font-medium text-lg mb-3">{title}</h3>

			<p className="mb-4 text-sm text-gray-600">
				Se a exportação em PDF falhar, você pode imprimir esta tabela ou
				copiar o conteúdo.
			</p>

			<div className="mb-4">
				<Button
					variant="secondary"
					onClick={handlePrint}
					className="mr-2"
				>
					<span className="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 mr-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
							/>
						</svg>
						Imprimir
					</span>
				</Button>
			</div>

			<div className="overflow-x-auto" ref={tableRef}>
				<table className="min-w-full divide-y divide-gray-200 border">
					<thead className="bg-gray-50">
						<tr>
							{headers.map((header, i) => (
								<th
									key={i}
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
								>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{data.map((row, rowIndex) => (
							<tr key={rowIndex}>
								{headers.map((header, cellIndex) => (
									<td
										key={cellIndex}
										className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b"
									>
										{row[header]?.toString?.() || ""}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default FallbackExportTable;
