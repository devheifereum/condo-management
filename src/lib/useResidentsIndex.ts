import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import * as api from "@/mock/store";
import type { Resident } from "@/types";

// Returns a map of unitId -> residents, for fast lookups in UnitSearch / timeline.
export function useResidentsIndex(): Record<string, Resident[]> {
  const { data: residents = [] } = useQuery({
    queryKey: ["residents"],
    queryFn: () => api.listResidents(),
  });
  return useMemo(() => {
    const map: Record<string, Resident[]> = {};
    for (const r of residents) {
      (map[r.unitId] ??= []).push(r);
    }
    return map;
  }, [residents]);
}
