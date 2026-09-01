import { logout } from "@/app/logout/actions";

type LogoutButtonProps = {
  variant?: "link" | "button";
  className?: string;
};

export default function LogoutButton({
  variant = "link",
  className = "",
}: LogoutButtonProps) {
  const styles =
    variant === "button"
      ? "rounded-brand border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-border-strong hover:text-accent-text"
      : "text-sm font-medium text-muted transition-colors hover:text-foreground";

  return (
    <form action={logout}>
      <button type="submit" className={`${styles} ${className}`}>
        Abmelden
      </button>
    </form>
  );
}
