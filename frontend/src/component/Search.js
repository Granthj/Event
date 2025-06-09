import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import EventsPage from './Events';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Search = (props) => {
    // const navigate = useNavigate();
    const location = useLocation();
    // console.log(location.pathname);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [eventsByValue, setEventsByValue] = useState([]);
    const [mapClickCounter, setMapClickCounter] = useState(0);
    const [shouldCallHandleMapSelectionDone, setShouldCallHandleMapSelectionDone] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const wrapperRef = useRef(null);
    const geocoderRef = useRef(L.Control.Geocoder.nominatim());
    useEffect(() => {
        setQuery('');
        setSearchQuery('');
        setSuggestions([]);
        window.history.replaceState({}, '');
        // if (location.state?.replaceSearch) {
        // }
    }, [location])
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500); // 500ms debounce

        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {

        if (debouncedQuery) {
            fetchSuggestions(debouncedQuery);
        }
    }, [debouncedQuery]);
    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await fetch(`http://localhost:7000/api/search-cities?query=${encodeURIComponent(query)}`);
            const data = await response.json();

            const cityState = data.map(place => {
                const parts = place.name.split(',');
                const city = parts[0].trim();
                const state = place.state.split(',')[0].trim();
                return {
                    display_name: `${city}, ${state}`,
                };
            })
            // console.log("City State", cityState);
            setSuggestions(cityState);





        } catch (err) {
            setSuggestions([]);
        }
    };

    const handleChange = (e) => {
        setShowSuggestions(true);
        const value = e.target.value;
        if (value === '') {
            setShowSuggestions(false);
        }
        if (value === 'Unknown location') {
            value = '';
        }
        setSearchQuery(value);
        setQuery(value)
        fetchSuggestions(value);

    };

    const handleSelect = (place) => {
        const location = {
            name: place.display_name,
            lat: place.lat,
            lon: place.lon,
        };
        setSearchQuery(location.name ?? '');
        setQuery(location.name ?? '');
        setShowSuggestions(false);
        setSelectedLocation(location);
        setSuggestions([]);

        if (props.onCitySelected) {
            props.onCitySelected(location);
        }
    };


    useEffect(() => {
        if (!showMap || !mapContainerRef.current || mapInstanceRef.current) return;
        setShowSuggestions(false);

        mapInstanceRef.current = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(mapInstanceRef.current);

        // ✅ Assign the geocoder globally or as a ref
        const geocoder = L.Control.Geocoder.nominatim();

        mapInstanceRef.current.on('click', function (e) {
            const latlng = e.latlng;

            if (markerRef.current) {
                mapInstanceRef.current.removeLayer(markerRef.current);
            }

            markerRef.current = L.marker(latlng, {
                icon: new L.Icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                })
            }).addTo(mapInstanceRef.current);

            // Call reverse geocoding function
            reverseGeocodeAndSet(latlng, geocoder);
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, [showMap, mapClickCounter]);
    const cleanLocationName = (name) => {
        if (!name) return null;
        // Common suffixes to remove, add more if needed
        const suffixes = [
            "Municipal Corporation",
            "Municipal Council",
            "Municipality",
            "Corporation",
            "Council",
            "District",
            "Tehsil",
            "Taluka",
            "Taluk",
            "Subdivision",
            "Block",
            "Ward",
            "Division",
            "Zone",
            "Nagar Parishad",
            "Nagar Palika",
            "Nagar Panchayat",
            "Cantonment",
            "Cantonment Board",
            "Gram Panchayat",
            "Village Council",
            "City",
            "Town",
            "Urban Agglomeration",
            "Municipal Area",
            "Municipal Board",
            "Development Authority",
            "Municipal Committee",
            "Township",
            "Sub-District",
            "Tehsil Town",
            "Mandal"
        ];

        let cleanName = name;
        suffixes.forEach(suffix => {
            const regex = new RegExp(`\\b${suffix}\\b`, 'i');  // case-insensitive word boundary
            cleanName = cleanName.replace(regex, '').trim();
        });

        // Remove any extra whitespace left after removal
        cleanName = cleanName.replace(/\s+/g, ' ').trim();
        // console.log("Cleaned Location Name:", cleanName);
        return cleanName;
    };

    const reverseGeocodeAndSet = async (latlng) => {
        try {
            const response = await fetch(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${latlng.lat}&lon=${latlng.lng}&apiKey=f637bfc0e76b411da82647bb007278f7`
            );
            const data = await response.json();

            if (data && data.features && data.features.length > 0) {
                const props = data.features[0].properties;

                // Try getting city name with fallbacks
                let city = props.city || props.town || props.county || null;
                const state = props.state || null;
                city = cleanLocationName(city);
                // console.log("REVERSE", city);
                const cityName = city ? (state ? `${city}, ${state}` : city) : 'Unknown location';
                if (cityName === 'Unknown location') {
                    setSearchQuery('');
                    return
                }
                setSearchQuery(cityName);
                setSelectedLocation({
                    name: cityName,
                    lat: latlng.lat,
                    lon: latlng.lng,
                });

                markerRef.current
                    .bindPopup(`<b>${cityName}</b><br>Lat: ${latlng.lat.toFixed(5)}, Lon: ${latlng.lng.toFixed(5)}`)
                    .openPopup();

            } else {
                alert('No results found for this location.');
                if (markerRef.current) {
                    mapInstanceRef.current.removeLayer(markerRef.current);
                    markerRef.current = null;
                }
                setSelectedLocation(null);
            }
        } catch (error) {
            // console.log('Reverse geocoding failed:', error);
        }
    };
    useEffect(() => {
        if (shouldCallHandleMapSelectionDone) {
            handleMapSelectionDone();
            setShouldCallHandleMapSelectionDone(false); // reset flag
        }
    }, [mapClickCounter]);
    const handleMapSelectionDone = () => {
        if (selectedLocation === null) {
            // console.log('No location selected', selectedLocation);
            setSearchQuery('');
            return;
        }
        // console.log('Selected Location:', selectedLocation.name);
        if (selectedLocation.name === 'Unknown location') {
            setSearchQuery('');
            alert('invalid location selected');
            return;
        }
        else {
            setSearchQuery(selectedLocation.name);
            setEventsByValue(selectedLocation.name);
            // navigate(`/${selectedLocation.name}`, { state: { location: selectedLocation.name } });
            setSuggestions([]);
            if (props.onCitySelected) {
                props.onCitySelected(selectedLocation);
            }
            setShowMap(false);
        }
    };
    return (
        <div className="d-flex align-items-start" style={{ gap: '0.5rem' }}>
            <div className='position-relative flex-grow-1' style={{ minWidth: '25px' }} ref={wrapperRef}>
                <input
                    type='text'
                    className='form-control'
                    placeholder='Search city...'
                    value={searchQuery}
                    onChange={handleChange}
                    onFocus={() => setShowSuggestions(true)}
                    autoComplete='off'
                />
                {showSuggestions && suggestions.length > 0 && (
                    <ul className='list-group position-absolute w-100 mt-1' style={{ zIndex: 1000 }}>
                        {suggestions.map((place, index) => (
                            <li
                                key={index}
                                className='list-group-item list-group-item-action py-2'
                                onClick={() => handleSelect(place)}
                                style={{ cursor: 'pointer' }}
                            >
                                {place.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                className='btn btn-primary'
                style={{
                    whiteSpace: 'nowrap',
                    height: '38px', // match input height (adjust if needed)
                    padding: '0 12px',
                    minWidth:'25px'
                }}
                onClick={() => setShowMap(true)}
            >
                <i className="fas fa-map-marker-alt me-1"></i> Map
            </button>

            {showMap && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select Location</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowMap(false)}
                                ></button>
                            </div>
                            <div className="modal-body p-0" style={{ height: '500px' }}>
                                <div
                                    id="map"
                                    ref={mapContainerRef}
                                    style={{ height: '100%', width: '100%' }}
                                ></div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onClick={() => {
                                        setMapClickCounter(prev => prev + 1);
                                        setShouldCallHandleMapSelectionDone(true);
                                    }}
                                //   disabled={!selectedLocation}
                                >
                                    Confirm Selection
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onClick={() => {
                                        setShowMap(false);
                                        setSelectedLocation(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
