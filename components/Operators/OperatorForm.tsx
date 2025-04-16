import React, { useState, useEffect } from "react";
import Button from "../UI/Button";

interface Operator {
	_id?: string;
	name: string;
	registrationNumber: string;
	profileImage?: string;
}

interface OperatorFormProps {
	onSubmit: (data: FormData) => Promise<void>;
	isLoading?: boolean;
	initialData?: Partial<Operator>;
	mode?: "create" | "edit";
}

const OperatorForm: React.FC<OperatorFormProps> = ({
	onSubmit,
	isLoading = false,
	initialData = {},
	mode = "create",
}) => {
	const [name, setName] = useState(initialData.name || "");
	const [registrationNumber, setRegistrationNumber] = useState(
		initialData.registrationNumber || ""
	);
	const [image, setImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		initialData.profileImage || null
	);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

	// Validação de campos quando mudam
	useEffect(() => {
		if (touched.name) validateField("name", name);
	}, [name, touched.name]);

	useEffect(() => {
		if (touched.registrationNumber)
			validateField("registrationNumber", registrationNumber);
	}, [registrationNumber, touched.registrationNumber]);

	// Funções de validação
	const validateField = (field: string, value: string) => {
		let newErrors = { ...errors };

		if (field === "name") {
			if (!value.trim()) {
				newErrors.name = "Nome é obrigatório";
			} else if (value.length < 3) {
				newErrors.name = "Nome deve ter pelo menos 3 caracteres";
			} else {
				delete newErrors.name;
			}
		}

		if (field === "registrationNumber") {
			if (!value.trim()) {
				newErrors.registrationNumber = "Matrícula é obrigatória";
			} else if (!/^\d+$/.test(value)) {
				newErrors.registrationNumber =
					"Matrícula deve conter apenas números";
			} else {
				delete newErrors.registrationNumber;
			}
		}

		setErrors(newErrors);
	};

	// Marca campo como tocado quando perde o foco
	const handleBlur = (field: string) => {
		setTouched({ ...touched, [field]: true });
		validateField(field, field === "name" ? name : registrationNumber);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];

			// Validação do tipo de arquivo
			if (!file.type.startsWith("image/")) {
				setErrors({
					...errors,
					image: "O arquivo deve ser uma imagem",
				});
				return;
			}

			// Validação do tamanho do arquivo (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				setErrors({
					...errors,
					image: "A imagem deve ter no máximo 5MB",
				});
				return;
			}

			setImage(file);
			delete errors.image;
			setErrors({ ...errors });

			// Criar uma prévia
			const reader = new FileReader();
			reader.onload = () => {
				setPreviewUrl(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Marcar todos os campos como tocados para exibir erros
		setTouched({
			name: true,
			registrationNumber: true,
		});

		// Validar todos os campos
		validateField("name", name);
		validateField("registrationNumber", registrationNumber);

		// Verificar se há erros
		if (!name || !registrationNumber || Object.keys(errors).length > 0) {
			return;
		}

		// Criar FormData para envio
		const formData = new FormData();
		formData.append("name", name);
		formData.append("registrationNumber", registrationNumber);

		if (image) {
			formData.append("profileImage", image);
		} else if (previewUrl && initialData.profileImage) {
			// Manter a imagem existente
			formData.append("keepExistingImage", "true");
		}

		if (mode === "edit" && initialData._id) {
			formData.append("_id", initialData._id);
		}

		try {
			await onSubmit(formData);
		} catch (error) {
			console.error("Erro ao enviar formulário:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-gray-700"
				>
					Nome <span className="text-red-500">*</span>
				</label>
				<input
					id="name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					onBlur={() => handleBlur("name")}
					className={`mt-1 block w-full px-3 py-2 border ${
						errors.name ? "border-red-500" : "border-gray-300"
					} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
				/>
				{errors.name && (
					<p className="mt-1 text-sm text-red-500">{errors.name}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="registrationNumber"
					className="block text-sm font-medium text-gray-700"
				>
					Matrícula <span className="text-red-500">*</span>
				</label>
				<input
					id="registrationNumber"
					type="text"
					value={registrationNumber}
					onChange={(e) => setRegistrationNumber(e.target.value)}
					onBlur={() => handleBlur("registrationNumber")}
					className={`mt-1 block w-full px-3 py-2 border ${
						errors.registrationNumber
							? "border-red-500"
							: "border-gray-300"
					} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
				/>
				{errors.registrationNumber && (
					<p className="mt-1 text-sm text-red-500">
						{errors.registrationNumber}
					</p>
				)}
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
				{errors.image && (
					<p className="mt-1 text-sm text-red-500">{errors.image}</p>
				)}
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
					{mode === "create"
						? "Cadastrar Operadora"
						: "Salvar Alterações"}
				</Button>
			</div>
		</form>
	);
};

export default OperatorForm;
