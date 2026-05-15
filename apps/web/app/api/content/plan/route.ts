import { NextResponse } from "next/server";
import {
  CONTENT_PLAN_30_DAYS,
  getContentForDay,
  getContentForPlatform,
  getContentForCategory,
} from "@/lib/data/content-plan";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get("day");
  const platform = searchParams.get("platform");
  const category = searchParams.get("category");

  if (day) {
    const content = getContentForDay(parseInt(day));
    if (!content) {
      return NextResponse.json({ error: "Día no encontrado" }, { status: 404 });
    }
    return NextResponse.json(content);
  }

  if (platform) {
    const contents = getContentForPlatform(platform);
    return NextResponse.json({ contents, total: contents.length });
  }

  if (category) {
    const contents = getContentForCategory(category);
    return NextResponse.json({ contents, total: contents.length });
  }

  const contents = CONTENT_PLAN_30_DAYS;
  const groupedByWeek = {
    semana1: contents.filter((c) => c.day <= 7),
    semana2: contents.filter((c) => c.day > 7 && c.day <= 14),
    semana3: contents.filter((c) => c.day > 14 && c.day <= 21),
    semana4: contents.filter((c) => c.day > 21),
  };

  return NextResponse.json({
    contents,
    total: contents.length,
    groupedByWeek,
    stats: {
      byPlatform: {
        Instagram: contents.filter((c) => c.platform === "Instagram").length,
        Facebook: contents.filter((c) => c.platform === "Facebook").length,
        WhatsApp: contents.filter((c) => c.platform === "WhatsApp").length,
        TikTok: contents.filter((c) => c.platform === "TikTok").length,
        LinkedIn: contents.filter((c) => c.platform === "LinkedIn").length,
      },
      byCategory: {
        educativo: contents.filter((c) => c.category === "educativo").length,
        producto: contents.filter((c) => c.category === "producto").length,
        testimonial: contents.filter((c) => c.category === "testimonial")
          .length,
        beneficio: contents.filter((c) => c.category === "beneficio").length,
        social: contents.filter((c) => c.category === "social").length,
        promocion: contents.filter((c) => c.category === "promocion").length,
      },
    },
  });
}
