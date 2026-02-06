import { dataService } from "@/lib/data-service";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const engagementResponse = await dataService.getEngagement();
    
    return Response.json(engagementResponse, {
      status: engagementResponse.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching engagement data:", error);
    
    return Response.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching engagement data",
        },
        status: 500,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}