import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const ALADHAN_API_BASE_URL = 'https://api.aladhan.com/v1/timingsByCity';
const BIGDATACLOUD_BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Check({ onSelect }) {
    const inputRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [prayerTimes, setPrayerTimes] = useState(null);
    const [date, setDate] = useState(null);
    const [locationName, setLocationName] = useState(null);
    const [query, setQuery] = useState('');
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
                console.error('Error fetching places:', err);
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

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSuggestionClick = (place) => {
        const name = place.name
        const latitude = place.lat;
        const longitude = place.lon
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
                console.log(data, "data")

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
                alert('❌ لا يوجد مكان بهذا الاسم');
            });
    }

    function searchLocationName(latitude, longitude, timezone) {
        axios
            .get(BIGDATACLOUD_BASE_URL, {
                params: {
                    latitude,
                    longitude,
                    localityLanguage: 'en',
                },
            })
            .then((response) => {
                console.log(response, "response")
                const { city, countryName } = response.data;
                setLocationName({ city, country: countryName, timezone });
            })
            .catch(() => {
                const fallbackCity = inputRef.current.value;
                setLocationName({ city: fallbackCity, country: '', timezone });
            })
            .finally(() => {
                setIsLoading(false);
                setIsError(false);
            });
    }

    const hijriDate = date ? `(${date.hijri.year}/${date.hijri.month}/${date.hijri.day})` : '';
    const gregorianDate = date?.gregorian;

    return (
        <div style={{ padding: '20px', marginTop: "10rem" }}>
            <div className="inpt-bx">
                <label htmlFor="location">Birth Place</label>
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

            {isLoading ? (
                <p>جاري التحميل...</p>
            ) : isError ? (
                <h1>❌</h1>
            ) : locationName ? (
                <div style={{ marginTop: '20px' }}>
                    <h2>{locationName.city}, {locationName.country}</h2>
                    <p>{date?.hijri.weekday}</p>
                    <p>{gregorianDate} - {hijriDate}</p>
                    <ul>
                        {prayerTimes && Object.entries(prayerTimes).map(([name, time]) => (
                            <li key={name}>{name}: {time}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p style={{ marginTop: '20px' }}>اكتب اسم المدينة في خانة البحث</p>
            )}
        </div>
    );
}

export default Check;