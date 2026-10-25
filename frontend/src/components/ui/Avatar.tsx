import type { ReactElement } from "react";

interface AvatarProps {
  firstName: string;
  lastName: string;
}

/**
 * Renders a decorative initials avatar for an account.
 *
 * @param props - Account name used to derive initials.
 * @returns An avatar circle.
 */
function Avatar({ firstName, lastName }: AvatarProps): ReactElement {
  const initials = `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();

  return (
    <span
      aria-label={`${firstName} ${lastName}`}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-900 dark:bg-teal-900 dark:text-teal-100"
      role="img"
    >
      {initials}
    </span>
  );
}

export default Avatar;
