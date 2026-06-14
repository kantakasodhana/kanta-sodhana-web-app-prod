// Run: node test_db.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://kjadudctpnweailiaeor.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWR1ZGN0cG53ZWFpbGlhZW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNjc4ODgsImV4cCI6MjA5Njk0Mzg4OH0.tT9DVJOm9pF0lavQXM8N5nrNu1HOYTWKabb-pmW7lLE"
);

async function test() {
  console.log("=== Kantaka Sodhana - DB Connection Test ===\n");
  let userId = null;
  let allPassed = true;

  // Test 1: Contact submissions
  console.log("1. contact_submissions table...");
  const { data: c, error: e1 } = await supabase
    .from("contact_submissions")
    .insert({ name: "Test", email: "test@test.com", message: "DB test" })
    .select();
  if (e1) { console.log("   FAIL:", e1.message); allPassed = false; }
  else console.log("   PASS - id:", c[0].id);

  // Test 2: Users table
  console.log("2. users table...");
  const { data: u, error: e2 } = await supabase
    .from("users")
    .insert({ username: "dbtest_" + Date.now(), email: "dbtest@test.com", password_hash: "hash" })
    .select();
  if (e2) { console.log("   FAIL:", e2.message); allPassed = false; }
  else { console.log("   PASS - id:", u[0].id); userId = u[0].id; }

  // Test 3: Documents table (FK)
  console.log("3. documents table (FK to users)...");
  if (userId) {
    const { data: d, error: e3 } = await supabase
      .from("documents")
      .insert({ user_id: userId, filename: "test.pdf", sha256_hash: "testhash", upload_status: "pending" })
      .select();
    if (e3) { console.log("   FAIL:", e3.message); allPassed = false; }
    else console.log("   PASS - id:", d[0].id, "-> user:", d[0].user_id);
  }

  // Test 4: Audit log
  console.log("4. audit_log table...");
  const { data: a, error: e4 } = await supabase
    .from("audit_log")
    .insert({ user_id: userId, action: "test", details: { test: true } })
    .select();
  if (e4) { console.log("   FAIL:", e4.message); allPassed = false; }
  else console.log("   PASS - id:", a[0].id);

  // Cleanup
  console.log("\n5. Cleaning up test data...");
  await supabase.from("audit_log").delete().neq("id", 0);
  await supabase.from("documents").delete().neq("id", 0);
  await supabase.from("contact_submissions").delete().neq("id", 0);
  await supabase.from("users").delete().neq("id", 0);
  console.log("   Done");

  console.log("\n" + (allPassed ? "=== ALL TESTS PASSED ===" : "=== SOME TESTS FAILED ==="));
}

test().catch((e) => console.error("Fatal:", e));
