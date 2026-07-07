import type { ReactNode } from "react";
import { Car, Truck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusBadge, statusTone } from "@/components/ui/StatusBadge";
import { fmtDateTime } from "@/lib/cn";
import { unitLabel } from "@/mock/store";
import {
  EFORM_LABELS,
  EFORM_STATUS_LABELS,
  type EFormSubmission,
} from "@/types";

function Row({ label, value }: { label: string; value?: ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-sm text-ink-muted">{label}</span>
      <span className="text-right text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

// Shared read-only rendering of an eForm submission. An optional footer slot
// lets callers (e.g. the manager review screen) add controls beneath it.
export function EFormView({
  submission,
  footer,
}: {
  submission: EFormSubmission;
  footer?: ReactNode;
}) {
  const Icon = submission.type === "parking" ? Car : Truck;

  return (
    <div className="space-y-4">
      {/* header */}
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-paper">
            <Icon className="h-5 w-5 text-brand" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">
              {EFORM_LABELS[submission.type]}
            </p>
            <p className="text-xs text-ink-faint">
              {submission.submittedByName} · Unit {unitLabel(submission.unitId)}
            </p>
            <p className="numeric text-xs text-ink-faint">
              Submitted {fmtDateTime(submission.createdAt)}
            </p>
          </div>
          <StatusBadge
            label={EFORM_STATUS_LABELS[submission.status]}
            tone={statusTone(submission.status)}
          />
        </div>
      </Card>

      {/* details */}
      <Card className="px-4 py-1">
        <div className="divide-y divide-paper-line">
          {submission.type === "move" ? (
            <>
              <Row
                label="Type"
                value={
                  submission.data.direction === "move-in"
                    ? "Move In"
                    : "Move Out"
                }
              />
              <Row label="Resident name" value={submission.data.residentName} />
              <Row label="Contact no." value={submission.data.contactNo} />
              <Row label="Move date" value={submission.data.moveDate} />
              <Row label="Time slot" value={submission.data.timeSlot} />
              <Row
                label="Moving company"
                value={submission.data.movingCompany}
              />
              <Row label="Vehicle type" value={submission.data.vehicleType} />
              <Row label="Vehicle plate" value={submission.data.vehiclePlate} />
              <Row label="Items" value={submission.data.itemsSummary} />
            </>
          ) : (
            <>
              <Row label="Full name" value={submission.data.fullName} />
              <Row label="IC / Passport" value={submission.data.icPassport} />
              <Row label="Email" value={submission.data.email} />
              <Row label="Contact no." value={submission.data.contactNo} />
              <Row
                label="Make & model"
                value={submission.data.vehicleMakeModel}
              />
              <Row label="Color" value={submission.data.vehicleColor} />
              <Row
                label="License plate"
                value={submission.data.licensePlate}
              />
              <Row label="Monthly rental" value="RM150.00 / bay" />
            </>
          )}
        </div>
      </Card>

      {/* review outcome */}
      {submission.status !== "pending" && (
        <Card className="space-y-1 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
            Management review
          </p>
          <div className="divide-y divide-paper-line">
            <Row label="Reviewed by" value={submission.reviewedByName} />
            <Row
              label="Reviewed on"
              value={
                submission.reviewedAt
                  ? fmtDateTime(submission.reviewedAt)
                  : undefined
              }
            />
            {submission.reviewMeta?.bayNo && (
              <Row label="Parking bay" value={submission.reviewMeta.bayNo} />
            )}
            {submission.reviewMeta?.level && (
              <Row label="Level" value={submission.reviewMeta.level} />
            )}
            {submission.reviewMeta?.accessCardNo && (
              <Row
                label="Access card no."
                value={submission.reviewMeta.accessCardNo}
              />
            )}
            {submission.reviewNote && (
              <Row label="Note" value={submission.reviewNote} />
            )}
          </div>
        </Card>
      )}

      {footer}
    </div>
  );
}
