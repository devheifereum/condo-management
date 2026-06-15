import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "@/mock/store";

export const qk = {
  units: ["units"] as const,
  unit: (id: string) => ["unit", id] as const,
  unitResidents: (id: string) => ["unit-residents", id] as const,
  visitors: (unitId?: string) => ["visitors", unitId ?? "all"] as const,
  visitor: (id: string) => ["visitor", id] as const,
  pass: (visitorId: string) => ["pass", visitorId] as const,
  parcels: (unitId?: string) => ["parcels", unitId ?? "all"] as const,
  parcel: (id: string) => ["parcel", id] as const,
};

// ---- units ----
export const useUnits = () =>
  useQuery({ queryKey: qk.units, queryFn: () => api.listUnits() });

export const useUnit = (id: string) =>
  useQuery({ queryKey: qk.unit(id), queryFn: () => api.getUnit(id), enabled: !!id });

export const useUnitResidents = (id: string) =>
  useQuery({
    queryKey: qk.unitResidents(id),
    queryFn: () => api.residentsForUnit(id),
    enabled: !!id,
  });

// ---- visitors ----
export const useVisitors = (unitId?: string) =>
  useQuery({
    queryKey: qk.visitors(unitId),
    queryFn: () => api.listVisitors(unitId ? { unitId } : undefined),
  });

export const useVisitor = (id: string) =>
  useQuery({ queryKey: qk.visitor(id), queryFn: () => api.getVisitor(id), enabled: !!id });

export const usePass = (visitorId: string) =>
  useQuery({
    queryKey: qk.pass(visitorId),
    queryFn: () => api.getPassForVisitor(visitorId),
    enabled: !!visitorId,
  });

export function useRegisterVisitor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: api.RegisterVisitorInput) => api.registerVisitor(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visitors"] }),
  });
}

export function useLogWalkIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: api.WalkInInput) => api.logWalkIn(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visitors"] }),
  });
}

export function useLogEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (visitorId: string) => api.logEntry(visitorId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visitors"] }),
  });
}

export function useCheckOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (visitorId: string) => api.checkOut(visitorId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visitors"] }),
  });
}

export function useCancelPass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (visitorId: string) => api.cancelPass(visitorId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visitors"] }),
  });
}

// ---- parcels ----
export const useParcels = (unitId?: string) =>
  useQuery({
    queryKey: qk.parcels(unitId),
    queryFn: () => api.listParcels(unitId ? { unitId } : undefined),
  });

export const useParcel = (id: string) =>
  useQuery({ queryKey: qk.parcel(id), queryFn: () => api.getParcel(id), enabled: !!id });

export function useLogParcel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: api.LogParcelInput) => api.logParcel(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["parcels"] }),
  });
}

export function useCollectParcel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: api.CollectParcelInput) => api.collectParcel(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["parcels"] }),
  });
}
