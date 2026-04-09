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
      admin_permissions: {
        Row: {
          access_level: string
          created_at: string
          id: string
          permission_key: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_level?: string
          created_at?: string
          id?: string
          permission_key: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string
          id?: string
          permission_key?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      billing_note_items: {
        Row: {
          billing_note_id: string
          category: string | null
          created_at: string | null
          description: string | null
          discount_percent: number | null
          id: string
          line_total: number | null
          model: string
          product_id: string | null
          qty: number | null
          sort_order: number | null
          unit_price: number | null
        }
        Insert: {
          billing_note_id: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          line_total?: number | null
          model: string
          product_id?: string | null
          qty?: number | null
          sort_order?: number | null
          unit_price?: number | null
        }
        Update: {
          billing_note_id?: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          line_total?: number | null
          model?: string
          product_id?: string | null
          qty?: number | null
          sort_order?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_note_items_billing_note_id_fkey"
            columns: ["billing_note_id"]
            isOneToOne: false
            referencedRelation: "billing_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_note_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_notes: {
        Row: {
          assigned_to: string | null
          billing_date: string
          billing_number: string
          chain_number: string | null
          created_at: string
          created_by: string | null
          customer_address: string | null
          customer_company: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          customer_tax_id: string | null
          discount_amount: number | null
          due_date: string | null
          grand_total: number | null
          id: string
          notes: string | null
          order_id: string | null
          payment_terms: string | null
          po_file_url: string | null
          po_number: string | null
          quote_id: string | null
          status: string
          subtotal: number | null
          updated_at: string | null
          user_id: string | null
          vat_amount: number | null
          withholding_tax: number | null
        }
        Insert: {
          assigned_to?: string | null
          billing_date?: string
          billing_number?: string
          chain_number?: string | null
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_company?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          customer_tax_id?: string | null
          discount_amount?: number | null
          due_date?: string | null
          grand_total?: number | null
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_terms?: string | null
          po_file_url?: string | null
          po_number?: string | null
          quote_id?: string | null
          status?: string
          subtotal?: number | null
          updated_at?: string | null
          user_id?: string | null
          vat_amount?: number | null
          withholding_tax?: number | null
        }
        Update: {
          assigned_to?: string | null
          billing_date?: string
          billing_number?: string
          chain_number?: string | null
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_company?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_tax_id?: string | null
          discount_amount?: number | null
          due_date?: string | null
          grand_total?: number | null
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_terms?: string | null
          po_file_url?: string | null
          po_number?: string | null
          quote_id?: string | null
          status?: string
          subtotal?: number | null
          updated_at?: string | null
          user_id?: string | null
          vat_amount?: number | null
          withholding_tax?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_notes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_notes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      business_cards: {
        Row: {
          address: string | null
          company: string | null
          created_at: string
          email: string | null
          extracted_data: Json | null
          id: string
          image_url: string
          name: string | null
          phone: string | null
          position: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          extracted_data?: Json | null
          id?: string
          image_url: string
          name?: string | null
          phone?: string | null
          position?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          extracted_data?: Json | null
          id?: string
          image_url?: string
          name?: string | null
          phone?: string | null
          position?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_leads: {
        Row: {
          company: string | null
          conversation_summary: string | null
          created_at: string | null
          email: string | null
          id: string
          interest: string | null
          lead_score: number | null
          line_id: string | null
          messages: Json | null
          name: string | null
          phone: string | null
          session_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          conversation_summary?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          interest?: string | null
          lead_score?: number | null
          line_id?: string | null
          messages?: Json | null
          name?: string | null
          phone?: string | null
          session_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          conversation_summary?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          interest?: string | null
          lead_score?: number | null
          line_id?: string | null
          messages?: Json | null
          name?: string | null
          phone?: string | null
          session_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          bank_accounts: Json | null
          branch: string | null
          company_name_en: string | null
          company_name_th: string | null
          district: string | null
          email: string | null
          fax: string | null
          id: string
          logo_url: string | null
          mobile: string | null
          phone: string | null
          province: string | null
          quote_terms: string | null
          receiver_name: string | null
          receiver_position: string | null
          tax_id: string | null
          updated_at: string | null
          vat_percent: number | null
          website: string | null
          withholding_tax_percent: number | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          bank_accounts?: Json | null
          branch?: string | null
          company_name_en?: string | null
          company_name_th?: string | null
          district?: string | null
          email?: string | null
          fax?: string | null
          id?: string
          logo_url?: string | null
          mobile?: string | null
          phone?: string | null
          province?: string | null
          quote_terms?: string | null
          receiver_name?: string | null
          receiver_position?: string | null
          tax_id?: string | null
          updated_at?: string | null
          vat_percent?: number | null
          website?: string | null
          withholding_tax_percent?: number | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          bank_accounts?: Json | null
          branch?: string | null
          company_name_en?: string | null
          company_name_th?: string | null
          district?: string | null
          email?: string | null
          fax?: string | null
          id?: string
          logo_url?: string | null
          mobile?: string | null
          phone?: string | null
          province?: string | null
          quote_terms?: string | null
          receiver_name?: string | null
          receiver_position?: string | null
          tax_id?: string | null
          updated_at?: string | null
          vat_percent?: number | null
          website?: string | null
          withholding_tax_percent?: number | null
        }
        Relationships: []
      }
      contact_activities: {
        Row: {
          activity_type: string
          contact_id: string
          content: string | null
          created_at: string
          created_by: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          activity_type: string
          contact_id: string
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          activity_type?: string
          contact_id?: string
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          assigned_team: string | null
          assigned_to: string | null
          business_card_data: Json | null
          callback_time: string | null
          case_type: string | null
          category: string | null
          closed_at: string | null
          closed_by: string | null
          company: string | null
          converted_to_quote_id: string | null
          created_at: string
          created_by: string | null
          email: string
          first_response_at: string | null
          follow_up_date: string | null
          id: string
          lead_score: number
          line_id: string | null
          message: string
          name: string
          notes: string | null
          phone: string | null
          priority: string | null
          sla_breached: boolean | null
          sla_resolution_due: string | null
          sla_response_due: string | null
          source: string | null
          status: string
          whatsapp: string | null
        }
        Insert: {
          assigned_team?: string | null
          assigned_to?: string | null
          business_card_data?: Json | null
          callback_time?: string | null
          case_type?: string | null
          category?: string | null
          closed_at?: string | null
          closed_by?: string | null
          company?: string | null
          converted_to_quote_id?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          first_response_at?: string | null
          follow_up_date?: string | null
          id?: string
          lead_score?: number
          line_id?: string | null
          message: string
          name: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          sla_breached?: boolean | null
          sla_resolution_due?: string | null
          sla_response_due?: string | null
          source?: string | null
          status?: string
          whatsapp?: string | null
        }
        Update: {
          assigned_team?: string | null
          assigned_to?: string | null
          business_card_data?: Json | null
          callback_time?: string | null
          case_type?: string | null
          category?: string | null
          closed_at?: string | null
          closed_by?: string | null
          company?: string | null
          converted_to_quote_id?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          first_response_at?: string | null
          follow_up_date?: string | null
          id?: string
          lead_score?: number
          line_id?: string | null
          message?: string
          name?: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          sla_breached?: boolean | null
          sla_resolution_due?: string | null
          sla_response_due?: string | null
          source?: string | null
          status?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_submissions_converted_to_quote_id_fkey"
            columns: ["converted_to_quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_note_items: {
        Row: {
          created_at: string | null
          delivery_note_id: string
          description: string | null
          id: string
          model: string
          qty: number | null
          serial_numbers: string[] | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          delivery_note_id: string
          description?: string | null
          id?: string
          model: string
          qty?: number | null
          serial_numbers?: string[] | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          delivery_note_id?: string
          description?: string | null
          id?: string
          model?: string
          qty?: number | null
          serial_numbers?: string[] | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_note_items_delivery_note_id_fkey"
            columns: ["delivery_note_id"]
            isOneToOne: false
            referencedRelation: "delivery_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_notes: {
        Row: {
          assigned_to: string | null
          billing_note_id: string | null
          chain_number: string | null
          courier: string | null
          created_at: string
          created_by: string | null
          customer_address: string | null
          customer_company: string | null
          customer_name: string
          customer_phone: string | null
          delivery_address: string | null
          delivery_date: string | null
          delivery_number: string
          discount_amount: number | null
          grand_total: number | null
          id: string
          invoice_id: string | null
          notes: string | null
          order_id: string | null
          quote_id: string | null
          status: string
          subtotal: number | null
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
          vat_amount: number | null
          withholding_tax: number | null
        }
        Insert: {
          assigned_to?: string | null
          billing_note_id?: string | null
          chain_number?: string | null
          courier?: string | null
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_company?: string | null
          customer_name: string
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          delivery_number?: string
          discount_amount?: number | null
          grand_total?: number | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          order_id?: string | null
          quote_id?: string | null
          status?: string
          subtotal?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          vat_amount?: number | null
          withholding_tax?: number | null
        }
        Update: {
          assigned_to?: string | null
          billing_note_id?: string | null
          chain_number?: string | null
          courier?: string | null
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_company?: string | null
          customer_name?: string
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          delivery_number?: string
          discount_amount?: number | null
          grand_total?: number | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          order_id?: string | null
          quote_id?: string | null
          status?: string
          subtotal?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          vat_amount?: number | null
          withholding_tax?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_notes_billing_note_id_fkey"
            columns: ["billing_note_id"]
            isOneToOne: false
            referencedRelation: "billing_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_notes_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_notes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_notes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_requests: {
        Row: {
          apps_to_test: string | null
          budget_info: string | null
          created_at: string
          email: string | null
          id: string
          line_id: string | null
          name: string
          notes: string | null
          organization: string | null
          phone: string | null
          status: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          apps_to_test?: string | null
          budget_info?: string | null
          created_at?: string
          email?: string | null
          id?: string
          line_id?: string | null
          name: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          status?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          apps_to_test?: string | null
          budget_info?: string | null
          created_at?: string
          email?: string | null
          id?: string
          line_id?: string | null
          name?: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          status?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      document_access: {
        Row: {
          document_id: string
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          document_id: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          document_id?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_access_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_library"
            referencedColumns: ["id"]
          },
        ]
      }
      document_download_log: {
        Row: {
          document_id: string
          downloaded_at: string
          id: string
          ip_address: string | null
          method: string | null
          user_id: string | null
        }
        Insert: {
          document_id: string
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          method?: string | null
          user_id?: string | null
        }
        Update: {
          document_id?: string
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          method?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_download_log_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_library"
            referencedColumns: ["id"]
          },
        ]
      }
      document_library: {
        Row: {
          access_level: string
          category: string
          created_at: string
          description: string | null
          document_type: string
          download_count: number
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_public: boolean
          product_model: string | null
          share_token: string | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          access_level?: string
          category?: string
          created_at?: string
          description?: string | null
          document_type: string
          download_count?: number
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_public?: boolean
          product_model?: string | null
          share_token?: string | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          access_level?: string
          category?: string
          created_at?: string
          description?: string | null
          document_type?: string
          download_count?: number
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_public?: boolean
          product_model?: string | null
          share_token?: string | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      document_requests: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          document_id: string | null
          document_type: string
          file_url: string | null
          id: string
          notes: string | null
          product_model: string | null
          serial_number: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          document_id?: string | null
          document_type: string
          file_url?: string | null
          id?: string
          notes?: string | null
          product_model?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          document_id?: string | null
          document_type?: string
          file_url?: string | null
          id?: string
          notes?: string | null
          product_model?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_library"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_events: {
        Row: {
          channel: string | null
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          page_url: string | null
          product_category: string | null
          product_id: string | null
          product_name: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          channel?: string | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          product_category?: string | null
          product_id?: string | null
          product_name?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          channel?: string | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          product_category?: string | null
          product_id?: string | null
          product_name?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          discount_percent: number | null
          id: string
          invoice_id: string
          line_total: number | null
          model: string
          product_id: string | null
          qty: number
          sort_order: number | null
          unit_price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          id?: string
          invoice_id: string
          line_total?: number | null
          model: string
          product_id?: string | null
          qty?: number
          sort_order?: number | null
          unit_price?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          id?: string
          invoice_id?: string
          line_total?: number | null
          model?: string
          product_id?: string | null
          qty?: number
          sort_order?: number | null
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
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          assigned_to: string | null
          billing_note_id: string | null
          chain_number: string | null
          created_at: string
          created_by: string | null
          customer_address: string | null
          customer_company: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          customer_tax_id: string | null
          discount_amount: number | null
          due_date: string | null
          grand_total: number | null
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          order_id: string | null
          payment_terms: string | null
          quote_id: string | null
          status: string
          subtotal: number | null
          updated_at: string | null
          user_id: string | null
          vat_amount: number | null
          withholding_tax: number | null
        }
        Insert: {
          assigned_to?: string | null
          billing_note_id?: string | null
          chain_number?: string | null
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_company?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          customer_tax_id?: string | null
          discount_amount?: number | null
          due_date?: string | null
          grand_total?: number | null
          id?: string
          invoice_date?: string
          invoice_number: string
          notes?: string | null
          order_id?: string | null
          payment_terms?: string | null
          quote_id?: string | null
          status?: string
          subtotal?: number | null
          updated_at?: string | null
          user_id?: string | null
          vat_amount?: number | null
          withholding_tax?: number | null
        }
        Update: {
          assigned_to?: string | null
          billing_note_id?: string | null
          chain_number?: string | null
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_company?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_tax_id?: string | null
          discount_amount?: number | null
          due_date?: string | null
          grand_total?: number | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          order_id?: string | null
          payment_terms?: string | null
          quote_id?: string | null
          status?: string
          subtotal?: number | null
          updated_at?: string | null
          user_id?: string | null
          vat_amount?: number | null
          withholding_tax?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_billing_note_id_fkey"
            columns: ["billing_note_id"]
            isOneToOne: false
            referencedRelation: "billing_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      live_chat_conversations: {
        Row: {
          assigned_admin: string | null
          created_at: string
          guest_email: string | null
          guest_name: string | null
          id: string
          last_message_at: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_admin?: string | null
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          last_message_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_admin?: string | null
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          last_message_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      live_chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "live_chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          link_id: string | null
          link_type: string | null
          message: string
          metadata: Json | null
          read: boolean
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          link_id?: string | null
          link_type?: string | null
          message: string
          metadata?: Json | null
          read?: boolean
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          link_id?: string | null
          link_type?: string | null
          message?: string
          metadata?: Json | null
          read?: boolean
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_records: {
        Row: {
          amount_paid: number
          assigned_to: string | null
          bank_name: string | null
          billing_note_id: string | null
          chain_number: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          created_by: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string
          payment_method: string
          payment_number: string
          quote_id: string | null
          reference_number: string | null
          slip_url: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          amount_paid?: number
          assigned_to?: string | null
          bank_name?: string | null
          billing_note_id?: string | null
          chain_number?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_number?: string
          quote_id?: string | null
          reference_number?: string | null
          slip_url?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          amount_paid?: number
          assigned_to?: string | null
          bank_name?: string | null
          billing_note_id?: string | null
          chain_number?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_number?: string
          quote_id?: string | null
          reference_number?: string | null
          slip_url?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_billing_note_id_fkey"
            columns: ["billing_note_id"]
            isOneToOne: false
            referencedRelation: "billing_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      po_files: {
        Row: {
          document_type: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          notes: string | null
          quote_id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          document_type?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          notes?: string | null
          quote_id: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          document_type?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          notes?: string | null
          quote_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "po_files_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      po_review_log: {
        Row: {
          action: string
          comment: string | null
          created_at: string
          id: string
          metadata: Json | null
          performed_by: string | null
          quote_id: string
        }
        Insert: {
          action: string
          comment?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          quote_id: string
        }
        Update: {
          action?: string
          comment?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "po_review_log_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      product_catalog: {
        Row: {
          base_price: number
          brand: string | null
          category: string
          configurable_options: Json | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          lead_days: number | null
          min_qty: number | null
          model: string
          name_th: string | null
          notes: string | null
          specs: Json | null
          subcategory: string | null
          unit_label: string | null
          updated_at: string | null
          warranty_terms: string | null
        }
        Insert: {
          base_price?: number
          brand?: string | null
          category: string
          configurable_options?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          lead_days?: number | null
          min_qty?: number | null
          model: string
          name_th?: string | null
          notes?: string | null
          specs?: Json | null
          subcategory?: string | null
          unit_label?: string | null
          updated_at?: string | null
          warranty_terms?: string | null
        }
        Update: {
          base_price?: number
          brand?: string | null
          category?: string
          configurable_options?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          lead_days?: number | null
          min_qty?: number | null
          model?: string
          name_th?: string | null
          notes?: string | null
          specs?: Json | null
          subcategory?: string | null
          unit_label?: string | null
          updated_at?: string | null
          warranty_terms?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_manager_id: string | null
          company_address: string | null
          company_name: string | null
          company_position: string | null
          credit_terms: string | null
          customer_tier: string
          discount_percent: number | null
          full_name: string | null
          id: string
          line_id: string | null
          logo_url: string | null
          phone: string | null
          tax_id: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          account_manager_id?: string | null
          company_address?: string | null
          company_name?: string | null
          company_position?: string | null
          credit_terms?: string | null
          customer_tier?: string
          discount_percent?: number | null
          full_name?: string | null
          id: string
          line_id?: string | null
          logo_url?: string | null
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          account_manager_id?: string | null
          company_address?: string | null
          company_name?: string | null
          company_position?: string | null
          credit_terms?: string | null
          customer_tier?: string
          discount_percent?: number | null
          full_name?: string | null
          id?: string
          line_id?: string | null
          logo_url?: string | null
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      quote_line_items: {
        Row: {
          admin_notes: string | null
          category: string | null
          created_at: string
          custom_specs: Json | null
          description: string | null
          discount_percent: number | null
          id: string
          line_total: number | null
          model: string
          product_id: string | null
          qty: number
          quote_id: string
          sort_order: number | null
          unit_price: number
        }
        Insert: {
          admin_notes?: string | null
          category?: string | null
          created_at?: string
          custom_specs?: Json | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          line_total?: number | null
          model: string
          product_id?: string | null
          qty?: number
          quote_id: string
          sort_order?: number | null
          unit_price?: number
        }
        Update: {
          admin_notes?: string | null
          category?: string | null
          created_at?: string
          custom_specs?: Json | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          line_total?: number | null
          model?: string
          product_id?: string | null
          qty?: number
          quote_id?: string
          sort_order?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_line_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_line_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string
          new_value: string | null
          old_value: string | null
          proposed_value: string | null
          quote_id: string
          resolution: string | null
          responded_at: string | null
          sender_id: string | null
          sender_role: string
          sla_deadline: string | null
          sla_met: boolean | null
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type?: string
          new_value?: string | null
          old_value?: string | null
          proposed_value?: string | null
          quote_id: string
          resolution?: string | null
          responded_at?: string | null
          sender_id?: string | null
          sender_role?: string
          sla_deadline?: string | null
          sla_met?: boolean | null
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          new_value?: string | null
          old_value?: string | null
          proposed_value?: string | null
          quote_id?: string
          resolution?: string | null
          responded_at?: string | null
          sender_id?: string | null
          sender_role?: string
          sla_deadline?: string | null
          sla_met?: boolean | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_messages_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          admin_sla_hours: number | null
          approved_at: string | null
          approved_by: string | null
          assigned_to: string | null
          callback_time: string | null
          chain_number: string | null
          company: string | null
          created_at: string
          customer_address: string | null
          customer_branch: string | null
          customer_response: string | null
          customer_sla_hours: number | null
          customer_tax_id: string | null
          delivery_terms: string | null
          details: string | null
          discount_amount: number | null
          email: string
          grand_total: number | null
          id: string
          include_vat: boolean | null
          include_withholding_tax: boolean | null
          last_action_at: string | null
          last_action_by: string | null
          lead_score: number
          line_id: string | null
          name: string
          notes: string | null
          payment_terms: string | null
          pdf_url: string | null
          phone: string | null
          po_file_name: string | null
          po_file_url: string | null
          po_notes: string | null
          po_number: string | null
          po_overdue: boolean | null
          po_priority: string | null
          po_review_due: string | null
          po_review_started_at: string | null
          po_reviewed_at: string | null
          po_reviewed_by: string | null
          po_status: string | null
          po_uploaded_at: string | null
          po_uploaded_by: string | null
          products: Json
          quote_number: string | null
          status: string
          subtotal: number | null
          user_id: string | null
          valid_until: string | null
          vat_amount: number | null
          whatsapp: string | null
          withholding_tax: number | null
        }
        Insert: {
          admin_sla_hours?: number | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_to?: string | null
          callback_time?: string | null
          chain_number?: string | null
          company?: string | null
          created_at?: string
          customer_address?: string | null
          customer_branch?: string | null
          customer_response?: string | null
          customer_sla_hours?: number | null
          customer_tax_id?: string | null
          delivery_terms?: string | null
          details?: string | null
          discount_amount?: number | null
          email: string
          grand_total?: number | null
          id?: string
          include_vat?: boolean | null
          include_withholding_tax?: boolean | null
          last_action_at?: string | null
          last_action_by?: string | null
          lead_score?: number
          line_id?: string | null
          name: string
          notes?: string | null
          payment_terms?: string | null
          pdf_url?: string | null
          phone?: string | null
          po_file_name?: string | null
          po_file_url?: string | null
          po_notes?: string | null
          po_number?: string | null
          po_overdue?: boolean | null
          po_priority?: string | null
          po_review_due?: string | null
          po_review_started_at?: string | null
          po_reviewed_at?: string | null
          po_reviewed_by?: string | null
          po_status?: string | null
          po_uploaded_at?: string | null
          po_uploaded_by?: string | null
          products?: Json
          quote_number?: string | null
          status?: string
          subtotal?: number | null
          user_id?: string | null
          valid_until?: string | null
          vat_amount?: number | null
          whatsapp?: string | null
          withholding_tax?: number | null
        }
        Update: {
          admin_sla_hours?: number | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_to?: string | null
          callback_time?: string | null
          chain_number?: string | null
          company?: string | null
          created_at?: string
          customer_address?: string | null
          customer_branch?: string | null
          customer_response?: string | null
          customer_sla_hours?: number | null
          customer_tax_id?: string | null
          delivery_terms?: string | null
          details?: string | null
          discount_amount?: number | null
          email?: string
          grand_total?: number | null
          id?: string
          include_vat?: boolean | null
          include_withholding_tax?: boolean | null
          last_action_at?: string | null
          last_action_by?: string | null
          lead_score?: number
          line_id?: string | null
          name?: string
          notes?: string | null
          payment_terms?: string | null
          pdf_url?: string | null
          phone?: string | null
          po_file_name?: string | null
          po_file_url?: string | null
          po_notes?: string | null
          po_number?: string | null
          po_overdue?: boolean | null
          po_priority?: string | null
          po_review_due?: string | null
          po_review_started_at?: string | null
          po_reviewed_at?: string | null
          po_reviewed_by?: string | null
          po_status?: string | null
          po_uploaded_at?: string | null
          po_uploaded_by?: string | null
          products?: Json
          quote_number?: string | null
          status?: string
          subtotal?: number | null
          user_id?: string | null
          valid_until?: string | null
          vat_amount?: number | null
          whatsapp?: string | null
          withholding_tax?: number | null
        }
        Relationships: []
      }
      receipts: {
        Row: {
          amount_paid: number
          billing_note_id: string | null
          chain_number: string | null
          created_at: string
          created_by: string | null
          customer_company: string | null
          customer_name: string
          id: string
          invoice_id: string | null
          notes: string | null
          order_id: string | null
          payment_date: string
          payment_method: string | null
          payment_record_id: string | null
          quote_id: string | null
          receipt_number: string
          receipt_type: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number
          billing_note_id?: string | null
          chain_number?: string | null
          created_at?: string
          created_by?: string | null
          customer_company?: string | null
          customer_name: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          order_id?: string | null
          payment_date?: string
          payment_method?: string | null
          payment_record_id?: string | null
          quote_id?: string | null
          receipt_number: string
          receipt_type?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number
          billing_note_id?: string | null
          chain_number?: string | null
          created_at?: string
          created_by?: string | null
          customer_company?: string | null
          customer_name?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          order_id?: string | null
          payment_date?: string
          payment_method?: string | null
          payment_record_id?: string | null
          quote_id?: string | null
          receipt_number?: string
          receipt_type?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_billing_note_id_fkey"
            columns: ["billing_note_id"]
            isOneToOne: false
            referencedRelation: "billing_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
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
            foreignKeyName: "receipts_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_assignment_config: {
        Row: {
          id: string
          last_assigned_user_id: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          last_assigned_user_id?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          last_assigned_user_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sales_order_items: {
        Row: {
          admin_notes: string | null
          category: string | null
          description: string | null
          discount_percent: number | null
          id: string
          line_total: number | null
          model: string
          name_th: string | null
          order_id: string
          product_id: string | null
          qty: number | null
          sort_order: number | null
          specs: Json | null
          unit_label: string | null
          unit_price: number | null
          warranty_terms: string | null
        }
        Insert: {
          admin_notes?: string | null
          category?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          line_total?: number | null
          model: string
          name_th?: string | null
          order_id: string
          product_id?: string | null
          qty?: number | null
          sort_order?: number | null
          specs?: Json | null
          unit_label?: string | null
          unit_price?: number | null
          warranty_terms?: string | null
        }
        Update: {
          admin_notes?: string | null
          category?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          line_total?: number | null
          model?: string
          name_th?: string | null
          order_id?: string
          product_id?: string | null
          qty?: number | null
          sort_order?: number | null
          specs?: Json | null
          unit_label?: string | null
          unit_price?: number | null
          warranty_terms?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_orders: {
        Row: {
          admin_notes: string | null
          assigned_to: string | null
          chain_number: string | null
          completed_at: string | null
          created_at: string
          customer_address: string | null
          customer_company: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          customer_tax_id: string | null
          delivered_at: string | null
          delivery_terms: string | null
          discount_amount: number | null
          grand_total: number | null
          id: string
          internal_notes: string | null
          net_payable: number | null
          order_number: string
          payment_terms: string | null
          po_file_name: string | null
          po_file_url: string | null
          po_number: string | null
          quote_id: string
          shipped_at: string | null
          shipping_provider: string | null
          status: string
          subtotal: number | null
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
          vat_amount: number | null
          warranty_terms: string | null
          withholding_tax: number | null
        }
        Insert: {
          admin_notes?: string | null
          assigned_to?: string | null
          chain_number?: string | null
          completed_at?: string | null
          created_at?: string
          customer_address?: string | null
          customer_company?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          customer_tax_id?: string | null
          delivered_at?: string | null
          delivery_terms?: string | null
          discount_amount?: number | null
          grand_total?: number | null
          id?: string
          internal_notes?: string | null
          net_payable?: number | null
          order_number: string
          payment_terms?: string | null
          po_file_name?: string | null
          po_file_url?: string | null
          po_number?: string | null
          quote_id: string
          shipped_at?: string | null
          shipping_provider?: string | null
          status?: string
          subtotal?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          vat_amount?: number | null
          warranty_terms?: string | null
          withholding_tax?: number | null
        }
        Update: {
          admin_notes?: string | null
          assigned_to?: string | null
          chain_number?: string | null
          completed_at?: string | null
          created_at?: string
          customer_address?: string | null
          customer_company?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_tax_id?: string | null
          delivered_at?: string | null
          delivery_terms?: string | null
          discount_amount?: number | null
          grand_total?: number | null
          id?: string
          internal_notes?: string | null
          net_payable?: number | null
          order_number?: string
          payment_terms?: string | null
          po_file_name?: string | null
          po_file_url?: string | null
          po_number?: string | null
          quote_id?: string
          shipped_at?: string | null
          shipping_provider?: string | null
          status?: string
          subtotal?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          vat_amount?: number | null
          warranty_terms?: string | null
          withholding_tax?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      sla_config: {
        Row: {
          active: boolean | null
          case_type: string
          created_at: string
          id: string
          priority: string
          resolution_hours: number
          response_minutes: number
        }
        Insert: {
          active?: boolean | null
          case_type: string
          created_at?: string
          id?: string
          priority: string
          resolution_hours: number
          response_minutes: number
        }
        Update: {
          active?: boolean | null
          case_type?: string
          created_at?: string
          id?: string
          priority?: string
          resolution_hours?: number
          response_minutes?: number
        }
        Relationships: []
      }
      software_inquiries: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string
          current_problems: string | null
          email: string
          id: string
          lead_score: number
          line_id: string | null
          name: string
          notes: string | null
          phone: string | null
          requirements: string | null
          service_type: string
          status: string
          timeline: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          current_problems?: string | null
          email: string
          id?: string
          lead_score?: number
          line_id?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          requirements?: string | null
          service_type?: string
          status?: string
          timeline?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          current_problems?: string | null
          email?: string
          id?: string
          lead_score?: number
          line_id?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          requirements?: string | null
          service_type?: string
          status?: string
          timeline?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
        }
        Relationships: []
      }
      tax_invoices: {
        Row: {
          chain_number: string | null
          created_at: string
          created_by: string | null
          customer_address: string | null
          customer_company: string | null
          customer_name: string
          customer_tax_id: string | null
          grand_total: number | null
          id: string
          invoice_id: string | null
          issue_date: string
          notes: string | null
          order_id: string | null
          quote_id: string | null
          status: string
          subtotal: number | null
          tax_invoice_number: string
          updated_at: string | null
          vat_amount: number | null
        }
        Insert: {
          chain_number?: string | null
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_company?: string | null
          customer_name: string
          customer_tax_id?: string | null
          grand_total?: number | null
          id?: string
          invoice_id?: string | null
          issue_date?: string
          notes?: string | null
          order_id?: string | null
          quote_id?: string | null
          status?: string
          subtotal?: number | null
          tax_invoice_number: string
          updated_at?: string | null
          vat_amount?: number | null
        }
        Update: {
          chain_number?: string | null
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_company?: string | null
          customer_name?: string
          customer_tax_id?: string | null
          grand_total?: number | null
          id?: string
          invoice_id?: string | null
          issue_date?: string
          notes?: string | null
          order_id?: string | null
          quote_id?: string | null
          status?: string
          subtotal?: number | null
          tax_invoice_number?: string
          updated_at?: string | null
          vat_amount?: number | null
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
            foreignKeyName: "tax_invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      engagement_lead_scores: {
        Row: {
          categories: string[] | null
          first_activity: string | null
          last_activity: string | null
          session_id: string | null
          total_events: number | null
          total_score: number | null
          unique_products: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_po_review_due: {
        Args: { _priority?: string; _start?: string }
        Returns: string
      }
      calculate_sla_dues: {
        Args: { _case_type: string; _priority: string; _start_time?: string }
        Returns: {
          resolution_due: string
          response_due: string
        }[]
      }
      can_download_document: {
        Args: { _document_id: string; _user_id: string }
        Returns: boolean
      }
      count_pending_negotiations: { Args: never; Returns: number }
      detect_po_sla_breaches: {
        Args: never
        Returns: {
          assigned_to: string
          customer_name: string
          hours_overdue: number
          quote_id: string
          quote_number: string
        }[]
      }
      detect_sla_breaches: {
        Args: never
        Returns: {
          assigned_to: string
          case_type: string
          contact_id: string
          customer_name: string
          minutes_overdue: number
          priority: string
        }[]
      }
      format_doc_number: {
        Args: { chain: string; prefix: string }
        Returns: string
      }
      generate_chain_number: { Args: never; Returns: string }
      generate_doc_share_token: {
        Args: { _document_id: string }
        Returns: string
      }
      get_admin_users: {
        Args: never
        Returns: {
          email: string
          role: string
          role_created_at: string
          user_created_at: string
          user_id: string
        }[]
      }
      get_internal_staff: {
        Args: never
        Returns: {
          email: string
          full_name: string
          roles: string[]
          user_id: string
        }[]
      }
      get_monthly_revenue: {
        Args: { _year?: number }
        Returns: {
          month_name: string
          month_num: number
          order_count: number
          total_revenue: number
        }[]
      }
      get_next_sales_person: { Args: never; Returns: string }
      get_permission: {
        Args: { _permission_key: string; _user_id: string }
        Returns: string
      }
      get_po_inbox_stats: {
        Args: never
        Returns: {
          approved: number
          overdue: number
          pending_clarification: number
          pending_review: number
          rejected: number
          total: number
          under_review: number
          urgent: number
        }[]
      }
      get_quarterly_revenue: {
        Args: { _year?: number }
        Returns: {
          order_count: number
          quarter_label: string
          quarter_num: number
          total_revenue: number
        }[]
      }
      get_sales_dashboard: {
        Args: { _year?: number }
        Returns: {
          completed_count: number
          confirmed_count: number
          delivered_count: number
          processing_count: number
          sale_email: string
          sale_name: string
          sale_user_id: string
          shipped_count: number
          total_orders: number
          total_revenue: number
        }[]
      }
      get_sales_team: {
        Args: never
        Returns: {
          email: string
          full_name: string
          role: string
          user_id: string
        }[]
      }
      get_unread_notification_count: { Args: never; Returns: number }
      get_weekly_revenue: {
        Args: { _week_offset?: number }
        Returns: {
          day_name: string
          day_of_week: number
          order_count: number
          total_revenue: number
        }[]
      }
      get_yearly_revenue: {
        Args: { _years_back?: number }
        Returns: {
          order_count: number
          total_revenue: number
          year_label: string
          year_num: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      lookup_user_by_email: {
        Args: { _email: string }
        Returns: {
          created_at: string
          email: string
          user_id: string
        }[]
      }
      mark_notifications_read: { Args: { _ids?: string[] }; Returns: number }
      mark_po_viewed: { Args: { _quote_id: string }; Returns: undefined }
      reassign_quote: {
        Args: { _new_admin_id: string; _quote_id: string }
        Returns: undefined
      }
      remove_admin_user: { Args: { _user_id: string }; Returns: boolean }
      send_followup_reminders: { Args: never; Returns: number }
      send_quotation: {
        Args: { p_admin_id: string; p_pdf_url: string; p_quote_id: string }
        Returns: undefined
      }
      update_quote_status: {
        Args: { p_admin_id?: string; p_new_status: string; p_quote_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "moderator"
        | "user"
        | "sales"
        | "service"
        | "support"
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
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "moderator",
        "user",
        "sales",
        "service",
        "support",
      ],
    },
  },
} as const
