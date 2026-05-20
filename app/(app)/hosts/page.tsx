import { HostsClient } from "./hosts-client";
import { getLiveSessions, getProfiles, getStudios } from "@/lib/data/queries";

export default async function HostsPage() {
  const hosts = await getProfiles("host");
  const sessions = await getLiveSessions();
  const studios = await getStudios();
  return <HostsClient initialHosts={hosts} sessions={sessions} studios={studios} />;
}
