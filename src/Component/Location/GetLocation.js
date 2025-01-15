import React, { useEffect, useState } from "react";

const LocationPermissionPopup = () => {
    const [showPopup, setShowPopup] = useState(true); // Popup state
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [locationName, setLocationName] = useState(""); // Store location name
    const [error, setError] = useState("");

    const handleAllow = () => {
        // Request location when user clicks "Allow"
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    setLocation({ lat, lon });
                    setShowPopup(false); // Close the popup

                    // Fetch location name using reverse geocoding
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
                        );
                        const data = await response.json();
                        const city = data.address.city || data.address.town || data.address.village;
                        const country = data.address.country;
                        setLocationName(`${city},${country}`);
                    } catch (err) {
                        setError("Failed to fetch location name.");
                    }
                },
                (err) => {
                    switch (err.code) {
                        case err.PERMISSION_DENIED:
                            setError("You denied the location request.");
                            break;
                        case err.POSITION_UNAVAILABLE:
                            setError("Location is unavailable.");
                            break;
                        case err.TIMEOUT:
                            setError("Location request timed out.");
                            break;
                        default:
                            setError("An unknown error occurred.");
                    }
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    };

    const handleDeny = () => {
        setError("You denied the location request.");
        setShowPopup(false); // Close the popup
    };

    const ApiUrl = "";
    const API_KEY = ""
    // const ApiUrl = "https://muslimsalat.com/";
    // const API_KEY = "e57373a5d3ea65db648ddcc2e67ab388"

    const [prayerTimes, setPrayerTimes] = useState(null);


    useEffect(() => {
        // Fetch prayer times on component mount
        const fetchPrayerTimes = async () => {
            try {
                const response = await fetch(
                    `${ApiUrl}${locationName}/daily.json?key=${API_KEY}&jsoncallback=?`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch prayer times");
                }

                const textResponse = await response.text();
                console.log(textResponse,"textResponse")
                const jsonResponse = JSON.parse(textResponse.slice(2, -1)); // Removing `?()` wrapper from response
                setPrayerTimes(jsonResponse);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPrayerTimes();
    }, [location]);
    console.log(prayerTimes, "prayerTimes")

    return (
        <div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Location Access Required</h2>
                        <p>
                            To get the correct time for your Salah so that you will never miss your Salah.
                        </p>
                        <div className="popup-buttons">
                            <button className="allow-btn" onClick={handleAllow}>
                                Allow
                            </button>
                            <button className="deny-btn" onClick={handleDeny}>
                                Deny
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationPermissionPopup;