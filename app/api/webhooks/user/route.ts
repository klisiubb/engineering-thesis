import { prisma } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs';
import { Role } from '@prisma/client';
import { IncomingHttpHeaders } from 'http';
import {headers} from 'next/headers';
import { NextResponse } from 'next/server';
import {Webhook, WebhookRequiredHeaders} from 'svix';

const secret = process.env.WEBHOOK_SECRET || "";

async function handler (req:Request) {
    const payload = await req.json();
    const headersList = headers();
    const heads = {
        "svix-id": headersList.get("svix-id"),
        "svix-timestamp": headersList.get("svix-timestamp"),
        "svix-signature": headersList.get("svix-signature"),
    }
    const wh = new Webhook(secret)
    let event: Event | null  = null;

    try{
        event = wh.verify(JSON.stringify(payload), heads as IncomingHttpHeaders & WebhookRequiredHeaders) as Event
    }
    catch(e){
        console.log(e)  
        return NextResponse.json({}, {status:400})
    }
    const eventType: EventType = event.type;

        const {id,email_addresses, external_accounts, first_name, last_name, public_metadata } =  event.data as User
        const emailAddress = email_addresses[0].email_address;
        const pictureUrl = external_accounts[0].picture;

    if(eventType === "user.created" ){
      const user = await prisma.user.create({
            data:{
                externalId: id,
                email: emailAddress,
                firstName: first_name,
                lastName: last_name,
                picture: pictureUrl
            }
        })

    await clerkClient.users.updateUserMetadata(id, {
    publicMetadata: {
        role:Role.USER
    }
  })

    }
    if(eventType === "user.updated"){
        await prisma.user.update({
            where:{
                externalId: id
            },
            data:{
                email: emailAddress,
                firstName: first_name,
                lastName: last_name,
                picture: pictureUrl,
                role: public_metadata.role as Role
            }
        })
    }
  return NextResponse.json({ success: true });

}
type EventType = "user.created"| "user.updated" | "*"
type Event = {
    data: Record<string, string | any>,
    object: "event",
    type: EventType
}

interface User {
  id: string;
  backup_code_enabled: boolean;
  banned: boolean;
  email_addresses: { email_address: string }[];
  external_accounts: {
    approved_scopes: string;
    email_address: string;
    family_name: string;
    given_name: string;
    google_id: string;
    id: string;
    label: null | string;
    object: string;
    picture: string;
    public_metadata: Record<string, any>;
    username: null | string;
    verification: Record<string, any>;
  }[];
  first_name: string;
  gender: string;
  has_image: boolean;
  image_url: string;
  last_name: string;
  last_sign_in_at: null | number;
  object: string;
  password_enabled: boolean;
  phone_numbers: any[]; 
  primary_email_address_id: string;
  primary_phone_number_id: null | string;
  primary_web3_wallet_id: null | string;
  private_metadata: Record<string, any>;
  profile_image_url: string;
  public_metadata: Record<string, any>;
  saml_accounts: any[]; 
  totp_enabled: boolean;
  two_factor_enabled: boolean;
  unsafe_metadata: Record<string, any>;
  updated_at: number;
  username: null | string;
  web3_wallets: any[]; 
}


export const POST = handler;
export const PUT = handler;
export const GET = handler;