import axios from 'axios';
export const getPlacesData = async () => {
  const UNSW_CENTER = { lng: 151.230996, lat: -33.917867 };
  const KM_TO_LAT = 1 / 111; // ≈ 0.009
  const KM_TO_LNG = 1 / (111 * Math.cos((UNSW_CENTER.lat * Math.PI) / 180)); // ≈ 0.0108 at UNSW

  const latDeltaNE = 0.53 * KM_TO_LAT;
  const lngDeltaNE = 0.53 * KM_TO_LNG;

  const latDeltaSW = 0.43 * KM_TO_LAT;
  const lngDeltaSW = 0.43 * KM_TO_LNG;

  const ne = {
    lat: UNSW_CENTER.lat + latDeltaNE,
    lng: UNSW_CENTER.lng + lngDeltaNE,
  };

  const sw = {
    lat: UNSW_CENTER.lat - latDeltaSW,
    lng: UNSW_CENTER.lng - lngDeltaSW,
  };
  try {
    const {
      data: { data },
    } = await axios.get(
      `https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary`,
      {
        params: {
          bl_latitude: sw.lat,
          bl_longitude: sw.lng,
          tr_longitude: ne.lng,
          tr_latitude: ne.lat,
        },
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_TRAVEL_ADVISORY_API_KEY,
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        },
      }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};
