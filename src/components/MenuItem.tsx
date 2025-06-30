import React from 'react';

interface MenuItemProps {
	Icon: React.ElementType;
	title: string;
	color: string;
	onClickFunction?: () => void;
	ExtraStyles?: string;
}

export default function MenuItem({
	Icon,
	title,
	onClickFunction,
	ExtraStyles = '',
}: MenuItemProps) {
	return (
		<div
			className={`flex items-center gap-3 w-80 px-4 py-3 rounded-lg shadow-md bg-gray-800 hover:bg-gray-700 cursor-pointer transition duration-200 ${ExtraStyles}`}
			onClick={onClickFunction}
		>
			<Icon className='text-slate-100 h-6 w-6' />
			<h3 className='text-slate-100 text-base font-medium'>{title}</h3>
		</div>
	);
}
