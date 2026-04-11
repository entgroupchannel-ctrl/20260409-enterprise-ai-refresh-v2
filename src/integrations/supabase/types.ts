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
            referencedRelation: "users"
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
          migration_keep: boolean | null
          migration_status: string | null
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
          migration_keep?: boolean | null
          migration_status?: string | null
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
          migration_keep?: boolean | null
          migration_status?: string | null
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
          delivery_terms: string | null
          discount_amount: number | null
          discount_percent: number | null
          expired_at: string | null
          free_items: Json | null
          grand_total: number | null
          has_sale_order: boolean | null
          id: string
          internal_notes: string | null
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
          delivery_terms?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          expired_at?: string | null
          free_items?: Json | null
          grand_total?: number | null
          has_sale_order?: boolean | null
          id?: string
          internal_notes?: string | null
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
          delivery_terms?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          expired_at?: string | null
          free_items?: Json | null
          grand_total?: number | null
          has_sale_order?: boolean | null
          id?: string
          internal_notes?: string | null
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
          company: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          phone: string | null
          preferences: Json | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
      count_pending_approvals: { Args: never; Returns: number }
      expire_old_quotes: {
        Args: never
        Returns: {
          expired_count: number
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
      get_user_role: { Args: { _user_id: string }; Returns: string }
      reject_revision: {
        Args: { p_approver_id: string; p_reason: string; p_revision_id: string }
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
