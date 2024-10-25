import express from 'express';
const router = express.Router();
router.route('/').get((req, res) => {
  res.status(200).json({
    success: true,
    message: 'App is running Yaaaaye 🔥',
    url: req.originalUrl,
    path: req.route.path,
    host: req.hostname,
    fresh: req.fresh,
    method: req.method,
    protocol: req.protocol,
    secure: req.secure,
    ip: req.ip,
    ips: req.ips,
  });
});
router.route('/geocode').get(async (req, res) => {
  const q = req.query;
  if (!q) {
    return res
      .status(400)
      .json({ error: 'lat and log query parameters are required.' });
  }
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${q}&key=${process.env.API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching address: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.route('/getAddress').get(async (req, res) => {
    const { lat, log } = req.query;    
    const query = encodeURIComponent(`${lat} ${log}`);
    if (!query) {
      return res
        .status(400)
        .json({ error: 'lat and log query parameters are required.' });
    }
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${process.env.API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching address: ${response.statusText}`);
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
router.route('/forecast').get(async (req, res) => {
  const { lat, log } = req.query;

  if (!lat || !log) {
    return res
      .status(400)
      .json({ error: 'lat and log query parameters are required.' });
  }
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${log}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m`
    );
    if (!response.ok) {
      throw new Error(`Error fetching address: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
export default router;
