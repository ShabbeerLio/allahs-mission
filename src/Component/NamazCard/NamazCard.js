import React, { useState, useEffect } from "react";
import "./NamazCard.css"; // Import a CSS file for styling
import fazar from "../../Assets/Time/fazar.png"
import duhar from "../../Assets/Time/duhar.png"
import ashar from "../../Assets/Time/ashar.png"
import magrib from "../../Assets/Time/magrib.png"
import isha from "../../Assets/Time/isha.png"
import LocationPermissionPopup from "../Location/GetLocation";

const NamazCard = () => {
    const prayerTimes = [
        { name: "Fazar", time: "5:00 AM", image: fazar },
        { name: "Zohar", time: "12:30 PM", image: duhar },
        { name: "Ashar", time: "4:15 PM", image: ashar },
        { name: "Magrib", time: "6:45 PM", image: magrib },
        { name: "Isha", time: "8:15 PM", image: isha },
      ];
    
      const [currentPrayer, setCurrentPrayer] = useState(prayerTimes[0]);
    
      useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) setCurrentPrayer(prayerTimes[0]);
        else if (currentHour >= 12 && currentHour < 16) setCurrentPrayer(prayerTimes[1]);
        else if (currentHour >= 16 && currentHour < 18) setCurrentPrayer(prayerTimes[2]);
        else if (currentHour >= 18 && currentHour < 20) setCurrentPrayer(prayerTimes[3]);
        else setCurrentPrayer(prayerTimes[4]);
      }, []);
    
      return (
        <div className="prayer-card">
          {/* Top Image Section */}
            <LocationPermissionPopup/>
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
          </div>
        </div>
      );
    };
    

export default NamazCard;