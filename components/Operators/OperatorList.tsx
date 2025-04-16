import React from "react";
import Button from "../UI/Button";
import Link from "next/link";

interface Operator {
	id: string;
	name: string;
	registrationNumber: string;
	profileImage?: string;
	createdAt: string;
}

interface OperatorListProps {
	operators: Operator[];
	onDelete?: (id: string) => void;
	isLoading?: boolean;
}

const OperatorList: React.FC<OperatorListProps> = ({
	operators,
	onDelete,
	isLoading = false,
}) => {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full bg-white rounded-lg overflow-hidden">
				<thead className="bg-gray-100">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Operadora
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Matrícula
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Data de Cadastro
						</th>
						<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Ações
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200">
					{operators.length === 0 ? (
						<tr>
							<td
								colSpan={4}
								className="px-6 py-4 text-center text-gray-500"
							>
								Nenhuma operadora cadastrada
							</td>
						</tr>
					) : (
						operators.map((operator) => (
							<tr key={operator.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										{operator.profileImage ? (
											<img
												className="h-10 w-10 rounded-full mr-3"
												src={operator.profileImage}
												alt={operator.name}
											/>
										) : (
											<div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
												<span className="text-indigo-800 font-semibold">
													{operator.name.charAt(0)}
												</span>
											</div>
										)}
										<div>
											<div className="font-medium text-gray-900">
												{operator.name}
											</div>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-900">
									{operator.registrationNumber}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-900">
									{new Date(
										operator.createdAt
									).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<div className="flex justify-end space-x-2">
										<Link
											href={`/operators/${operator.id}`}
											passHref
										>
											<Button
												variant="secondary"
												className="text-xs px-2 py-1"
											>
												Editar
											</Button>
										</Link>
										{onDelete && (
											<Button
												variant="danger"
												className="text-xs px-2 py-1"
												onClick={() =>
													onDelete(operator.id)
												}
												disabled={isLoading}
											>
												Excluir
											</Button>
										)}
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default OperatorList;
