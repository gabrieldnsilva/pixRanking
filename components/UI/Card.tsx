import React, { ReactNode } from "react";

interface CardProps {
	children: ReactNode;
	title?: string;
	className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, className = "" }) => {
	return (
		<div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
			{title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
			{children}
		</div>
	);
};

export default Card;
