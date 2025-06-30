export function formatReadableDateTime(providedDateTime: string | number | Date): string {
	const date = new Date(providedDateTime);

	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	};

	return date.toLocaleString('en-US', options);
}
