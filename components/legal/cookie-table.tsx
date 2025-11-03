import type {CookieCategory, CookieTechnology} from "@/config/cookies";

const CATEGORY_ORDER: CookieCategory[] = ["essential", "analytics", "marketing"];

export type CookieTableStrings = {
  title: string;
  caption: string;
  columns: {
    name: string;
    provider: string;
    purpose: string;
    lifetime: string;
  };
  categories: Record<CookieCategory, string>;
};

type CookieTableProps = {
  strings: CookieTableStrings;
  data: Record<CookieCategory, CookieTechnology[]>;
};

export function CookieTable({strings, data}: CookieTableProps) {
  return (
    <div className="mt-6 space-y-6">
      <header className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">{strings.title}</h3>
        <p className="text-secondary">{strings.caption}</p>
      </header>

      <div className="space-y-8">
        {CATEGORY_ORDER.map((category) => {
          const rows = data[category] ?? [];

          if (rows.length === 0) {
            return null;
          }

          const headingId = `cookie-category-${category}`;
          const captionId = `${headingId}-caption`;

          return (
            <section key={category} aria-labelledby={headingId} className="space-y-3">
              <h4 id={headingId} className="text-base font-semibold text-primary">
                {strings.categories[category]}
              </h4>

              <div className="overflow-x-auto rounded-2xl border border-secondary/20">
                <table
                  aria-labelledby={headingId}
                  aria-describedby={captionId}
                  className="min-w-full divide-y divide-secondary/20 text-left"
                >
                  <caption id={captionId} className="sr-only">
                    {`${strings.categories[category]} – ${strings.caption}`}
                  </caption>
                  <thead className="bg-surface/60">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-secondary"
                      >
                        {strings.columns.name}
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-secondary"
                      >
                        {strings.columns.provider}
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-secondary"
                      >
                        {strings.columns.purpose}
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-secondary"
                      >
                        {strings.columns.lifetime}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10 bg-surface">
                    {rows.map((technology) => (
                      <tr key={technology.key}>
                        <td className="px-4 py-3 text-sm text-secondary">{technology.name}</td>
                        <td className="px-4 py-3 text-sm text-secondary">{technology.provider}</td>
                        <td className="px-4 py-3 text-sm text-secondary">{technology.purpose}</td>
                        <td className="px-4 py-3 text-sm text-secondary">{technology.lifetime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}