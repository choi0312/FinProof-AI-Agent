"use client";

import { useState } from "react";
import { roles } from "@/domain/reviews";
import type { RoleId } from "@/domain/types";

export function RoleSwitcher() {
  const [activeRole, setActiveRole] = useState<RoleId>("reviewer");
  const role = roles.find((item) => item.id === activeRole) ?? roles[0];

  return (
    <div className="role-switcher" aria-label="Mock user role">
      <p className="role-switcher__status">현재 역할: {role.label}</p>
      <div className="role-switcher__buttons">
        {roles.map((item) => (
          <button
            key={item.id}
            type="button"
            className="role-switcher__button"
            aria-pressed={activeRole === item.id}
            title={item.description}
            onClick={() => setActiveRole(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
