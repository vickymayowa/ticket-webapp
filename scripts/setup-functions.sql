-- Create function to decrement available tickets
CREATE OR REPLACE FUNCTION decrement_available_tickets(event_id UUID, quantity INT)
RETURNS VOID AS $$
BEGIN
  UPDATE events
  SET available_tickets = available_tickets - quantity
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to verify ticket
CREATE OR REPLACE FUNCTION verify_ticket(ticket_number VARCHAR)
RETURNS TABLE(valid BOOLEAN, ticket_id UUID, event_title VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (t.status = 'purchased') as valid,
    t.id,
    e.title
  FROM tickets t
  JOIN events e ON t.event_id = e.id
  WHERE t.ticket_number = ticket_number;
END;
$$ LANGUAGE plpgsql;
