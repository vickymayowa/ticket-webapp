import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found | Event Hub",
  description: "The page you requested does not exist. Please check the URL or return to the homepage.",
};

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-svh gap-y-6 p-6 bg-light-gray rounded-lg shadow-md">
      <h2 className="text-6xl font-semibold text-dark-blue">Oops! Page Not Found</h2>
      <p className="text-center text-gray-700 text-muted text-1xl">
        We’re sorry, but the page you are looking for does not exist. It may have been moved or deleted.
      </p>
      <Link href="/">
        <Button
          className="bg-primary text-white hover:bg-primary-dark transition-colors duration-300"
          size="sm"
        >
          Return to Home
        </Button>
      </Link>
      <p className="mt-4 text-sm text-gray-500">
        If you need assistance, please <Link href="/contact" className="text-primary underline">contact us</Link>.
      </p>
    </div>
  );
};

export default NotFound;