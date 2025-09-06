import React, { useState } from "react";
import ciudades from "./helpers/ciudades.json";
import { GetWeather } from "./helpers/GetWeather";
import codWeather from "./helpers/codWeather.json";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [weather, setWeather] = useState<
    | {
        temperature: number;
        windspeed: number;
        winddirection: number;
        weathercode: number;
        humidity?: number;
      }
    | string
    | null
  >(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWeather(null);
    const ciudadEncontrada = ciudades.find(
      (c) => c.ciudad.toLowerCase() === city.trim().toLowerCase()
    );
    if (ciudadEncontrada) {
      setResult(
        `Latitud: ${ciudadEncontrada.lat}, Longitud: ${ciudadEncontrada.lng}`
      );
      try {
        const weatherData = await GetWeather(
          ciudadEncontrada.lat,
          ciudadEncontrada.lng
        );
        let humedad = null;
        if (
          weatherData.hourly &&
          weatherData.hourly.relativehumidity_2m &&
          weatherData.hourly.time &&
          weatherData.hourly.relativehumidity_2m.length > 0
        ) {
          const currentTime = weatherData.current_weather.time;
          const index = weatherData.hourly.time.findIndex(
            (t: string) => t === currentTime
          );
          if (index !== -1) {
            humedad = weatherData.hourly.relativehumidity_2m[index];
          } else {
            humedad = weatherData.hourly.relativehumidity_2m[0];
          }
        }
        setWeather({
          ...weatherData.current_weather,
          humidity: humedad,
        });
      } catch (error) {
        console.error(error);
        setWeather("Error al obtener el clima");
      }
    } else {
      setResult("Ciudad no encontrada");
      setWeather(null);
    }
  };

  return (
    <>
      <div>
        <h2>Weather App</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={city}
            onChange={handleInputChange}
            placeholder="Ingresa una ciudad"
          />
          <button type="submit">Buscar</button>
        </form>
        {result && <p>{result}</p>}
        {weather && typeof weather === "object" && (
          <div>
            <h3>Clima actual:</h3>
            <p>Temperatura: {weather.temperature}°C</p>
            <p>Viento: {weather.windspeed} km/h</p>
            <p>Dirección del viento: {weather.winddirection}°</p>
            <p>
              Humedad:{" "}
              {weather.humidity !== undefined
                ? weather.humidity + "%"
                : "No disponible"}
            </p>
            <p>
              Descripción:{" "}
              {codWeather.weatherCodeDescriptions[
                weather.weathercode as unknown as keyof typeof codWeather.weatherCodeDescriptions
              ] || "No disponible"}
            </p>
          </div>
        )}
        {weather && typeof weather === "string" && <p>{weather}</p>}
      </div>
    </>
  );
}

export default WeatherApp;
