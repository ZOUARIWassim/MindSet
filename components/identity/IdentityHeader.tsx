export function IdentityHeader({
  name,
  statement,
  description,
}: {
  name: string;
  statement: string;
  description: string | null;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-text-muted">{name}</span>
      <h1 className="font-display text-3xl font-semibold leading-tight text-text-primary">{statement}</h1>
      {description && <p className="text-sm text-text-secondary">{description}</p>}
    </div>
  );
}
