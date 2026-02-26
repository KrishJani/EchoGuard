/**
 * EchoGuard E2E Test Script
 *
 * Run with: npx tsx scripts/test-e2e.ts
 * Or: npx convex run scripts/test-e2e:run
 *
 * Set CONVEX_URL or CONVEX_SITE_URL for webhook tests.
 * For action tests, run from a Convex context or use the dashboard.
 */

const CONVEX_SITE = process.env.CONVEX_SITE_URL || process.env.VITE_CONVEX_URL?.replace('.cloud', '.site') || 'https://bright-goose-102.convex.site';

async function testOnboarding(baseUrl: string) {
  console.log('\n--- Test 1: Onboarding Flow ---');
  const onboardingPayload = {
    input: {
      user_id: 'e2e-test-user',
      elderly_phone: '+15551234567',
      family_phone: '+15559876543',
      qa_1_question: 'What was our dogs name',
      qa_1_answer: 'Max',
      qa_2_question: 'Where did we go for Christmas 2019',
      qa_2_answer: 'Grandmas house',
    },
  };
  console.log('Payload:', JSON.stringify(onboardingPayload, null, 2));
  console.log('Note: Run onboarding via the app UI or Convex dashboard action:');
  console.log('  api.actions.processFlow_node_1772062308325_ijvljhn');
  console.log('  with args:', JSON.stringify(onboardingPayload));
  return true;
}

async function testIncomingCallWebhook() {
  console.log('\n--- Test 2: Incoming Call Webhook ---');
  const twilioIncomingPayload = new URLSearchParams({
    CallSid: 'CA' + Date.now(),
    From: '+15551234567',
    To: '+15559876543',
    CallStatus: 'ringing',
  });

  const res = await fetch(`${CONVEX_SITE}/twilio/incoming-call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: twilioIncomingPayload.toString(),
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Content-Type:', res.headers.get('content-type'));
  if (text.startsWith('<?xml')) {
    console.log('Response (TwiML):', text.substring(0, 300) + '...');
    console.log('✓ Incoming call returns TwiML to record');
  } else {
    console.log('Response:', text.substring(0, 500));
  }
  return res.ok;
}

async function testRecordingCompleteWebhook() {
  console.log('\n--- Test 3: Recording Complete Webhook ---');
  const callSid = 'CA' + (Date.now() - 1000);
  const twilioRecordingPayload = new URLSearchParams({
    CallSid: callSid,
    From: '+15551234567',
    RecordingUrl: 'https://api.twilio.com/2010-04-01/Accounts/ACxxx/Recordings/RExxx',
    RecordingSid: 'RExxx',
    RecordingDuration: '10',
  });

  const res = await fetch(`${CONVEX_SITE}/twilio/recording-complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: twilioRecordingPayload.toString(),
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text.substring(0, 500));
  return res.ok;
}

async function main() {
  console.log('EchoGuard E2E Tests');
  console.log('CONVEX_SITE:', CONVEX_SITE);

  await testOnboarding(CONVEX_SITE);
  await testIncomingCallWebhook();
  await testRecordingCompleteWebhook();

  console.log('\n--- Done ---');
  console.log('For full onboarding test, use the app at /onboarding or Convex dashboard.');
}

main().catch(console.error);
