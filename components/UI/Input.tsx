import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	helperText?: string;
	fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			error,
			helperText,
			fullWidth = true,
			className = "",
			...props
		},
		ref
	) => {
		return (
			<div className={`${fullWidth ? "w-full" : ""} mb-4`}>
				{label && (
					<label htmlFor={props.id} className="form-label">
						{label}
						{props.required && (
							<span className="text-red-500 ml-1">*</span>
						)}
					</label>
				)}

				<input
					ref={ref}
					className={`form-input ${
						error ? "error" : ""
					} ${className}`}
					{...props}
				/>

				{error && <p className="error-message">{error}</p>}

				{helperText && !error && (
					<p className="text-sm text-gray-500 mt-1">{helperText}</p>
				)}
			</div>
		);
	}
);

Input.displayName = "Input";

export default Input;
