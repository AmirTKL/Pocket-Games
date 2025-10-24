import { useNavigate, useRouter } from "@tanstack/react-router";

export default function useQueryState<
  T extends "string" | "number" | "boolean",
  ActualType extends T extends "boolean"
    ? boolean
    : T extends "number"
      ? number
      : string,
>(name: string, parseAs: T): [ActualType, (c: ActualType) => void] {
  const router = useRouter();
  const navigte = useNavigate();
  function setState(c: ActualType) {
    navigte({ search: (prev) => ({ ...prev, [name]: c }) });
  }
  const state = (router.state.location.search as any)[name] as
    | string
    | boolean
    | null;
  if (parseAs === "number") {
    return [Number(state) as ActualType, setState];
  }
  if (parseAs === "boolean") {
    return [
      (typeof state === "boolean" ? state : state === "true") as ActualType,
      setState,
    ];
  }
  return [state as ActualType, setState];
}
