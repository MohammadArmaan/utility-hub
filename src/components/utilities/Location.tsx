import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { toast } from "sonner";

const Location = () => {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
        accuracy?: number;
    } | null>(null);

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    /** GET CURRENT LOCATION */
    const getLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
                setLoading(false);
                toast.success("Location retrieved!");
            },
            () => {
                toast.error("Unable to retrieve your location");
                setLoading(false);
            }
        );
    };

    /** SEARCH LOCATIONS (OpenStreetMap - Nominatim API) */
    const searchLocation = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchQuery
                )}`
            );
            const data = await res.json();
            setSearchResults(data);
        } catch {
            toast.error("Failed to search");
        } finally {
            setSearching(false);
        }
    };

    /** APPLY SELECTED SEARCH RESULT */
    const handleSelectLocation = (item: any) => {
        setLocation({
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
        });
        setSearchResults([]);
        setSearchQuery(item.display_name);
        toast.success("Location updated!");
    };

    /** COPY COORDINATES */
    const copyCoordinates = () => {
        if (location) {
            const coords = `${location.latitude}, ${location.longitude}`;
            navigator.clipboard.writeText(coords);
            toast.success("Coordinates copied!");
        }
    };

    return (
        <div className="space-y-6">
            {/* GET CURRENT LOCATION BUTTON */}
            <div className="text-center">
                <Button
                    onClick={getLocation}
                    disabled={loading}
                    className="bg-gradient-primary hover:opacity-90"
                    size="lg"
                >
                    <MapPin className="w-4 h-4 mr-2" />
                    {loading ? "Getting Location..." : "Get My Location"}
                </Button>
            </div>

            {/* SEARCH BAR */}
            <Card className="p-4 bg-muted/50 border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                    Search a Location
                </h3>

                <div className="flex gap-2">
                    <Input
                        placeholder="Search city, place, area..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-muted/40"
                    />
                    <Button
                        onClick={searchLocation}
                        disabled={searching}
                        className="bg-primary text-white"
                    >
                        <Search className="w-4 h-4" />
                    </Button>
                </div>

                {/* SEARCH RESULTS DROPDOWN */}
                {searchResults.length > 0 && (
                    <div className="mt-3 bg-background border rounded-lg max-h-60 overflow-auto shadow-md">
                        {searchResults.map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className="p-3 hover:bg-muted cursor-pointer text-sm"
                                onClick={() => handleSelectLocation(item)}
                            >
                                {item.display_name}
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {location && (
                <>
                    {/* COORDINATES CARD */}
                    <Card className="p-6 bg-gradient-card border-border/50">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Latitude
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                    {location.latitude.toFixed(6)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Longitude
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                    {location.longitude.toFixed(6)}
                                </p>
                            </div>

                            {location.accuracy && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Accuracy
                                    </p>
                                    <p className="text-lg text-foreground">
                                        {Math.round(location.accuracy)} meters
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={copyCoordinates}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Copy Coordinates
                                </Button>

                                <Button
                                    onClick={() =>
                                        window.open(
                                            `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
                                            "_blank"
                                        )
                                    }
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Open in Maps
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* MAP PREVIEW */}
                    <Card className="p-4 bg-muted/50 border-border/50">
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                            Map Preview
                        </h3>

                        <div className="w-full h-72 rounded-xl overflow-hidden shadow-md">
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                            ></iframe>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export default Location;
