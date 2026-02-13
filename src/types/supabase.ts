export type Profile = {
  id: string;
  name: string | null;
  riot_puuid: string | null;
  riot_game_name: string | null;
  riot_tag_line: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
    };
  };
};
