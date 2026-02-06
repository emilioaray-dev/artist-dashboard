import { dataService } from "@/lib/data-service";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Extract the range query parameter
    const url = new URL(request.url);
    const rangeParam = url.searchParams.get("range");

    // Validate the range parameter
    const validRanges = ["7d", "30d", "90d"];
    const range = validRanges.includes(rangeParam || "")
      ? (rangeParam as "7d" | "30d" | "90d")
      : "30d"; // Default to 30d if invalid or not provided

    const salesResponse = await dataService.getSales(range);

    return Response.json(salesResponse, {
      status: salesResponse.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching sales:", error);

    return Response.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching sales data",
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
