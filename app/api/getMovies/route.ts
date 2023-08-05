import { NextResponse } from "next/server";
import config from "../config";

export async function GET(request: Request) {
    const {search} = new URL(request.url)
    const data = await fetch(`${config.baseUrl + config.getMovies + search}`, {
        cache: "no-store",
    });
    return NextResponse.json({ body: await data.json() }, { status: 200 });
}
