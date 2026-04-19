export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      affiliate_applications: {
        Row: {
          affiliate_id: string
          competitive_affiliations: string[]
          created_at: string
          customer_network_description: string | null
          expected_monthly_leads: number | null
          id: string
          promotion_channels: string[]
          proof_of_profession_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          updated_at: string
          why_affiliate: string | null
        }
        Insert: {
          affiliate_id: string
          competitive_affiliations?: string[]
          created_at?: string
          customer_network_description?: string | null
          expected_monthly_leads?: number | null
          id?: string
          promotion_channels?: string[]
          proof_of_profession_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          updated_at?: string
          why_affiliate?: string | null
        }
        Update: {
          affiliate_id?: string
          competitive_affiliations?: string[]
          created_at?: string
          customer_network_description?: string | null
          expected_monthly_leads?: number | null
          id?: string
          promotion_channels?: string[]
          proof_of_profession_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          updated_at?: string
          why_affiliate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_applications_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: true
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_campaign_items: {
        Row: {
          campaign_id: string
          created_at: string
          display_order: number
          id: string
          product_description: string | null
          product_model: string
          product_name: string | null
          quantity: number
          unit_price: number | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          display_order?: number
          id?: string
          product_description?: string | null
          product_model: string
          product_name?: string | null
          quantity?: number
          unit_price?: number | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          display_order?: number
          id?: string
          product_description?: string | null
          product_model?: string
          product_name?: string | null
          quantity?: number
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_campaign_items_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "affiliate_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_campaigns: {
        Row: {
          campaign_type: string
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          estimated_total: number | null
          hero_image_url: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          metadata: Json | null
          promo_note: string | null
          slug: string
          starts_at: string | null
          template_quote_id: string | null
          title: string
          total_clicks: number
          total_converted: number
          total_leads: number
          updated_at: string
        }
        Insert: {
          campaign_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          estimated_total?: number | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          metadata?: Json | null
          promo_note?: string | null
          slug: string
          starts_at?: string | null
          template_quote_id?: string | null
          title: string
          total_clicks?: number
          total_converted?: number
          total_leads?: number
          updated_at?: string
        }
        Update: {
          campaign_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          estimated_total?: number | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          metadata?: Json | null
          promo_note?: string | null
          slug?: string
          starts_at?: string | null
          template_quote_id?: string | null
          title?: string
          total_clicks?: number
          total_converted?: number
          total_leads?: number
          updated_at?: string
        }
        Relationships: []
      }
      affiliate_clicks: {
        Row: {
          affiliate_code: string
          affiliate_id: string
          campaign_id: string | null
          campaign_slug: string | null
          converted_at: string | null
          converted_to_lead: boolean
          country_code: string | null
          created_at: string
          device_type: string | null
          earnings_amount: number
          id: string
          ip_address: string | null
          is_billable: boolean
          is_bot: boolean
          is_self_click: boolean
          landing_path: string | null
          referrer: string | null
          rejected_reason: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          visitor_id: string | null
        }
        Insert: {
          affiliate_code: string
          affiliate_id: string
          campaign_id?: string | null
          campaign_slug?: string | null
          converted_at?: string | null
          converted_to_lead?: boolean
          country_code?: string | null
          created_at?: string
          device_type?: string | null
          earnings_amount?: number
          id?: string
          ip_address?: string | null
          is_billable?: boolean
          is_bot?: boolean
          is_self_click?: boolean
          landing_path?: string | null
          referrer?: string | null
          rejected_reason?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id?: string | null
        }
        Update: {
          affiliate_code?: string
          affiliate_id?: string
          campaign_id?: string | null
          campaign_slug?: string | null
          converted_at?: string | null
          converted_to_lead?: boolean
          country_code?: string | null
          created_at?: string
          device_type?: string | null
          earnings_amount?: number
          id?: string
          ip_address?: string | null
          is_billable?: boolean
          is_bot?: boolean
          is_self_click?: boolean
          landing_path?: string | null
          referrer?: string | null
          rejected_reason?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_clicks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "affiliate_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_known_visitors: {
        Row: {
          first_seen_at: string
          user_id: string
          visitor_id: string
        }
        Insert: {
          first_seen_at?: string
          user_id: string
          visitor_id: string
        }
        Update: {
          first_seen_at?: string
          user_id?: string
          visitor_id?: string
        }
        Relationships: []
      }
      affiliate_leads: {
        Row: {
          affiliate_code: string
          affiliate_id: string
          campaign_id: string | null
          click_id: string | null
          converted_at: string | null
          created_at: string
          customer_company: string | null
          customer_email: string | null
          customer_name: string | null
          deal_value: number | null
          id: string
          notes: string | null
          qualified_at: string | null
          qualified_by: string | null
          rejected_reason: string | null
          source_id: string | null
          source_type: string
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_code: string
          affiliate_id: string
          campaign_id?: string | null
          click_id?: string | null
          converted_at?: string | null
          created_at?: string
          customer_company?: string | null
          customer_email?: string | null
          customer_name?: string | null
          deal_value?: number | null
          id?: string
          notes?: string | null
          qualified_at?: string | null
          qualified_by?: string | null
          rejected_reason?: string | null
          source_id?: string | null
          source_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_code?: string
          affiliate_id?: string
          campaign_id?: string | null
          click_id?: string | null
          converted_at?: string | null
          created_at?: string
          customer_company?: string | null
          customer_email?: string | null
          customer_name?: string | null
          deal_value?: number | null
          id?: string
          notes?: string | null
          qualified_at?: string | null
          qualified_by?: string | null
          rejected_reason?: string | null
          source_id?: string | null
          source_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_leads_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "affiliate_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_leads_click_id_fkey"
            columns: ["click_id"]
            isOneToOne: false
            referencedRelation: "affiliate_clicks"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          id: string
          lead_count: number
          notes: string | null
          paid_at: string | null
          paid_by: string | null
          payment_method: string
          payment_reference: string | null
          payout_number: string
          period_end: string
          period_start: string
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          lead_count?: number
          notes?: string | null
          paid_at?: string | null
          paid_by?: string | null
          payment_method?: string
          payment_reference?: string | null
          payout_number: string
          period_end: string
          period_start: string
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          lead_count?: number
          notes?: string | null
          paid_at?: string | null
          paid_by?: string | null
          payment_method?: string
          payment_reference?: string | null
          payout_number?: string
          period_end?: string
          period_start?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          account_holder_type: string
          affiliate_code: string
          approved_at: string | null
          approved_by: string | null
          bank_account_name: string | null
          bank_account_number: string | null
          bank_name: string | null
          click_rate: number
          created_at: string
          current_company: string | null
          current_position: string | null
          email: string
          expertise_areas: string[]
          full_name: string
          id: string
          id_card_uploaded_at: string | null
          id_card_url: string | null
          linkedin_url: string | null
          min_payout: number
          national_id: string | null
          paid_earnings: number
          pending_earnings: number
          phone: string | null
          professional_bio: string | null
          profile_public: boolean
          promptpay_id: string | null
          rejection_reason: string | null
          status: string
          tax_id: string | null
          tier: string
          total_billable_clicks: number
          total_clicks: number
          total_closed_sales: number
          total_commission_earned: number
          total_commission_paid: number
          total_leads: number
          total_qualified_leads: number
          total_revenue_generated: number
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          account_holder_type?: string
          affiliate_code: string
          approved_at?: string | null
          approved_by?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          click_rate?: number
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          email: string
          expertise_areas?: string[]
          full_name: string
          id?: string
          id_card_uploaded_at?: string | null
          id_card_url?: string | null
          linkedin_url?: string | null
          min_payout?: number
          national_id?: string | null
          paid_earnings?: number
          pending_earnings?: number
          phone?: string | null
          professional_bio?: string | null
          profile_public?: boolean
          promptpay_id?: string | null
          rejection_reason?: string | null
          status?: string
          tax_id?: string | null
          tier?: string
          total_billable_clicks?: number
          total_clicks?: number
          total_closed_sales?: number
          total_commission_earned?: number
          total_commission_paid?: number
          total_leads?: number
          total_qualified_leads?: number
          total_revenue_generated?: number
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          account_holder_type?: string
          affiliate_code?: string
          approved_at?: string | null
          approved_by?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          click_rate?: number
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          email?: string
          expertise_areas?: string[]
          full_name?: string
          id?: string
          id_card_uploaded_at?: string | null
          id_card_url?: string | null
          linkedin_url?: string | null
          min_payout?: number
          national_id?: string | null
          paid_earnings?: number
          pending_earnings?: number
          phone?: string | null
          professional_bio?: string | null
          profile_public?: boolean
          promptpay_id?: string | null
          rejection_reason?: string | null
          status?: string
          tax_id?: string | null
          tier?: string
          total_billable_clicks?: number
          total_clicks?: number
          total_closed_sales?: number
          total_commission_earned?: number
          total_commission_paid?: number
          total_leads?: number
          total_qualified_leads?: number
          total_revenue_generated?: number
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          actor_role: string | null
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          record_id: string | null
          table_name: string | null
          target_email: string | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          record_id?: string | null
          table_name?: string | null
          target_email?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          record_id?: string | null
          table_name?: string | null
          target_email?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          added_at: string
          estimated_price: number | null
          id: string
          product_description: string | null
          product_model: string
          product_name: string | null
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          added_at?: string
          estimated_price?: number | null
          id?: string
          product_description?: string | null
          product_model: string
          product_name?: string | null
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          added_at?: string
          estimated_price?: number | null
          id?: string
          product_description?: string | null
          product_model?: string
          product_name?: string | null
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          attachment_name: string | null
          attachment_url: string | null
          content: string
          created_at: string
          id: string
          message_type: string
          read_at: string | null
          sender_id: string | null
          sender_name: string
          sender_type: string
          session_id: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_url?: string | null
          content: string
          created_at?: string
          id?: string
          message_type?: string
          read_at?: string | null
          sender_id?: string | null
          sender_name?: string
          sender_type: string
          session_id: string
        }
        Update: {
          attachment_name?: string | null
          attachment_url?: string | null
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          read_at?: string | null
          sender_id?: string | null
          sender_name?: string
          sender_type?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          assigned_to: string | null
          created_at: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          last_message_at: string | null
          metadata: Json | null
          source: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          last_message_at?: string | null
          metadata?: Json | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          last_message_at?: string | null
          metadata?: Json | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      company_bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          account_type: string | null
          bank_code: string | null
          bank_name: string
          branch: string | null
          company_id: string
          created_at: string
          created_by: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          notes: string | null
          swift_code: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          account_name: string
          account_number: string
          account_type?: string | null
          bank_code?: string | null
          bank_name: string
          branch?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          notes?: string | null
          swift_code?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string
          account_type?: string | null
          bank_code?: string | null
          bank_name?: string
          branch?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          notes?: string | null
          swift_code?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_bank_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_bank_accounts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_bank_accounts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_bank_accounts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_bank_accounts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_bank_accounts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_bank_accounts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      company_document_downloads: {
        Row: {
          document_id: string
          download_source: string | null
          downloaded_at: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          document_id: string
          download_source?: string | null
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          document_id?: string
          download_source?: string | null
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_document_downloads_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "company_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_document_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_document_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_document_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      company_documents: {
        Row: {
          access_level: string
          category: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          download_count: number
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_active: boolean
          is_featured: boolean
          last_downloaded_at: string | null
          metadata: Json | null
          sort_order: number
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          valid_from: string | null
          valid_until: string | null
          version: string | null
        }
        Insert: {
          access_level?: string
          category: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          download_count?: number
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          last_downloaded_at?: string | null
          metadata?: Json | null
          sort_order?: number
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
          version?: string | null
        }
        Update: {
          access_level?: string
          category?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          download_count?: number
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          last_downloaded_at?: string | null
          metadata?: Json | null
          sort_order?: number
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_documents_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_documents_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_documents_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          address_en: string | null
          address_th: string | null
          bank_account_name: string | null
          bank_account_number: string | null
          bank_branch: string | null
          bank_name: string | null
          branch_code: string | null
          branch_name: string | null
          branch_type: string | null
          created_at: string | null
          default_delivery_terms: string | null
          default_payment_terms: string | null
          default_quote_validity_days: number | null
          default_vat_percent: number | null
          default_warranty_terms: string | null
          email: string | null
          fax: string | null
          id: string
          is_active: boolean
          letterhead_url: string | null
          logo_url: string | null
          name_en: string | null
          name_th: string
          phone: string | null
          promptpay_id: string | null
          signature_url: string | null
          tax_id: string | null
          updated_at: string | null
          updated_by: string | null
          vat_registered: boolean | null
          website: string | null
        }
        Insert: {
          address_en?: string | null
          address_th?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          branch_code?: string | null
          branch_name?: string | null
          branch_type?: string | null
          created_at?: string | null
          default_delivery_terms?: string | null
          default_payment_terms?: string | null
          default_quote_validity_days?: number | null
          default_vat_percent?: number | null
          default_warranty_terms?: string | null
          email?: string | null
          fax?: string | null
          id?: string
          is_active?: boolean
          letterhead_url?: string | null
          logo_url?: string | null
          name_en?: string | null
          name_th?: string
          phone?: string | null
          promptpay_id?: string | null
          signature_url?: string | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vat_registered?: boolean | null
          website?: string | null
        }
        Update: {
          address_en?: string | null
          address_th?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          branch_code?: string | null
          branch_name?: string | null
          branch_type?: string | null
          created_at?: string | null
          default_delivery_terms?: string | null
          default_payment_terms?: string | null
          default_quote_validity_days?: number | null
          default_vat_percent?: number | null
          default_warranty_terms?: string | null
          email?: string | null
          fax?: string | null
          id?: string
          is_active?: boolean
          letterhead_url?: string | null
          logo_url?: string | null
          name_en?: string | null
          name_th?: string
          phone?: string | null
          promptpay_id?: string | null
          signature_url?: string | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vat_registered?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          affiliate_code: string | null
          affiliate_id: string | null
          assigned_to: string | null
          attribution_source: string | null
          company: string | null
          created_at: string
          email: string
          follow_up_date: string | null
          id: string
          lead_score: number | null
          message: string
          name: string
          notes: string | null
          phone: string | null
          priority: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_code?: string | null
          affiliate_id?: string | null
          assigned_to?: string | null
          attribution_source?: string | null
          company?: string | null
          created_at?: string
          email: string
          follow_up_date?: string | null
          id?: string
          lead_score?: number | null
          message: string
          name: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_code?: string | null
          affiliate_id?: string | null
          assigned_to?: string | null
          attribution_source?: string | null
          company?: string | null
          created_at?: string
          email?: string
          follow_up_date?: string | null
          id?: string
          lead_score?: number | null
          message?: string
          name?: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_submissions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_submissions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_submissions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_submissions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          branch_code: string | null
          branch_name: string | null
          branch_type: string | null
          business_location: string | null
          company_name: string
          contact_code: string | null
          contact_name: string | null
          contact_position: string | null
          contact_type: string
          created_at: string
          created_by: string | null
          credit_days: number | null
          email: string | null
          entity_type: string
          fax: string | null
          id: string
          imported_at: string | null
          imported_from: string | null
          is_active: boolean | null
          line_id: string | null
          mobile_phone: string | null
          notes: string | null
          office_phone: string | null
          payment_terms: string | null
          postal_code: string | null
          tags: string[] | null
          tax_id: string | null
          updated_at: string
          updated_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          branch_code?: string | null
          branch_name?: string | null
          branch_type?: string | null
          business_location?: string | null
          company_name: string
          contact_code?: string | null
          contact_name?: string | null
          contact_position?: string | null
          contact_type?: string
          created_at?: string
          created_by?: string | null
          credit_days?: number | null
          email?: string | null
          entity_type?: string
          fax?: string | null
          id?: string
          imported_at?: string | null
          imported_from?: string | null
          is_active?: boolean | null
          line_id?: string | null
          mobile_phone?: string | null
          notes?: string | null
          office_phone?: string | null
          payment_terms?: string | null
          postal_code?: string | null
          tags?: string[] | null
          tax_id?: string | null
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          branch_code?: string | null
          branch_name?: string | null
          branch_type?: string | null
          business_location?: string | null
          company_name?: string
          contact_code?: string | null
          contact_name?: string | null
          contact_position?: string | null
          contact_type?: string
          created_at?: string
          created_by?: string | null
          credit_days?: number | null
          email?: string | null
          entity_type?: string
          fax?: string | null
          id?: string
          imported_at?: string | null
          imported_from?: string | null
          is_active?: boolean | null
          line_id?: string | null
          mobile_phone?: string | null
          notes?: string | null
          office_phone?: string | null
          payment_terms?: string | null
          postal_code?: string | null
          tags?: string[] | null
          tax_id?: string | null
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_note_items: {
        Row: {
          created_at: string
          credit_note_id: string
          display_order: number | null
          id: string
          line_total: number
          original_item_id: string | null
          product_description: string | null
          product_id: string | null
          product_name: string
          quantity: number
          sku: string | null
          unit: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          credit_note_id: string
          display_order?: number | null
          id?: string
          line_total?: number
          original_item_id?: string | null
          product_description?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          sku?: string | null
          unit?: string | null
          unit_price?: number
        }
        Update: {
          created_at?: string
          credit_note_id?: string
          display_order?: number | null
          id?: string
          line_total?: number
          original_item_id?: string | null
          product_description?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          sku?: string | null
          unit?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "credit_note_items_credit_note_id_fkey"
            columns: ["credit_note_id"]
            isOneToOne: false
            referencedRelation: "credit_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_notes: {
        Row: {
          adjustment_target: string
          created_at: string
          created_by: string | null
          credit_note_date: string
          credit_note_number: string
          customer_address: string | null
          customer_branch_code: string | null
          customer_branch_name: string | null
          customer_branch_type: string | null
          customer_company: string | null
          customer_id: string | null
          customer_name: string
          customer_tax_id: string | null
          deleted_at: string | null
          discount_amount: number | null
          discount_percent: number | null
          discount_type: string
          grand_total: number
          id: string
          notes: string | null
          original_invoice_id: string
          original_tax_invoice_id: string
          reason_code: string
          reason_detail: string
          status: string
          subtotal: number
          updated_at: string
          vat_amount: number | null
          vat_percent: number | null
          void_reason: string | null
          voided_at: string | null
          voided_by: string | null
        }
        Insert: {
          adjustment_target?: string
          created_at?: string
          created_by?: string | null
          credit_note_date?: string
          credit_note_number: string
          customer_address?: string | null
          customer_branch_code?: string | null
          customer_branch_name?: string | null
          customer_branch_type?: string | null
          customer_company?: string | null
          customer_id?: string | null
          customer_name: string
          customer_tax_id?: string | null
          deleted_at?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          discount_type?: string
          grand_total?: number
          id?: string
          notes?: string | null
          original_invoice_id: string
          original_tax_invoice_id: string
          reason_code: string
          reason_detail: string
          status?: string
          subtotal?: number
          updated_at?: string
          vat_amount?: number | null
          vat_percent?: number | null
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Update: {
          adjustment_target?: string
          created_at?: string
          created_by?: string | null
          credit_note_date?: string
          credit_note_number?: string
          customer_address?: string | null
          customer_branch_code?: string | null
          customer_branch_name?: string | null
          customer_branch_type?: string | null
          customer_company?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_tax_id?: string | null
          deleted_at?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          discount_type?: string
          grand_total?: number
          id?: string
          notes?: string | null
          original_invoice_id?: string
          original_tax_invoice_id?: string
          reason_code?: string
          reason_detail?: string
          status?: string
          subtotal?: number
          updated_at?: string
          vat_amount?: number | null
          vat_percent?: number | null
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_notes_original_invoice_id_fkey"
            columns: ["original_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_notes_original_tax_invoice_id_fkey"
            columns: ["original_tax_invoice_id"]
            isOneToOne: false
            referencedRelation: "tax_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      document_counters: {
        Row: {
          date_key: string
          doc_type: string
          last_seq: number
          updated_at: string
        }
        Insert: {
          date_key: string
          doc_type: string
          last_seq?: number
          updated_at?: string
        }
        Update: {
          date_key?: string
          doc_type?: string
          last_seq?: number
          updated_at?: string
        }
        Relationships: []
      }
      document_downloads: {
        Row: {
          document_id: string
          download_source: string | null
          downloaded_at: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          document_id: string
          download_source?: string | null
          downloaded_at?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          document_id?: string
          download_source?: string | null
          downloaded_at?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_downloads_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          access_level: string
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          metadata: Json | null
          product_series: string | null
          sort_order: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          access_level?: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          metadata?: Json | null
          product_series?: string | null
          sort_order?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          access_level?: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          metadata?: Json | null
          product_series?: string | null
          sort_order?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          metadata: Json | null
          provider_message_id: string | null
          recipient_email: string
          related_id: string | null
          related_type: string | null
          status: string
          subject: string | null
          template_name: string
          triggered_by: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          provider_message_id?: string | null
          recipient_email: string
          related_id?: string | null
          related_type?: string | null
          status?: string
          subject?: string | null
          template_name: string
          triggered_by?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          provider_message_id?: string | null
          recipient_email?: string
          related_id?: string | null
          related_type?: string | null
          status?: string
          subject?: string | null
          template_name?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      email_template_settings: {
        Row: {
          body_text: string | null
          button_text: string | null
          created_at: string
          font_family: string | null
          footer_text: string | null
          heading: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          primary_color: string | null
          site_name: string | null
          subject: string | null
          template_type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body_text?: string | null
          button_text?: string | null
          created_at?: string
          font_family?: string | null
          footer_text?: string | null
          heading?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          primary_color?: string | null
          site_name?: string | null
          subject?: string | null
          template_type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body_text?: string | null
          button_text?: string | null
          created_at?: string
          font_family?: string | null
          footer_text?: string | null
          heading?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          primary_color?: string | null
          site_name?: string | null
          subject?: string | null
          template_type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      employee_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          full_name: string | null
          id: string
          invited_by: string | null
          role: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          full_name?: string | null
          id?: string
          invited_by?: string | null
          role?: string
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          full_name?: string | null
          id?: string
          invited_by?: string | null
          role?: string
          token?: string
        }
        Relationships: []
      }
      international_transfer_requests: {
        Row: {
          amount: number
          amount_thb: number | null
          approved_at: string | null
          approved_by: string | null
          bank_account_name: string | null
          bank_account_number: string
          bank_address: string | null
          bank_fee: number | null
          bank_name: string
          created_at: string
          created_by: string | null
          currency: string
          deleted_at: string | null
          due_date: string | null
          email_notification_status: string
          email_notified_at: string | null
          email_notified_by: string | null
          exchange_rate: number | null
          iban: string | null
          id: string
          intermediary_bank: string | null
          intermediary_swift: string | null
          invoice_reference: string | null
          notes: string | null
          other_fee: number | null
          priority: string | null
          purchase_order_ids: string[] | null
          purpose: string
          rejection_reason: string | null
          requested_transfer_date: string | null
          status: string
          supplier_id: string
          supplier_name: string
          swift_code: string
          total_cost_thb: number | null
          total_fee: number | null
          transfer_fee: number | null
          transfer_number: string
          transfer_slip_url: string | null
          transferred_at: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          amount_thb?: number | null
          approved_at?: string | null
          approved_by?: string | null
          bank_account_name?: string | null
          bank_account_number: string
          bank_address?: string | null
          bank_fee?: number | null
          bank_name: string
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          due_date?: string | null
          email_notification_status?: string
          email_notified_at?: string | null
          email_notified_by?: string | null
          exchange_rate?: number | null
          iban?: string | null
          id?: string
          intermediary_bank?: string | null
          intermediary_swift?: string | null
          invoice_reference?: string | null
          notes?: string | null
          other_fee?: number | null
          priority?: string | null
          purchase_order_ids?: string[] | null
          purpose: string
          rejection_reason?: string | null
          requested_transfer_date?: string | null
          status?: string
          supplier_id: string
          supplier_name: string
          swift_code: string
          total_cost_thb?: number | null
          total_fee?: number | null
          transfer_fee?: number | null
          transfer_number?: string
          transfer_slip_url?: string | null
          transferred_at?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          amount_thb?: number | null
          approved_at?: string | null
          approved_by?: string | null
          bank_account_name?: string | null
          bank_account_number?: string
          bank_address?: string | null
          bank_fee?: number | null
          bank_name?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          due_date?: string | null
          email_notification_status?: string
          email_notified_at?: string | null
          email_notified_by?: string | null
          exchange_rate?: number | null
          iban?: string | null
          id?: string
          intermediary_bank?: string | null
          intermediary_swift?: string | null
          invoice_reference?: string | null
          notes?: string | null
          other_fee?: number | null
          priority?: string | null
          purchase_order_ids?: string[] | null
          purpose?: string
          rejection_reason?: string | null
          requested_transfer_date?: string | null
          status?: string
          supplier_id?: string
          supplier_name?: string
          swift_code?: string
          total_cost_thb?: number | null
          total_fee?: number | null
          transfer_fee?: number | null
          transfer_number?: string
          transfer_slip_url?: string | null
          transferred_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "international_transfer_requests_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_payment_summary"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "international_transfer_requests_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_access_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          inquiry_id: string | null
          is_active: boolean
          last_viewed_at: string | null
          max_views: number | null
          notes: string | null
          recipient_company: string | null
          recipient_email: string
          recipient_name: string
          revoked_at: string | null
          revoked_by: string | null
          token: string
          updated_at: string
          view_count: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          inquiry_id?: string | null
          is_active?: boolean
          last_viewed_at?: string | null
          max_views?: number | null
          notes?: string | null
          recipient_company?: string | null
          recipient_email: string
          recipient_name: string
          revoked_at?: string | null
          revoked_by?: string | null
          token?: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          inquiry_id?: string | null
          is_active?: boolean
          last_viewed_at?: string | null
          max_views?: number | null
          notes?: string | null
          recipient_company?: string | null
          recipient_email?: string
          recipient_name?: string
          revoked_at?: string | null
          revoked_by?: string | null
          token?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "investor_access_tokens_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "investor_inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_brief_views: {
        Row: {
          id: string
          ip_address: string | null
          referrer: string | null
          token: string
          token_id: string | null
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          referrer?: string | null
          token: string
          token_id?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          referrer?: string | null
          token?: string
          token_id?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_brief_views_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "investor_access_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_inquiries: {
        Row: {
          budget_range: string | null
          company: string | null
          contacted_at: string | null
          contacted_by: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          internal_notes: string | null
          investor_type: string | null
          ip_address: string | null
          line_id: string | null
          message: string | null
          phone: string | null
          position: string | null
          source: string | null
          status: string
          timeline: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          contacted_at?: string | null
          contacted_by?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          internal_notes?: string | null
          investor_type?: string | null
          ip_address?: string | null
          line_id?: string | null
          message?: string | null
          phone?: string | null
          position?: string | null
          source?: string | null
          status?: string
          timeline?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          contacted_at?: string | null
          contacted_by?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          internal_notes?: string | null
          investor_type?: string | null
          ip_address?: string | null
          line_id?: string | null
          message?: string | null
          phone?: string | null
          position?: string | null
          source?: string | null
          status?: string
          timeline?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          discount_amount: number | null
          discount_percent: number | null
          display_order: number | null
          id: string
          invoice_id: string
          line_total: number
          product_description: string | null
          product_id: string | null
          product_name: string
          quantity: number
          sku: string | null
          unit: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          discount_amount?: number | null
          discount_percent?: number | null
          display_order?: number | null
          id?: string
          invoice_id: string
          line_total?: number
          product_description?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          sku?: string | null
          unit?: string | null
          unit_price?: number
        }
        Update: {
          created_at?: string
          discount_amount?: number | null
          discount_percent?: number | null
          display_order?: number | null
          id?: string
          invoice_id?: string
          line_total?: number
          product_description?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          sku?: string | null
          unit?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_share_access_log: {
        Row: {
          accessed_at: string
          action: string
          id: string
          ip_address: string | null
          share_link_id: string
          user_agent: string | null
        }
        Insert: {
          accessed_at?: string
          action: string
          id?: string
          ip_address?: string | null
          share_link_id: string
          user_agent?: string | null
        }
        Update: {
          accessed_at?: string
          action?: string
          id?: string
          ip_address?: string | null
          share_link_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_share_access_log_share_link_id_fkey"
            columns: ["share_link_id"]
            isOneToOne: false
            referencedRelation: "invoice_share_links"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_share_links: {
        Row: {
          created_at: string
          created_by: string | null
          download_count: number
          expires_at: string
          id: string
          invoice_id: string
          last_accessed_at: string | null
          revoked_at: string | null
          revoked_by: string | null
          token: string
          view_count: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          download_count?: number
          expires_at: string
          id?: string
          invoice_id: string
          last_accessed_at?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          token: string
          view_count?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          download_count?: number
          expires_at?: string
          id?: string
          invoice_id?: string
          last_accessed_at?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          token?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_share_links_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          cancel_reason: string | null
          cancelled_at: string | null
          created_at: string
          created_by: string | null
          customer_address: string | null
          customer_branch_code: string | null
          customer_branch_name: string | null
          customer_branch_type: string | null
          customer_company: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          customer_tax_id: string | null
          delete_reason: string | null
          deleted_at: string | null
          deleted_by: string | null
          discount_amount: number | null
          discount_percent: number | null
          discount_type: string
          downpayment_percent: number | null
          due_date: string | null
          grand_total: number
          id: string
          installment_number: number | null
          installment_total: number | null
          internal_notes: string | null
          invoice_date: string
          invoice_number: string
          invoice_type: string
          notes: string | null
          parent_invoice_id: string | null
          payment_terms: string | null
          po_number: string | null
          project_name: string | null
          quote_id: string | null
          sale_order_id: string | null
          status: string
          subtotal: number
          updated_at: string
          vat_amount: number | null
          vat_percent: number | null
          withholding_tax_amount: number | null
          withholding_tax_percent: number | null
        }
        Insert: {
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_branch_code?: string | null
          customer_branch_name?: string | null
          customer_branch_type?: string | null
          customer_company?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          customer_tax_id?: string | null
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          discount_type?: string
          downpayment_percent?: number | null
          due_date?: string | null
          grand_total?: number
          id?: string
          installment_number?: number | null
          installment_total?: number | null
          internal_notes?: string | null
          invoice_date?: string
          invoice_number: string
          invoice_type?: string
          notes?: string | null
          parent_invoice_id?: string | null
          payment_terms?: string | null
          po_number?: string | null
          project_name?: string | null
          quote_id?: string | null
          sale_order_id?: string | null
          status?: string
          subtotal?: number
          updated_at?: string
          vat_amount?: number | null
          vat_percent?: number | null
          withholding_tax_amount?: number | null
          withholding_tax_percent?: number | null
        }
        Update: {
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_branch_code?: string | null
          customer_branch_name?: string | null
          customer_branch_type?: string | null
          customer_company?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_tax_id?: string | null
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          discount_type?: string
          downpayment_percent?: number | null
          due_date?: string | null
          grand_total?: number
          id?: string
          installment_number?: number | null
          installment_total?: number | null
          internal_notes?: string | null
          invoice_date?: string
          invoice_number?: string
          invoice_type?: string
          notes?: string | null
          parent_invoice_id?: string | null
          payment_terms?: string | null
          po_number?: string | null
          project_name?: string | null
          quote_id?: string | null
          sale_order_id?: string | null
          status?: string
          subtotal?: number
          updated_at?: string
          vat_amount?: number | null
          vat_percent?: number | null
          withholding_tax_amount?: number | null
          withholding_tax_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_parent_invoice_id_fkey"
            columns: ["parent_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_sale_order_id_fkey"
            columns: ["sale_order_id"]
            isOneToOne: false
            referencedRelation: "sale_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      login_history: {
        Row: {
          created_at: string
          email: string
          failure_reason: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          success: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "login_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "login_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "login_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          link_id: string | null
          link_type: string | null
          message: string | null
          metadata: Json | null
          priority: string
          quote_id: string | null
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          link_id?: string | null
          link_type?: string | null
          message?: string | null
          metadata?: Json | null
          priority?: string
          quote_id?: string | null
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          link_id?: string | null
          link_type?: string | null
          message?: string | null
          metadata?: Json | null
          priority?: string
          quote_id?: string | null
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_application_files: {
        Row: {
          application_id: string
          created_at: string
          file_category: string
          file_name: string
          file_path: string
          file_size: number | null
          file_url: string | null
          id: string
          mime_type: string | null
          ocr_extracted: Json | null
          session_token: string | null
          uploaded_by: string | null
        }
        Insert: {
          application_id: string
          created_at?: string
          file_category: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
          ocr_extracted?: Json | null
          session_token?: string | null
          uploaded_by?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string
          file_category?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
          ocr_extracted?: Json | null
          session_token?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_application_files_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "partner_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_application_reviews: {
        Row: {
          application_id: string
          comment: string | null
          created_at: string
          decision: string
          id: string
          internal_only: boolean | null
          reviewer_id: string
          reviewer_name: string | null
          score: number | null
        }
        Insert: {
          application_id: string
          comment?: string | null
          created_at?: string
          decision: string
          id?: string
          internal_only?: boolean | null
          reviewer_id: string
          reviewer_name?: string | null
          score?: number | null
        }
        Update: {
          application_id?: string
          comment?: string | null
          created_at?: string
          decision?: string
          id?: string
          internal_only?: boolean | null
          reviewer_id?: string
          reviewer_name?: string | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_application_reviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "partner_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_applications: {
        Row: {
          additional_notes: string | null
          annual_export_value_usd: number | null
          application_number: string | null
          auto_score: number | null
          auto_score_breakdown: Json | null
          business_license_no: string | null
          certifications: string[] | null
          city: string | null
          company_address: string | null
          company_name_en: string | null
          company_name_local: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_position: string | null
          contact_wechat: string | null
          contact_whatsapp: string | null
          country: string | null
          created_at: string
          current_stage: number
          established_year: number | null
          exclusivity_preference: string | null
          expected_partnership_type: string[] | null
          export_countries: string[] | null
          factory_size_sqm: number | null
          has_thailand_experience: boolean | null
          heard_about_us_from: string | null
          id: string
          internal_notes: string | null
          language: string
          last_saved_at: string | null
          legal_representative: string | null
          main_products: string | null
          major_clients: string | null
          manual_score: number | null
          min_order_quantity: string | null
          monthly_capacity: string | null
          odm_capable: boolean | null
          oem_capable: boolean | null
          payment_terms_preference: string | null
          product_categories: string[] | null
          province: string | null
          qa_staff_count: number | null
          rd_staff_count: number | null
          registered_capital_cny: number | null
          rejection_reason: string | null
          rejection_reason_code: string | null
          review_decision: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          sample_policy: string | null
          session_token: string | null
          staff_count: number | null
          status: string
          submitted_at: string | null
          thailand_experience_detail: string | null
          updated_at: string
          user_id: string | null
          warranty_terms: string | null
          website: string | null
          why_partner_with_us: string | null
        }
        Insert: {
          additional_notes?: string | null
          annual_export_value_usd?: number | null
          application_number?: string | null
          auto_score?: number | null
          auto_score_breakdown?: Json | null
          business_license_no?: string | null
          certifications?: string[] | null
          city?: string | null
          company_address?: string | null
          company_name_en?: string | null
          company_name_local?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_position?: string | null
          contact_wechat?: string | null
          contact_whatsapp?: string | null
          country?: string | null
          created_at?: string
          current_stage?: number
          established_year?: number | null
          exclusivity_preference?: string | null
          expected_partnership_type?: string[] | null
          export_countries?: string[] | null
          factory_size_sqm?: number | null
          has_thailand_experience?: boolean | null
          heard_about_us_from?: string | null
          id?: string
          internal_notes?: string | null
          language?: string
          last_saved_at?: string | null
          legal_representative?: string | null
          main_products?: string | null
          major_clients?: string | null
          manual_score?: number | null
          min_order_quantity?: string | null
          monthly_capacity?: string | null
          odm_capable?: boolean | null
          oem_capable?: boolean | null
          payment_terms_preference?: string | null
          product_categories?: string[] | null
          province?: string | null
          qa_staff_count?: number | null
          rd_staff_count?: number | null
          registered_capital_cny?: number | null
          rejection_reason?: string | null
          rejection_reason_code?: string | null
          review_decision?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sample_policy?: string | null
          session_token?: string | null
          staff_count?: number | null
          status?: string
          submitted_at?: string | null
          thailand_experience_detail?: string | null
          updated_at?: string
          user_id?: string | null
          warranty_terms?: string | null
          website?: string | null
          why_partner_with_us?: string | null
        }
        Update: {
          additional_notes?: string | null
          annual_export_value_usd?: number | null
          application_number?: string | null
          auto_score?: number | null
          auto_score_breakdown?: Json | null
          business_license_no?: string | null
          certifications?: string[] | null
          city?: string | null
          company_address?: string | null
          company_name_en?: string | null
          company_name_local?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_position?: string | null
          contact_wechat?: string | null
          contact_whatsapp?: string | null
          country?: string | null
          created_at?: string
          current_stage?: number
          established_year?: number | null
          exclusivity_preference?: string | null
          expected_partnership_type?: string[] | null
          export_countries?: string[] | null
          factory_size_sqm?: number | null
          has_thailand_experience?: boolean | null
          heard_about_us_from?: string | null
          id?: string
          internal_notes?: string | null
          language?: string
          last_saved_at?: string | null
          legal_representative?: string | null
          main_products?: string | null
          major_clients?: string | null
          manual_score?: number | null
          min_order_quantity?: string | null
          monthly_capacity?: string | null
          odm_capable?: boolean | null
          oem_capable?: boolean | null
          payment_terms_preference?: string | null
          product_categories?: string[] | null
          province?: string | null
          qa_staff_count?: number | null
          rd_staff_count?: number | null
          registered_capital_cny?: number | null
          rejection_reason?: string | null
          rejection_reason_code?: string | null
          review_decision?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sample_policy?: string | null
          session_token?: string | null
          staff_count?: number | null
          status?: string
          submitted_at?: string | null
          thailand_experience_detail?: string | null
          updated_at?: string
          user_id?: string | null
          warranty_terms?: string | null
          website?: string | null
          why_partner_with_us?: string | null
        }
        Relationships: []
      }
      payment_records: {
        Row: {
          amount: number
          bank_account: string | null
          bank_name: string | null
          created_at: string
          created_by: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string
          payment_method: string
          proof_uploaded_at: string | null
          proof_url: string | null
          reference_number: string | null
          rejection_reason: string | null
          tax_invoice_id: string | null
          updated_at: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          bank_account?: string | null
          bank_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method: string
          proof_uploaded_at?: string | null
          proof_url?: string | null
          reference_number?: string | null
          rejection_reason?: string | null
          tax_invoice_id?: string | null
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          bank_account?: string | null
          bank_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          proof_uploaded_at?: string | null
          proof_url?: string | null
          reference_number?: string | null
          rejection_reason?: string | null
          tax_invoice_id?: string | null
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_tax_invoice_id_fkey"
            columns: ["tax_invoice_id"]
            isOneToOne: false
            referencedRelation: "tax_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      po_change_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          metadata: Json | null
          new_files: Json | null
          quote_id: string
          request_reason: string | null
          request_type: string
          requested_by: string
          requested_by_role: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          new_files?: Json | null
          quote_id: string
          request_reason?: string | null
          request_type: string
          requested_by: string
          requested_by_role: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          new_files?: Json | null
          quote_id?: string
          request_reason?: string | null
          request_type?: string
          requested_by?: string
          requested_by_role?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "po_change_requests_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      po_email_logs: {
        Row: {
          body: string | null
          cc: string[] | null
          created_at: string
          id: string
          po_id: string | null
          recipients: string[] | null
          sent_by: string | null
          status: string
          subject: string | null
          transfer_id: string | null
        }
        Insert: {
          body?: string | null
          cc?: string[] | null
          created_at?: string
          id?: string
          po_id?: string | null
          recipients?: string[] | null
          sent_by?: string | null
          status?: string
          subject?: string | null
          transfer_id?: string | null
        }
        Update: {
          body?: string | null
          cc?: string[] | null
          created_at?: string
          id?: string
          po_id?: string | null
          recipients?: string[] | null
          sent_by?: string | null
          status?: string
          subject?: string | null
          transfer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "po_email_logs_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_email_logs_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "international_transfer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      po_versions: {
        Row: {
          change_reason: string | null
          created_at: string
          created_by: string | null
          files: Json
          id: string
          quote_id: string
          version_number: number
        }
        Insert: {
          change_reason?: string | null
          created_at?: string
          created_by?: string | null
          files: Json
          id?: string
          quote_id: string
          version_number: number
        }
        Update: {
          change_reason?: string | null
          created_at?: string
          created_by?: string | null
          files?: Json
          id?: string
          quote_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "po_versions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_files: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          is_primary: boolean | null
          mime_type: string | null
          product_id: string
          title: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          is_primary?: boolean | null
          mime_type?: string | null
          product_id: string
          title?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_primary?: boolean | null
          mime_type?: string | null
          product_id?: string
          title?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_files_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_files_backup_pre_consolidation: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string | null
          is_primary: boolean | null
          mime_type: string | null
          product_id: string | null
          title: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string | null
          is_primary?: boolean | null
          mime_type?: string | null
          product_id?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string | null
          is_primary?: boolean | null
          mime_type?: string | null
          product_id?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      product_tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          usage_count: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          usage_count?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          cpu: string | null
          created_at: string | null
          has_4g: boolean | null
          has_wifi: boolean | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          os: string | null
          product_id: string
          ram_gb: number | null
          sku: string
          stock_quantity: number | null
          stock_status: string | null
          storage_gb: number | null
          storage_type: string | null
          unit_price: number
          unit_price_vat: number | null
          updated_at: string | null
          variant_name: string
        }
        Insert: {
          cpu?: string | null
          created_at?: string | null
          has_4g?: boolean | null
          has_wifi?: boolean | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          os?: string | null
          product_id: string
          ram_gb?: number | null
          sku: string
          stock_quantity?: number | null
          stock_status?: string | null
          storage_gb?: number | null
          storage_type?: string | null
          unit_price: number
          unit_price_vat?: number | null
          updated_at?: string | null
          variant_name: string
        }
        Update: {
          cpu?: string | null
          created_at?: string | null
          has_4g?: boolean | null
          has_wifi?: boolean | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          os?: string | null
          product_id?: string
          ram_gb?: number | null
          sku?: string
          stock_quantity?: number | null
          stock_status?: string | null
          storage_gb?: number | null
          storage_type?: string | null
          unit_price?: number
          unit_price_vat?: number | null
          updated_at?: string | null
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          buy_price: number | null
          buy_price_vat: number | null
          category: string | null
          cpu: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          form_factor: string | null
          gallery_urls: string[] | null
          has_4g: boolean | null
          has_wifi: boolean | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          max_stock_level: number | null
          min_stock_level: number | null
          model: string
          name: string
          os: string | null
          product_code: string | null
          ram_gb: number | null
          reorder_point: number | null
          search_vector: unknown
          series: string | null
          sku: string
          slug: string
          sort_order: number | null
          stock_quantity: number | null
          stock_status: string | null
          storage_gb: number | null
          storage_type: string | null
          tags: string[] | null
          thumbnail_url: string | null
          unit_price: number
          unit_price_vat: number | null
          updated_at: string | null
          updated_by: string | null
          warranty_months: number
          warranty_type: string
        }
        Insert: {
          buy_price?: number | null
          buy_price_vat?: number | null
          category?: string | null
          cpu?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          form_factor?: string | null
          gallery_urls?: string[] | null
          has_4g?: boolean | null
          has_wifi?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          max_stock_level?: number | null
          min_stock_level?: number | null
          model: string
          name: string
          os?: string | null
          product_code?: string | null
          ram_gb?: number | null
          reorder_point?: number | null
          search_vector?: unknown
          series?: string | null
          sku: string
          slug: string
          sort_order?: number | null
          stock_quantity?: number | null
          stock_status?: string | null
          storage_gb?: number | null
          storage_type?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          unit_price: number
          unit_price_vat?: number | null
          updated_at?: string | null
          updated_by?: string | null
          warranty_months?: number
          warranty_type?: string
        }
        Update: {
          buy_price?: number | null
          buy_price_vat?: number | null
          category?: string | null
          cpu?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          form_factor?: string | null
          gallery_urls?: string[] | null
          has_4g?: boolean | null
          has_wifi?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          max_stock_level?: number | null
          min_stock_level?: number | null
          model?: string
          name?: string
          os?: string | null
          product_code?: string | null
          ram_gb?: number | null
          reorder_point?: number | null
          search_vector?: unknown
          series?: string | null
          sku?: string
          slug?: string
          sort_order?: number | null
          stock_quantity?: number | null
          stock_status?: string | null
          storage_gb?: number | null
          storage_type?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          unit_price?: number
          unit_price_vat?: number | null
          updated_at?: string | null
          updated_by?: string | null
          warranty_months?: number
          warranty_type?: string
        }
        Relationships: []
      }
      products_backup_pre_consolidation: {
        Row: {
          buy_price: number | null
          buy_price_vat: number | null
          category: string | null
          cpu: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          form_factor: string | null
          gallery_urls: string[] | null
          has_4g: boolean | null
          has_wifi: boolean | null
          id: string | null
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          max_stock_level: number | null
          min_stock_level: number | null
          model: string | null
          name: string | null
          os: string | null
          product_code: string | null
          ram_gb: number | null
          reorder_point: number | null
          search_vector: unknown
          series: string | null
          sku: string | null
          slug: string | null
          sort_order: number | null
          stock_quantity: number | null
          stock_status: string | null
          storage_gb: number | null
          storage_type: string | null
          tags: string[] | null
          thumbnail_url: string | null
          unit_price: number | null
          unit_price_vat: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          buy_price?: number | null
          buy_price_vat?: number | null
          category?: string | null
          cpu?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          form_factor?: string | null
          gallery_urls?: string[] | null
          has_4g?: boolean | null
          has_wifi?: boolean | null
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          max_stock_level?: number | null
          min_stock_level?: number | null
          model?: string | null
          name?: string | null
          os?: string | null
          product_code?: string | null
          ram_gb?: number | null
          reorder_point?: number | null
          search_vector?: unknown
          series?: string | null
          sku?: string | null
          slug?: string | null
          sort_order?: number | null
          stock_quantity?: number | null
          stock_status?: string | null
          storage_gb?: number | null
          storage_type?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          unit_price?: number | null
          unit_price_vat?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          buy_price?: number | null
          buy_price_vat?: number | null
          category?: string | null
          cpu?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          form_factor?: string | null
          gallery_urls?: string[] | null
          has_4g?: boolean | null
          has_wifi?: boolean | null
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          max_stock_level?: number | null
          min_stock_level?: number | null
          model?: string | null
          name?: string | null
          os?: string | null
          product_code?: string | null
          ram_gb?: number | null
          reorder_point?: number | null
          search_vector?: unknown
          series?: string | null
          sku?: string | null
          slug?: string | null
          sort_order?: number | null
          stock_quantity?: number | null
          stock_status?: string | null
          storage_gb?: number | null
          storage_type?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          unit_price?: number | null
          unit_price_vat?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      purchase_orders: {
        Row: {
          carrier: string | null
          ci_number: string | null
          country_of_origin: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          deleted_at: string | null
          delivery_days: string | null
          destination: string | null
          expected_delivery: string | null
          grand_total: number | null
          handling_fee: number | null
          id: string
          items: Json
          loading_port: string | null
          notes: string | null
          order_date: string | null
          other_cost: number | null
          payment_terms: string | null
          pi_number: string | null
          po_number: string
          price_terms: string | null
          shipping_cost: number | null
          shipping_method: string | null
          status: string
          subtotal: number | null
          supplier_id: string
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          carrier?: string | null
          ci_number?: string | null
          country_of_origin?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deleted_at?: string | null
          delivery_days?: string | null
          destination?: string | null
          expected_delivery?: string | null
          grand_total?: number | null
          handling_fee?: number | null
          id?: string
          items?: Json
          loading_port?: string | null
          notes?: string | null
          order_date?: string | null
          other_cost?: number | null
          payment_terms?: string | null
          pi_number?: string | null
          po_number?: string
          price_terms?: string | null
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: string
          subtotal?: number | null
          supplier_id: string
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          carrier?: string | null
          ci_number?: string | null
          country_of_origin?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deleted_at?: string | null
          delivery_days?: string | null
          destination?: string | null
          expected_delivery?: string | null
          grand_total?: number | null
          handling_fee?: number | null
          id?: string
          items?: Json
          loading_port?: string | null
          notes?: string | null
          order_date?: string | null
          other_cost?: number | null
          payment_terms?: string | null
          pi_number?: string | null
          po_number?: string
          price_terms?: string | null
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: string
          subtotal?: number | null
          supplier_id?: string
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_payment_summary"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_files: {
        Row: {
          category: string
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          quote_id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          quote_id: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          quote_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_files_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_messages: {
        Row: {
          attachment_name: string | null
          attachment_url: string | null
          content: string
          created_at: string
          id: string
          message_type: string | null
          metadata: Json | null
          quote_id: string
          read_by: Json | null
          sender_id: string | null
          sender_name: string
          sender_role: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_url?: string | null
          content: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          quote_id: string
          read_by?: Json | null
          sender_id?: string | null
          sender_name: string
          sender_role: string
        }
        Update: {
          attachment_name?: string | null
          attachment_url?: string | null
          content?: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          quote_id?: string
          read_by?: Json | null
          sender_id?: string | null
          sender_name?: string
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_messages_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_negotiation_requests: {
        Row: {
          admin_response: string | null
          created_at: string | null
          id: string
          message: string
          quote_id: string
          request_type: string
          requested_by: string | null
          requested_by_role: string
          requested_discount_amount: number | null
          requested_discount_percent: number | null
          requested_free_items: Json | null
          responded_at: string | null
          responded_by: string | null
          resulted_in_revision_id: string | null
          revision_id: string | null
          status: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string | null
          id?: string
          message: string
          quote_id: string
          request_type?: string
          requested_by?: string | null
          requested_by_role?: string
          requested_discount_amount?: number | null
          requested_discount_percent?: number | null
          requested_free_items?: Json | null
          responded_at?: string | null
          responded_by?: string | null
          resulted_in_revision_id?: string | null
          revision_id?: string | null
          status?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string | null
          id?: string
          message?: string
          quote_id?: string
          request_type?: string
          requested_by?: string | null
          requested_by_role?: string
          requested_discount_amount?: number | null
          requested_discount_percent?: number | null
          requested_free_items?: Json | null
          responded_at?: string | null
          responded_by?: string | null
          resulted_in_revision_id?: string | null
          revision_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_negotiation_requests_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_negotiation_requests_resulted_in_revision_id_fkey"
            columns: ["resulted_in_revision_id"]
            isOneToOne: false
            referencedRelation: "quote_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_negotiation_requests_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "quote_revisions"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          affiliate_code: string | null
          affiliate_id: string | null
          approved_at: string | null
          assigned_to: string | null
          attribution_source: string | null
          campaign_id: string | null
          campaign_slug: string | null
          completed_at: string | null
          confirmed_at: string | null
          contact_id: string | null
          created_at: string
          created_by: string | null
          current_revision_id: string | null
          current_revision_number: number | null
          customer_address: string | null
          customer_company: string | null
          customer_email: string
          customer_line: string | null
          customer_name: string
          customer_phone: string | null
          customer_tax_id: string | null
          delete_reason: string | null
          deleted_at: string | null
          deleted_by: string | null
          delivery_terms: string | null
          discount_amount: number | null
          discount_percent: number | null
          discount_type: string
          expired_at: string | null
          free_items: Json | null
          grand_total: number | null
          has_invoice: boolean | null
          has_sale_order: boolean | null
          id: string
          internal_notes: string | null
          invoice_created_at: string | null
          metadata: Json | null
          negotiation_count: number | null
          negotiation_enabled: boolean
          notes: string | null
          payment_terms: string | null
          po_uploaded_at: string | null
          products: Json
          quote_number: string
          rejected_at: string | null
          sent_at: string | null
          sla_breached: boolean | null
          sla_po_review_due: string | null
          sla_response_due: string | null
          so_created_at: string | null
          source: string | null
          status: string
          subtotal: number | null
          total_revisions: number | null
          updated_at: string
          valid_until: string | null
          vat_amount: number | null
          vat_percent: number | null
          viewed_at: string | null
          warranty_terms: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          affiliate_code?: string | null
          affiliate_id?: string | null
          approved_at?: string | null
          assigned_to?: string | null
          attribution_source?: string | null
          campaign_id?: string | null
          campaign_slug?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          current_revision_id?: string | null
          current_revision_number?: number | null
          customer_address?: string | null
          customer_company?: string | null
          customer_email: string
          customer_line?: string | null
          customer_name: string
          customer_phone?: string | null
          customer_tax_id?: string | null
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          delivery_terms?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          discount_type?: string
          expired_at?: string | null
          free_items?: Json | null
          grand_total?: number | null
          has_invoice?: boolean | null
          has_sale_order?: boolean | null
          id?: string
          internal_notes?: string | null
          invoice_created_at?: string | null
          metadata?: Json | null
          negotiation_count?: number | null
          negotiation_enabled?: boolean
          notes?: string | null
          payment_terms?: string | null
          po_uploaded_at?: string | null
          products?: Json
          quote_number: string
          rejected_at?: string | null
          sent_at?: string | null
          sla_breached?: boolean | null
          sla_po_review_due?: string | null
          sla_response_due?: string | null
          so_created_at?: string | null
          source?: string | null
          status?: string
          subtotal?: number | null
          total_revisions?: number | null
          updated_at?: string
          valid_until?: string | null
          vat_amount?: number | null
          vat_percent?: number | null
          viewed_at?: string | null
          warranty_terms?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          affiliate_code?: string | null
          affiliate_id?: string | null
          approved_at?: string | null
          assigned_to?: string | null
          attribution_source?: string | null
          campaign_id?: string | null
          campaign_slug?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          current_revision_id?: string | null
          current_revision_number?: number | null
          customer_address?: string | null
          customer_company?: string | null
          customer_email?: string
          customer_line?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_tax_id?: string | null
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          delivery_terms?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          discount_type?: string
          expired_at?: string | null
          free_items?: Json | null
          grand_total?: number | null
          has_invoice?: boolean | null
          has_sale_order?: boolean | null
          id?: string
          internal_notes?: string | null
          invoice_created_at?: string | null
          metadata?: Json | null
          negotiation_count?: number | null
          negotiation_enabled?: boolean
          notes?: string | null
          payment_terms?: string | null
          po_uploaded_at?: string | null
          products?: Json
          quote_number?: string
          rejected_at?: string | null
          sent_at?: string | null
          sla_breached?: boolean | null
          sla_po_review_due?: string | null
          sla_response_due?: string | null
          so_created_at?: string | null
          source?: string | null
          status?: string
          subtotal?: number | null
          total_revisions?: number | null
          updated_at?: string
          valid_until?: string | null
          vat_amount?: number | null
          vat_percent?: number | null
          viewed_at?: string | null
          warranty_terms?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "affiliate_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_revisions: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          change_reason: string | null
          created_at: string | null
          created_by: string | null
          created_by_name: string
          created_by_role: string
          customer_message: string | null
          discount_amount: number | null
          discount_percent: number | null
          discount_type: string
          free_items: Json | null
          grand_total: number
          id: string
          internal_notes: string | null
          products: Json
          quote_id: string
          requires_approval: boolean | null
          responded_at: string | null
          revision_number: number
          revision_type: string
          sent_at: string | null
          status: string
          subtotal: number
          valid_until: string | null
          vat_amount: number | null
          vat_percent: number | null
        }
        Insert: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          change_reason?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_name?: string
          created_by_role?: string
          customer_message?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          discount_type?: string
          free_items?: Json | null
          grand_total?: number
          id?: string
          internal_notes?: string | null
          products?: Json
          quote_id: string
          requires_approval?: boolean | null
          responded_at?: string | null
          revision_number: number
          revision_type?: string
          sent_at?: string | null
          status?: string
          subtotal?: number
          valid_until?: string | null
          vat_amount?: number | null
          vat_percent?: number | null
        }
        Update: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          change_reason?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_name?: string
          created_by_role?: string
          customer_message?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          discount_type?: string
          free_items?: Json | null
          grand_total?: number
          id?: string
          internal_notes?: string | null
          products?: Json
          quote_id?: string
          requires_approval?: boolean | null
          responded_at?: string | null
          revision_number?: number
          revision_type?: string
          sent_at?: string | null
          status?: string
          subtotal?: number
          valid_until?: string | null
          vat_amount?: number | null
          vat_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_revisions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_share_access_log: {
        Row: {
          accessed_at: string
          action: string
          id: string
          ip_address: string | null
          share_link_id: string
          user_agent: string | null
        }
        Insert: {
          accessed_at?: string
          action: string
          id?: string
          ip_address?: string | null
          share_link_id: string
          user_agent?: string | null
        }
        Update: {
          accessed_at?: string
          action?: string
          id?: string
          ip_address?: string | null
          share_link_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_share_access_log_share_link_id_fkey"
            columns: ["share_link_id"]
            isOneToOne: false
            referencedRelation: "quote_share_links"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_share_links: {
        Row: {
          created_at: string
          created_by: string | null
          download_count: number
          expires_at: string
          id: string
          last_accessed_at: string | null
          note: string | null
          quote_id: string
          revoked_at: string | null
          revoked_by: string | null
          token: string
          view_count: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          download_count?: number
          expires_at: string
          id?: string
          last_accessed_at?: string | null
          note?: string | null
          quote_id: string
          revoked_at?: string | null
          revoked_by?: string | null
          token: string
          view_count?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          download_count?: number
          expires_at?: string
          id?: string
          last_accessed_at?: string | null
          note?: string | null
          quote_id?: string
          revoked_at?: string | null
          revoked_by?: string | null
          token?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_share_links_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_term_templates: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_default: boolean | null
          label: string
          sort_order: number | null
          template_type: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_default?: boolean | null
          label: string
          sort_order?: number | null
          template_type: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_default?: boolean | null
          label?: string
          sort_order?: number | null
          template_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      receipt_share_access_log: {
        Row: {
          accessed_at: string
          action: string
          id: string
          ip_address: string | null
          share_link_id: string
          user_agent: string | null
        }
        Insert: {
          accessed_at?: string
          action: string
          id?: string
          ip_address?: string | null
          share_link_id: string
          user_agent?: string | null
        }
        Update: {
          accessed_at?: string
          action?: string
          id?: string
          ip_address?: string | null
          share_link_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipt_share_access_log_share_link_id_fkey"
            columns: ["share_link_id"]
            isOneToOne: false
            referencedRelation: "receipt_share_links"
            referencedColumns: ["id"]
          },
        ]
      }
      receipt_share_links: {
        Row: {
          created_at: string
          created_by: string | null
          download_count: number
          expires_at: string
          id: string
          last_accessed_at: string | null
          receipt_id: string
          revoked_at: string | null
          revoked_by: string | null
          token: string
          view_count: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          download_count?: number
          expires_at: string
          id?: string
          last_accessed_at?: string | null
          receipt_id: string
          revoked_at?: string | null
          revoked_by?: string | null
          token: string
          view_count?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          download_count?: number
          expires_at?: string
          id?: string
          last_accessed_at?: string | null
          receipt_id?: string
          revoked_at?: string | null
          revoked_by?: string | null
          token?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "receipt_share_links_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          customer_address: string | null
          customer_company: string | null
          customer_id: string | null
          customer_name: string
          customer_tax_id: string | null
          delete_reason: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_method: string | null
          payment_record_id: string | null
          receipt_date: string
          receipt_number: string
          tax_invoice_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_company?: string | null
          customer_id?: string | null
          customer_name: string
          customer_tax_id?: string | null
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_record_id?: string | null
          receipt_date?: string
          receipt_number: string
          tax_invoice_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_company?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_tax_id?: string | null
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_record_id?: string | null
          receipt_date?: string
          receipt_number?: string
          tax_invoice_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipts_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_payment_record_id_fkey"
            columns: ["payment_record_id"]
            isOneToOne: false
            referencedRelation: "payment_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_tax_invoice_id_fkey"
            columns: ["tax_invoice_id"]
            isOneToOne: false
            referencedRelation: "tax_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      registered_products: {
        Row: {
          admin_notes: string | null
          created_at: string
          customer_company: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_notes: string | null
          customer_phone: string | null
          deleted_at: string | null
          delivery_note_id: string | null
          id: string
          invoice_id: string | null
          product_id: string | null
          product_name_snapshot: string
          product_sku_snapshot: string | null
          proof_url: string | null
          purchase_date: string | null
          registered_by: string | null
          registration_number: string
          serial_number: string
          source: string
          status: string
          updated_at: string
          void_reason: string | null
          voided_at: string | null
          voided_by: string | null
          warranty_end_date: string | null
          warranty_months: number
          warranty_start_date: string
          warranty_terms: string | null
          warranty_type: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          customer_company?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_notes?: string | null
          customer_phone?: string | null
          deleted_at?: string | null
          delivery_note_id?: string | null
          id?: string
          invoice_id?: string | null
          product_id?: string | null
          product_name_snapshot: string
          product_sku_snapshot?: string | null
          proof_url?: string | null
          purchase_date?: string | null
          registered_by?: string | null
          registration_number?: string
          serial_number: string
          source?: string
          status?: string
          updated_at?: string
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
          warranty_end_date?: string | null
          warranty_months?: number
          warranty_start_date?: string
          warranty_terms?: string | null
          warranty_type?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          customer_company?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_notes?: string | null
          customer_phone?: string | null
          deleted_at?: string | null
          delivery_note_id?: string | null
          id?: string
          invoice_id?: string | null
          product_id?: string | null
          product_name_snapshot?: string
          product_sku_snapshot?: string | null
          proof_url?: string | null
          purchase_date?: string | null
          registered_by?: string | null
          registration_number?: string
          serial_number?: string
          source?: string
          status?: string
          updated_at?: string
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
          warranty_end_date?: string | null
          warranty_months?: number
          warranty_start_date?: string
          warranty_terms?: string | null
          warranty_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "registered_products_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registered_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_order_history: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          created_at: string
          from_status: string | null
          id: string
          metadata: Json | null
          notes: string | null
          repair_order_id: string
          to_status: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          repair_order_id: string
          to_status?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          repair_order_id?: string
          to_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repair_order_history_repair_order_id_fkey"
            columns: ["repair_order_id"]
            isOneToOne: false
            referencedRelation: "repair_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_order_parts: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          part_description: string | null
          part_name: string
          part_sku: string | null
          product_id: string | null
          quantity: number
          repair_order_id: string
          sort_order: number | null
          total: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          part_description?: string | null
          part_name: string
          part_sku?: string | null
          product_id?: string | null
          quantity?: number
          repair_order_id: string
          sort_order?: number | null
          total?: number | null
          unit_price?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          part_description?: string | null
          part_name?: string
          part_sku?: string | null
          product_id?: string | null
          quantity?: number
          repair_order_id?: string
          sort_order?: number | null
          total?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "repair_order_parts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_order_parts_repair_order_id_fkey"
            columns: ["repair_order_id"]
            isOneToOne: false
            referencedRelation: "repair_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_orders: {
        Row: {
          additional_cost: number | null
          admin_notes: string | null
          approved_date: string | null
          assigned_to: string | null
          completed_date: string | null
          created_at: string
          created_by: string | null
          customer_company: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          customer_quote_message: string | null
          customer_reject_reason: string | null
          deleted_at: string | null
          delivered_date: string | null
          diagnosis: string | null
          diagnosis_date: string | null
          discount_amount: number | null
          grand_total: number | null
          id: string
          invoice_id: string | null
          is_chargeable: boolean
          issue_category: string | null
          issue_description: string
          issue_photos: string[] | null
          labor_cost: number | null
          parts_cost: number | null
          priority: string | null
          product_id: string | null
          product_name: string
          product_sku: string | null
          quoted_date: string | null
          received_date: string | null
          registered_product_id: string | null
          repair_actions: string | null
          repair_order_number: string
          repair_started_date: string | null
          reported_date: string
          root_cause: string | null
          serial_number: string | null
          status: string
          technician_id: string | null
          technician_notes: string | null
          updated_at: string | null
          vat_amount: number | null
          vat_percent: number | null
          warranty_status: string
        }
        Insert: {
          additional_cost?: number | null
          admin_notes?: string | null
          approved_date?: string | null
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string
          created_by?: string | null
          customer_company?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          customer_quote_message?: string | null
          customer_reject_reason?: string | null
          deleted_at?: string | null
          delivered_date?: string | null
          diagnosis?: string | null
          diagnosis_date?: string | null
          discount_amount?: number | null
          grand_total?: number | null
          id?: string
          invoice_id?: string | null
          is_chargeable?: boolean
          issue_category?: string | null
          issue_description: string
          issue_photos?: string[] | null
          labor_cost?: number | null
          parts_cost?: number | null
          priority?: string | null
          product_id?: string | null
          product_name: string
          product_sku?: string | null
          quoted_date?: string | null
          received_date?: string | null
          registered_product_id?: string | null
          repair_actions?: string | null
          repair_order_number?: string
          repair_started_date?: string | null
          reported_date?: string
          root_cause?: string | null
          serial_number?: string | null
          status?: string
          technician_id?: string | null
          technician_notes?: string | null
          updated_at?: string | null
          vat_amount?: number | null
          vat_percent?: number | null
          warranty_status?: string
        }
        Update: {
          additional_cost?: number | null
          admin_notes?: string | null
          approved_date?: string | null
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string
          created_by?: string | null
          customer_company?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_quote_message?: string | null
          customer_reject_reason?: string | null
          deleted_at?: string | null
          delivered_date?: string | null
          diagnosis?: string | null
          diagnosis_date?: string | null
          discount_amount?: number | null
          grand_total?: number | null
          id?: string
          invoice_id?: string | null
          is_chargeable?: boolean
          issue_category?: string | null
          issue_description?: string
          issue_photos?: string[] | null
          labor_cost?: number | null
          parts_cost?: number | null
          priority?: string | null
          product_id?: string | null
          product_name?: string
          product_sku?: string | null
          quoted_date?: string | null
          received_date?: string | null
          registered_product_id?: string | null
          repair_actions?: string | null
          repair_order_number?: string
          repair_started_date?: string | null
          reported_date?: string
          root_cause?: string | null
          serial_number?: string | null
          status?: string
          technician_id?: string | null
          technician_notes?: string | null
          updated_at?: string | null
          vat_amount?: number | null
          vat_percent?: number | null
          warranty_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_orders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_orders_registered_product_id_fkey"
            columns: ["registered_product_id"]
            isOneToOne: false
            referencedRelation: "registered_products"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_orders: {
        Row: {
          actual_delivery_date: string | null
          cancel_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          confirmed_at: string | null
          created_at: string
          created_by: string | null
          customer_notes: string | null
          customer_notified_delivered: boolean | null
          customer_notified_shipping: boolean | null
          delivered_at: string | null
          delivery_notes: string | null
          discount_type: string
          expected_delivery_date: string | null
          grand_total: number | null
          id: string
          internal_notes: string | null
          production_notes: string | null
          products: Json
          quote_id: string
          sale_person_email: string | null
          sale_person_name: string | null
          shipped_at: string | null
          shipping_address: string | null
          shipping_method: string | null
          shipping_provider: string | null
          so_number: string
          standard_lead_time_days: number | null
          status: string
          subtotal: number | null
          tracking_number: string | null
          updated_at: string
          vat_amount: number | null
        }
        Insert: {
          actual_delivery_date?: string | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_notes?: string | null
          customer_notified_delivered?: boolean | null
          customer_notified_shipping?: boolean | null
          delivered_at?: string | null
          delivery_notes?: string | null
          discount_type?: string
          expected_delivery_date?: string | null
          grand_total?: number | null
          id?: string
          internal_notes?: string | null
          production_notes?: string | null
          products?: Json
          quote_id: string
          sale_person_email?: string | null
          sale_person_name?: string | null
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_method?: string | null
          shipping_provider?: string | null
          so_number?: string
          standard_lead_time_days?: number | null
          status?: string
          subtotal?: number | null
          tracking_number?: string | null
          updated_at?: string
          vat_amount?: number | null
        }
        Update: {
          actual_delivery_date?: string | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_notes?: string | null
          customer_notified_delivered?: boolean | null
          customer_notified_shipping?: boolean | null
          delivered_at?: string | null
          delivery_notes?: string | null
          discount_type?: string
          expected_delivery_date?: string | null
          grand_total?: number | null
          id?: string
          internal_notes?: string | null
          production_notes?: string | null
          products?: Json
          quote_id?: string
          sale_person_email?: string | null
          sale_person_name?: string | null
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_method?: string | null
          shipping_provider?: string | null
          so_number?: string
          standard_lead_time_days?: number | null
          status?: string
          subtotal?: number | null
          tracking_number?: string | null
          updated_at?: string
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sale_orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_details: {
        Row: {
          created_at: string
          department: string | null
          emergency_contact: Json | null
          employee_code: string | null
          hire_date: string | null
          line_work_id: string | null
          manager_id: string | null
          notes: string | null
          position: string | null
          signature_url: string | null
          updated_at: string
          user_id: string
          work_email: string | null
          work_phone: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          emergency_contact?: Json | null
          employee_code?: string | null
          hire_date?: string | null
          line_work_id?: string | null
          manager_id?: string | null
          notes?: string | null
          position?: string | null
          signature_url?: string | null
          updated_at?: string
          user_id: string
          work_email?: string | null
          work_phone?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          emergency_contact?: Json | null
          employee_code?: string | null
          hire_date?: string | null
          line_work_id?: string | null
          manager_id?: string | null
          notes?: string | null
          position?: string | null
          signature_url?: string | null
          updated_at?: string
          user_id?: string
          work_email?: string | null
          work_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_details_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_details_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_details_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          notes: string | null
          source: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          notes?: string | null
          source?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          source?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      supplier_category_questions: {
        Row: {
          category: string
          created_at: string
          display_order: number | null
          expected_answer_hint: string | null
          id: string
          is_active: boolean | null
          question_en: string
          question_zh: string | null
        }
        Insert: {
          category: string
          created_at?: string
          display_order?: number | null
          expected_answer_hint?: string | null
          id?: string
          is_active?: boolean | null
          question_en: string
          question_zh?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number | null
          expected_answer_hint?: string | null
          id?: string
          is_active?: boolean | null
          question_en?: string
          question_zh?: string | null
        }
        Relationships: []
      }
      supplier_documents: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          description: string | null
          document_number: string | null
          document_type: string
          file_name: string | null
          file_size: number | null
          file_url: string
          id: string
          issue_date: string | null
          purchase_order_id: string | null
          supplier_id: string
          title: string
          transfer_request_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          document_number?: string | null
          document_type: string
          file_name?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          issue_date?: string | null
          purchase_order_id?: string | null
          supplier_id: string
          title: string
          transfer_request_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          document_number?: string | null
          document_type?: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          issue_date?: string | null
          purchase_order_id?: string | null
          supplier_id?: string
          title?: string
          transfer_request_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_supplier_documents_po"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_supplier_documents_transfer"
            columns: ["transfer_request_id"]
            isOneToOne: false
            referencedRelation: "international_transfer_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_payment_summary"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "supplier_documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_outreach_log: {
        Row: {
          attachments: Json | null
          body: string | null
          channel: string
          created_at: string
          direction: string
          id: string
          metadata: Json | null
          responded_at: string | null
          response_time_hours: number | null
          sent_at: string
          sent_by: string | null
          subject: string | null
          supplier_id: string
          template_id: string | null
        }
        Insert: {
          attachments?: Json | null
          body?: string | null
          channel: string
          created_at?: string
          direction: string
          id?: string
          metadata?: Json | null
          responded_at?: string | null
          response_time_hours?: number | null
          sent_at?: string
          sent_by?: string | null
          subject?: string | null
          supplier_id: string
          template_id?: string | null
        }
        Update: {
          attachments?: Json | null
          body?: string | null
          channel?: string
          created_at?: string
          direction?: string
          id?: string
          metadata?: Json | null
          responded_at?: string | null
          response_time_hours?: number | null
          sent_at?: string
          sent_by?: string | null
          subject?: string | null
          supplier_id?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_outreach_log_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_payment_summary"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "supplier_outreach_log_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_outreach_templates: {
        Row: {
          body_en: string | null
          body_zh: string | null
          category: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          language: string
          name: string
          subject_en: string | null
          subject_zh: string | null
          template_key: string
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          body_en?: string | null
          body_zh?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          language?: string
          name: string
          subject_en?: string | null
          subject_zh?: string | null
          template_key: string
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          body_en?: string | null
          body_zh?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          language?: string
          name?: string
          subject_en?: string | null
          subject_zh?: string | null
          template_key?: string
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: []
      }
      supplier_pilot_reviews: {
        Row: {
          accurate_quantity: boolean | null
          created_at: string
          customer_feedback_score: number | null
          decision: string | null
          defects_handled: boolean | null
          id: string
          notes: string | null
          on_time_delivery: boolean | null
          pilot_started_at: string | null
          purchase_order_id: string | null
          quality_consistent: boolean | null
          review_due_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          sell_through_rate: number | null
          supplier_id: string
          support_responsive: boolean | null
          updated_at: string
        }
        Insert: {
          accurate_quantity?: boolean | null
          created_at?: string
          customer_feedback_score?: number | null
          decision?: string | null
          defects_handled?: boolean | null
          id?: string
          notes?: string | null
          on_time_delivery?: boolean | null
          pilot_started_at?: string | null
          purchase_order_id?: string | null
          quality_consistent?: boolean | null
          review_due_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sell_through_rate?: number | null
          supplier_id: string
          support_responsive?: boolean | null
          updated_at?: string
        }
        Update: {
          accurate_quantity?: boolean | null
          created_at?: string
          customer_feedback_score?: number | null
          decision?: string | null
          defects_handled?: boolean | null
          id?: string
          notes?: string | null
          on_time_delivery?: boolean | null
          pilot_started_at?: string | null
          purchase_order_id?: string | null
          quality_consistent?: boolean | null
          review_due_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sell_through_rate?: number | null
          supplier_id?: string
          support_responsive?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_pilot_reviews_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_payment_summary"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "supplier_pilot_reviews_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_qualifications: {
        Row: {
          annual_revenue_range: string | null
          business_license_url: string | null
          certifications_listed: string[] | null
          created_at: string
          export_countries: string[] | null
          export_revenue_percent: number | null
          factory_photos: Json | null
          factory_type: string | null
          flagship_datasheets: Json | null
          id: string
          monthly_capacity: string | null
          moq_per_sku: string | null
          oem_capability: string | null
          production_employees: number | null
          raw_answers: string | null
          rd_employees: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          sample_policy: string | null
          sample_shipping_paid_by: string | null
          submitted_at: string | null
          supplier_id: string
          total_employees: number | null
          updated_at: string
          year_established: number | null
        }
        Insert: {
          annual_revenue_range?: string | null
          business_license_url?: string | null
          certifications_listed?: string[] | null
          created_at?: string
          export_countries?: string[] | null
          export_revenue_percent?: number | null
          factory_photos?: Json | null
          factory_type?: string | null
          flagship_datasheets?: Json | null
          id?: string
          monthly_capacity?: string | null
          moq_per_sku?: string | null
          oem_capability?: string | null
          production_employees?: number | null
          raw_answers?: string | null
          rd_employees?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sample_policy?: string | null
          sample_shipping_paid_by?: string | null
          submitted_at?: string | null
          supplier_id: string
          total_employees?: number | null
          updated_at?: string
          year_established?: number | null
        }
        Update: {
          annual_revenue_range?: string | null
          business_license_url?: string | null
          certifications_listed?: string[] | null
          created_at?: string
          export_countries?: string[] | null
          export_revenue_percent?: number | null
          factory_photos?: Json | null
          factory_type?: string | null
          flagship_datasheets?: Json | null
          id?: string
          monthly_capacity?: string | null
          moq_per_sku?: string | null
          oem_capability?: string | null
          production_employees?: number | null
          raw_answers?: string | null
          rd_employees?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sample_policy?: string | null
          sample_shipping_paid_by?: string | null
          submitted_at?: string | null
          supplier_id?: string
          total_employees?: number | null
          updated_at?: string
          year_established?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_qualifications_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: true
            referencedRelation: "supplier_payment_summary"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "supplier_qualifications_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: true
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_relationship_reviews: {
        Row: {
          conducted_at: string | null
          conducted_by: string | null
          created_at: string
          defect_rate: number | null
          id: string
          marketing_plans: string | null
          next_review_at: string | null
          on_time_rate: number | null
          period_end: string | null
          period_start: string | null
          review_type: string
          roadmap_discussed: string | null
          supplier_id: string
          thai_market_feedback: string | null
          total_orders: number | null
          total_revenue: number | null
          updated_at: string
        }
        Insert: {
          conducted_at?: string | null
          conducted_by?: string | null
          created_at?: string
          defect_rate?: number | null
          id?: string
          marketing_plans?: string | null
          next_review_at?: string | null
          on_time_rate?: number | null
          period_end?: string | null
          period_start?: string | null
          review_type: string
          roadmap_discussed?: string | null
          supplier_id: string
          thai_market_feedback?: string | null
          total_orders?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Update: {
          conducted_at?: string | null
          conducted_by?: string | null
          created_at?: string
          defect_rate?: number | null
          id?: string
          marketing_plans?: string | null
          next_review_at?: string | null
          on_time_rate?: number | null
          period_end?: string | null
          period_start?: string | null
          review_type?: string
          roadmap_discussed?: string | null
          supplier_id?: string
          thai_market_feedback?: string | null
          total_orders?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_relationship_reviews_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_payment_summary"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "supplier_relationship_reviews_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_sample_evaluations: {
        Row: {
          arrived_on_time: boolean | null
          build_quality_score: number | null
          burn_in_72h_passed: boolean | null
          created_at: string
          decision: string | null
          documentation_clear: boolean | null
          evaluated_at: string | null
          evaluated_by: string | null
          evaluator_notes: string | null
          id: string
          matches_datasheet: boolean | null
          ordered_at: string | null
          packaging_intact: boolean | null
          packaging_professional: boolean | null
          product_model: string
          purchase_order_id: string | null
          received_at: string | null
          serial_verifiable: boolean | null
          supplier_id: string
          thai_market_fit: boolean | null
          updated_at: string
          voltage_compatible: boolean | null
        }
        Insert: {
          arrived_on_time?: boolean | null
          build_quality_score?: number | null
          burn_in_72h_passed?: boolean | null
          created_at?: string
          decision?: string | null
          documentation_clear?: boolean | null
          evaluated_at?: string | null
          evaluated_by?: string | null
          evaluator_notes?: string | null
          id?: string
          matches_datasheet?: boolean | null
          ordered_at?: string | null
          packaging_intact?: boolean | null
          packaging_professional?: boolean | null
          product_model: string
          purchase_order_id?: string | null
          received_at?: string | null
          serial_verifiable?: boolean | null
          supplier_id: string
          thai_market_fit?: boolean | null
          updated_at?: string
          voltage_compatible?: boolean | null
        }
        Update: {
          arrived_on_time?: boolean | null
          build_quality_score?: number | null
          burn_in_72h_passed?: boolean | null
          created_at?: string
          decision?: string | null
          documentation_clear?: boolean | null
          evaluated_at?: string | null
          evaluated_by?: string | null
          evaluator_notes?: string | null
          id?: string
          matches_datasheet?: boolean | null
          ordered_at?: string | null
          packaging_intact?: boolean | null
          packaging_professional?: boolean | null
          product_model?: string
          purchase_order_id?: string | null
          received_at?: string | null
          serial_verifiable?: boolean | null
          supplier_id?: string
          thai_market_fit?: boolean | null
          updated_at?: string
          voltage_compatible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_sample_evaluations_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_payment_summary"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "supplier_sample_evaluations_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_scores: {
        Row: {
          average_score: number | null
          certifications: number | null
          communication: number | null
          created_at: string
          documentation: number | null
          experience: number | null
          export_experience: number | null
          id: string
          manufacturer_proof: number | null
          notes: string | null
          oem_flexibility: number | null
          response_speed: number | null
          scored_at: string | null
          scored_by: string | null
          supplier_id: string
        }
        Insert: {
          average_score?: number | null
          certifications?: number | null
          communication?: number | null
          created_at?: string
          documentation?: number | null
          experience?: number | null
          export_experience?: number | null
          id?: string
          manufacturer_proof?: number | null
          notes?: string | null
          oem_flexibility?: number | null
          response_speed?: number | null
          scored_at?: string | null
          scored_by?: string | null
          supplier_id: string
        }
        Update: {
          average_score?: number | null
          certifications?: number | null
          communication?: number | null
          created_at?: string
          documentation?: number | null
          experience?: number | null
          export_experience?: number | null
          id?: string
          manufacturer_proof?: number | null
          notes?: string | null
          oem_flexibility?: number | null
          response_speed?: number | null
          scored_at?: string | null
          scored_by?: string | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_scores_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_payment_summary"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "supplier_scores_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_video_calls: {
        Row: {
          agenda_completed: Json | null
          attendees_ent: string[] | null
          attendees_supplier: string[] | null
          category_questions_used: string | null
          conducted_at: string | null
          created_at: string
          created_by: string | null
          duration_minutes: number | null
          factory_tour_done: boolean | null
          factory_tour_notes: string | null
          id: string
          notes: string | null
          outcome: string | null
          recording_url: string | null
          red_flags: string[] | null
          scheduled_at: string | null
          supplier_id: string
          technical_qa_passed: boolean | null
          updated_at: string
        }
        Insert: {
          agenda_completed?: Json | null
          attendees_ent?: string[] | null
          attendees_supplier?: string[] | null
          category_questions_used?: string | null
          conducted_at?: string | null
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          factory_tour_done?: boolean | null
          factory_tour_notes?: string | null
          id?: string
          notes?: string | null
          outcome?: string | null
          recording_url?: string | null
          red_flags?: string[] | null
          scheduled_at?: string | null
          supplier_id: string
          technical_qa_passed?: boolean | null
          updated_at?: string
        }
        Update: {
          agenda_completed?: Json | null
          attendees_ent?: string[] | null
          attendees_supplier?: string[] | null
          category_questions_used?: string | null
          conducted_at?: string | null
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          factory_tour_done?: boolean | null
          factory_tour_notes?: string | null
          id?: string
          notes?: string | null
          outcome?: string | null
          recording_url?: string | null
          red_flags?: string[] | null
          scheduled_at?: string | null
          supplier_id?: string
          technical_qa_passed?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_video_calls_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_payment_summary"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "supplier_video_calls_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          approved_at: string | null
          approved_by: string | null
          bank_account_name: string | null
          bank_account_number: string | null
          bank_address: string | null
          bank_country: string | null
          bank_name: string | null
          business_type: string | null
          certifications: string[] | null
          city: string | null
          company_name: string
          company_name_en: string | null
          contact_name: string | null
          contact_position: string | null
          country: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          default_delivery_days: string | null
          default_payment_terms: string | null
          default_price_terms: string | null
          deleted_at: string | null
          disqualified_at: string | null
          disqualified_reason: string | null
          email: string | null
          fax: string | null
          iban: string | null
          id: string
          intermediary_bank: string | null
          intermediary_swift: string | null
          is_preferred: boolean | null
          lead_time_days: number | null
          lifecycle_stage: string
          line_id: string | null
          main_products: string[] | null
          minimum_order_amount: number | null
          mobile: string | null
          notes: string | null
          overall_score: number | null
          payment_terms: string | null
          phone: string | null
          postal_code: string | null
          product_categories: string[] | null
          qualified_at: string | null
          quality_rating: number | null
          red_flags: string[] | null
          region_cluster: string | null
          registration_number: string | null
          rejection_reason: string | null
          skype: string | null
          state_province: string | null
          status: string
          supplier_code: string | null
          swift_code: string | null
          tags: string[] | null
          updated_at: string
          updated_by: string | null
          verification_links: Json | null
          warranty_terms_free: string | null
          warranty_terms_paid: string | null
          website: string | null
          wechat_id: string | null
          whatsapp: string | null
          year_established: number | null
        }
        Insert: {
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_address?: string | null
          bank_country?: string | null
          bank_name?: string | null
          business_type?: string | null
          certifications?: string[] | null
          city?: string | null
          company_name: string
          company_name_en?: string | null
          contact_name?: string | null
          contact_position?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          default_delivery_days?: string | null
          default_payment_terms?: string | null
          default_price_terms?: string | null
          deleted_at?: string | null
          disqualified_at?: string | null
          disqualified_reason?: string | null
          email?: string | null
          fax?: string | null
          iban?: string | null
          id?: string
          intermediary_bank?: string | null
          intermediary_swift?: string | null
          is_preferred?: boolean | null
          lead_time_days?: number | null
          lifecycle_stage?: string
          line_id?: string | null
          main_products?: string[] | null
          minimum_order_amount?: number | null
          mobile?: string | null
          notes?: string | null
          overall_score?: number | null
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          product_categories?: string[] | null
          qualified_at?: string | null
          quality_rating?: number | null
          red_flags?: string[] | null
          region_cluster?: string | null
          registration_number?: string | null
          rejection_reason?: string | null
          skype?: string | null
          state_province?: string | null
          status?: string
          supplier_code?: string | null
          swift_code?: string | null
          tags?: string[] | null
          updated_at?: string
          updated_by?: string | null
          verification_links?: Json | null
          warranty_terms_free?: string | null
          warranty_terms_paid?: string | null
          website?: string | null
          wechat_id?: string | null
          whatsapp?: string | null
          year_established?: number | null
        }
        Update: {
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_address?: string | null
          bank_country?: string | null
          bank_name?: string | null
          business_type?: string | null
          certifications?: string[] | null
          city?: string | null
          company_name?: string
          company_name_en?: string | null
          contact_name?: string | null
          contact_position?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          default_delivery_days?: string | null
          default_payment_terms?: string | null
          default_price_terms?: string | null
          deleted_at?: string | null
          disqualified_at?: string | null
          disqualified_reason?: string | null
          email?: string | null
          fax?: string | null
          iban?: string | null
          id?: string
          intermediary_bank?: string | null
          intermediary_swift?: string | null
          is_preferred?: boolean | null
          lead_time_days?: number | null
          lifecycle_stage?: string
          line_id?: string | null
          main_products?: string[] | null
          minimum_order_amount?: number | null
          mobile?: string | null
          notes?: string | null
          overall_score?: number | null
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          product_categories?: string[] | null
          qualified_at?: string | null
          quality_rating?: number | null
          red_flags?: string[] | null
          region_cluster?: string | null
          registration_number?: string | null
          rejection_reason?: string | null
          skype?: string | null
          state_province?: string | null
          status?: string
          supplier_code?: string | null
          swift_code?: string | null
          tags?: string[] | null
          updated_at?: string
          updated_by?: string | null
          verification_links?: Json | null
          warranty_terms_free?: string | null
          warranty_terms_paid?: string | null
          website?: string | null
          wechat_id?: string | null
          whatsapp?: string | null
          year_established?: number | null
        }
        Relationships: []
      }
      tax_invoice_items: {
        Row: {
          created_at: string
          discount_amount: number | null
          discount_percent: number | null
          display_order: number | null
          id: string
          line_total: number
          product_description: string | null
          product_id: string | null
          product_name: string
          quantity: number
          sku: string | null
          tax_invoice_id: string
          unit: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          discount_amount?: number | null
          discount_percent?: number | null
          display_order?: number | null
          id?: string
          line_total?: number
          product_description?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          sku?: string | null
          tax_invoice_id: string
          unit?: string | null
          unit_price?: number
        }
        Update: {
          created_at?: string
          discount_amount?: number | null
          discount_percent?: number | null
          display_order?: number | null
          id?: string
          line_total?: number
          product_description?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          sku?: string | null
          tax_invoice_id?: string
          unit?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_invoice_items_tax_invoice_id_fkey"
            columns: ["tax_invoice_id"]
            isOneToOne: false
            referencedRelation: "tax_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_invoice_share_access_log: {
        Row: {
          accessed_at: string
          action: string
          id: string
          ip_address: string | null
          share_link_id: string
          user_agent: string | null
        }
        Insert: {
          accessed_at?: string
          action: string
          id?: string
          ip_address?: string | null
          share_link_id: string
          user_agent?: string | null
        }
        Update: {
          accessed_at?: string
          action?: string
          id?: string
          ip_address?: string | null
          share_link_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_invoice_share_access_log_share_link_id_fkey"
            columns: ["share_link_id"]
            isOneToOne: false
            referencedRelation: "tax_invoice_share_links"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_invoice_share_links: {
        Row: {
          created_at: string
          created_by: string | null
          download_count: number
          expires_at: string
          id: string
          last_accessed_at: string | null
          revoked_at: string | null
          revoked_by: string | null
          tax_invoice_id: string
          token: string
          view_count: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          download_count?: number
          expires_at: string
          id?: string
          last_accessed_at?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          tax_invoice_id: string
          token: string
          view_count?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          download_count?: number
          expires_at?: string
          id?: string
          last_accessed_at?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          tax_invoice_id?: string
          token?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_invoice_share_links_tax_invoice_id_fkey"
            columns: ["tax_invoice_id"]
            isOneToOne: false
            referencedRelation: "tax_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_invoices: {
        Row: {
          created_at: string
          created_by: string | null
          customer_address: string | null
          customer_branch_code: string | null
          customer_branch_name: string | null
          customer_branch_type: string | null
          customer_company: string | null
          customer_id: string | null
          customer_name: string
          customer_tax_id: string | null
          delete_reason: string | null
          deleted_at: string | null
          deleted_by: string | null
          delivery_address: string | null
          delivery_date: string | null
          delivery_method: string | null
          discount_amount: number | null
          discount_type: string
          grand_total: number
          id: string
          invoice_id: string
          notes: string | null
          payment_record_id: string | null
          sale_order_id: string | null
          status: string
          subtotal: number
          tax_invoice_date: string
          tax_invoice_number: string
          tracking_number: string | null
          updated_at: string
          vat_amount: number | null
          withholding_tax_amount: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_branch_code?: string | null
          customer_branch_name?: string | null
          customer_branch_type?: string | null
          customer_company?: string | null
          customer_id?: string | null
          customer_name: string
          customer_tax_id?: string | null
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          delivery_method?: string | null
          discount_amount?: number | null
          discount_type?: string
          grand_total?: number
          id?: string
          invoice_id: string
          notes?: string | null
          payment_record_id?: string | null
          sale_order_id?: string | null
          status?: string
          subtotal?: number
          tax_invoice_date?: string
          tax_invoice_number: string
          tracking_number?: string | null
          updated_at?: string
          vat_amount?: number | null
          withholding_tax_amount?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_branch_code?: string | null
          customer_branch_name?: string | null
          customer_branch_type?: string | null
          customer_company?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_tax_id?: string | null
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          delivery_method?: string | null
          discount_amount?: number | null
          discount_type?: string
          grand_total?: number
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_record_id?: string | null
          sale_order_id?: string | null
          status?: string
          subtotal?: number
          tax_invoice_date?: string
          tax_invoice_number?: string
          tracking_number?: string | null
          updated_at?: string
          vat_amount?: number | null
          withholding_tax_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_invoices_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_invoices_payment_record_id_fkey"
            columns: ["payment_record_id"]
            isOneToOne: false
            referencedRelation: "payment_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_invoices_sale_order_id_fkey"
            columns: ["sale_order_id"]
            isOneToOne: false
            referencedRelation: "sale_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          module: string
          notes: string | null
          permission: string
          updated_at: string
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          module: string
          notes?: string | null
          permission: string
          updated_at?: string
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          module?: string
          notes?: string | null
          permission?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          billing_address: string | null
          billing_city: string | null
          billing_country: string | null
          billing_district: string | null
          billing_postal_code: string | null
          billing_province: string | null
          company_address: string | null
          company_name: string | null
          company_phone: string | null
          company_tax_id: string | null
          contact_email: string | null
          contact_line: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_position: string | null
          created_at: string
          delivery_method: string | null
          id: string
          notes: string | null
          payment_terms: string | null
          shipping_address: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_district: string | null
          shipping_postal_code: string | null
          shipping_province: string | null
          shipping_same_as_billing: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_district?: string | null
          billing_postal_code?: string | null
          billing_province?: string | null
          company_address?: string | null
          company_name?: string | null
          company_phone?: string | null
          company_tax_id?: string | null
          contact_email?: string | null
          contact_line?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_position?: string | null
          created_at?: string
          delivery_method?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_district?: string | null
          shipping_postal_code?: string | null
          shipping_province?: string | null
          shipping_same_as_billing?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_district?: string | null
          billing_postal_code?: string | null
          billing_province?: string | null
          company_address?: string | null
          company_name?: string | null
          company_phone?: string | null
          company_tax_id?: string | null
          contact_email?: string | null
          contact_line?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_position?: string | null
          created_at?: string
          delivery_method?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_district?: string | null
          shipping_postal_code?: string | null
          shipping_province?: string | null
          shipping_same_as_billing?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          department: string | null
          email: string
          employee_code: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          line_id: string | null
          phone: string | null
          position: string | null
          preferences: Json | null
          role: string
          show_signature_on_orders: boolean | null
          show_signature_on_quotes: boolean | null
          signature_url: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          department?: string | null
          email: string
          employee_code?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          line_id?: string | null
          phone?: string | null
          position?: string | null
          preferences?: Json | null
          role?: string
          show_signature_on_orders?: boolean | null
          show_signature_on_quotes?: boolean | null
          signature_url?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          department?: string | null
          email?: string
          employee_code?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          line_id?: string | null
          phone?: string | null
          position?: string | null
          preferences?: Json | null
          role?: string
          show_signature_on_orders?: boolean | null
          show_signature_on_quotes?: boolean | null
          signature_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      customers: {
        Row: {
          avatar_url: string | null
          billing_address: string | null
          billing_city: string | null
          billing_district: string | null
          billing_postal_code: string | null
          billing_province: string | null
          company: string | null
          company_address: string | null
          company_name: string | null
          company_phone: string | null
          company_tax_id: string | null
          contact_email: string | null
          contact_line: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_position: string | null
          created_at: string | null
          delivery_method: string | null
          email: string | null
          full_name: string | null
          id: string | null
          is_active: boolean | null
          last_login: string | null
          payment_terms: string | null
          phone: string | null
          shipping_address: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      staff_members: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          department: string | null
          email: string | null
          employee_code: string | null
          full_name: string | null
          hire_date: string | null
          id: string | null
          is_active: boolean | null
          last_login: string | null
          line_work_id: string | null
          manager_id: string | null
          phone: string | null
          position: string | null
          role: string | null
          signature_url: string | null
          staff_notes: string | null
          updated_at: string | null
          work_email: string | null
          work_phone: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_details_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_details_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_details_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_payment_summary: {
        Row: {
          company_name: string | null
          last_payment_date: string | null
          pending_amount: number | null
          supplier_code: string | null
          supplier_id: string | null
          total_paid: number | null
          total_paid_thb: number | null
          total_transfers: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      affiliate_my_earnings: {
        Args: never
        Returns: {
          billable_30d: number
          billable_clicks: number
          can_request_payout: boolean
          click_rate: number
          clicks_30d: number
          lifetime_earnings: number
          min_payout: number
          paid_earnings: number
          pending_earnings: number
          rejected_clicks: number
          total_clicks: number
        }[]
      }
      affiliate_my_stats: {
        Args: never
        Returns: {
          clicks_30d: number
          converted_leads: number
          qualified_leads: number
          total_clicks: number
          total_deal_value: number
          total_leads: number
        }[]
      }
      affiliate_request_payout: { Args: never; Returns: string }
      approve_revision: {
        Args: {
          p_approver_id: string
          p_revision_id: string
          p_send_to_customer?: boolean
        }
        Returns: Json
      }
      approve_transfer_request: {
        Args: { p_transfer_id: string }
        Returns: Json
      }
      can_access_billing: { Args: { p_user_id: string }; Returns: boolean }
      can_manage_inventory: { Args: { p_user_id: string }; Returns: boolean }
      check_warranty_status: {
        Args: { p_check_date?: string; p_serial_number: string }
        Returns: Json
      }
      commit_product_migration: { Args: never; Returns: Json }
      confirm_transfer_sent: {
        Args: { p_slip_url?: string; p_transfer_id: string }
        Returns: Json
      }
      count_pending_approvals: { Args: never; Returns: number }
      create_initial_quote_revision: {
        Args: { p_quote_id: string }
        Returns: string
      }
      customer_respond_to_repair_quote: {
        Args: { p_action: string; p_reason?: string; p_repair_order_id: string }
        Returns: Json
      }
      empty_invoice_trash: { Args: never; Returns: Json }
      empty_quote_trash: { Args: never; Returns: Json }
      empty_receipt_trash: { Args: never; Returns: Json }
      empty_tax_invoice_trash: { Args: never; Returns: Json }
      expire_old_quotes: {
        Args: never
        Returns: {
          expired_count: number
        }[]
      }
      extract_doc_base_number: { Args: { doc_number: string }; Returns: string }
      generate_affiliate_code: { Args: { _full_name: string }; Returns: string }
      generate_invoice_from_repair_order: {
        Args: { p_repair_order_id: string }
        Returns: Json
      }
      generate_invoice_number: { Args: never; Returns: string }
      generate_next_base_number: { Args: never; Returns: string }
      generate_receipt_number: { Args: never; Returns: string }
      generate_tax_invoice_number: { Args: never; Returns: string }
      get_company_docs_stats: {
        Args: never
        Returns: {
          by_category: Json
          expiring_soon: number
          total_documents: number
          total_downloads: number
        }[]
      }
      get_negotiation_stats: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: Json
      }
      get_negotiation_trends: {
        Args: { p_days?: number }
        Returns: {
          date: string
          quotes_accepted: number
          quotes_created: number
          quotes_rejected: number
          total_value: number
        }[]
      }
      get_next_po_version: { Args: { p_quote_id: string }; Returns: number }
      get_next_revision_number: {
        Args: { p_quote_id: string }
        Returns: number
      }
      get_quote_negotiation_insights: {
        Args: { p_quote_id: string }
        Returns: Json
      }
      get_shared_invoice: {
        Args: { p_action?: string; p_token: string }
        Returns: Json
      }
      get_shared_quote: {
        Args: { p_action?: string; p_token: string }
        Returns: Json
      }
      get_shared_receipt: {
        Args: { p_action?: string; p_token: string }
        Returns: Json
      }
      get_shared_tax_invoice: {
        Args: { p_action?: string; p_token: string }
        Returns: Json
      }
      get_top_sales_performers: {
        Args: { p_limit?: number; p_start_date?: string }
        Returns: {
          acceptance_rate: number
          avg_discount: number
          quotes_handled: number
          sales_id: string
          sales_name: string
          total_revisions: number
          total_value: number
        }[]
      }
      get_user_audit_logs: {
        Args: { p_limit?: number; p_user_id: string }
        Returns: {
          action: string
          actor_email: string
          actor_id: string
          actor_role: string
          created_at: string
          id: string
          new_value: Json
          old_value: Json
          target_email: string
          target_user_id: string
        }[]
      }
      get_user_effective_permissions: {
        Args: { p_user_id: string }
        Returns: {
          default_permission: string
          effective_permission: string
          is_override: boolean
          module: string
          override_permission: string
        }[]
      }
      get_user_login_history: {
        Args: { p_limit?: number; p_user_id: string }
        Returns: {
          created_at: string
          failure_reason: string
          id: string
          ip_address: string
          success: boolean
          user_agent: string
        }[]
      }
      get_user_role: { Args: { _user_id: string }; Returns: string }
      has_any_role: {
        Args: { p_roles: string[]; p_user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: { p_role: string; p_user_id: string }
        Returns: boolean
      }
      is_admin_or_above: { Args: { p_user_id: string }; Returns: boolean }
      is_affiliate_owner: { Args: { _affiliate_id: string }; Returns: boolean }
      is_partner_reviewer: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { p_user_id: string }; Returns: boolean }
      log_audit_event: {
        Args: {
          p_action: string
          p_metadata?: Json
          p_new_value?: Json
          p_old_value?: Json
          p_record_id?: string
          p_table_name?: string
          p_target_user_id?: string
        }
        Returns: string
      }
      log_document_download: {
        Args: {
          p_document_id: string
          p_ip_address?: string
          p_source?: string
          p_user_agent?: string
        }
        Returns: string
      }
      log_login_event: {
        Args: {
          p_failure_reason?: string
          p_ip_address?: string
          p_success: boolean
          p_user_agent?: string
        }
        Returns: string
      }
      lookup_affiliate_by_code: {
        Args: { _code: string }
        Returns: {
          affiliate_code: string
          full_name: string
          id: string
          status: string
        }[]
      }
      next_document_number: { Args: { _doc_type: string }; Returns: string }
      notify_admins: {
        Args: {
          p_action_label?: string
          p_action_url?: string
          p_exclude_user_id?: string
          p_link_id?: string
          p_link_type?: string
          p_message: string
          p_priority?: string
          p_title: string
          p_type: string
        }
        Returns: number
      }
      notify_all_admins: {
        Args: {
          p_label?: string
          p_message: string
          p_priority?: string
          p_quote_id?: string
          p_title: string
          p_type: string
          p_url?: string
        }
        Returns: undefined
      }
      notify_user: {
        Args: {
          p_action_label?: string
          p_action_url?: string
          p_link_id?: string
          p_link_type?: string
          p_message: string
          p_metadata?: Json
          p_priority?: string
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: string
      }
      permanent_delete_invoice: {
        Args: { p_invoice_id: string }
        Returns: Json
      }
      permanent_delete_quote: { Args: { p_quote_id: string }; Returns: Json }
      permanent_delete_receipt: {
        Args: { p_receipt_id: string }
        Returns: Json
      }
      permanent_delete_tax_invoice: {
        Args: { p_tax_invoice_id: string }
        Returns: Json
      }
      reject_revision: {
        Args: { p_approver_id: string; p_reason: string; p_revision_id: string }
        Returns: Json
      }
      reject_transfer_request: {
        Args: { p_reason: string; p_transfer_id: string }
        Returns: Json
      }
      remove_user_permission: {
        Args: { p_module: string; p_user_id: string }
        Returns: boolean
      }
      restore_credit_note: { Args: { p_credit_note_id: string }; Returns: Json }
      restore_invoice: { Args: { p_invoice_id: string }; Returns: Json }
      restore_quote: { Args: { p_quote_id: string }; Returns: Json }
      restore_receipt: { Args: { p_receipt_id: string }; Returns: Json }
      restore_tax_invoice: { Args: { p_tax_invoice_id: string }; Returns: Json }
      rollback_product_migration: { Args: never; Returns: Json }
      soft_delete_credit_note: {
        Args: { p_credit_note_id: string; p_reason?: string }
        Returns: Json
      }
      soft_delete_invoice: {
        Args: { p_invoice_id: string; p_reason?: string }
        Returns: Json
      }
      soft_delete_quote: {
        Args: { p_quote_id: string; p_reason?: string }
        Returns: Json
      }
      soft_delete_receipt: {
        Args: { p_reason?: string; p_receipt_id: string }
        Returns: Json
      }
      soft_delete_registered_product: { Args: { p_id: string }; Returns: Json }
      soft_delete_tax_invoice: {
        Args: { p_reason?: string; p_tax_invoice_id: string }
        Returns: Json
      }
      sum_pending_payments: { Args: { p_invoice_id: string }; Returns: number }
      sum_verified_payments: { Args: { p_invoice_id: string }; Returns: number }
      update_quote_status: {
        Args: { p_admin_id?: string; p_new_status: string; p_quote_id: string }
        Returns: Json
      }
      upsert_user_permission: {
        Args: {
          p_module: string
          p_notes?: string
          p_permission: string
          p_user_id: string
        }
        Returns: string
      }
      validate_repair_status_transition: {
        Args: {
          p_actor_id?: string
          p_new_status: string
          p_notes?: string
          p_repair_order_id: string
        }
        Returns: Json
      }
      verify_investor_token: {
        Args: { _ref?: string; _token: string; _ua?: string }
        Returns: {
          reason: string
          recipient_company: string
          recipient_email: string
          recipient_name: string
          valid: boolean
        }[]
      }
      void_registered_product: {
        Args: { p_id: string; p_reason: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
