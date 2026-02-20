import { NextResponse } from "next/server";
import { getRenderJob } from "../../job-store";

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { jobId } = await context.params;
  const job = getRenderJob(jobId);

  if (!job) {
    return NextResponse.json(
      {
        message: "Job não encontrado.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(job);
}
