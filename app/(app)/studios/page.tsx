import { StudiosClient } from "./studios-client";
import { getLiveSessions, getProfiles, getStudios } from "@/lib/data/queries";

export default async function StudiosPage() {
  const studios = await getStudios();
  const hosts = await getProfiles("host");
  const sessions = await getLiveSessions();
  return <StudiosClient initialStudios={studios} initialHosts={hosts} sessions={sessions} />;
}
