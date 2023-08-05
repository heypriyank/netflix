import { NextResponse } from "next/server";
import  config from "../config"

export async function POST(request: Request) {
    const body = await request.json()
    let data = await fetch(`${config.baseUrl + config.login}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(body)
    })
    data = await data.json()
    return NextResponse.json(
        { body: data },
        { status: 200 }
    );
}
