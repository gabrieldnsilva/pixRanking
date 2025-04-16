import React, { useState } from "react";
import Button from "../UI/Button";
import Card from "../UI/Card";

interface CSVUploaderProps {
	onUpload: (file: File) => Promise<void>;
	isLoading?: boolean;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({
	onUpload,
	isLoading = false,
}) => {
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			setFile(e.dataTransfer.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		try {
			await onUpload(file);
			setFile(null);
		} catch (error) {
			console.error("Error uploading file:", error);
		}
	};

	return (
		<Card title="Upload de Arquivo CSV" className="w-full max-w-xl mx-auto">
			<form onSubmit={handleSubmit} className="space-y-6">
				<div
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={`border-2 border-dashed rounded-lg p-10 text-center 
                    ${
						isDragging
							? "border-indigo-500 bg-indigo-50"
							: "border-gray-300"
					}`}
				>
					<svg
						className="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1}
							d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>

					<div className="mt-4">
						<input
							id="file-upload"
							name="file-upload"
							type="file"
							accept=".csv"
							onChange={handleFileChange}
							className="sr-only"
						/>
						<label
							htmlFor="file-upload"
							className="cursor-pointer inline-flex text-indigo-600 hover:text-indigo-500"
						>
							<span>Selecione um arquivo CSV</span>
						</label>
						<p className="text-xs text-gray-500 mt-1">
							ou arraste e solte
						</p>
					</div>
				</div>

				{file && (
					<div className="bg-gray-50 p-4 rounded-md">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<svg
									className="h-6 w-6 text-indigo-600 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								<span className="text-sm text-gray-700">
									{file.name}
								</span>
							</div>
							<button
								type="button"
								onClick={() => setFile(null)}
								className="text-gray-400 hover:text-gray-500"
							>
								<span className="sr-only">Remover</span>
								<svg
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>
				)}

				<div>
					<Button
						type="submit"
						disabled={!file || isLoading}
						isLoading={isLoading}
						className="w-full"
					>
						Processar Arquivo
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default CSVUploader;
