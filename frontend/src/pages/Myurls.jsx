import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ExternalLinkIcon,
  Link2,
  Lock,
  Pencil,
  Trash2,
} from "lucide-react";
import moment from "moment";
import { allurl } from "@/api/url";
import { ClipboardIcon } from "lucide-react"; // Clipboard icon from lucide-react
import toast from "react-hot-toast"; // Importing react-hot-toast for the toast functionality

// Function to fetch URLs from API
const fetchUrls = async (page) => {
  const response = await allurl(page);
  return response.data;
};
const CopyToClipboardButton = ({ url }) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Copied shortyurl"); // Show success toast message
      })
      .catch((err) => {
        toast.error("Failed to copy!"); // Show error toast message if something goes wrong
      });
  };

  return (
    <button
      onClick={handleCopy}
      className=" rounded  text-white"
      aria-label="Copy URL"
    >
      <ClipboardIcon className="w-4 h-4" color="black" /> {/* Clipboard Icon */}
    </button>
  );
};
export default function MyUrls() {
  const [currentPage, setCurrentPage] = useState(1);

  // Using React Query to fetch URLs with caching
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["urls", currentPage], // Key based on URLs and page
    queryFn: () => fetchUrls(currentPage), // Fetch function
    keepPreviousData: true,
    staleTime: 10 * 1000,
    cacheTime: 20 * 1000,
  });

  const totalPages = data?.totalPages || 1;
  const urls = data?.urls || [];

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Generated URLs</h1>
      </div>

      {/* List of URLs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading...</p> // Show loading message while data is being fetched
        ) : isError ? (
          <p>Error: {error.message}</p> // Show error message if there's an error
        ) : (
          urls.map((url) => (
            <Card key={url._id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="truncate">{url.shortUrl}</span>{" "}
                    <a
                      href={`/acess/${url.shortUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <ExternalLinkIcon className="w-3 h-3 ml-1 mr-1" />
                    </a>
                  </span>

                  <Badge
                    variant={url.linkType === "open" ? "secondary" : "default"}
                  >
                    {url.linkType === "open" ? (
                      <Link2 className="w-4 h-4 ml-2" />
                    ) : (
                      <Lock className="w-3 h-3 mr-1" />
                    )}
                    {url.linkType === "open" ? "Public" : "Protected"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground truncate  flex-1">
                    {url.originalUrl} {/* The original URL */}
                  </p>

                  {/* CopyToClipboardButton passed with the URL to copy */}
                  <CopyToClipboardButton
                    url={`https://morden-url-shortner.vercel.app/acess/${url.shortUrl}`}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {url.expiryDate
                      ? moment(new Date(url.expiryDate)).format(
                          "MMM D, YYYY HH:mm"
                        )
                      : "No expiry date"}
                  </div>
                  <div className="text-sm">Visits: {url.visitCount}</div>
                </div>
              </CardContent>
              {/* <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </CardFooter> */}
            </Card>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
