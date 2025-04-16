import React from "react";
import Card from "../UI/Card";

interface StatisticsCardProps {
	title: string;
	value: number | string;
	description?: string;
	icon?: React.ReactNode;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
	title,
	value,
	description,
	icon,
}) => {
	return (
		<Card className="flex items-center">
			{icon && (
				<div className="mr-4 p-3 rounded-full bg-indigo-100">
					{icon}
				</div>
			)}
			<div>
				<h3 className="text-gray-500 text-sm">{title}</h3>
				<p className="text-2xl font-bold">{value}</p>
				{description && (
					<p className="text-sm text-gray-600">{description}</p>
				)}
			</div>
		</Card>
	);
};

export default StatisticsCard;
