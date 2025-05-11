import { Webhook } from 'svix';
import { headers } from 'next/headers';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
//   const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
//   if (!WEBHOOK_SECRET) {
//     throw new Error('CLERK_WEBHOOK_SECRET is missing');
//   }

//   const headerPayload = headers();
//   const svixId = headerPayload.get('svix-id');
//   const svixTimestamp = headerPayload.get('svix-timestamp');
//   const svixSignature = headerPayload.get('svix-signature');

//   if (!svixId || !svixTimestamp || !svixSignature) {
//     return new Response('Error occurred -- no svix headers', { status: 400 });
//   }

//   const payload = await req.json();
//   const wh = new Webhook(WEBHOOK_SECRET);
//   let evt: WebhookEvent;

//   try {
//     evt = wh.verify(JSON.stringify(payload), {
//       'svix-id': svixId,
//       'svix-timestamp': svixTimestamp,
//       'svix-signature': svixSignature,
//     }) as WebhookEvent;
//   } catch (err) {
//     return new Response('Error verifying webhook', { status: 400 });
//   }

//   const eventType = evt.type;

//   try {
//     if (eventType === 'user.created' || eventType === 'user.updated') {
//       const { id, email_addresses, first_name, last_name, image_url } = evt.data;

//       const email = email_addresses.find(
//         (email) => email.id === evt.data.primary_email_address_id
//       )?.email_address;

//       if (!email) {
//         return new Response('No email found', { status: 400 });
//       }

//       await prisma.user.upsert({
//         where: { id },
//         update: {
//           email,
//           name: `${first_name} ${last_name}`.trim(),
//           image: image_url,
//         },
//         create: {
//           id,
//           email,
//           name: `${first_name} ${last_name}`.trim(),
//           image: image_url,
//         },
//       });
//     }

//     return new Response('', { status: 200 });
//   } catch (err) {
//     return new Response('Error processing webhook', { status: 500 });
//   }
    return;
}