"use client";

import { Fan } from "@/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

type TopFansProps = {
  fans: Fan[];
  className?: string;
};

/**
 * Top fans component matching the example dashboard style
 * Ranked list with position number, avatar placeholder, display name,
 * purchase count, total spent formatted
 */
export function TopFans({ fans, className }: TopFansProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">Top Fans</h3>
      <div className="rounded-xl border bg-card p-6">
        <div className="space-y-4">
          {fans.map((fan, index) => (
            <div key={fan.id} className="flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <span className="text-sm font-medium">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{fan.displayName}</p>
                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{fan.purchaseCount} purchases</span>
                  <span>{formatCurrency(fan.totalSpent)}</span>
                </div>
              </div>
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                {fan.avatarUrl ? (
                  <img
                    src={fan.avatarUrl}
                    alt={fan.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xs text-muted-foreground">?</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {fans.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">TOP Gans No fans data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}