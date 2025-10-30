import { BASE_POOLS, type Card, type Role } from "../data/cards";
import type { GenOptions } from "../state/options";

const roleOrder: Role[] = ["wincon", "building", "spell-small", "spell-big", "support"];

type RoleLocksProps = {
  options: GenOptions;
  saveOptions: (next: GenOptions) => void;
};

export function RoleLocks({ options, saveOptions }: RoleLocksProps) {
  const updateRole = (role: Role, value: string) => {
    const next = { ...options.roleLocks };
    if (!value) {
      delete next[role];
    } else {
      next[role] = value as any;
    }
    saveOptions({ ...options, roleLocks: next });
  };

  return (
    <section className="rounded-2xl bg-neutral-900 p-4">
      <h3 className="mb-3 text-sm font-semibold text-neutral-200">Role locks</h3>
      <p className="mb-4 text-xs text-neutral-500">
        Lock a role to a specific card or let the generator choose any card within that role. Building win conditions respect the
        defensive slot rules automatically.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roleOrder.map((role) => (
          <label key={role} className="flex flex-col gap-1 text-sm">
            <span className="text-neutral-300 capitalize">{role.replace("-", " ")}</span>
            <select
              className="rounded-lg bg-neutral-800 px-3 py-2 text-sm"
              value={(options.roleLocks[role] as string) ?? ""}
              onChange={(event) => updateRole(role, event.target.value)}
            >
              <option value="">None</option>
              <option value="ANY">Random {role}</option>
              {BASE_POOLS[role].map((card: Card) => (
                <option key={card.name} value={card.name}>
                  {card.name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </section>
  );
}
