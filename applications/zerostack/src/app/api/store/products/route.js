import sql from '../../utils/sql.js';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const appId = url.searchParams.get('app_id') || 1; // Default to first store app
    const limit = Math.min(parseInt(url.searchParams.get('limit'), 10) || 20, 100);
    const offset = parseInt(url.searchParams.get('offset'), 10) || 0;
    const search = url.searchParams.get('search') || '';

    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price_cents,
        p.currency,
        p.image_url,
        p.inventory_count,
        p.is_active,
        p.created_at,
        p.updated_at,
        COUNT(v.id) as variant_count
      FROM store_products p
      LEFT JOIN store_variants v ON v.product_id = p.id
      WHERE p.app_id = $1
    `;

    const params = [appId];

    if (search) {
      query += ` AND (LOWER(p.name) LIKE LOWER($${params.length + 1}) OR LOWER(p.description) LIKE LOWER($${params.length + 1}))`;
      params.push(`%${search}%`);
    }

    query += ` 
      GROUP BY p.id, p.name, p.description, p.price_cents, p.currency, p.image_url, p.inventory_count, p.is_active, p.created_at, p.updated_at
      ORDER BY p.created_at DESC 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);

    const products = await sql(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM store_products WHERE app_id = $1';
    const countParams = [appId];

    if (search) {
      countQuery += ` AND (LOWER(name) LIKE LOWER($2) OR LOWER(description) LIKE LOWER($2))`;
      countParams.push(`%${search}%`);
    }

    const totalResult = await sql(countQuery, countParams);
    const total = parseInt(totalResult[0].count, 10);

    return Response.json({
      products: products.map((p) => ({
        ...p,
        price_dollars: (p.price_cents / 100).toFixed(2),
        variant_count: parseInt(p.variant_count),
      })),
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Get store products error:', error);
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      app_id = 1,
      name,
      description,
      price_cents,
      currency = 'usd',
      image_url,
      inventory_count = 0,
    } = body;

    // Basic validation
    if (!name || !price_cents) {
      return Response.json({ error: 'Name and price are required' }, { status: 400 });
    }

    if (price_cents < 0) {
      return Response.json({ error: 'Price must be positive' }, { status: 400 });
    }

    // Verify app exists and is a store app
    const app = await sql`
      SELECT id, blueprint FROM apps 
      WHERE id = ${app_id} AND blueprint = 'store'
    `;

    if (app.length === 0) {
      return Response.json({ error: 'Store app not found' }, { status: 404 });
    }

    // Create product
    const product = await sql`
      INSERT INTO store_products (
        app_id, name, description, price_cents, currency, image_url, inventory_count
      )
      VALUES (
        ${app_id}, ${name}, ${description}, ${price_cents}, ${currency}, ${image_url}, ${inventory_count}
      )
      RETURNING 
        id, name, description, price_cents, currency, image_url, 
        inventory_count, is_active, created_at, updated_at
    `;

    const newProduct = product[0];

    // Log event
    await sql`
      INSERT INTO events (app_id, event_type, metadata)
      VALUES (${app_id}, 'product_created', ${JSON.stringify({ product_name: name, price_cents })})
    `;

    return Response.json({
      product: {
        ...newProduct,
        price_dollars: (newProduct.price_cents / 100).toFixed(2),
        variant_count: 0,
      },
    });
  } catch (error) {
    console.error('Create store product error:', error);
    return Response.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
