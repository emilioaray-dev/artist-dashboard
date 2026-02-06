import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("Errors");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6">
      <h2 className="text-xl font-semibold">{t("pageNotFound")}</h2>
      <p className="text-muted-foreground text-sm">
        {t("pageNotFoundDescription")}
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
      >
        {t("goHome")}
      </Link>
    </div>
  );
}
