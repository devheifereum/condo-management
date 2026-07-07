import { useParams } from "@tanstack/react-router";
import { useEForm } from "@/lib/queries";
import { BackLink } from "@/components/ui/BackLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { EFormView } from "@/components/eform/EFormView";

export function EFormDetail() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: form, isLoading } = useEForm(id);

  return (
    <div className="space-y-5">
      <BackLink to="/resident/forms" label="eForms" />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      ) : !form ? (
        <EmptyState title="Submission not found" />
      ) : (
        <EFormView submission={form} />
      )}
    </div>
  );
}
