import React, { useState, useEffect, useRef } from "react";
import "./NamazCard.css"; // Import a CSS file for styling
import fazar from "../../Assets/Time/fazar.png";
import duhar from "../../Assets/Time/duhar.png";
import ashar from "../../Assets/Time/ashar.png";
import magrib from "../../Assets/Time/magrib.png";
import isha from "../../Assets/Time/isha.png";
import LocationPermissionPopup from "../Location/GetLocation";
import Azan from "../../Assets/Azan/azan.mp3";
import addNotification from "react-push-notification";
import axios from "axios";

const NamazCard = () => {
  const ALADHAN_API_BASE_URL = "https://api.aladhan.com/v1/timingsByCity";
  const BIGDATACLOUD_BASE_URL =
    "https://api.bigdatacloud.net/data/reverse-geocode-client";

  const inputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [prayerTimess, setPrayerTimes] = useState(null);
  const [date, setDate] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchPlaces = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`
        );
        const data = await response.json();
        const places = data.map((place) => ({
          name: place.display_name,
          lat: place.lat,
          lon: place.lon,
        }));
        setSuggestions(places);
      } catch (err) {
        console.error("Error fetching places:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchPlaces();
    }, 300); // debounce delay

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        listRef.current &&
        !listRef.current.contains(event.target) &&
        inputRef.current !== event.target
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (place) => {
    const name = place.name;
    const latitude = place.lat;
    const longitude = place.lon;
    setQuery(place.name);

    searchForLocation(name, latitude, longitude);
    setSuggestions([]);
  };

  function searchForLocation(city, latitude, longitude) {
    axios
      .get(ALADHAN_API_BASE_URL, {
        params: {
          city: city,
          country: city,
        },
      })
      .then((response) => {
        const data = response.data.data;
        console.log(data, "data");

        setDate({
          gregorian: data.date.readable,
          hijri: {
            day: data.date.hijri.day,
            month: data.date.hijri.month.number,
            weekday: data.date.hijri.weekday.ar,
            year: data.date.hijri.year,
          },
        });

        setPrayerTimes({
          Fajr: data.timings.Fajr,
          Sunrise: data.timings.Sunrise,
          Dhuhr: data.timings.Dhuhr,
          Asr: data.timings.Asr,
          Maghrib: data.timings.Maghrib,
          Isha: data.timings.Isha,
        });

        const { timezone } = [data.meta];
        searchLocationName(latitude, longitude, timezone);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        alert("❌ لا يوجد مكان بهذا الاسم");
      });
  }

  function searchLocationName(latitude, longitude, timezone) {
    axios
      .get(BIGDATACLOUD_BASE_URL, {
        params: {
          latitude,
          longitude,
          localityLanguage: "en",
        },
      })
      .then((response) => {
        console.log(response, "response");
        const { city, countryName } = response.data;
        setLocationName({ city, country: countryName, timezone });
      })
      .catch(() => {
        const fallbackCity = inputRef.current.value;
        setLocationName({ city: fallbackCity, country: "", timezone });
      })
      .finally(() => {
        setIsLoading(false);
        setIsError(false);
      });
  }

  const hijriDate = date
    ? `(${date.hijri.year}/${date.hijri.month}/${date.hijri.day})`
    : "";
  const gregorianDate = date?.gregorian;

  console.log(prayerTimess, "prayerTimess");
  const imageMap = {
    Fajr: fazar,
    Dhuhr: duhar,
    Asr: ashar,
    Maghrib: magrib,
    Isha: isha,
    Sunrise: isha,
  };
  let prayerTimes = [];
  if (prayerTimess === null) {
    prayerTimes = [
      { name: "Fazar", time: "05:00", image: fazar },
      { name: "Zohar", time: "12:30", image: duhar },
      { name: "Ashar", time: "16:15", image: ashar },
      { name: "Magrib", time: "17:45", image: magrib },
      { name: "Isha", time: "19:30", image: isha },
      { name: "Jawal", time: "11:30", image: isha },
    ];
  } else {
    prayerTimes = Object.entries(prayerTimess).map(([name, time]) => ({
      name,
      time,
      image: imageMap[name] || null,
    }));

    console.log(prayerTimes);
  }

  const [currentPrayer, setCurrentPrayer] = useState(prayerTimes[0]);
  const [azanPlayed, setAzanPlayed] = useState(false); // Tracks if Azan has already played
  const [isPermissionGranted, setIsPermissionGranted] = useState(false); // Permission flag
  const azanAudio = new Audio(Azan);

  // Request for notification permission
  const handleUserPermission = () => {
    setIsPermissionGranted(true);
  };

  // Function to send push notification
  const sendPushNotification = (prayer) => {
    addNotification({
      title: `${prayer.name} Azan Time`,
      message: `It's time for ${prayer.name} prayer!`,
      theme: "dark", // You can use "light" or "dark" theme
      native: true, // Uses the browser's native notification system
      icon: prayer.image, // Optional: prayer image as icon
      duration: 5000, // Duration for the notification in milliseconds (default: 5000ms)
    });
  };

  // Function to handle Azan audio playback and notifications
  useEffect(() => {
    if (isPermissionGranted) {
      const interval = setInterval(() => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentTime = `${String(currentHour).padStart(2, "0")}:${String(
          currentMinute
        ).padStart(2, "0")}`;

        // Determine current prayer
        let foundPrayer = null;
        for (let i = 0; i < prayerTimes.length; i++) {
          const [hour, minute] = prayerTimes[i].time.split(":").map(Number);
          if (
            currentHour < hour ||
            (currentHour === hour && currentMinute < minute)
          ) {
            foundPrayer = prayerTimes[i];
            break;
          }
        }

        // If all prayer times have passed today, fallback to the last one (e.g., Isha)
        if (!foundPrayer) {
          foundPrayer = prayerTimes[prayerTimes.length - 1];
        }

        setCurrentPrayer(foundPrayer);

        // Play Azan sound only once at the matching time
        if (currentTime === foundPrayer.time && !azanPlayed) {
          azanAudio.play().catch((error) => {
            console.error("Error playing Azan sound:", error);
          });
          setAzanPlayed(true); // Mark Azan as played

          // Send notification when Azan time is reached
          sendPushNotification(foundPrayer);
        }

        // Reset Azan flag after the prayer time has passed
        if (currentTime !== foundPrayer.time) {
          setAzanPlayed(false);
        }
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval
    }
  }, [azanAudio, azanPlayed, isPermissionGranted]);

  return (
    <div className="prayer-card">
      {/* Top Image Section */}
      {/* <LocationPermissionPopup /> */}
      <div className="inpt-bx">
        <label htmlFor="location">Enter Location</label>
        <div className="inpt">
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Enter your Location"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputRef}
            required
          />
          {suggestions.length > 0 && (
            <ul id="suggestions1" className="suggestions-list" ref={listRef}>
              {suggestions.map((place, index) => (
                <li key={index} onClick={() => handleSuggestionClick(place)}>
                  {place.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div
        className="prayer-image"
        style={{ backgroundImage: `url(${currentPrayer.image})` }}
      >
        <div className="prayer-overlay">
          <h2 className="prayer-title">{currentPrayer.name}</h2>
          <p className="prayer-time-overlay">{currentPrayer.time}</p>
        </div>
      </div>

      {/* List Section */}
      <div className="prayer-list">
        {prayerTimes.map((prayer) => (
          <div
            key={prayer.name}
            className={`prayer-item ${
              prayer.name === currentPrayer.name ? "highlighted" : ""
            }`}
          >
            <span className="prayer-name">{prayer.name}:</span>
            <span className="prayer-time">{prayer.time}</span>
          </div>
        ))}
        {/* Request Permission Button */}
        {!isPermissionGranted && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Permission Access Required</h2>
              <p>
                To get the correct time for your Salah so that you will never
                miss your Salah.
              </p>
              <div className="popup-buttons">
                <button className="allow-btn" onClick={handleUserPermission}>
                  Allow
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NamazCard;
