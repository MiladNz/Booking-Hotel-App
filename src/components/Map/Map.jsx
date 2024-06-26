import { useHotels } from "../context/HotelsProvider";

function Map() {
  const { isLoading, hotels } = useHotels();
  return <div className="mapContainer">Maps...</div>;
}

export default Map;
