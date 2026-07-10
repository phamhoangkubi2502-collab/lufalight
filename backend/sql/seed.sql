-- Seed data generated from product.html's PRODUCTS/WARRANTY objects (catalog-refreshed names/prices).
-- ⚠️ stock_qty below is a PLACEHOLDER (999) so checkout isn't blocked during testing.
-- Replace every stock_qty with real warehouse counts before going live — see "Open items" in the plan.

insert into products (sku, name, price_cents, warranty_years) values
  ('EM04',       'GlowEM04 — SleepGlow Eye Mask', 19900, 1),
  ('G15P',       'BeauMask + BeauNeck-Décolleté — ClearGlow Pro Face & Neck Set', 59900, 1),
  ('G15',        'BeauMask — ClearGlow Face Mask', 49900, 1),
  ('P40B',       'RecoverPro40B — RecoverPro Desktop Panel', 20900, 1),
  ('MINI60PRO',  'Glow60MiniPro — PainRelief Mini Pro', 33600, 1),
  ('E300',       'GlowE300 — ClinicalEdge E300', 41500, 2),
  ('C01',        'LUMENOVA PRO — HGrowCap Pro', 49900, 1),
  ('G240',       'AuraDome — AuraDome G240', 119900, 1),
  ('BK300',      'Solaris9 BK300 Executive Edition — BioShield 60-LED Standee', 139900, 2),
  ('MAX1800',    'LUFAMAX 1800 — BodyMax 1800 Full-Body Panel', 194200, 2),
  ('MAX4800',    'LUFAMAX 4800 — BodyMax 4800 Elite', 499900, 2),
  ('ESPRO3000',  'LUFAESPRO 3000 — ClinicalPro ESPRO 3000', 529900, 2),
  ('PE01',       'VitalityPro PEMF Mat — ZenField PEMF Mat', 89900, 1),
  ('MRS45',      'ProStand — ProStand MRS45 Adjustable Stand', 72500, 1),
  ('BUNDLE-RECOVERY',  'Recovery Essentials Bundle (RecoverPro40B + Glow60MiniPro)', 47900, 1),
  ('BUNDLE-GLOW',      'Glow & Restore Bundle (BeauMask+BeauNeck + GlowEM04)', 69900, 1),
  ('BUNDLE-FULLBODY',  'Full-Body Recovery Bundle (LUFAMAX 1800 + ProStand)', 239900, 2)
on conflict (sku) do update set
  name = excluded.name,
  price_cents = excluded.price_cents,
  warranty_years = excluded.warranty_years;

insert into inventory (sku, stock_qty, low_stock_threshold)
select sku, 999, 5 from products
on conflict (sku) do nothing;
