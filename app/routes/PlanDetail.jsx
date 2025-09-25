import { useParams } from "react-router";
import PlanDetailPage from "../components/smartPage/PlanDetail";

export default function PlanDetail() {
  const { planId } = useParams();

  return <PlanDetailPage planId={planId} />;
}