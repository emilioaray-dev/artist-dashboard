"use client";

import { Card, CardContent } from "@/components/ui/core/card";
import { formatCurrency } from "@/lib/utils";
import { Fan } from "@/types";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

type TopFansProps = {
  fans: Fan[];
  className?: string;
};

const RANK_COLORS = [
  "bg-amber-500 text-black",
  "bg-orange-500 text-white",
  "bg-yellow-600 text-white",
];

/**
 * Top fans component matching the reference dashboard style.
 * Avatar with rank badge overlay, name + purchases on the left,
 * total spent on the right.
 */
export function TopFans({ fans, className }: Readonly<TopFansProps>) {
  const locale = useLocale();
  const t = useTranslations("Fans");

  return (
    <div className={className}>
      <h2 className="mb-1 text-lg font-semibold">{t("topFans")}</h2>
      <p className="text-muted-foreground mb-4 text-sm">
        {t("topFansSubtitle")}
      </p>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-5">
            {fans.map((fan, index) => (
              <div key={fan.id} className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-800">
                    {fan.avatarUrl ? (
                      <Image
                        src={fan.avatarUrl}
                        alt={fan.displayName}
                        width={40}
                        height={40}
                        sizes="40px"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-muted-foreground text-xs">
                          {fan.displayName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  {index < 3 && (
                    <span
                      className={`absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${RANK_COLORS[index]}`}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {fan.displayName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {t("purchases", { count: fan.purchaseCount })}
                  </p>
                </div>
                <span className="text-primary flex-shrink-0 text-sm font-semibold">
                  {formatCurrency(fan.totalSpent, locale)}
                </span>
              </div>
            ))}
            {fans.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">{t("noFansData")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
