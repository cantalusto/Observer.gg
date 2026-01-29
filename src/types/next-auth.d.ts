import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      riotPuuid?: string;
      riotGameName?: string;
      riotTagLine?: string;
    };
  }

  interface User {
    id: string;
    riotPuuid?: string;
    riotGameName?: string;
    riotTagLine?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    riotPuuid?: string;
    riotGameName?: string;
    riotTagLine?: string;
  }
}
