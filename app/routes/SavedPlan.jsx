import { useNavigate } from "react-router";
import SavedItineraries from "../components/smartPage/SavedPlan";

export default function SavedPlan() {
  const navigate = useNavigate();

  const handleNavigate = (route, planId) => {
    if (route === "smartRecommend") {
      navigate("/smartRecommend");
    } else if (route === "smart") {
      navigate("/smartRecommend");
    } else if (route === "planDetail" && planId) {
      navigate(`/planDetail/${planId}`);
    }
  };

  return <SavedItineraries onNavigate={handleNavigate} />;
}
