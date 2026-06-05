// HubSpot Custom Fields Catalog (prototype)
// Mirror of ROI-Dashboard-CustomFields-Catalog.md
//
// availability: how a field actually reaches HubSpot today
//   'exposed'       - already written by the current production sync (8 fields)
//   'synced_today'  - returned by current sync queries; just not written as structured fields yet. Universal (all customers).
//   'needs_query'   - data exists but reaching it requires adding a query call (INDIRECT_MEASURES, LocationDetailsReport, etc.)
//   'pa_customers'  - ships at the same time as synced_today, but populates ONLY for Performance Analytics customers
//                     (those who have connected HubSpot via Integration Hub with deals scope, which fills AnalyticReport rows)
//
// defaultVisible mirrors the 8 currently-exposed fields.

const FIELDS = [
  // -------- Identity (pinned) --------
  { key: 'g2_org_name', label: 'Company Name', type: 'string', section: 'Identity', sectionNumber: 0, availability: 'exposed', defaultVisible: true, formatter: 'company', pinned: true },
  { key: 'g2_org_domain', label: 'Domain', type: 'string', section: 'Identity', sectionNumber: 0, availability: 'exposed', defaultVisible: true, formatter: 'string', pinned: true },

  // -------- Section 1: Currently exposed (the 8) --------
  { key: 'g2_buyer_intent_details', label: 'Buyer Intent Details (prose)', type: 'string', section: 'Currently exposed', sectionNumber: 1, availability: 'exposed', defaultVisible: true, formatter: 'blob' },
  { key: 'g2_buyer_intent_related_products_details', label: 'Related Products Details (prose)', type: 'string', section: 'Currently exposed', sectionNumber: 1, availability: 'exposed', defaultVisible: true, formatter: 'blob' },
  { key: 'g2_buyer_intent_activity_level', label: 'Activity Level', type: 'enum', section: 'Currently exposed', sectionNumber: 1, availability: 'exposed', defaultVisible: true, formatter: 'activity_badge' },
  { key: 'g2_buyer_intent_buying_stage', label: 'Buying Stage', type: 'enum', section: 'Currently exposed', sectionNumber: 1, availability: 'exposed', defaultVisible: true, formatter: 'stage_badge' },
  { key: 'g2_product_name', label: 'Product Name(s)', type: 'string', section: 'Currently exposed', sectionNumber: 1, availability: 'exposed', defaultVisible: true, formatter: 'string' },
  { key: 'g2_buyer_intent_industry', label: 'Industry', type: 'enum', section: 'Currently exposed', sectionNumber: 1, availability: 'exposed', defaultVisible: true, formatter: 'string' },
  { key: 'g2_buyer_intent_g2_signals_page', label: 'G2 Signals Page', type: 'url', section: 'Currently exposed', sectionNumber: 1, availability: 'exposed', defaultVisible: true, formatter: 'url' },
  { key: 'g2_buyer_intent_related_products', label: 'Related Products', type: 'string', section: 'Currently exposed', sectionNumber: 1, availability: 'exposed', defaultVisible: true, formatter: 'string' },

  // -------- Section 2: Attribution & recency --------
  { key: 'g2_first_seen_date', label: 'First Seen on G2', type: 'date', section: 'Attribution & recency', sectionNumber: 2, availability: 'needs_query', defaultVisible: false, formatter: 'date' },
  { key: 'g2_last_seen_date', label: 'Last Seen on G2', type: 'date', section: 'Attribution & recency', sectionNumber: 2, availability: 'synced_today', defaultVisible: false, formatter: 'date' },
  { key: 'g2_days_since_last_signal', label: 'Days Since Last Signal', type: 'number', section: 'Attribution & recency', sectionNumber: 2, availability: 'synced_today', defaultVisible: false, formatter: 'number' },
  { key: 'g2_intent_score_numeric', label: 'Intent Score (numeric)', type: 'float', section: 'Attribution & recency', sectionNumber: 2, availability: 'synced_today', defaultVisible: false, formatter: 'score' },
  { key: 'g2_last_synced_at', label: 'Last Synced At', type: 'datetime', section: 'Attribution & recency', sectionNumber: 2, availability: 'synced_today', defaultVisible: false, formatter: 'datetime' },

  // -------- Section 3: Pageviews --------
  { key: 'g2_total_pageviews', label: 'Total Pageviews', type: 'number', section: 'Pageviews', sectionNumber: 3, availability: 'synced_today', defaultVisible: false, formatter: 'number' },
  { key: 'g2_product_profile_pageviews', label: 'Product Profile Pageviews', type: 'number', section: 'Pageviews', sectionNumber: 3, availability: 'synced_today', defaultVisible: false, formatter: 'number' },
  { key: 'g2_pricing_pageviews', label: 'Pricing Pageviews', type: 'number', section: 'Pageviews', sectionNumber: 3, availability: 'synced_today', defaultVisible: false, formatter: 'number' },
  { key: 'g2_comparison_pageviews', label: 'Comparison Pageviews', type: 'number', section: 'Pageviews', sectionNumber: 3, availability: 'synced_today', defaultVisible: false, formatter: 'number' },
  { key: 'g2_category_pageviews', label: 'Category Pageviews', type: 'number', section: 'Pageviews', sectionNumber: 3, availability: 'needs_query', defaultVisible: false, formatter: 'number' },
  { key: 'g2_competitor_pageviews', label: 'Competitor Pageviews', type: 'number', section: 'Pageviews', sectionNumber: 3, availability: 'needs_query', defaultVisible: false, formatter: 'number' },
  { key: 'g2_sponsored_content_pageviews', label: 'Sponsored Content Pageviews', type: 'number', section: 'Pageviews', sectionNumber: 3, availability: 'needs_query', defaultVisible: false, formatter: 'number' },
  { key: 'g2_alternatives_pageviews', label: 'Alternatives Pageviews', type: 'number', section: 'Pageviews', sectionNumber: 3, availability: 'needs_query', defaultVisible: false, formatter: 'number' },
  { key: 'g2_reference_pageviews', label: 'Reference Pageviews', type: 'number', section: 'Pageviews', sectionNumber: 3, availability: 'needs_query', defaultVisible: false, formatter: 'number' },
  { key: 'g2_licensed_content_pageviews', label: 'Licensed Content Pageviews', type: 'number', section: 'Pageviews', sectionNumber: 3, availability: 'needs_query', defaultVisible: false, formatter: 'number' },
  { key: 'g2_total_visitors', label: 'Total Visitors', type: 'number', section: 'Pageviews', sectionNumber: 3, availability: 'needs_query', defaultVisible: false, formatter: 'number' },

  // -------- Section 4: Competitive --------
  // First three are synced today via related_products_report. Gated on `buyer_intent_competitive` component being enabled for the SELLER's product (internal G2 flag), NOT on customer deal sync.
  { key: 'g2_competitors_viewed', label: 'Competitors Viewed', type: 'list', section: 'Competitive', sectionNumber: 4, availability: 'synced_today', defaultVisible: false, formatter: 'chips' },
  { key: 'g2_top_competitor_compared', label: 'Top Competitor Compared', type: 'string', section: 'Competitive', sectionNumber: 4, availability: 'synced_today', defaultVisible: false, formatter: 'string' },
  { key: 'g2_competitor_relative_attention', label: 'Competitor Relative Attention', type: 'json', section: 'Competitive', sectionNumber: 4, availability: 'synced_today', defaultVisible: false, formatter: 'json' },
  { key: 'g2_compared_to_us_count', label: 'Compared-to-Us Count', type: 'number', section: 'Competitive', sectionNumber: 4, availability: 'needs_query', defaultVisible: false, formatter: 'number' },
  { key: 'g2_competitor_seller_page_views', label: 'Competitor Seller Page Views', type: 'number', section: 'Competitive', sectionNumber: 4, availability: 'needs_query', defaultVisible: false, formatter: 'number' },

  // -------- Section 5: Firmographic --------
  { key: 'g2_org_country', label: 'Country', type: 'string', section: 'Firmographic', sectionNumber: 5, availability: 'synced_today', defaultVisible: false, formatter: 'string' },
  { key: 'g2_org_state', label: 'State / Region', type: 'string', section: 'Firmographic', sectionNumber: 5, availability: 'synced_today', defaultVisible: false, formatter: 'string' },
  { key: 'g2_org_employees', label: 'Employees', type: 'string', section: 'Firmographic', sectionNumber: 5, availability: 'synced_today', defaultVisible: false, formatter: 'string' },
  { key: 'g2_sub_industry', label: 'Sub-Industry (raw)', type: 'enum', section: 'Firmographic', sectionNumber: 5, availability: 'synced_today', defaultVisible: false, formatter: 'string' },
  { key: 'g2_org_name_raw', label: 'Org Name (raw)', type: 'string', section: 'Firmographic', sectionNumber: 5, availability: 'synced_today', defaultVisible: false, formatter: 'string' },
  { key: 'g2_org_domain_raw', label: 'Org Domain (raw)', type: 'string', section: 'Firmographic', sectionNumber: 5, availability: 'synced_today', defaultVisible: false, formatter: 'string' },
  { key: 'g2_org_id', label: 'G2 Org ID', type: 'string', section: 'Firmographic', sectionNumber: 5, availability: 'synced_today', defaultVisible: false, formatter: 'string' },

  // -------- Section 6: Visitor geographic detail --------
  { key: 'g2_visitor_countries', label: 'Visitor Countries', type: 'list', section: 'Visitor geo', sectionNumber: 6, availability: 'needs_query', defaultVisible: false, formatter: 'chips' },
  { key: 'g2_visitor_regions', label: 'Visitor Regions', type: 'list', section: 'Visitor geo', sectionNumber: 6, availability: 'needs_query', defaultVisible: false, formatter: 'chips' },
  { key: 'g2_visitor_count_by_country', label: 'Visitor Count by Country', type: 'json', section: 'Visitor geo', sectionNumber: 6, availability: 'needs_query', defaultVisible: false, formatter: 'json' },

  // -------- Section 7: Deal-influence flags --------
  { key: 'g2_deal_sourced_by_g2', label: 'Deal Sourced by G2', type: 'boolean', section: 'Deal influence', sectionNumber: 7, availability: 'pa_customers', defaultVisible: false, formatter: 'boolean' },
  { key: 'g2_deal_created_from_g2', label: 'Deal Created from G2', type: 'boolean', section: 'Deal influence', sectionNumber: 7, availability: 'pa_customers', defaultVisible: false, formatter: 'boolean' },
  { key: 'g2_deal_influencing_g2', label: 'Deal Influenced by G2', type: 'boolean', section: 'Deal influence', sectionNumber: 7, availability: 'pa_customers', defaultVisible: false, formatter: 'boolean' },
  { key: 'g2_deal_directly_influenced', label: 'Deal Directly Influenced', type: 'boolean', section: 'Deal influence', sectionNumber: 7, availability: 'pa_customers', defaultVisible: false, formatter: 'boolean' },
  { key: 'g2_deal_won_with_g2_engagement', label: 'Deal Won with G2 Engagement', type: 'boolean', section: 'Deal influence', sectionNumber: 7, availability: 'pa_customers', defaultVisible: false, formatter: 'boolean' },
  { key: 'g2_deal_lost_with_g2_engagement', label: 'Deal Lost with G2 Engagement', type: 'boolean', section: 'Deal influence', sectionNumber: 7, availability: 'pa_customers', defaultVisible: false, formatter: 'boolean' },
  { key: 'g2_deal_days_to_close', label: 'Avg Days to Close (G2-influenced)', type: 'number', section: 'Deal influence', sectionNumber: 7, availability: 'pa_customers', defaultVisible: false, formatter: 'number' },
  { key: 'g2_deal_buyer_intent_exists', label: 'Any G2 Buyer Intent', type: 'boolean', section: 'Deal influence', sectionNumber: 7, availability: 'pa_customers', defaultVisible: false, formatter: 'boolean' },

  // -------- Section 8: Signal-event breakdown --------
  { key: 'g2_signals_sent_count', label: 'Signals Sent Count', type: 'number', section: 'Signal events', sectionNumber: 8, availability: 'pa_customers', defaultVisible: false, formatter: 'number' },
  { key: 'g2_signal_types_sent', label: 'Signal Types Sent', type: 'list', section: 'Signal events', sectionNumber: 8, availability: 'pa_customers', defaultVisible: false, formatter: 'chips' },
  { key: 'g2_signals_first_sent_at', label: 'Signals First Sent At', type: 'date', section: 'Signal events', sectionNumber: 8, availability: 'pa_customers', defaultVisible: false, formatter: 'date' },
  { key: 'g2_signal_type_counts', label: 'Signal Type Counts', type: 'json', section: 'Signal events', sectionNumber: 8, availability: 'pa_customers', defaultVisible: false, formatter: 'json' },

  // -------- Section 9: Cross-integration parity --------
  { key: 'g2_market_score', label: 'Market Score (Pipedrive parity)', type: 'float', section: 'Cross-integration parity', sectionNumber: 9, availability: 'synced_today', defaultVisible: false, formatter: 'score' },
  { key: 'g2_last_seen_at_parity', label: 'Last Seen At (Pipedrive parity)', type: 'datetime', section: 'Cross-integration parity', sectionNumber: 9, availability: 'synced_today', defaultVisible: false, formatter: 'datetime' },
  // Per-interaction Gong fields are derivable from buyer-intent interaction queries (most-common visitor country, most recent visit URL, etc.); they don't depend on deal sync.
  { key: 'g2_interaction_visit_url', label: 'Interaction Visit URL (Gong parity)', type: 'url', section: 'Cross-integration parity', sectionNumber: 9, availability: 'needs_query', defaultVisible: false, formatter: 'url' },
  { key: 'g2_visitor_country', label: 'Visitor Country (Gong parity)', type: 'string', section: 'Cross-integration parity', sectionNumber: 9, availability: 'needs_query', defaultVisible: false, formatter: 'string' },
  { key: 'g2_visitor_region', label: 'Visitor Region (Gong parity)', type: 'string', section: 'Cross-integration parity', sectionNumber: 9, availability: 'needs_query', defaultVisible: false, formatter: 'string' },
  { key: 'g2_visitor_count', label: 'Visitor Count (Pipedrive parity)', type: 'number', section: 'Cross-integration parity', sectionNumber: 9, availability: 'needs_query', defaultVisible: false, formatter: 'number' },
  { key: 'g2_interaction_title', label: 'Interaction Title (Outreach/Gong parity)', type: 'string', section: 'Cross-integration parity', sectionNumber: 9, availability: 'needs_query', defaultVisible: false, formatter: 'string' },

  // -------- Section 10: Account-level aggregations --------
  { key: 'g2_total_deals_influenced', label: 'Total Deals Influenced', type: 'number', section: 'Aggregations', sectionNumber: 10, availability: 'pa_customers', defaultVisible: false, formatter: 'number' },
  { key: 'g2_total_deals_won_with_g2', label: 'Total Deals Won with G2', type: 'number', section: 'Aggregations', sectionNumber: 10, availability: 'pa_customers', defaultVisible: false, formatter: 'number' },
  { key: 'g2_total_amount_influenced_usd', label: 'Total $ Influenced (USD)', type: 'number', section: 'Aggregations', sectionNumber: 10, availability: 'pa_customers', defaultVisible: false, formatter: 'currency' },
  { key: 'g2_total_amount_won_with_g2_usd', label: 'Total $ Won with G2 (USD)', type: 'number', section: 'Aggregations', sectionNumber: 10, availability: 'pa_customers', defaultVisible: false, formatter: 'currency' },
  { key: 'g2_avg_days_to_close_g2_deals', label: 'Avg Days to Close (G2 deals)', type: 'number', section: 'Aggregations', sectionNumber: 10, availability: 'pa_customers', defaultVisible: false, formatter: 'number' },
  // Meeting-booked rollups: pulled today on every sync via search_deals.rb but only used internally. Highest-leverage attribution gap per ROI-Dashboard-Q1-OnePager.md.
  { key: 'g2_g2_influenced_meetings_count', label: 'G2-Influenced Meetings Count', type: 'number', section: 'Aggregations', sectionNumber: 10, availability: 'pa_customers', defaultVisible: false, formatter: 'number' },
  { key: 'g2_last_g2_influenced_meeting_at', label: 'Last G2-Influenced Meeting At', type: 'datetime', section: 'Aggregations', sectionNumber: 10, availability: 'pa_customers', defaultVisible: false, formatter: 'datetime' },
  { key: 'g2_g2_influenced_meetings_by_source', label: 'G2-Influenced Meetings by Source', type: 'json', section: 'Aggregations', sectionNumber: 10, availability: 'pa_customers', defaultVisible: false, formatter: 'json' },
];

// Section ordering for the column picker
const SECTION_ORDER = [
  { number: 0, label: 'Identity (always shown)' },
  { number: 1, label: '1. Currently exposed (the 8 today)' },
  { number: 2, label: '2. Attribution & recency' },
  { number: 3, label: '3. Pageviews' },
  { number: 4, label: '4. Competitive' },
  { number: 5, label: '5. Firmographic' },
  { number: 6, label: '6. Visitor geographic detail' },
  { number: 7, label: '7. Deal influence' },
  { number: 8, label: '8. Signal events' },
  { number: 9, label: '9. Cross-integration parity (HubSpot is missing)' },
  { number: 10, label: '10. Account-level aggregations' },
];

// Availability legend
const AVAILABILITY = {
  exposed:       { label: 'Already exposed',                       chipClass: 'avail-exposed', short: '8' },
  synced_today:  { label: 'Synced today (universal)',              chipClass: 'avail-now',     short: 'Now' },
  needs_query:   { label: 'Needs query call',                      chipClass: 'avail-query',   short: 'Query' },
  pa_customers:  { label: 'Performance Analytics customers',       chipClass: 'avail-pa',      short: 'PA' },
};
