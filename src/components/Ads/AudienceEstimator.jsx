import { Users, Banknote, Eye, Loader } from "lucide-react";
import {
  formatAdProCostPerUser,
  formatAdProCurrency,
  ADPRO_COST_PER_USER_NGN,
} from "../../utils/formatAdProCurrency";

export default function AudienceEstimator({ estimate, loading }) {
  const costPerUser =
    estimate.reach > 0
      ? estimate.cost / estimate.reach
      : estimate.costPerUser ?? ADPRO_COST_PER_USER_NGN;

  return (
    <div className="w-full bg-gradient-to-r from-[#1A3E32] to-[#2d6a54] rounded-2xl p-6 text-white">
      <h3 className="font-semibold text-lg mb-4">Audience Estimate</h3>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-xs">Estimated Reach</p>
                <p className="text-2xl font-bold">
                  {estimate.reach.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs">users</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-xs">Estimated Cost</p>
                <p className="text-2xl font-bold">
                  {formatAdProCurrency(estimate.cost)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs">
                {formatAdProCostPerUser(costPerUser)} per user
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-xs">Guaranteed Delivery</p>
                <p className="text-sm font-medium">✓ Pay only for reach</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
