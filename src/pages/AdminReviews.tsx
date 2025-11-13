import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

export default function AdminReviews() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <Breadcrumb className="mb-4 md:mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900">Reviews</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Reviews Beheer</h1>
      <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">Bekijk en beheer alle reviews</p>

      <div className="bg-white rounded-lg p-6 md:p-12 text-center shadow-sm border border-gray-200">
        <p className="text-gray-600 text-base md:text-lg">Reviews beheer komt binnenkort beschikbaar</p>
      </div>
    </div>
  );
}
