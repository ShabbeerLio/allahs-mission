import React, { useState, useEffect } from "react";
import "./NamazCard.css"; // Import a CSS file for styling
import fazar from "../../Assets/Time/fazar.png"
import duhar from "../../Assets/Time/duhar.png"
import ashar from "../../Assets/Time/ashar.png"
import magrib from "../../Assets/Time/magrib.png"
import isha from "../../Assets/Time/isha.png"
import LocationPermissionPopup from "../Location/GetLocation";
import Azan from "../../Assets/Azan/azan.mp3"
import addNotification from "react-push-notification";

const NamazCard = () => {
  const prayerTimes = [
    { name: "Fazar", time: "05:00", image: fazar },
    { name: "Zohar", time: "12:30", image: duhar },
    { name: "Ashar", time: "16:15", image: ashar },
    { name: "Magrib", time: "17:45", image: magrib },
    { name: "Isha", time: "19:30", image: isha },
    { name: "Jawal", time: "01:53", image: isha },
  ];

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
        let foundPrayer = prayerTimes[prayerTimes.length - 1]; // Default to last prayer
        for (let i = 0; i < prayerTimes.length; i++) {
          const prayerHour = parseInt(prayerTimes[i].time.split(":")[0], 10);
          const prayerMinute = parseInt(prayerTimes[i].time.split(":")[1], 10);

          if (
            currentHour > prayerHour ||
            (currentHour === prayerHour && currentMinute >= prayerMinute)
          ) {
            foundPrayer = prayerTimes[i];
          } else {
            break;
          }
        }

        setCurrentPrayer(foundPrayer);

        // Play Azan sound only once at the matching time
        if (currentTime === foundPrayer.time && !azanPlayed) {
          azanAudio
            .play()
            .catch((error) => {
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
            className={`prayer-item ${prayer.name === currentPrayer.name ? "highlighted" : ""
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
                To get the correct time for your Salah so that you will never miss your Salah.
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