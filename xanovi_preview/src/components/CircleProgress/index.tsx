import React from "react";

interface CircleProgressProps {
	value: number;
	max: number;
	textFormat?: "percent" | "vertical";
	size?: number;
}

const CircleProgress: React.FC<CircleProgressProps> = ({ value, max, textFormat = "vertical", size = 100 }) => {
	const radius = 36;
	const circumference = 2 * Math.PI * radius;

	const ratio = max === 0 ? 0 : Math.min(Math.max(value / max, 0), 1);

	const dashOffset = circumference * (1 - ratio);

	const percentText = Math.round((value / max) * 100);

	return (
		<svg width={size} height={size} viewBox="0 0 100 100" className="circle-progress">
			{/* Cercle de fond */}
			<circle cx="50" cy="50" r={radius} className="circle-progress-bg" />

			{/* Cercle de valeur */}
			<circle
				cx="50"
				cy="50"
				r={radius}
				className="circle-progress-value"
				style={{
					strokeDasharray: circumference,
					strokeDashoffset: dashOffset,
				}}
			/>

			{/* Texte */}
			<text x="50" y="50" className="circle-progress-text" textAnchor="middle" dominantBaseline="central">
				{textFormat === "vertical" ? `${value}/${max}` : `${percentText}%`}
			</text>
		</svg>
	);
};

export default CircleProgress;
