import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Check, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useEForm, useReviewEForm, useResetEForm } from "@/lib/queries";
import { BackLink } from "@/components/ui/BackLink";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { EFormView } from "@/components/eform/EFormView";

export function ManagerFormDetail() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { user } = useAuth();
  const { data: form, isLoading } = useEForm(id);
  const review = useReviewEForm();
  const reset = useResetEForm();

  const [note, setNote] = useState("");
  const [bayNo, setBayNo] = useState("");
  const [level, setLevel] = useState("");
  const [accessCardNo, setAccessCardNo] = useState("");

  const decide = async (status: "approved" | "rejected") => {
    if (!form) return;
    await review.mutateAsync({
      eformId: form.id,
      status,
      reviewedByName: user!.name,
      reviewNote: note || undefined,
      reviewMeta:
        status === "approved" && form.type === "parking"
          ? {
              bayNo: bayNo || undefined,
              level: level || undefined,
              accessCardNo: accessCardNo || undefined,
            }
          : undefined,
    });
    toast.success(status === "approved" ? "Submission approved" : "Submission rejected");
  };

  const footer =
    form && form.status === "pending" ? (
      <Card className="space-y-4 p-4">
        <p className="text-sm font-medium text-ink">Review decision</p>

        {form.type === "parking" && (
          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Bay no."
              value={bayNo}
              onChange={(e) => setBayNo(e.target.value)}
              placeholder="B-042"
            />
            <Input
              label="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="P2"
            />
            <Input
              label="Card no."
              value={accessCardNo}
              onChange={(e) => setAccessCardNo(e.target.value)}
              placeholder="AC-100"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm text-ink-muted">
            Note to resident (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-paper-line bg-paper px-3 py-2 text-ink placeholder:text-ink-faint outline-none focus:border-brand"
            placeholder="Reason or instructions…"
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="danger"
            fullWidth
            loading={review.isPending}
            onClick={() => decide("rejected")}
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
          <Button
            fullWidth
            loading={review.isPending}
            onClick={() => decide("approved")}
          >
            <Check className="h-4 w-4" />
            Approve
          </Button>
        </div>
      </Card>
    ) : form ? (
      <div className="flex justify-center">
        <Button
          variant="secondary"
          loading={reset.isPending}
          onClick={async () => {
            await reset.mutateAsync(form.id);
            toast.success("Reset to pending");
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset to pending (demo)
        </Button>
      </div>
    ) : null;

  return (
    <div className="space-y-5">
      <BackLink to="/manager" label="eForm reviews" />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      ) : !form ? (
        <EmptyState title="Submission not found" />
      ) : (
        <EFormView submission={form} footer={footer} />
      )}
    </div>
  );
}
