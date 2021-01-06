// passport-github & passport-google
export interface ProfileData {
  provider: string;
  profileUrl: string;
  _raw: string;
  _json: profileJsonData;
}

interface profileJsonData {
  id: number;
  displayName: string;
  username: string;
  profileUrl: string;
  email: string;
  avatar_url: string;
  provider: string;
  bio: string;
  location: string;
  company: string;
  name: string;
  picture: string;
  sub: string;
}
