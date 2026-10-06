import { cn } from "@/lib/cn";
import logoUrl from "@/assets/images/weblogo.png";

interface Props {
  className?: string;
  /**
   * Whether to show the combined logo (shield + "MyUnitManager" wordmark)
   * or an approximated mark-only crop. The source PNG already includes both,
   * so `showWordmark=true` is the intended default.
   */
  showWordmark?: boolean;
  /** Height of the logo in pixels. Width scales with the image's aspect ratio. */
  size?: number;
}

/**
 * Renders the MyUnitManager logo from `src/assets/images/weblogo.png`.
 * The image already contains the wordmark under the shield, so most callers
 * only need to control the height.
 */
export function Logo({ className, showWordmark = true, size = 48 }: Props) {
  return (
    <img
      src={logoUrl}
      alt="MyUnitManager"
      className={cn("block select-none", className)}
      style={
        showWordmark
          ? { height: size, width: "auto" }
          : {
              // Shield-only: show the top ~65% of the image (the shield
              // portion) inside a square viewport.
              height: size,
              width: size,
              objectFit: "cover",
              objectPosition: "center top",
            }
      }
      draggable={false}
    />
  );
}
