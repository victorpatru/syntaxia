import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="space-y-3 p-8">
      <div className="text-gray-600">
        The page you are looking for does not exist.
      </div>
      <Link to="/" className="block py-1 text-blue-800 hover:text-blue-600">
        Start Over
      </Link>
    </div>
  );
}
