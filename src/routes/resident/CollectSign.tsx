import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Package, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useParcel, useCollectParcel } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SignaturePad } from "@/components/SignaturePad";
import { BackLink } from "@/components/ui/BackLink";
import { Skeleton } from "@/components/ui/Skeleton";
import { unitLabel } from "@/mock/store";
import { fmtDateTime } from "@/lib/cn";

export function CollectSign() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: parcel, isLoading } = useParcel(id);
  const collect = useCollectParcel();

  const [name, setName] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // pre-fill collector name once parcel loads
  useEffect(() => {
    if (parcel && user && name === "") setName(user.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parcel, user]);

  if (isLoading || !parcel) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-44 w-full" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-pop-in">
        <CheckCircle2 className="h-16 w-16 text-ok" />
        <p className="mt-4 text-lg font-semibold text-ink">Collected</p>
        <p className="text-sm text-ink-muted">Signed and recorded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24 lg:pb-2">
      <BackLink to="/resident/parcels" label="My parcels" />
      <h1 className="text-2xl font-semibold text-ink">Collect parcel</h1>

      {/* summary */}
      <Card className="flex items-center gap-3 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-paper">
          <Package className="h-5 w-5 text-brand" />
        </div>
        <div className="text-sm">
          <p className="font-medium text-ink">
            {parcel.courier ?? "Parcel"}
            {parcel.size ? ` · Size ${parcel.size}` : ""}
          </p>
          <p className="numeric text-xs text-ink-faint">{parcel.trackingNo}</p>
          <p className="mt-1 text-xs text-ink-muted">
            For {unitLabel(parcel.unitId)} · arrived {fmtDateTime(parcel.loggedAt)} ·
            logged by {parcel.loggedBy}
          </p>
        </div>
      </Card>

      <Input
        label="Collected by"
        value={name}
        onChange={(e) => setName(e.target.value)}
        hint="Edit if a helper or family member is collecting."
      />

      <div className="space-y-1.5">
        <label className="block text-sm text-ink-muted">Signature</label>
        <SignaturePad onChange={setSignature} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md border-t border-paper-line bg-paper/95 p-4 backdrop-blur lg:static lg:max-w-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <Button
          fullWidth
          size="lg"
          disabled={!signature || !name.trim()}
          loading={collect.isPending}
          onClick={async () => {
            await collect.mutateAsync({
              parcelId: parcel.id,
              collectedByName: name.trim(),
              signature: signature!,
            });
            toast.success("Parcel collected");
            setDone(true);
            setTimeout(() => navigate({ to: "/resident/parcels" }), 1200);
          }}
        >
          Confirm collection
        </Button>
      </div>
    </div>
  );
}
