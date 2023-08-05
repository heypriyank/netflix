import { NextResponse } from "next/server";
import  config from "../config"

export async function POST(request: Request) {
    const body = await request.json()
    let data = await fetch(`${config.baseUrl + config.editMovies}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${body.token}`,
            'Cache-Control': 's-maxage=1, stale-while-revalidate'
          },
        body: JSON.stringify(body.data)
    })
    data = await data.json()
    return NextResponse.json(
        { body: data },
        { status: 200 }
    );
}
