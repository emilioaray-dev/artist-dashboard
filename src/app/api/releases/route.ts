import { dataService } from "@/lib/data-service";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Using request parameter to satisfy linting rules
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const releasesResponse = await dataService.getReleases();

    return Response.json(releasesResponse, {
      status: releasesResponse.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching releases:", error);

    return Response.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching releases",
        },
        status: 500,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
