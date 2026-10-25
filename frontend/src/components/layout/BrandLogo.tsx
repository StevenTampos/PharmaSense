import type { ReactElement } from "react";
import logo from "@/assets/logo.svg";

/**
 * Shows the PharmaSense placeholder logo and pharmacy name.
 *
 * @returns The brand logo and company name.
 */
function BrandLogo(): ReactElement {
  return (
    <div className="flex items-center justify-center gap-3">
      <img alt="PharmaSense logo" className="h-12 w-12" src={logo} />
      <span className="text-lg font-semibold tracking-wide text-teal-900 dark:text-teal-200">
        Olympus Pharmacy
      </span>
    </div>
  );
}

export default BrandLogo;
