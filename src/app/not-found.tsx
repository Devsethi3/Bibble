import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-gray-700">
            Page Not Found
          </h2>
          <p className="text-gray-500 max-w-md">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
