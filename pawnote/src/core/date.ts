export const translateToWeekNumber = (dateToTranslate: Date, startDay: Date): number => {
	const daysDiff = Math.floor((getTimeUTC(dateToTranslate) - getTimeUTC(startDay)) / (1000 * 60 * 60 * 24));
	return 1 + Math.floor(daysDiff / 7);
};

export const setDayToStart = (date: Date): void => {
	date.setHours(0, 0, 0, 0);
};

export const setDayToEnd = (date: Date): void => {
	date.setHours(23, 59, 59, 999);
};

export const getTimeUTC = (date: Date): number => {
	return date.getTime() + date.getTimezoneOffset() * 60 * 1000;
};

export const getDateUTC = (date: Date): Date => {
	return new Date(getTimeUTC(date));
};
