import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export function Redirect({ to }: { to: string }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to });
  }, [to, navigate]);
  return null;
}
