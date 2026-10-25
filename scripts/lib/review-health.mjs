// Verify only the local inbox status. Do not retry with different permissions,
// follow redirects, or infer that a server is running after a failed request.
export async function checkReviewServer(url, fetchStatus = fetch) {
  let response;
  try {
    response = await fetchStatus(new URL("/api/review", url), { redirect: "error", signal: AbortSignal.timeout(5000) });
  } catch (error) {
    const code = error.cause?.code || error.code;
    if (["EPERM", "EACCES"].includes(code)) {
      throw new Error(`Local review connection blocked (${code}). This process cannot access localhost. Codex applies a saved opener rule only to the opener run by itself, exactly as \`review\` printed it; if something else ran, run the printed opener instead. Codex also ignores saved rules for models it marks as cyber (such as Daybreak Blue): with one, give the person the review link. Otherwise a saved rule does not prove this session loaded or applied it: stop this handoff and check the session's permissions; do not bypass a denial.`);
    }
    if (code === "ECONNREFUSED") {
      throw new Error("Local review connection refused (ECONNREFUSED). No server accepted the connection at this URL; check the scratch launcher's server status before opening again.");
    }
    if (error.name === "TimeoutError" || code === "ETIMEDOUT" || code === "UND_ERR_CONNECT_TIMEOUT") {
      throw new Error("Local review health check timed out. Server availability is unverified; no viewer was opened.");
    }
    throw new Error("Local review health check failed. Server availability is unverified (network failure or rejected redirect); no viewer was opened.");
  }
  if (!response.ok) throw new Error(`Local review server is not ready (HTTP ${response.status})`);
  let status;
  try { status = await response.json(); }
  catch { throw new Error("Local review server did not return a JSON inbox status"); }
  if (status?.ok !== true || typeof status.inbox !== "number" || !["repo", "machine"].includes(status.where)) {
    throw new Error("This URL does not report a reelplanner review inbox");
  }
}
