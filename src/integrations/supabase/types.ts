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
          assigned_to: string | null
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
          assigned_to?: string | null
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
          assigned_to?: string | null
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
          approved_at: string | null
          assigned_to: string | null
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
          approved_at?: string | null
          assigned_to?: string | null
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
          approved_at?: string | null
          assigned_to?: string | null
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
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
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
    }
    Functions: {
      approve_revision: {
        Args: {
          p_approver_id: string
          p_revision_id: string
          p_send_to_customer?: boolean
        }
        Returns: Json
      }
      can_access_billing: { Args: { p_user_id: string }; Returns: boolean }
      can_manage_inventory: { Args: { p_user_id: string }; Returns: boolean }
      commit_product_migration: { Args: never; Returns: Json }
      count_pending_approvals: { Args: never; Returns: number }
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
      remove_user_permission: {
        Args: { p_module: string; p_user_id: string }
        Returns: boolean
      }
      restore_invoice: { Args: { p_invoice_id: string }; Returns: Json }
      restore_quote: { Args: { p_quote_id: string }; Returns: Json }
      restore_receipt: { Args: { p_receipt_id: string }; Returns: Json }
      restore_tax_invoice: { Args: { p_tax_invoice_id: string }; Returns: Json }
      rollback_product_migration: { Args: never; Returns: Json }
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
      soft_delete_tax_invoice: {
        Args: { p_reason?: string; p_tax_invoice_id: string }
        Returns: Json
      }
      sum_pending_payments: { Args: { p_invoice_id: string }; Returns: number }
      sum_verified_payments: { Args: { p_invoice_id: string }; Returns: number }
      upsert_user_permission: {
        Args: {
          p_module: string
          p_notes?: string
          p_permission: string
          p_user_id: string
        }
        Returns: string
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
