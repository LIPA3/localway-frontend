import { useNavigate } from "react-router";
import SavedItineraries from "../components/smartPage/SavedPlan";

export default function SavedPlan() {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    if (route === "smartRecommend") {
      navigate("/SmartRecommend");
    }
  };

  return <SavedItineraries onNavigate={handleNavigate} />;
}
