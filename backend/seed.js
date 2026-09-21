const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/e_commerce';

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing if any
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Categories
    const categories = [
      { id: 1, name: 'Ergonomic Furniture', description: 'High quality ergonomic chairs and workstations.' },
      { id: 2, name: 'Office Tech & Gadgets', description: 'Smart gadgets and productivity tools.' },
      { id: 3, name: 'Lighting & Ambiance', description: 'Premium lighting fixtures and ambient lamps.' },
      { id: 4, name: 'Desk Accessories', description: 'Organizers, mousepads, and desk pads.' }
    ];
    await Category.insertMany(categories);

    // Products
    const products = [
      {
        category_id: 1,
        category_name: 'Ergonomic Furniture',
        name: 'ProErgo Executive Mesh Chair',
        short_description: 'Breathable mesh chair with 3D lumbar support and adjustable armrests.',
        description: 'Engineered for all-day comfort, the ProErgo Executive Mesh Chair features dynamic lumbar support, breathable Korean mesh, 4D adjustable armrests, and a 135-degree recline mechanism with tilt lock.',
        price: 14999,
        image_url: 'https://images.unsplash.com/photo-1580481077195-c9a9103c8091?auto=format&fit=crop&w=800&q=80',
        stock_status: 'In Stock',
        specifications: 'Material: Breathable Mesh | Max Weight: 150 kg | Warranty: 3 Years | Color: Charcoal Gray',
        featured: 1
      },
      {
        category_id: 1,
        category_name: 'Ergonomic Furniture',
        name: 'Apex Motorized Standing Desk',
        short_description: 'Dual-motor height adjustable desk with 4 memory presets.',
        description: 'The Apex Standing Desk is crafted from solid sustainable hardwood and powered by dual ultra-quiet motors. Supports seamless transition from sitting to standing with digital LED control.',
        price: 28499,
        image_url: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80',
        stock_status: 'In Stock',
        specifications: 'Height Range: 65cm - 125cm | Tabletop: 140x70cm Walnut | Motor: Dual Ultra-quiet | Load: 120 kg',
        featured: 1
      },
      {
        category_id: 2,
        category_name: 'Office Tech & Gadgets',
        name: 'UltraWide Monitor Arm Mount',
        short_description: 'Heavy-duty gas spring arm for 17" to 38" screens.',
        description: 'Free up desk space with precision counterbalance gas-spring movement. Features 360-degree rotation, 90-degree swivel, and built-in cable management channels.',
        price: 3499,
        image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        stock_status: 'In Stock',
        specifications: 'Screen Support: 17"-38" | Weight Capacity: Up to 12 kg | VESA: 75x75, 100x100 | Tilt: -45° to +90°',
        featured: 1
      },
      {
        category_id: 3,
        category_name: 'Lighting & Ambiance',
        name: 'Lumina Smart Desk Lamp Pro',
        short_description: 'Eye-care LED desk lamp with auto-dimming and wireless charging base.',
        description: 'Designed to protect your eyes during long working hours. Features full spectrum CRI > 95 LEDs, step-less color temperature tuning (2700K-6500K), and integrated 15W Qi wireless charger.',
        price: 2499,
        image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        stock_status: 'In Stock',
        specifications: 'Color Temp: 2700K - 6500K | CRI: Ra > 95 | Wireless Charging: 15W Qi Fast Charge | Power: 18W USB-C',
        featured: 1
      },
      {
        category_id: 4,
        category_name: 'Desk Accessories',
        name: 'Felt & Cork Desk Mat (Large)',
        short_description: 'Water-resistant eco-friendly desk pad for keyboard & mouse.',
        description: 'Crafted from premium merino wool felt with natural non-slip cork base. Protects your desk surface while providing a smooth glide for optical mice and comfortable wrist support.',
        price: 899,
        image_url: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80',
        stock_status: 'In Stock',
        specifications: 'Dimensions: 900mm x 400mm x 4mm | Material: Wool Felt + Organic Cork | Water Resistant: Yes',
        featured: 0
      },
      {
        category_id: 2,
        category_name: 'Office Tech & Gadgets',
        name: 'StreamCast 4K Ultra HD Webcam',
        short_description: 'AI noise-canceling dual microphones with auto-focus HDR.',
        description: 'Crisp 4K 60fps video quality for conference calls, streaming, and remote collaboration. Includes physical privacy shutter and magnetic monitor mount.',
        price: 6799,
        image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        stock_status: 'In Stock',
        specifications: 'Resolution: 4K 30fps / 1080p 60fps | Field of View: 90° | Mic: Dual Stereo Noise-Canceling | Connection: USB-C Plug & Play',
        featured: 0
      },
      {
        category_id: 4,
        category_name: 'Desk Accessories',
        name: 'Solid Walnut Headphone Stand',
        short_description: 'Handcrafted solid wood headphone display stand with brass accents.',
        description: 'Keep your workspace tidy and your headphones in top shape. Designed with a curved top to preserve headphone headband shape.',
        price: 1299,
        image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
        stock_status: 'In Stock',
        specifications: 'Material: Solid American Walnut + Matte Brass | Weight: 450g | Base: Non-scratch silicone feet',
        featured: 0
      },
      {
        category_id: 3,
        category_name: 'Lighting & Ambiance',
        name: 'ScreenBar Monitor Light Bar',
        short_description: 'Asymmetric optical design screen lamp with touch controls.',
        description: 'Illuminates the desk area without causing glare or reflections on your computer screen. Saves precious desktop space by mounting securely on top of any monitor.',
        price: 3199,
        image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        stock_status: 'In Stock',
        specifications: 'Mounting: Universal Clip (1-3cm thickness) | Color Temp: 3000K-6000K | Powered by: 5V 1A USB | Auto Dimming: Yes',
        featured: 1
      }
    ];

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products into MongoDB e_commerce database!`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedData();
