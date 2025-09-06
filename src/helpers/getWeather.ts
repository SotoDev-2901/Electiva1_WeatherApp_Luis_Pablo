export const GetWeather = async (latitude: number, longitude: number) => {
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode&current_weather=true&timezone=auto`;
	const response = await fetch(url);
	const data = await response.json();
	return data;
};