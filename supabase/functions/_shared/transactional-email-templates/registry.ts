/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as quoteSent } from './quote-sent.tsx'
import { template as quoteReceivedInvite } from './quote-received-invite.tsx'
import { template as quoteSentGuestInvite } from './quote-sent-guest-invite.tsx'
import { template as invoiceCreated } from './invoice-created.tsx'
import { template as paymentConfirmed } from './payment-confirmed.tsx'
import { template as contactConfirmation } from './contact-confirmation.tsx'
import { template as partnerApplicationReceived } from './partner-application-received.tsx'
import { template as investorVisionLink } from './investor-vision-link.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'quote-sent': quoteSent,
  'quote-received-invite': quoteReceivedInvite,
  'quote-sent-guest-invite': quoteSentGuestInvite,
  'invoice-created': invoiceCreated,
  'payment-confirmed': paymentConfirmed,
  'contact-confirmation': contactConfirmation,
  'partner-application-received': partnerApplicationReceived,
  'investor-vision-link': investorVisionLink,
}
