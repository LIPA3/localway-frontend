import { useNavigate } from "react-router";
import SavedItineraries from "../components/smartPage/SavedPlan";

export default function SavedPlan() {
  const navigate = useNavigate();

  const handleNavigate = (route, params) => {
    if (route === "smartRecommend") {
      if (params && params.planId) {
        navigate(`/smartRecommend/result?planId=${params.planId}`);
      } else {
        navigate("/smartRecommend");
      }
    }
  };

  return <SavedItineraries onNavigate={handleNavigate} />;
}
