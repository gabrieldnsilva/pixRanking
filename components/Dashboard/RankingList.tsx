import React from "react";
import Card from "../UI/Card";

interface Operator {
	id: string;
	name: string;
	registrationNumber: string;
	profileImage?: string;
	salesCount: number;
}

interface RankingListProps {
	operators: Operator[];
}

const RankingList: React.FC<RankingListProps> = ({ operators }) => {
	return (
		<Card title="Ranking de Vendas PIX" className="w-full">
			<div className="space-y-4">
				{operators.length === 0 ? (
					<p className="text-gray-500 text-center py-4">
						Nenhum dado disponível
					</p>
				) : (
					operators.map((operator, index) => (
						<div
							key={operator.id}
							className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
						>
							<div className="flex items-center justify-center bg-indigo-100 rounded-full w-10 h-10 mr-4">
								<span className="text-indigo-800 font-semibold">
									{index + 1}
								</span>
							</div>

							<div className="flex-1">
								<h4 className="font-semibold">
									{operator.name}
								</h4>
								<p className="text-sm text-gray-600">
									Matrícula: {operator.registrationNumber}
								</p>
							</div>

							<div className="text-right">
								<div className="font-bold text-xl text-indigo-600">
									{operator.salesCount}
								</div>
								<div className="text-gray-500 text-sm">
									vendas
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</Card>
	);
};

export default RankingList;
