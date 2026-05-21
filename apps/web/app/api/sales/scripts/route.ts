import { NextResponse } from "next/server";
import {
  SALES_SCRIPTS,
  getScriptById,
  getScriptsByCategory,
  getScriptsByChannel,
  type SalesScript,
} from "@/lib/data/sales-scripts";

import { getUser } from "@/lib/auth/core";

const FAVORITES_STORAGE: Map<string, string[]> = new Map();

export async function GET(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const category = searchParams.get("category");
  const channel = searchParams.get("channel");
  const userId = searchParams.get("userId");

  if (userId && userId !== user.id) {
    return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
  }

  if (id) {
    const script = getScriptById(id);
    if (!script) {
      return NextResponse.json(
        { error: "Script no encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json(script);
  }

  let scripts: SalesScript[] = SALES_SCRIPTS;

  if (category) {
    scripts = getScriptsByCategory(category as SalesScript["category"]);
  } else if (channel) {
    scripts = getScriptsByChannel(channel as SalesScript["channel"]);
  }

  let favorites: string[] = [];
  if (userId) {
    favorites = FAVORITES_STORAGE.get(userId) || [];
  }

  const scriptsWithFav = scripts.map((s) => ({
    ...s,
    isFavorite: favorites.includes(s.id),
  }));

  const categories = [...new Set(SALES_SCRIPTS.map((s) => s.category))];
  const channels = [...new Set(SALES_SCRIPTS.map((s) => s.channel))];

  return NextResponse.json({
    scripts: scriptsWithFav,
    total: scriptsWithFav.length,
    filters: {
      categories,
      channels,
    },
    stats: {
      byCategory: categories.map((c) => ({
        category: c,
        count: SALES_SCRIPTS.filter((s) => s.category === c).length,
      })),
      byChannel: channels.map((ch) => ({
        channel: ch,
        count: SALES_SCRIPTS.filter((s) => s.channel === ch).length,
      })),
      avgEffectiveness: Math.round(
        SALES_SCRIPTS.reduce((acc, s) => acc + s.effectiveness, 0) /
          SALES_SCRIPTS.length,
      ),
    },
  });
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, scriptId, action } = body;

    if (!userId || !scriptId) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos" },
        { status: 400 },
      );
    }

    if (userId !== user.id) {
      return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
    }

    let favorites = FAVORITES_STORAGE.get(userId) || [];

    if (action === "add") {
      if (!favorites.includes(scriptId)) {
        favorites.push(scriptId);
      }
    } else if (action === "remove") {
      favorites = favorites.filter((id) => id !== scriptId);
    } else if (action === "toggle") {
      if (favorites.includes(scriptId)) {
        favorites = favorites.filter((id) => id !== scriptId);
      } else {
        favorites.push(scriptId);
      }
    }

    FAVORITES_STORAGE.set(userId, favorites);

    return NextResponse.json({
      success: true,
      favorites,
      action,
    });
  } catch (error) {
    console.error("Error managing favorites:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
