export const translateToWeekNumber = (dateToTranslate: Date, startDay: Date): number => {
	const daysDiff = Math.floor((getUTCTime(dateToTranslate) - getUTCTime(startDay)) / (1000 * 60 * 60 * 24));
	return 1 + Math.floor(daysDiff / 7);
};

export const setDayToStart = (date: Date): void => {
	date.setHours(0, 0, 0, 0);
};

export const setDayToEnd = (date: Date): void => {
	date.setHours(23, 59, 59, 999);
};

export const getUTCTime = (date: Date): number => {
	return date.getTime() + date.getTimezoneOffset() * 60 * 1000;
};

export const getUTCDate = (date: Date): Date => {
	return new Date(getUTCTime(date));
};
