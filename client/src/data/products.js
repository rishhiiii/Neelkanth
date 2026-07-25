const p = (n) => `https://picsum.photos/seed/nk${n}/600/600`
const pw = (n) => `https://picsum.photos/seed/nkw${n}/1600/900`
const pp = (n) => `https://picsum.photos/seed/nkp${n}/600/800`
const pl = (n) => `https://picsum.photos/seed/nkl${n}/640/480`

export const products = [
  // Joint Care
  { id: 1, name: 'Mahanarayan Oil', price: 899, tag: 'Joint Care', image: p(1), packSize: '200ml bottle', form: 'oil', inStock: true },
  { id: 2, name: 'Yograj Guggulu', price: 449, tag: 'Joint Care', image: p(2), packSize: '60 tablets', form: 'tablet', inStock: true },
  { id: 3, name: 'Shallaki Tablets', price: 379, tag: 'Joint Care', image: p(3), packSize: '60 tablets', form: 'tablet', inStock: true },
  // Diabetes Care
  { id: 4, name: 'Karela Jamun Juice', price: 299, tag: 'Diabetes Care', image: p(4), packSize: '500ml bottle', form: 'syrup', inStock: true },
  { id: 5, name: 'Madhunashini Vati', price: 549, tag: 'Diabetes Care', image: p(5), packSize: '120 tablets', form: 'tablet', inStock: true },
  { id: 6, name: 'Neem Capsules', price: 349, tag: 'Diabetes Care', image: p(6), packSize: '60 capsules', form: 'capsule', inStock: true },
  // Immunity
  { id: 7, name: 'Chyawanprash Premium', price: 599, tag: 'Immunity', image: p(7), packSize: '500g jar', form: 'churna', inStock: true },
  { id: 8, name: 'Tulsi Drops', price: 279, tag: 'Immunity', image: p(8), packSize: '30ml dropper', form: 'syrup', inStock: true },
  { id: 9, name: 'Giloy Tablets', price: 399, tag: 'Immunity', image: p(9), packSize: '60 tablets', form: 'tablet', inStock: true },
  { id: 10, name: 'Amla Juice', price: 329, tag: 'Immunity', image: p(10), packSize: '500ml bottle', form: 'syrup', inStock: true },
  // Digestive Care
  { id: 11, name: 'Triphala Churna', price: 349, tag: 'Digestive Care', image: p(11), packSize: '200g powder', form: 'churna', inStock: true },
  { id: 12, name: 'Trikatu Churna', price: 249, tag: 'Digestive Care', image: p(12), packSize: '100g powder', form: 'churna', inStock: true },
  { id: 13, name: 'Hingwashtak Churna', price: 229, tag: 'Digestive Care', image: p(13), packSize: '100g powder', form: 'churna', inStock: true },
  // Hair Care
  { id: 14, name: 'Bhringraj Hair Oil', price: 349, tag: 'Hair Care', image: p(14), packSize: '200ml bottle', form: 'oil', inStock: true },
  { id: 15, name: 'Kesh Kanti Tablets', price: 499, tag: 'Hair Care', image: p(15), packSize: '60 tablets', form: 'tablet', inStock: true },
  { id: 16, name: 'Amla Hair Oil', price: 249, tag: 'Hair Care', image: p(16), packSize: '200ml bottle', form: 'oil', inStock: true },
  // Weight Management
  { id: 17, name: 'Medohar Guggulu', price: 429, tag: 'Weight Management', image: p(17), packSize: '60 tablets', form: 'tablet', inStock: true },
  { id: 18, name: 'Triphala Guggulu', price: 389, tag: 'Weight Management', image: p(18), packSize: '60 tablets', form: 'tablet', inStock: true },
  // Women's Health
  { id: 19, name: 'Shatavari Tablets', price: 459, tag: "Women's Health", image: p(19), packSize: '60 tablets', form: 'tablet', inStock: true },
  { id: 20, name: 'Ashokarishta', price: 329, tag: "Women's Health", image: p(20), packSize: '450ml bottle', form: 'syrup', inStock: true },
  { id: 21, name: 'Lodhra Churna', price: 279, tag: "Women's Health", image: p(21), packSize: '100g powder', form: 'churna', inStock: true },
  // Men's Health
  { id: 22, name: 'Ashwagandha Capsules', price: 599, tag: "Men's Health", image: p(22), packSize: '60 capsules', form: 'capsule', inStock: true },
  { id: 23, name: 'Shilajit Resin', price: 1499, tag: "Men's Health", image: p(23), packSize: '20g jar', form: 'other', inStock: true },
  { id: 24, name: 'Safed Musli Capsules', price: 799, tag: "Men's Health", image: p(24), packSize: '60 capsules', form: 'capsule', inStock: true },
  // Liver Care
  { id: 25, name: 'Kutki Capsules', price: 549, tag: 'Liver Care', image: p(25), packSize: '60 capsules', form: 'capsule', inStock: true },
  { id: 26, name: 'Arogyavardhini Vati', price: 349, tag: 'Liver Care', image: p(26), packSize: '60 tablets', form: 'tablet', inStock: true },
  { id: 27, name: 'Bhumyamalaki Tablets', price: 399, tag: 'Liver Care', image: p(27), packSize: '60 tablets', form: 'tablet', inStock: true },
  // Kidney Care
  { id: 28, name: 'Gokshuradi Guggulu', price: 429, tag: 'Kidney Care', image: p(28), packSize: '60 tablets', form: 'tablet', inStock: true },
  { id: 29, name: 'Punarnava Capsules', price: 379, tag: 'Kidney Care', image: p(29), packSize: '60 capsules', form: 'capsule', inStock: true },
  // Asthma Care
  { id: 30, name: 'Sitopaladi Churna', price: 199, tag: 'Asthma Care', image: p(30), packSize: '100g powder', form: 'churna', inStock: true },
  { id: 31, name: 'Vasavaleha', price: 349, tag: 'Asthma Care', image: p(31), packSize: '200g jar', form: 'churna', inStock: true },
  // Personal Care
  { id: 32, name: 'Kumkumadi Face Oil', price: 899, tag: 'Personal Care', image: p(32), packSize: '30ml bottle', form: 'oil', inStock: true },
  { id: 33, name: 'Neem Face Wash', price: 229, tag: 'Personal Care', image: p(33), packSize: '100ml tube', form: 'other', inStock: true },
  { id: 34, name: 'Aloe Vera Gel', price: 199, tag: 'Personal Care', image: p(34), packSize: '150ml tube', form: 'other', inStock: true },
  // Herbal Supplements
  { id: 35, name: 'Brahmi Vati Gold', price: 1250, tag: 'Herbal Supplements', image: p(35), packSize: '90 tablets', form: 'tablet', inStock: true },
  { id: 36, name: 'Moringa Leaf Powder', price: 289, tag: 'Herbal Supplements', image: p(36), packSize: '100g powder', form: 'powder', inStock: true },
  { id: 37, name: 'Ashwagandharishta', price: 599, tag: 'Herbal Supplements', image: p(37), packSize: '450ml bottle', form: 'syrup', inStock: true },
  { id: 38, name: 'Arjuna Heart Tonic', price: 459, tag: 'Herbal Supplements', image: p(38), packSize: '60 tablets', form: 'tablet', inStock: true },
  { id: 39, name: 'Ksheerabala 101', price: 1850, tag: 'Herbal Supplements', image: p(39), packSize: '200ml bottle', form: 'oil', inStock: true },
  { id: 40, name: 'Loha Asava Tonic', price: 425, tag: 'Herbal Supplements', image: p(40), packSize: '450ml bottle', form: 'syrup', inStock: true },
]

export const bestSellers = [products[0], products[7], products[22], products[10], products[6], products[35], products[14], products[23]]

export const healthConcerns = [
  { id: 1, name: 'Joint Pain', icon: 'bone', description: 'Traditional support for joint comfort and mobility.', image: p(51) },
  { id: 2, name: 'Diabetes', icon: 'activity', description: 'Herbs traditionally used to support healthy blood sugar.', image: p(52) },
  { id: 3, name: 'Immunity', icon: 'shield', description: 'Strengthen your natural defenses with potent bio-available extracts.', image: p(53) },
  { id: 4, name: 'Digestion', icon: 'apple', description: 'Promote healthy digestion and gut wellness.', image: p(54) },
  { id: 5, name: 'Hair Care', icon: 'sparkles', description: 'Nourish hair from root to tip with herbal formulations.', image: p(55) },
]

export const formulationTypes = [
  { id: 1, name: 'Churnas', sub: 'Fine Herbal Powders', image: pp(1) },
  { id: 2, name: 'Tablets', sub: 'Modern Formulations', image: pp(2) },
  { id: 3, name: 'Oils', sub: 'Medicinal Extracts', image: pp(3) },
  { id: 4, name: 'Tonics', sub: 'Liquid Remedies', image: pp(4) },
]

export const certifications = [
  { id: 1, name: 'Ministry of AYUSH', short: 'AYUSH' },
  { id: 2, name: 'GMP Certified', short: 'GMP' },
  { id: 3, name: 'ISO 9001:2015', short: 'ISO' },
]

export const trustFeatures = [
  { id: 1, icon: 'truck', title: 'Free Shipping', desc: 'On orders above ₹1000' },
  { id: 2, icon: 'wallet', title: 'Cash on Delivery', desc: 'Available nationwide' },
  { id: 3, icon: 'shield', title: 'AYUSH Certified', desc: 'Quality assured' },
  { id: 4, icon: 'lock', title: 'Secure Payment', desc: '100% encrypted' },
]

export const heroData = {
  eyebrow: 'Medicinal Grade Heritage',
  title: 'Authentic Ayurveda for\nModern Wellness',
  description: 'Time-tested remedies crafted with botanical precision and clinical integrity. Bridging ancient wisdom with modern medical standards.',
  cta: 'Shop All Medicines',
  image: pw(1),
}

export const testimonials = [
  { id: 1, name: 'Priya Sharma', role: 'Verified Buyer', rating: 5, text: 'The Ashwagandha capsules completely transformed my sleep and energy levels. After just two weeks, I felt more calm and focused.', avatar: p(61) },
  { id: 2, name: 'Rahul Verma', role: 'Verified Buyer', rating: 5, text: 'Fast delivery, beautiful packaging and the quality is unmatched. The Chyawanprash tastes just like what my grandmother used to make.', avatar: p(62) },
  { id: 3, name: 'Ananya Iyer', role: 'Verified Buyer', rating: 5, text: 'I have been using Triphala and Trikatu for three months now. The difference in my digestion is remarkable.', avatar: p(63) },
  { id: 4, name: 'Dr. Vikram Patel', role: 'Ayurveda Practitioner', rating: 5, text: 'Neelkanth products are of exceptional quality — genuine herbs, proper processing, and effective formulations.', avatar: p(64) },
]

export const stats = [
  { id: 1, value: '50K+', label: 'Happy Customers' },
  { id: 2, value: '120+', label: 'Herbal Products' },
  { id: 3, value: '15+', label: 'Years of Trust' },
  { id: 4, value: '100%', label: 'Natural & Pure' },
]

export const blogs = [
  { id: 1, title: 'Benefits of Ashwagandha for Modern Life', desc: 'Discover how this ancient adaptogen helps combat stress and improve sleep quality.', date: 'July 12, 2026', image: pl(1), readTime: '5 min read' },
  { id: 2, title: 'Your Daily Ayurvedic Morning Routine', desc: 'Transform your mornings with oil pulling, tongue scraping, and other Dinacharya practices.', date: 'July 04, 2026', image: pl(2), readTime: '7 min read' },
  { id: 3, title: 'Seasonal Detox: A Panchakarma Guide', desc: 'Learn gentle, at-home Ayurvedic cleansing practices aligned with each season.', date: 'June 28, 2026', image: pl(3), readTime: '8 min read' },
]

export const categories = [
  { id: 1, name: 'Joint Care', count: 3, image: p(41) },
  { id: 2, name: 'Diabetes Care', count: 3, image: p(42) },
  { id: 3, name: 'Immunity', count: 4, image: p(43) },
  { id: 4, name: 'Digestive Care', count: 3, image: p(44) },
  { id: 5, name: 'Hair Care', count: 3, image: p(45) },
  { id: 6, name: 'Weight Management', count: 2, image: p(46) },
  { id: 7, name: "Women's Health", count: 3, image: p(47) },
  { id: 8, name: "Men's Health", count: 3, image: p(48) },
  { id: 9, name: 'Liver Care', count: 3, image: p(49) },
  { id: 10, name: 'Kidney Care', count: 2, image: p(50) },
  { id: 11, name: 'Asthma Care', count: 2, image: p(56) },
  { id: 12, name: 'Personal Care', count: 3, image: p(57) },
  { id: 13, name: 'Herbal Supplements', count: 6, image: p(58) },
]
