import React, { useState } from "react";
import Button from "../UI/Button";

interface OperatorFormProps {
	onSubmit: (data: FormData) => void;
	isLoading?: boolean;
}

const OperatorForm: React.FC<OperatorFormProps> = ({
	onSubmit,
	isLoading = false,
}) => {
	const [name, setName] = useState("");
	const [registrationNumber, setRegistrationNumber] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setImage(file);

			// Create a preview
			const reader = new FileReader();
			reader.onload = () => {
				setPreviewUrl(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!name || !registrationNumber) return;

		const formData = new FormData();
		formData.append("name", name);
		formData.append("registrationNumber", registrationNumber);
		if (image) formData.append("profileImage", image);

		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-gray-700"
				>
					Nome
				</label>
				<input
					id="name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					required
				/>
			</div>

			<div>
				<label
					htmlFor="registrationNumber"
					className="block text-sm font-medium text-gray-700"
				>
					Matrícula
				</label>
				<input
					id="registrationNumber"
					type="text"
					value={registrationNumber}
					onChange={(e) => setRegistrationNumber(e.target.value)}
					className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					required
				/>
			</div>

			<div>
				<label
					htmlFor="profileImage"
					className="block text-sm font-medium text-gray-700"
				>
					Foto (opcional)
				</label>
				<input
					id="profileImage"
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					className="mt-1 block w-full text-sm text-gray-500 
                    file:mr-4 file:py-2 file:px-4 file:rounded-md
                    file:border-0 file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
				/>
				{previewUrl && (
					<div className="mt-2">
						<img
							src={previewUrl}
							alt="Preview"
							className="h-32 w-32 object-cover rounded-full"
						/>
					</div>
				)}
			</div>

			<div>
				<Button type="submit" isLoading={isLoading}>
					Cadastrar Operadora
				</Button>
			</div>
		</form>
	);
};

export default OperatorForm;
