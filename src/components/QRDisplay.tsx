import { QRCodeSVG } from "qrcode.react";

export function QRDisplay({
  value,
  code,
  size = 200,
}: {
  value: string;
  code?: string;
  size?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl bg-white p-4">
        <QRCodeSVG
          value={value}
          size={size}
          bgColor="#ffffff"
          fgColor="#0a0a0a"
          level="M"
        />
      </div>
      {code && (
        <p className="numeric text-lg font-semibold tracking-widest text-brand">
          {code}
        </p>
      )}
    </div>
  );
}
