//Mansi Patil
import React, { useState } from "react";
import { Box, Button, Typography, CircularProgress, Paper, Grid, Fade } from "@mui/material";
import { generateReply } from "../Services/openai.ts";

const ActivityRecommendation: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const getActivityRecommendation = async () => {
    setLoading(true);
    setError("");
    setRecommendations([]);
    try {
    
      const locationRes = await fetch("https://ipapi.co/json/");
      if (!locationRes.ok) throw new Error("Failed to fetch location.");
      const locationData = await locationRes.json();
      const { city, region, country, latitude, longitude } = locationData;

   
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      if (!weatherRes.ok) throw new Error("Failed to fetch weather.");
      const weatherData = await weatherRes.json();
      const currentWeather = weatherData.current_weather;
      const weatherInfo = `Temperature: ${currentWeather.temperature}°C, Weather Code: ${currentWeather.weathercode}`;

      const SERP_API_KEY = "aced2baa76674ff7fc21505ce52ba7fbf90adddbdf425cc63d35717362331ee8"; 
      const corsProxy = "https://thingproxy.freeboard.io/fetch/";
      const serpUrl = `${corsProxy}https://serpapi.com/search.json?engine=google&q=current+sports+events+in+${city}&api_key=${SERP_API_KEY}`;
      const eventsRes = await fetch(serpUrl);
      let eventsSummary = "";
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        if (eventsData.organic_results && eventsData.organic_results.length > 0) {
          const eventTitles = eventsData.organic_results
            .slice(0, 3)
            .map((result: any) => result.title);
          eventsSummary = eventTitles.join(", ");
        } else {
          eventsSummary = "No significant sports events found";
        }
      } else {
        eventsSummary = "Unable to fetch sports events data";
      }


      const prompt = `Based on the following details, recommend some fun activities to do:
Location: ${city}, ${region}, ${country}.
Current Weather: ${weatherInfo}.
Current Sports Events: ${eventsSummary}.
Provide concise recommendations.`;


      const reply = await generateReply(prompt);
      setRecommendations(reply.split("\n").filter((rec) => rec.trim() !== ""));
    } catch (err: any) {
      console.error("Error generating recommendation:", err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Activity Recommendation
      </Typography>
      <Button variant="contained" onClick={getActivityRecommendation} disabled={loading}>
        {loading ? "Loading..." : "Get Recommendation"}
      </Button>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {recommendations.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {recommendations.map((rec, index) => (
            <Fade in={true} key={index}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    background: "linear-gradient(45deg, #f3e5f5, #e1bee7)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#4a148c" }}>
                    {rec}
                  </Typography>
                </Paper>
              </Grid>
            </Fade>
          ))}
        </Grid>
      )}
      {error && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ActivityRecommendation;