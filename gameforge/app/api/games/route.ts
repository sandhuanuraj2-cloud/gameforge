import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Supabase is not configured for this deployment." },
      { status: 503 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const [gamesResult, genresResult] = await Promise.all([
    supabase
      .from("game_catalog")
      .select("id, slug, name, platforms, genre")
      .order("name", { ascending: true }),
    supabase
      .from("game_genres")
      .select("game_id, is_primary, genre_catalog(id, slug, name, parent_id, sort_order)")
      .order("is_primary", { ascending: false }),
  ]);

  if (gamesResult.error || genresResult.error) {
    console.error(
      "Game catalogue query failed:",
      gamesResult.error?.message ?? genresResult.error?.message
    );
    return NextResponse.json(
      { error: "Could not load the game catalogue." },
      { status: 502 }
    );
  }

  const genresByGame = new Map<string, Array<Record<string, unknown>>>();

  for (const mapping of genresResult.data ?? []) {
    const linkedGenre = Array.isArray(mapping.genre_catalog)
      ? mapping.genre_catalog[0]
      : mapping.genre_catalog;

    if (!linkedGenre) continue;

    const existing = genresByGame.get(mapping.game_id) ?? [];
    existing.push({
      ...linkedGenre,
      is_primary: mapping.is_primary,
    });
    genresByGame.set(mapping.game_id, existing);
  }

  const normalizedGames = (gamesResult.data ?? []).map((game) => {
    const platforms = (game.platforms ?? []) as string[];
    const platformGroups = new Set<string>();

    for (const platform of platforms) {
      const value = platform.toLowerCase();

      if (["pc", "windows", "macos", "linux"].includes(value)) {
        platformGroups.add("PC");
      }

      if (["mobile", "android", "ios", "ipad", "iphone"].includes(value)) {
        platformGroups.add("Mobile");
      }

      if (
        ["console", "playstation", "xbox", "nintendo switch", "switch"].includes(
          value
        )
      ) {
        platformGroups.add("Console");
      }
    }

    return {
      id: game.id,
      slug: game.slug,
      name: game.name,
      platforms,
      platformGroups: Array.from(platformGroups),
      legacyGenre: game.genre,
      genres: genresByGame.get(game.id) ?? [],
    };
  });

  return NextResponse.json(
    {
      games: normalizedGames,
      total: normalizedGames.length,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
