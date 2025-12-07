import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProperty } from "@/contexts/PropertyContext";

import {
  MapPin,
  Search,
  Filter,
  Bed,
  Bath,
  Ruler,
  Home,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";

const MapView = () => {
  const { properties } = useProperty();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

  const propertiesWithCoords = properties.filter(
    (p) => p.latitude && p.longitude
  );

  // -----------------------------
  // MAP INITIALIZATION
  // -----------------------------
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      propertiesWithCoords.forEach((property) => {
        const marker = L.marker([property.latitude, property.longitude]).addTo(map);

        marker.on("click", () => setSelectedProperty(property));
      });

      setMapInstance(map);

      return () => map.remove();
    });
  }, [propertiesWithCoords.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* ---------------------------------- */}
      {/* TOP BAR (Slim + modern) */}
      {/* ---------------------------------- */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">
              Property Map
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {propertiesWithCoords.length} found
            </Badge>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="max-w-3xl mx-auto relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by location or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2 bg-white border-muted focus:ring-primary/40"
          />
        </div>

        {/* Slim Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="max-w-6xl mx-auto mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-2 rounded-xl bg-muted/30">
                <select className="filter-select">
                  <option>All Types</option>
                  <option>Villa</option>
                  <option>Apartment</option>
                  <option>House</option>
                </select>

                <select className="filter-select">
                  <option>All Prices</option>
                  <option>₹50L - ₹1Cr</option>
                </select>

                <select className="filter-select">
                  <option>Bedrooms</option>
                  <option>1+</option>
                  <option>2+</option>
                </select>

                <select className="filter-select">
                  <option>Any Area</option>
                  <option>1000+ sq.ft</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------------------------- */}
      {/* MAP - minimal clean layout */}
      {/* ---------------------------------- */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <Card className="rounded-xl overflow-hidden shadow-lg">
          <div
            ref={mapRef}
            className="h-[60vh] md:h-[65vh] rounded-xl"
          />
        </Card>

        {/* ---------------------------------- */}
        {/* PROPERTY LIST BELOW MAP */}
        {/* ---------------------------------- */}
        <h2 className="text-xl font-semibold mt-6 mb-3">
          Properties on Map
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {propertiesWithCoords.map((property) => (
            <Card
              key={property.id}
              className="cursor-pointer hover:shadow-xl transition-all rounded-lg"
              onClick={() => {
                setSelectedProperty(property);
                if (mapInstance)
                  mapInstance.setView([property.latitude, property.longitude], 14);
              }}
            >
              <img
                src={property.images?.[0] || ""}
                className="w-full h-40 object-cover rounded-t-lg"
              />

              <div className="p-4">
                <h3 className="font-medium text-lg line-clamp-1">
                  {property.title}
                </h3>

                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {property.location}
                </p>

                {property.bedrooms && (
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span className="flex gap-1 items-center">
                      <Bed className="h-3 w-3" /> {property.bedrooms}
                    </span>
                    <span className="flex gap-1 items-center">
                      <Bath className="h-3 w-3" /> {property.bathrooms}
                    </span>
                    <span className="flex gap-1 items-center">
                      <Ruler className="h-3 w-3" /> {property.area} sq.ft
                    </span>
                  </div>
                )}

                <div className="mt-3 flex justify-between items-center">
                  <p className="text-primary font-semibold text-lg">
                    ₹{property.price.toLocaleString()}
                  </p>
                  <Badge variant="outline">{property.category}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional CSS */}
      <style>{`
        .filter-select {
          background: white;
          border: 1px solid #ddd;
          padding: 8px;
          border-radius: 8px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default MapView;
