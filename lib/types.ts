// Shared types for the application

export interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  start_date: string;
  end_date: string;
  location: string;
  total_tickets: number;
  available_tickets: number;
  price: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  is_admin: boolean;
  role: 'admin' | 'organizer' | 'user';
  paystack_subaccount_code: string | null;
  paystack_subaccount_id: string | null;
  paystack_bank_account: string | null;
  paystack_account_name: string | null;
  virtual_account_created_at: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  user_id: string;
  ticket_number: string;
  qr_code: string | null;
  quantity: number;
  total_price: number;
  status: 'purchased' | 'redeemed';
  purchase_date: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  event_id: string;
  organizer_id: string;
  amount: number;
  quantity: number;
  commission_amount: number | null;
  organizer_amount: number | null;
  reference: string | null;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface EventWithTicketCount extends Event {
  sold_tickets?: number;
}
